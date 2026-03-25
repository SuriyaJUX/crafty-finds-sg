import { useParams, Link } from "react-router-dom";
import { products, reviews as allReviews } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Star, Heart, ShoppingBag, ArrowLeft, Users, Camera } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem, toggleSaved, isSaved } = useCart();
  const [startSmall, setStartSmall] = useState(false);

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline text-sm mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  const saved = isSaved(product.id);
  const reviews = allReviews.filter(r => r.productId === product.id);
  const photoReviews = reviews.filter(r => r.hasPhoto);
  const textReviews = reviews.filter(r => !r.hasPhoto);
  const sortedReviews = [...photoReviews, ...textReviews];

  const pairsWellWith = (product.pairsWellWith || [])
    .map(pid => products.find(p => p.id === pid))
    .filter(Boolean);

  const currentPrice = startSmall && product.startSmallPrice ? product.startSmallPrice : product.price;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-xl bg-muted overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          {product.isCommunityFavourite && (
            <span className="absolute top-3 left-3 badge-community px-2.5 py-1 rounded-full text-xs font-semibold">
              ❤️ Community Favourite
            </span>
          )}
          {discount && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
              {discount}% off
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-serif text-3xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-badge-community text-badge-community" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.reviewCount} reviews</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{product.purchaseCount.toLocaleString()} purchased</span>
          </div>

          <div className="flex items-baseline gap-3 my-6">
            <span className="text-3xl font-semibold">S${currentPrice.toFixed(2)}</span>
            {product.originalPrice && !startSmall && (
              <span className="text-lg text-muted-foreground line-through">S${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Start Small toggle */}
          {product.hasStartSmall && product.startSmallPrice && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card mb-6">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={startSmall}
                  onChange={e => setStartSmall(e.target.checked)}
                  className="rounded accent-secondary w-4 h-4"
                />
                <div>
                  <span className="text-sm font-medium">Start small</span>
                  <p className="text-xs text-muted-foreground">Get the essentials-only version for S${product.startSmallPrice.toFixed(2)}</p>
                </div>
              </label>
            </div>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex gap-3">
            <button
              onClick={() => addItem(product, startSmall)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to cart
            </button>
            <button
              onClick={() => toggleSaved(product)}
              className={`p-3 rounded-lg border transition-colors ${saved ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              <Heart className={`w-5 h-5 ${saved ? "fill-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* What you can make */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl mb-4">What you can make with this</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Community project {i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-2xl">Reviews ({reviews.length})</h2>
          <button className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            <Camera className="w-4 h-4" /> Write a review
          </button>
        </div>
        {sortedReviews.length > 0 ? (
          <div className="space-y-4">
            {sortedReviews.map(review => (
              <div key={review.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-badge-community text-badge-community" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.userName}</span>
                  {review.isVerified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-medium">Verified</span>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                {review.hasPhoto && (
                  <div className="mt-3 w-20 h-20 rounded-md bg-muted" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        )}
      </section>

      {/* Pairs well with */}
      {pairsWellWith.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6">Pairs well with</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pairsWellWith.map(p => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
