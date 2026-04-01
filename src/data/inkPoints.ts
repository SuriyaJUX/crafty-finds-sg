import type { TierName } from "@/context/AuthContext";

// ── Redemption rate ─────────────────────────────────────────────────────────

/** Points required to redeem SGD 1.00 */
export const REDEMPTION_RATE = 200;

// ── Earn rates ──────────────────────────────────────────────────────────────

export const EARN_RATES = {
  /** 1 point per SGD 1 spent (before tier multiplier) */
  purchase: 1,
  /** Base daily login points, multiplied by current streak day (capped at 100) */
  dailyLogin: 10,
  /** Standard text review */
  review: 50,
  /** Review with attached photo */
  photoReview: 75,
  /** Answering a community Q&A question */
  qaAnswer: 30,
  /** Bonus when a wishlisted item is purchased */
  wishlistPurchase: 20,
  /** Referee completes their first purchase via referral link */
  referralComplete: 150,
  /** First time using image search feature */
  imageSearchFirstUse: 25,
  /** Completing a full Creative Path */
  creativePathComplete: 100,
  /** Very first purchase on the account */
  firstPurchase: 200,
} as const;

// ── Tier definitions ────────────────────────────────────────────────────────

export interface TierData {
  name: TierName;
  minLifetime: number;
  maxLifetime: number;
  earnMultiplier: number;
  /** Brand hex colour for UI accents */
  color: string;
  /** Short badge label shown in UI */
  badge: string;
  benefits: string[];
  /** Days of early access to new product arrivals */
  earlyAccessDays: number;
}

export const TIERS: TierData[] = [
  {
    name: "sketcher",
    minLifetime: 0,
    maxLifetime: 499,
    earnMultiplier: 1.0,
    color: "#94a3b8",
    badge: "Sketcher",
    benefits: [
      "1 pt earned per S$1 spent",
      "Access to member-only deals",
      "Birthday bonus points",
    ],
    earlyAccessDays: 0,
  },
  {
    name: "inker",
    minLifetime: 500,
    maxLifetime: 1499,
    earnMultiplier: 1.0,
    color: "#6366f1",
    badge: "Inker",
    benefits: [
      "All Sketcher benefits",
      "Free shipping on orders above S$40",
      "Priority customer support",
      "1-day early access to new arrivals",
    ],
    earlyAccessDays: 1,
  },
  {
    name: "illustrator",
    minLifetime: 1500,
    maxLifetime: 3999,
    earnMultiplier: 1.05,
    color: "#f59e0b",
    badge: "Illustrator",
    benefits: [
      "All Inker benefits",
      "5% earn multiplier on every purchase",
      "Free gift wrapping on every order",
      "3-day early access to new arrivals",
      "Exclusive seasonal collections",
    ],
    earlyAccessDays: 3,
  },
  {
    name: "artisan",
    minLifetime: 4000,
    maxLifetime: Infinity,
    earnMultiplier: 1.08,
    color: "#10b981",
    badge: "Artisan",
    benefits: [
      "All Illustrator benefits",
      "8% earn multiplier on every purchase",
      "Dedicated account manager",
      "7-day early access to new arrivals",
      "Annual curated gift hamper",
      "Invitations to exclusive workshops",
    ],
    earlyAccessDays: 7,
  },
];

// ── Seasonal challenges ─────────────────────────────────────────────────────

export interface SeasonalChallenge {
  id: string;
  title: string;
  description: string;
  /** Product category this challenge applies to, or null for all categories */
  categoryFilter: string | null;
  multiplier: number;
  endDate: string;
  isActive: boolean;
}

export const SEASONAL_CHALLENGES: SeasonalChallenge[] = [
  {
    id: "spring-stationery-sprint",
    title: "Spring Stationery Sprint",
    description: "Earn 2× points on all notebook purchases this month",
    categoryFilter: "notebooks",
    multiplier: 2.0,
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "review-rush",
    title: "Review Rush",
    description: "Earn 1.5× points for every review submitted this week",
    categoryFilter: null,
    multiplier: 1.5,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];
