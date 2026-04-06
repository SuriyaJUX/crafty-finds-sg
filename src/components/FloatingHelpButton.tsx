import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FloatingHelpButton = () => {
  const navigate = useNavigate();
  const { isCartOpen } = useCart();

  return (
    <button
      onClick={() => navigate("/help")}
      aria-label="Help & support"
      className={[
        "fixed bottom-6 z-50 w-12 h-12 rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "flex items-center justify-center",
        "hover:scale-105 transition-transform",
        "group",
        isCartOpen ? "right-[calc(1.5rem+320px)]" : "right-6",
      ].join(" ")}
    >
      <HelpCircle className="w-5 h-5" />
      {/* Desktop tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        Help &amp; support
      </span>
    </button>
  );
};

export default FloatingHelpButton;
