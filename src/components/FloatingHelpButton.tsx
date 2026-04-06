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
        "fixed bottom-4 z-50 w-[96px] h-[96px]",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-4",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY – head, breast, pen nib (static) === */}
        <g className="fill-foreground">
          {/* Head – round, facing left */}
          <circle cx="30" cy="42" r="16" />

          {/* Beak – small triangle pointing left */}
          <polygon points="14,42 22,38 22,46" />

          {/* Body – streamlined S-curve from head down into pen nib */}
          <path d="
            M 38 54
            C 34 50, 26 48, 22 46
            Q 30 46, 38 48
            C 50 50, 58 56, 60 64
            C 62 70, 60 78, 56 86
            L 50 86
            C 54 78, 56 70, 54 64
            C 52 58, 44 54, 38 54
            Z
          " />

          {/* Pen nib – tapers to sharp point downward */}
          <path d="
            M 56 86
            C 58 92, 58 100, 56 108
            L 54 114
            L 50 104
            C 48 96, 48 90, 50 86
            Z
          " />

          {/* Nib sharp tip */}
          <polygon points="56,108 54,118 52,112" />

          {/* Nib breather hole */}
          <ellipse cx="53" cy="98" rx="2" ry="2.8" className="fill-background" />

          {/* Nib slit line */}
          <line x1="55" y1="108" x2="54" y2="117" strokeWidth="0.7" className="stroke-background" />
        </g>

        {/* Eye */}
        <circle cx="24" cy="39" r="3" className="fill-background" />

        {/* === UPPER WING – dark, sweeps up-right (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "42px 48px" }}
        >
          <path
            d="
              M 42 48
              C 52 40, 68 28, 86 18
              C 96 12, 106 14, 104 20
              C 100 26, 88 36, 74 44
              C 60 52, 48 54, 42 52
              Z
            "
            className="fill-foreground"
          />
          {/* White separation S-curve */}
          <path
            d="M 42 52 C 52 48, 66 38, 80 30
               C 72 40, 58 50, 44 56 Z"
            className="fill-background"
          />
        </g>

        {/* === MIDDLE WING – dark (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "44px 54px", animationDelay: "0.04s" }}
        >
          <path
            d="
              M 44 56
              C 56 46, 72 34, 90 24
              C 100 18, 108 22, 106 28
              C 102 34, 88 44, 72 54
              C 60 62, 50 62, 44 60
              Z
            "
            className="fill-foreground"
          />
          {/* White separation S-curve */}
          <path
            d="M 44 60 C 54 56, 68 46, 82 38
               C 76 48, 62 58, 46 64 Z"
            className="fill-background"
          />
        </g>

        {/* === LOWER WING – teal accent (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "46px 62px", animationDelay: "0.07s" }}
        >
          <path
            d="
              M 46 64
              C 58 54, 76 40, 94 30
              C 104 24, 112 28, 108 34
              C 104 42, 90 52, 74 62
              C 62 70, 52 70, 46 68
              Z
            "
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHERS – dark, below wings === */}
        <g className="fill-foreground">
          <path d="
            M 48 70
            C 58 62, 72 52, 86 44
            C 78 56, 64 66, 50 74
            Z
          " />
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
