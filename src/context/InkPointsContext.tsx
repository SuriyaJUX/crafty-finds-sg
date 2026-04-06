import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth, getTier } from "@/context/AuthContext";
import type { PointsBatch, TierName } from "@/context/AuthContext";
import {
  EARN_RATES,
  TIERS,
  SEASONAL_CHALLENGES,
} from "@/data/inkPoints";
import type { TierData, SeasonalChallenge } from "@/data/inkPoints";

// ── Context type ────────────────────────────────────────────────────────────

interface InkPointsContextType {
  /** Raw earn-rate constants */
  earnRates: typeof EARN_RATES;
  /** Full tier definition array */
  tiers: typeof TIERS;
  /** Seasonal challenges that are currently active and not yet expired */
  activeChallenges: SeasonalChallenge[];
  /** Full TierData for the authenticated user's current creative tier */
  currentTier: TierData;
  /** Benefit strings for the current tier (convenience shorthand) */
  tierBenefits: string[];
  /**
   * Award points to the user.
   * Applies tier multiplier and any matching seasonal challenge multipliers.
   * Also updates relevant creativeStats fields based on `source`.
   *
   * @param amount  Base point amount (before multipliers)
   * @param source  Key matching an EARN_RATES key or a descriptive string
   * @param productId  Optional product ID for context / future use
   * @param category  Optional product category — used to match seasonal challenges
   */
  earnPoints: (amount: number, source: string, productId?: string, category?: string) => void;
  /**
   * Deduct points from the spendable balance without affecting lifetime total.
   * Returns false if the user has insufficient points.
   */
  redeemPoints: (amount: number) => boolean;
  /**
   * Returns all unexpired point batches expiring within `daysAhead` days.
   */
  getExpiringPoints: (daysAhead: number) => PointsBatch[];
  /**
   * Increments the login streak, awards the scaled daily-login points,
   * and returns the number of points earned.
   * Call once per session after login.
   */
  checkAndUpdateStreak: () => number;
  /**
   * Returns the new TierName if the user's lifetimePoints just crossed
   * a tier threshold, otherwise null.
   */
  checkTierUpgrade: () => TierName | null;
  /** True after a tier upgrade is detected; cleared by calling clearNewTier(). */
  isNewTier: boolean;
  clearNewTier: () => void;
}

// ── Context ─────────────────────────────────────────────────────────────────

