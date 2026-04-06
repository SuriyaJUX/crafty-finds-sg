import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StreakRecoveryModal from "@/components/StreakRecoveryModal";

const Login = () => {
  const [email, setEmail]               = useState("rachel.ng@email.com");
  const [password, setPassword]         = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [streakRecovery, setStreakRecovery] = useState<{
    previousStreak: number;
    recoveryCost: number;
    userPoints: number;
  } | null>(null);

  // Flag to distinguish a just-completed login from other user updates
  const loginAttemptedRef = useRef(false);

  const { user, login }                                       = useAuth();
  const { checkStreakStatus, checkAndUpdateStreak, recoverStreak } = useInkPoints();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { toast }  = useToast();

  const rawFrom = (location.state as { from?: string })?.from;
  const destination = (!rawFrom || rawFrom === "/") ? "/account" : rawFrom;

  // ── Run streak logic exactly once, after user state is populated ──────────
  useEffect(() => {
    if (!loginAttemptedRef.current || !user) return;
    loginAttemptedRef.current = false;

    const status = checkStreakStatus();

    if (status.canRecover) {
      setStreakRecovery({
        previousStreak: status.previousStreak,
        recoveryCost:   status.recoveryCost,
        userPoints:     user.loyaltyPoints,
      });
      return; // wait for modal action before navigating
    }

    // Normal path — streak continues or resets
    const pts = checkAndUpdateStreak();
    if (pts > 0) {
      toast({ title: "Welcome back! 🔥", description: `+${pts} Ink Points for today's login.` });
    }
    navigate(destination, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Set the flag BEFORE awaiting so it's in place when useEffect([user]) fires
    loginAttemptedRef.current = true;
    const success = await login(email, password);
    setLoading(false);
    if (!success) { loginAttemptedRef.current = false; return; }
  };

  // ── Recovery modal actions ────────────────────────────────────────────────
  const handleRecover = () => {
    if (!streakRecovery) return;
    const ok = recoverStreak(streakRecovery.previousStreak);
    setStreakRecovery(null);
    if (ok) {
      toast({
        title: "Streak recovered! 🔥",
        description: `Your ${streakRecovery.previousStreak + 1}-day streak is back.`,
      });
    }
    navigate(destination, { replace: true });
  };

  const handleDeclineRecovery = () => {
    setStreakRecovery(null);
    const pts = checkAndUpdateStreak(); // resets to day 1
    if (pts > 0) {
      toast({ title: "Welcome back!", description: `+${pts} Ink Points. Fresh start from day 1.` });
    }
    navigate(destination, { replace: true });
  };

  const fromCheckout =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof (location.state as { from?: string }).from === "string" &&
    (location.state as { from: string }).from.includes("checkout");

  return (
    <>
      {streakRecovery && (
        <StreakRecoveryModal
          previousStreak={streakRecovery.previousStreak}
          recoveryCost={streakRecovery.recoveryCost}
          userPoints={streakRecovery.userPoints}
          onRecover={handleRecover}
          onDecline={handleDeclineRecovery}
        />
      )}

      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {fromCheckout && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Note &amp; Gale account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>

          <div className="mt-8 rounded-lg bg-muted/50 border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">
              🎁 <span className="font-medium text-foreground">Demo mode</span> — pre-filled with Rachel Ng's account. Just click Sign in!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
