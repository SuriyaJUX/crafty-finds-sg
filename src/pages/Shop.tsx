import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ColorFilterDrawer from "@/components/ColorFilterDrawer";
import ImageSearchModal from "@/components/ImageSearchModal";
import { COLOR_MAP } from "@/components/ColorWheelFilter";
import { Search, SlidersHorizontal, Camera, X, Palette } from "lucide-react";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialColor = searchParams.get("color") || null;
  const initialPath = searchParams.get("path") || null;

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>("popular");
  const [query, setQuery] = useState(initialQuery);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);
  const [selectedPath, setSelectedPath] = useState<string | null>(initialPath);
  const [colorDrawerOpen, setColorDrawerOpen] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const navigate = useNavigate();

  // Sync color param on mount
  useEffect(() => {
    const colorParam = searchParams.get("color");
    if (colorParam) setSelectedColor(colorParam);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "All") list = list.filter(p => p.category === category);
    if (showDiscounted) list = list.filter(p => p.originalPrice);
    if (selectedPath) {
      list = list.filter(p => p.creativePath === selectedPath);
    }
    if (selectedColor) {
      list = list.filter(p => p.colors && p.colors.includes(selectedColor));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "popular": list.sort((a, b) => b.purchaseCount - a.purchaseCount); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }

    return list;
  }, [category, sort, query, showDiscounted, selectedColor]);

  const activeColorHex =
    selectedColor && selectedColor !== "multicolor"
      ? COLOR_MAP[selectedColor]?.hex
      : selectedColor === "multicolor"
      ? undefined
      : undefined;
  const activeColorLabel =
    selectedColor === "multicolor"
      ? "Multicolor"
      : selectedColor
      ? COLOR_MAP[selectedColor]?.label
      : null;

  return (
    <>
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-6">Shop</h1>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={() => setShowImageSearch(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          title="Search by image"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Colour filter drawer / panel */}
      <ColorFilterDrawer
        open={colorDrawerOpen}
        onClose={() => setColorDrawerOpen(false)}
        selectedColor={selectedColor}
        onColorSelect={(c) => {
          setSelectedColor(c);
          if (!c) setColorDrawerOpen(false);
        }}
      />

      {/* Active colour filter indicator */}
      {selectedColor && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-muted-foreground">Active filter:</span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-xs">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background:
                  selectedColor === "multicolor"
                    ? "conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)"
                    : activeColorHex,
              }}
            />
            {activeColorLabel}
            <button
              onClick={() => setSelectedColor(null)}
              className="ml-0.5 hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showDiscounted}
            onChange={e => setShowDiscounted(e.target.checked)}
            className="rounded accent-primary"
          />
          On sale only
        </label>

        {/* Colour filter button — secondary filter row, visually distinct from category pills */}
        <button
          onClick={() => setColorDrawerOpen(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            selectedColor
              ? "bg-primary/10 text-primary border-primary/40"
              : colorDrawerOpen
              ? "bg-muted border-primary/30 text-foreground"
              : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
          }`}
        >
          {selectedColor ? (
            <span
              className="w-3 h-3 rounded-full border border-border/40 shrink-0"
              style={{
                background:
                  selectedColor === "multicolor"
                    ? "conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)"
                    : activeColorHex,
              }}
            />
          ) : (
            <Palette className="w-3.5 h-3.5 shrink-0" />
          )}
          {selectedColor ? activeColorLabel : "Colour"}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="text-sm bg-card border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {selectedColor ? ` in ${activeColorLabel}` : ""}
      </p>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedColor={selectedColor}
              style={{
                animationDelay: `${Math.min(index, 8) * 60}ms`,
                animationFillMode: "backwards",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>

      <ImageSearchModal
        open={showImageSearch}
        onClose={() => setShowImageSearch(false)}
        onProductSelect={(productId) => {
          setShowImageSearch(false);
          navigate(`/product/${productId}`);
        }}
      />
    </>
  );
};

export default Shop;
