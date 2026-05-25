import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, Droplets, GraduationCap, Users, ShieldCheck, Eye, Handshake,
  CreditCard, Bitcoin, ArrowRight, ArrowLeft, CheckCircle2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/SectionHeading";
import FlutterwaveButton from "@/components/FlutterwaveButton";
import CryptoPayment from "@/components/CryptoPayment";
import { formatNgn, ngnToUsdc, getReferralCode } from "@/lib/payment";

/* ─── Donation tiers ─────────────────────────────────────────────────────── */
const TIERS = [
  { amount: 5000,  label: "₦5,000",   impact: "Feed a family for a week",              icon: Heart },
  { amount: 10000, label: "₦10,000",  impact: "Support a child's education",           icon: GraduationCap },
  { amount: 25000, label: "₦25,000",  impact: "Provide clean water access",            icon: Droplets },
  { amount: 50000, label: "₦50,000+", impact: "Sponsor a community project",           icon: Users },
];

type Step = 'amount' | 'details' | 'payment' | 'success';
type Method = 'flutterwave' | 'crypto';

/* ─── Step indicator ─────────────────────────────────────────────────────── */
const STEPS_META = [
  { key: 'amount',  label: 'Amount' },
  { key: 'details', label: 'Your Info' },
  { key: 'payment', label: 'Payment' },
  { key: 'success', label: 'Done' },
];
const StepBar = ({ current }: { current: Step }) => {
  const idx = STEPS_META.findIndex(s => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS_META.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all ${
            i < idx  ? 'bg-gold border-gold text-navy' :
            i === idx ? 'bg-navy border-navy text-white dark:bg-gold dark:border-gold dark:text-navy' :
                        'bg-card border-border text-muted-foreground'
          }`}>
            {i < idx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`hidden sm:block ml-1.5 mr-3 text-xs font-medium ${i === idx ? 'text-navy dark:text-gold-light' : 'text-muted-foreground'}`}>
            {s.label}
          </span>
          {i < STEPS_META.length - 1 && <div className={`h-px w-6 sm:w-10 ${i < idx ? 'bg-gold' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
};

/* ─── Main Donate page ───────────────────────────────────────────────────── */
const Donate = () => {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<Method>('flutterwave');
  const [txRef, setTxRef] = useState('');

  const refCode = getReferralCode();
  const finalAmount = amount || parseInt(customAmount) || 0;

  const handleSuccess = (ref: string) => { setTxRef(ref); setStep('success'); };

  /* ── Step 1: Amount ── */
  const AmountStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light mb-4">Select an amount</h3>
        <div className="grid grid-cols-2 gap-3">
          {TIERS.map(t => (
            <button key={t.amount} onClick={() => { setAmount(t.amount); setCustomAmount(''); }}
              className={`rounded-xl border-2 p-4 text-left transition-all hover:border-gold/60 ${
                amount === t.amount ? 'border-gold bg-gold/5 shadow-md' : 'border-border bg-card'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <t.icon className={`h-4 w-4 ${amount === t.amount ? 'text-gold' : 'text-muted-foreground'}`} />
                <span className={`font-mono font-bold text-lg ${amount === t.amount ? 'text-navy dark:text-gold-light' : 'text-card-foreground'}`}>{t.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.impact}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-card-foreground">Or enter a custom amount (₦)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₦</span>
          <Input type="number" placeholder="e.g. 15000" className="pl-8 font-mono"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setAmount(0); }} />
        </div>
      </div>

      {finalAmount > 0 && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Your donation</p>
            <p className="text-2xl font-mono font-extrabold text-navy dark:text-gold-light">{formatNgn(finalAmount)}</p>
            <p className="text-xs text-muted-foreground">≈ {ngnToUsdc(finalAmount)} USDC</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Project receives</p>
            <p className="font-bold text-gold">{formatNgn(finalAmount * 0.9)}</p>
            <p className="text-xs text-muted-foreground">90% of donation</p>
          </div>
        </div>
      )}

      {refCode && (
        <div className="flex items-center gap-2 text-xs bg-teal/10 border border-teal/20 rounded-lg px-3 py-2 text-teal">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          You were referred by an Enlighten Community advocate. Thank you for giving!
        </div>
      )}

      <Button variant="gold" size="lg" className="w-full flex items-center gap-2" onClick={() => setStep('details')} disabled={finalAmount < 500}>
        Continue <ArrowRight className="h-4 w-4" />
      </Button>
      {finalAmount > 0 && finalAmount < 500 && <p className="text-xs text-destructive text-center">Minimum donation is ₦500</p>}
    </div>
  );

  /* ── Step 2: Donor Details ── */
  const DetailsStep = () => (
    <div className="space-y-5">
      <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light">Your information</h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Full Name <span className="text-destructive">*</span></label>
          <Input placeholder="e.g. John Adeyemi" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Email Address <span className="text-destructive">*</span></label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <p className="text-xs text-muted-foreground">Your receipt and impact updates will be sent here.</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Phone Number</label>
          <Input type="tel" placeholder="e.g. 08012345678" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={() => setStep('amount')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="gold" size="lg" className="flex-1 flex items-center gap-2"
          onClick={() => setStep('payment')} disabled={!name.trim() || !email.trim()}>
          Choose Payment <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  /* ── Step 3: Payment Method ── */
  const PaymentStep = () => (
    <div className="space-y-6">
      <h3 className="font-heading font-bold text-lg text-navy dark:text-gold-light">
        Choose how to pay <span className="font-mono text-gold">({formatNgn(finalAmount)})</span>
      </h3>

      {/* Method toggle */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: 'flutterwave' as Method, label: 'Card / Bank / USSD', sublabel: 'NGN · Instant', icon: CreditCard },
          { id: 'crypto'      as Method, label: 'Crypto on Base',    sublabel: 'USDC · ETH',   icon: Bitcoin },
        ] as const).map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              method === m.id ? 'border-gold bg-gold/5 shadow-md' : 'border-border bg-card hover:border-gold/40'
            }`}>
            <m.icon className={`h-6 w-6 mb-2 ${method === m.id ? 'text-gold' : 'text-muted-foreground'}`} />
            <p className={`font-semibold text-sm ${method === m.id ? 'text-navy dark:text-gold-light' : 'text-card-foreground'}`}>{m.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.sublabel}</p>
          </button>
        ))}
      </div>

      {/* Payment widget */}
      <div className="pt-1">
        {method === 'flutterwave' ? (
          <div className="space-y-4">
            <div className="bg-secondary/30 rounded-xl border border-border p-4 text-xs space-y-1 text-muted-foreground">
              <p>✓ Debit/Credit Card (Visa, Mastercard, Verve)</p>
              <p>✓ Bank Transfer</p>
              <p>✓ USSD (*909#, *737# etc.)</p>
              <p>✓ Mobile Money</p>
              <p>✓ Barter by Flutterwave</p>
            </div>
            <FlutterwaveButton
              amount={finalAmount}
              email={email}
              name={name}
              phone={phone}
              onSuccess={handleSuccess}
              onClose={() => {}}
            />
          </div>
        ) : (
          <CryptoPayment
            amountNgn={finalAmount}
            donorName={name}
            onConfirm={handleSuccess}
          />
        )}
      </div>

      <Button variant="outline" onClick={() => setStep('details')} className="flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
    </div>
  );

  /* ── Step 4: Success ── */
  const SuccessStep = () => (
    <div className="text-center space-y-6 py-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border-4 border-gold/30 mx-auto">
        <CheckCircle2 className="h-10 w-10 text-gold" />
      </div>
      <div>
        <h3 className="font-heading text-2xl font-bold text-navy dark:text-gold-light">Thank You, {name.split(' ')[0]}!</h3>
        <p className="text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
          Your donation of <strong className="text-navy dark:text-gold-light">{formatNgn(finalAmount)}</strong> has been received.
          A receipt will be sent to <strong>{email}</strong>.
        </p>
      </div>
      {txRef && (
        <div className="bg-secondary/40 rounded-xl border border-border p-4 text-xs font-mono text-muted-foreground break-all">
          <p className="font-semibold text-card-foreground mb-1">Transaction Reference</p>
          {txRef}
        </div>
      )}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-muted-foreground">
        <p><span className="font-bold text-navy dark:text-gold-light">{formatNgn(finalAmount * 0.9)}</span> goes directly to community projects.</p>
        <p className="mt-1">From sickness to wellness, fear to faith — thank you! 🙏</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button variant="gold" onClick={() => { setStep('amount'); setAmount(0); setCustomAmount(''); setName(''); setEmail(''); setPhone(''); setTxRef(''); }}>
          Donate Again
        </Button>
        <Button variant="outline" asChild>
          <Link to="/community">Join the Community</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Heart className="h-12 w-12 text-gold mx-auto mb-5" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gold-light mb-4">
            Be the Reason Someone Lives Better
          </h1>
          <p className="text-gold-light/80 text-lg">
            Every donation, no matter how small, creates lasting change in someone's life.
          </p>
        </div>
      </section>

      {/* Main donation card */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
            <StepBar current={step} />
            {step === 'amount'  && <AmountStep />}
            {step === 'details' && <DetailsStep />}
            {step === 'payment' && <PaymentStep />}
            {step === 'success' && <SuccessStep />}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-10 bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Eye, label: "Transparent Operations" },
              { icon: ShieldCheck, label: "Proven Impact" },
              { icon: Handshake, label: "Community-Driven Approach" },
            ].map(t => (
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
};

export default Donate;
