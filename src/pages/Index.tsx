import { useState, useEffect } from "react";
import { X, Truck, RefreshCw, ShieldCheck, Users } from "lucide-react";
import DealsBanner from "@/components/DealsBanner";
import IntentPrompt from "@/components/IntentPrompt";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityPick from "@/components/CommunityPick";
import CreativePathsPreview from "@/components/CreativePathsPreview";
import PersonalisedDeals from "@/components/PersonalisedDeals";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";

const TRUST_BADGES = [
  { icon: Truck,       label: "Free shipping",   sub: "on orders over S$50"   },
  { icon: RefreshCw,   label: "14-day returns",  sub: "no questions asked"    },
  { icon: Users,       label: "8,000+ crafters", sub: "in Singapore & beyond" },
  { icon: ShieldCheck, label: "Secure checkout", sub: "SSL encrypted"         },
];

const STREAK_MILESTONES = [7, 30, 100];

const Index = () => {
  const { user } = useAuth();
  const { earnRates } = useInkPoints();

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

  const streakPoints = user
    ? Math.min(earnRates.dailyLogin * user.currentStreak, 100)
    : 0;

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

      <IntentPrompt />

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

      <FeaturedProducts />
      <PersonalisedDeals />
      <CommunityPick />
      <CreativePathsPreview />
    </div>
  );
};

export default Index;
