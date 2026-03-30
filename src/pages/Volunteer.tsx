import { useState } from "react";
import { Globe, Users, Megaphone, BookOpen, Award, Network, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/SectionHeading";

const opportunities = [
  { icon: Users, label: "Community Outreach" },
  { icon: BookOpen, label: "Teaching & Mentorship" },
  { icon: Megaphone, label: "Event Support" },
  { icon: Globe, label: "Media & Awareness Campaigns" },
];

const benefits = [
  { icon: Award, label: "Leadership Experience" },
  { icon: TrendingUp, label: "Real-World Impact" },
  { icon: Network, label: "Network with Changemakers" },
  { icon: Heart, label: "Personal Growth" },
];

const Volunteer = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl animate-fade-up">
          <Globe className="h-12 w-12 text-gold mx-auto mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gold-light mb-6">
            Be the Change You Want to See
          </h1>
          <p className="text-gold-light/80 text-lg mb-8">
            Your time can change lives, build communities, and shape future leaders.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="#volunteer-form">Join as a Volunteer</a>
          </Button>
        </div>
      </section>

      {/* Emotional Pull */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-lg text-secondary-foreground italic leading-relaxed">
            Imagine mentoring a young person who later becomes a leader.
            Imagine helping distribute food to families who haven't eaten all day.
          </p>
          <p className="text-gold font-heading font-bold text-xl mt-6">
            👉 That impact starts with you.
          </p>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title="Volunteer Opportunities" subtitle="Find the role that fits your passion and skills." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {opportunities.map((o) => (
              <div key={o.label} className="bg-card rounded-lg p-6 border border-border text-center hover:border-gold/40 hover:shadow-lg transition-all group">
                <o.icon className="h-10 w-10 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-card-foreground">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 gradient-navy">
        <div className="container mx-auto px-4">
          <SectionHeading title="What You Gain" light />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div key={b.label} className="bg-navy/50 border border-gold/20 rounded-lg p-6 text-center">
                <b.icon className="h-10 w-10 text-gold mx-auto mb-3" />
                <p className="font-medium text-gold-light">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="volunteer-form" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <SectionHeading title="Apply Now" subtitle="Fill out the form below and we'll be in touch." />
          {submitted ? (
            <div className="bg-teal/10 border border-teal/30 rounded-lg p-8 text-center">
              <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We'll reach out to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Full Name" required />
              <Input type="email" placeholder="Email Address" required />
              <Input type="tel" placeholder="Phone Number" />
              <Input placeholder="Area of Interest (e.g., Teaching, Outreach)" />
              <Textarea placeholder="Your Availability & Any Message" rows={4} />
              <Button variant="gold" size="lg" className="w-full" type="submit">
                Submit Application
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
