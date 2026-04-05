import { useState, useEffect } from "react";
import { X, Truck, RefreshCw, ShieldCheck, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import DealsBanner from "@/components/DealsBanner";
import IntentPrompt from "@/components/IntentPrompt";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityPick from "@/components/CommunityPick";
import CreativePathsPreview from "@/components/CreativePathsPreview";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { format } from "date-fns";

const TRUST_BADGES = [
  { icon: Truck,       label: "Free shipping",   sub: "on orders over S$50"   },
  { icon: RefreshCw,   label: "14-day returns",  sub: "no questions asked"    },
  { icon: Users,       label: "8,000+ crafters", sub: "in Singapore & beyond" },
  { icon: ShieldCheck, label: "Secure checkout", sub: "SSL encrypted"         },
];

const STREAK_MILESTONES = [7, 30, 100];

const Index = () => {
  const { user } = useAuth();
  const { earnRates, getExpiringPoints } = useInkPoints();

  // ── Streak milestone banner ─────────────────────────────────────────────
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [expiryDismissed, setExpiryDismissed] = useState(false);

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

  const streakPoints = user
    ? Math.min(earnRates.dailyLogin * user.currentStreak, 100)
    : 0;

  // ── Expiring points warning ──
  const expiringBatches = user ? getExpiringPoints(60) : [];
  const expiringTotal = expiringBatches.reduce((s, b) => s + b.amount, 0);
  const earliestExpiry = expiringBatches.length > 0
    ? expiringBatches.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0]
    : null;

  return (
    <div>
      <DealsBanner />

      {/* ── Streak milestone banner ── */}
      {showStreakBanner && user && (
        <div className="w-full bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between animate-fade-in">
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

      {/* ── Expiring points warning ── */}
      {user && !expiryDismissed && expiringTotal > 0 && earliestExpiry && (
        <div className="container max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 animate-fade-in">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-300">
                You have <span className="font-semibold">{expiringTotal} Ink</span> expiring on{" "}
                {format(new Date(earliestExpiry.expiresAt), "d MMM yyyy")} — worth{" "}
                <span className="font-semibold">S${(expiringTotal / 200).toFixed(2)}</span> off your next order.
              </p>
              <Link to="/shop" className="text-xs text-primary font-medium hover:underline mt-1 inline-block">
                Shop now →
              </Link>
            </div>
            <button
              onClick={() => setExpiryDismissed(true)}
              className="text-amber-600 hover:text-amber-800 shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <PersonalisedDeals />

      <IntentPrompt />

      <FeaturedProducts />
      <CommunityPick />
      <CreativePathsPreview />

      {/* ── Trust badges ── */}
      <div className="border-y border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium leading-tight">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
