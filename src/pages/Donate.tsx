import { Link } from "react-router-dom";
import { Heart, Droplets, GraduationCap, Users, ShieldCheck, Eye, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const tiers = [
  { amount: "₦5,000", impact: "Feed a family", icon: Heart },
  { amount: "₦10,000", impact: "Support a child's education", icon: GraduationCap },
  { amount: "₦25,000", impact: "Provide clean water access", icon: Droplets },
  { amount: "₦50,000+", impact: "Sponsor a community project", icon: Users },
];

const Donate = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="gradient-hero py-20">
      <div className="container mx-auto px-4 text-center max-w-3xl animate-fade-up">
        <Heart className="h-12 w-12 text-gold mx-auto mb-6" />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gold-light mb-6">
          Be the Reason Someone Lives Better Today
        </h1>
        <p className="text-gold-light/80 text-lg mb-8">
          Every donation, no matter how small, creates lasting change in someone's life.
        </p>
        <Button variant="hero" size="lg" asChild>
          <a href="#donate-options">Donate Now</a>
        </Button>
      </div>
    </section>

    {/* The Problem */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="The Problem" subtitle="Every day, families struggle with challenges that threaten their survival and dignity." />
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {["Hunger & malnutrition", "Lack of clean water", "No access to basic healthcare", "Youths without direction or opportunity"].map((p) => (
            <div key={p} className="bg-card rounded-lg p-4 border border-border text-card-foreground flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
              {p}
            </div>
          ))}
        </div>
        <div className="bg-secondary rounded-lg p-6 border-l-4 border-gold italic text-secondary-foreground space-y-2">
          <p>A widow wondering how to feed her children.</p>
          <p>A child forced to drop out of school.</p>
          <p>A young person with potential — but no guidance.</p>
        </div>
      </div>
    </section>

    {/* The Solution */}
    <section className="py-16 gradient-navy">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="The Solution" subtitle="At World Enlighten Organization, we are changing this story." light />
        <div className="grid sm:grid-cols-2 gap-4">
          {["Feeding and clothing programs", "Drugless healthcare education", "Youth empowerment & leadership training", "Clean water initiatives"].map((s) => (
            <div key={s} className="bg-navy/50 rounded-lg p-5 border border-gold/20 text-gold-light flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Impact Story */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Real Impact" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-destructive/5 rounded-lg p-6 border border-destructive/20">
            <span className="text-xs font-bold uppercase tracking-wider text-destructive">Before</span>
            <p className="mt-3 text-card-foreground">
              A young boy in a rural community had no access to clean water and missed school frequently due to illness.
            </p>
          </div>
          <div className="bg-teal/5 rounded-lg p-6 border border-teal/30">
            <span className="text-xs font-bold uppercase tracking-wider text-teal">After</span>
            <p className="mt-3 text-card-foreground">
              Through our Clean Water Project, he now has access to safe drinking water — and is back in school, thriving.
            </p>
          </div>
        </div>
        <p className="text-center text-gold font-heading font-bold text-xl mt-8">
          👉 This is the impact of your support.
        </p>
      </div>
    </section>

    {/* Donation Tiers */}
    <section id="donate-options" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <SectionHeading title="Choose Your Impact" subtitle="Every naira goes directly to transforming lives." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {tiers.map((t) => (
            <div key={t.amount} className="bg-card rounded-lg p-6 border border-border hover:border-gold/50 hover:shadow-lg transition-all text-center group">
              <t.icon className="h-10 w-10 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="font-heading text-2xl font-bold text-navy mb-2">{t.amount}</div>
              <p className="text-muted-foreground text-sm">{t.impact}</p>
              <Button variant="gold" size="sm" className="mt-4 w-full">Donate</Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="default" size="lg">Sponsor a Program</Button>
        </div>
      </div>
    </section>

    {/* Trust */}
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Eye, label: "Transparent Operations" },
            { icon: ShieldCheck, label: "Proven Impact" },
            { icon: Handshake, label: "Community-Driven Approach" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-muted-foreground">
              <t.icon className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Donate;
