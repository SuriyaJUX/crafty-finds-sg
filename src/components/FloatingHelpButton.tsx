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
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY — round head + flowing breast + pen nib === */}
        <path
          d="
            M 58 16
            C 44 12, 26 18, 16 30
            C 8 40, 4 44, 2 42
            L -6 38
            L 2 44
            C 6 48, 12 52, 18 54
            C 22 56, 24 62, 26 70
            C 30 82, 32 92, 34 102
            C 36 112, 40 122, 46 132
            C 52 142, 60 152, 68 162
            C 76 170, 82 178, 86 184
            L 88 190
            L 94 184
            C 96 178, 96 170, 94 162
            C 90 150, 84 138, 80 126
            C 76 114, 74 102, 74 90
            C 74 78, 76 68, 80 58
            C 84 48, 82 34, 76 24
            C 72 16, 64 14, 58 16
            Z
          "
          className="fill-foreground"
        />

        {/* Eye — white dot */}
        <circle cx="32" cy="34" r="5" className="fill-background" />

        {/* Nib breather hole */}
        <ellipse cx="90" cy="174" rx="2.5" ry="3.5" className="fill-background" />

        {/* Nib slit */}
        <line x1="89" y1="184" x2="88" y2="189" strokeWidth="1" className="stroke-background" />

        {/* === White S-curves separating body from wings === */}
        <path
          d="
            M 74 52
            C 70 62, 70 74, 74 86
            C 80 74, 84 62, 82 50
          "
          className="fill-background"
        />

        {/* === UPPER WING — dark, sweeps upper-right === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "78px 46px" }}
        >
          <path
            d="
              M 76 44
              C 92 32, 116 18, 148 8
              C 166 2, 184 4, 186 12
              C 186 20, 172 32, 150 46
              C 126 62, 98 68, 80 58
              C 76 54, 76 48, 76 44
              Z
            "
            className="fill-foreground"
          />
          {/* White separation below upper wing */}
          <path
            d="
              M 80 58
              C 96 52, 124 38, 158 24
              C 140 42, 110 58, 82 66
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === MIDDLE WING — dark === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "82px 60px", animationDelay: "0.04s" }}
        >
          <path
            d="
              M 82 62
              C 100 48, 128 32, 160 20
              C 178 14, 194 18, 194 28
              C 192 38, 176 52, 152 66
              C 126 82, 98 86, 84 76
              C 80 72, 80 66, 82 62
              Z
            "
            className="fill-foreground"
          />
          {/* White separation below middle wing */}
          <path
            d="
              M 84 78
              C 102 70, 132 54, 164 40
              C 148 58, 118 76, 86 86
              Z
            "
            className="fill-background"
          />
        </g>

        {/* === LOWER WING — teal accent === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "84px 78px", animationDelay: "0.07s" }}
        >
          <path
            d="
              M 86 82
              C 106 66, 136 50, 168 38
              C 186 30, 198 36, 196 46
              C 192 56, 176 70, 152 84
              C 128 100, 100 104, 88 96
              C 84 92, 84 86, 86 82
              Z
            "
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHERS — dark, below wings === */}
        <g className="fill-foreground">
          <path d="
            M 88 98
            C 108 86, 138 68, 166 56
            C 150 74, 122 92, 92 106
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
