import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Check, CheckCircle2, MapPin, Trophy, Bell, ArrowRight, Gift } from "lucide-react";
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

const CheckoutConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(false);

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
    }
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

  // Product recommendation: same category as most expensive item
  const recommendation = (() => {
    if (!items || items.length === 0) return null;
    const topItem = [...items].sort((a, b) => b.price - a.price)[0];
    return products.find(
      p => p.category === topItem.category && p.id !== topItem.productId && p.inStock
    ) ?? products.find(p => p.inStock) ?? null;
  })();

  const updatedPoints = (user?.loyaltyPoints ?? 0) + (pointsEarned ?? 0) - (pointsUsed ?? 0);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <CheckoutProgressBar active={3} />

      {/* Confirmation hero */}
      <div className="rounded-xl border border-border bg-card p-8 text-center mb-6">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-secondary" />
        </div>
        <h1 className="font-serif text-3xl mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Thank you, {deliveryDetails?.fullName.split(" ")[0]}. Your order is being prepared.
        </p>
        <div className="inline-block bg-muted rounded-lg px-4 py-2 text-sm font-mono font-medium text-foreground mb-4">
          {orderId}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>
            {deliveryDetails?.line1}{deliveryDetails?.line2 ? `, ${deliveryDetails.line2}` : ""}, Singapore {deliveryDetails?.postalCode}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Estimated delivery by <span className="font-medium text-foreground">{deliveryDate}</span>
        </p>
      </div>

      {/* Order summary */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <h2 className="font-serif text-lg mb-4">Order Summary</h2>
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

      {/* Points earned — authenticated users only */}
      {!isGuest && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">
                You earned <span className="text-primary font-semibold">+{pointsEarned} points</span> from this order
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updated balance: <span className="font-medium text-foreground">{updatedPoints} pts</span>
                {" "}(= S${(updatedPoints / 200).toFixed(2)} off your next order)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guest upsell — show what they missed and invite sign-up */}
      {isGuest && (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5 mb-6">
          <div className="flex items-start gap-4">
            <Gift className="w-8 h-8 text-secondary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">
                You could have earned{" "}
                <span className="text-secondary font-semibold">{pointsEarned ?? 0} Ink Points</span>{" "}
                on this order
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Create an account now and we'll add{" "}
                <span className="font-medium text-foreground">200 bonus points</span> to get you started
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
      )}

      {/* Shipping notification opt-in */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Get notified when your order ships</p>
              <p className="text-xs text-muted-foreground">We'll send a confirmation to {deliveryDetails?.email}</p>
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
          <p className="text-xs text-secondary mt-3 flex items-center gap-1.5">
            <Check className="w-3 h-3" /> Notifications enabled — we'll email you when your order ships.
          </p>
        )}
      </div>

      {/* Product recommendation */}
      {recommendation && (
        <div className="mb-6">
          <h2 className="font-serif text-lg mb-4">You might also like</h2>
          <div className="max-w-[200px]">
            <ProductCard product={recommendation} />
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => navigate("/shop")} className="flex-1" size="lg">
          Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" onClick={() => navigate("/account")} className="flex-1" size="lg">
          View Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
