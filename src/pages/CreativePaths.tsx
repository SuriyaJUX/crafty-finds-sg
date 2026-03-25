import { useSearchParams } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { BookOpen, Palette, PenTool } from "lucide-react";
import { useState } from "react";

const pathsConfig = [
  { key: "journalling", label: "Journalling", icon: BookOpen, desc: "Express yourself through daily writing, planning, and creative documentation." },
  { key: "illustration", label: "Illustration", icon: Palette, desc: "Bring your visual ideas to life with the right tools for drawing and painting." },
  { key: "lettering", label: "Lettering", icon: PenTool, desc: "Master the art of beautiful writing with brush pens, inks, and practice materials." },
] as const;

const CreativePaths = () => {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("path") || "";
  const [selected, setSelected] = useState<string>(initial);

  const filteredProducts = selected
    ? products.filter(p => p.creativePath === selected)
    : products.filter(p => p.creativePath);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Creative Paths</h1>
      <p className="text-muted-foreground text-sm mb-8">Choose your path and discover products curated for your practice.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {pathsConfig.map(p => (
          <button
            key={p.key}
            onClick={() => setSelected(selected === p.key ? "" : p.key)}
            className={`text-left p-6 rounded-xl border transition-all ${
              selected === p.key
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <p.icon className={`w-7 h-7 mb-3 ${selected === p.key ? "text-primary" : "text-muted-foreground"}`} />
            <h3 className="font-serif text-lg mb-1">{p.label}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filteredProducts.length} products{selected ? ` for ${selected}` : ""}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CreativePaths;
