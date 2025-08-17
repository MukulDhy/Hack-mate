import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { useAuth } from '@/context/auth-context';
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app, you'd validate credentials
    const user = {
      id: '1',
      name: 'Alex Johnson',
      email: formData.email,
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    };
    login(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center p-4">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="p-8 shadow-strong">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
            >
              <span className="font-orbitron font-bold text-2xl text-white">HM</span>
            </motion.div>
            
            <h1 className="font-orbitron font-bold text-3xl text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your hackathon journey
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button variant="ghost" className="w-full h-12 border border-glass-border hover:bg-primary/10">
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>
            <Button variant="ghost" className="w-full h-12 border border-glass-border hover:bg-primary/10">
              <Chrome className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-glass-border"></div>
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-glass-border"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-glass-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}