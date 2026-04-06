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
        "fixed bottom-4 z-50 w-[110px] h-[110px]",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-4",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY — smooth head + breast + pen nib as one shape === */}
        <path
          d="
            M 68 38
            C 56 32, 40 34, 32 44
            C 24 54, 22 60, 16 62
            L 8 58
            C 12 62, 18 66, 24 66
            C 28 66, 30 68, 32 72
            C 38 84, 42 96, 46 108
            C 50 118, 54 128, 56 138
            C 58 148, 58 156, 56 164
            C 54 170, 52 176, 54 182
            L 56 190
            L 60 182
            C 62 176, 64 168, 64 160
            C 64 150, 62 140, 60 130
            C 58 120, 54 108, 56 98
            C 58 88, 66 76, 76 68
            C 84 62, 88 52, 84 42
            C 82 38, 76 36, 68 38
            Z
          "
          className="fill-foreground"
        />

        {/* Eye */}
        <circle cx="40" cy="50" r="5" className="fill-background" />

        {/* Pen nib breather hole */}
        <ellipse cx="58" cy="168" rx="2.5" ry="3.5" className="fill-background" />

        {/* Pen nib slit */}
        <line x1="57" y1="180" x2="56" y2="189" strokeWidth="1.2" className="stroke-background" />

        {/* === White S-curve separating body from wings === */}
        <path
          d="
            M 76 60
            C 70 68, 60 82, 58 94
            C 64 84, 74 72, 86 64
          "
          className="fill-background"
        />

        {/* === UPPER WING — dark, broad sweep to upper-right === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "82px 60px" }}
        >
          <path
            d="
              M 82 58
              C 96 46, 118 30, 148 18
              C 164 12, 180 10, 186 16
              C 190 22, 182 32, 166 44
              C 144 60, 118 72, 94 76
              C 86 78, 80 72, 82 66
              Z
            "
            className="fill-foreground"
          />
          {/* White separation below upper wing */}
          <path
            d="
              M 82 72
              C 98 66, 122 52, 152 36
              C 138 50, 110 66, 84 78
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === MIDDLE WING — dark, broad sweep === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "84px 72px", animationDelay: "0.04s" }}
        >
          <path
            d="
              M 84 74
              C 100 60, 126 44, 156 30
              C 172 22, 188 24, 188 32
              C 186 42, 168 56, 146 70
              C 122 84, 98 92, 86 88
              C 82 86, 82 80, 84 74
              Z
            "
            className="fill-foreground"
          />
          {/* White separation below middle wing */}
          <path
            d="
              M 86 88
              C 104 80, 130 64, 160 48
              C 146 64, 118 82, 88 94
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === LOWER WING — teal accent, broad sweep === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "88px 88px", animationDelay: "0.07s" }}
        >
          <path
            d="
              M 88 92
              C 106 76, 134 58, 164 44
              C 180 36, 196 40, 194 48
              C 190 58, 172 72, 150 86
              C 126 100, 102 108, 90 104
              C 86 102, 86 96, 88 92
              Z
            "
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHERS — dark, below wings === */}
        <g className="fill-foreground">
          <path d="
            M 90 106
            C 108 94, 136 76, 162 62
            C 148 80, 122 98, 94 112
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
