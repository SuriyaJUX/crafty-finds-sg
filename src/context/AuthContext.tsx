import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── Tier types & helpers ────────────────────────────────────────────────────

export type TierName = "sketcher" | "scribe" | "creator" | "artisan";

export function getTier(lifetimePoints: number): TierName {
  if (lifetimePoints >= 4000) return "artisan";
  if (lifetimePoints >= 1500) return "illustrator";
  if (lifetimePoints >= 500)  return "inker";
  return "sketcher";
}

const TIER_MULTIPLIERS: Record<TierName, number> = {
  sketcher:    1.0,
  inker:       1.0,
  illustrator: 1.05,
  artisan:     1.08,
};

export function calculatePointsEarned(orderTotal: number, tier: TierName | string): number {
  const multiplier = TIER_MULTIPLIERS[tier as TierName] ?? 1.0;
  return Math.floor(orderTotal * multiplier);
}

// ── Data interfaces ─────────────────────────────────────────────────────────

export interface LoyaltyPointEntry {
  id: string;
  label: string;
  points: number;
  date: string;
  icon: "gift" | "log-in" | "star" | "shopping-bag" | "heart";
}

export interface PointsBatch {
  amount: number;
  earnedAt: string;
  expiresAt: string;
  source: string;
}

export interface CreativeStats {
  totalPurchases: number;
  pathsExplored: string[];
  reviewsWritten: number;
  questionsAnswered: number;
  favouriteCategory: string;
}

export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarInitials: string;
  memberSince: string;
  // Spendable / display balance
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  tierProgress: number;
  tierThreshold: number;
  pointsHistory: LoyaltyPointEntry[];
  // Creative tier (based on lifetime earnings)
  lifetimePoints: number;
  currentStreak: number;
  longestStreak: number;
  tier: TierName;
  pointsBatches: PointsBatch[];
  creativeStats: CreativeStats;
  pointsGoal: { targetAmount: number; targetProductId: string } | null;
  // Other
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

// ── Context type ────────────────────────────────────────────────────────────

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: OrderHistoryItem) => void;
  addPoints: (points: number, label: string, icon: LoyaltyPointEntry["icon"], source?: string) => void;
  patchUser: (updater: (prev: MockUser) => MockUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Seed data ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "note_gale_auth";

const createRachelNg = (): MockUser => {
  const now = new Date();
  const sixMonthsOut  = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  const fiveMonthsOut = new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000);
  const twoMonthsOut  = new Date(now.getTime() +  60 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo   = new Date(now.getTime() -  14 * 24 * 60 * 60 * 1000);
  const oneWeekAgo    = new Date(now.getTime() -   7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo  = new Date(now.getTime() -   3 * 24 * 60 * 60 * 1000);
  const yesterday     = new Date(now.getTime() -   1 * 24 * 60 * 60 * 1000);

  return {
    id: "user-rachel-ng-001",
    username: "RachelNg",
    displayName: "Rachel Ng",
    email: "rachel.ng@email.com",
    avatarInitials: "RN",
    memberSince: twoWeeksAgo.toISOString(),

    // Spendable balance
    loyaltyPoints: 340,
    loyaltyTier: "Silver",
    tierProgress: 340,
    tierThreshold: 500,

    // Lifetime / creative tier
    lifetimePoints: 1240,
    currentStreak: 7,
    longestStreak: 12,
    tier: "inker",   // getTier(1240) = "inker"

    pointsBatches: [
      {
        amount: 420,
        earnedAt: twoWeeksAgo.toISOString(),
        expiresAt: sixMonthsOut.toISOString(),
        source: "purchase",
      },
      {
        amount: 120,
        earnedAt: oneWeekAgo.toISOString(),
        expiresAt: fiveMonthsOut.toISOString(),
        source: "purchase",
      },
      {
        amount: 70,
        earnedAt: threeDaysAgo.toISOString(),
        expiresAt: twoMonthsOut.toISOString(),
        source: "dailyLogin",
      },
    ],

    creativeStats: {
      totalPurchases: 4,
      pathsExplored: ["journalling", "illustration"],
      reviewsWritten: 2,
      questionsAnswered: 1,
      favouriteCategory: "notebooks",
    },

    pointsGoal: null,

    pointsHistory: [
      {
        id: "lp-1",
        label: "Welcome bonus — thanks for joining Note & Gale!",
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
        label: "Purchase — Hobonichi Weeks Planner",
        points: 420,
        date: twoWeeksAgo.toISOString(),
        icon: "shopping-bag",
      },
      {
        id: "lp-4",
        label: "Purchase — Tomoe River A5 Notebook × 2",
        points: 120,
        date: oneWeekAgo.toISOString(),
        icon: "shopping-bag",
      },
      {
        id: "lp-5",
        label: "Review — Tomoe River A5 Notebook · photo bonus",
        points: 75,
        date: threeDaysAgo.toISOString(),
        icon: "star",
      },
      {
        id: "lp-6",
        label: "Review — Hobonichi Weeks Planner · detailed review bonus",
        points: 50,
        date: threeDaysAgo.toISOString(),
        icon: "star",
      },
      {
        id: "lp-7",
        label: "Daily login streak (day 7)",
        points: 70,
        date: yesterday.toISOString(),
        icon: "log-in",
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

// ── Provider ────────────────────────────────────────────────────────────────

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

  const addPoints = useCallback((
    points: number,
    label: string,
    icon: LoyaltyPointEntry["icon"],
    source = "other",
  ) => {
    setUser(prev => {
      if (!prev) return prev;

      const newSpendable  = prev.loyaltyPoints + points;
      const newLifetime   = (prev.lifetimePoints ?? 0) + points;

      // Spendable-balance tier (Bronze → Platinum)
      const loyaltyTier =
        newSpendable >= 1000 ? "Platinum" :
        newSpendable >= 500  ? "Gold"     :
        newSpendable >= 200  ? "Silver"   : "Bronze";

      const loyaltyThreshold =
        loyaltyTier === "Bronze"   ? 200  :
        loyaltyTier === "Silver"   ? 500  :
        loyaltyTier === "Gold"     ? 1000 : Infinity;

      // Creative tier (based on lifetime points)
      const creativeTier = getTier(newLifetime);

      // New points batch (expires 6 months from now)
      const newBatch: PointsBatch = {
        amount: points,
        earnedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        source,
      };

      const entry: LoyaltyPointEntry = {
        id: `lp-${Date.now()}`,
        label,
        points,
        date: new Date().toISOString(),
        icon,
      };

      return {
        ...prev,
        loyaltyPoints:  newSpendable,
        lifetimePoints: newLifetime,
        loyaltyTier,
        tier: creativeTier,
        tierProgress:   newSpendable,
        tierThreshold:  loyaltyThreshold,
        pointsHistory:  [entry, ...prev.pointsHistory],
        pointsBatches:  [newBatch, ...(prev.pointsBatches ?? [])],
      };
    });
  }, []);

  const patchUser = useCallback((updater: (prev: MockUser) => MockUser) => {
    setUser(prev => prev ? updater(prev) : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      addOrder,
      addPoints,
      patchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
