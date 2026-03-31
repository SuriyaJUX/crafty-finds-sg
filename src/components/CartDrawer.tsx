import { useState } from "react";
import { X, Minus, Plus, Trash2, ArrowRight, Check, EyeOff } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 3.50;

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, toggleSaved, subtotal } = useCart();
  const navigate = useNavigate();
  const [justWhatINeed, setJustWhatINeed] = useState(false);
  // Track which product id just got "saved to wishlist" confirmation
  const [savedConfirmId, setSavedConfirmId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Savings across all items that have an originalPrice
  const totalSavings = items.reduce((acc, item) => {
    const { product, isStartSmall, quantity } = item;
    if (product.originalPrice) {
      const effectivePrice = isStartSmall && product.startSmallPrice
        ? product.startSmallPrice
        : product.price;
      return acc + (product.originalPrice - effectivePrice) * quantity;
    }
    return acc;
  }, 0);

  // Pairs-well-with suggestions (deduped, not already in cart)
  const suggestions = items
    .flatMap(i => (i.product.pairsWellWith || []).map(id => products.find(p => p.id === id)))
    .filter((p, i, arr) =>
      p &&
      !items.find(ci => ci.product.id === p!.id) &&
      arr.findIndex(x => x?.id === p!.id) === i
    )
    .slice(0, 3);

  const handleSaveForLater = (productId: string, product: any) => {
    toggleSaved(product);
    setSavedConfirmId(productId);
    // Remove after 2 s so the confirmation is visible inside the row first
    setTimeout(() => {
      removeItem(productId);
      setSavedConfirmId(prev => (prev === productId ? null : prev));
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-50" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-xl">Your Cart</h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => setJustWhatINeed(v => !v)}
                title={justWhatINeed ? "Show suggestions" : "Hide suggestions"}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  justWhatINeed
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <EyeOff className="w-3 h-3" />
                Just what I need
              </button>
            )}
            <button onClick={() => setIsCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shipping progress — always shown when cart has items */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-border">
            {remaining === 0 ? (
              <p className="flex items-center gap-1.5 text-sm text-secondary font-medium mb-2">
                <Check className="w-3.5 h-3.5" />
                You've unlocked free shipping
              </p>
            ) : remaining < SHIPPING_FEE && !justWhatINeed ? (
              <p className="text-sm text-secondary font-medium mb-2">
                Add <span className="font-bold">S${remaining.toFixed(2)}</span> more for free shipping — cheaper than paying S${SHIPPING_FEE.toFixed(2)} delivery
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">S${remaining.toFixed(2)}</span> away from free shipping
              </p>
            )}
            <Progress
              value={shippingProgress}
              className={`h-1.5 ${remaining === 0 ? "bg-secondary/20" : "bg-muted"}`}
            />
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Start shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const { product, isStartSmall, quantity } = item;
                const price = isStartSmall && product.startSmallPrice
                  ? product.startSmallPrice
                  : product.price;
                const isSavedConfirm = savedConfirmId === product.id;

                return (
                  <div key={product.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                    <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>

                      {/* Start Small note */}
                      {product.hasStartSmall && product.startSmallPrice && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Full set: S${product.price.toFixed(2)} · Essentials: S${product.startSmallPrice.toFixed(2)}
                        </p>
                      )}
                      {isStartSmall && (
                        <p className="text-xs text-secondary">Essentials version</p>
                      )}

                      <p className="text-sm font-semibold mt-1">S${price.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 rounded border border-border hover:bg-muted"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 rounded border border-border hover:bg-muted"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Save for later */}
                      <div className="mt-1.5">
                        {isSavedConfirm ? (
                          <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                            <Check className="w-3 h-3" /> Saved to wishlist
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSaveForLater(product.id, product)}
                            className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline"
                          >
                            Save for later
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pairs well with — hidden in "Just what I need" mode */}
              {!justWhatINeed && suggestions.length > 0 && (
                <div className="pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Pairs well with</p>
                  <div className="space-y-2">
                    {suggestions.map(p => p && (
                      <PairSuggestion key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">S${subtotal.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <p className="text-sm text-secondary font-medium text-right -mt-1">
                You're saving S${totalSavings.toFixed(2)} on this order
              </p>
            )}
            <button
              onClick={() => { setIsCartOpen(false); navigate("/checkout/details"); }}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-95 transition-[opacity,transform]"
            >
              Checkout — S${subtotal.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const PairSuggestion = ({ product }: { product: any }) => {
  const { addItem } = useCart();
  return (
    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
      <div className="w-10 h-10 rounded bg-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">S${product.price.toFixed(2)}</p>
      </div>
      <button onClick={() => addItem(product)} className="text-xs font-medium text-primary hover:underline">
        Add
      </button>
    </div>
  );
};

export default CartDrawer;
