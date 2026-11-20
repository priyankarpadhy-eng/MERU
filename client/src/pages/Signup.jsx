import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { signupSchema } from '../lib/validators';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const passwordValue = watch('password', '');

  // Calculate 3-segment minimal strength meter
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Za-z]/.test(pass) && /\d/.test(pass)) score++;
    if (pass.length >= 12 || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      setFormError(null);
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err.status === 409 || err.code === 'CONFLICT') {
        setError('email', {
          type: 'manual',
          message: 'An account with this email already exists',
        });
      } else if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          setError(e.field, { type: 'server', message: e.message });
        });
      } else {
        setFormError(err.message || 'Failed to create account');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-[40%] bg-accent text-white flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Subtle geometric line pattern in SVG */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-signup" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-signup)" />
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
            Start tracking high-value leads with zero friction.
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Fast setup, full tenant isolation, and structured attribution for your entire sales lifecycle.
          </p>
        </div>

        {/* Footer meta */}
        <div className="relative z-10 text-xs text-white/60 font-mono">
          Lead Management Platform &middot; v1.0
        </div>
      </div>

      {/* Right panel - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
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
              Create an account
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Enter your details to configure your sales workspace.
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
              label="Full name"
              autoComplete="name"
              placeholder="Alex Vance"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="alex@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters with numbers"
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

              {/* Minimal 3-segment strength meter */}
              {passwordValue && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      strength >= 1
                        ? strength === 1
                          ? 'bg-[#DC2626]'
                          : strength === 2
                          ? 'bg-[#D97706]'
                          : 'bg-[#16A34A]'
                        : 'bg-border'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      strength >= 2
                        ? strength === 2
                          ? 'bg-[#D97706]'
                          : 'bg-[#16A34A]'
                        : 'bg-border'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      strength >= 3 ? 'bg-[#16A34A]' : 'bg-border'
                    }`}
                  />
                </div>
              )}
            </div>

            <Input
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter password"
              error={errors.confirmPassword?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-text-tertiary hover:text-text-primary transition-colors focus-visible:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11"
              isLoading={isSubmitting}
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-text-secondary mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline focus-visible:outline-none"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
