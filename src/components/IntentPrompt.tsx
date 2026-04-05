import { Search, Compass, Camera } from "lucide-react";
import CompactDealsStrip from "@/components/CompactDealsStrip";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg6 from "@/assets/hero-bg-6.jpg";
import ImageSearchModal from "@/components/ImageSearchModal";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { Progress } from "@/components/ui/progress";

const heroImages = [heroBg1, heroBg2, heroBg3, heroBg6];

const FADE_DURATION = 5000;
const HINT_KEY = "imageSearchHintSeen";

const IntentPrompt = () => {
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [leavingImage, setLeavingImage] = useState<number | null>(null);
  const leavingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { currentTier, tiers, getExpiringPoints, earnRates } = useInkPoints();

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [hintSeen, setHintSeen] = useState(() =>
    typeof window !== "undefined"
      ? !!localStorage.getItem(HINT_KEY)
      : true
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => {
        const leaving = prev;
        setLeavingImage(leaving);
        if (leavingTimerRef.current) clearTimeout(leavingTimerRef.current);
        leavingTimerRef.current = setTimeout(() => setLeavingImage(null), FADE_DURATION + 200);
        return (prev + 1) % heroImages.length;
      });
    }, 9000);
    return () => {
      clearInterval(interval);
      if (leavingTimerRef.current) clearTimeout(leavingTimerRef.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const openImageSearch = () => {
    dismissHint();
    setShowImageSearch(true);
  };

  const dismissHint = () => {
    if (!hintSeen) {
      localStorage.setItem(HINT_KEY, "1");
      setHintSeen(true);
    }
  };

  const handleModalClose = () => {
    dismissHint();
    setShowImageSearch(false);
  };

  // ── Greeting data ──
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

  const expiringBatches = isAuthenticated ? getExpiringPoints(60) : [];
  const expiringTotal = expiringBatches.reduce((s, b) => s + b.amount, 0);
  const earliestBatch = expiringBatches
    .slice()
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0];

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden">
      {/* Cycling background images */}
      {heroImages.map((src, index) => {
        const isActive = currentImage === index;
        const isLeaving = leavingImage === index;

        return (
          <img
            key={index}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
            }}
            {...(index === 0 ? { width: 1440, height: 800 } : { loading: "lazy" as const, width: 1440, height: 800 })}
          />
        );
      })}
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/55" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ zIndex: 3 }}>
        {/* Main hero content */}
        <div className="container max-w-3xl mx-auto px-4 text-center pt-6 pb-4">
          {/* Authenticated greeting — inline above headline */}
          {isAuthenticated && user && (
            <div className="mb-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur-sm border border-border/50 text-sm">
                <span className="text-foreground">
                  Welcome back, <span className="font-semibold">{firstName}</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-semibold text-foreground">{user.loyaltyPoints} Ink</span>
                <span className="text-muted-foreground">·</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: currentTier.color }}
                >
                  {currentTier.badge}
                </span>
              </div>
            </div>
          )}

          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground leading-tight">
            What are you creating today?
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Singapore's home for specialty stationery — notebooks, inks, and tools for every kind of maker.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for pens, notebooks, paints..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-sm"
            />
            <button
              type="button"
              onClick={openImageSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
              title="Search by image"
            >
              <Camera className="w-5 h-5" />
            </button>
          </form>

          {/* First-visit hint */}
          {!hintSeen && (
            <div className="flex justify-center mb-6">
              <button
                onClick={openImageSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 border border-border text-xs font-medium text-foreground shadow-sm animate-bounce hover:bg-muted transition-colors"
              >
                📷 New: search by photo — try it
              </button>
            </div>
          )}

          {!hintSeen ? null : <div className="mb-6" />}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Compass className="w-4 h-4" />
              Just browsing
            </button>
            <button
              onClick={() => navigate("/shop?category=Pens+%26+Markers")}
              className="px-5 py-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Pens & Markers
            </button>
            <button
              onClick={() => navigate("/shop?category=Notebooks")}
              className="px-5 py-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Notebooks
            </button>
            <button
              onClick={() => navigate("/shop?category=Paints")}
              className="px-5 py-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Paints
            </button>
          </div>
        </div>

        {/* Bottom strip: tier progress + expiring ink (authenticated only) */}
        {isAuthenticated && user && (
          <div className="container max-w-3xl mx-auto px-4 mt-4 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
              {/* Tier progress */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-card/70 backdrop-blur-sm border border-border/50">
                <span className="text-muted-foreground">
                  Day <span className="font-semibold text-foreground">{user.currentStreak}</span> streak
                </span>
                <span className="text-border">|</span>
                {nextTierData ? (
                  <div className="flex items-center gap-2">
                    <Progress value={tierProgressPercent} className="h-1.5 w-20" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{lifetimeToNext}</span> to {nextTierData.badge}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium" style={{ color: currentTier.color }}>
                    ✦ Highest tier
                  </span>
                )}
              </div>

              {/* Expiring ink nudge */}
              {expiringTotal > 0 && earliestBatch && (
                <Link
                  to="/shop"
                  className="px-4 py-2.5 rounded-full bg-amber-500/15 backdrop-blur-sm border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors"
                >
                  ⚠️ {expiringTotal} Ink expiring{" "}
                  {new Date(earliestBatch.expiresAt).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                  {" "}— use now →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <ImageSearchModal
        open={showImageSearch}
        onClose={handleModalClose}
        onProductSelect={(productId) => {
          handleModalClose();
          navigate(`/product/${productId}`);
        }}
      />
    </section>
  );
};

export default IntentPrompt;
