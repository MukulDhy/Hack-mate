import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from 'lucide-react';
import { showSuccess, showWarning } from '@/components/ui/ToasterMsg';
import { registerUser } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: 'mukul dahiya',
    email: '1029mukul38@gmail.com',
    password: 'Mukul@jaat1',
    confirmPassword: 'Mukul@jaat1'
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

// In your Signup component
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (formData.name.trim() === "") {
    showWarning("Name Can't Be Blank", "Validation", 3000);
    return;
  }

  if (formData.email.trim() === "") {
    showWarning("Email Can't Be Blank", "Validation", 3000);
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    showWarning("Passwords must match", "Validation", 3000);
    setShowPassword(true);
    setShowConfirmPassword(true);
    return;
  }

  const { confirmPassword, ...data } = formData;

  try {
    const result = await dispatch(registerUser(data));
    
    if (registerUser.fulfilled.match(result)) {
      // Registration successful
      showSuccess("Registration successful!", "Success", 3000);
      navigate("/dashboard");
      // Redirect or do something else
    } else if (registerUser.rejected.match(result)) {
      // Handle specific error codes from backend
      const errorPayload = result.payload;
      
      if (errorPayload?.errorCode === 1) { // Validation error
           const errors = errorPayload?.errors || [];
        if (errors.length > 0) {
          errors.forEach((error: any) => {
            showWarning(error.message || 'Registration failed', 'Error', 5000);
          });
        } else {
          showWarning(result.payload?.message || 'Registration failed', 'Error', 5000);
        }
      }
    else {
        showWarning(errorPayload?.message || "Registration failed", "Error", 6000);
      }
    }
  } catch (error) {
    showWarning("An unexpected error occurred", "Error", 6000);
  }
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
              Join Hack Mate
            </h1>
            <p className="text-muted-foreground">
              Create your account and start building the future
            </p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <Button type="button" variant="ghost" className="w-full h-12 border border-glass-border hover:bg-primary/10">
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>
            <Button type="button" variant="ghost" className="w-full h-12 border border-glass-border hover:bg-primary/10">
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

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1 rounded border-glass-border" />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
