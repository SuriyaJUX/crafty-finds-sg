import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CheckCircle2, RotateCcw, Package, AlertTriangle,
  ChevronRight, Home,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type ReturnReason =
  | "wrong_item"
  | "damaged"
  | "not_as_described"
  | "changed_mind"
  | "defective"
  | "other";

type ReturnOutcome = "refund" | "exchange" | "store_credit";

type ReturnStep = "select_items" | "select_reason" | "select_outcome" | "confirmation";

const REASONS: { id: ReturnReason; label: string; description: string }[] = [
  { id: "wrong_item",       label: "Wrong item received",     description: "The item delivered does not match what was ordered." },
  { id: "damaged",          label: "Item arrived damaged",     description: "The product or packaging was damaged during shipping." },
  { id: "not_as_described", label: "Not as described",         description: "The product doesn't match the description on the website." },
  { id: "defective",        label: "Product is defective",     description: "The product has a manufacturing defect or doesn't work properly." },
  { id: "changed_mind",     label: "Changed my mind",          description: "I no longer want this item." },
  { id: "other",            label: "Other reason",             description: "Something else not listed above." },
];

const OUTCOMES: { id: ReturnOutcome; label: string; description: string; eligible: (reason: ReturnReason) => boolean }[] = [
  {
    id: "refund",
    label: "Full Refund",
    description: "Refund to your original payment method within 5–7 business days.",
    eligible: () => true,
  },
  {
    id: "exchange",
    label: "Exchange for Same Item",
    description: "We'll send a replacement at no extra cost.",
    eligible: (r) => r !== "changed_mind",
  },
  {
    id: "store_credit",
    label: "Store Credit + 10% Bonus",
    description: "Get the refund amount plus 10% extra as store credit, usable immediately.",
    eligible: () => true,
  },
];

const RETURN_STORAGE_KEY = "paperly_returns";

interface StoredReturn {
  orderId: string;
  returnId: string;
  selectedItems: string[];
  reason: ReturnReason;
  outcome: ReturnOutcome;
  createdAt: string;
}

