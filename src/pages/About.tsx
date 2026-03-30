import { Heart, Target, Eye, MapPin, Mail, Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import logo from "@/assets/logo.jpg";

const About = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="gradient-navy text-gold-light py-20">
      <div className="container mx-auto px-4 text-center">
        <img src={logo} alt="World Enlighten Organization" className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-gold/30 object-cover" />
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="text-gold-light/70 max-w-2xl mx-auto text-lg">
          Empowering communities through humanitarian aid, education, and sustainable development since 2003.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-teal" size={28} />
            <h2 className="font-heading text-2xl font-bold text-foreground">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            To render humanitarian services, empower individuals with skills and resources for self-reliance, 
            and partner with organisations worldwide to create lasting, sustainable change in communities.
          </p>
        </div>
        <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-gold" size={28} />
            <h2 className="font-heading text-2xl font-bold text-foreground">Our Vision</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            A world where every individual, regardless of background, has access to basic needs, quality education, 
            and the opportunity to live a dignified, self-sufficient life.
          </p>
        </div>
      </div>
    </section>

    {/* Who We Are */}
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Who We Are" subtitle="World Enlighten Organization is a non-governmental organization established in 2003, committed to transforming lives through compassion, education, and community-driven action." />
        <div className="space-y-4 text-muted-foreground leading-relaxed mt-6">
          <p>
            Based in Calabar, Nigeria, we work at the grassroots level to address the most pressing challenges 
            facing vulnerable communities — from hunger and disease to lack of education and economic opportunity.
          </p>
          <p>
            Over two decades, we have touched thousands of lives through feeding programs, clean water initiatives, 
            youth empowerment bootcamps, mentorship programs, and humanitarian outreach.
          </p>
          <p>
            We believe that lasting change happens when communities are empowered from within. That's why every 
            program we run is designed not just to provide relief, but to build capacity, develop leaders, and 
            create self-sustaining systems of support.
          </p>
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Our Core Values" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: Heart, title: "Compassion", desc: "We lead with empathy in everything we do." },
            { icon: Target, title: "Integrity", desc: "Transparent operations and accountable leadership." },
            { icon: Eye, title: "Empowerment", desc: "We equip people to help themselves and others." },
          ].map((v) => (
            <div key={v.title} className="bg-card rounded-xl p-6 border border-border text-center shadow-sm">
              <v.icon className="mx-auto text-teal mb-3" size={28} />
              <h3 className="font-heading font-bold text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact Info */}
    <section className="py-16 gradient-navy text-gold-light">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <SectionHeading title="Get In Touch" subtitle="We'd love to hear from you." />
        <div className="flex flex-col items-center gap-3 mt-8 text-gold-light/80">
          <span className="flex items-center gap-2"><MapPin size={18} /> 7 Diamond Hill, Calabar</span>
          <span className="flex items-center gap-2"><Phone size={18} /> +234 813 541 7227</span>
          <span className="flex items-center gap-2"><Mail size={18} /> worldenlightenorganization@gmail.com</span>
          <a
            href="https://www.facebook.com/profile.php?id=100066570099602"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gold transition-colors mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Follow us on Facebook
          </a>
        </div>
      </div>
    </section>
  </div>
);

export default About;
