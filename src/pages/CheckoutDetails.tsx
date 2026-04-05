import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Plus, ChevronDown, ChevronUp, Sparkles, Package, BookUser, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryDetails {
  fullName: string;
  email: string;
  line1: string;
  line2: string;
  postalCode: string;
  phone: string;
  savedAddressId?: string;
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

const CheckoutDetails = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal } = useCart();
  const navigate = useNavigate();

  const defaultAddr = user?.addresses.find(a => a.isDefault) ?? user?.addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddr?.id ?? null);
  const [showNewForm, setShowNewForm] = useState(!user || user.addresses.length === 0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState<DeliveryDetails>({
    fullName: user?.displayName ?? "",
    email: user?.email ?? "",
    line1: "",
    line2: "",
    postalCode: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryDetails, string>>>({});
  const [guestMode, setGuestMode] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 3.50;

  const validate = () => {
    const e: Partial<Record<keyof DeliveryDetails, string>> = {};
    if (!showNewForm && selectedAddressId) return true;
    if (form.fullName.trim().length < 2) e.fullName = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (form.line1.trim().length < 5) e.line1 = "Please enter a street address";
    if (!/^\d{6}$/.test(form.postalCode)) e.postalCode = "Singapore postal code must be 6 digits";
    if (!/^[689]\d{7}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Singapore phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    let deliveryDetails: DeliveryDetails;
    if (!showNewForm && selectedAddressId && user) {
      const addr = user.addresses.find(a => a.id === selectedAddressId)!;
      deliveryDetails = {
        fullName: user.displayName,
        email: user.email,
        line1: addr.line1,
        line2: addr.line2 ?? "",
        postalCode: addr.postalCode,
        phone: form.phone || "9123 4567",
        savedAddressId: addr.id,
      };
    } else {
      deliveryDetails = form;
    }
    navigate("/checkout/payment", { state: { deliveryDetails } });
  };

  const guestValidate = () => {
    const e: Partial<Record<keyof DeliveryDetails, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!/^\d{6}$/.test(form.postalCode)) e.postalCode = "Singapore postal code must be 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuestContinue = () => {
    if (!guestValidate()) return;
    const deliveryDetails: DeliveryDetails = {
      fullName: "Guest",
      email: form.email,
      line1: "",
      line2: "",
      postalCode: form.postalCode,
      phone: "",
    };
    navigate("/checkout/payment", { state: { deliveryDetails, isGuest: true } });
  };

  const OrderSummary = () => (
    <div className="space-y-3">
      {items.map(item => {
        const price = item.isStartSmall && item.product.startSmallPrice ? item.product.startSmallPrice : item.product.price;
        return (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground truncate max-w-[180px]">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium ml-2">S${(price * item.quantity).toFixed(2)}</span>
          </div>
        );
      })}
      <div className="border-t border-border pt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>S${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-secondary font-medium" : ""}>{shipping === 0 ? "Free" : `S$${shipping.toFixed(2)}`}</span>
        </div>
        {shipping === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium bg-secondary/10 rounded-lg px-3 py-1.5">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Free shipping — unlocked
          </div>
        ) : (
          <div className="text-xs rounded-lg px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
            <span className="font-semibold">S${(50 - subtotal).toFixed(2)}</span> away from free shipping on orders over S$50.
            <button onClick={() => navigate("/shop")} className="ml-1 underline hover:no-underline font-medium">Add more items</button>
          </div>
        )}
        <div className="flex justify-between font-semibold pt-1 border-t border-border">
          <span>Estimated total</span>
          <span>S${(subtotal + shipping).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  /* ── Choice screen: shown to unauthenticated users before they decide ── */
  if (!isAuthenticated && !guestMode) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </button>
        <CheckoutProgressBar active={1} />
        <h1 className="font-serif text-2xl mb-8 text-center">How would you like to continue?</h1>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Card A — Sign in */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <BookUser className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-lg text-primary">Sign in or create an account</h2>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {[
                { icon: Sparkles, text: "Earn Ink Points on every purchase" },
                { icon: Package, text: "Track your order anytime" },
                { icon: Check,   text: "Save your details for next time" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-foreground">
                  <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => navigate("/login", { state: { from: "/checkout/details" } })}
            >
              Sign in
            </Button>
          </div>

          {/* Card B — Guest */}
          <div className="rounded-xl border-2 border-border bg-card p-6 flex flex-col">
            <h2 className="font-serif text-lg mb-3">Continue as guest</h2>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              You won't earn Ink Points on this order.
            </p>
            <Button
              variant="outline"
              className="w-full border-secondary text-secondary hover:bg-secondary/5"
              onClick={() => setGuestMode(true)}
            >
              Continue as guest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Guest form: minimal email + postal code ── */
  if (!isAuthenticated && guestMode) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <CheckoutProgressBar active={1} />
        <h1 className="font-serif text-2xl mb-2">Guest Checkout</h1>
        <p className="text-sm text-muted-foreground mb-8">
          We only need two details to deliver your order.
        </p>
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address</label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@email.com"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Singapore Postal Code</label>
            <Input
              value={form.postalCode}
              onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
              placeholder="570123"
              maxLength={6}
            />
            {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
          </div>
        </div>
        <Button onClick={handleGuestContinue} className="w-full mt-6" size="lg">
          Continue to Payment
        </Button>
        <button
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setGuestMode(false)}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={() => navigate("/shop")}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>
      <CheckoutProgressBar active={1} />

      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        {/* Left: address */}
        <div>
          <h1 className="font-serif text-2xl mb-6">Delivery Details</h1>

          {/* Mobile order summary accordion */}
          <div className="md:hidden mb-6 rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setSummaryOpen(v => !v)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium"
            >
              <span>Order summary ({items.length} items)</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">S${(subtotal + shipping).toFixed(2)}</span>
                {summaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {summaryOpen && (
              <div className="px-4 pb-4 border-t border-border pt-4">
                <OrderSummary />
              </div>
            )}
          </div>

          {/* Saved addresses */}
          {user && user.addresses.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Saved addresses</p>
              <div className="space-y-3">
                {user.addresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-4 transition-colors",
                      selectedAddressId === addr.id && !showNewForm
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                        <p className="text-sm text-muted-foreground">Singapore {addr.postalCode}</p>
                      </div>
                      {selectedAddressId === addr.id && !showNewForm && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setShowNewForm(v => !v); setSelectedAddressId(null); }}
                className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                {showNewForm ? "Cancel new address" : "Add a new address"}
              </button>
            </div>
          )}

          {/* New address form */}
          {showNewForm && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">New address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Rachel Ng"
                  />
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Address Line 1</label>
                <Input
                  value={form.line1}
                  onChange={e => setForm(f => ({ ...f, line1: e.target.value }))}
                  placeholder="Blk 123 Bishan Street 12"
                />
                {errors.line1 && <p className="text-xs text-destructive mt-1">{errors.line1}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Address Line 2 <span className="text-muted-foreground">(optional)</span></label>
                <Input
                  value={form.line2}
                  onChange={e => setForm(f => ({ ...f, line2: e.target.value }))}
                  placeholder="#08-456"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Postal Code</label>
                  <Input
                    value={form.postalCode}
                    onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    placeholder="570123"
                    maxLength={6}
                  />
                  {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="9123 4567"
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Phone for saved address flow */}
          {!showNewForm && selectedAddressId && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="9123 4567"
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
          )}

          <Button onClick={handleContinue} className="w-full mt-6" size="lg">
            Continue to Payment
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

export default CheckoutDetails;
