import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { useCart } from "@/context/CartContext";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import {
  Gift, LogIn, Star, ShoppingBag, Heart, MapPin,
  ChevronRight, Package, CheckCircle2, Truck, Clock, XCircle,
  Sparkles, Camera, Calendar, MessageCircle, Users, Flame,
  Target, Search, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, subDays, isSameDay } from "date-fns";
import { products } from "@/data/products";
import { getSubmittedReviews } from "@/components/WriteReviewModal";
import type { MockUser, PointsBatch } from "@/context/AuthContext";
import type { TierData } from "@/data/inkPoints";
import type { EARN_RATES } from "@/data/inkPoints";

// ── Constants ──────────────────────────────────────────────────────────────

const REDEMPTION_RATE = 200; // pts = S$1.00
const STREAK_MILESTONES = [7, 14, 30, 60, 100];
const AVG_ORDER_EARN = 25; // conservative estimate (pts per order)

// ── Shared helpers ─────────────────────────────────────────────────────────

const statusConfig = {
  processing: { label: "Processing", Icon: Clock,       cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  shipped:    { label: "Shipped",    Icon: Truck,       cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  delivered:  { label: "Delivered", Icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled:  { label: "Cancelled", Icon: XCircle,     cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
} as const;

const historyIconMap: Record<string, React.ReactNode> = {
  gift:           <Gift className="w-4 h-4" />,
  "log-in":       <LogIn className="w-4 h-4" />,
  star:           <Star className="w-4 h-4" />,
  "shopping-bag": <ShoppingBag className="w-4 h-4" />,
  heart:          <Heart className="w-4 h-4" />,
};

const sourceIcon: Record<string, React.ReactNode> = {
  purchase:            <ShoppingBag className="w-4 h-4" />,
  firstPurchase:       <ShoppingBag className="w-4 h-4" />,
  review:              <Star className="w-4 h-4" />,
  photoReview:         <Star className="w-4 h-4" />,
  dailyLogin:          <Calendar className="w-4 h-4" />,
  qaAnswer:            <MessageCircle className="w-4 h-4" />,
  referralComplete:    <Users className="w-4 h-4" />,
  wishlistPurchase:    <Heart className="w-4 h-4" />,
  creativePathComplete:<Sparkles className="w-4 h-4" />,
  imageSearchFirstUse: <Sparkles className="w-4 h-4" />,
  other:               <Sparkles className="w-4 h-4" />,
};

const batchStatusPill = (expiresAt: string) => {
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const daysLeft = Math.floor((exp - now) / 86400000);
  if (daysLeft < 0)  return { label: "Expired",        cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" };
  if (daysLeft < 30) return { label: "Expiring soon",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return              { label: "Active",              cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
};

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-badge-community text-badge-community" : "text-muted fill-transparent"}`} />
    ))}
  </div>
);

// ── TAB 1: Overview ────────────────────────────────────────────────────────

const OverviewTab = ({
  user,
  currentTier,
  tiers,
  expiringBatches,
}: {
  user: MockUser;
  currentTier: TierData;
  tiers: TierData[];
  expiringBatches: PointsBatch[];
}) => {
  const currentTierIndex = tiers.findIndex(t => t.name === user.tier);
  const nextTierData = tiers[currentTierIndex + 1] ?? null;
  const isMaxTier = !nextTierData;

  const tierProgress = nextTierData
    ? Math.min(((user.lifetimePoints - currentTier.minLifetime) / (nextTierData.minLifetime - currentTier.minLifetime)) * 100, 100)
    : 100;
  const inkToNextTier = nextTierData ? nextTierData.minLifetime - user.lifetimePoints : 0;

  const expiringTotal = expiringBatches.reduce((s, b) => s + b.amount, 0);
  const earliestExpiry = expiringBatches.sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
  )[0];

  return (
    <div className="space-y-5">
      {/* Expiry warning */}
      {expiringTotal > 0 && earliestExpiry && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-3">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 dark:text-amber-300">
            <span className="font-semibold">{expiringTotal} Ink</span> expiring on{" "}
            {format(new Date(earliestExpiry.expiresAt), "d MMM yyyy")}
            {" "}— worth{" "}
            <span className="font-semibold">S${(expiringTotal / REDEMPTION_RATE).toFixed(2)}</span> off an order.
            Redeem soon!
          </p>
        </div>
      )}

      {/* Balance hero */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current balance</p>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-4xl font-bold text-primary">{user.loyaltyPoints}</span>
          <span className="text-lg text-muted-foreground">Ink Points</span>
        </div>
        <p className="text-sm text-muted-foreground">
          = <span className="font-semibold text-foreground">S${(user.loyaltyPoints / REDEMPTION_RATE).toFixed(2)}</span> off your next order
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Lifetime earned: <span className="font-medium text-foreground">{user.lifetimePoints} Ink</span>
        </p>
      </div>

      {/* Tier card */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: `${currentTier.color}40`, backgroundColor: `${currentTier.color}08` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: currentTier.color }}
            >
              {currentTier.badge}
            </span>
            {currentTier.earlyAccessDays > 0 && (
              <span className="text-xs text-muted-foreground">
                {currentTier.earlyAccessDays}-day early access
              </span>
            )}
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
            {currentTier.earnMultiplier}× multiplier
          </span>
        </div>

        {/* Benefits */}
        <ul className="space-y-1.5 mb-5">
          {currentTier.benefits.map(b => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: currentTier.color }} />
              {b}
            </li>
          ))}
        </ul>

        {/* Progress to next tier */}
        {isMaxTier ? (
          <p className="text-sm font-semibold text-center" style={{ color: currentTier.color }}>
            ✦ Highest tier — you've made it!
          </p>
        ) : (
          <>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{currentTier.badge}</span>
              <span>{nextTierData!.badge}</span>
            </div>
            <Progress value={tierProgress} className="h-2 mb-2 bg-amber-500/15" indicatorClassName="bg-amber-500" />
            <p className="text-xs text-muted-foreground text-right">
              <span className="font-semibold text-foreground">{inkToNextTier} Ink</span> to unlock {nextTierData!.badge}
            </p>
          </>
        )}
      </div>

      {/* Earn multiplier callout */}
      <div className="flex items-center gap-3 rounded-lg bg-muted/40 border border-border p-3">
        <Sparkles className="w-5 h-5 text-secondary shrink-0" />
        <p className="text-sm text-muted-foreground">
          You earn{" "}
          <span className="font-semibold text-foreground">{currentTier.earnMultiplier}×</span>
          {" "}points on every purchase
          {nextTierData && (
            <span className="text-xs ml-1 text-muted-foreground">
              ({nextTierData.badge} unlocks {nextTierData.earnMultiplier}×)
            </span>
          )}
        </p>
      </div>

      {/* Set a goal prompt — only when no goal is set */}
      {!user.pointsGoal && (
        <Link
          to="/account?tab=goals"
          className="flex items-center gap-3 rounded-lg bg-secondary/5 border border-secondary/20 p-3 hover:bg-secondary/10 transition-colors"
        >
          <Target className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-sm text-muted-foreground">
            You haven't set a points goal yet — <span className="text-primary font-medium">choose a product</span> you're saving toward.
          </p>
        </Link>
      )}
    </div>
  );
};

