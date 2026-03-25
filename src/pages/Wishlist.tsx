import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { savedItems } = useCart();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Saved for Later</h1>
      <p className="text-muted-foreground text-sm mb-8">Items you've bookmarked</p>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {savedItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
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
    </div>
  );
};

export default Wishlist;
