'use client';

import { useState } from 'react';
import { PayoutApprovalQueue, PayoutRequest } from '@/components/payments/PayoutApprovalQueue';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockPayoutRequests: PayoutRequest[] = [
  {
    id: '1',
    creative: {
      id: 'c1',
      name: 'Sarah Mwangi',
      email: 'sarah@example.com',
      phone: '+254 700 000 001',
    },
    amount: 45000,
    currency: 'KES',
    bankDetails: {
      bankName: 'Equity Bank',
      accountNumber: '0123456789',
      accountName: 'Sarah Mwangi',
    },
    status: 'pending',
    requestedAt: '2024-01-15T10:00:00Z',
    campaign: 'Summer Fashion Campaign',
  },
  {
    id: '2',
    creative: {
      id: 'c2',
      name: 'John Kamau',
      email: 'john@example.com',
      phone: '+254 700 000 002',
    },
    amount: 60000,
    currency: 'KES',
    bankDetails: {
      bankName: 'KCB Bank',
      accountNumber: '9876543210',
      accountName: 'John Kamau',
    },
    status: 'pending',
    requestedAt: '2024-01-14T15:30:00Z',
    campaign: 'Tech Review Campaign',
  },
  {
    id: '3',
    creative: {
      id: 'c3',
      name: 'Mary Wanjiku',
      email: 'mary@example.com',
      phone: '+254 700 000 003',
    },
    amount: 30000,
    currency: 'KES',
    bankDetails: {
      bankName: 'Co-operative Bank',
      accountNumber: '1122334455',
      accountName: 'Mary Wanjiku',
    },
    status: 'approved',
    requestedAt: '2024-01-13T09:00:00Z',
    processedAt: '2024-01-13T14:00:00Z',
    campaign: 'Food Delivery Campaign',
  },
];

export default function PayoutApprovalPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PayoutRequest[]>(mockPayoutRequests);

  const handleBack = () => {
    router.push('/dashboard/admin/payouts');
  };

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'approved' as const, processedAt: new Date().toISOString() } : r))
    );
    console.log('Approving payout:', id);
  };

  const handleReject = (id: string, reason: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'rejected' as const, failureReason: reason } : r))
    );
    console.log('Rejecting payout:', id, reason);
  };

  const handleBulkApprove = (ids: string[]) => {
    setRequests(prev =>
      prev.map(r =>
        ids.includes(r.id) ? { ...r, status: 'approved' as const, processedAt: new Date().toISOString() } : r
      )
    );
    console.log('Bulk approving payouts:', ids);
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

      {/* Content */}
      <PayoutApprovalQueue
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
        onBulkApprove={handleBulkApprove}
      />
    </div>
  );
}
