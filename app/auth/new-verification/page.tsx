'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';

function NewVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: any) => {
        setError(err.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      });
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue/5 to-brand-blue-light/5 py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-medium text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              {status === 'loading' && (
                <div className="bg-muted w-full h-full rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="bg-success-100 w-full h-full rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success-600" />
                </div>
              )}
              {(status === 'error' || status === 'no-token') && (
                <div className="bg-error-100 w-full h-full rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-error-600" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying your email…'}
              {status === 'success' && 'Email verified!'}
              {status === 'error' && 'Verification failed'}
              {status === 'no-token' && 'Invalid link'}
            </CardTitle>

            <CardDescription>
              {status === 'loading' && 'Please wait while we confirm your email address.'}
              {status === 'success' && 'Your account is now active. You can sign in.'}
              {status === 'error' && (error || 'Something went wrong.')}
              {status === 'no-token' && 'No verification token was found in the link.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'success' && (
              <Link href="/auth/login">
                <Button className="w-full" variant="brand">Go to login</Button>
              </Link>
            )}

            {(status === 'error' || status === 'no-token') && (
              <>
                {email && !resendSuccess && (
                  <Button
                    className="w-full"
                    variant="brand"
                    onClick={handleResend}
                    loading={isResending}
                    disabled={isResending}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Resend verification email
                  </Button>
                )}
                {resendSuccess && (
                  <p className="text-sm text-success-600 font-medium">
                    Verification email sent! Check your inbox.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Link href="/auth/login">
                  <Button className="w-full" variant="outline">Back to login</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
      </div>
    }>
      <NewVerificationContent />
    </Suspense>
  );
}
