'use client';

import { useState } from 'react';
import { FailedPayoutHandler, FailedPayout } from '@/components/payments/FailedPayoutHandler';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockFailedPayouts: FailedPayout[] = [
  {
    id: 'f1',
    creative: {
      id: 'c1',
      name: 'James Ochieng',
      email: 'james@example.com',
    },
    amount: 75000,
    currency: 'KES',
    bankDetails: {
      bankName: 'Standard Chartered',
      accountNumber: '5544332211',
    },
    failureReason: 'Insufficient funds in platform account',
    failureCode: 'INSUFFICIENT_FUNDS',
    attemptCount: 3,
    lastAttemptAt: '2024-01-14T16:00:00Z',
    nextRetryAt: '2024-01-15T16:00:00Z',
    status: 'failed',
  },
  {
    id: 'f2',
    creative: {
      id: 'c2',
      name: 'Grace Njoroge',
      email: 'grace@example.com',
    },
    amount: 50000,
    currency: 'KES',
    bankDetails: {
      bankName: 'Absa Bank',
      accountNumber: '9988776655',
    },
    failureReason: 'Invalid bank account details',
    failureCode: 'INVALID_ACCOUNT',
    attemptCount: 1,
    lastAttemptAt: '2024-01-15T10:00:00Z',
    status: 'failed',
  },
];

export default function FailedPayoutsPage() {
  const router = useRouter();
  const [failedPayouts, setFailedPayouts] = useState<FailedPayout[]>(mockFailedPayouts);

  const handleBack = () => {
    router.push('/dashboard/admin/payouts');
  };

  const handleRetry = (id: string) => {
    setFailedPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'retrying' as const } : p))
    );
    console.log('Retrying payout:', id);
    // Simulate retry
    setTimeout(() => {
      setFailedPayouts(prev => prev.filter(p => p.id !== id));
    }, 2000);
  };

  const handleResolve = (id: string, resolution: string) => {
    setFailedPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'resolved' as const } : p))
    );
    console.log('Resolving payout:', id, resolution);
    setTimeout(() => {
      setFailedPayouts(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const handleManualTransfer = (id: string) => {
    console.log('Initiating manual transfer for:', id);
    // In production, would open manual transfer flow
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <h1 className="text-2xl font-bold">Failed Payouts</h1>
              <p className="text-muted-foreground">Manage and resolve failed payout transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <FailedPayoutHandler
        failedPayouts={failedPayouts}
        onRetry={handleRetry}
        onResolve={handleResolve}
        onManualTransfer={handleManualTransfer}
      />
    </div>
  );
}
