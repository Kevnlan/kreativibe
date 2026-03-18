'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Key, Lock } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';

export default function TwoFactorDisablePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Mock API call - replace with actual disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard/settings/security?2fa=disabled');
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Settings
        </Button>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Disable Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            This will make your account less secure. Are you sure you want to continue?
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleDisable} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  leftIcon={<Key className="h-4 w-4" />}
                  maxLength={6}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Disabling two-factor authentication will make your account more vulnerable to unauthorized access.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !password || verificationCode.length !== 6}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? 'Disabling...' : 'Disable 2FA'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
