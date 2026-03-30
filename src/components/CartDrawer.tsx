import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Link, useNavigate } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 50;

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  // Get "pairs well with" suggestions from current cart items
  const suggestions = items.flatMap(i => {
    const pairIds = i.product.pairsWellWith || [];
    return pairIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  }).filter((p, i, arr) => p && !items.find(ci => ci.product.id === p!.id) && arr.findIndex(x => x!.id === p!.id) === i)
    .slice(0, 3);

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-50" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-xl">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipping progress */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-border">
            {remaining > 0 ? (
              <p className="text-sm text-muted-foreground mb-2">
                Add <span className="font-semibold text-foreground">S${remaining.toFixed(2)}</span> more for free shipping
              </p>
            ) : (
              <p className="text-sm text-secondary font-medium mb-2">🎉 You qualify for free shipping!</p>
            )}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>
        )}

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
                const price = item.isStartSmall && item.product.startSmallPrice ? item.product.startSmallPrice : item.product.price;
                return (
                  <div key={item.product.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                    <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      {item.isStartSmall && <p className="text-xs text-secondary">Essentials version</p>}
                      <p className="text-sm font-semibold mt-1">S${price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded border border-border hover:bg-muted">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded border border-border hover:bg-muted">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pairs well with */}
              {suggestions.length > 0 && (
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

        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">S${subtotal.toFixed(2)}</span>
            </div>
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
