import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DealsBanner from "@/components/DealsBanner";
import IntentPrompt from "@/components/IntentPrompt";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityPick from "@/components/CommunityPick";
import CreativePathsPreview from "@/components/CreativePathsPreview";
import PersonalisedDeals from "@/components/PersonalisedDeals";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { Progress } from "@/components/ui/progress";

const STREAK_MILESTONES = [7, 30, 100];

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentTier, tiers, getExpiringPoints, earnRates } = useInkPoints();

  // ── Streak milestone banner ─────────────────────────────────────────────
  const [showStreakBanner, setShowStreakBanner] = useState(false);

  useEffect(() => {
    if (!user || !STREAK_MILESTONES.includes(user.currentStreak)) return;
    const key = `streak_banner_${user.currentStreak}`;
    if (!sessionStorage.getItem(key)) {
      setShowStreakBanner(true);
      const t = setTimeout(() => {
        sessionStorage.setItem(key, "1");
        setShowStreakBanner(false);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [user?.currentStreak]);

  const dismissStreakBanner = () => {
    if (user) sessionStorage.setItem(`streak_banner_${user.currentStreak}`, "1");
    setShowStreakBanner(false);
  };

  // ── Greeting card data ─────────────────────────────────────────────────
  const firstName = user?.displayName?.split(" ")[0] ?? "";
  const currentTierIndex = tiers.findIndex(t => t.name === user?.tier);
  const nextTierData = tiers[currentTierIndex + 1] ?? null;

  const tierProgressPercent = nextTierData && user
    ? Math.min(
        ((user.lifetimePoints - currentTier.minLifetime) /
         (nextTierData.minLifetime - currentTier.minLifetime)) * 100,
        100,
      )
    : 100;

  const lifetimeToNext = nextTierData && user
    ? nextTierData.minLifetime - user.lifetimePoints
    : 0;

  // Expiring points (within 60 days)
  const expiringBatches = isAuthenticated ? getExpiringPoints(60) : [];
  const expiringTotal = expiringBatches.reduce((s, b) => s + b.amount, 0);
  const earliestBatch = expiringBatches
    .slice()
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0];

  // Streak points for the banner label
  const streakPoints = user
    ? Math.min(earnRates.dailyLogin * user.currentStreak, 100)
    : 0;

  return (
    <div>
      {/* ── Streak milestone banner ── */}
      {showStreakBanner && user && (
        <div className="w-full bg-orange-700 text-white px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-medium">
            🔥 {user.currentStreak}-day streak — you just earned a {streakPoints} Ink bonus!
          </span>
          <button
            onClick={dismissStreakBanner}
            className="p-1 hover:bg-white/20 rounded transition-colors ml-4 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Personalised greeting card ── */}
      {isAuthenticated && user && (
        <div className="container max-w-7xl mx-auto px-4 pt-6 pb-2 animate-fade-in">
          <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Left: greeting + tier */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-serif text-xl">Welcome back, {firstName}</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: currentTier.color }}
                >
                  {currentTier.badge}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                You have{" "}
                <span className="font-semibold text-foreground">{user.loyaltyPoints} Ink</span>
                {" "}· Day <span className="font-semibold text-foreground">{user.currentStreak}</span> streak
              </p>
            </div>

            {/* Right: tier progress + expiry nudge */}
            <div className="sm:w-56 shrink-0">
              {nextTierData ? (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{currentTier.badge}</span>
                    <span>{nextTierData.badge}</span>
                  </div>
                  <Progress value={tierProgressPercent} className="h-1.5 mb-1" />
                  <p className="text-xs text-muted-foreground text-right">
                    <span className="font-medium text-foreground">{lifetimeToNext} Ink</span> to {nextTierData.badge}
                  </p>
                </>
              ) : (
                <p className="text-xs font-medium text-center" style={{ color: currentTier.color }}>
                  ✦ Highest tier reached
                </p>
              )}

              {/* Expiry nudge */}
              {expiringTotal > 0 && earliestBatch && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1">
                  ⚠️ {expiringTotal} Ink expiring{" "}
                  {new Date(earliestBatch.expiresAt).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                  {" "}— worth S${(expiringTotal / 200).toFixed(2)} off
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <DealsBanner />
      <PersonalisedDeals />
      <IntentPrompt />
      <FeaturedProducts />
      <CommunityPick />
      <CreativePathsPreview />
    </div>
  );
};

export default Index;
