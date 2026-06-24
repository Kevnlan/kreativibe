'use client';

import { useState, useEffect } from 'react';
import { PayoutStatusTracker, PayoutStatusEvent } from '@/components/payments/PayoutStatusTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Download, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withdrawalService } from '@/services/withdrawal.service';

// The withdrawals backend returns the raw store record shape, which differs from the
// declared WithdrawalRequest contract type (e.g. `requestedAt` not `createdAt`, no
// `currency`/`netAmount` fields). Model the page against what the API actually returns.
interface WithdrawalRecord {
  id: string;
  creatorUserId: string;
  amount: number;
  fee: number;
  method: 'MPESA' | 'BANK';
  accountDetails: Record<string, string>;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'FAILED' | 'CANCELLED';
  adminComments?: string;
  rejectionReason?: string;
  requestedAt: string;
  approvedAt?: string;
  processingAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
}

interface TimelineEntry {
  status: string;
  label: string;
  timestamp: string;
}

const CURRENCY = 'KES';

const TIMELINE_STATUS_TO_EVENT_TYPE: Record<string, PayoutStatusEvent['type']> = {
  PENDING: 'requested',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'failed',
  CANCELLED: 'failed',
};

function toPayoutStatusEvents(timeline: TimelineEntry[]): PayoutStatusEvent[] {
  return timeline.map((entry, i) => ({
    id: `${entry.status}-${i}`,
    timestamp: entry.timestamp,
    type: TIMELINE_STATUS_TO_EVENT_TYPE[entry.status] ?? 'processing',
    status: 'completed',
    message: entry.label,
    currency: CURRENCY,
  }));
}

function toTrackerStatus(status: WithdrawalRecord['status']): string {
  switch (status) {
    case 'PENDING':
      return 'requested';
    case 'APPROVED':
      return 'approved';
    case 'PROCESSING':
      return 'processing';
    case 'COMPLETED':
      return 'completed';
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
      return 'failed';
    default:
      return 'requested';
  }
}

export default function PayoutHistoryPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<(WithdrawalRecord & { timeline?: TimelineEntry[] }) | null>(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withdrawalService
      .getWithdrawals()
      .then((res: any) => {
        const list: WithdrawalRecord[] = res.withdrawals ?? [];
        setWithdrawals(list);
        if (list.length > 0) {
          setSelectedPayout(list[0].id);
        }
      })
      .catch(() => setError('Failed to load payout history. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPayout) {
      setSelectedDetail(null);
      return;
    }
    setIsDetailLoading(true);
    withdrawalService
      .getWithdrawalById(selectedPayout)
      .then((data: any) => setSelectedDetail(data))
      .catch(() => setError('Failed to load payout details. Please try again.'))
      .finally(() => setIsDetailLoading(false));
  }, [selectedPayout]);

  const handleBack = () => {
    router.push('/dashboard/creative/wallet');
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt');
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
              <h1 className="text-2xl font-bold">Payout History</h1>
              <p className="text-muted-foreground">View your payout history and status</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading payout history...
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No payouts yet. Withdrawals you request will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="365">Last Year</option>
              </select>
            </div>

            <div className="space-y-2">
              {withdrawals.map((payout) => (
                <button
                  key={payout.id}
                  onClick={() => setSelectedPayout(payout.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedPayout === payout.id
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-border hover:border-brand-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {CURRENCY} {payout.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{payout.status.toLowerCase()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Status Tracker */}
          <div className="lg:col-span-2">
            {isDetailLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading details...
              </div>
            ) : selectedDetail ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Payout Details</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadReceipt}
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download Receipt
                  </Button>
                </div>

                <PayoutStatusTracker
                  events={toPayoutStatusEvents(selectedDetail.timeline ?? [])}
                  currentStatus={toTrackerStatus(selectedDetail.status)}
                  amount={selectedDetail.amount}
                  currency={CURRENCY}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
