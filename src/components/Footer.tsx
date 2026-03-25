import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-serif text-lg mb-3">Paperly</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Singapore's home for stationery lovers and art makers.
          </p>
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
            <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
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
        © {new Date().getFullYear()} Paperly. All prices in SGD.
      </div>
    </div>
  </footer>
);

export default Footer;
