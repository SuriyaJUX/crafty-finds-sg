import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package, CheckCircle2, Truck, Clock, MapPin, ArrowLeft,
  AlertTriangle, RotateCcw, Star, MessageSquare, ShieldCheck,
  ChevronRight, XCircle, RefreshCw, Home, ChevronDown,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type TrackingStatus = "placed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "delayed" | "failed";

interface TrackingEvent {
  status: TrackingStatus;
  label: string;
  timestamp: string;
  description?: string;
}

type DeliveryScenario = "on_time" | "delayed" | "failed";

const SCENARIO_LABELS: Record<DeliveryScenario, string> = {
  on_time: "On-time delivery",
  delayed: "Delayed delivery",
  failed: "Failed delivery",
};

// ── Storage helpers ────────────────────────────────────────────────────────

const TRACKING_KEY = "note_gale_order_tracking";

interface StoredTracking {
  orderId: string;
  scenario: DeliveryScenario;
  events: TrackingEvent[];
  currentStatus: TrackingStatus;
  receiptConfirmed: boolean;
  issueReported: boolean;
}

function loadTracking(orderId: string): StoredTracking | null {
  try {
    const all = JSON.parse(localStorage.getItem(TRACKING_KEY) ?? "{}");
    return all[orderId] ?? null;
  } catch { return null; }
}

function saveTracking(data: StoredTracking) {
  try {
    const all = JSON.parse(localStorage.getItem(TRACKING_KEY) ?? "{}");
    all[data.orderId] = data;
    localStorage.setItem(TRACKING_KEY, JSON.stringify(all));
  } catch {}
}

// ── Dynamic date helpers ───────────────────────────────────────────────────

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
}

function getDynamicTimestamp(bizDaysFromNow: number): string {
  return addBusinessDays(new Date(), bizDaysFromNow).toISOString();
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString("en-SG", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" });
}

// ── Timeline config ────────────────────────────────────────────────────────

interface TimelineStep {
  status: TrackingStatus;
  label: string;
  Icon: typeof Package;
  bizDays: number;
}

const STEPS: TimelineStep[] = [
  { status: "placed",           label: "Order Placed",      Icon: Package,      bizDays: 0 },
  { status: "processing",       label: "Processing",        Icon: Clock,        bizDays: 1 },
  { status: "shipped",          label: "Shipped",           Icon: Truck,        bizDays: 2 },
  { status: "out_for_delivery", label: "Out for Delivery",  Icon: Truck,        bizDays: 3 },
  { status: "delivered",        label: "Delivered",         Icon: CheckCircle2, bizDays: 4 },
];

const STATUS_ORDER: TrackingStatus[] = ["placed", "processing", "shipped", "out_for_delivery", "delivered"];

function statusIndex(s: TrackingStatus): number {
  if (s === "delayed") return STATUS_ORDER.indexOf("shipped");
  if (s === "failed") return STATUS_ORDER.indexOf("out_for_delivery");
  return STATUS_ORDER.indexOf(s);
}

function buildFullTimeline(tracking: StoredTracking): Array<{
  status: TrackingStatus;
  label: string;
  Icon: typeof Package;
  bizDays: number;
  isReached: boolean;
  isCurrent: boolean;
  isDelayed: boolean;
  isFailed: boolean;
  event?: TrackingEvent;
  estimatedDate: string;
}> {
  const activeIdx = statusIndex(tracking.currentStatus);
  const isTerminal = tracking.currentStatus === "delivered";
  const isDelayedScenario = tracking.scenario === "delayed";

  const delayedEvent = tracking.events.find(e => e.status === "delayed");
  const failedEvent = tracking.events.find(e => e.status === "failed");

  const result: ReturnType<typeof buildFullTimeline> = [];

  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];
    const isReached = activeIdx >= i;
    const matchingEvent = [...tracking.events].reverse().find(e => e.status === step.status);

    let adjustedBizDays = step.bizDays;
    if (isDelayedScenario && delayedEvent && step.bizDays >= 3) {
      adjustedBizDays = step.bizDays + 2;
    }

    result.push({
      status: step.status,
      label: step.label,
      Icon: step.Icon,
      bizDays: adjustedBizDays,
      isReached,
      isCurrent: activeIdx === i && !isTerminal,
      isDelayed: false,
      isFailed: false,
      event: matchingEvent,
      estimatedDate: getDynamicTimestamp(adjustedBizDays),
    });

    if (step.status === "shipped" && delayedEvent) {
      const delayIsActive = tracking.currentStatus === "delayed";
      const delayIsReached = delayIsActive || activeIdx > i;
      result.push({
        status: "delayed",
        label: "Delivery Delayed",
        Icon: AlertTriangle,
        bizDays: step.bizDays + 1,
        isReached: delayIsReached,
        isCurrent: delayIsActive,
        isDelayed: true,
        isFailed: false,
        event: delayedEvent,
        estimatedDate: getDynamicTimestamp(step.bizDays + 1),
      });
    }

    if (step.status === "out_for_delivery" && failedEvent) {
      const failIsActive = tracking.currentStatus === "failed";
      const failIsReached = failIsActive || tracking.currentStatus === "delivered";
      result.push({
        status: "failed",
        label: "Delivery Failed",
        Icon: XCircle,
        bizDays: step.bizDays + 1,
        isReached: failIsReached,
        isCurrent: failIsActive,
        isDelayed: false,
        isFailed: true,
        event: failedEvent,
        estimatedDate: getDynamicTimestamp(step.bizDays + 1),
      });
    }
  }

  return result;
}

