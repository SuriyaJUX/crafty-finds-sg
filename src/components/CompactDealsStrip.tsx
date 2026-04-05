import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Heart, Star } from "lucide-react";
import { COLOR_MAP } from "@/components/ColorWheelFilter";

const COLOR_HEX: Record<string, string> = {
  ...Object.fromEntries(Object.entries(COLOR_MAP).map(([k, v]) => [k, v.hex])),
};

const CompactDealsStrip = () => {
  const { items, toggleSaved, isSaved } = useCart();
  const navigate = useNavigate();

  const discounted = products.filter(
    p => p.originalPrice !== undefined && p.originalPrice > p.price && p.inStock
  );

  if (discounted.length < 2) return null;

  const lastCategory = items.length > 0 ? items[items.length - 1].product.category : null;

  const prioritised = lastCategory
    ? [
        ...discounted.filter(p => p.category === lastCategory),
        ...discounted.filter(p => p.category !== lastCategory),
      ]
    : discounted;

  const shown = prioritised.slice(0, 4);

  return (
    <div className="w-full px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Deals picked for you</span>
          </div>
          <Link
            to="/promotions"
            className="text-[11px] text-primary font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Deal pills row */}
        <div className="flex items-start justify-center gap-3 md:gap-4 overflow-x-auto pb-1 snap-x scroll-smooth">
          {shown.map(p => {
            const discountPercent = p.originalPrice
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="group relative flex-none cursor-pointer
                  w-20 md:w-[88px] md:hover:w-[180px]
                  transition-all duration-[400ms] ease-out
                  overflow-hidden rounded-xl border border-border bg-card shadow-sm
                  md:hover:shadow-lg md:hover:border-primary/40 md:hover:rounded-2xl"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                {/* Image — always square based on current width */}
                <div className="aspect-square w-full overflow-hidden relative">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Discount badge — always visible */}
                  {discountPercent > 0 && (
                    <span className="absolute top-0.5 right-0.5 md:group-hover:top-2 md:group-hover:left-2 md:group-hover:right-auto bg-primary text-primary-foreground text-[9px] md:group-hover:text-[10px] font-bold px-1 md:group-hover:px-2 py-0.5 rounded-md md:group-hover:rounded-full leading-none transition-all duration-[400ms]">
                      -{discountPercent}%
                    </span>
                  )}
                  {/* Community badge — only on expand */}
                  {p.isCommunityFavourite && (
                    <span className="absolute top-2 left-2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-150 badge-community px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      ❤️ Community Favourite
                    </span>
                  )}
                  {/* Wishlist heart — only on expand */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaved(p); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-background
                      opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-150"
                  >
                    <Heart className={`w-4 h-4 ${isSaved(p.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                  {/* Gradient overlay — on expand */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Details section — clipped when collapsed, revealed on expand */}
                <div className="max-h-0 md:group-hover:max-h-[200px] overflow-hidden transition-all duration-[400ms] ease-out">
                  <div className="p-2.5 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight mb-1.5">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-badge-community text-badge-community" />
                      <span className="text-[11px] text-muted-foreground">
                        {p.rating} ({p.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="text-sm font-bold text-foreground">
                        S${p.price.toFixed(2)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[11px] text-muted-foreground line-through">
                          S${p.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {p.colors && p.colors.length > 1 && (
                      <div className="flex items-center gap-1">
                        {p.colors.slice(0, 4).map(c => (
                          <span
                            key={c}
                            className="w-2.5 h-2.5 rounded-full border border-border shrink-0"
                            style={{ background: COLOR_HEX[c] || "#ccc" }}
                          />
                        ))}
                        {p.colors.length > 4 && (
                          <span className="text-[9px] text-muted-foreground">+{p.colors.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile: price below pill */}
                <p className="md:hidden text-[10px] text-center text-foreground py-1 line-clamp-1">
                  S${p.price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompactDealsStrip;
