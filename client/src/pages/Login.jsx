import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, ArrowRight } from 'lucide-react';
import { loginSchema } from '../lib/validators';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setFormError(null);
      await login(data);
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid email or password');
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@leadmanager.com');
    setValue('password', 'Password123');
    setFormError(null);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - Deep Teal Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-[40%] bg-accent text-white flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Subtle geometric line pattern in SVG */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-[8px] bg-white text-accent flex items-center justify-center font-bold text-lg shadow-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            Lead Manager
          </span>
        </div>

        {/* Editorial Brand Statement */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-semibold leading-snug tracking-tight mb-3">
            Calm, precise lead management for high-velocity sales.
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Zero noise, crisp status attribution, and seamless team lead workflows.
          </p>
        </div>

        {/* Footer meta */}
        <div className="relative z-10 text-xs text-white/60 font-mono">
          Lead Management Platform &middot; v1.0
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo view */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-[8px] bg-accent text-white flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Lead Manager
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
              Sign in
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Enter your credentials to access your leads.
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded-[8px] bg-[#FCE6E3] dark:bg-[#3D1B18] text-[#DC2626] text-xs flex items-center gap-2 border border-[#FECACA] dark:border-[#7F1D1D]">
              <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-tertiary hover:text-text-primary transition-colors focus-visible:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </button>
              }
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11"
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          {/* Demo quick fill button */}
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 text-xs font-mono text-accent hover:bg-accent-soft rounded-[6px] border border-accent/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Use demo account (demo@leadmanager.com)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-center text-xs text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-accent font-medium hover:underline focus-visible:outline-none"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
