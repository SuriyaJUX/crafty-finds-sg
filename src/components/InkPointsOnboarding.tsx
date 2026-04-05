import { useState } from "react";
import { Sparkles, ShoppingBag, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: Sparkles,
    title: "Welcome to Ink Points",
    body: "Every purchase, review, and daily login earns you Ink Points. The more you engage, the faster they add up — and your tier multiplier boosts earnings even further.",
  },
  {
    icon: ShoppingBag,
    title: "Spend Points Like Cash",
    body: "200 Ink Points = S$1.00 off any order. Toggle point redemption at checkout to subsidise — or fully pay for — your next stationery haul.",
  },
  {
    icon: Target,
    title: "Set a Goal",
    body: "Pick a product you're saving toward and we'll track your progress. You'll always know how many points — and orders — stand between you and your reward.",
  },
];

const InkPointsOnboarding = ({ onComplete }: Props) => {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === slide ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <current.icon className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-serif text-xl mb-3">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-6 flex flex-col gap-2">
          <Button
            onClick={() => (isLast ? onComplete() : setSlide(s => s + 1))}
            className="w-full"
          >
            {isLast ? "Get Started" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
          {!isLast && (
            <button
              onClick={onComplete}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InkPointsOnboarding;
