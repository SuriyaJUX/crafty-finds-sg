import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

const PersonalisedDeals = () => {
  const { items } = useCart();

  // Products with a genuine discount
  const discounted = products.filter(
    p => p.originalPrice !== undefined && p.originalPrice > p.price && p.inStock
  );

  if (discounted.length < 2) return null;

  // Most recently carted category (last unique item added = last in items array)
  const lastCategory = items.length > 0 ? items[items.length - 1].product.category : null;

  // Prioritise matching category, fill remainder from the rest
  const prioritised = lastCategory
    ? [
        ...discounted.filter(p => p.category === lastCategory),
        ...discounted.filter(p => p.category !== lastCategory),
      ]
    : discounted;

  const shown = prioritised.slice(0, 4);

  return (
    <section className="container max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-2xl">Deals picked for you</h2>
        </div>
        <Link
          to="/promotions"
          className="text-sm text-primary font-medium hover:underline"
        >
          View all deals
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x scroll-smooth">
        {shown.map(p => (
          <div key={p.id} className="flex-none w-48 md:w-56 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PersonalisedDeals;
