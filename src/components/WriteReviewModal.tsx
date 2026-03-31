import { useState, useRef, useCallback } from "react";
import { X, Star, Camera, Trash2, CheckCircle2, Sparkles } from "lucide-react";
import type { Review } from "@/data/types";
import { useAuth } from "@/context/AuthContext";

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  isVerifiedBuyer: boolean;
  onSubmit: (review: Review) => void;
}

const PURCHASED_KEY = "purchasedProducts";

export function getPurchasedProductIds(): string[] {
  try {
    const raw = localStorage.getItem(PURCHASED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function savePurchasedProductIds(ids: string[]) {
  localStorage.setItem(PURCHASED_KEY, JSON.stringify(ids));
}

// ── Star selector ──────────────────────────────────────────────────────────

const StarSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform active:scale-90"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= display
                  ? "fill-badge-community text-badge-community"
                  : "text-muted fill-transparent"
              }`}
            />
          </button>
        ))}
        {display > 0 && (
          <span className="ml-2 text-sm font-medium text-foreground">
            {labels[display]}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Photo preview ──────────────────────────────────────────────────────────

const PhotoAttachment = ({
  photoUrl,
  onAttach,
  onRemove,
}: {
  photoUrl: string | null;
  onAttach: (file: File) => void;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-sm font-medium mb-2">Add a photo (optional)</p>
      {photoUrl ? (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
          <img
            src={photoUrl}
            alt="Review photo"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/60 text-sm text-muted-foreground transition-colors"
        >
          <Camera className="w-4 h-4" />
          Attach a photo
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onAttach(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ── Main modal ─────────────────────────────────────────────────────────────

const WriteReviewModal = ({
  open,
  onClose,
  productId,
  productName,
  isVerifiedBuyer,
  onSubmit,
}: WriteReviewModalProps) => {
  const { user, addPoints } = useAuth();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [errors, setErrors] = useState<{ rating?: string; text?: string }>({});

  const reset = useCallback(() => {
    setRating(0);
    setText("");
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPhotoFile(null);
    setSubmitted(false);
    setErrors({});
  }, [photoUrl]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAttach = (file: File) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhotoFile(file);
  };

  const handleRemovePhoto = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPhotoFile(null);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (rating === 0) e.rating = "Please select a star rating.";
    if (text.trim().length < 20)
      e.text = "Please write at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Points calculation ─────────────────────────────────────────────────────
  // Base: 10 pts for any review
  // + 10 pts for detailed text (≥ 100 chars)
  // + 15 pts for attaching a photo
  // +  5 pts for being a verified buyer
  const calcPoints = (reviewText: string, hasPhoto: boolean, verified: boolean) => {
    let pts = 10;
    if (reviewText.trim().length >= 100) pts += 10;
    if (hasPhoto) pts += 15;
    if (verified) pts += 5;
    return pts;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const review: Review = {
      id: `user-${Date.now()}`,
      productId,
      userName: "You",
      rating,
      text: text.trim(),
      hasPhoto: !!photoUrl,
      photoUrl: photoUrl ?? undefined,
      isVerified: isVerifiedBuyer,
      date: new Date().toISOString().slice(0, 10),
    };

    onSubmit(review);

    // Award Ink Points to authenticated users
    if (user) {
      const pts = calcPoints(text, !!photoUrl, isVerifiedBuyer);
      const breakdown: string[] = [`Review for "${productName}"`];
      if (text.trim().length >= 100) breakdown.push("detailed review bonus");
      if (photoUrl) breakdown.push("photo bonus");
      if (isVerifiedBuyer) breakdown.push("verified buyer bonus");
      addPoints(pts, breakdown.join(" · "), "star");
      setPointsEarned(pts);
    }

    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg bg-background rounded-2xl shadow-2xl p-6 animate-fade-in">
        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <CheckCircle2 className="w-14 h-14 text-secondary" />
            <h2 className="font-serif text-2xl">Thank you!</h2>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Your review has been submitted. It will appear at the top of the
              reviews section right away.
            </p>
            {isVerifiedBuyer && (
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                ✓ Posted as Verified Buyer
              </span>
            )}

            {/* Points awarded (authenticated users only) */}
            {user && pointsEarned > 0 && (
              <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    +{pointsEarned} Ink Points earned!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {/* Breakdown pills */}
                    10 base
                    {text.trim().length >= 100 && <> · <span className="text-secondary">+10 detailed</span></>}
                    {photoUrl && <> · <span className="text-secondary">+15 photo</span></>}
                    {isVerifiedBuyer && <> · <span className="text-secondary">+5 verified</span></>}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Review form ── */
          <form onSubmit={handleSubmit} noValidate>
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl">Write a review</h2>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xs leading-relaxed">
                  {productName}
                </p>
                {isVerifiedBuyer && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold">
                    ✓ Verified Buyer
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Star rating */}
            <div className="mb-5">
              <p className="text-sm font-medium mb-2">Overall rating</p>
              <StarSelector value={rating} onChange={setRating} />
              {errors.rating && (
                <p className="text-xs text-destructive mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Review text */}
            <div className="mb-5">
              <label className="text-sm font-medium block mb-2">
                Your review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="What did you like or dislike? How did you use this product? Would you recommend it?"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.text ? (
                  <p className="text-xs text-destructive">{errors.text}</p>
                ) : (
                  <span />
                )}
                <span
                  className={`text-xs ${
                    text.trim().length < 20
                      ? "text-muted-foreground"
                      : "text-secondary"
                  }`}
                >
                  {text.trim().length} / 20 min
                </span>
              </div>
            </div>

            {/* Photo attachment */}
            <div className="mb-7">
              <PhotoAttachment
                photoUrl={photoUrl}
                onAttach={handleAttach}
                onRemove={handleRemovePhoto}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Photos help other shoppers make better decisions.
              </p>
            </div>

            {/* Live points preview (authenticated users only) */}
            {user && (
              <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>
                  This review will earn{" "}
                  <span className="font-semibold text-primary">
                    {calcPoints(text, !!photoUrl, isVerifiedBuyer)} Ink Points
                  </span>
                  {text.trim().length < 100 && (
                    <> · write {100 - text.trim().length} more chars for +10 bonus</>
                  )}
                  {!photoUrl && <> · add a photo for +15 bonus</>}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-[opacity,transform]"
            >
              Submit review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WriteReviewModal;
