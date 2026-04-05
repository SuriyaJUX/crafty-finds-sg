import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-serif text-lg mb-3">Note & Gale</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Where Ideas Take Flight — Singapore's home for stationery lovers and art makers.
          </p>
          <Link
            to="/about#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            Contact Us
          </Link>
        </div>
        <div>
          <h5 className="text-sm font-semibold mb-3">Shop</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/promotions" className="hover:text-primary transition-colors">Deals</Link></li>
            <li><Link to="/creative-paths" className="hover:text-primary transition-colors">Creative Paths</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold mb-3">Support</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about#contact" className="hover:text-primary transition-colors font-medium">Contact Us</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Note & Gale</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold mb-3">Payment Methods</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>PayNow</li>
            <li>Credit / Debit Card</li>
            <li>QR Payment</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Note & Gale. All prices in SGD.
      </div>
    </div>
  </footer>
);

export default Footer;
