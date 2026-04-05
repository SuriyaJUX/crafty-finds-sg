import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn, ArrowLeft, Target, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("rachel.ng@email.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoalBanner, setShowGoalBanner] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      // Only award daily login points once per calendar day
      const today = new Date().toISOString().slice(0, 10);
      const lastAwarded = localStorage.getItem("lastLoginAwardDate");
      if (lastAwarded !== today) {
        localStorage.setItem("lastLoginAwardDate", today);
        toast({ title: "Welcome back! 🎉", description: "You've earned +10 loyalty points for logging in." });
      }

      // Check if user has a points goal set — read from localStorage mock user
      const stored = localStorage.getItem("paperly_user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          if (!userData.pointsGoal) {
            setShowGoalBanner(true);
            // Auto-navigate after a short delay to let them see the banner
            setTimeout(() => {
              setShowGoalBanner(false);
              navigate(location.state?.from ?? "/account");
            }, 4000);
            return;
          }
        } catch { /* ignore */ }
      }

      navigate(location.state?.from ?? "/account");
    }
  };

  const fromCheckout = typeof location.state === "object" && location.state !== null &&
    "from" in location.state && typeof (location.state as any).from === "string" &&
    (location.state as any).from.includes("checkout");

  return (
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

        {/* Goal banner */}
        {showGoalBanner && (
          <div className="flex items-start gap-3 rounded-lg border border-secondary/30 bg-secondary/5 p-3 mb-6 animate-fade-in">
            <Target className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm">
                You haven't set a points goal yet — <Link to="/account" className="text-primary font-medium hover:underline" onClick={() => setShowGoalBanner(false)}>set one</Link> to track your progress toward a free product.
              </p>
            </div>
            <button onClick={() => { setShowGoalBanner(false); navigate(location.state?.from ?? "/account"); }} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your Paperly account</p>
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
  );
};

export default Login;
