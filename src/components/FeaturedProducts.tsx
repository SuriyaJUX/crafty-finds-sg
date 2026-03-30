import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FeaturedProducts = () => {
  const featured = products.filter(p => p.isCommunityFavourite).slice(0, 4);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16">
      <div ref={ref} className="container max-w-6xl mx-auto px-4">
        <div
          className={`flex items-end justify-between mb-8 transition-[opacity,transform] duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <h2 className="font-serif text-3xl mb-1">Community Favourites</h2>
            <p className="text-muted-foreground text-sm">The most loved products by our community</p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className={`transition-[opacity,transform] duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: visible ? `${100 + index * 100}ms` : "0ms" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Link to="/shop" className="md:hidden mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
