import { Search, Compass, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg4 from "@/assets/hero-bg-4.jpg";
import heroBg5 from "@/assets/hero-bg-5.jpg";
import heroBg6 from "@/assets/hero-bg-6.jpg";

const heroImages = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5, heroBg6];
const kenBurnsClasses = [
  "animate-ken-burns-1",
  "animate-ken-burns-2",
  "animate-ken-burns-3",
];

const IntentPrompt = () => {
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage);
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
      // Clear prevImage after transition completes
      const timeout = setTimeout(() => setPrevImage(null), 2000);
      return () => clearTimeout(timeout);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentImage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Previous image (fading out) */}
      {prevImage !== null && (
        <img
          key={`prev-${prevImage}`}
          src={heroImages[prevImage]}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out opacity-0 ${kenBurnsClasses[prevImage % kenBurnsClasses.length]}`}
          width={1440}
          height={800}
        />
      )}
      {/* Current image (fading in) */}
      <img
        key={`current-${currentImage}`}
        src={heroImages[currentImage]}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out opacity-100 ${kenBurnsClasses[currentImage % kenBurnsClasses.length]}`}
        width={1440}
        height={800}
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-background/55" />

      {/* Content */}
      <div className="relative z-10 container max-w-3xl mx-auto px-4 text-center">
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
