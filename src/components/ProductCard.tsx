import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product, style }: { product: Product; style?: React.CSSProperties }) => {
  const { addItem, toggleSaved, isSaved } = useCart();
  const saved = isSaved(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

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
