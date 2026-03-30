interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => (
  <div className="text-center mb-12">
    <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-4 ${light ? "text-gold-light" : "text-navy"}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`max-w-2xl mx-auto text-lg ${light ? "text-gold-light/70" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
    <div className={`w-20 h-1 mx-auto mt-4 rounded-full ${light ? "bg-gold" : "bg-gold"}`} />
  </div>
);

export default SectionHeading;
