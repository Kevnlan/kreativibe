'use client';

import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Download, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button, StatCard, DataTable, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { Wallet, Transaction } from '@/types/api-contracts/wallet.types';
import { walletService } from '@/services/wallet.service';
import { useUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletResponse, txResponse] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactions({ limit: 10 }),
      ]);
      setWallet({
        ...walletResponse.wallet,
        balance: Number(walletResponse.wallet.balance) || 0,
        pendingBalance: Number(walletResponse.wallet.pendingBalance) || 0,
        totalEarnings: Number(walletResponse.wallet.totalEarnings) || 0,
        totalWithdrawals: Number(walletResponse.wallet.totalWithdrawals) || 0,
      });
      setTransactions(txResponse.transactions || []);
    } catch {
      setError('Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
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

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (value: Transaction['type'], row: Transaction) => (
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
        <StatusBadge variant={value === 'COMPLETED' ? 'success' : value === 'PENDING' ? 'pending' : 'error'} size="sm">
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
            year: 'numeric'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your balance and transactions
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/creative/withdrawals/new')}>
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Request Withdrawal
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <StatCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      ) : wallet ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Available Balance"
              value={formatCurrency(Number(wallet.balance) || 0, wallet.currency)}
              icon={<WalletIcon className="h-4 w-4" />}
              iconColor="text-brand-blue"
            />
            <StatCard
              title="Pending Balance"
              value={formatCurrency(Number(wallet.pendingBalance) || 0, wallet.currency)}
              icon={<TrendingUp className="h-4 w-4" />}
              iconColor="text-orange-600"
            />
            <StatCard
              title="Total Earnings"
              value={formatCurrency(Number(wallet.totalEarnings) || 0, wallet.currency)}
              icon={<TrendingUp className="h-4 w-4" />}
              iconColor="text-green-600"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/dashboard/creative/wallet/transactions')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={transactions}
                columns={columns}
                emptyMessage="No transactions yet"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <WalletIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">About Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Your wallet balance is updated automatically when you receive payments from brands. 
                    Pending balance represents funds that are being processed. You can request withdrawals 
                    once funds are available in your balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
