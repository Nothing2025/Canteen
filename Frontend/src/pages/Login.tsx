import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back!');
      // Role-based redirect
      const stored = JSON.parse(localStorage.getItem('canteen_user') || '{}');
      if (stored.role === 'admin') navigate('/admin');
      else if (stored.role === 'staff') navigate('/staff');
      else navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Try: student@canteen.com, admin@canteen.com, or staff@canteen.com');
    }
  };

  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-primary-foreground/20" style={{
              width: `${100 + i * 60}px`, height: `${100 + i * 60}px`,
              top: `${10 + i * 15}%`, left: `${5 + i * 12}%`,
            }} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">SmartCanteen</h1>
          <p className="text-primary-foreground/80 text-lg max-w-md font-body">
            Order delicious meals, track your orders in real-time, and skip the queue.
          </p>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">SmartCanteen</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8 font-body">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base shadow-glow hover:opacity-90 transition-opacity" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Quick Demo Login:</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Student', email: 'student@canteen.com' },
                { label: 'Admin', email: 'admin@canteen.com' },
                { label: 'Staff', email: 'staff@canteen.com' },
              ].map(opt => (
                <button
                  key={opt.email}
                  onClick={() => quickLogin(opt.email)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
