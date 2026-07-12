'use client';

import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Building2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, DataTable, StatCard, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/wallet.service';
import { Wallet as WalletType, Transaction as ApiTransaction } from '@/types/api-contracts/wallet.types';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  amount: number;
  balance: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  reference?: string;
}

function mapTransaction(t: ApiTransaction): Transaction {
  const isCredit = t.type === 'CREDIT' || t.type === 'TOPUP' || t.type === 'REFUND';
  return {
    id: t.id,
    type: isCredit ? 'CREDIT' : 'DEBIT',
    description: t.description,
    amount: t.amount,
    balance: 0,
    status: t.status === 'CANCELLED' ? 'FAILED' : t.status,
    createdAt: t.createdAt,
    reference: t.reference,
  };
}

export default function BrandWalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('KES');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const { wallet, recentTransactions } = await walletService.getWalletBalance();
      setBalance(Number(wallet.balance) || 0);
      setCurrency(wallet.currency);
      const txResponse = await walletService.getTransactions({ limit: 50 });
      const allTx = [...recentTransactions, ...txResponse.transactions];
      const seen = new Set<string>();
      const deduped = allTx.filter(t => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
      setTransactions(deduped.map(mapTransaction));
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'pending';
      case 'FAILED':
        return 'error';
    }
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: Transaction['type']) => (
        <div className="flex items-center gap-2">
          {value === 'CREDIT' ? (
            <ArrowDownRight className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          )}
          <span className={value === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (value?: string) => (
        <span className="text-xs font-mono text-muted-foreground">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number, row: Transaction) => (
        <span className={`font-semibold ${row.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
          {row.type === 'CREDIT' ? '+' : '-'}{formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: Transaction['status']) => (
        <StatusBadge variant={getStatusVariant(value)} size="sm">
          {value}
        </StatusBadge>
      ),
    },
  ];

  const stats = {
    totalCredits: transactions
      .filter(t => t.type === 'CREDIT' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
    totalDebits: transactions
      .filter(t => t.type === 'DEBIT' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'PENDING').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your wallet balance and transactions
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/brand/wallet/topup')}>
          <Plus className="h-4 w-4 mr-2" />
          Top Up Wallet
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-blue to-indigo-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
            </div>
            <div className="p-4 bg-white/10 rounded-full">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push('/dashboard/brand/wallet/topup')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push('/marketplace')}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Browse Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Funded"
          value={formatCurrency(stats.totalCredits)}
          icon={<ArrowDownRight className="h-4 w-4" />}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(stats.totalDebits)}
          icon={<ArrowUpRight className="h-4 w-4" />}
          iconColor="text-red-600"
        />
        <StatCard
          title="Pending Transactions"
          value={stats.pendingTransactions.toString()}
          icon={<DollarSign className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={transactions}
            columns={columns}
            loading={loading}
            searchable={false}
            emptyMessage="No transactions yet"
          />
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">M-PESA</h3>
                  <p className="text-xs text-muted-foreground">Instant top-up</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Top up instantly using M-PESA Paybill
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-xs text-muted-foreground">1-2 business days</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Transfer funds directly from your bank account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
