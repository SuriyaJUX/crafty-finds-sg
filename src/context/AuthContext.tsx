import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface LoyaltyPointEntry {
  id: string;
  label: string;
  points: number;
  date: string;
  icon: "gift" | "log-in" | "star" | "shopping-bag" | "heart";
}

export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarInitials: string;
  memberSince: string;
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  tierProgress: number; // points needed for next tier
  tierThreshold: number; // total points for next tier
  pointsHistory: LoyaltyPointEntry[];
  orderHistory: OrderHistoryItem[];
  addresses: SavedAddress[];
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  postalCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: OrderHistoryItem) => void;
  addPoints: (points: number, label: string, icon: LoyaltyPointEntry["icon"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "paperly_auth";

const createRachelNg = (): MockUser => {
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  return {
    id: "user-rachel-ng-001",
    username: "RachelNg",
    displayName: "Rachel Ng",
    email: "rachel.ng@email.com",
    avatarInitials: "RN",
    memberSince: twoWeeksAgo.toISOString(),
    loyaltyPoints: 65,
    loyaltyTier: "Bronze",
    tierProgress: 65,
    tierThreshold: 200,
    pointsHistory: [
      {
        id: "lp-1",
        label: "Welcome bonus — thanks for joining Paperly!",
        points: 50,
        date: twoWeeksAgo.toISOString(),
        icon: "gift",
      },
      {
        id: "lp-2",
        label: "First login reward",
        points: 10,
        date: twoWeeksAgo.toISOString(),
        icon: "log-in",
      },
      {
        id: "lp-3",
        label: "Daily login streak (3 days)",
        points: 5,
        date: threeDaysAgo.toISOString(),
        icon: "star",
      },
    ],
    orderHistory: [],
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        line1: "Blk 123 Bishan Street 12",
        line2: "#08-456",
        postalCode: "570123",
        isDefault: true,
      },
    ],
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    // Mock: always succeeds, loads RachelNg
    const rachel = createRachelNg();
    setUser(rachel);
    return true;
  }, []);

  const signup = useCallback(async (_email: string, _password: string, displayName: string): Promise<boolean> => {
    const rachel = createRachelNg();
    rachel.displayName = displayName || rachel.displayName;
    setUser(rachel);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addOrder = useCallback((order: OrderHistoryItem) => {
    setUser(prev => prev ? { ...prev, orderHistory: [order, ...prev.orderHistory] } : prev);
  }, []);

  const addPoints = useCallback((points: number, label: string, icon: LoyaltyPointEntry["icon"]) => {
    setUser(prev => {
      if (!prev) return prev;
      const newTotal = prev.loyaltyPoints + points;
      const tier =
        newTotal >= 1000 ? "Platinum" :
        newTotal >= 500  ? "Gold"     :
        newTotal >= 200  ? "Silver"   : "Bronze";
      const tierThreshold =
        tier === "Bronze"   ? 200  :
        tier === "Silver"   ? 500  :
        tier === "Gold"     ? 1000 : Infinity;
      const entry: LoyaltyPointEntry = {
        id: `lp-${Date.now()}`,
        label,
        points,
        date: new Date().toISOString(),
        icon,
      };
      return {
        ...prev,
        loyaltyPoints: newTotal,
        loyaltyTier: tier,
        tierProgress: newTotal,
        tierThreshold,
        pointsHistory: [entry, ...prev.pointsHistory],
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, addOrder, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
