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
        "fixed bottom-4 z-50 w-[88px] h-[88px]",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-4",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 100 110"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY (static) – head + plump breast + pen nib === */}
        <g className="fill-foreground">
          {/* Head – large round, facing left */}
          <circle cx="24" cy="34" r="15" />

          {/* Beak – pointing left */}
          <polygon points="9,34 18,30 18,38" />

          {/* Body – plump breast curving from head down into pen nib area */}
          <path d="
            M 32 46
            C 28 42, 22 40, 18 38
            Q 24 36, 32 38
            C 42 40, 48 46, 48 54
            C 48 60, 46 66, 44 72
            L 36 72
            C 38 66, 40 60, 40 54
            C 40 50, 36 48, 32 46
            Z
          " />

          {/* Pen nib – from belly, tapering to sharp point */}
          <path d="
            M 44 72
            C 46 78, 48 84, 50 92
            L 48 96
            L 44 88
            C 42 82, 40 76, 36 72
            Z
          " />

          {/* Nib sharp tip */}
          <polygon points="50,92 52,98 48,96" />

          {/* Nib breather hole */}
          <ellipse cx="43" cy="80" rx="1.8" ry="2.5" className="fill-background" />

          {/* Nib slit */}
          <line x1="49" y1="91" x2="51" y2="97" strokeWidth="0.6" className="stroke-background" />
        </g>

        {/* Eye – white dot */}
        <circle cx="19" cy="31" r="2.5" className="fill-background" />

        {/* === UPPER WING – dark, sweeps up-right (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "38px 40px" }}
        >
          <path
            d="
              M 36 40
              C 44 34, 56 24, 72 16
              C 80 12, 88 12, 90 16
              C 88 20, 78 28, 66 34
              C 54 40, 42 44, 36 44
              Z
            "
            className="fill-foreground"
          />
          {/* White separation curve below upper wing */}
          <path
            d="M 36 44 C 44 40, 56 34, 68 28
               C 60 36, 50 42, 38 46 Z"
            className="fill-background"
          />
        </g>

        {/* === MIDDLE WING – dark (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "38px 46px", animationDelay: "0.04s" }}
        >
          <path
            d="
              M 38 46
              C 48 38, 62 28, 78 20
              C 86 16, 92 18, 90 22
              C 86 28, 74 36, 60 44
              C 50 50, 42 50, 38 50
              Z
            "
            className="fill-foreground"
          />
          {/* White separation curve */}
          <path
            d="M 38 50 C 46 46, 58 38, 68 32
               C 62 40, 52 48, 40 52 Z"
            className="fill-background"
          />
        </g>

        {/* === LOWER WING – teal accent (animated) === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "40px 52px", animationDelay: "0.07s" }}
        >
          <path
            d="
              M 40 52
              C 50 44, 64 34, 80 26
              C 88 22, 94 24, 92 28
              C 88 34, 76 42, 62 50
              C 52 56, 44 56, 40 56
              Z
            "
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHERS – dark, below wings === */}
        <g className="fill-foreground">
          <path d="
            M 40 58
            C 48 52, 60 44, 72 38
            C 66 48, 54 56, 42 62
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
