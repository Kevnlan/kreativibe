'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Camera, Building2, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, CountrySelector } from '@/components/ui';
import { cn } from '@/lib/utils';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['CREATOR', 'BRAND'], { message: 'Please select an account type' }),
  countryId: z.string().min(1, 'Please select your country'),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  {
    value: 'CREATOR' as const,
    icon: <Camera className="h-5 w-5" />,
    label: 'Creator',
    tagline: 'I create content',
    perks: ['Set your own rates', 'Get discovered by brands', 'Verified badge after KYC'],
    accent: 'border-orange-400 bg-orange-50',
    iconBg: 'bg-orange-100 text-orange-600',
    activeBorder: 'border-orange-400',
  },
  {
    value: 'BRAND' as const,
    icon: <Building2 className="h-5 w-5" />,
    label: 'Brand',
    tagline: 'I need content',
    perks: ['Browse verified creators', 'Launch campaigns fast', 'Track performance'],
    accent: 'border-brand-blue bg-blue-50',
    iconBg: 'bg-brand-blue/10 text-brand-blue',
    activeBorder: 'border-brand-blue',
  },
];

const highlights = [
  'Verified creator profiles with real follower data',
  'Secure payments and campaign escrow',
  'Analytics dashboard for every campaign',
];

const avatars = ['SK', 'JM', 'AN', 'TL', 'RB', 'KO'];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await signup(data.email, data.password, data.name, data.role, data.countryId);
      // Redirect to onboarding based on role
      if (data.role === 'CREATOR') {
        router.push('/onboarding/creator');
      } else if (data.role === 'BRAND') {
        router.push('/onboarding/brand');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-light flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-white font-bold text-xl">Kreativibe</span>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Africa's #1 Creator Marketplace
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Your content.<br />Your brand.<br />Connected.
          </h2>
          <p className="text-white/75 text-base mb-8 leading-relaxed">
            Join thousands of creators and brands building authentic campaigns together.
          </p>
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-white/70 flex-shrink-0" />
                <span className="text-white/75 text-sm">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/50 text-xs mb-3">Trusted by 500+ creators</p>
          <div className="flex -space-x-2">
            {avatars.map((init, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold"
              >
                {init[0]}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-[58%] flex items-start justify-center py-10 px-6 sm:px-12 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-brand-blue-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="font-bold text-xl text-foreground">Kreativibe</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-muted-foreground">Join Kreativibe — it's free to get started</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">I am joining as…</p>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('role', opt.value, { shouldValidate: true })}
                    disabled={isLoading}
                    className={cn(
                      'relative rounded-2xl border-2 p-4 text-left transition-all duration-150',
                      isSelected
                        ? `${opt.activeBorder} ${opt.accent}`
                        : 'border-border bg-white hover:bg-muted/40'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', opt.iconBg)}>
                      {opt.icon}
                    </div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">{opt.label}</div>
                    <div className="text-xs text-muted-foreground mb-3">{opt.tagline}</div>
                    <ul className="space-y-1">
                      {opt.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <input {...register('role')} type="radio" value={opt.value} className="sr-only" />
                  </button>
                );
              })}
            </div>
            {errors.role?.message && (
              <p className="text-sm text-red-500 font-medium mt-2">{errors.role.message}</p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              placeholder="Your full name"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name')}
              disabled={isLoading}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Country
              </label>
              <CountrySelector
                value={watch('countryId')}
                onChange={(countryId) => setValue('countryId', countryId)}
                error={errors.countryId?.message}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
                disabled={isLoading}
              />
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="agree-terms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue flex-shrink-0"
                required
              />
              <label htmlFor="agree-terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-blue hover:text-brand-blue-dark font-medium">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-blue hover:text-brand-blue-dark font-medium">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" className="w-full" loading={isLoading} variant="brand" size="lg">
              Create account
            </Button>
          </form>

          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-background text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground pb-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
