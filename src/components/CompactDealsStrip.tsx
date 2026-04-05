import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";

const CompactDealsStrip = () => {
  const { items } = useCart();
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
        <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-1 snap-x scroll-smooth">
          {shown.map(p => {
            const discountPercent = p.originalPrice
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="group relative flex-none cursor-pointer"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                {/* Compact pill — always visible */}
                <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden border border-border bg-card shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/40">
                  <img
src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={72}
                    height={72}
                  />
                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground text-[9px] font-bold px-1 py-0.5 rounded-md leading-none">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Expanded card — desktop hover only */}
                <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden">
                      <img
src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight mb-1.5">
                        {p.name}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-foreground">
                          S${p.price.toFixed(2)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            S${p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: show name below pill */}
                <p className="md:hidden text-[10px] text-center text-foreground mt-1 w-16 line-clamp-1">
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
