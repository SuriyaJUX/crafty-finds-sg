import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const FloatingHelpButton = () => (
  <Link
    to="/about#contact"
    className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
    aria-label="Help & support"
  >
    <HelpCircle className="w-5 h-5" />
  </Link>
);

export default FloatingHelpButton;
