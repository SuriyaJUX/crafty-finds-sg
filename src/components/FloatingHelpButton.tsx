import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

const FloatingHelpButton = () => {
  const navigate = useNavigate();
  const { isCartOpen } = useCart();
  const [isFlapping, setIsFlapping] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setIsFlapping(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsFlapping(false), 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/help")}
      aria-label="Help & support"
      className={[
        "fixed bottom-6 z-50 w-14 h-14 rounded-full",
        "bg-card shadow-lg border border-border",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-6",
      ].join(" ")}
    >
      {/* Notingale bird SVG – facing left */}
      <svg
        viewBox="0 0 64 64"
        className="w-10 h-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body – head, torso, pen-nib beak */}
        <g className="fill-foreground">
          {/* Head */}
          <ellipse cx="24" cy="20" rx="8" ry="7.5" />
          {/* Eye */}
          <circle cx="21" cy="18.5" r="1.8" className="fill-card" />
          {/* Pen-nib beak pointing down-left */}
          <path d="M16 24 L12 34 L14.5 33 L17 28 Z" />
          <path d="M12 34 L10 38 L14.5 33 Z" />
          {/* Torso */}
          <path d="M28 25 Q36 28 38 36 Q34 38 28 36 Q24 32 24 26 Z" />
          {/* Tail feathers – flowing curves */}
          <path d="M38 34 Q44 30 48 26 Q46 32 42 36 Q40 37 38 36 Z" />
          <path d="M40 36 Q46 34 52 28 Q50 36 44 40 Q42 40 40 38 Z" />
          <path d="M36 38 Q42 38 46 44 Q40 44 36 40 Z" />
        </g>

        {/* Wing group – animated on scroll */}
        <g
          className={[
            "fill-foreground/80 origin-[28px_26px]",
            isFlapping ? "animate-flap" : "",
          ].join(" ")}
          style={{ transformOrigin: "28px 26px" }}
        >
          {/* Upper wing feathers */}
          <path d="M26 24 Q22 16 18 10 Q26 14 30 20 Z" />
          <path d="M28 22 Q26 14 24 6 Q32 12 32 20 Z" />
          <path d="M30 22 Q30 12 32 4 Q36 12 34 20 Z" />
        </g>
      </svg>

      {/* Desktop tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        Help &amp; support
      </span>
    </button>
  );
};

export default FloatingHelpButton;
