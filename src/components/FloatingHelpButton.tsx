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
        "fixed bottom-6 z-50 w-24 h-24",
        "flex items-center justify-center",
        "hover:scale-110 transition-transform duration-200",
        "group cursor-pointer",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-6",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 130 130"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY GROUP (static) === */}
        <g className="fill-foreground">
          {/* Head – round, facing left */}
          <circle cx="28" cy="42" r="16" />

          {/* Beak – small triangle pointing left */}
          <path d="M12 42 L20 38 L20 46 Z" />

          {/* Breast & belly – plump curve flowing from chin down into pen nib */}
          <path d="M28 58 C28 58, 22 52, 18 48 C14 44, 14 42, 14 42
                   M28 58 C32 62, 36 68, 40 74 C44 80, 44 86, 42 92
                   L38 92 C40 86, 40 80, 36 74 C32 68, 28 62, 24 56
                   C20 52, 18 48, 20 46" />

          {/* Main body fill – connects head to belly to back */}
          <path d="M28 58 C24 54, 20 50, 20 46
                   C20 44, 22 40, 28 36
                   C34 32, 42 34, 46 38
                   C50 42, 48 50, 44 56
                   C40 62, 36 66, 38 72
                   C40 78, 42 84, 42 92
                   L38 92
                   C38 86, 36 80, 34 74
                   C32 68, 28 62, 28 58 Z" />

          {/* Pen nib – tapers to sharp point */}
          <path d="M42 92 C44 96, 46 100, 50 108
                   L48 112 L44 106
                   C42 100, 40 96, 38 92 Z" />

          {/* Nib tip split */}
          <path d="M50 108 L52 114 L48 112 Z" />

          {/* Nib breather hole */}
          <ellipse cx="44" cy="98" rx="2" ry="2.5" className="fill-background" />

          {/* Nib slit line */}
          <line x1="49" y1="107" x2="51" y2="113" strokeWidth="0.7" className="stroke-background" />
        </g>

        {/* Eye */}
        <circle cx="22" cy="39" r="2.5" className="fill-background" />

        {/* === WHITE SEPARATION CURVES (between body and wings) === */}
        <g className="fill-background">
          <path d="M42 38 C46 36, 52 34, 58 30
                   C52 36, 46 40, 40 42 Z" />
          <path d="M42 44 C48 40, 56 36, 64 32
                   C58 38, 50 44, 42 48 Z" />
          <path d="M42 50 C48 46, 56 42, 66 38
                   C58 44, 50 50, 42 54 Z" />
        </g>

        {/* === UPPER WING – dark, animated === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "44px 38px" }}
        >
          <path
            d="M44 36 C52 30, 66 20, 82 12
               C90 8, 98 8, 102 12
               C98 16, 88 24, 76 30
               C66 36, 54 40, 44 42 Z"
            className="fill-foreground"
          />
        </g>

        {/* === MIDDLE WING – dark, animated === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "44px 44px", animationDelay: "0.03s" }}
        >
          <path
            d="M44 42 C54 36, 68 26, 86 18
               C94 14, 100 16, 98 20
               C94 26, 82 34, 68 40
               C56 46, 48 48, 44 48 Z"
            className="fill-foreground"
          />
        </g>

        {/* === LOWER WING – teal accent, animated === */}
        <g
          className={isFlapping ? "animate-flap" : ""}
          style={{ transformOrigin: "44px 50px", animationDelay: "0.06s" }}
        >
          <path
            d="M44 48 C54 42, 68 34, 84 28
               C92 24, 98 26, 96 30
               C92 36, 80 42, 66 48
               C54 52, 46 54, 44 54 Z"
            fill="#5f7f8a"
          />
        </g>

        {/* === TAIL FEATHER – dark, below wings === */}
        <g className="fill-foreground">
          <path d="M42 56 C50 50, 62 42, 72 38
                   C66 46, 56 54, 44 60 Z" />
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
