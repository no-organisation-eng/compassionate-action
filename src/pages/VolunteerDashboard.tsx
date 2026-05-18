import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, CheckCircle2, Share2, Users, TrendingUp, Heart, ExternalLink, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SectionHeading from '@/components/SectionHeading';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/donate?ref=${user?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Support Enlighten Community', text: 'Help transform lives — donate through my referral link!', url: referralLink });
    } else {
      copyLink();
    }
  };

  const stats = [
    { label: 'People Referred', value: '0', icon: Users, color: 'text-blue-500' },
    { label: 'Donations Mobilized', value: '₦0', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Your Rewards', value: '₦0', icon: Award, color: 'text-gold' },
    { label: 'Lives Impacted', value: '0', icon: Heart, color: 'text-red-500' },
  ];

  const steps = [
    { step: '1', title: 'Copy & Share Your Link', desc: 'Send your unique link via WhatsApp, SMS, email, or social media to friends, family, and your network.' },
    { step: '2', title: 'Someone Donates', desc: 'When anyone clicks your link and donates, 90% goes straight to humanitarian projects. The 10% network pool is shared.' },
    { step: '3', title: 'You Earn (Gen 1)', desc: 'As direct referrer, you earn 50% of the 10% pool — that is 5% of every donation made through your link.' },
    { step: '4', title: 'Your Network Grows', desc: 'People you refer can also share and build their own networks. You earn from their referrals too — down to infinity.' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Header */}
      <div className="gradient-hero py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy font-bold text-3xl shadow-xl border-4 border-gold/30 shrink-0">
              {user?.avatar}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gold-light/60 text-sm uppercase tracking-wider font-semibold mb-1">Volunteer Dashboard</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-gold-light">
                Welcome, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gold-light/70 mt-1">
                {[user?.country, user?.state].filter(Boolean).join(' · ')} &nbsp;·&nbsp; Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'Today'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center p-4 bg-secondary/30 rounded-xl border border-border">
                <s.icon className={`h-6 w-6 ${s.color} mx-auto mb-2`} />
                <div className="font-heading text-xl font-bold text-navy dark:text-gold-light">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-10 space-y-8">

        {/* ⭐ Referral Link Card */}
        <div className="bg-card rounded-2xl border-2 border-gold/40 p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-gold/10 p-3 rounded-xl shrink-0">
              <Share2 className="h-7 w-7 text-gold" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-navy dark:text-gold-light">Your Unique Referral Link</h2>
              <p className="text-sm text-muted-foreground">This link is exclusively yours — every donation made through it is tracked to you</p>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-xl border border-border p-4 flex items-center gap-3">
            <code className="font-mono text-sm text-navy dark:text-gold-light break-all flex-1 leading-relaxed">{referralLink}</code>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="gold" onClick={copyLink} className="flex items-center gap-2">
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy My Link'}
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 border-gold/30 hover:bg-gold/5">
              <Share2 className="h-4 w-4" /> Share via App
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2 border-gold/30 hover:bg-gold/5">
              <a href={referralLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Preview
              </a>
            </Button>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 text-xs text-muted-foreground flex gap-2">
            <Award className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>You earn <strong className="text-navy dark:text-gold-light">5% of every donation</strong> made through your link (50% of the 10% network pool). Build your network and earn from unlimited generations!</span>
          </div>
        </div>

        {/* WhatsApp quick share message */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h3 className="font-heading font-bold text-navy dark:text-gold-light">Quick Share Messages</h3>
          <p className="text-sm text-muted-foreground">Copy any of these ready-made messages with your link and paste into WhatsApp or SMS:</p>
          {[
            `🌟 Join me in supporting Enlighten Community — transforming lives through health, education & empowerment! Donate here: ${referralLink}`,
            `💙 From sickness to wellness, from fear to faith! Help Enlighten Community reach more lives. Your donation makes a real difference: ${referralLink}`,
          ].map((msg, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg p-3 text-xs text-card-foreground leading-relaxed">
              <p className="mb-2">{msg}</p>
              <button onClick={() => { navigator.clipboard.writeText(msg); toast.success('Message copied!'); }}
                className="text-gold hover:underline font-semibold flex items-center gap-1 text-xs">
                <Copy className="h-3 w-3" /> Copy message
              </button>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-bold text-navy dark:text-gold-light mb-6 text-lg">How the Referral Program Works</h3>
          <div className="space-y-5">
            {steps.map(s => (
              <div key={s.step} className="flex gap-4 items-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-card-foreground text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-border">
            <Link to="/referrals" className="text-sm text-gold hover:underline font-semibold flex items-center gap-1">
              View Full Referral Calculator & Distribution Model →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-bold text-navy dark:text-gold-light mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Community Hub', desc: 'Interact with other volunteers', path: '/community', Icon: Users },
              { label: 'Wellness Library', desc: 'Watch & share free health videos', path: '/wellness', Icon: Heart },
              { label: 'Donate Page', desc: 'Preview your referral link live', path: '/donate', Icon: TrendingUp },
            ].map(l => (
              <Link key={l.path} to={l.path} className="bg-card rounded-xl border border-border p-4 hover:border-gold/40 hover:shadow-md transition-all group flex items-center gap-3">
                <div className="bg-navy/5 dark:bg-navy-light/10 p-2.5 rounded-lg group-hover:bg-gold/10 transition-colors">
                  <l.Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-heading font-bold text-card-foreground text-sm">{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerDashboard;
