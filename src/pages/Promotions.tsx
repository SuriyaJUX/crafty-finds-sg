import { useState } from "react";
import { deals, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Tag, Clock, Check } from "lucide-react";

const Promotions = () => {
  const discountedProducts = products.filter(p => p.originalPrice);
  const [claimedCodes, setClaimedCodes] = useState<Set<string>>(new Set());

  const handleClaim = (code: string) => {
    localStorage.setItem("pendingVoucher", code);
    setClaimedCodes(prev => new Set(prev).add(code));
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Deals & Promotions</h1>
      <p className="text-muted-foreground text-sm mb-8">All current offers in one place. Don't miss out!</p>

      {/* Vouchers */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {deals.map((deal, i) => {
          const claimed = deal.code ? claimedCodes.has(deal.code) : false;
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                {deal.code ? <Tag className="w-5 h-5 text-primary" /> : <Clock className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{deal.text}</p>
                {deal.code && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Use code: <span className="font-semibold text-primary">{deal.code}</span>
                  </p>
                )}
              </div>
              {deal.code && (
                <button
                  onClick={() => handleClaim(deal.code!)}
                  disabled={claimed}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    claimed
                      ? "bg-secondary/10 text-secondary cursor-default"
                      : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
                  }`}
                >
                  {claimed ? (
                    <><Check className="w-3 h-3" /> Claimed</>
                  ) : (
                    "Claim"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Discounted products */}
      <h2 className="font-serif text-2xl mb-6">On Sale Now</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {discountedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Promotions;
