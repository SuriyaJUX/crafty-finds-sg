import { Search, Compass, Camera, Clock, X } from "lucide-react";
import CompactDealsStrip from "@/components/CompactDealsStrip";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const CATEGORY_BUTTONS = [
  { label: "Just browsing", icon: Compass, path: "/shop" },
  { label: "Pens & Markers", path: "/shop?category=Pens+%26+Markers" },
  { label: "Notebooks", path: "/shop?category=Notebooks" },
  { label: "Paints", path: "/shop?category=Paints" },
];

interface IntentPromptProps {
  expiringTotal?: number;
  earliestExpiry?: { expiresAt: string; amount: number } | null;
  expiryDismissed?: boolean;
  onDismissExpiry?: () => void;
}

const IntentPrompt = ({ expiringTotal = 0, earliestExpiry, expiryDismissed, onDismissExpiry }: IntentPromptProps) => {
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [leavingImage, setLeavingImage] = useState<number | null>(null);
  const leavingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { currentTier, tiers } = useInkPoints();

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [hintSeen, setHintSeen] = useState(() =>
    typeof window !== "undefined" ? !!localStorage.getItem(HINT_KEY) : true
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => {
        setLeavingImage(prev);
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
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const openImageSearch = () => { dismissHint(); setShowImageSearch(true); };
  const dismissHint = () => { if (!hintSeen) { localStorage.setItem(HINT_KEY, "1"); setHintSeen(true); } };
  const handleModalClose = () => { dismissHint(); setShowImageSearch(false); };

  // ── Loyalty data ──
  const firstName = user?.displayName?.split(" ")[0] ?? "";
  const currentTierIndex = tiers.findIndex(t => t.name === user?.tier);
  const nextTierData = tiers[currentTierIndex + 1] ?? null;

  const tierProgressPercent = nextTierData && user
    ? Math.min(((user.lifetimePoints - currentTier.minLifetime) / (nextTierData.minLifetime - currentTier.minLifetime)) * 100, 100)
    : 100;

  const lifetimeToNext = nextTierData && user ? nextTierData.minLifetime - user.lifetimePoints : 0;

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden">
      {/* Cycling background images */}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out"
          style={{ opacity: currentImage === index ? 1 : 0, zIndex: currentImage === index ? 1 : 0 }}
          {...(index === 0 ? { width: 1440, height: 800 } : { loading: "lazy" as const, width: 1440, height: 800 })}
        />
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/55" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ zIndex: 3 }}>

        {/* Left-anchored loyalty sidebar (desktop only) */}
        {isAuthenticated && user && (
          <div className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 animate-slide-in-left">
            <div className="w-[176px] bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Welcome back,</p>
                <p className="text-base font-semibold text-foreground truncate">{firstName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{user.loyaltyPoints} Ink</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: currentTier.color }}
                >
                  {currentTier.badge}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                🔥 Day <span className="font-semibold text-foreground">{user.currentStreak}</span> streak
              </p>
              {nextTierData ? (
                <div className="space-y-1">
                  <Progress value={tierProgressPercent} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{lifetimeToNext}</span> to {nextTierData.badge}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] font-medium" style={{ color: currentTier.color }}>
                  ✦ Highest tier
                </p>
              )}
              {!expiryDismissed && expiringTotal > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 animate-fade-in">
                  <span>⏳ {expiringTotal} Ink expiring ·</span>
                  <a href="/shop" className="font-medium hover:underline">Shop →</a>
                  <button onClick={onDismissExpiry} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Dismiss">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main hero content */}
        <div className="container max-w-2xl mx-auto px-4 text-center pt-6 pb-4">
          {/* Mobile-only compact greeting */}
          {isAuthenticated && user && (
            <div className="md:hidden mb-4 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/70 backdrop-blur-sm border border-border/50 text-xs">
                <span className="text-foreground">Hi, <span className="font-semibold">{firstName}</span></span>
                <span className="text-muted-foreground">·</span>
                <span className="font-semibold text-foreground">{user.loyaltyPoints} Ink</span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: currentTier.color }}
                >
                  {currentTier.badge}
                </span>
              </span>
            </div>
          )}

          <h1 className="font-serif text-4xl md:text-5xl mb-2 text-foreground leading-tight">
            What are you creating today?
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            Singapore's home for specialty stationery — notebooks, inks, and tools for every kind of maker.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-3 animate-scale-in">
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
            {CATEGORY_BUTTONS.map(({ label, icon: Icon, path }, i) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Expiry reminder pill */}
        {isAuthenticated && !expiryDismissed && expiringTotal > 0 && earliestExpiry && (
          <div className="flex justify-center pb-3 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-amber-500/10 border border-amber-300/30 text-sm">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-foreground">
                <span className="font-semibold">{expiringTotal} Ink</span> expiring soon — worth{" "}
                <span className="font-semibold">S${(expiringTotal / 200).toFixed(2)}</span> off
              </span>
              <a href="/shop" className="text-primary font-medium hover:underline whitespace-nowrap">
                Shop now →
              </a>
              <button
                onClick={onDismissExpiry}
                className="text-muted-foreground hover:text-foreground shrink-0 ml-1"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Compact deals strip at bottom of hero */}
        <div className="pb-6">
          <CompactDealsStrip />
        </div>
      </div>

      <ImageSearchModal
        open={showImageSearch}
        onClose={handleModalClose}
        onProductSelect={(productId) => { handleModalClose(); navigate(`/product/${productId}`); }}
      />
    </section>
  );
};

export default IntentPrompt;
