import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import { Heart, Target, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const REDEMPTION_RATE = 200;

const Wishlist = () => {
  const { savedItems } = useCart();
  const { user, isAuthenticated, patchUser } = useAuth();

  const goalProductId = user?.pointsGoal?.targetProductId ?? null;
  const goalProduct = goalProductId
    ? products.find(p => p.id === goalProductId) ?? null
    : null;

  const totalPtsNeeded = goalProduct ? Math.ceil(goalProduct.price * REDEMPTION_RATE) : 0;
  const currentPts = user?.loyaltyPoints ?? 0;
  const progressPct = totalPtsNeeded > 0 ? Math.min(100, (currentPts / totalPtsNeeded) * 100) : 0;
  const remaining = Math.max(0, totalPtsNeeded - currentPts);

  const setGoal = (productId: string, price: number) => {
    patchUser(prev => ({
      ...prev,
      pointsGoal: {
        targetAmount: Math.ceil(price * REDEMPTION_RATE),
        targetProductId: productId,
      },
    }));
  };

  const clearGoal = () => {
    patchUser(prev => ({ ...prev, pointsGoal: null }));
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Saved for Later</h1>
      <p className="text-muted-foreground text-sm mb-6">Items you've bookmarked</p>

      {/* Goal progress banner */}
      {isAuthenticated && goalProduct && savedItems.some(s => s.id === goalProductId) && (
        <Card className="mb-6 border-primary/20 bg-primary/[0.03]">
          <CardContent className="p-4 flex items-center gap-4">
            <img
              src={goalProduct.image}
              alt={goalProduct.name}
              className="w-14 h-14 rounded-md object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">Saving for {goalProduct.name}</span>
              </div>
              <Progress value={progressPct} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">
                {currentPts.toLocaleString()} / {totalPtsNeeded.toLocaleString()} pts
                {remaining > 0 && <span> · {remaining.toLocaleString()} pts to go</span>}
                {remaining === 0 && <span className="text-primary font-medium"> · Ready to redeem!</span>}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={clearGoal}>
              <X className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {savedItems.map(product => {
            const isGoal = goalProductId === product.id;
            return (
              <div key={product.id} className="flex flex-col">
                <div className={isGoal ? "ring-2 ring-primary/30 rounded-lg" : ""}>
                  <ProductCard product={product} />
                </div>
                {isAuthenticated ? (
                  isGoal ? (
                    <Badge className="mt-2 self-start bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                      <Target className="w-3 h-3 mr-1" /> Current Goal
                    </Badge>
                  ) : (
                    <button
                      onClick={() => setGoal(product.id, product.price)}
                      className="mt-2 self-start inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Set as Ink Goal
                    </button>
                  )
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-10 h-10 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">You haven't saved any items yet.</p>
          <Link to="/shop" className="text-sm text-primary font-medium hover:underline">
            Browse products
          </Link>
        </div>
      )}

      {/* Guest hint */}
      {!isAuthenticated && savedItems.length > 0 && (
        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <LogIn className="w-4 h-4" />
            Log in to set savings goals
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
