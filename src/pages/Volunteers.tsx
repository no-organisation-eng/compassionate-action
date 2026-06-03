import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mock data for the volunteers
const MOCK_VOLUNTEERS = [
  {
    id: 1,
    name: "Dr. Enlightened",
    country: "Nigeria",
    region: "South South",
    role: "Global Coordinator",
    citation: "A passionate visionary dedicated to building ethical, service-oriented leaders and ensuring humanity and biodiversity preservation.",
    image: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    country: "United States",
    region: "North America",
    role: "National Executive",
    citation: "Committed to driving community engagement and fostering impactful grassroots implementation across communities.",
    image: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: 3,
    name: "Kwame Osei",
    country: "Ghana",
    region: "West Africa",
    role: "Regional Coordinator",
    citation: "Trailblazer in youth empowerment, mentoring the next generation of leaders for a sustainable future.",
    image: "https://i.pravatar.cc/150?u=3"
  }
];

const COUNTRIES = ["All", "Nigeria", "United States", "Ghana", "Kenya", "Canada", "United Kingdom"];

const Volunteers = () => {
  const [selectedCountry, setSelectedCountry] = useState("All");

  const filteredVolunteers = selectedCountry === "All" 
    ? MOCK_VOLUNTEERS 
    : MOCK_VOLUNTEERS.filter(v => v.country === selectedCountry);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <SectionHeading title="Our Global Volunteers" subtitle="Meet the changemakers, visionaries, and trail blazers across the countries of the world committed to ethical, service-oriented leadership." />
        </div>

        {/* Country Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {COUNTRIES.map(country => (
            <Button 
              key={country} 
              variant={selectedCountry === country ? "gold" : "outline"}
              onClick={() => setSelectedCountry(country)}
              className="rounded-full"
            >
              {country}
            </Button>
          ))}
        </div>

        {/* Volunteers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVolunteers.map(volunteer => (
            <div key={volunteer.id} className="bg-card rounded-2xl p-6 border border-border shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <Avatar className="w-24 h-24 mb-4 border-2 border-gold">
                <AvatarImage src={volunteer.image} alt={volunteer.name} />
                <AvatarFallback className="bg-muted text-lg">{volunteer.name.substring(0,2)}</AvatarFallback>
              </Avatar>
              <h3 className="font-heading font-bold text-xl text-foreground mb-1">{volunteer.name}</h3>
              <p className="text-teal font-medium mb-1">{volunteer.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{volunteer.country} • {volunteer.region}</p>
              
              <div className="bg-muted/50 p-4 rounded-xl w-full flex-grow relative group cursor-pointer border border-transparent hover:border-gold/30 transition-colors">
                <p className="text-sm italic text-card-foreground">"{volunteer.citation}"</p>
                
                {/* Visual hint that it's editable (in a real app this would open a modal/edit mode) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-background/80 px-2 py-1 rounded text-muted-foreground shadow-sm">Editable</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredVolunteers.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No volunteers listed for this country yet. Be the first to join!
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="gold" size="lg" asChild>
            <a href="/register">Join as a Volunteer</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
