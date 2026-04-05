import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Target, HelpCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useInkPoints } from "@/context/InkPointsContext";
import { products } from "@/data/products";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/promotions", label: "Deals" },
  { to: "/about", label: "About" },
];

// Small inline ink drop SVG — uses currentColor
const InkDrop = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 28" fill="currentColor" aria-hidden="true">
    <path d="M12 1 C12 1, 2 12, 2 18 A10 10 0 0 0 22 18 C22 12, 12 1, 12 1 Z" />
  </svg>
);

const Navbar = () => {
  const { totalItems, setIsCartOpen, savedItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTier } = useInkPoints();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inkHovered, setInkHovered] = useState(false);
  const [newPointsPulse, setNewPointsPulse] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const prevPointsRef = useRef<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Detect points increase and show pulse for 5 s
  useEffect(() => {
    if (!user) { prevPointsRef.current = null; return; }
    if (prevPointsRef.current !== null && user.loyaltyPoints > prevPointsRef.current) {
      setNewPointsPulse(true);
      const t = setTimeout(() => setNewPointsPulse(false), 5000);
      prevPointsRef.current = user.loyaltyPoints;
      return () => clearTimeout(t);
    }
    prevPointsRef.current = user.loyaltyPoints;
  }, [user?.loyaltyPoints]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  // Search suggestions — live filter against name, category, tags
  const suggestions = searchQuery.trim().length > 0
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchAll = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Arc progress to next 200-pt redemption threshold
  const REDEEM_STEP = 200;
  const progressToNext = user ? (user.loyaltyPoints % REDEEM_STEP) / REDEEM_STEP : 0;
  const ptToNext = user ? REDEEM_STEP - (user.loyaltyPoints % REDEEM_STEP) : REDEEM_STEP;
  const arcR = 9;
  const arcCirc = 2 * Math.PI * arcR;
  const arcDashOffset = arcCirc * (1 - progressToNext);

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"}`}>
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-2xl tracking-tight text-foreground">
          Note & Gale
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const isDeals = link.label === "Deals";
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : isDeals ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isDeals && !isActive && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle -mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* ── Expandable search ── */}
          <div ref={searchContainerRef} className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search products…"
                  className="w-44 md:w-56 h-8 rounded-lg border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Suggestions dropdown */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg z-50 animate-fade-in overflow-hidden">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSuggestionClick(p.id)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted transition-colors text-left"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover bg-muted flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary flex-shrink-0">
                          S${p.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No products found</p>
                )}
                <button
                  onClick={handleSearchAll}
                  className="flex items-center gap-2 w-full px-4 py-2.5 border-t border-border text-sm text-primary hover:bg-muted transition-colors font-medium"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search all results for "{searchQuery.trim()}"
                </button>
              </div>
            )}
          </div>
          {/* ── Dark mode toggle ── */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/about#contact"
            className="flex p-2 text-muted-foreground hover:text-foreground transition-colors relative group"
            title="Help & support"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Help &amp; support
            </span>
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

          {/* ── Ink Points widget (authenticated, desktop only) ── */}
          {isAuthenticated && user && (
            <div
              className="hidden md:flex relative"
              onMouseEnter={() => setInkHovered(true)}
              onMouseLeave={() => setInkHovered(false)}
            >
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary relative">
                {/* Arc progress + ink drop */}
                <span className="relative w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="absolute inset-0">
                    {/* Track */}
                    <circle cx="12" cy="12" r={arcR} fill="none"
                      stroke="hsl(var(--primary)/0.15)" strokeWidth="2"
                      transform="rotate(-90 12 12)" />
                    {/* Progress */}
                    <circle cx="12" cy="12" r={arcR} fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${arcCirc} ${arcCirc}`}
                      strokeDashoffset={arcDashOffset}
                      transform="rotate(-90 12 12)" />
                  </svg>
                  {/* Ink drop centred inside arc */}
                  <span className="absolute inset-0 flex items-center justify-center text-primary">
                    <InkDrop size={10} />
                  </span>
                </span>

                <span className="text-xs font-semibold">{user.loyaltyPoints}</span>

                {/* Pulse dot when new points just earned */}
                {newPointsPulse && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-background animate-pulse" />
                )}
              </button>

              {/* Hover panel */}
              {inkHovered && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-border bg-card shadow-lg p-4 z-50 animate-fade-in">
                  {/* Tier badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: currentTier.color }}
                    >
                      {currentTier.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.lifetimePoints} lifetime pts
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-bold text-primary">{user.loyaltyPoints}</span>
                    <span className="text-sm text-muted-foreground">Ink Points</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    = <span className="font-medium text-foreground">
                      S${(user.loyaltyPoints / 200).toFixed(2)}
                    </span> off your next order
                  </p>

                  {/* Streak */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border pt-3 mb-2">
                    <span>🔥</span>
                    <span>Day <span className="font-medium text-foreground">{user.currentStreak}</span> streak</span>
                  </div>

                  {/* Next reward */}
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{ptToNext} pts</span> until next S$1.00 off
                  </p>

                  {/* Goal progress */}
                  {user.pointsGoal ? (() => {
                    const goalProduct = products.find(p => p.id === user.pointsGoal!.targetProductId);
                    if (!goalProduct) return null;
                    const ptsNeeded = Math.ceil(goalProduct.price * 200);
                    const pct = Math.min((user.loyaltyPoints / ptsNeeded) * 100, 100);
                    const remaining = Math.max(0, ptsNeeded - user.loyaltyPoints);
                    return (
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Target className="w-3 h-3 text-secondary" />
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Goal</span>
                        </div>
                        <p className="text-xs font-medium truncate">{goalProduct.name}</p>
                        <div className="mt-1.5 h-1 rounded-full bg-secondary/15 overflow-hidden">
                          <div className="h-full rounded-full bg-secondary transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {remaining > 0 ? <><span className="font-medium text-foreground">{remaining} pts</span> to go</> : <span className="text-secondary font-medium">Goal reached!</span>}
                        </p>
                      </div>
                    );
                  })() : (
                    <div className="border-t border-border pt-3 mt-3">
                      <Link to="/account" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                        <Target className="w-3 h-3" /> Set a goal
                      </Link>
                    </div>
                  )}

                  {/* Mini arc bar */}
                  <div className="mt-3 h-1 rounded-full bg-primary/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progressToNext * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {Math.round(progressToNext * 100)}% to next S$1.00
                  </p>
                </div>
              )}
            </div>
          )}

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
                        <span className="text-xs font-medium text-primary">{user?.loyaltyPoints} pts</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: currentTier.color }}
                        >
                          {currentTier.badge}
                        </span>
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
              <Link to="/login" state={{ from: location.pathname + location.search }} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
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
            {isAuthenticated && user && (
              <div className="flex items-center gap-2 py-2 border-t border-border">
                <span className="text-xs font-medium text-primary">{user.loyaltyPoints} Ink Points</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: currentTier.color }}>
                  {currentTier.badge}
                </span>
              </div>
            )}
            <Link
              to="/about#contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-2 text-muted-foreground flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Help &amp; Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
