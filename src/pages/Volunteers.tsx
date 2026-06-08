import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import VolunteerRegistrationForm from "@/components/VolunteerRegistrationForm";

const VOLUNTEER_CATEGORIES = [
  "International Volunteers",
  "Continental Volunteers",
  "National Volunteers",
  "State Volunteers",
  "Senatorial Volunteers",
  "Local Government (LGA) Volunteers",
  "Ward Volunteers",
  "Unit Volunteers"
];

const Volunteers = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <SectionHeading title="Volunteer Structure" subtitle="Join our global movement across all levels of community." />
        </div>

        {!showForm ? (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-6 text-gray-700">
              <p>
                We are currently building our worldwide structure, continental structure, National Structures in all the Countries of the world chapters or volunteers across various geopolitical zones.
              </p>
              <p>
                This enables us to respond to needs locally, while learning from diverse contexts and adapting our approaches to each community's unique priorities.
              </p>
              <p className="font-semibold text-lg text-navy">
                Click on a volunteer group below to learn more, or start your registration.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {VOLUNTEER_CATEGORIES.map(category => (
                <Button 
                  key={category} 
                  variant={activeCategory === category ? "gold" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="text-center mt-12 bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-navy mb-4">Ready to step up?</h3>
              <p className="mb-6 text-gray-600">
                Become part of our passionate community of trailblazers, visionaries, mentors, and changemakers. All volunteers must pay a registration fee corresponding to their chosen tier.
              </p>
              <Button variant="gold" size="lg" onClick={() => setShowForm(true)}>
                Start Registration & Payment
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                ← Back to Structure
              </Button>
            </div>
            <VolunteerRegistrationForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Volunteers;
