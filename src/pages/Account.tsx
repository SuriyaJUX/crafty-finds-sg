import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Navigate, Link } from "react-router-dom";
import { Gift, LogIn, Star, ShoppingBag, Heart, MapPin, Trophy, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const tierColors: Record<string, string> = {
  Bronze: "text-amber-700",
  Silver: "text-gray-500",
  Gold: "text-yellow-500",
  Platinum: "text-purple-500",
};

const pointIcons: Record<string, React.ReactNode> = {
  gift: <Gift className="w-4 h-4" />,
  "log-in": <LogIn className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
  "shopping-bag": <ShoppingBag className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
};

const Account = () => {
  const { user, logout } = useAuth();
  const { savedItems } = useCart();

  if (!user) return <Navigate to="/login" replace />;

  const progressPercent = Math.min((user.tierProgress / user.tierThreshold) * 100, 100);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
          {user.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-2xl">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">@{user.username} · Member since {format(new Date(user.memberSince), "MMM yyyy")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Loyalty Points Card */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${tierColors[user.loyaltyTier]}`} />
              <h2 className="font-serif text-lg">{user.loyaltyTier} Member</h2>
            </div>
            <span className="text-2xl font-bold text-primary">{user.loyaltyPoints} pts</span>
          </div>

          <div className="mb-2">
            <Progress value={progressPercent} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            {user.tierThreshold - user.tierProgress} more points to reach{" "}
            <span className="font-medium text-foreground">
              {user.loyaltyTier === "Bronze" ? "Silver" : user.loyaltyTier === "Silver" ? "Gold" : "Platinum"}
            </span>{" "}
            tier
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Points history</h3>
            {user.pointsHistory.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  {pointIcons[entry.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{entry.label}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry.date), "d MMM yyyy")}</p>
                </div>
                <span className="font-semibold text-secondary">+{entry.points}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">How to earn more:</span> Shop (+1 pt per S$1), write reviews (+15 pts), refer friends (+100 pts), daily logins (+5 pts)
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Order History</h2>
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>

          {user.orderHistory.length > 0 ? (
            <div className="space-y-3">
              {user.orderHistory.map(order => (
                <div key={order.id} className="border border-border rounded-lg p-3">
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(order.date), "d MMM yyyy")}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Your first order awaits!</p>
              <Link to="/shop">
                <Button size="sm" variant="outline">
                  Browse products <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Saved Items */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Saved Items</h2>
            <Heart className="w-5 h-5 text-muted-foreground" />
          </div>

          {savedItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {savedItems.length} item{savedItems.length !== 1 && "s"} in your wishlist
              </p>
              <Link to="/wishlist">
                <Button size="sm" variant="outline">
                  View wishlist <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Save items you love</p>
              <Link to="/shop">
                <Button size="sm" variant="outline">
                  Explore <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="rounded-xl border border-border bg-card p-5 col-span-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Delivery Addresses</h2>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {user.addresses.map(addr => (
              <div key={addr.id} className="flex items-start gap-3 border border-border rounded-lg p-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="ml-2 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{addr.line1}</p>
                  {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                  <p className="text-sm text-muted-foreground">Singapore {addr.postalCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
