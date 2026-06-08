import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Heart, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

/* ---------- Nav structure ---------- */
interface NavChild { label: string; path: string; authOnly?: boolean; badge?: string; }
interface NavItem  { label: string; path?: string; children?: NavChild[]; }

const getNavItems = (isLoggedIn: boolean): NavItem[] => [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Programs",
    children: [
      { label: "All Programs", path: "/programs" },
      { label: "Health & Wellness Library", path: "/wellness", badge: "Free" },
    ],
  },
  {
    label: "Volunteer",
    children: [
      { label: "Become a Volunteer", path: "/volunteer" },
      ...(isLoggedIn
        ? [
            { label: "My Dashboard", path: "/volunteer/dashboard", badge: "New" },
            { label: "Referral Program", path: "/referrals" },
          ]
        : [
            { label: "Referral Program", path: "/login", authOnly: true },
          ]),
    ],
  },
  { label: "Community", path: "/community" },
  { label: "Donate", path: "/donate" },
];

/* ---------- Theme Toggle ---------- */
const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gold-light"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

/* ---------- Desktop Dropdown ----------
   KEY FIX: the dropdown wrapper uses pt-2 which creates an invisible bridge
   between the trigger button and the panel — the mouse stays inside the
   parent div the whole time so onMouseLeave never fires during the transition.
*/
const DesktopDropdown = ({ item, isActive }: { item: NavItem; isActive: (p: string) => boolean }) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const hide = () => {
    // Small delay so fast mouse moves across the 8px pt-2 gap don't flicker
    timerRef.current = setTimeout(() => setOpen(false), 80);
  };

  const anyChildActive = item.children?.some(c => isActive(c.path));

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger */}
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          anyChildActive ? "text-gold" : "text-gold-light/80 hover:text-gold"
        }`}
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* pt-2 bridges the visual gap so mouse doesn't leave parent div */}
      {open && (
        <div className="absolute top-full left-0 pt-2 w-56 z-50" onMouseEnter={show} onMouseLeave={hide}>
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {item.children?.map(child => (
              <Link
                key={child.path}
                to={child.path}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-secondary ${
                  isActive(child.path) ? "text-gold bg-secondary/60 font-semibold" : "text-card-foreground"
                }`}
              >
                {child.label}
                {child.badge && (
                  <span className="text-[10px] font-bold bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">{child.badge}</span>
                )}
                {child.authOnly && (
                  <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Login</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Main Navbar ---------- */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = getNavItems(!!user);
  const isActive = (path: string) => location.pathname === path;

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); setMobileExpanded(null); }, [location.pathname]);

  const handleLogout = () => {
    logout(); setUserMenuOpen(false); setOpen(false); navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-navy border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Enlighten Community" className="h-10 w-10 rounded-full object-cover border border-gold/20" />
          <span className="font-heading text-base font-bold text-gold-light hidden sm:block">Enlighten Community</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-5">
          {navItems.map(item =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} isActive={isActive} />
            ) : (
              <Link key={item.path} to={item.path!}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path!) ? "text-gold" : "text-gold-light/80 hover:text-gold"
                }`}>
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop right side: theme toggle + auth */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full pl-2 pr-3 py-1"
              >
                <div className="h-7 w-7 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">
                  {user.avatar}
                </div>
                <span className="text-sm text-gold-light font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`h-3 w-3 text-gold-light/60 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 bg-card border border-border rounded-xl shadow-2xl w-52 py-2 z-50">
                  <div className="px-4 py-2 border-b border-border mb-1">
                    <p className="font-semibold text-card-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link to="/volunteer/dashboard" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-card-foreground hover:bg-secondary transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-gold" /> My Dashboard
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-card-foreground hover:bg-secondary transition-colors">
                      <LayoutDashboard className="h-4 w-4 text-gold" /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/community" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-card-foreground hover:bg-secondary transition-colors">
                    <Heart className="h-4 w-4 text-gold" /> Community Hub
                  </Link>
                  <div className="border-t border-border mt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline-light" size="sm" asChild><Link to="/login">Sign In</Link></Button>
              <Button variant="gold" size="sm" asChild><Link to="/register">Join Free</Link></Button>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-gold-light" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden gradient-navy border-t border-gold/20 pb-4">
          {navItems.map(item =>
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gold-light/80 hover:text-gold"
                >
                  {item.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === item.label && (
                  <div className="bg-black/10 border-l-2 border-gold/20 ml-6">
                    {item.children.map(child => (
                      <Link key={child.path} to={child.path}
                        onClick={() => { setOpen(false); setMobileExpanded(null); }}
                        className={`flex items-center justify-between px-6 py-2.5 text-sm transition-colors hover:text-gold ${
                          isActive(child.path) ? "text-gold font-semibold" : "text-gold-light/70"
                        }`}>
                        {child.label}
                        {child.badge && (
                          <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">{child.badge}</span>
                        )}
                        {child.authOnly && (
                          <span className="text-[10px] text-muted-foreground">Login required</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.path} to={item.path!}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path!) ? "text-gold" : "text-gold-light/80 hover:text-gold"
                }`}>
                {item.label}
              </Link>
            )
          )}

          {/* Mobile auth section */}
          <div className="px-6 pt-3 mt-2 border-t border-gold/10 space-y-2">
            {user ? (
              <>
                <p className="text-xs text-gold-light/50">
                  Signed in as <span className="font-semibold text-gold-light">{user.name}</span>
                </p>
                <Link to="/volunteer/dashboard" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-gold-light/80 hover:text-gold">
                  <LayoutDashboard className="h-4 w-4 text-gold" /> My Dashboard
                </Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-gold-light/80 hover:text-gold">
                    <LayoutDashboard className="h-4 w-4 text-gold" /> Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-destructive font-medium">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Button variant="gold" size="sm" className="w-full" asChild>
                  <Link to="/register" onClick={() => setOpen(false)}>Join Free</Link>
                </Button>
                <Button variant="outline-light" size="sm" className="w-full" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
