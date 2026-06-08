import { useState } from 'react';
import { Play, Download, X, Search, Heart, Brain, Dumbbell, Stethoscope, Leaf, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';

interface Video {
  id: string; title: string; description: string;
  category: string; duration: string; youtubeId?: string; embedUrl?: string;
  gradient: string; Icon: React.ElementType;
}

const videos: Video[] = [
  { id: 'v0', title: 'African Traditional Medicine & Global Relevance', description: "An overview of the organization's definition of traditional medicine, and the global relevance of African Traditional Medicine.", category: 'Wellness', duration: 'Intro', embedUrl: 'https://app.heygen.com/embeds/406b3aa556444aa09541ae28d8eeb676', gradient: 'from-orange-600 to-amber-800', Icon: Leaf },
  { id: 'v1', title: 'Managing Stress & Anxiety Daily', description: 'Learn practical breathing techniques and mindfulness strategies to calm your nervous system and reduce stress in everyday life.', category: 'Mental Health', duration: '18:24', youtubeId: 'YMyofREc5Jk', gradient: 'from-purple-600 to-indigo-700', Icon: Brain },
  { id: 'v2', title: 'Plant-Based Nutrition Basics', description: 'A beginner-friendly guide to understanding plant-based diets, how they support immunity, and simple meal ideas on a budget.', category: 'Nutrition', duration: '22:11', youtubeId: 'dOhEbcQ_bKE', gradient: 'from-green-600 to-teal-700', Icon: Leaf },
  { id: 'v3', title: 'Morning Exercise for Beginners', description: '15-minute energizing morning workout that requires no equipment. Perfect for all fitness levels to build a daily health habit.', category: 'Fitness', duration: '15:00', youtubeId: 'gC_L9qAHVJ8', gradient: 'from-orange-500 to-red-600', Icon: Dumbbell },
  { id: 'v4', title: 'Basic First Aid Everyone Must Know', description: 'Life-saving first aid skills including CPR, treating wounds, managing choking, and responding to common emergencies.', category: 'First Aid', duration: '26:45', youtubeId: 'cosLMo4qMaY', gradient: 'from-red-600 to-rose-700', Icon: Stethoscope },
  { id: 'v5', title: 'Understanding Blood Pressure', description: 'What blood pressure numbers mean, how to monitor it at home, and natural lifestyle changes to maintain a healthy heart.', category: 'Wellness', duration: '14:30', youtubeId: 'Ab9OZsDECZw', gradient: 'from-blue-600 to-cyan-700', Icon: Heart },
  { id: 'v6', title: 'Sleep Hygiene for Better Health', description: 'Why sleep is medicine — proven science-backed habits that dramatically improve your sleep quality and daily energy.', category: 'Wellness', duration: '19:55', youtubeId: 'nm1TxQj9IsQ', gradient: 'from-navy to-indigo-800', Icon: BookOpen },
  { id: 'v7', title: 'Malaria Prevention & Home Care', description: 'Understanding malaria transmission, prevention strategies, early symptoms to watch for, and safe home management tips.', category: 'First Aid', duration: '24:00', youtubeId: 'PFkEt7ZAWKE', gradient: 'from-emerald-600 to-green-800', Icon: Stethoscope },
  { id: 'v8', title: 'Mindfulness Meditation for Beginners', description: 'A guided 10-minute mindfulness session teaching you how to train your attention, reduce anxiety, and build emotional resilience.', category: 'Mental Health', duration: '10:15', youtubeId: 'inpok4MKVLM', gradient: 'from-violet-600 to-purple-800', Icon: Brain },
  { id: 'v9', title: 'Cooking Healthy Meals on a Budget', description: 'Nutritious, delicious Nigerian and African recipes that are affordable, easy to make, and packed with health benefits.', category: 'Nutrition', duration: '28:40', youtubeId: 'BHQg0_tNXoM', gradient: 'from-amber-500 to-orange-700', Icon: Leaf },
];

const CATEGORIES = ['All', 'Nutrition', 'Mental Health', 'Fitness', 'First Aid', 'Wellness'];

const Wellness = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [playing, setPlaying] = useState<Video | null>(null);

  const filtered = videos.filter(v =>
    (activeCategory === 'All' || v.category === activeCategory) &&
    (v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <section className="gradient-hero py-16 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <Heart className="h-12 w-12 text-gold mx-auto mb-5" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gold-light mb-4">
            Health & Wellness Library
          </h1>
          <p className="text-gold-light/80 text-lg mb-8">
            Free educational videos on health, nutrition, fitness, and wellness — curated by Enlighten Community for every member.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search videos..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card/80 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-card border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-navy text-white shadow-md' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No videos found. Try a different search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(video => (
                <div key={video.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all group">
                  {/* Thumbnail */}
                  <div className={`bg-gradient-to-br ${video.gradient} relative h-44 flex items-center justify-center`}>
                    <video.Icon className="h-14 w-14 text-white/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button onClick={() => setPlaying(video)}
                        className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all group-hover:scale-110 duration-300">
                        <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 right-3 text-xs text-white/80 bg-black/40 rounded px-1.5 py-0.5 font-mono">{video.duration}</span>
                    <span className="absolute top-3 left-3 text-xs text-white bg-black/40 rounded-full px-2 py-0.5">{video.category}</span>
                  </div>
                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-heading font-bold text-card-foreground text-sm leading-snug">{video.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{video.description}</p>
                    <div className="flex gap-2 pt-1">
                      <Button variant="gold" size="sm" className="flex-1 flex items-center justify-center gap-1.5 text-xs"
                        onClick={() => setPlaying(video)}>
                        <Play className="h-3 w-3" /> Watch Free
                      </Button>
                      <a href={video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : video.embedUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs border-gold/30 hover:bg-gold/10">
                          {video.youtubeId ? <><Download className="h-3 w-3" /> Save</> : <><Play className="h-3 w-3" /> Open</>}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Download Note */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <SectionHeading title="100% Free for All Members" subtitle="All videos in our library are freely available to watch online. Click 'Save' on any video to open it on YouTube for offline download." />
          <p className="text-sm text-muted-foreground">
            Want to suggest a health topic? <a href="/community" className="text-gold hover:underline font-semibold">Post it in the Community Hub →</a>
          </p>
        </div>
      </section>

      {/* Video Modal Player */}
      {playing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPlaying(null)}>
          <div className="bg-card rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-card-foreground">{playing.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{playing.category} · {playing.duration}</p>
              </div>
              <button onClick={() => setPlaying(null)} className="text-muted-foreground hover:text-card-foreground p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe className="w-full h-full" src={playing.youtubeId ? `https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0` : playing.embedUrl}
                title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{playing.description}</p>
              <div className="flex gap-3 mt-4 justify-end">
                {playing.youtubeId && (
                  <a href={`https://www.youtube.com/watch?v=${playing.youtubeId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full flex items-center gap-2 border-gold/30"><Download className="h-4 w-4" /> Download from YouTube</Button>
                  </a>
                )}
                <Button variant="gold" onClick={() => setPlaying(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wellness;
