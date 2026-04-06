import { Flame, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStreakMultiplier } from "@/context/InkPointsContext";

interface StreakRecoveryModalProps {
  previousStreak: number;
  recoveryCost: number;
  userPoints: number;
  onRecover: () => void;
  onDecline: () => void;
}

const StreakRecoveryModal = ({
  previousStreak,
  recoveryCost,
  userPoints,
  onRecover,
  onDecline,
}: StreakRecoveryModalProps) => {
  const milestone = getStreakMultiplier(previousStreak);
  const afterBalance = userPoints - recoveryCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6 relative">

        {/* Close */}
        <button
          onClick={onDecline}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Flame icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Flame className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold mb-1.5">You lost your streak 🥲</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your{" "}
            <span className="font-semibold text-amber-500">{previousStreak}-day streak</span>{" "}
            ended when you missed a day. Spend Ink Points to recover it now.
          </p>
        </div>

        {/* Cost breakdown */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recovery cost</span>
            <span className="font-semibold text-destructive">−{recoveryCost} pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your balance</span>
            <span className="font-medium">{userPoints} pts</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">After recovery</span>
            <span className="font-semibold">{afterBalance} pts</span>
          </div>
        </div>

        {/* Multiplier reminder — only if streak qualifies */}
        {milestone && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-xs ${milestone.bg}`}>
            <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${milestone.color}`} />
            <span className={`font-medium ${milestone.color}`}>
              Recovery restores your {milestone.label} on all purchases & reviews
            </span>
          </div>
        )}

        <Button onClick={onRecover} className="w-full mb-2">
          <Flame className="w-4 h-4 mr-2" />
          Recover streak ({recoveryCost} pts)
        </Button>
        <button
          onClick={onDecline}
          className="w-full text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
        >
          No thanks — start fresh from day 1
        </button>
      </div>
    </div>
  );
};

export default StreakRecoveryModal;
