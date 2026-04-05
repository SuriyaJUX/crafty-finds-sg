import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Check, CheckCircle2, MapPin, Bell, ArrowRight, Gift, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPurchasedProductIds, savePurchasedProductIds } from "@/components/WriteReviewModal";

interface DeliveryDetails {
  fullName: string;
  email: string;
  line1: string;
  line2: string;
  postalCode: string;
  phone: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface VoucherResult {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  label: string;
}

interface ConfirmationState {
  orderId: string;
  total: number;
  pointsEarned: number;
  pointsUsed: number;
  voucherApplied: VoucherResult | null;
  paymentMethod: string;
  deliveryDetails: DeliveryDetails;
  items: OrderItem[];
  isGuest?: boolean;
}

const CheckoutProgressBar = ({ active }: { active: 1 | 2 | 3 }) => {
  const steps = ["Details", "Payment", "Confirmation"];
  return (
    <div className="flex items-center mb-10">
      {steps.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isComplete = step < active;
        const isActive = step === active;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                isComplete && "bg-secondary border-secondary text-white",
                isActive && "bg-secondary border-secondary text-white",
                !isComplete && !isActive && "bg-muted border-border text-muted-foreground"
              )}>
                {isComplete || isActive ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={cn(
                "text-xs whitespace-nowrap",
                isActive ? "text-foreground font-medium" : "text-muted-foreground"
              )}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 mb-4",
                isComplete ? "bg-secondary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Animated ink drop that fills bottom-to-top
const AnimatedInkDrop = ({ fillPercent }: { fillPercent: number }) => {
  const DROP = 56;
  const clipY = DROP * (1 - fillPercent / 100);
  return (
    <svg width={DROP} height={DROP} viewBox={`0 0 ${DROP} ${DROP}`} aria-hidden="true">
      <defs>
        <clipPath id="ink-fill-clip">
          <rect x="0" y={clipY} width={DROP} height={DROP} />
        </clipPath>
      </defs>
      {/* Outline */}
      <path
        d="M28 4 C28 4, 6 24, 6 38 A22 22 0 0 0 50 38 C50 24, 28 4, 28 4 Z"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.35"
      />
      {/* Filled portion */}
      <path
        d="M28 4 C28 4, 6 24, 6 38 A22 22 0 0 0 50 38 C50 24, 28 4, 28 4 Z"
        fill="hsl(var(--primary))"
        clipPath="url(#ink-fill-clip)"
      />
    </svg>
  );
};

const CheckoutConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user, addOrder, addPoints } = useAuth();
  const { isNewTier, clearNewTier, currentTier } = useInkPoints();
  const [notifEnabled, setNotifEnabled] = useState(false);
  // Animation states
  const [fillPercent, setFillPercent] = useState(0);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const animatedRef = useRef(false);

  const state = (location.state ?? {}) as Partial<ConfirmationState>;
  const { orderId, total, pointsEarned, pointsUsed, voucherApplied, deliveryDetails, items, isGuest } = state;

  if (!orderId) return <Navigate to="/" replace />;

  useEffect(() => {
    clearCart();
    if (orderId && items && total !== undefined) {
      addOrder({
        id: orderId,
        date: new Date().toISOString(),
        status: "processing",
        items: items.map(i => ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
        total,
      });
      // Persist purchased product IDs so ProductDetail can mark user as Verified Buyer
      const existing = getPurchasedProductIds();
      const newIds = items.map(i => i.productId).filter(id => !existing.includes(id));
      if (newIds.length > 0) {
        savePurchasedProductIds([...existing, ...newIds]);
      }
      // Award Ink Points for this purchase (authenticated users only)
      if (!isGuest && pointsEarned) {
        addPoints(pointsEarned, `Purchase — Order ${orderId}`, "shopping-bag", "purchase");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ink drop fill animation (800 ms ease-out, authenticated only)
  useEffect(() => {
    if (isGuest || !pointsEarned || animatedRef.current) return;
    animatedRef.current = true;
    const start = Date.now();
    let rafId: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / 800, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setFillPercent(eased * 100);
      if (t < 1) { rafId = requestAnimationFrame(animate); }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count-up animation (600 ms, 20 steps)
  useEffect(() => {
    if (isGuest || !pointsEarned) return;
    const target = pointsEarned;
    const STEPS = 20;
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      setDisplayedPoints(Math.round((frame / STEPS) * target));
      if (frame >= STEPS) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Estimate delivery (3–5 business days)
  const deliveryDate = (() => {
    const d = new Date();
    let businessDays = 0;
    while (businessDays < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) businessDays++;
    }
    return d.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" });
  })();

  // Voucher deduction display
  const subtotal = items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
  const shipping = subtotal >= 50 ? 0 : 3.50;
  const voucherDeduction = voucherApplied
    ? voucherApplied.discountType === "percent"
      ? subtotal * (voucherApplied.value / 100)
      : Math.min(voucherApplied.value, subtotal)
    : 0;
  const pointsDeduction = (pointsUsed ?? 0) / 200;

  // Product recommendation: same category as most expensive item, excluding all purchased products
  const recommendation = (() => {
    if (!items || items.length === 0) return null;
    const purchasedIds = items.map(i => i.productId);
    const topItem = [...items].sort((a, b) => b.price - a.price)[0];
    return products.find(
      p => p.category === topItem.category && !purchasedIds.includes(p.id) && p.inStock
    ) ?? products.find(
      p => !purchasedIds.includes(p.id) && p.inStock
    ) ?? null;
  })();

  const updatedPoints = (user?.loyaltyPoints ?? 0) + (pointsEarned ?? 0) - (pointsUsed ?? 0);

  // Shared components to avoid duplication
  const ctaButtons = (
    <div className="flex flex-col gap-2.5">
      <Button onClick={() => navigate(`/order/${orderId}`)} className="w-full" size="lg">
        <Package className="w-4 h-4 mr-2" /> Track Order
      </Button>
      <Button variant="outline" onClick={() => navigate("/shop")} className="w-full" size="lg">
        Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const notificationToggle = (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Shipping notifications</p>
            <p className="text-xs text-muted-foreground">We'll email {deliveryDetails?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setNotifEnabled(v => !v)}
          className={cn(
            "relative inline-flex w-11 h-6 rounded-full flex-shrink-0 transition-colors",
            notifEnabled ? "bg-primary" : "bg-muted border border-border"
          )}
        >
          <span className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
            notifEnabled && "translate-x-5"
          )} />
        </button>
      </div>
      {notifEnabled && (
        <p className="text-xs text-secondary mt-2.5 flex items-center gap-1.5">
          <Check className="w-3 h-3" /> We'll email you when your order ships.
        </p>
      )}
    </div>
  );

  const inkPointsCard = !isGuest ? (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <AnimatedInkDrop fillPercent={fillPercent} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide font-medium">
            Ink Points earned
          </p>
          <p className="text-2xl font-bold text-primary tabular-nums">
            +{displayedPoints}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Balance: <span className="font-semibold text-foreground">{updatedPoints} Ink</span>
            {" "}= <span className="font-medium text-foreground">S${(updatedPoints / 200).toFixed(2)}</span> off
          </p>
        </div>
      </div>
    </div>
  ) : null;

  const guestUpsell = isGuest ? (
    <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
      <div className="flex items-start gap-3">
        <Gift className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-sm mb-1">
            You missed <span className="text-secondary font-semibold">{pointsEarned ?? 0} Ink Points</span>
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Sign up now — get <span className="font-medium text-foreground">200 bonus points</span>
          </p>
          <Button
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => navigate("/signup")}
          >
            Create account
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <CheckoutProgressBar active={3} />

      {/* Two-column grid on md+ */}
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Compact hero */}
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-serif text-2xl mb-1.5">Order Confirmed!</h1>
            <p className="text-muted-foreground text-sm mb-3">
              Thank you, {deliveryDetails?.fullName.split(" ")[0]}. Your order is being prepared.
            </p>
            <div className="inline-block bg-muted rounded-lg px-3 py-1.5 text-sm font-mono font-medium text-foreground mb-3">
              {orderId}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>
                {deliveryDetails?.line1}{deliveryDetails?.line2 ? `, ${deliveryDetails.line2}` : ""}, Singapore {deliveryDetails?.postalCode}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              Estimated delivery by <span className="font-medium text-foreground">{deliveryDate}</span>
            </p>
          </div>

          {/* Mobile: CTAs + notification immediately after hero */}
          <div className="md:hidden space-y-4">
            {ctaButtons}
            {notificationToggle}
            {inkPointsCard}
            {guestUpsell}
          </div>

          {/* Order summary (collapsible) */}
          <details open className="rounded-xl border border-border bg-card">
            <summary className="p-5 cursor-pointer font-serif text-lg select-none list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">
              Order Summary
              <span className="text-xs text-muted-foreground font-sans font-normal">
                {items?.length} item{(items?.length ?? 0) !== 1 ? "s" : ""} · S${(total ?? 0).toFixed(2)}
              </span>
            </summary>
            <div className="px-5 pb-5">
              <div className="space-y-2 mb-4">
                {items?.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[260px]">{item.name} × {item.quantity}</span>
                    <span className="font-medium ml-2">S${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>S${subtotal.toFixed(2)}</span>
                </div>
                {voucherApplied && (
                  <div className="flex justify-between text-secondary">
                    <span>Voucher ({voucherApplied.code})</span>
                    <span>−S${voucherDeduction.toFixed(2)}</span>
                  </div>
                )}
                {(pointsUsed ?? 0) > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Points redeemed ({pointsUsed} pts)</span>
                    <span>−S${pointsDeduction.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-secondary font-medium" : ""}>{shipping === 0 ? "Free" : `S$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total paid</span>
                  <span>S${(total ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* RIGHT COLUMN (desktop) — sticky sidebar */}
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-4">
            {ctaButtons}
            {notificationToggle}
            {inkPointsCard}
            {guestUpsell}
          </div>
        </div>
      </div>

      {/* Below-fold: Tier upgrade & recommendation (full-width) */}
      {isNewTier && !isGuest && (
        <div
          className="rounded-xl border p-5 mt-6 animate-fade-in"
          style={{
            borderColor: `${currentTier.color}60`,
            backgroundColor: `${currentTier.color}12`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✦</span>
            <h3 className="font-serif text-lg">
              You've reached{" "}
              <span style={{ color: currentTier.color }}>{currentTier.badge}</span>!
            </h3>
            <button
              onClick={clearNewTier}
              className="ml-auto p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Newly unlocked benefits:</p>
          <ul className="space-y-1.5">
            {currentTier.benefits.map(b => (
              <li key={b} className="text-sm flex items-start gap-2 text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: currentTier.color }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendation && (
        <div className="mt-6">
          <h2 className="font-serif text-lg mb-4">You might also like</h2>
          <div className="max-w-[200px]">
            <ProductCard product={recommendation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutConfirmation;
