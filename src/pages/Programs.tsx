import { Link } from "react-router-dom";
import { Target, Users, Globe, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const programs = [
  {
    icon: Target,
    title: "Leadership Bootcamp",
    problem: "Many youths lack direction and leadership skills.",
    solution: ["Communication", "Ethics", "Problem-solving"],
    impact: "A participant who once struggled with confidence now leads community projects.",
    cta: "Join Next Bootcamp",
  },
  {
    icon: Users,
    title: "Mentorship & Coaching",
    problem: "Young people lack guidance and role models.",
    solution: ["We connect them with experienced mentors for clarity in career, growth in confidence, and purpose-driven living."],
    impact: "Clarity in career, growth in confidence, and purpose-driven living.",
    cta: "Get a Mentor",
  },
  {
    icon: Globe,
    title: "Youth Fellowship Program",
    problem: "Young changemakers lack resources.",
    solution: ["Training", "Funding support", "Platforms"],
    impact: "Projects that directly transform communities.",
    cta: "Apply for Fellowship",
  },
  {
    icon: Home,
    title: "Community Projects",
    problem: "Communities lack basic support systems.",
    solution: ["Clean water initiatives", "Feeding programs", "Humanitarian outreach"],
    impact: "A village now has access to clean water for the first time.",
    cta: "Support This Project",
  },
];

const Programs = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="gradient-hero py-20">
      <div className="container mx-auto px-4 text-center max-w-3xl animate-fade-up">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gold-light mb-6">
          Our Programs Are Changing Lives Every Day
        </h1>
        <p className="text-gold-light/80 text-lg">
          Each program is designed to solve real problems and create lasting impact in communities.
        </p>
      </div>
    </section>

    {/* Programs */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 space-y-12 max-w-4xl">
        {programs.map((p, i) => (
          <div
            key={p.title}
            className={`rounded-xl overflow-hidden border border-border ${i % 2 === 0 ? "bg-card" : "bg-secondary"}`}
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <p.icon className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">{p.title}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-destructive mb-2">The Problem</h4>
                  <p className="text-muted-foreground text-sm">{p.problem}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-teal mb-2">Our Solution</h4>
                  <ul className="text-sm text-card-foreground space-y-1">
                    {p.solution.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gold mb-2">Impact</h4>
                  <p className="text-sm text-card-foreground italic">{p.impact}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="gold" size="sm" asChild>
                  <Link to="/donate" className="inline-flex items-center gap-2">
                    {p.cta} <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Programs;
