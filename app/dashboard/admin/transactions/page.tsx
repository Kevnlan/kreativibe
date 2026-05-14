'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Download } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { adminService } from '@/services/admin.service';

interface AdminTransaction {
  id: string;
  type: 'PURCHASE' | 'WITHDRAWAL' | 'TOPUP' | 'COMMISSION' | 'REFUND';
  description: string;
  amount: number;
  fee: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  fromUser?: string;
  toUser?: string;
  createdAt: string;
}

const TYPE_ICONS: Record<string, any> = {
  PURCHASE: <ArrowUpRight className="h-4 w-4 text-blue-600" />,
  WITHDRAWAL: <ArrowUpRight className="h-4 w-4 text-red-600" />,
  TOPUP: <ArrowDownRight className="h-4 w-4 text-green-600" />,
  COMMISSION: <DollarSign className="h-4 w-4 text-orange-600" />,
  REFUND: <ArrowDownRight className="h-4 w-4 text-purple-600" />,
};

const TYPE_COLORS: Record<string, string> = {
  PURCHASE: 'bg-blue-100 text-blue-700',
  WITHDRAWAL: 'bg-red-100 text-red-700',
  TOPUP: 'bg-green-100 text-green-700',
  COMMISSION: 'bg-orange-100 text-orange-700',
  REFUND: 'bg-purple-100 text-purple-700',
};

const mockTransactions: AdminTransaction[] = [
  { id: 'txn-001', type: 'TOPUP', description: 'Wallet top-up via M-PESA', amount: 50000, fee: 0, currency: 'KES', status: 'COMPLETED', fromUser: 'TechBrand KE', createdAt: '2026-03-22T10:00:00Z' },
  { id: 'txn-002', type: 'PURCHASE', description: 'Content purchase - Fashion Lookbook', amount: 5000, fee: 500, currency: 'KES', status: 'COMPLETED', fromUser: 'TechBrand KE', toUser: 'Sarah Kimani', createdAt: '2026-03-22T11:00:00Z' },
  { id: 'txn-003', type: 'COMMISSION', description: 'Platform commission (10%)', amount: 500, fee: 0, currency: 'KES', status: 'COMPLETED', fromUser: 'Platform', createdAt: '2026-03-22T11:01:00Z' },
  { id: 'txn-004', type: 'WITHDRAWAL', description: 'Creator withdrawal via M-PESA', amount: 15000, fee: 150, currency: 'KES', status: 'PENDING', fromUser: 'Sarah Kimani', createdAt: '2026-03-22T12:00:00Z' },
  { id: 'txn-005', type: 'TOPUP', description: 'Wallet top-up via Bank Transfer', amount: 100000, fee: 0, currency: 'KES', status: 'PENDING', fromUser: 'FashionHouse', createdAt: '2026-03-21T09:00:00Z' },
  { id: 'txn-006', type: 'PURCHASE', description: 'Content purchase - Travel Vlog', amount: 18000, fee: 1800, currency: 'KES', status: 'COMPLETED', fromUser: 'FitLife Kenya', toUser: 'James Mutua', createdAt: '2026-03-21T14:00:00Z' },
  { id: 'txn-007', type: 'REFUND', description: 'Refund - content dispute', amount: 5000, fee: 0, currency: 'KES', status: 'COMPLETED', fromUser: 'Platform', toUser: 'TechBrand KE', createdAt: '2026-03-20T16:00:00Z' },
];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await adminService.getTransactions({ limit: 100 });
      setTransactions(response.data || []);
    } catch {
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const filtered = transactions.filter(t => {
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const stats = {
    totalVolume: transactions.filter(t => t.status === 'COMPLETED').reduce((s, t) => s + t.amount, 0),
    totalCommission: transactions.filter(t => t.type === 'COMMISSION' && t.status === 'COMPLETED').reduce((s, t) => s + t.amount, 0),
    pending: transactions.filter(t => t.status === 'PENDING').length,
    completed: transactions.filter(t => t.status === 'COMPLETED').length,
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 10)}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (v: string) => (
        <div className="flex items-center gap-2">
          {TYPE_ICONS[v]}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[v] || ''}`}>{v}</span>
        </div>
      ),
    },
    { key: 'description', label: 'Description', render: (v: string) => <span className="text-sm">{v}</span> },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (v: number, row: AdminTransaction) => (
        <span className="font-semibold">{formatCurrency(v, row.currency)}</span>
      ),
    },
    {
      key: 'fee',
      label: 'Fee',
      render: (v: number, row: AdminTransaction) => (
        <span className="text-sm text-muted-foreground">{v > 0 ? formatCurrency(v, row.currency) : '—'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v: string) => (
        <StatusBadge variant={v === 'COMPLETED' ? 'success' : v === 'PENDING' ? 'pending' : 'error'} size="sm">{v}</StatusBadge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (v: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(v).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Monitor platform transactions, payouts, and financial flows</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={loadTransactions}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Volume" value={formatCurrency(stats.totalVolume)} icon={<TrendingUp className="h-4 w-4" />} iconColor="text-blue-600" />
        <StatCard title="Commission Earned" value={formatCurrency(stats.totalCommission)} icon={<DollarSign className="h-4 w-4" />} iconColor="text-green-600" />
        <StatCard title="Completed" value={stats.completed.toString()} icon={<ArrowUpRight className="h-4 w-4" />} iconColor="text-purple-600" />
        <StatCard title="Pending" value={stats.pending.toString()} icon={<ArrowDownRight className="h-4 w-4" />} iconColor="text-orange-600" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="PURCHASE">Purchases</option>
              <option value="WITHDRAWAL">Withdrawals</option>
              <option value="TOPUP">Top-ups</option>
              <option value="COMMISSION">Commission</option>
              <option value="REFUND">Refunds</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filtered}
            columns={columns}
            loading={loading}
            searchable={false}
            emptyMessage="No transactions found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
