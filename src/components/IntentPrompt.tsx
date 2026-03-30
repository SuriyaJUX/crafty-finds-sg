import { Search, Compass, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg6 from "@/assets/hero-bg-6.jpg";

const heroImages = [heroBg1, heroBg2, heroBg3, heroBg6];
const heroPanClasses = [
  "animate-hero-pan-right",
  "animate-hero-pan-left",
  "animate-hero-pan-up",
  "animate-hero-pan-down",
];

const FADE_DURATION = 5000;

const IntentPrompt = () => {
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [leavingImage, setLeavingImage] = useState<number | null>(null);
  const leavingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

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

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Cycling background images */}
      {heroImages.map((src, index) => {
        const isActive = currentImage === index;
        const isLeaving = leavingImage === index;
        const panClass = isActive || isLeaving ? heroPanClasses[index] : "";
        const pausedClass = isLeaving ? "[animation-play-state:paused]" : "";

        return (
          <img
            key={index}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out ${panClass} ${pausedClass}`}
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              transform: "scale(1.06)",
            }}
            {...(index === 0 ? { width: 1440, height: 800 } : { loading: "lazy" as const, width: 1440, height: 800 })}
          />
        );
      })}
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-background/55" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative container max-w-3xl mx-auto px-4 text-center" style={{ zIndex: 3 }}>
        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground leading-tight">
          What are you creating today?
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Search for something specific or browse our curated collections.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8">
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
            title="Search by image"
          >
            <Camera className="w-5 h-5" />
          </button>
        </form>

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
    </section>
  );
};

export default IntentPrompt;
