import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import mpsLogo from '@/assets/mps-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  const hasEdgeWhitespace = (value: string) => value.trim() !== value;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = normalizeEmail(email);

      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast({
            title: 'Failed to send reset email',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Reset email sent!',
            description: 'Check your inbox for the password reset link.',
          });
          setIsForgotPassword(false);
        }
      } else {
        if (hasEdgeWhitespace(password)) {
          toast({
            title: 'Check your password',
            description:
              'It looks like your password has hidden leading/trailing whitespace (often from copy/paste). Please re-type it (don\'t paste) and try again.',
            variant: 'destructive',
          });
          return;
        }

        const { error } = await signIn(normalizedEmail, password);
        if (error) {
          toast({
            title: 'Login failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          navigate('/chat');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Background */}
      <div className="fixed inset-0" style={{ background: 'var(--gradient-light)' }} />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img src={mpsLogo} alt="MPS Logo" className="h-16 w-auto mx-auto mb-4" />
            
            <Badge variant="secondary" className="mb-3 gap-1.5 bg-primary/10 text-primary border-0">
              <Sparkles className="h-3 w-3" />
              AI-Powered Building Management
            </Badge>
            
            <h1 className="text-2xl font-heading font-semibold tracking-tight text-foreground">
              {isForgotPassword ? 'Reset your password' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isForgotPassword
                ? 'Enter your email to receive a reset link'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  className="h-11"
                />
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isForgotPassword ? 'Sending...' : 'Signing in...'}
                  </>
                ) : (
                  isForgotPassword ? 'Send Reset Link' : 'Sign in'
                )}
              </Button>
            </form>

            {isForgotPassword && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to login
                </button>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-heading font-semibold text-foreground">Mechanical Project Services</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
