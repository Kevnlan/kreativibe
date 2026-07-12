'use client';

import { useState, useEffect, useCallback } from 'react';
import { PayoutApprovalQueue, PayoutRequest } from '@/components/payments/PayoutApprovalQueue';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withdrawalService } from '@/services/withdrawal.service';
import { WithdrawalRequest, BankDetails, MPESADetails } from '@/types/api-contracts/withdrawal.types';

function isBankDetails(d: BankDetails | MPESADetails): d is BankDetails {
  return (d as BankDetails).bankName !== undefined;
}

function mapWithdrawalToPayout(w: WithdrawalRequest): PayoutRequest {
  const accountName = isBankDetails(w.accountDetails)
    ? w.accountDetails.accountName
    : w.accountDetails.accountName;
  const bankName = isBankDetails(w.accountDetails) ? w.accountDetails.bankName : 'M-PESA';
  const accountNumber = isBankDetails(w.accountDetails)
    ? w.accountDetails.accountNumber
    : (w.accountDetails as MPESADetails).phoneNumber;

  const statusMap: Record<WithdrawalRequest['status'], PayoutRequest['status']> = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
  };

  return {
    id: w.id,
    creative: {
      id: w.userId,
      name: accountName,
      email: '',
      phone: isBankDetails(w.accountDetails) ? '' : (w.accountDetails as MPESADetails).phoneNumber,
    },
    amount: w.amount,
    currency: w.currency,
    bankDetails: {
      bankName,
      accountNumber,
      accountName,
    },
    status: statusMap[w.status],
    requestedAt: w.createdAt,
    processedAt: w.processedAt,
    failureReason: w.rejectionReason,
  };
}

export default function PayoutApprovalPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await withdrawalService.getAdminWithdrawals({ status: 'PENDING' });
      setRequests(response.withdrawals.map(mapWithdrawalToPayout));
    } catch {
      setError('Failed to load payout requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleBack = () => {
    router.push('/dashboard/admin/payouts');
  };

  const handleApprove = async (id: string) => {
    try {
      await withdrawalService.approveWithdrawal(id, { adminComments: 'Approved for processing' });
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: 'approved' as const, processedAt: new Date().toISOString() } : r)));
    } catch {
      setError('Failed to approve payout. Please try again.');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await withdrawalService.rejectWithdrawal(id, { rejectionReason: reason });
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: 'rejected' as const, failureReason: reason } : r)));
    } catch {
      setError('Failed to reject payout. Please try again.');
    }
  };

  const handleBulkApprove = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map(id => withdrawalService.approveWithdrawal(id, { adminComments: 'Bulk approved' }))
      );
      setRequests(prev =>
        prev.map(r =>
          ids.includes(r.id) ? { ...r, status: 'approved' as const, processedAt: new Date().toISOString() } : r
        )
      );
    } catch {
      setError('Failed to bulk approve some payouts. Please try again.');
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
            <Wallet className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Payout Approval Queue</h1>
              <p className="text-muted-foreground">Review and approve pending payout requests</p>
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
          Loading payout requests...
        </div>
      ) : (
        <PayoutApprovalQueue
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
          onBulkApprove={handleBulkApprove}
        />
      )}
    </div>
  );
}
