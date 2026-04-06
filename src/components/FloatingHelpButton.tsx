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
        "fixed bottom-6 z-50 w-20 h-20",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-6",
      ].join(" ")}
    >
      {/* Notingale bird SVG – facing left, pen-nib tail */}
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body group – head, body, pen nib (static) */}
        <g className="fill-foreground">
          {/* Head – round, facing left */}
          <circle cx="28" cy="30" r="14" />

          {/* Body – S-curve flowing from head down to pen nib */}
          <path d="M34 40 C40 44, 48 48, 50 56 C52 64, 48 72, 44 80 L38 80 C42 72, 44 64, 42 56 C40 50, 34 46, 28 42 Z" />

          {/* Pen nib – tapers to a point */}
          <path d="M44 80 C46 86, 46 92, 50 100 L48 102 L44 96 C42 90, 40 86, 38 80 Z" />
          <path d="M50 100 L52 104 L48 102 Z" />

          {/* Nib breather hole */}
          <ellipse cx="45" cy="88" rx="2" ry="3" className="fill-background" />

          {/* Nib slit */}
          <line x1="49" y1="98" x2="50.5" y2="103" stroke="currentColor" strokeWidth="0.5" className="stroke-background" />
        </g>

        {/* Eye */}
        <circle cx="22" cy="27" r="3" className="fill-background" />

        {/* Upper wing – dark, animated */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "38px 38px" }}
        >
          <path
            d="M38 38 C44 32, 54 24, 66 18 C72 14, 78 12, 82 14 C78 20, 70 26, 60 32 C52 36, 44 40, 38 42 Z"
            className="fill-foreground"
          />
          {/* White separation curve */}
          <path
            d="M38 42 C46 38, 56 32, 66 26 C60 34, 52 40, 42 44 Z"
            className="fill-background"
          />
        </g>

        {/* Lower wing – teal accent, animated */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "40px 42px", animationDelay: "0.05s" }}
        >
          <path
            d="M40 44 C48 38, 58 32, 70 28 C76 26, 80 28, 78 32 C74 38, 64 44, 54 48 C48 50, 42 48, 40 46 Z"
            fill="#5f7f8a"
          />
        </g>

        {/* Tail feather accents */}
        <g className="fill-foreground">
          <path d="M42 56 C48 52, 56 46, 62 42 C58 50, 50 56, 44 58 Z" />
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
