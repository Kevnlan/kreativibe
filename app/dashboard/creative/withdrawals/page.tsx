'use client';

import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, EmptyState } from '@/components/ui';
import { WithdrawalRequest } from '@/types/api-contracts/withdrawal.types';
import { withdrawalService } from '@/services/withdrawal.service';
import { mockStore } from '@/lib/mock-data/mock-store';
import { useUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadWithdrawals();
    }
  }, [user]);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await withdrawalService.getWithdrawals();
      setWithdrawals((response as any).withdrawals || (response as any).data || []);
    } catch {
      const data = mockStore.getWithdrawals(user!.id);
      setWithdrawals(data);
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

  const getStatusVariant = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'PROCESSING':
        return 'processing';
      case 'APPROVED':
        return 'approved';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Request ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value.slice(0, 8)}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number, row: WithdrawalRequest) => (
        <div>
          <div className="font-semibold">{formatCurrency(value, row.currency)}</div>
          <div className="text-xs text-muted-foreground">
            Fee: {formatCurrency(row.fee, row.currency)}
          </div>
        </div>
      ),
    },
    {
      key: 'netAmount',
      label: 'You Receive',
      sortable: true,
      render: (value: number, row: WithdrawalRequest) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: 'method',
      label: 'Method',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: WithdrawalRequest['status']) => (
        <StatusBadge variant={getStatusVariant(value)} size="sm">
          {value}
        </StatusBadge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: WithdrawalRequest) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/creative/withdrawals/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const stats = {
    pending: withdrawals.filter(w => w.status === 'PENDING').length,
    processing: withdrawals.filter(w => w.status === 'PROCESSING' || w.status === 'APPROVED').length,
    completed: withdrawals.filter(w => w.status === 'COMPLETED').length,
    rejected: withdrawals.filter(w => w.status === 'REJECTED' || w.status === 'FAILED').length,
  };

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
          <h1 className="text-3xl font-bold text-foreground">Withdrawals</h1>
          <p className="text-muted-foreground mt-2">
            Request and track your withdrawal requests
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/creative/withdrawals/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Withdrawal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={stats.pending.toString()}
          icon={<Clock className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Processing"
          value={stats.processing.toString()}
          icon={<AlertCircle className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          iconColor="text-green-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected.toString()}
          icon={<XCircle className="h-4 w-4" />}
          iconColor="text-red-600"
        />
      </div>

      {loading ? (
        <DataTable data={[]} columns={columns} loading={true} />
      ) : withdrawals.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-12 w-12" />}
          title="No withdrawal requests yet"
          description="Request your first withdrawal to transfer funds from your wallet"
          action={{
            label: 'Request Withdrawal',
            onClick: () => router.push('/dashboard/creative/withdrawals/new'),
          }}
        />
      ) : (
        <DataTable
          data={withdrawals}
          columns={columns}
          searchable
          searchPlaceholder="Search withdrawals..."
        />
      )}
    </div>
  );
}
