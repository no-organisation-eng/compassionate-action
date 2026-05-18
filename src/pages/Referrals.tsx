import { useState, useMemo } from "react";
import { 
  Heart, Users, Share2, Copy, Plus, Coins, Info, 
  HelpCircle, CheckCircle2, Award, ArrowRight, 
  Calculator, BookOpen, User, ArrowUpRight, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SectionHeading from "@/components/SectionHeading";

// Mathematical helper for Model A (Halving Geometric Series)
const calculatePayouts = (donation: number, depth: number) => {
  const projectShare = donation * 0.90;
  const networkPool = donation * 0.10;
  
  const payouts = [];
  let totalDistributed = 0;
  
  // Gen 1 (50% of the 10% pool)
  const gen1 = networkPool * 0.50;
  payouts.push({
    generation: 1,
    label: "1st Generation (Direct Referral)",
    percentage: 50,
    amount: gen1,
    totalPercentage: 5
  });
  totalDistributed += gen1;
  
  // Gen 2 (20% of the 10% pool)
  const gen2 = networkPool * 0.20;
  payouts.push({
    generation: 2,
    label: "2nd Generation (Indirect Referral)",
    percentage: 20,
    amount: gen2,
    totalPercentage: 2
  });
  totalDistributed += gen2;
  
  // Gen 3 to depth (Halving of the remaining 30% pool to infinity)
  for (let k = 3; k <= depth; k++) {
    const factor = Math.pow(0.5, k - 2); // Gen 3: 0.5, Gen 4: 0.25, Gen 5: 0.125
    const genKPercentageOfPool = 30 * factor; // Gen 3: 15%, Gen 4: 7.5%, Gen 5: 3.75%
    const amount = networkPool * (genKPercentageOfPool / 100);
    payouts.push({
      generation: k,
      label: `${k}th Generation (Infinite Decay)`,
      percentage: genKPercentageOfPool,
      amount: amount,
      totalPercentage: genKPercentageOfPool * 0.1
    });
    totalDistributed += amount;
  }
  
  // Reclaimed by project (undistributed pool) due to finite network depth
  const remainingReclaimed = Math.max(0, networkPool - totalDistributed);
  
  return {
    projectShare,
    networkPool,
    payouts,
    totalDistributed,
    remainingReclaimed,
    finalProjectTotal: projectShare + remainingReclaimed
  };
};

// Initial simulated team downline
interface TeamMember {
  id: string;
  name: string;
  generation: number;
  referredBy: string;
  totalDonated: number;
  joinDate: string;
}

const Referrals = () => {
  // Calculator States
  const [donationVal, setDonationVal] = useState(10000);
  const [depthVal, setDepthVal] = useState(5);
  
  // Custom Affiliate link states
  const [nameInput, setNameInput] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [affiliateGenerated, setAffiliateGenerated] = useState(false);
  const [mockEarnings, setMockEarnings] = useState(0);

  // Dynamic Downline States (Tree and referrals)
  const [team, setTeam] = useState<TeamMember[]>([
    { id: "u1", name: "Sarah Jenkins", generation: 1, referredBy: "You", totalDonated: 15000, joinDate: "2026-05-10" },
    { id: "u2", name: "David Kalu", generation: 1, referredBy: "You", totalDonated: 0, joinDate: "2026-05-12" },
    { id: "u3", name: "Elena Rostova", generation: 2, referredBy: "Sarah Jenkins", totalDonated: 25000, joinDate: "2026-05-14" },
    { id: "u4", name: "Michael Obi", generation: 3, referredBy: "Elena Rostova", totalDonated: 50000, joinDate: "2026-05-15" }
  ]);

  const [newMemberName, setNewMemberName] = useState("");
  const [sponsorId, setSponsorId] = useState("you");

  // Calculate network splits based on inputs
  const splits = useMemo(() => {
    return calculatePayouts(donationVal, depthVal);
  }, [donationVal, depthVal]);

  // Generate affiliate link
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const slug = nameInput.toLowerCase().replace(/[^a-z0-9]/g, "-");
    setAffiliateLink(`https://worldenlighten.org/donate?ref=${slug}`);
    setAffiliateGenerated(true);
    toast.success("Affiliate profile generated successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // Add new simulated member to the network tree
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    let sponsorName = "You";
    let gen = 1;

    if (sponsorId !== "you") {
      const parent = team.find(m => m.id === sponsorId);
      if (parent) {
        sponsorName = parent.name;
        gen = parent.generation + 1;
      }
    }

    const newMember: TeamMember = {
      id: `u_${Date.now()}`,
      name: newMemberName,
      generation: gen,
      referredBy: sponsorName,
      totalDonated: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setTeam([...team, newMember]);
    setNewMemberName("");
    toast.success(`Successfully added ${newMemberName} to Gen ${gen}!`);
  };

  // Simulate a donation from a downline member and distribute earnings upwards
  const simulateDonation = (memberId: string, amount: number) => {
    if (amount <= 0) return;

    // Update member's donation history
    setTeam(prev => prev.map(m => m.id === memberId ? { ...m, totalDonated: m.totalDonated + amount } : m));

    // Get the member that donated
    const donor = team.find(m => m.id === memberId);
    if (!donor) return;

    // Calculate payouts going to 'You'
    // 'You' is at Generation 0 relative to the structure
    // If donor is Gen 1 relative to 'You', 'You' gets 1st Gen payout (50% of the 10% pool)
    // If donor is Gen 2 relative to 'You', 'You' gets 2nd Gen payout (20% of the 10% pool)
    // If donor is Gen k relative to 'You', 'You' gets kth Gen payout (Geometric decay of 30% pool)
    const genDiff = donor.generation; 
    const pool = amount * 0.10;
    let payoutToYou = 0;

    if (genDiff === 1) {
      payoutToYou = pool * 0.50; // 50% of 10%
    } else if (genDiff === 2) {
      payoutToYou = pool * 0.20; // 20% of 10%
    } else if (genDiff >= 3) {
      const factor = Math.pow(0.5, genDiff - 2);
      payoutToYou = pool * (0.30 * factor);
    }

    if (payoutToYou > 0) {
      setMockEarnings(prev => prev + payoutToYou);
      toast.success(
        `Simulation: ${donor.name} (Gen ${genDiff}) donated ₦${amount.toLocaleString()}! You received ₦${payoutToYou.toLocaleString()}!`,
        { duration: 5000 }
      );
    } else {
      toast.info(
        `Simulation: ${donor.name} (Gen ${genDiff}) donated ₦${amount.toLocaleString()}! Payout flowed up the chain beyond You.`,
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <section className="gradient-hero py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 animate-fade-up">
          <Coins className="h-14 w-14 text-gold mx-auto mb-6 animate-pulse" />
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gold-light mb-6">
            The Power of <span className="text-gold">Compassionate Alignment</span>
          </h1>
          <p className="text-gold-light/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Expand our impact and sustain our network. Our unique peer-to-peer structure ensures 90% of every donation goes straight to humanitarian relief, while 10% feeds back to inspire and support our advocates to infinity.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#simulator">
              <Button variant="hero" size="lg" className="flex items-center gap-2">
                <Calculator className="h-5 w-5" /> Calculate Rewards
              </Button>
            </a>
            <a href="#affiliate-section">
              <Button variant="outline-light" size="lg" className="flex items-center gap-2">
                <Share2 className="h-5 w-5" /> Become an Advocate
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Structure Highlights */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start gap-4 p-4">
              <div className="bg-navy/10 dark:bg-navy-light/20 p-3 rounded-lg shrink-0">
                <Heart className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light mb-1">90% Direct Aid</h3>
                <p className="text-sm text-muted-foreground">Every single naira supports food, water, medical aids, and schooling projects on the ground. Fully audited and transparent.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="bg-navy/10 dark:bg-navy-light/20 p-3 rounded-lg shrink-0">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light mb-1">Multi-Gen Advocate Rewards</h3>
                <p className="text-sm text-muted-foreground">Sharing is recognized. Direct referrers receive 5% (50% of the network pool), Gen 2 gets 2% (20%), and infinite depth decays down the line.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="bg-navy/10 dark:bg-navy-light/20 p-3 rounded-lg shrink-0">
                <Coins className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light mb-1">Project Reclaim Ethics</h3>
                <p className="text-sm text-muted-foreground">If a donation chain is shorter than infinity, any unallocated pool funds immediately revert to the Project. Zero waste, maximum integrity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Tabs Workspace */}
      <section id="simulator" className="py-16 container mx-auto px-4 max-w-6xl">
        <SectionHeading 
          title="Interactive Network Sandbox" 
          subtitle="Explore the math, model your referrals, and test live distributions with our custom-built simulator." 
        />
        
        <Tabs defaultValue="calculator" className="w-full bg-card rounded-2xl border border-border p-6 shadow-xl space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-secondary p-1 rounded-xl">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" /> 1. Reward Calculator
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> 2. Downline Tree
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> 3. Affiliate Portal
            </TabsTrigger>
            <TabsTrigger value="math" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> 4. Convergence Proof
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CALCULATOR */}
          <TabsContent value="calculator" className="space-y-6 animate-fade-up">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-xl text-navy dark:text-gold-light mb-4">Set Donation Amount</h3>
                  <div className="bg-secondary/40 p-4 rounded-xl space-y-4 border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Donation Value (₦)</span>
                      <Input 
                        type="number" 
                        value={donationVal} 
                        onChange={(e) => setDonationVal(Math.max(1000, Number(e.target.value)))}
                        className="w-32 text-right font-mono font-bold"
                      />
                    </div>
                    <Slider 
                      value={[donationVal]} 
                      min={1000} 
                      max={100000} 
                      step={1000}
                      onValueChange={(val) => setDonationVal(val[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                      <span>₦1,000</span>
                      <span>₦50,000</span>
                      <span>₦100,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-navy dark:text-gold-light mb-4">Simulate Chain Depth</h3>
                  <div className="bg-secondary/40 p-4 rounded-xl space-y-4 border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Generations Above Donor</span>
                      <span className="font-mono font-bold text-lg">{depthVal} Gen</span>
                    </div>
                    <Slider 
                      value={[depthVal]} 
                      min={1} 
                      max={10} 
                      step={1}
                      onValueChange={(val) => setDepthVal(val[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                      <span>1 Gen (Direct only)</span>
                      <span>5 Gen</span>
                      <span>10 Gen (Decayed splits)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 p-5 rounded-xl border border-gold/10 space-y-3">
                  <h4 className="font-heading font-semibold text-navy dark:text-gold text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0" /> Ethical Reclaim Impact
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Notice that in a network of depth <span className="font-semibold">{depthVal}</span>, the remaining <span className="font-mono text-navy dark:text-gold-light font-bold">₦{splits.remainingReclaimed.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span> is undistributed because there are no sponsors further up. This amount automatically flows into the <span className="font-semibold">Project Fund</span>, raising total direct project aid to <span className="font-bold font-mono">₦{splits.finalProjectTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span> ({((splits.finalProjectTotal / donationVal) * 100).toFixed(2)}%)!
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Splitting Cards */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="bg-navy border-gold/20 text-gold-light">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gold-light/60 text-xs uppercase tracking-wider">Direct Project Allocation</CardDescription>
                      <CardTitle className="text-3xl font-mono font-extrabold text-gold">
                        ₦{splits.finalProjectTotal.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Project Core (90%):</span>
                        <span className="font-mono">₦{splits.projectShare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Reclaimed Surplus:</span>
                        <span className="font-mono">₦{splits.remainingReclaimed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gold/10 flex justify-between items-center text-sm font-bold text-white">
                        <span>Actual Direct Aid:</span>
                        <span>{((splits.finalProjectTotal / donationVal) * 100).toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-muted-foreground text-xs uppercase tracking-wider">Network Distribution</CardDescription>
                      <CardTitle className="text-3xl font-mono font-extrabold text-navy dark:text-gold-light">
                        ₦{splits.totalDistributed.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Network Share Max (10%):</span>
                        <span className="font-mono">₦{splits.networkPool.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Distributed Pool:</span>
                        <span className="font-mono">₦{splits.totalDistributed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-sm font-bold text-muted-foreground">
                        <span>Network Paid:</span>
                        <span className="text-navy dark:text-gold font-mono">{((splits.totalDistributed / donationVal) * 100).toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                  <h4 className="font-heading font-bold text-sm text-navy dark:text-gold-light mb-3">Generation Split Breakdown</h4>
                  <div className="space-y-3">
                    {splits.payouts.map((p) => (
                      <div key={p.generation} className="bg-card rounded-lg p-3 border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-mono font-bold">
                            G{p.generation}
                          </span>
                          <div>
                            <span className="font-medium text-card-foreground block sm:inline">{p.label}</span>
                            <span className="text-xs text-muted-foreground sm:ml-2">({p.percentage.toFixed(2)}% of Network Pool)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded font-medium text-muted-foreground font-mono">
                            {p.totalPercentage.toFixed(2)}% of Donation
                          </span>
                          <span className="font-mono font-bold text-navy dark:text-gold">
                            ₦{p.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </TabsContent>

          {/* TAB 2: INTERACTIVE TEAM TREE SIMULATOR */}
          <TabsContent value="simulator" className="space-y-6 animate-fade-up">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Add simulated member & Simulation controls */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-secondary/20 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading font-bold text-navy dark:text-gold-light">Add simulated recruit</CardTitle>
                    <CardDescription className="text-xs">Create recruits at different depths to test calculations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Recruit Name</span>
                        <Input 
                          placeholder="E.g. Johnson Cole" 
                          value={newMemberName} 
                          onChange={(e) => setNewMemberName(e.target.value)}
                          required
                          className="bg-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Referrer / Sponsor</span>
                        <select 
                          value={sponsorId}
                          onChange={(e) => setSponsorId(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm"
                        >
                          <option value="you">You (Root Sponsor)</option>
                          {team.filter(m => m.generation < 5).map((m) => (
                            <option key={m.id} value={m.id}>{m.name} (Gen {m.generation})</option>
                          ))}
                        </select>
                      </div>
                      <Button variant="gold" size="sm" type="submit" className="w-full flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" /> Add to Downline
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-navy border-gold/20 text-gold-light">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2.5 rounded-lg">
                        <Award className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-white">Your Simulated Earnings</h4>
                        <p className="text-xs text-gold-light/60">Updated live as downline simulates donations</p>
                      </div>
                    </div>
                    <div className="text-3xl font-mono font-extrabold text-gold py-2 border-y border-white/10">
                      ₦{mockEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                    <div className="text-xs text-gold-light/80 leading-relaxed">
                      💡 Click the **"Simulate Donation"** button on any downline member card to send a mock donation up the sponsor chain. You will immediately watch your rewards accumulate based on their generation distance from you!
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive visual layout */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-heading font-bold text-navy dark:text-gold-light">Visual Referral Hierarchy</h4>
                    <Badge variant="outline" className="font-mono bg-card">
                      {team.length + 1} Total Nodes
                    </Badge>
                  </div>

                  {/* Visual tree map */}
                  <div className="space-y-4">
                    {/* ROOT SPONSOR (YOU) */}
                    <div className="flex items-center justify-between bg-card p-4 rounded-xl border-l-4 border-gold shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy font-bold shadow-inner">
                          YOU
                        </div>
                        <div>
                          <h5 className="font-heading font-bold text-navy dark:text-gold-light">You (Root Sponsor)</h5>
                          <span className="text-xs text-muted-foreground">Generation 0</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono text-gold-light bg-navy">
                        Accumulating Wallet
                      </Badge>
                    </div>

                    {/* DOWNLINE MEMBERS */}
                    {team.map((m) => (
                      <div 
                        key={m.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between bg-card p-4 rounded-xl border border-border hover:border-gold/30 hover:shadow-lg transition-all gap-4"
                        style={{ marginLeft: `${m.generation * 24}px` }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Dotted indicator line */}
                          <div className="absolute -ml-6 -mt-8 w-6 h-8 border-l border-b border-border/80 rounded-bl-lg pointer-events-none" />
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-mono font-bold shadow-md">
                            G{m.generation}
                          </div>
                          <div>
                            <h5 className="font-heading font-bold text-card-foreground text-sm">{m.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              Sponsored by: <span className="font-semibold text-navy dark:text-gold-light">{m.referredBy}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap md:flex-nowrap">
                          <div className="text-xs text-right pr-2">
                            <span className="text-muted-foreground block">Simulated Donation</span>
                            <span className="font-mono font-bold text-navy dark:text-gold-light">₦{m.totalDonated.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="xs" 
                              onClick={() => simulateDonation(m.id, 10000)}
                              className="text-xs hover:bg-gold hover:text-navy border-gold/30"
                            >
                              ₦10k
                            </Button>
                            <Button 
                              variant="outline" 
                              size="xs" 
                              onClick={() => simulateDonation(m.id, 25000)}
                              className="text-xs hover:bg-gold hover:text-navy border-gold/30"
                            >
                              ₦25k
                            </Button>
                            <Button 
                              variant="outline" 
                              size="xs" 
                              onClick={() => simulateDonation(m.id, 50000)}
                              className="text-xs hover:bg-gold hover:text-navy border-gold/30"
                            >
                              ₦50k
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </TabsContent>

          {/* TAB 3: AFFILIATE PORTAL MOCKUP */}
          <TabsContent value="affiliate" id="affiliate-section" className="space-y-6 animate-fade-up">
            <div className="max-w-3xl mx-auto space-y-6">
              {!affiliateGenerated ? (
                <Card className="border-border">
                  <CardHeader className="text-center">
                    <CardTitle className="font-heading text-2xl font-bold text-navy dark:text-gold-light">Register as an Impact Advocate</CardTitle>
                    <CardDescription>Enter your details below to generate your custom compassionate referral profile and link.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleGenerateLink} className="space-y-4 max-w-md mx-auto">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-muted-foreground">Your Full Name / Brand</span>
                        <Input 
                          placeholder="E.g. Cynthia Paul" 
                          value={nameInput} 
                          onChange={(e) => setNameInput(e.target.value)} 
                          required
                        />
                      </div>
                      <Button variant="gold" size="lg" type="submit" className="w-full">
                        Initialize Advocate Link
                      </Button>
                    </form>
                    <div className="bg-secondary/40 p-4 rounded-xl border border-border text-center text-xs text-muted-foreground leading-relaxed">
                      🔒 Enlighten Community advocates are volunteers committed to community support. There are zero signup fees. Network payouts are calculated automatically at payment gateways (e.g. Paystack, Flutterwave) and distributed straight to advocacy accounts.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Active Portal Header */}
                  <Card className="bg-navy border-gold/20 text-gold-light">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy font-bold text-lg shadow-md">
                          {nameInput.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-heading text-xl font-bold text-white">{nameInput}</h4>
                          <span className="text-xs text-gold-light/60 font-medium">Impact Advocate ID: WEO-{(nameInput.length * 179 + 3021)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gold-light/60 uppercase block">Active Referrals</span>
                        <span className="text-2xl font-bold text-gold">4 Members</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Link Copier Card */}
                  <Card className="border-border bg-card">
                    <CardContent className="pt-6 space-y-4">
                      <h4 className="font-heading font-semibold text-navy dark:text-gold-light text-sm">Your Referral Link</h4>
                      <p className="text-xs text-muted-foreground">Share this unique URL with potential donors, networks, and groups to mobilize impact.</p>
                      <div className="flex gap-2">
                        <Input 
                          value={affiliateLink} 
                          readOnly 
                          className="font-mono bg-secondary/30 select-all"
                        />
                        <Button variant="outline" onClick={() => copyToClipboard(affiliateLink)} className="shrink-0 flex items-center gap-2">
                          <Copy className="h-4 w-4" /> Copy
                        </Button>
                        <Button variant="gold" onClick={() => toast.success("Opening link simulation!")} className="shrink-0 flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4" /> Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dashboard stats */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-card p-4 rounded-xl border border-border text-center">
                      <span className="text-xs text-muted-foreground uppercase block font-semibold">Total Mobilized</span>
                      <span className="text-2xl font-heading font-bold text-navy dark:text-gold-light mt-1 font-mono">₦90,000</span>
                      <span className="text-[10px] text-muted-foreground block mt-1">From 3 active donors</span>
                    </div>
                    <div className="bg-card p-4 rounded-xl border border-border text-center">
                      <span className="text-xs text-muted-foreground uppercase block font-semibold">Advocacy Rewards</span>
                      <span className="text-2xl font-heading font-bold text-navy dark:text-gold-light mt-1 font-mono">₦5,700</span>
                      <span className="text-[10px] text-muted-foreground block mt-1">From direct & downline activity</span>
                    </div>
                    <div className="bg-card p-4 rounded-xl border border-border text-center">
                      <span className="text-xs text-muted-foreground uppercase block font-semibold">Direct Project Aid</span>
                      <span className="text-2xl font-heading font-bold text-teal mt-1 font-mono">₦81,000</span>
                      <span className="text-[10px] text-muted-foreground block mt-1">Directly funded local water & food</span>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => setAffiliateGenerated(false)} className="text-xs">
                      Reset Mock Advocate Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 4: MATHEMATICAL CONVERGENCE PROOF */}
          <TabsContent value="math" className="space-y-6 animate-fade-up">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-xl font-bold text-navy dark:text-gold-light flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gold" /> Mathematical Integrity: Geometric Series Payout
                  </CardTitle>
                  <CardDescription>Why a referral split to infinity is sustainable and never leaks funds.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-card-foreground leading-relaxed">
                  <div>
                    <h4 className="font-heading font-semibold text-navy dark:text-gold mb-2">The Challenge of Infinite Referral Splits</h4>
                    <p className="text-muted-foreground">
                      In traditional multi-level programs, payment layers are strictly capped (e.g. 3, 5, or 7 levels) because paying commissions to unlimited levels would cause the payout to exceed 100% of the funds, leading to bankruptcy.
                    </p>
                  </div>

                  <div className="bg-secondary/40 p-5 rounded-xl border border-border space-y-3 font-mono text-xs text-navy dark:text-gold-light">
                    <div className="font-bold border-b border-border pb-1">Payout Distribution System (Model A):</div>
                    <div>Donation = D</div>
                    <div>Project Share = 0.90 * D</div>
                    <div>Network Share Pool = 0.10 * D</div>
                    <div className="pt-2 font-bold border-t border-border mt-2">Network Pool Allocation:</div>
                    <div>- Gen 1: 50% of Network Pool (5% of D)</div>
                    <div>- Gen 2: 20% of Network Pool (2% of D)</div>
                    <div>- Gen 3 to Infinity: 30% of Network Pool (3% of D)</div>
                  </div>

                  <div>
                    <h4 className="font-heading font-semibold text-navy dark:text-gold mb-2">The Convergence Proof</h4>
                    <p className="text-muted-foreground">
                      To distribute the remaining <span className="font-bold">30%</span> to infinity, we utilize a halving decay sequence where Gen 3 receives half of the pool, Gen 4 receives half of the next pool, and so on:
                    </p>
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border my-3 font-mono text-center text-sm font-bold">
                      Payout(k) = 0.30 * Pool * (1 / 2)^(k-2) &nbsp;&nbsp;[for k &ge; 3]
                    </div>
                    <p className="text-muted-foreground">
                      We prove the total infinite sum matches exactly 30% of the pool:
                    </p>
                    <div className="bg-secondary/20 p-4 rounded-xl border border-border my-3 font-mono text-xs space-y-2">
                      <div>Total Payouts (Gen 3+) = &sum;<sub>k=3</sub><sup>&infin;</sup> 0.30 &times; (1/2)<sup>k-2</sup></div>
                      <div>= 0.30 &times; [ (1/2) + (1/4) + (1/8) + (1/16) + ... ]</div>
                      <div>= 0.30 &times; 1</div>
                      <div>= 30% of the Network Pool</div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      Since the infinite geometric series converges exactly to <span className="font-bold">1</span>, the sum of all generation payouts is perfectly stable:
                    </p>
                    <div className="bg-navy p-3 text-center text-white rounded-lg font-mono text-sm font-bold">
                      50% (Gen 1) + 20% (Gen 2) + 30% (Gen 3 to Infinity) = 100% of Pool (10% of D)
                    </div>
                  </div>

                  <div className="bg-teal/5 border border-teal/20 rounded-xl p-4 flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-heading font-semibold text-navy dark:text-gold text-sm">Mathematically Guaranteed Sustainability</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        No matter how deep the referral chain is, the total payouts will never exceed 10% of the donation amount. When the chain is finite, any unclaimed geometric remainder is automatically reclaimed by the project core, protecting every single cent from administrative waste.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Trust & Transparency banner */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <SectionHeading 
            title="Transparent, Ethical Fundraising" 
            subtitle="At Enlighten Community, we believe that trust is our greatest asset." 
          />
          <p className="text-muted-foreground leading-relaxed">
            By leveraging smart calculations and automatic distribution pipelines, we remove the high administrative costs typically associated with marketing agencies, directing funds straight to community development while organically scaling our network of advocates.
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <span className="flex items-center gap-2 text-navy dark:text-gold-light font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5 text-gold" /> Real-time Blockchain Proofs
            </span>
            <span className="flex items-center gap-2 text-navy dark:text-gold-light font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5 text-gold" /> Instant advocates settlement
            </span>
            <span className="flex items-center gap-2 text-navy dark:text-gold-light font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5 text-gold" /> Reclaimed surplus integrity
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Referrals;
