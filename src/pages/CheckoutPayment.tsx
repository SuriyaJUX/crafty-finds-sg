import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Check, CreditCard, QrCode, Smartphone, Lock, Shield,
  Tag, AlertCircle, Loader2, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DeliveryDetails {
  fullName: string;
  email: string;
  line1: string;
  line2: string;
  postalCode: string;
  phone: string;
  savedAddressId?: string;
}

type PaymentMethod = "card" | "paynow" | "grabpay" | "paylah" | "atome" | "applepay" | "googlepay";

interface VoucherResult {
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  label: string;
}

const VOUCHER_MAP: Record<string, VoucherResult> = {
  SAKURA20: { code: "SAKURA20", discountType: "percent", value: 20, label: "20% off Sakura products" },
  NOTE3: { code: "NOTE3", discountType: "fixed", value: 5, label: "Buy 2 notebooks, get 1 free" },
  FABER15: { code: "FABER15", discountType: "percent", value: 15, label: "15% off Faber-Castell" },
  FLASH: { code: "FLASH", discountType: "fixed", value: 3, label: "Flash Sale discount" },
};

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
                isActive && "bg-primary border-primary text-white",
                !isComplete && !isActive && "bg-muted border-border text-muted-foreground"
              )}>
                {isComplete ? <Check className="w-4 h-4" /> : step}
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

