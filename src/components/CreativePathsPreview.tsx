import { Link } from "react-router-dom";
import { BookOpen, Palette, PenTool } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const paths = [
  { key: "journalling", label: "Journalling", icon: BookOpen, desc: "Notebooks, fineliners, stickers & planning tools" },
  { key: "illustration", label: "Illustration", icon: Palette, desc: "Sketchbooks, inks, watercolours & drawing pens" },
  { key: "lettering", label: "Lettering", icon: PenTool, desc: "Brush pens, calligraphy sets & practice pads" },
];

const CreativePathsPreview = () => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16">
      <div ref={ref} className="container max-w-6xl mx-auto px-4">
        <h2
          className={`font-serif text-3xl mb-2 text-center transition-[opacity,transform] duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Find Your Creative Path
        </h2>
        <p
          className={`text-muted-foreground text-center mb-10 text-sm transition-[opacity,transform] duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: visible ? "80ms" : "0ms" }}
        >
          Curated collections for every kind of maker
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {paths.map((p, index) => (
            <div
              key={p.key}
              className={`transition-[opacity,transform] duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: visible ? `${150 + index * 100}ms` : "0ms" }}
            >
              <Link
                to={`/shop?path=${p.key}`}
                className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-[border-color,box-shadow,transform] duration-300"
              >
                <p.icon className="w-8 h-8 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-serif text-xl mb-2">{p.label}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreativePathsPreview;
