import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/community';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Enlighten Community" className="h-20 w-20 rounded-full mx-auto mb-4 border-2 border-gold/40 object-cover shadow-xl" />
          <h1 className="font-heading text-3xl font-bold text-gold-light">Welcome Back</h1>
          <p className="text-gold-light/70 mt-2">Sign in to access your community</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 mb-5 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Email Address</label>
              <Input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">Password</label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2" type="submit" disabled={loading}>
              {loading ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            New to Enlighten Community?{' '}
            <Link to="/register" className="text-gold hover:underline font-semibold">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
