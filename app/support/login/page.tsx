'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SupportLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard/support-agent');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
            <Headphones className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Support Portal</h1>
          <p className="text-green-200">Sign in to access support tickets</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="support@kreativibe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              loading={isLoading}
            >
              Sign In as Support Agent
            </Button>
          </form>

          {/* Quick Login Hint */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-green-800">
              <strong>Email:</strong> support@kreativibe.com<br />
              <strong>Password:</strong> Support123!
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-green-200">
            Not a support agent?{' '}
            <Link href="/auth/login" className="text-blue-300 hover:text-blue-200 font-medium">
              Sign in as Brand/Creator
            </Link>
          </p>
          <p className="text-sm text-green-200">
            Admin?{' '}
            <Link href="/admin/login" className="text-red-300 hover:text-red-200 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-green-300">
            <Headphones className="h-3 w-3 inline mr-1" />
            Helping brands and creators succeed
          </p>
        </div>
      </div>
    </div>
  );
}