function createInitialEvents(orderId: string): TrackingEvent[] {
  return [{
    status: "placed",
    label: "Order Placed",
    timestamp: new Date().toISOString(),
    description: `Order ${orderId} has been confirmed and is being prepared.`,
  }];
}

function generateNextEvent(current: TrackingStatus, scenario: DeliveryScenario): TrackingEvent | null {
  const now = new Date().toISOString();
  const idx = statusIndex(current);

  if (scenario === "delayed" && current === "shipped") {
    return {
      status: "delayed",
      label: "Delivery Delayed",
      timestamp: now,
      description: "Your package has been delayed due to high parcel volume. We're working to deliver it as soon as possible.",
    };
  }

  if (scenario === "failed" && current === "out_for_delivery") {
    return {
      status: "failed",
      label: "Delivery Failed",
      timestamp: now,
      description: "Delivery was unsuccessful — no one was available to receive the package. We'll attempt redelivery on the next business day.",
    };
  }

  if (current === "delayed") {
    return {
      status: "out_for_delivery",
      label: "Out for Delivery",
      timestamp: now,
      description: "Your package is back on track and out for delivery.",
    };
  }

  if (current === "failed") {
    return {
      status: "out_for_delivery",
      label: "Redelivery Attempt",
      timestamp: now,
      description: "A second delivery attempt is being made.",
    };
  }

  const nextIdx = idx + 1;
  if (nextIdx >= STATUS_ORDER.length) return null;

  const next = STATUS_ORDER[nextIdx];
  const descriptions: Record<string, string> = {
    processing: "Your items are being picked and packed at our warehouse.",
    shipped: "Your package has been handed to the courier and is on the way.",
    out_for_delivery: "Your package is with the delivery rider and will arrive today.",
    delivered: "Your package has been delivered successfully!",
  };

  return {
    status: next,
    label: STEPS.find(s => s.status === next)?.label ?? next,
    timestamp: now,
    description: descriptions[next],
  };
}

function estimateDelivery(scenario: DeliveryScenario): string {
  const bizDays = scenario === "delayed" ? 6 : scenario === "failed" ? 5 : 4;
  return formatDateLong(addBusinessDays(new Date(), bizDays));
}

