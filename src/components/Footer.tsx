import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="gradient-navy text-gold-light/80">
    {/* Global CTA */}
    <div className="border-b border-gold/20">
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="font-heading text-3xl font-bold text-gold-light mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-gold-light/70 mb-8 max-w-xl mx-auto">
          Join us in creating lasting change across communities worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" size="lg" asChild>
            <Link to="/donate">Donate Now</Link>
          </Button>
          <Button variant="outline-light" size="lg" asChild>
            <Link to="/volunteer">Become a Volunteer</Link>
          </Button>
          <Button variant="outline-light" size="lg" asChild>
            <Link to="/programs">Partner With Us</Link>
          </Button>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-heading text-lg font-bold text-gold-light mb-3">
          World Enlighten Organization
        </h3>
        <p className="text-sm leading-relaxed">
          Empowering communities through humanitarian aid, education, and sustainable development since 2003.
        </p>
      </div>
      <div>
        <h4 className="font-heading font-bold text-gold-light mb-3">Quick Links</h4>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/programs" className="hover:text-gold transition-colors">Programs</Link>
          <Link to="/volunteer" className="hover:text-gold transition-colors">Volunteer</Link>
          <Link to="/donate" className="hover:text-gold transition-colors">Donate</Link>
        </div>
      </div>
      <div>
        <h4 className="font-heading font-bold text-gold-light mb-3">Contact</h4>
        <div className="flex flex-col gap-2 text-sm">
          <span className="flex items-center gap-2"><Mail size={14} /> info@worldenlighten.org</span>
          <span className="flex items-center gap-2"><Phone size={14} /> +234 000 000 0000</span>
          <span className="flex items-center gap-2"><MapPin size={14} /> Nigeria</span>
        </div>
      </div>
    </div>

    <div className="border-t border-gold/10 text-center py-4 text-xs text-gold-light/50">
      <p className="flex items-center justify-center gap-1">
        © {new Date().getFullYear()} World Enlighten Organization. Made with <Heart size={12} className="text-gold" /> Est. 2003
      </p>
    </div>
  </footer>
);

export default Footer;
