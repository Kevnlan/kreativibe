'use client';

import { useState, useEffect } from 'react';
import {
  Wallet as WalletIcon,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  FileText,
  AlertCircle,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { Button, StatCard, DataTable, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { Wallet, Transaction } from '@/types/api-contracts/wallet.types';
import { EarningsSummary } from '@/types/earnings.types';
import { walletService } from '@/services/wallet.service';
import { earningsService } from '@/services/earnings.service';
import { useUser, useCreatorProfile } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function EarningsWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'MPESA' | 'BANK'>('MPESA');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const user = useUser();
  const creatorProfile = useCreatorProfile();
  const router = useRouter();

  const isVerified = creatorProfile?.isVerified || false;

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletResponse, txResponse, summary] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactions({ limit: 10 }),
        earningsService.getSummary(),
      ]);
      setWallet({
        ...walletResponse.wallet,
        balance: Number(walletResponse.wallet.balance) || 0,
        pendingBalance: Number(walletResponse.wallet.pendingBalance) || 0,
        totalEarnings: Number(walletResponse.wallet.totalEarnings) || 0,
        totalWithdrawals: Number(walletResponse.wallet.totalWithdrawals) || 0,
      });
      setTransactions(txResponse.transactions || []);
      setEarnings(summary);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load earnings data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'CREDIT':
      case 'TOPUP':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'DEBIT':
      case 'WITHDRAWAL':
      case 'COMMISSION':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <WalletIcon className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'CREDIT':
      case 'TOPUP':
        return 'text-green-600';
      case 'DEBIT':
      case 'WITHDRAWAL':
      case 'COMMISSION':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  const handleWithdraw = () => {
    setWithdrawError('');

    if (!isVerified) {
      setWithdrawError('You must complete KYC verification before withdrawing funds.');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Please enter a valid amount.');
      return;
    }

    if (wallet && amount > (Number(wallet.balance) || 0)) {
      setWithdrawError('Insufficient balance.');
      return;
    }

    if (withdrawMethod === 'MPESA' && !withdrawPhone) {
      setWithdrawError('Please enter your M-Pesa phone number.');
      return;
    }

    if (withdrawMethod === 'MPESA' && amount >= 150000) {
      setWithdrawError('M-Pesa withdrawals are limited to KES 150,000. Use bank transfer for larger amounts.');
      return;
    }

    // Mock success
    alert(`Withdrawal of ${formatCurrency(amount)} via ${withdrawMethod} submitted successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawPhone('');
  };

  const txColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (value: Transaction['type']) => (
        <div className="flex items-center gap-2">
          {getTransactionIcon(value)}
          <span className="font-medium">{value.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: Transaction) => (
        <span className={`font-mono font-semibold ${getTransactionColor(row.type)}`}>
          {row.type === 'CREDIT' || row.type === 'TOPUP' ? '+' : '-'}
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: Transaction['status']) => (
        <StatusBadge
          variant={value === 'COMPLETED' ? 'success' : value === 'PENDING' ? 'pending' : 'error'}
          size="sm"
        >
          {value}
        </StatusBadge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings & Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Track your income, manage your balance, and request withdrawals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowWithdrawModal(true)}>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Verification Warning */}
      {!isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 text-sm">Verification Required for Withdrawals</h4>
            <p className="text-sm text-yellow-800 mt-1">
              Complete your KYC verification to unlock withdrawals. Verified creators can withdraw their earnings instantly.
            </p>
            <Button
              size="sm"
              className="mt-2 bg-yellow-600 hover:bg-yellow-700"
              onClick={() => router.push('/onboarding/creator')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Complete Verification
            </Button>
          </div>
        </div>
      )}

      {/* Balance + Earnings Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-brand-blue/20 bg-brand-blue/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                  <WalletIcon className="h-4 w-4 text-brand-blue" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {wallet ? formatCurrency(Number(wallet.balance) || 0, wallet.currency) : 'KES 0'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pending: {wallet ? formatCurrency(Number(wallet.pendingBalance) || 0, wallet.currency) : 'KES 0'}
                </p>
              </CardContent>
            </Card>
            <StatCard
              title="Total Earnings"
              value={wallet ? formatCurrency(Number(wallet.totalEarnings) || 0, wallet.currency) : 'KES 0'}
              icon={<TrendingUp className="h-4 w-4" />}
              iconColor="text-green-600"
            />
            <StatCard
              title="This Month"
              value={earnings ? formatCurrency(earnings.thisMonth, earnings.currency) : 'KES 0'}
              icon={<DollarSign className="h-4 w-4" />}
              iconColor="text-green-600"
            />
            <StatCard
              title="Total Sales"
              value={earnings?.totalSales?.toString() || '0'}
              icon={<FileText className="h-4 w-4" />}
              iconColor="text-purple-600"
            />
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Content Sales</p>
                      <p className="text-xs text-muted-foreground">{earnings?.breakdown.contentSales.percent ?? 0}%</p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(earnings?.breakdown.contentSales.amount ?? 0, earnings?.currency)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Custom Requests</p>
                      <p className="text-xs text-muted-foreground">{earnings?.breakdown.customRequests.percent ?? 0}%</p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(earnings?.breakdown.customRequests.amount ?? 0, earnings?.currency)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Bonuses</p>
                      <p className="text-xs text-muted-foreground">{earnings?.breakdown.bonuses.percent ?? 0}%</p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(earnings?.breakdown.bonuses.amount ?? 0, earnings?.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                {earnings?.topPerformingContent && earnings.topPerformingContent.length > 0 ? (
                  <div className="space-y-3">
                    {earnings.topPerformingContent.map((item) => (
                      <div key={item.contentId} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.salesCount} sales</p>
                        </div>
                        <p className="font-semibold text-sm">
                          {formatCurrency(item.revenue, earnings?.currency || 'KES')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No content sales yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={transactions} columns={txColumns} emptyMessage="No transactions yet" />
            </CardContent>
          </Card>
        </>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-1">Withdraw Funds</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Available: {wallet ? formatCurrency(Number(wallet.balance) || 0, wallet.currency) : 'KES 0'}
            </p>

            {!isVerified && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  KYC verification required. Please complete your verification to withdraw.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('MPESA')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      withdrawMethod === 'MPESA'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-border hover:border-green-300'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('BANK')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      withdrawMethod === 'BANK'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-border hover:border-blue-300'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {withdrawMethod === 'MPESA'
                    ? 'M-Pesa: For amounts below KES 150,000'
                    : 'Bank Transfer: For amounts KES 150,000 and above'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount (KES)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-lg font-semibold"
                />
              </div>

              {withdrawMethod === 'MPESA' && (
                <div>
                  <label className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              )}

              {withdrawError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {withdrawError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawError('');
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleWithdraw} disabled={!isVerified}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Withdrawal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