// ── Component ──────────────────────────────────────────────────────────────

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const order = user?.orderHistory.find(o => o.id === orderId);

  const [tracking, setTracking] = useState<StoredTracking>(() => {
    const stored = orderId ? loadTracking(orderId) : null;
    if (stored) return stored;
    return {
      orderId: orderId ?? "",
      scenario: "on_time",
      events: createInitialEvents(orderId ?? ""),
      currentStatus: "placed",
      receiptConfirmed: false,
      issueReported: false,
    };
  });

  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [phaseKey, setPhaseKey] = useState(0);
  const prevStatusRef = useRef(tracking.currentStatus);

  useEffect(() => {
    if (tracking.orderId) saveTracking(tracking);
  }, [tracking]);

  // Trigger phase card animation on status change
  useEffect(() => {
    if (prevStatusRef.current !== tracking.currentStatus) {
      setPhaseKey(k => k + 1);
      prevStatusRef.current = tracking.currentStatus;
    }
  }, [tracking.currentStatus]);

  const isTerminal = tracking.currentStatus === "delivered";
  const isFailed = tracking.currentStatus === "failed";
  const isDelayed = tracking.currentStatus === "delayed";
  const deliveryEstimate = estimateDelivery(tracking.scenario);

  const fullTimeline = buildFullTimeline(tracking);

  // Find the current active step in chronological order
  const currentStepIdx = fullTimeline.findIndex(s => s.isCurrent);
  const activeStep = currentStepIdx >= 0 ? fullTimeline[currentStepIdx] : (isTerminal ? fullTimeline[fullTimeline.length - 1] : fullTimeline[0]);

  // Build the horizontal stepper from the core 5 steps (no delayed/failed in stepper)
  const coreSteps = STEPS.map((step, i) => {
    const reached = statusIndex(tracking.currentStatus) >= i;
    const current = statusIndex(tracking.currentStatus) === i && !isTerminal;
    return { ...step, isReached: reached, isCurrent: current };
  });

  const advanceStatus = () => {
    const nextEvent = generateNextEvent(tracking.currentStatus, tracking.scenario);
    if (!nextEvent) return;
    setTracking(prev => ({
      ...prev,
      events: [...prev.events, nextEvent],
      currentStatus: nextEvent.status,
    }));
  };

  const switchScenario = (s: DeliveryScenario) => {
    setShowFullTimeline(false);
    setTracking({
      orderId: orderId ?? "",
      scenario: s,
      events: createInitialEvents(orderId ?? ""),
      currentStatus: "placed",
      receiptConfirmed: false,
      issueReported: false,
    });
  };

  const confirmReceipt = () => {
    setTracking(prev => ({ ...prev, receiptConfirmed: true }));
  };

  const reportIssue = () => {
    setTracking(prev => ({ ...prev, issueReported: true }));
  };

  if (!orderId) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">No order ID specified.</p>
        <Button onClick={() => navigate("/account")}>Go to Account</Button>
      </div>
    );
  }

  // ── Actions sidebar content ──────────────────────────────────────────────
  const ActionsContent = () => (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg mb-4">What would you like to do?</h2>

      {isTerminal ? (
        !tracking.receiptConfirmed ? (
          <div className="space-y-3">
            <Button onClick={confirmReceipt} className="w-full" size="lg">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Confirm Receipt
            </Button>
            <button
              onClick={() => navigate(`/order/${orderId}/return`)}
              className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <AlertTriangle className="w-4 h-4" />
              I have a problem with this delivery
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {/* Confirmation banner */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                Receipt confirmed
              </p>
            </div>

            {/* Review prompt */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground mb-1">How was your order?</p>
              <p className="text-xs text-muted-foreground mb-3">Help other buyers with a review.</p>
              <Button
                onClick={() => navigate(`/product/${order?.items[0]?.productId}`, { state: { openReview: true } })}
                disabled={!order?.items[0]}
                size="sm"
                className="w-full"
              >
                <Star className="w-4 h-4 mr-1.5" /> Write a review
              </Button>
            </div>

            {/* Action cards — 2 items only, no duplicate review */}
            <div className="space-y-2">
              {tracking.issueReported ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 animate-fade-in"
                  style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Issue Reported</span>
                    <p className="text-xs text-muted-foreground">We'll follow up via email</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={reportIssue}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/50 transition-colors w-full text-left animate-fade-in"
                  style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Report an Issue</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/order/${orderId}/return`)}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/50 transition-colors w-full text-left animate-fade-in"
                style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Request a Return</span>
              </button>
            </div>
          </div>
        )
      ) : (
        /* Non-delivered: simple nav links */
        <div className="space-y-2">
          <Button variant="outline" onClick={() => navigate("/shop")} className="w-full" size="sm">
            Continue Shopping <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/account")} className="w-full" size="sm">
            <Home className="w-4 h-4 mr-2" /> My Account
          </Button>
        </div>
      )}
    </div>
  );

  // Reversed timeline for the collapsible detail log
  const reversedTimeline = [...fullTimeline].reverse();

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl mb-1">Order Tracking</h1>
            <p className="text-sm text-muted-foreground font-mono">{orderId}</p>
          </div>
          <div className="flex items-center gap-2">
            {isTerminal ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Delivered
              </span>
            ) : isFailed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium">
                <XCircle className="w-4 h-4" /> Delivery Failed
              </span>
            ) : isDelayed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-medium">
                <AlertTriangle className="w-4 h-4" /> Delayed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
                <Truck className="w-4 h-4" /> In Transit
              </span>
            )}
          </div>
        </div>

        {!isTerminal && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
            <MapPin className="w-4 h-4" />
            <span>Estimated delivery by <span className="font-medium text-foreground">{deliveryEstimate}</span></span>
          </div>
        )}
      </div>

      {/* Mobile: Actions immediately after header */}
      <div className="md:hidden mb-6">
        <ActionsContent />
      </div>

      {/* Scenario switcher (demo) */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
          🧪 Simulate delivery scenario
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(Object.keys(SCENARIO_LABELS) as DeliveryScenario[]).map(s => (
            <button
              key={s}
              onClick={() => switchScenario(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                tracking.scenario === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {SCENARIO_LABELS[s]}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={advanceStatus}
          disabled={isTerminal}
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1.5" />
          {isTerminal ? "Order complete" : "Advance to next step"}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* ── Horizontal Stepper + Active Phase Card ── */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg mb-5">Tracking Timeline</h2>

            {/* Horizontal stepper */}
            <div className="flex items-center mb-6">
              {coreSteps.map((step, i) => {
                const StepIcon = step.Icon;
                return (
                  <div key={step.status} className="flex items-center flex-1 last:flex-none">
                    {/* Step dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                          step.isCurrent && "ring-4 ring-secondary/20 bg-secondary border-secondary text-secondary-foreground scale-110",
                          step.isReached && !step.isCurrent && "bg-secondary border-secondary text-secondary-foreground",
                          !step.isReached && "bg-muted border-border text-muted-foreground",
                          isTerminal && i === coreSteps.length - 1 && "bg-emerald-500 border-emerald-500 text-primary-foreground ring-4 ring-emerald-500/20"
                        )}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        "text-[10px] mt-1.5 text-center leading-tight max-w-[64px]",
                        (step.isReached || step.isCurrent) ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {/* Connector line */}
                    {i < coreSteps.length - 1 && (
                      <div className="flex-1 mx-1 relative h-0.5 self-start mt-[18px]">
                        <div className="absolute inset-0 bg-border rounded-full" />
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 bg-secondary rounded-full transition-all duration-700",
                            step.isReached ? "w-full" : "w-0"
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Phase Card */}
            <div
              key={phaseKey}
              className="rounded-lg border border-border bg-muted/30 p-4 animate-scale-in"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    activeStep.isDelayed ? "bg-amber-500 text-primary-foreground" :
                    activeStep.isFailed ? "bg-destructive text-destructive-foreground" :
                    isTerminal ? "bg-emerald-500 text-primary-foreground" :
                    "bg-secondary text-secondary-foreground",
                    activeStep.isCurrent && "animate-pulse"
                  )}
                >
                  <activeStep.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium",
                    activeStep.isDelayed ? "text-amber-700 dark:text-amber-400" :
                    activeStep.isFailed ? "text-destructive" :
                    "text-foreground"
                  )}>
                    {activeStep.label}
                  </p>
                  {activeStep.event?.timestamp && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateShort(activeStep.event.timestamp)}
                    </p>
                  )}
                  {activeStep.event?.description && (
                    <p className={cn(
                      "text-sm mt-2 leading-relaxed",
                      activeStep.isDelayed ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                    )}>
                      {activeStep.event.description}
                    </p>
                  )}
                  {activeStep.isDelayed && activeStep.event && (
                    <p className="text-xs mt-2 font-medium text-amber-700 dark:text-amber-300">
                      Updated delivery estimate: {estimateDelivery("delayed")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Collapsible full timeline log */}
            <div className="mt-4">
              <button
                onClick={() => setShowFullTimeline(!showFullTimeline)}
                className="flex items-center gap-1.5 text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showFullTimeline && "rotate-180")} />
                {showFullTimeline ? "Hide full timeline" : "Show full timeline"}
              </button>

              {showFullTimeline && (
                <div className="mt-4 pl-2 border-l-2 border-border space-y-0 animate-fade-in">
                  {reversedTimeline.map((step, i) => {
                    const StepIcon = step.Icon;
                    const displayDate = step.event
                      ? formatDateShort(step.event.timestamp)
                      : formatDateShort(step.estimatedDate);

                    return (
                      <div key={`${step.status}-${i}`} className="flex gap-3 py-2 pl-3 relative">
                        {/* Dot on the border */}
                        <div
                          className={cn(
                            "absolute -left-[5px] top-[14px] w-2 h-2 rounded-full",
                            step.isDelayed ? "bg-amber-500" :
                            step.isFailed ? "bg-destructive" :
                            step.isReached ? "bg-secondary" : "bg-border"
                          )}
                        />
                        <StepIcon className={cn(
                          "w-4 h-4 shrink-0 mt-0.5",
                          step.isDelayed ? "text-amber-500" :
                          step.isFailed ? "text-destructive" :
                          step.isReached ? "text-secondary" : "text-muted-foreground"
                        )} />
                        <div className="min-w-0">
                          <p className={cn(
                            "text-sm font-medium",
                            step.isDelayed ? "text-amber-700 dark:text-amber-400" :
                            step.isFailed ? "text-destructive" :
                            step.isReached ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.event ? displayDate : `Est. ${displayDate}`}
                          </p>
                          {step.event?.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{step.event.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          {order && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-serif text-lg mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      {product && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          <img src={product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium shrink-0">S${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border mt-4 pt-3 flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>S${order.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Bottom CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/shop")} className="flex-1" size="lg">
              Continue Shopping <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/account")} className="flex-1" size="lg">
              <Home className="w-4 h-4 mr-2" /> My Account
            </Button>
          </div>
        </div>

        {/* Right column — sticky actions sidebar (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ActionsContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
