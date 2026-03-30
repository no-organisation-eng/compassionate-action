import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, BookOpen, Globe, Users, Sprout, Shield, GraduationCap, Handshake, Droplets, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import logo from "@/assets/logo.jpg";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.jpeg";
import hero4 from "@/assets/hero-4.jpeg";

const heroImages = [hero1, hero2, hero3, hero4];

const aims = [
  { icon: Heart, text: "Render humanitarian aids and relief materials to communities in distress" },
  { icon: Sprout, text: "Eradicate extreme hunger and provide sustainable economic opportunities" },
  { icon: Shield, text: "Improve maternal health and reduce infectious diseases" },
  { icon: Lightbulb, text: "Empower individuals with skills for self-reliance and economic independence" },
  { icon: Users, text: "Promote equality and protect human rights of marginalized communities" },
  { icon: Globe, text: "Preserve biodiversity and combat climate change effects" },
  { icon: Target, text: "Train the less privileged in entrepreneurship and leadership" },
  { icon: GraduationCap, text: "Ensure every child has access to quality, inclusive learning" },
  { icon: Droplets, text: "Render humanitarian services to the less privileged" },
  { icon: Handshake, text: "Partner with international organisations, governments, and agencies" },
  { icon: BookOpen, text: "Create platforms for social interaction with people of like minds" },
];

const stats = [
  { value: "20+", label: "Years of Impact" },
  { value: "50K+", label: "Lives Touched" },
  { value: "100+", label: "Community Projects" },
  { value: "15+", label: "Partner Organizations" },
];

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="pt-16">
    {/* Hero */}
    <section className="min-h-[85vh] flex items-center relative overflow-hidden">
      {/* Sliding background images */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: currentImage === i ? 1 : 0,
          }}
        />
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[hsl(var(--navy-dark)/0.75)]" />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl animate-fade-up">
          <img src={logo} alt="WEO Logo" className="h-24 w-24 rounded-full mb-8 shadow-xl border-2 border-gold/30" />
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gold-light leading-tight mb-6">
            Enlightening the World,{" "}
            <span className="text-gold">One Community</span> at a Time
          </h1>
          <p className="text-lg md:text-xl text-gold-light/80 mb-10 max-w-2xl leading-relaxed">
            Since 2003, World Enlighten Organization has been transforming lives through humanitarian aid, education, youth empowerment, and sustainable development.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
            <Button variant="outline-light" size="lg" asChild>
              <Link to="/volunteer">Join as Volunteer</Link>
            </Button>
            <Button variant="outline-light" size="lg" asChild>
              <Link to="/programs">Our Programs</Link>
            </Button>
          </div>
          {/* Slide indicators */}
          <div className="flex gap-2 mt-8">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentImage === i ? "w-8 bg-[hsl(var(--gold))]" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    {/* Stats */}
    <section className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-bold text-gold">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Aims & Objectives */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Aims & Objectives" subtitle="Guided by purpose, driven by compassion — our core commitments to building a better world." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aims.map((aim, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-6 border border-border hover:border-gold/40 hover:shadow-lg transition-all duration-300 group"
            >
              <aim.icon className="h-8 w-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-card-foreground leading-relaxed">{aim.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="gradient-navy py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold-light mb-4">
          Be Part of the Change
        </h2>
        <p className="text-gold-light/70 mb-8 max-w-xl mx-auto">
          Your support — whether through donations, volunteering, or partnerships — creates ripples of impact across communities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" size="lg" asChild>
            <Link to="/donate">Donate Today</Link>
          </Button>
          <Button variant="outline-light" size="lg" asChild>
            <Link to="/volunteer">Volunteer With Us</Link>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default Index;
