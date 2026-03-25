import { communityPickOfMonth } from "@/data/products";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CommunityPick = () => {
  const { product, customerName, customerNote, projectDescription } = communityPickOfMonth;

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Community Pick of the Month</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square rounded-xl bg-muted overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-3xl mb-2">{product.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-badge-community text-badge-community" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
            </div>
            <p className="text-2xl font-semibold mb-6">S${product.price.toFixed(2)}</p>
            <blockquote className="border-l-2 border-primary pl-4 mb-4">
              <p className="text-muted-foreground italic leading-relaxed">"{customerNote}"</p>
            </blockquote>
            <p className="text-sm text-muted-foreground mb-1">— {customerName}</p>
            <p className="text-xs text-muted-foreground mb-6">Project: {projectDescription}</p>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              View product <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPick;
