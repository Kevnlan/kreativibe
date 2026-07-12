'use client';

import { useState, useEffect, useCallback } from 'react';
import { FailedPayoutHandler, FailedPayout } from '@/components/payments/FailedPayoutHandler';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withdrawalService } from '@/services/withdrawal.service';
import { WithdrawalRequest, BankDetails, MPESADetails } from '@/types/api-contracts/withdrawal.types';

function isBankDetails(d: BankDetails | MPESADetails): d is BankDetails {
  return (d as BankDetails).bankName !== undefined;
}

function mapWithdrawalToFailedPayout(w: WithdrawalRequest): FailedPayout {
  const accountName = w.accountDetails.accountName;
  const bankName = isBankDetails(w.accountDetails) ? w.accountDetails.bankName : 'M-PESA';
  const accountNumber = isBankDetails(w.accountDetails)
    ? w.accountDetails.accountNumber
    : (w.accountDetails as MPESADetails).phoneNumber;

  return {
    id: w.id,
    creative: {
      id: w.userId,
      name: accountName,
      email: '',
    },
    amount: w.amount,
    currency: w.currency,
    bankDetails: {
      bankName,
      accountNumber,
    },
    failureReason: w.rejectionReason || 'Payout failed',
    failureCode: 'OTHER',
    attemptCount: 1,
    lastAttemptAt: w.processedAt || w.createdAt,
    status: 'failed',
  };
}

export default function FailedPayoutsPage() {
  const router = useRouter();
  const [failedPayouts, setFailedPayouts] = useState<FailedPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFailedPayouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await withdrawalService.getAdminWithdrawals({ status: 'FAILED' });
      setFailedPayouts(response.withdrawals.map(mapWithdrawalToFailedPayout));
    } catch {
      setError('Failed to load failed payouts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFailedPayouts();
  }, [loadFailedPayouts]);

  const handleBack = () => {
    router.push('/dashboard/admin/payouts');
  };

  const handleRetry = async (id: string) => {
    setFailedPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'retrying' as const } : p))
    );
    try {
      await withdrawalService.processWithdrawal(id);
      setFailedPayouts(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to retry payout. Please try again.');
      setFailedPayouts(prev =>
        prev.map(p => (p.id === id ? { ...p, status: 'failed' as const } : p))
      );
    }
  };

  const handleResolve = async (id: string, _resolution: string) => {
    try {
      await withdrawalService.processWithdrawal(id);
      setFailedPayouts(prev =>
        prev.map(p => (p.id === id ? { ...p, status: 'resolved' as const } : p))
      );
      setTimeout(() => {
        setFailedPayouts(prev => prev.filter(p => p.id !== id));
      }, 1000);
    } catch {
      setError('Failed to resolve payout. Please try again.');
    }
  };

  const handleManualTransfer = async (id: string) => {
    try {
      await withdrawalService.processWithdrawal(id);
      setFailedPayouts(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to process manual transfer. Please try again.');
    }
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading failed payouts...
        </div>
      ) : (
        <FailedPayoutHandler
          failedPayouts={failedPayouts}
          onRetry={handleRetry}
          onResolve={handleResolve}
          onManualTransfer={handleManualTransfer}
        />
      )}
    </div>
  );
}
