import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, Upload, RotateCcw, Search, ChevronRight, Clock } from "lucide-react";
import { products, imageSearchScenarios, type ImageSearchScenario } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// ── Types ──────────────────────────────────────────────────────────────────

type ModalState = "upload" | "scanning" | "results";

interface ImageSearchModalProps {
  open: boolean;
  onClose: () => void;
  onProductSelect: (productId: string) => void;
}

interface RecentSearch {
  label: string;
  scenarioId: string;
  timestamp: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const SCAN_MESSAGES = [
  "Analysing image",
  "Identifying product type",
  "Matching against catalogue",
  "Finding best matches",
] as const;

const SCENARIO_GRADIENTS: Record<string, string> = {
  "scenario-notebook":    "linear-gradient(135deg, #e8ddd0 0%, #c8b89a 100%)",
  "scenario-pen":         "linear-gradient(135deg, #2c2c2c 0%, #5a5a5a 100%)",
  "scenario-watercolour": "linear-gradient(135deg, #b3d9f7 0%, #f7c5e3 50%, #c5f7d3 100%)",
  "scenario-brushpen":    "linear-gradient(135deg, #f7c5c5 0%, #c5d3f7 50%, #f7f0c5 100%)",
  "scenario-pencil":      "linear-gradient(135deg, #f5e6c8 0%, #d4b483 100%)",
  "scenario-sketchpad":   "linear-gradient(135deg, #f0ede8 0%, #d8d0c4 100%)",
};

const RECENT_KEY = "recentImageSearches";
const MAX_RECENT = 3;

// ── Recent searches helpers ────────────────────────────────────────────────

function loadRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as RecentSearch[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(scenario: ImageSearchScenario) {
  const existing = loadRecentSearches().filter((r) => r.scenarioId !== scenario.id);
  const updated: RecentSearch[] = [
    { label: scenario.label, scenarioId: scenario.id, timestamp: Date.now() },
    ...existing,
  ].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// ── Sub-components ─────────────────────────────────────────────────────────

/** State 1 — Upload */
const UploadState = ({
  onScenarioSelect,
  onFileSelect,
  onClose,
  recentSearches,
}: {
  onScenarioSelect: (scenario: ImageSearchScenario) => void;
  onFileSelect: (file: File) => void;
  onClose: () => void;
  recentSearches: RecentSearch[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
  };

  const handleRecentClick = (recent: RecentSearch) => {
    const scenario = imageSearchScenarios.find((s) => s.id === recent.scenarioId);
    if (scenario) onScenarioSelect(scenario);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl">Search by image</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors mb-4 ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium mb-1">Drop an image here</p>
        <p className="text-xs text-muted-foreground mb-4">or click to browse your files</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Choose file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
      </div>

      {/* Take a photo */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors mb-8"
      >
        <Camera className="w-4 h-4 text-muted-foreground" />
        Take a photo
      </button>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
            Recent searches
          </p>
          <div className="flex flex-col gap-2">
            {recentSearches.map((recent) => (
              <button
                key={`${recent.scenarioId}-${recent.timestamp}`}
                onClick={() => handleRecentClick(recent)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg shrink-0"
                  style={{ background: SCENARIO_GRADIENTS[recent.scenarioId] ?? "#e8e8e8" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{recent.label}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {relativeTime(recent.timestamp)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sample triggers */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
          Or try a sample
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {imageSearchScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onScenarioSelect(scenario)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted transition-colors text-center"
            >
              <div
                className="w-10 h-10 rounded-lg shrink-0"
                style={{ background: SCENARIO_GRADIENTS[scenario.id] }}
              />
              <span className="text-xs font-medium leading-tight">{scenario.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/** State 2 — Scanning */
const ScanningState = ({
  previewUrl,
  gradient,
}: {
  previewUrl: string | null;
  gradient: string | null;
}) => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center py-8 gap-6">
      <div className="relative w-56 h-56 rounded-xl overflow-hidden shadow-md">
        {previewUrl ? (
          <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: gradient ?? "#e8e8e8" }} />
        )}
        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div
            className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_8px_2px_hsl(var(--primary)/0.5)]"
            style={{ animation: "scanline 1.1s linear infinite" }}
          />
        </div>
        <div className="absolute inset-0 bg-background/10" />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground animate-fade-in" key={msgIdx}>
          {SCAN_MESSAGES[msgIdx]}
          <span className="animate-pulse">…</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Powered by visual search</p>
      </div>

      <style>{`
        @keyframes scanline {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

/** State 3 — Results */
const ResultsState = ({
  scenario,
  previewUrl,
  gradient,
  onProductSelect,
  onSearchAgain,
  onClose,
}: {
  scenario: ImageSearchScenario;
  previewUrl: string | null;
  gradient: string | null;
  onProductSelect: (id: string) => void;
  onSearchAgain: () => void;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const matchedProducts = scenario.matchedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const handleRefine = () => {
    onClose();
    navigate(`/shop?q=${encodeURIComponent(scenario.suggestedQuery)}`);
  };

  const confidencePct = Math.round(scenario.confidence * 100);

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm border border-border">
            {previewUrl ? (
              <img src={previewUrl} alt={scenario.label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: gradient ?? "#e8e8e8" }} />
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">You searched for</p>
            <p className="text-sm font-semibold">{scenario.label}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-semibold mt-1">
              {confidencePct}% match confidence
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <h2 className="font-serif text-xl mb-4">We found these for you</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {matchedProducts.map((product) => (
          <div key={product.id} onClick={() => onProductSelect(product.id)}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={handleRefine}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
        >
          <Search className="w-3 h-3" />
          Refine: "{scenario.suggestedQuery}"
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={onSearchAgain}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Search again
        </button>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

const ImageSearchModal = ({ open, onClose, onProductSelect }: ImageSearchModalProps) => {
  const [state, setState] = useState<ModalState>("upload");
  const [activeScenario, setActiveScenario] = useState<ImageSearchScenario | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches whenever modal opens
  useEffect(() => {
    if (open) {
      setRecentSearches(loadRecentSearches());
    } else {
      resetToUpload();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  const resetToUpload = useCallback(() => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setState("upload");
    setActiveScenario(null);
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  const startScan = useCallback((scenario: ImageSearchScenario, url: string | null) => {
    setActiveScenario(scenario);
    setPreviewUrl(url);
    setState("scanning");
    scanTimerRef.current = setTimeout(() => {
      // Save to recent searches when results arrive
      saveRecentSearch(scenario);
      setRecentSearches(loadRecentSearches());
      setState("results");
    }, 2200);
  }, []);

  const handleScenarioSelect = useCallback(
    (scenario: ImageSearchScenario) => startScan(scenario, null),
    [startScan]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      startScan(imageSearchScenarios[0], url);
    },
    [startScan]
  );

  const handleProductSelect = useCallback(
    (productId: string) => {
      onProductSelect(productId);
      onClose();
    },
    [onProductSelect, onClose]
  );

  if (!open) return null;

  const activeGradient = activeScenario ? SCENARIO_GRADIENTS[activeScenario.id] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl p-6">
        {state === "upload" && (
          <UploadState
            onScenarioSelect={handleScenarioSelect}
            onFileSelect={handleFileSelect}
            onClose={onClose}
            recentSearches={recentSearches}
          />
        )}

        {state === "scanning" && (
          <ScanningState previewUrl={previewUrl} gradient={activeGradient} />
        )}

        {state === "results" && activeScenario && (
          <ResultsState
            scenario={activeScenario}
            previewUrl={previewUrl}
            gradient={activeGradient}
            onProductSelect={handleProductSelect}
            onSearchAgain={resetToUpload}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default ImageSearchModal;
