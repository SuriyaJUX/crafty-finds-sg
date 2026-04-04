import { useParams, Link } from "react-router-dom";
import { products, reviews as allReviews } from "@/data/products";
import type { Review } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart, ShoppingBag, ArrowLeft, Users, Camera, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductQA from "@/components/ProductQA";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import WriteReviewModal, { getPurchasedProductIds } from "@/components/WriteReviewModal";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem, toggleSaved, isSaved } = useCart();
  const { isAuthenticated } = useAuth();
  const { currentTier } = useInkPoints();
  const { toast } = useToast();
  const [startSmall, setStartSmall] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "photos" | "verified">("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const PRESETS = [1, 5, 10, 25, 50] as const;

  const handleQuantityInput = (val: string) => {
    const num = parseInt(val, 10);
    if (val === "") setQuantity(1);
    else if (!isNaN(num)) setQuantity(Math.max(1, Math.min(999, num)));
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) setQuantity(1);
  };

  const reviewsReveal = useScrollReveal<HTMLElement>();
  const pairsReveal = useScrollReveal<HTMLElement>();
  

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline text-sm mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  const saved = isSaved(product.id);
  const isVerifiedBuyer = getPurchasedProductIds().includes(product.id);
  // Merge user-submitted reviews (shown first) with seeded reviews
  const reviews = [...localReviews, ...allReviews.filter(r => r.productId === product.id)];

  // Honesty sort: surfaces 2★ & 3★ first, then 4★, then 5★, then 1★
  const honestyOrder: Record<number, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 1: 4 };
  const sortedReviews = [...reviews].sort((a, b) => honestyOrder[a.rating] - honestyOrder[b.rating]);

  const filteredReviews = sortedReviews.filter(r => {
    if (reviewFilter === "photos") return r.hasPhoto;
    if (reviewFilter === "verified") return r.isVerified;
    return true;
  });

  // Common complaints: lowest-rated review at ≤ 2★
  const lowReviews = reviews.filter(r => r.rating <= 2);
  const worstReview = lowReviews.length > 0
    ? lowReviews.reduce((a, b) => a.rating < b.rating ? a : b)
    : null;

  const pairsWellWith = (product.pairsWellWith || [])
    .map(pid => products.find(p => p.id === pid))
    .filter(Boolean);

  const currentPrice = startSmall && product.startSmallPrice ? product.startSmallPrice : product.price;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Image — fades + rises in */}
        <div className="space-y-3">
          <div
            className="relative aspect-square rounded-xl bg-muted overflow-hidden animate-fade-in"
            style={{ animationDuration: "0.6s" }}
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
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
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info — follows image with slight delay */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
        >
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

          <div className="flex items-baseline gap-3 mt-6 mb-2">
            <span className="text-3xl font-semibold">S${currentPrice.toFixed(2)}</span>
            {product.originalPrice && !startSmall && (
              <span className="text-lg text-muted-foreground line-through">S${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="flex items-center gap-1 text-sm text-secondary font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Earn {Math.floor(currentPrice)} Ink Points with this purchase
          </p>

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

          {/* Quantity selector */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <span className="w-4 h-4 flex items-center justify-center text-sm font-medium">−</span>
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={e => handleQuantityInput(e.target.value)}
                onBlur={handleQuantityBlur}
                onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                className="w-14 h-10 text-center rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => setQuantity(q => Math.min(999, q + 1))}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <span className="w-4 h-4 flex items-center justify-center text-sm font-medium">+</span>
              </button>
            </div>
            {/* Preset pills */}
            <div className="flex gap-1.5 mt-2">
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setQuantity(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    quantity === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  ×{p}
                </button>
              ))}
            </div>
            {/* Bulk nudge */}
            {quantity >= 10 && (
              <p className="flex items-center gap-1 text-xs text-secondary mt-2">
                <Sparkles className="w-3 h-3" />
                Buying in bulk? You'll earn {Math.floor(currentPrice * quantity * currentTier.earnMultiplier)} Ink Points on this order
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) addItem(product, startSmall);
                if (isAuthenticated) {
                  const inkEarned = Math.floor(currentPrice * quantity * currentTier.earnMultiplier);
                  toast({
                    title: "Added to cart",
                    description: `You'll earn ${inkEarned} Ink on this ${quantity > 1 ? `${quantity} items` : "item"}`,
                    duration: 3000,
                  });
                }
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-95 transition-[opacity,transform]"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to cart{quantity > 1 ? ` (${quantity})` : ""}
            </button>
            <button
              onClick={() => toggleSaved(product)}
              className={`p-3 rounded-lg border transition-[colors,transform] active:scale-90 ${saved ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              <Heart className={`w-5 h-5 transition-transform duration-200 ${saved ? "fill-primary scale-110" : ""}`} />
            </button>
          </div>
        </div>
      </div>


      {/* Reviews */}
      <section
        ref={reviewsReveal.ref}
        className={`mb-16 transition-[opacity,transform] duration-700 ${reviewsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-2xl">Reviews ({reviews.length})</h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            <Camera className="w-4 h-4" /> Write a review
          </button>
        </div>

        {/* Common complaints callout */}
        {worstReview && (
          <div className="flex gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold">Buyers mention:</span> {worstReview.text}
            </p>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "photos", "verified"] as const).map(f => (
            <button
              key={f}
              onClick={() => setReviewFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                reviewFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f === "all" ? "All reviews" : f === "photos" ? "With photos" : "Verified only"}
            </button>
          ))}
        </div>

        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review, idx) => (
              <div
                key={review.id}
                className={`p-4 rounded-lg border border-border bg-card transition-[opacity,transform] duration-500 ${reviewsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
                style={{ transitionDelay: reviewsReveal.visible ? `${idx * 60}ms` : "0ms" }}
              >
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
                  review.photoUrl ? (
                    <img
                      src={review.photoUrl}
                      alt="Review photo"
                      className="mt-3 w-20 h-20 rounded-md object-cover border border-border"
                    />
                  ) : (
                    <div className="mt-3 w-20 h-20 rounded-md bg-muted" />
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {reviewFilter === "all" ? "No reviews yet. Be the first to share your experience!" : "No reviews match this filter."}
          </p>
        )}
      </section>

      {/* Q&A */}
      <ProductQA productId={product.id} />

      {/* Pairs well with */}
      {pairsWellWith.length > 0 && (
        <section
          ref={pairsReveal.ref}
          className={`mb-16 transition-[opacity,transform] duration-700 ${pairsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="font-serif text-2xl mb-6">Pairs well with</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pairsWellWith.map((p, idx) =>
              p && (
                <div
                  key={p.id}
                  className={`transition-[opacity,transform] duration-500 ${pairsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: pairsReveal.visible ? `${idx * 80}ms` : "0ms" }}
                >
                  <ProductCard product={p} />
                </div>
              )
            )}
          </div>
        </section>
      )}

      <WriteReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={product.id}
        productName={product.name}
        isVerifiedBuyer={isVerifiedBuyer}
        onSubmit={(review) => {
          setLocalReviews(prev => [review, ...prev]);
        }}
      />
    </div>
  );
};

export default ProductDetail;
