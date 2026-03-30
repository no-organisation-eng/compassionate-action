import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Programs", path: "/programs" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Donate", path: "/donate" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-navy border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="World Enlighten Organization" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-heading text-lg font-bold text-gold-light hidden sm:block">
            World Enlighten Organization
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-gold"
                  : "text-gold-light/80 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="gold" size="sm" asChild>
            <Link to="/donate">Donate Now</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-gold-light"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden gradient-navy border-t border-gold/20 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium ${
                location.pathname === link.path ? "text-gold" : "text-gold-light/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-2">
            <Button variant="gold" size="sm" className="w-full" asChild>
              <Link to="/donate" onClick={() => setOpen(false)}>Donate Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