// ── TAB 2: History ─────────────────────────────────────────────────────────

type HistoryFilter = "all" | "purchases" | "reviews" | "logins" | "other";

const filterMatch = (icon: string, f: HistoryFilter) => {
  if (f === "all") return true;
  if (f === "purchases") return icon === "shopping-bag";
  if (f === "reviews")   return icon === "star";
  if (f === "logins")    return icon === "log-in";
  return icon === "gift" || icon === "heart";
};

const HistoryTab = ({ user }: { user: MockUser }) => {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const filtered = useMemo(
    () => user.pointsHistory.filter(e => filterMatch(e.icon, filter)),
    [user.pointsHistory, filter],
  );

  const FILTERS: { key: HistoryFilter; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "purchases", label: "Purchases" },
    { key: "reviews",   label: "Reviews" },
    { key: "logins",    label: "Logins" },
    { key: "other",     label: "Other" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No entries for this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => {
            // Derive approximate expiry: earn date + 6 months
            const earnDate = new Date(entry.date);
            const expiryDate = new Date(earnDate.getTime() + 180 * 24 * 60 * 60 * 1000);
            const status = batchStatusPill(expiryDate.toISOString());

            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
              >
                {/* Source icon */}
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  {historyIconMap[entry.icon] ?? <Sparkles className="w-4 h-4" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.label}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {format(earnDate, "d MMM yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      Expires {format(expiryDate, "d MMM yyyy")}
                    </span>
                  </div>
                </div>

                {/* Right: amount + status */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-semibold text-secondary">+{entry.points}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── TAB 3: Goals ───────────────────────────────────────────────────────────

const GoalsTab = ({
  user,
  onSetGoal,
  onClearGoal,
}: {
  user: MockUser;
  onSetGoal: (productId: string) => void;
  onClearGoal: () => void;
}) => {
  const [search, setSearch] = useState("");

  const goalProduct = user.pointsGoal
    ? products.find(p => p.id === user.pointsGoal!.targetProductId) ?? null
    : null;

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products
      .filter(p => p.inStock && p.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [search]);

  if (goalProduct && user.pointsGoal) {
    const totalPtsNeeded = Math.ceil(goalProduct.price * REDEMPTION_RATE);
    const shortfall = Math.max(0, totalPtsNeeded - user.loyaltyPoints);
    const progressPct = Math.min((user.loyaltyPoints / totalPtsNeeded) * 100, 100);
    const ordersNeeded = shortfall > 0 ? Math.ceil(shortfall / AVG_ORDER_EARN) : 0;
    const achieved = shortfall === 0;

    return (
      <div className="space-y-5">
        {/* Goal card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            {/* Product thumbnail */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
              <img
                src={goalProduct.images[0]}
                alt={goalProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${goalProduct.id}`}
                className="text-sm font-semibold hover:text-primary hover:underline transition-colors line-clamp-1"
              >
                {goalProduct.name}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">
                S${goalProduct.price.toFixed(2)} · {totalPtsNeeded} Ink to redeem
              </p>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{user.loyaltyPoints} Ink</span>
                  <span>{totalPtsNeeded} Ink</span>
                </div>
                <Progress value={progressPct} className="h-2 bg-secondary/15" indicatorClassName="bg-secondary" />
              </div>
            </div>
          </div>

          {/* Motivational line */}
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/15">
            {achieved ? (
              <p className="text-sm font-medium text-secondary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                You have enough Ink to redeem <strong>{goalProduct.name}</strong> right now!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You're{" "}
                <span className="font-semibold text-foreground">{shortfall} Ink</span>{" "}
                away from affording{" "}
                <span className="font-semibold text-foreground">{goalProduct.name}</span>{" "}
                with points.
                {ordersNeeded > 0 && (
                  <span> That's roughly <span className="font-semibold text-foreground">{ordersNeeded} more order{ordersNeeded !== 1 ? "s" : ""}</span> away.</span>
                )}
              </p>
            )}
          </div>

          <button
            onClick={onClearGoal}
            className="mt-4 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/40 border border-border p-3 flex items-start gap-2.5">
        <Target className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Set a product as your Ink goal and we'll track how close you are to affording it with points.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredProducts.map(p => {
          const ptsNeeded = Math.ceil(p.price * REDEMPTION_RATE);
          return (
            <div
              key={p.id}
              className="rounded-lg border border-border bg-card p-3 flex flex-col gap-2"
            >
              <div className="aspect-square rounded-md bg-muted overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium line-clamp-2 leading-snug">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  S${p.price.toFixed(2)} · {ptsNeeded} Ink
                </p>
              </div>
              <button
                onClick={() => onSetGoal(p.id)}
                className="w-full py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                Set as goal
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── TAB 4: Streak ──────────────────────────────────────────────────────────

const StreakTab = ({
  user,
  earnRates,
}: {
  user: MockUser;
  earnRates: typeof EARN_RATES;
}) => {
  const today = new Date();

  // 90-day window, oldest→newest
  const days = useMemo(
    () => Array.from({ length: 90 }, (_, i) => subDays(today, 89 - i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Dates that appear in pointsHistory
  const activeDates = useMemo(
    () => new Set(
      (user.pointsHistory ?? []).map(e =>
        format(new Date(e.date), "yyyy-MM-dd"),
      ),
    ),
    [user.pointsHistory],
  );

  const isActive = (d: Date) => activeDates.has(format(d, "yyyy-MM-dd"));
  const isToday  = (d: Date) => isSameDay(d, today);

  // Next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m > user.currentStreak) ?? null;
  const milestoneBonus = nextMilestone
    ? Math.min(earnRates.dailyLogin * nextMilestone, 100)
    : 0;
  const daysToMilestone = nextMilestone ? nextMilestone - user.currentStreak : 0;

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-4xl font-bold text-primary">{user.currentStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">Current streak</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-4xl font-bold text-foreground">{user.longestStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">Longest streak</p>
        </div>
      </div>

      {/* Next milestone */}
      {nextMilestone && (
        <div className="rounded-lg bg-secondary/10 border border-secondary/20 px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            Next milestone: <span className="text-primary">Day {nextMilestone}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {daysToMilestone} more day{daysToMilestone !== 1 ? "s" : ""} — earn a{" "}
            <span className="font-semibold text-foreground">{milestoneBonus} Ink</span> bonus
          </p>
          {/* Mini progress to milestone */}
          <div className="mt-2">
            <Progress
              value={Math.min((user.currentStreak / nextMilestone) * 100, 100)}
              className="h-1.5 bg-amber-500/15"
              indicatorClassName="bg-amber-500"
            />
          </div>
        </div>
      )}

      {/* 90-day activity grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">90-day activity</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-muted inline-block" />
            Inactive
            <span className="w-3 h-3 rounded-sm bg-primary/80 inline-block" />
            Active
          </div>
        </div>

        {/* 7-column grid, oldest top-left → newest bottom-right */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        >
          {days.map((d, i) => {
            const active  = isActive(d);
            const todayDay = isToday(d);
            return (
              <div
                key={i}
                title={`${format(d, "d MMM yyyy")}${active ? " — active" : ""}`}
                className={`
                  aspect-square rounded-sm transition-colors
                  ${active    ? "bg-primary/80 hover:bg-primary"  : "bg-muted hover:bg-muted-foreground/20"}
                  ${todayDay  ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                `}
              />
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-right">
          Today is highlighted with a ring
        </p>
      </div>
    </div>
  );
};

// ── Main Account component ─────────────────────────────────────────────────

const VALID_TABS = ["overview", "history", "goals", "streak"] as const;
type TabValue = typeof VALID_TABS[number];

const Account = () => {
  const { user, logout, patchUser } = useAuth();
  const { currentTier, tiers, getExpiringPoints, earnRates } = useInkPoints();
  const { savedItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const submittedReviews = getSubmittedReviews();
  const reviewedProductIds = new Set(submittedReviews.map(r => r.productId));

  if (!user) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  const expiringBatches = getExpiringPoints(60);

  // Controlled tab state — driven by ?tab= URL param, defaults to "overview"
  const rawTab = searchParams.get("tab") ?? "overview";
  const activeTab: TabValue = (VALID_TABS as readonly string[]).includes(rawTab)
    ? rawTab as TabValue
    : "overview";

  const setTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  const handleSetGoal = (productId: string) => {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    patchUser(prev => ({
      ...prev,
      pointsGoal: {
        targetAmount: Math.ceil(p.price * REDEMPTION_RATE),
        targetProductId: productId,
      },
    }));
  };

  const handleClearGoal = () => {
    patchUser(prev => ({ ...prev, pointsGoal: null }));
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
          {user.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-2xl">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">
            @{user.username} · Member since {format(new Date(user.memberSince), "MMM yyyy")}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Ink Journal (tabbed) ── */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg">Ink Journal</h2>
            <span
              className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: currentTier.color }}
            >
              {currentTier.badge}
            </span>
          </div>

          <Tabs value={activeTab} onValueChange={setTab}>
            <TabsList className="w-full mb-5">
              <TabsTrigger value="overview"  className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="history"   className="flex-1">History</TabsTrigger>
              <TabsTrigger value="goals"     className="flex-1">Goals</TabsTrigger>
              <TabsTrigger value="streak"    className="flex-1">Streak</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab
                user={user}
                currentTier={currentTier}
                tiers={tiers}
                expiringBatches={expiringBatches}
              />
            </TabsContent>

            <TabsContent value="history">
              <HistoryTab user={user} />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsTab
                user={user}
                onSetGoal={handleSetGoal}
                onClearGoal={handleClearGoal}
              />
            </TabsContent>

            <TabsContent value="streak">
              <StreakTab user={user} earnRates={earnRates} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Order History ── */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Order History</h2>
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>

          {user.orderHistory.length > 0 ? (
            <div className="space-y-4">
              {user.orderHistory.map(order => {
                const cfg = statusConfig[order.status];
                return (
                  <div key={order.id} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-medium font-mono">{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(order.date), "d MMM yyyy")}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
                        <cfg.Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">× {item.quantity}</span>
                          </div>
                          <span className="font-medium ml-2 shrink-0">S${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-2.5 mb-3">
                      <span className="text-xs text-muted-foreground">Order total</span>
                      <span className="text-sm font-semibold">S${order.total.toFixed(2)}</span>
                    </div>

                    {order.items.some(i => !reviewedProductIds.has(i.productId)) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items
                          .filter(i => !reviewedProductIds.has(i.productId))
                          .map(i => (
                            <Link
                              key={i.productId}
                              to={`/product/${i.productId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              Review {i.name.split(" ").slice(0, 3).join(" ")}
                            </Link>
                          ))}
                      </div>
                    )}
                    {order.items.every(i => reviewedProductIds.has(i.productId)) && (
                      <p className="text-xs text-secondary flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All items reviewed
                      </p>
                    )}

                    <Link
                      to={`/order/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline transition-colors mt-2"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Order <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Your first order awaits!</p>
              <Link to="/shop">
                <Button size="sm" variant="outline">
                  Browse products <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── My Reviews ── */}
        {submittedReviews.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg">My Reviews</h2>
              <Star className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {submittedReviews.map(r => (
                <div key={r.reviewId} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <Link to={`/product/${r.productId}`} className="text-sm font-medium hover:text-primary hover:underline transition-colors line-clamp-1">
                        {r.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.date}</p>
                    </div>
                    {r.pointsEarned > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                        <Sparkles className="w-3 h-3" />
                        +{r.pointsEarned} pts
                      </span>
                    )}
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{r.text}</p>
                  {r.hasPhoto && r.photoUrl && (
                    <img src={r.photoUrl} alt="Review photo" className="mt-3 w-16 h-16 rounded-lg object-cover border border-border" />
                  )}
                  {r.hasPhoto && !r.photoUrl && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Camera className="w-3 h-3" /> Photo attached
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Saved Items ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Saved Items</h2>
            <Heart className="w-5 h-5 text-muted-foreground" />
          </div>
          {savedItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {savedItems.length} item{savedItems.length !== 1 && "s"} in your wishlist
              </p>
              <Link to="/wishlist">
                <Button size="sm" variant="outline">
                  View wishlist <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Save items you love</p>
              <Link to="/shop"><Button size="sm" variant="outline">Explore <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button></Link>
            </div>
          )}
        </div>

        {/* ── Delivery Addresses ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Delivery Addresses</h2>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {user.addresses.map(addr => (
              <div key={addr.id} className="flex items-start gap-3 border border-border rounded-lg p-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="ml-2 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Default</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{addr.line1}</p>
                  {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                  <p className="text-sm text-muted-foreground">Singapore {addr.postalCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;
