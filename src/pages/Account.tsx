import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Navigate, Link } from "react-router-dom";
import {
  Gift, LogIn, Star, ShoppingBag, Heart, MapPin, Trophy,
  ChevronRight, Package, CheckCircle2, Truck, Clock, XCircle,
  Sparkles, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { getSubmittedReviews } from "@/components/WriteReviewModal";

const tierColors: Record<string, string> = {
  Bronze:   "text-amber-700",
  Silver:   "text-gray-500",
  Gold:     "text-yellow-500",
  Platinum: "text-purple-500",
};

const pointIcons: Record<string, React.ReactNode> = {
  gift:         <Gift className="w-4 h-4" />,
  "log-in":     <LogIn className="w-4 h-4" />,
  star:         <Star className="w-4 h-4" />,
  "shopping-bag": <ShoppingBag className="w-4 h-4" />,
  heart:        <Heart className="w-4 h-4" />,
};

const statusConfig = {
  processing: {
    label: "Processing",
    Icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  shipped: {
    label: "Shipped",
    Icon: Truck,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  delivered: {
    label: "Delivered",
    Icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    Icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
} as const;

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? "fill-badge-community text-badge-community" : "text-muted fill-transparent"
        }`}
      />
    ))}
  </div>
);

const Account = () => {
  const { user, logout } = useAuth();
  const { savedItems } = useCart();
  const submittedReviews = getSubmittedReviews();
  const reviewedProductIds = new Set(submittedReviews.map(r => r.productId));

  if (!user) return <Navigate to="/login" replace />;

  const isPlatinum = user.loyaltyTier === "Platinum";
  const progressPercent = isPlatinum ? 100 : Math.min((user.tierProgress / user.tierThreshold) * 100, 100);
  const nextTier =
    user.loyaltyTier === "Bronze"  ? "Silver"   :
    user.loyaltyTier === "Silver"  ? "Gold"     :
    user.loyaltyTier === "Gold"    ? "Platinum" : null;
  const pointsToNext = isPlatinum ? 0 : user.tierThreshold - user.tierProgress;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
          {user.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-2xl">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">
            @{user.username} · Member since {format(new Date(user.memberSince), "MMM yyyy")}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Loyalty Points ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${tierColors[user.loyaltyTier]}`} />
              <h2 className="font-serif text-lg">{user.loyaltyTier} Member</h2>
            </div>
            <span className="text-2xl font-bold text-primary">{user.loyaltyPoints} pts</span>
          </div>

          <div className="mb-2">
            <Progress value={progressPercent} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            {isPlatinum ? (
              <span className="font-medium text-foreground">You've reached the highest tier — Platinum!</span>
            ) : (
              <>
                {pointsToNext} more points to reach{" "}
                <span className="font-medium text-foreground">{nextTier}</span> tier
              </>
            )}
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Points history</h3>
            {user.pointsHistory.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  {pointIcons[entry.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{entry.label}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry.date), "d MMM yyyy")}</p>
                </div>
                <span className="font-semibold text-secondary">+{entry.points}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">How to earn more: </span>
              Shop (+1 pt per S$1) · Write a review (10–40 pts based on detail &amp; photo) · Refer friends (+100 pts) · Daily logins (+5 pts)
            </p>
          </div>
        </div>

        {/* ── Order History ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Order History</h2>
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>

          {user.orderHistory.length > 0 ? (
            <div className="space-y-4">
              {user.orderHistory.map(order => {
                const cfg = statusConfig[order.status];
                return (
                  <div key={order.id} className="border border-border rounded-xl p-4">
                    {/* Order header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-medium font-mono">{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(order.date), "d MMM yyyy")}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
                        <cfg.Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Item lines */}
                    <div className="space-y-1.5 mb-3">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">× {item.quantity}</span>
                          </div>
                          <span className="font-medium ml-2 shrink-0">
                            S${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total row */}
                    <div className="flex items-center justify-between border-t border-border pt-2.5 mb-3">
                      <span className="text-xs text-muted-foreground">Order total</span>
                      <span className="text-sm font-semibold">S${order.total.toFixed(2)}</span>
                    </div>

                    {/* Per-item review CTAs */}
                    {order.items.some(item => !reviewedProductIds.has(item.productId)) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items
                          .filter(item => !reviewedProductIds.has(item.productId))
                          .map(item => (
                            <Link
                              key={item.productId}
                              to={`/product/${item.productId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              Review {item.name.split(" ").slice(0, 3).join(" ")}
                            </Link>
                          ))}
                      </div>
                    )}
                    {order.items.every(item => reviewedProductIds.has(item.productId)) && (
                      <p className="text-xs text-secondary flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All items reviewed
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Your first order awaits!</p>
              <Link to="/shop">
                <Button size="sm" variant="outline">
                  Browse products <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── My Reviews ───────────────────────────────────────────────── */}
        {submittedReviews.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg">My Reviews</h2>
              <Star className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              {submittedReviews.map(r => (
                <div key={r.reviewId} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${r.productId}`}
                        className="text-sm font-medium hover:text-primary hover:underline transition-colors line-clamp-1"
                      >
                        {r.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.pointsEarned > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          <Sparkles className="w-3 h-3" />
                          +{r.pointsEarned} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <StarRow rating={r.rating} />

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {r.text}
                  </p>

                  {r.hasPhoto && r.photoUrl && (
                    <img
                      src={r.photoUrl}
                      alt="Review photo"
                      className="mt-3 w-16 h-16 rounded-lg object-cover border border-border"
                    />
                  )}
                  {r.hasPhoto && !r.photoUrl && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Camera className="w-3 h-3" /> Photo attached
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Saved Items ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Saved Items</h2>
            <Heart className="w-5 h-5 text-muted-foreground" />
          </div>

          {savedItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {savedItems.length} item{savedItems.length !== 1 && "s"} in your wishlist
              </p>
              <Link to="/wishlist">
                <Button size="sm" variant="outline">
                  View wishlist <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Save items you love</p>
              <Link to="/shop">
                <Button size="sm" variant="outline">
                  Explore <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Delivery Addresses ───────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Delivery Addresses</h2>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {user.addresses.map(addr => (
              <div key={addr.id} className="flex items-start gap-3 border border-border rounded-lg p-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="ml-2 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{addr.line1}</p>
                  {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                  <p className="text-sm text-muted-foreground">Singapore {addr.postalCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;
