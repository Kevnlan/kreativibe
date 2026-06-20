'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const highlights = [
  'Verified creator profiles with real follower data',
  'Secure payments and campaign escrow',
  'Analytics dashboard for every campaign',
];

const avatars = ['SK', 'JM', 'AN', 'TL', 'RB', 'KO'];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-light flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo_blue.png" alt="Kreativibe" width={180} height={54} className="h-12 w-auto" />
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Africa's #1 Creator Marketplace
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Connect. Create.<br />Get Paid.
          </h2>
          <p className="text-white/75 text-base mb-8 leading-relaxed">
            The platform where brands find authentic local creators for campaigns that actually convert.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-6 sm:px-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center mb-8">
            <Image src="/logo.png" alt="Kreativibe" width={160} height={48} className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor="remember-me" className="text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-brand-blue hover:text-brand-blue-dark transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={isLoading} variant="brand" size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-brand-blue hover:underline font-medium">
                Sign up
              </Link>
            </p>
            
            {/* Admin & Support Links */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">Staff Access</p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/admin/login" 
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  Admin Portal →
                </Link>
                <span className="text-xs text-muted-foreground">|</span>
                <Link 
                  href="/support/login" 
                  className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  Support Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
