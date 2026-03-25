import { Search, Compass, Camera } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const IntentPrompt = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-4 text-center">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Compass className="w-4 h-4" />
            Just browsing
          </button>
          <button
            onClick={() => navigate("/shop?category=Pens+%26+Markers")}
            className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Pens & Markers
          </button>
          <button
            onClick={() => navigate("/shop?category=Notebooks")}
            className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Notebooks
          </button>
          <button
            onClick={() => navigate("/shop?category=Paints")}
            className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Paints
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntentPrompt;
