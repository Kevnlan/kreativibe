'use client';

import { useState } from 'react';
import { PayoutStatusTracker, PayoutStatusEvent } from '@/components/payments/PayoutStatusTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Download, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockPayoutEvents: PayoutStatusEvent[] = [
  {
    id: 'e1',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'requested',
    status: 'completed',
    actor: 'You',
    message: 'Payout requested',
    details: 'Requested payout for Summer Fashion Campaign',
    amount: 45000,
    currency: 'KES',
  },
  {
    id: 'e2',
    timestamp: '2024-01-15T14:00:00Z',
    type: 'approved',
    status: 'completed',
    actor: 'Admin',
    message: 'Payout approved',
    details: 'Approved by platform administrator',
    amount: 45000,
    currency: 'KES',
  },
  {
    id: 'e3',
    timestamp: '2024-01-15T14:30:00Z',
    type: 'processing',
    status: 'completed',
    actor: 'System',
    message: 'Processing initiated',
    details: 'Bank transfer initiated',
    amount: 45000,
    currency: 'KES',
  },
  {
    id: 'e4',
    timestamp: '2024-01-16T09:00:00Z',
    type: 'completed',
    status: 'completed',
    actor: 'System',
    message: 'Payout completed',
    details: 'Funds successfully transferred to your account',
    amount: 45000,
    currency: 'KES',
  },
];

export default function PayoutHistoryPage() {
  const router = useRouter();
  const [selectedPayout, setSelectedPayout] = useState<string | null>('p1');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const handleBack = () => {
    router.push('/dashboard/creative/wallet');
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt');
  };

  const mockPayouts = [
    { id: 'p1', amount: 45000, currency: 'KES', date: '2024-01-16', status: 'completed', campaign: 'Summer Fashion' },
    { id: 'p2', amount: 60000, currency: 'KES', date: '2024-01-10', status: 'completed', campaign: 'Tech Review' },
    { id: 'p3', amount: 30000, currency: 'KES', date: '2024-01-05', status: 'completed', campaign: 'Food Delivery' },
  ];

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
            {mockPayouts.map((payout) => (
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
                    {payout.currency} {payout.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{payout.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{payout.campaign}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="lg:col-span-2">
          {selectedPayout && (
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
                events={mockPayoutEvents}
                currentStatus="completed"
                amount={45000}
                currency="KES"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
