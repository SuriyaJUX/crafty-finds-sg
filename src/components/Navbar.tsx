import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Trophy } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/creative-paths", label: "Creative Paths" },
  { to: "/promotions", label: "Deals" },
];

const Navbar = () => {
  const { totalItems, setIsCartOpen, savedItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-2xl tracking-tight text-foreground">
          Paperly
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/shop" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <Link to="/wishlist" className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
            <Heart className="w-5 h-5" />
            {savedItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                {savedItems.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </button>
          {/* User / Auth */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {user?.avatarInitials}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user?.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Trophy className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-primary">{user?.loyaltyPoints} pts</span>
                        <span className="text-xs text-muted-foreground">· {user?.loyaltyTier}</span>
                      </div>
                    </div>
                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-destructive">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
