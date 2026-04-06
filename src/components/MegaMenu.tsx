import { Link } from "react-router-dom";
import { ArrowRight, Pen, BookOpen, Palette, FileText, Pencil, Paintbrush, Package, Eraser, BookMarked, Layers, Type } from "lucide-react";
import { products } from "@/data/products";

// ── Categories ──────────────────────────────────────────────
const CATEGORIES = [
  { label: "Pens & Markers",   icon: Pen,        path: "/shop?category=Pens+%26+Markers" },
  { label: "Notebooks",        icon: BookOpen,   path: "/shop?category=Notebooks" },
  { label: "Paints",           icon: Palette,    path: "/shop?category=Paints" },
  { label: "Paper & Pads",     icon: FileText,   path: "/shop?category=Paper+%26+Pads" },
  { label: "Coloured Pencils", icon: Pencil,     path: "/shop?category=Coloured+Pencils" },
  { label: "Brushes",          icon: Paintbrush, path: "/shop?category=Brushes" },
  { label: "Pencils",          icon: Pencil,     path: "/shop?category=Pencils" },
  { label: "Erasers",          icon: Eraser,     path: "/shop?category=Erasers" },
  { label: "Office Supplies",  icon: Package,    path: "/shop?category=Office+Supplies" },
];

// ── Grouped creative paths (card-sorting research: Writing / Art) ────────────
const PATH_GROUPS = [
  {
    group: "Writing",
    accent: "text-secondary",
    headerBg: "bg-secondary/10",
    paths: [
      {
        label: "Journalling",
        icon: BookMarked,
        path: "/shop?path=journalling",
        description: "Bullet journals, stickers & more",
      },
      {
        label: "Lettering",
        icon: Type,
        path: "/shop?path=lettering",
        description: "Brush pens, nibs & calligraphy",
      },
    ],
  },
  {
    group: "Art",
    accent: "text-primary",
    headerBg: "bg-primary/10",
    paths: [
      {
        label: "Illustration",
        icon: Layers,
        path: "/shop?path=illustration",
        description: "Paints, brushes & drawing tools",
      },
    ],
  },
];

// ── Top-rated trending products ──────────────────────────────
const trending = [...products]
  .sort((a, b) => b.rating - a.rating || b.purchaseCount - a.purchaseCount)
  .slice(0, 3);

interface MegaMenuProps {
  onClose: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => (
  <div
    className="absolute left-0 top-full w-full bg-card border-b border-border shadow-xl z-40 animate-fade-in"
    onMouseLeave={onClose}
  >
    <div className="container max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-8">

      {/* ── Col 1: Categories ── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Browse by category
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {CATEGORIES.map(({ label, icon: Icon, path }) => (
            <li key={label}>
              <Link
                to={path}
                onClick={onClose}
                className="flex items-center gap-2 py-1.5 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/shop"
          onClick={onClose}
          className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-primary hover:underline"
        >
          View all products <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Col 2: Writing & Art groups ── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Shop by interest
        </p>
        <div className="flex flex-col gap-4">
          {PATH_GROUPS.map(({ group, accent, headerBg, paths }) => (
            <div key={group}>
              {/* Group heading pill */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${headerBg} mb-2`}>
                <span className={`text-xs font-bold uppercase tracking-wide ${accent}`}>{group}</span>
              </div>
              {/* Paths within group */}
              <div className="flex flex-col gap-1 pl-1">
                {paths.map(({ label, icon: Icon, path, description }) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted transition-colors group"
                  >
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-muted group-hover:bg-background/80 ${accent}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Col 3: Trending now ── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Trending now
        </p>
        <div className="flex flex-col gap-2">
          {trending.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <span className="text-xs font-bold text-primary flex-shrink-0">
                S${p.price.toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
        <Link
          to="/promotions"
          onClick={onClose}
          className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-secondary hover:underline"
        >
          View current deals <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  </div>
);

export default MegaMenu;
