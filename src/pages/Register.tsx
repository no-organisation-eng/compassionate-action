import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.jpg';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', country: '', state: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.country, form.state);
      navigate('/community', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <img src={logo} alt="Enlighten Community" className="h-20 w-20 rounded-full mx-auto mb-4 border-2 border-gold/40 object-cover shadow-xl" />
          <h1 className="font-heading text-3xl font-bold text-gold-light">Join the Community</h1>
          <p className="text-gold-light/70 mt-2">Create your free Enlighten Community account</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-5 text-sm text-destructive">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Full Name <span className="text-destructive">*</span></label>
              <Input placeholder="e.g. John Ade" value={form.name} onChange={set('name')} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Email Address <span className="text-destructive">*</span></label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">Country</label>
                <Input placeholder="e.g. Nigeria" value={form.country} onChange={set('country')} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">State</label>
                <Input placeholder="e.g. Akwa Ibom" value={form.state} onChange={set('state')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} placeholder="At least 6 characters"
                  value={form.password} onChange={set('password')} required className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Confirm Password <span className="text-destructive">*</span></label>
              <Input type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} required />
            </div>
            <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2" type="submit" disabled={loading}>
              {loading ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
