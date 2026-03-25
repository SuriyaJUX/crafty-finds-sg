import { Link } from "react-router-dom";
import { BookOpen, Palette, PenTool } from "lucide-react";

const paths = [
  { key: "journalling", label: "Journalling", icon: BookOpen, desc: "Notebooks, fineliners, stickers & planning tools" },
  { key: "illustration", label: "Illustration", icon: Palette, desc: "Sketchbooks, inks, watercolours & drawing pens" },
  { key: "lettering", label: "Lettering", icon: PenTool, desc: "Brush pens, calligraphy sets & practice pads" },
];

const CreativePathsPreview = () => (
  <section className="py-16">
    <div className="container max-w-6xl mx-auto px-4">
      <h2 className="font-serif text-3xl mb-2 text-center">Find Your Creative Path</h2>
      <p className="text-muted-foreground text-center mb-10 text-sm">Curated collections for every kind of maker</p>
      <div className="grid md:grid-cols-3 gap-4">
        {paths.map(p => (
          <Link
            key={p.key}
            to={`/creative-paths?path=${p.key}`}
            className="group p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-all hover:shadow-sm"
          >
            <p.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-serif text-xl mb-2">{p.label}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CreativePathsPreview;
