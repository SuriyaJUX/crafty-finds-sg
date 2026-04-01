import { Heart, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { COLOR_MAP } from "@/components/ColorWheelFilter";

const COLOR_HEX: Record<string, string> = {
  ...Object.fromEntries(Object.entries(COLOR_MAP).map(([k, v]) => [k, v.hex])),
  multicolor: "conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)",
};

const ProductCard = ({
  product,
  style,
  selectedColor,
}: {
  product: Product;
  style?: React.CSSProperties;
  selectedColor?: string | null;
}) => {
  const { addItem, toggleSaved, isSaved } = useCart();
  const { isAuthenticated } = useAuth();
  const { currentTier } = useInkPoints();
  const inkEarned = Math.floor(product.price * currentTier.earnMultiplier);
  const saved = isSaved(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const showDots = product.colors && product.colors.length > 1;
  const visibleDots = product.colors ? product.colors.slice(0, 4) : [];
  const extraCount = product.colors && product.colors.length > 4 ? product.colors.length - 3 : 0;
  const dotsToRender = extraCount > 0 ? visibleDots.slice(0, 3) : visibleDots;

  return (
    <div className="group relative animate-fade-in" style={style}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square rounded-lg bg-muted overflow-hidden mb-3">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isCommunityFavourite && (
              <span className="badge-community px-2 py-0.5 rounded-full text-[11px] font-semibold">
                ❤️ Community Favourite
              </span>
            )}
            {discount && (
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[11px] font-semibold">
                {discount}% off
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 fill-badge-community text-badge-community" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">S${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                S${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {isAuthenticated && (
            <p className="flex items-center gap-0.5 text-xs text-secondary mt-0.5">
              <Sparkles className="w-3 h-3" />
              Earn {inkEarned} Ink
            </p>
          )}

          {/* Colour dots */}
          {showDots && (
            <div className="flex items-center gap-1 mt-1.5">
              {dotsToRender.map(c => {
                const isMatch = selectedColor === c;
                const hex = COLOR_HEX[c];
                const isGradient = c === "multicolor";
                return (
                  <span
                    key={c}
                    className="w-2 h-2 rounded-full border shrink-0 transition-all duration-150"
                    style={{
                      background: isGradient ? undefined : hex,
                      backgroundImage: isGradient ? hex : undefined,
                      borderColor: isMatch ? "hsl(var(--primary))" : "hsl(var(--border))",
                      boxShadow: isMatch ? "0 0 0 1.5px hsl(var(--primary))" : undefined,
                      width: isMatch ? "10px" : "8px",
                      height: isMatch ? "10px" : "8px",
                    }}
                  />
                );
              })}
              {extraCount > 0 && (
                <span className="text-[10px] text-muted-foreground">+{extraCount} more</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Save button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleSaved(product); }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
      >
        <Heart className={`w-4 h-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>

      {/* Quick add */}
      <button
        onClick={() => addItem(product)}
        className="absolute bottom-[5.5rem] right-2 opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
