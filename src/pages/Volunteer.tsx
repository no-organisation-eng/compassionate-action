import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Users, Megaphone, BookOpen, Award, Network, TrendingUp, Heart, LayoutDashboard, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionHeading from "@/components/SectionHeading";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

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

      {/* Logged-in volunteer banner */}
      {user && (
        <section className="py-4 bg-gold/10 border-b border-gold/20">
          <div className="container mx-auto px-4 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy font-bold text-sm">{user.avatar}</div>
              <div>
                <p className="text-sm font-semibold text-navy dark:text-gold-light">You're a registered volunteer, {user.name.split(' ')[0]}!</p>
                <p className="text-xs text-muted-foreground">Access your referral link and dashboard</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="gold" size="sm" asChild className="flex items-center gap-1.5">
                <Link to="/volunteer/dashboard"><LayoutDashboard className="h-3.5 w-3.5" /> My Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex items-center gap-1.5 border-gold/30">
                <Link to="/referrals"><Share2 className="h-3.5 w-3.5" /> Referral Program</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

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
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionHeading title="Apply Now" subtitle="Fill out the form below and we'll be in touch." />
          {submitted ? (
            <div className="bg-teal/10 border border-teal/30 rounded-lg p-8 text-center">
              <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-navy mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We'll reach out to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Personal Information */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <h4 className="font-heading font-semibold text-navy dark:text-gold-light text-sm uppercase tracking-wider">
                  Personal Information
                </h4>
                <Input placeholder="Full Name" required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input type="email" placeholder="Email Address" required />
                  <Input type="tel" placeholder="Phone Number" />
                </div>
                <Input placeholder="Area of Interest (e.g., Teaching, Outreach)" />
              </div>

              {/* Location Details */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <h4 className="font-heading font-semibold text-navy dark:text-gold-light text-sm uppercase tracking-wider">
                  Location Details
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Country <span className="text-destructive">*</span></label>
                    <Input placeholder="e.g. Nigeria" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">State <span className="text-destructive">*</span></label>
                    <Input placeholder="e.g. Akwa Ibom" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">LGA of Residence <span className="text-destructive">*</span></label>
                  <Input placeholder="e.g. Uyo Local Government Area" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Full Address</label>
                  <Textarea placeholder="House number, Street, Estate / Area, City..." rows={3} />
                </div>
              </div>

              {/* Availability & Background */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <h4 className="font-heading font-semibold text-navy dark:text-gold-light text-sm uppercase tracking-wider">
                  Availability & Background
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Your Availability & Any Message</label>
                  <Textarea placeholder="When are you available? Any additional message..." rows={3} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Brief Citation / CV Summary <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Share a brief professional background — your education, work experience, skills, achievements, and why you want to volunteer with Enlighten Community..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a concise summary of your background. You may include qualifications, work history, community experience, and any relevant skills.
                  </p>
                </div>
              </div>

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
