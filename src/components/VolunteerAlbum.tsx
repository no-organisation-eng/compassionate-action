import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Volunteer } from "@/lib/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SectionHeading from "@/components/SectionHeading";

const VolunteerAlbum = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedVolunteers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('*, profiles(name, country, state)')
        .eq('status', 'Approved')
        .not('photo_url', 'is', null)
        .order('is_executive', { ascending: false }) // Show executives first
        .limit(10); // Show top 10 for landing page

      if (!error && data) {
        setVolunteers(data as any);
      }
      setLoading(false);
    };

    fetchApprovedVolunteers();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading volunteer album...
      </div>
    );
  }

  if (volunteers.length === 0) {
    return null; // Don't show the section if no approved volunteers with photos yet
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Volunteer Album" 
          subtitle="Meet the approved leaders and changemakers making a difference globally." 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {volunteers.map((vol) => (
            <div key={vol.id} className="bg-card rounded-xl p-6 border shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group">
              <div className="relative">
                <Avatar className="w-24 h-24 mb-4 border-2 border-gold/30 group-hover:border-gold transition-colors">
                  <AvatarImage src={vol.photo_url || ''} alt={vol.profiles?.name || 'Volunteer'} className="object-cover" />
                  <AvatarFallback className="bg-muted text-xl">
                    {vol.profiles?.name ? vol.profiles.name.substring(0, 2).toUpperCase() : 'V'}
                  </AvatarFallback>
                </Avatar>
                {vol.is_executive && (
                  <div className="absolute -bottom-2 -right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full border border-white">
                    Exec
                  </div>
                )}
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-1">
                {vol.profiles?.name || 'Anonymous'}
              </h3>
              <p className="text-teal text-sm font-medium mb-1">{vol.tier}</p>
              <p className="text-xs text-muted-foreground">
                {vol.location_context?.details || vol.profiles?.state || 'Global'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerAlbum;
