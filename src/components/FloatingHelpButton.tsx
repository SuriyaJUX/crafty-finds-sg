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
        "fixed bottom-4 z-50 w-[100px] h-[100px]",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-4",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY — unified head + breast + pen-nib silhouette === */}
        <path
          d="
            M 72 36
            C 64 30, 50 28, 42 34
            C 34 40, 30 50, 28 56
            L 18 52
            C 22 56, 26 58, 30 60
            C 32 66, 36 74, 40 80
            C 46 90, 50 100, 52 108
            C 54 114, 56 122, 56 128
            C 56 134, 54 140, 52 146
            L 50 152
            L 54 158
            L 58 152
            C 60 146, 62 138, 62 130
            C 62 122, 60 112, 58 104
            C 56 96, 52 86, 54 78
            C 56 72, 62 64, 68 58
            C 76 50, 82 42, 80 36
            C 78 34, 76 34, 72 36
            Z
          "
          className="fill-foreground"
        />

        {/* Eye */}
        <circle cx="42" cy="44" r="4" className="fill-background" />

        {/* Nib breather hole */}
        <ellipse cx="55" cy="138" rx="2.5" ry="3.5" className="fill-background" />

        {/* Nib slit */}
        <line x1="55" y1="148" x2="54" y2="157" strokeWidth="1" className="stroke-background" />

        {/* === White separation curve from body to wings === */}
        <path
          d="
            M 62 56
            C 58 62, 54 70, 56 78
            C 58 72, 64 64, 72 58
          "
          className="stroke-background"
          strokeWidth="4"
          fill="none"
        />

        {/* === UPPER WING — dark, sweeps up-right (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "72px 56px" }}
        >
          <path
            d="
              M 70 56
              C 82 46, 100 32, 126 20
              C 140 14, 156 12, 164 18
              C 168 22, 162 30, 148 40
              C 130 52, 108 62, 86 66
              C 76 68, 70 64, 70 60
              Z
            "
            className="fill-foreground"
          />
          {/* White gap below upper wing */}
          <path
            d="
              M 70 64
              C 84 60, 106 48, 130 36
              C 114 50, 92 62, 72 70
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === MIDDLE WING — dark (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "72px 66px", animationDelay: "0.04s" }}
        >
          <path
            d="
              M 72 68
              C 86 56, 108 42, 136 28
              C 150 22, 166 22, 168 30
              C 166 38, 150 50, 130 62
              C 110 74, 88 80, 74 78
              C 70 76, 70 72, 72 68
              Z
            "
            className="fill-foreground"
          />
          {/* White gap below middle wing */}
          <path
            d="
              M 74 78
              C 90 72, 114 58, 140 44
              C 124 60, 100 74, 76 84
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === LOWER WING — teal accent (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "76px 80px", animationDelay: "0.07s" }}
        >
          <path
            d="
              M 76 82
              C 92 70, 116 54, 144 40
              C 158 34, 174 36, 172 44
              C 168 52, 150 64, 130 76
              C 110 88, 90 92, 78 90
              C 74 88, 74 86, 76 82
              Z
            "
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHERS — dark, below teal wing === */}
        <g className="fill-foreground">
          <path d="
            M 78 92
            C 94 82, 118 66, 142 54
            C 130 70, 108 84, 82 98
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
