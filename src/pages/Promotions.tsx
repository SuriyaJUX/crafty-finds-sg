import { deals, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Tag, Clock } from "lucide-react";

const Promotions = () => {
  const discountedProducts = products.filter(p => p.originalPrice);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Deals & Promotions</h1>
      <p className="text-muted-foreground text-sm mb-8">All current offers in one place. Don't miss out!</p>

      {/* Vouchers */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {deals.map((deal, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="p-2 rounded-lg bg-primary/10">
              {deal.code ? <Tag className="w-5 h-5 text-primary" /> : <Clock className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{deal.text}</p>
              {deal.code && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use code: <span className="font-semibold text-primary">{deal.code}</span>
                </p>
              )}
            </div>
          </div>
        ))}
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