const InkPointsContext = createContext<InkPointsContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export const InkPointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addPoints, patchUser } = useAuth();
  const [isNewTier, setIsNewTier] = useState(false);
  const prevTierRef = useRef<TierName | undefined>(undefined);

  // Detect tier upgrade whenever user.tier changes
  useEffect(() => {
    const current = user?.tier;
    if (!current) return;
    if (prevTierRef.current !== undefined && prevTierRef.current !== current) {
      setIsNewTier(true);
    }
    prevTierRef.current = current;
  }, [user?.tier]);

  // Challenges that are still active and whose end date hasn't passed
  const activeChallenges = SEASONAL_CHALLENGES.filter(
    c => c.isActive && new Date(c.endDate) > new Date(),
  );

  // Current creative tier data
  const currentTier: TierData =
    TIERS.find(t => t.name === (user?.tier ?? "scribe")) ?? TIERS[0];

  // ── earnPoints ─────────────────────────────────────────────────────────────

  const earnPoints = useCallback(
    (amount: number, source: string, productId?: string, category?: string) => {
      if (!user) return;

      // 1. Tier multiplier
      const tierMultiplier = currentTier.earnMultiplier;

      // 2. Seasonal challenge multipliers (stack multiplicatively)
      const challengeMultiplier = activeChallenges.reduce((acc, c) => {
        const matchesCategory =
          !c.categoryFilter ||
          (category ? category === c.categoryFilter : source.includes(c.categoryFilter));
        return matchesCategory ? acc * c.multiplier : acc;
      }, 1.0);

      const finalAmount = Math.floor(amount * tierMultiplier * challengeMultiplier);
      if (finalAmount <= 0) return;

      // 3. Update creativeStats
      patchUser(prev => {
        const stats = { ...prev.creativeStats };
        if (source === "review" || source === "photoReview") {
          stats.reviewsWritten = (stats.reviewsWritten ?? 0) + 1;
        }
        if (source === "qaAnswer") {
          stats.questionsAnswered = (stats.questionsAnswered ?? 0) + 1;
        }
        if (source === "purchase" || source === "firstPurchase") {
          stats.totalPurchases = (stats.totalPurchases ?? 0) + 1;
        }
        return { ...prev, creativeStats: stats };
      });

      // 4. Award the points (label derives from source)
      const label =
        source === "purchase"            ? `Purchase reward${productId ? ` — ${productId}` : ""}` :
        source === "firstPurchase"        ? "First purchase bonus" :
        source === "review"               ? "Review submitted" :
        source === "photoReview"          ? "Photo review submitted" :
        source === "qaAnswer"             ? "Q&A answer reward" :
        source === "dailyLogin"           ? "Daily login reward" :
        source === "referralComplete"     ? "Referral bonus" :
        source === "imageSearchFirstUse"  ? "Image search — first use bonus" :
        source === "creativePathComplete" ? "Creative path completed" :
        source === "wishlistPurchase"     ? "Wishlist purchase bonus" :
        `${source} reward`;

      addPoints(finalAmount, label, "star", source);
    },
    [user, currentTier, activeChallenges, addPoints, patchUser],
  );

  // ── redeemPoints ───────────────────────────────────────────────────────────

  const redeemPoints = useCallback(
    (amount: number): boolean => {
      if (!user || user.loyaltyPoints < amount) return false;
      patchUser(prev => ({
        ...prev,
        loyaltyPoints: prev.loyaltyPoints - amount,
        tierProgress:  Math.max(0, (prev.tierProgress ?? 0) - amount),
      }));
      return true;
    },
    [user, patchUser],
  );

  // ── getExpiringPoints ──────────────────────────────────────────────────────

  const getExpiringPoints = useCallback(
    (daysAhead: number): PointsBatch[] => {
      if (!user?.pointsBatches) return [];
      const cutoff = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
      return user.pointsBatches.filter(b => new Date(b.expiresAt) <= cutoff);
    },
    [user],
  );

  // ── checkAndUpdateStreak ───────────────────────────────────────────────────

  const checkAndUpdateStreak = useCallback((): number => {
    if (!user) return 0;

    // Only award once per calendar day
    const today = new Date().toISOString().slice(0, 10);
    const lastAwarded = localStorage.getItem("lastLoginAwardDate");
    if (lastAwarded === today) return 0;
    localStorage.setItem("lastLoginAwardDate", today);

    const newStreak    = (user.currentStreak ?? 0) + 1;
    const longestStreak = Math.max(user.longestStreak ?? 0, newStreak);
    // Cap daily login bonus at 100 pts
    const streakPoints = Math.min(EARN_RATES.dailyLogin * newStreak, 100);

    patchUser(prev => ({
      ...prev,
      currentStreak: newStreak,
      longestStreak,
    }));

    addPoints(
      streakPoints,
      `Daily login streak (day ${newStreak})`,
      "log-in",
      "dailyLogin",
    );

    return streakPoints;
  }, [user, addPoints, patchUser]);

  // ── checkTierUpgrade ──────────────────────────────────────────────────────
  // addPoints() already auto-updates user.tier via getTier(newLifetime).
  // This function lets callers programmatically check whether the current
  // lifetimePoints value implies a different (higher) tier than stored.

  const checkTierUpgrade = useCallback((): TierName | null => {
    if (!user) return null;
    const computed = getTier(user.lifetimePoints ?? 0);
    return computed !== user.tier ? computed : null;
  }, [user]);

  const clearNewTier = useCallback(() => setIsNewTier(false), []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <InkPointsContext.Provider
      value={{
        earnRates: EARN_RATES,
        tiers: TIERS,
        activeChallenges,
        currentTier,
        tierBenefits: currentTier.benefits,
        earnPoints,
        redeemPoints,
        getExpiringPoints,
        checkAndUpdateStreak,
        checkTierUpgrade,
        isNewTier,
        clearNewTier,
      }}
    >
      {children}
    </InkPointsContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────

export const useInkPoints = () => {
  const ctx = useContext(InkPointsContext);
  if (!ctx) throw new Error("useInkPoints must be used within InkPointsProvider");
  return ctx;
};