function saveReturn(data: StoredReturn) {
  try {
    const all: StoredReturn[] = JSON.parse(localStorage.getItem(RETURN_STORAGE_KEY) ?? "[]");
    all.push(data);
    localStorage.setItem(RETURN_STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

// ── Component ──────────────────────────────────────────────────────────────

const OrderReturn = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, addPoints } = useAuth();

  const order = user?.orderHistory.find(o => o.id === orderId);

  const [step, setStep] = useState<ReturnStep>("select_items");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState<ReturnReason | null>(null);
  const [outcome, setOutcome] = useState<ReturnOutcome | null>(null);
  const [returnId, setReturnId] = useState("");

  if (!orderId || !order) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Button onClick={() => navigate("/account")}>Go to Account</Button>
      </div>
    );
  }

  const toggleItem = (productId: string) => {
    setSelectedItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const refundTotal = order.items
    .filter(i => selectedItems.includes(i.productId))
    .reduce((s, i) => s + i.price * i.quantity, 0);

  const storeCreditAmount = refundTotal * 1.1;
  const storeCreditPoints = Math.round(storeCreditAmount * 200);

  const handleSubmit = () => {
    if (!reason || !outcome) return;
    const rid = `RT-${Date.now().toString(36).toUpperCase()}`;
    setReturnId(rid);
    saveReturn({
      orderId: orderId!,
      returnId: rid,
      selectedItems,
      reason,
      outcome,
      createdAt: new Date().toISOString(),
    });

    // Immediately add store credit to Ink Points balance
    if (outcome === "store_credit" && user) {
      addPoints(
        storeCreditPoints,
        `Store credit from return ${rid} (S$${storeCreditAmount.toFixed(2)})`,
        "star",
        "return_credit"
      );
    }

    setStep("confirmation");
  };

  const stepNumber = step === "select_items" ? 1 : step === "select_reason" ? 2 : step === "select_outcome" ? 3 : 4;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => {
          if (step === "select_items") navigate(`/order/${orderId}`);
          else if (step === "select_reason") setStep("select_items");
          else if (step === "select_outcome") setStep("select_reason");
          else navigate(`/order/${orderId}`);
        }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl mb-1">Return Request</h1>
        <p className="text-sm text-muted-foreground">Order {orderId}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center mb-8">
        {["Select Items", "Reason", "Resolution", "Done"].map((label, i) => {
          const sNum = i + 1;
          const isActive = sNum === stepNumber;
          const isDone = sNum < stepNumber;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                  isDone && "bg-secondary border-secondary text-white",
                  isActive && "bg-primary border-primary text-white",
                  !isDone && !isActive && "bg-muted border-border text-muted-foreground",
                )}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : sNum}
                </div>
                <span className={cn("text-[10px] whitespace-nowrap", isActive ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              {i < 3 && <div className={cn("flex-1 h-0.5 mx-2 mb-4", isDone ? "bg-secondary" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select items */}
      {step === "select_items" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg mb-4">Which items would you like to return?</h2>
          <div className="space-y-3 mb-6">
            {order.items.map(item => {
              const product = products.find(p => p.id === item.productId);
              const selected = selectedItems.includes(item.productId);
              return (
                <button
                  key={item.productId}
                  onClick={() => toggleItem(item.productId)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                    selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                    selected ? "bg-primary border-primary text-white" : "border-border"
                  )}>
                    {selected && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  {product && (
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted shrink-0">
                      <img src={product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} · S${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <Button
            onClick={() => setStep("select_reason")}
            disabled={selectedItems.length === 0}
            className="w-full"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Step 2: Select reason */}
      {step === "select_reason" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg mb-4">Why are you returning?</h2>
          <div className="space-y-2 mb-6">
            {REASONS.map(r => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                  reason === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 transition-colors",
                  reason === r.id ? "border-primary bg-primary" : "border-border"
                )} />
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setStep("select_outcome")}
            disabled={!reason}
            className="w-full"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Step 3: Select outcome */}
      {step === "select_outcome" && reason && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg mb-2">How would you like to resolve this?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Refund amount: <span className="font-semibold text-foreground">S${refundTotal.toFixed(2)}</span>
          </p>
          <div className="space-y-2 mb-6">
            {OUTCOMES.filter(o => o.eligible(reason)).map(o => (
              <button
                key={o.id}
                onClick={() => setOutcome(o.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                  outcome === o.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 transition-colors",
                  outcome === o.id ? "border-primary bg-primary" : "border-border"
                )} />
                <div>
                  <p className="text-sm font-medium">{o.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.description}</p>
                  {o.id === "store_credit" && (
                    <p className="text-xs text-secondary font-medium mt-1">
                      You'd receive S${(refundTotal * 1.1).toFixed(2)} in store credit
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={!outcome} className="w-full">
            Submit Return Request
          </Button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === "confirmation" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-secondary" />
          </div>
          <h2 className="font-serif text-2xl mb-2">Return Request Submitted</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Return ID: <span className="font-mono font-medium text-foreground">{returnId}</span>
          </p>

          <div className="rounded-lg bg-muted/40 border border-border p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{selectedItems.length} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reason</span>
              <span>{REASONS.find(r => r.id === reason)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resolution</span>
              <span>{OUTCOMES.find(o => o.id === outcome)?.label}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-border pt-2">
              <span>Refund amount</span>
              <span>S${outcome === "store_credit" ? (refundTotal * 1.1).toFixed(2) : refundTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Store credit confirmation */}
          {outcome === "store_credit" && user && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 flex items-start gap-3 text-left mb-6 animate-fade-in">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  S${storeCreditAmount.toFixed(2)} store credit has been added to your Ink Points balance.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your new balance is <span className="font-semibold text-primary">{user.loyaltyPoints} Ink</span>. You can use these points on your next purchase.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 flex items-start gap-2.5 text-left mb-6">
            <Package className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Next steps</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                You'll receive a prepaid return label via email within 24 hours. Pack the item(s) securely and drop off at any SingPost outlet within 14 days.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate(`/order/${orderId}`)} className="flex-1" size="lg">
              Back to Order <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/account")} className="flex-1" size="lg">
              <Home className="w-4 h-4 mr-2" /> My Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReturn;