const CheckoutPayment = () => {
  const location = useLocation();
  const { deliveryDetails } = (location.state ?? {}) as { deliveryDetails?: DeliveryDetails };
  const { items, subtotal, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState<Partial<typeof cardForm>>({});
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState<VoucherResult | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [payNowTimeLeft, setPayNowTimeLeft] = useState(600);
  const [placing, setPlacing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const payNowInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!deliveryDetails) return <Navigate to="/checkout/details" replace />;

  // PayNow countdown
  useEffect(() => {
    if (paymentMethod === "paynow") {
      setPayNowTimeLeft(600);
      payNowInterval.current = setInterval(() => {
        setPayNowTimeLeft(t => {
          if (t <= 1) { clearInterval(payNowInterval.current!); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      if (payNowInterval.current) clearInterval(payNowInterval.current);
    }
    return () => { if (payNowInterval.current) clearInterval(payNowInterval.current); };
  }, [paymentMethod]);

  // Price calculations
  const shipping = subtotal >= 50 ? 0 : 3.50;
  const voucherDeduction = voucherApplied
    ? voucherApplied.discountType === "percent"
      ? subtotal * (voucherApplied.value / 100)
      : Math.min(voucherApplied.value, subtotal)
    : 0;
  const pointsDeduction = redeemPoints && user
    ? Math.min(user.loyaltyPoints / 200, Math.max(0, subtotal - voucherDeduction))
    : 0;
  const pointsUsed = Math.floor(pointsDeduction * 200);
  const total = Math.max(0, subtotal - voucherDeduction - pointsDeduction + shipping);
  const pointsEarned = Math.floor(total);

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    const result = VOUCHER_MAP[code];
    if (result) {
      setVoucherApplied(result);
      toast({ title: "Voucher applied!", description: result.label });
    } else {
      toast({ title: "Invalid voucher code", description: "Please check the code and try again.", variant: "destructive" });
    }
  };

  const validateCard = () => {
    if (paymentMethod !== "card") return true;
    const e: Partial<typeof cardForm> = {};
    if (cardForm.number.replace(/\s/g, "").length !== 16) e.number = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) e.expiry = "Enter expiry as MM/YY";
    if (cardForm.cvv.length < 3) e.cvv = "Enter a 3–4 digit CVV";
    if (cardForm.name.trim().length < 2) e.name = "Enter the name on your card";
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkStock = () => {
    const outOfStock = items.filter(i => !i.product.inStock);
    return outOfStock;
  };

  const handlePlaceOrder = async () => {
    const outOfStock = checkStock();
    if (outOfStock.length > 0) {
      setPaymentError(`Some items are no longer available: ${outOfStock.map(i => i.product.name).join(", ")}. Please remove them to continue.`);
      return;
    }
    if (!validateCard()) return;

    setPaymentError(null);
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));

    // 10% mock failure on card/digital methods
    if (paymentMethod !== "paynow" && Math.random() < 0.1) {
      setPlacing(false);
      setPaymentError("Payment could not be processed. Please check your details and try again, or choose a different payment method. Your cart has been saved.");
      return;
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const orderId = `PY-${dateStr}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    navigate("/checkout/confirmation", {
      state: {
        deliveryDetails,
        orderId,
        total,
        pointsEarned,
        pointsUsed,
        voucherApplied,
        paymentMethod,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.isStartSmall && i.product.startSmallPrice ? i.product.startSmallPrice : i.product.price,
          category: i.product.category,
        })),
      },
    });
  };

  const payNowMM = String(Math.floor(payNowTimeLeft / 60)).padStart(2, "0");
  const payNowSS = String(payNowTimeLeft % 60).padStart(2, "0");
  const isApplePay = typeof window !== "undefined" && "ApplePaySession" in window;

  const methodTiles: { id: PaymentMethod; label: string; subtitle?: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { id: "card", label: "Credit / Debit Card", subtitle: "Visa, Mastercard, Amex", icon: <CreditCard className="w-5 h-5" /> },
    { id: "paynow", label: "PayNow", subtitle: "QR code payment", icon: <QrCode className="w-5 h-5" /> },
    { id: "grabpay", label: "GrabPay", subtitle: "Redirect to Grab", icon: <Smartphone className="w-5 h-5" /> },
    { id: "paylah", label: "PayLah!", subtitle: "Redirect to DBS PayLah", icon: <Smartphone className="w-5 h-5" /> },
    { id: "atome", label: "Atome", subtitle: "Pay in 3 interest-free instalments", icon: <span className="text-sm font-bold">A</span> },
    { id: "applepay", label: "Apple Pay", subtitle: isApplePay ? "Available on this device" : "Available on compatible devices", icon: <span className="text-sm font-bold"></span>, disabled: !isApplePay },
    { id: "googlepay", label: "Google Pay", subtitle: "Available on compatible devices", icon: <span className="text-sm font-bold">G</span>, disabled: true },
  ];

  const OrderSummary = () => (
    <div className="space-y-3">
      {items.map(item => {
        const price = item.isStartSmall && item.product.startSmallPrice ? item.product.startSmallPrice : item.product.price;
        return (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground truncate max-w-[180px]">{item.product.name} × {item.quantity}</span>
            <span className="font-medium ml-2">S${(price * item.quantity).toFixed(2)}</span>
          </div>
        );
      })}
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
        {redeemPoints && pointsDeduction > 0 && (
          <div className="flex justify-between text-secondary">
            <span>Points ({pointsUsed} pts)</span>
            <span>−S${pointsDeduction.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-secondary font-medium" : ""}>{shipping === 0 ? "Free" : `S$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
          <span>Total</span>
          <span>S${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <CheckoutProgressBar active={2} />

      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        {/* Left: payment selection */}
        <div>
          <h1 className="font-serif text-2xl mb-6">Payment Method</h1>

          {/* Mobile summary accordion */}
          <div className="md:hidden mb-6 rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setSummaryOpen(v => !v)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium"
            >
              <span>Order summary ({items.length} items)</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">S${total.toFixed(2)}</span>
                {summaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {summaryOpen && (
              <div className="px-4 pb-4 border-t border-border pt-4">
                <OrderSummary />
              </div>
            )}
          </div>

          {/* Method tiles */}
          <div className="space-y-2 mb-6">
            {methodTiles.map(m => (
              <button
                key={m.id}
                onClick={() => !m.disabled && setPaymentMethod(m.id)}
                disabled={m.disabled}
                className={cn(
                  "w-full text-left rounded-xl border-2 p-4 flex items-center gap-3 transition-colors",
                  paymentMethod === m.id && !m.disabled
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground",
                  m.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-foreground">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.label}</p>
                  {m.subtitle && <p className="text-xs text-muted-foreground">{m.subtitle}</p>}
                </div>
                {paymentMethod === m.id && !m.disabled && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Active payment panel */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  Demo mode — no real charge will be made
                </p>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Card Number</label>
                  <Input
                    value={cardForm.number}
                    onChange={e => setCardForm(f => ({ ...f, number: formatCardNumber(e.target.value) }))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                  {cardErrors.number && <p className="text-xs text-destructive mt-1">{cardErrors.number}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Expiry</label>
                    <Input
                      value={cardForm.expiry}
                      onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {cardErrors.expiry && <p className="text-xs text-destructive mt-1">{cardErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">CVV</label>
                    <Input
                      value={cardForm.cvv}
                      onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="123"
                      maxLength={4}
                    />
                    {cardErrors.cvv && <p className="text-xs text-destructive mt-1">{cardErrors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name on Card</label>
                  <Input
                    value={cardForm.name}
                    onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Rachel Ng"
                  />
                  {cardErrors.name && <p className="text-xs text-destructive mt-1">{cardErrors.name}</p>}
                </div>
              </div>
            )}

            {paymentMethod === "paynow" && (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-48 h-48 rounded-xl bg-muted flex flex-col items-center justify-center border border-border">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">QR Code Placeholder</p>
                </div>
                {payNowTimeLeft > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    QR expires in <span className={cn("font-semibold", payNowTimeLeft < 60 ? "text-destructive" : "text-foreground")}>{payNowMM}:{payNowSS}</span>
                  </p>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-destructive font-medium">QR code expired</p>
                    <Button variant="outline" size="sm" onClick={() => setPayNowTimeLeft(600)}>
                      <RefreshCw className="w-3 h-3 mr-1.5" /> Regenerate QR
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">Open your banking app and scan to pay S${total.toFixed(2)}</p>
              </div>
            )}

            {(paymentMethod === "grabpay" || paymentMethod === "paylah") && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  You'll be redirected to {paymentMethod === "grabpay" ? "GrabPay" : "DBS PayLah!"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  After completing payment you'll be returned to this page automatically.
                </p>
              </div>
            )}

            {paymentMethod === "atome" && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Pay in 3 interest-free instalments</p>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">{i === 0 ? "Today" : `+${i * 30} days`}</p>
                      <p className="text-sm font-semibold">S${(total / 3).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">No interest, no fees. Subject to Atome eligibility check.</p>
              </div>
            )}

            {(paymentMethod === "applepay" || paymentMethod === "googlepay") && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Available on compatible devices only.</p>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { icon: <Lock className="w-3 h-3" />, label: "Secured by Stripe" },
              { icon: <Check className="w-3 h-3" />, label: "PayNow Verified" },
              { icon: <Shield className="w-3 h-3" />, label: "SSL Encrypted" },
            ].map(b => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground">
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Voucher & Points */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6 space-y-4">
            <h2 className="text-sm font-semibold">Promotions &amp; Points</h2>

            {/* Voucher */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Voucher Code</label>
              {voucherApplied ? (
                <div className="flex items-center justify-between rounded-lg bg-secondary/10 border border-secondary/30 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{voucherApplied.code}</span>
                    <span className="text-muted-foreground">— {voucherApplied.label}</span>
                  </div>
                  <button onClick={() => setVoucherApplied(null)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && applyVoucher()}
                    placeholder="e.g. SAKURA20"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyVoucher}>Apply</Button>
                </div>
              )}
            </div>

            {/* Points redemption */}
            {user && user.loyaltyPoints > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Redeem points</p>
                  <p className="text-xs text-muted-foreground">
                    {user.loyaltyPoints} pts available = S${(user.loyaltyPoints / 200).toFixed(2)} off
                  </p>
                </div>
                <button
                  onClick={() => setRedeemPoints(v => !v)}
                  className={cn(
                    "relative inline-flex w-11 h-6 rounded-full transition-colors",
                    redeemPoints ? "bg-primary" : "bg-muted border border-border"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    redeemPoints && "translate-x-5"
                  )} />
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {paymentError && (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Payment failed</p>
                <p className="text-sm text-muted-foreground mt-0.5">{paymentError}</p>
                {paymentError.includes("no longer available") && (
                  <div className="mt-2 space-y-1">
                    {items.filter(i => !i.product.inStock).map(i => (
                      <button
                        key={i.product.id}
                        onClick={() => { removeItem(i.product.id); setPaymentError(null); }}
                        className="text-xs text-destructive underline block"
                      >
                        Remove "{i.product.name}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <Button onClick={handlePlaceOrder} disabled={placing} className="w-full" size="lg">
            {placing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
            ) : (
              <>Place Order — S${total.toFixed(2)}</>
            )}
          </Button>
        </div>

        {/* Right: order summary (desktop) */}
        <div className="hidden md:block">
          <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
            <h2 className="font-serif text-lg mb-4">Order Summary</h2>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
