'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Input, DataTable, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { adminService, AdminCreator } from '@/services/admin.service';
import { useRouter } from 'next/navigation';

const KYC_STATUS_VARIANT: Record<string, any> = {
  VERIFIED: 'success',
  SUBMITTED: 'pending',
  PENDING: 'warning',
  REJECTED: 'error',
};

const API_STATUS_VARIANT: Record<string, any> = {
  VERIFIED: 'success',
  PENDING: 'pending',
  FAILED: 'error',
};

const mockCreators: AdminCreator[] = [
  { id: '1', name: 'Sarah Kimani', email: 'sarah@example.com', isActive: true, joinedAt: '2026-01-15T10:00:00Z', kyc: { status: 'VERIFIED', iprsStatus: 'VERIFIED', kraStatus: 'VERIFIED', nationalId: '12345678', kraPin: 'A123456789X', phone: '0712345678', city: 'Nairobi', submittedAt: '2026-01-20T10:00:00Z' } },
  { id: '2', name: 'Michael Kamau', email: 'michael@example.com', isActive: true, joinedAt: '2026-01-20T10:00:00Z', kyc: { status: 'SUBMITTED', iprsStatus: 'PENDING', kraStatus: 'PENDING', nationalId: '87654321', kraPin: 'B987654321Y', phone: '0723456789', city: 'Mombasa', submittedAt: '2026-02-01T10:00:00Z' } },
  { id: '3', name: 'Grace Wanjiru', email: 'grace@example.com', isActive: false, joinedAt: '2026-02-10T10:00:00Z', kyc: { status: 'REJECTED', iprsStatus: 'FAILED', kraStatus: 'VERIFIED', nationalId: '11223344', kraPin: 'C112233445Z', phone: '0734567890', city: 'Kisumu', submittedAt: '2026-02-15T10:00:00Z', adminComments: 'ID document unclear' } },
  { id: '4', name: 'James Mutua', email: 'james@example.com', isActive: true, joinedAt: '2026-02-20T10:00:00Z', kyc: { status: 'PENDING' } },
  { id: '5', name: 'Aisha Ndungu', email: 'aisha@example.com', isActive: true, joinedAt: '2026-03-05T10:00:00Z', kyc: { status: 'VERIFIED', iprsStatus: 'VERIFIED', kraStatus: 'VERIFIED', nationalId: '55667788', kraPin: 'D556677889W', phone: '0745678901', city: 'Nairobi', submittedAt: '2026-03-10T10:00:00Z' } },
];

export default function AdminCreatorsPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<AdminCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState<string>('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCreators({ limit: 50 });
      setCreators(response.data || []);
    } catch {
      setCreators(mockCreators);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId: string) => {
    setTogglingId(userId);
    try {
      await adminService.toggleUser(userId);
      setCreators(prev => prev.map(c => c.id === userId ? { ...c, isActive: !c.isActive } : c));
    } catch {
      setCreators(prev => prev.map(c => c.id === userId ? { ...c, isActive: !c.isActive } : c));
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = creators.filter(c => {
    const matchesSearch = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKyc = kycFilter === 'ALL' || c.kyc.status === kycFilter;
    return matchesSearch && matchesKyc;
  });

  const stats = {
    total: creators.length,
    verified: creators.filter(c => c.kyc.status === 'VERIFIED').length,
    pending: creators.filter(c => c.kyc.status === 'SUBMITTED' || c.kyc.status === 'PENDING').length,
    active: creators.filter(c => c.isActive).length,
  };

  const columns = [
    {
      key: 'name',
      label: 'Creator',
      sortable: true,
      render: (value: string, row: AdminCreator) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'kyc',
      label: 'KYC Status',
      render: (_: any, row: AdminCreator) => (
        <StatusBadge variant={KYC_STATUS_VARIANT[row.kyc.status] || 'default'} size="sm">
          {row.kyc.status}
        </StatusBadge>
      ),
    },
    {
      key: 'kyc',
      label: 'IPRS',
      render: (_: any, row: AdminCreator) => (
        row.kyc.iprsStatus ? (
          <StatusBadge variant={API_STATUS_VARIANT[row.kyc.iprsStatus] || 'default'} size="sm">
            {row.kyc.iprsStatus}
          </StatusBadge>
        ) : <span className="text-xs text-muted-foreground">—</span>
      ),
    },
    {
      key: 'kyc',
      label: 'KRA',
      render: (_: any, row: AdminCreator) => (
        row.kyc.kraStatus ? (
          <StatusBadge variant={API_STATUS_VARIANT[row.kyc.kraStatus] || 'default'} size="sm">
            {row.kyc.kraStatus}
          </StatusBadge>
        ) : <span className="text-xs text-muted-foreground">—</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Account',
      render: (value: boolean) => (
        <StatusBadge variant={value ? 'success' : 'error'} size="sm">
          {value ? 'Active' : 'Deactivated'}
        </StatusBadge>
      ),
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: AdminCreator) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/admin/creators/${row.id}`)}
          >
            Review
          </Button>
          <Button
            variant={row.isActive ? 'destructive' : 'outline'}
            size="sm"
            disabled={togglingId === row.id}
            onClick={() => handleToggleUser(row.id)}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Creator Management</h1>
          <p className="text-muted-foreground mt-1">Review KYC submissions and manage creator accounts</p>
        </div>
        <Button variant="outline" onClick={loadCreators}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Creators" value={stats.total.toString()} icon={<UserCheck className="h-4 w-4" />} iconColor="text-blue-600" />
        <StatCard title="Verified" value={stats.verified.toString()} icon={<CheckCircle className="h-4 w-4" />} iconColor="text-green-600" />
        <StatCard title="Pending KYC" value={stats.pending.toString()} icon={<Clock className="h-4 w-4" />} iconColor="text-orange-600" />
        <StatCard title="Active" value={stats.active.toString()} icon={<UserCheck className="h-4 w-4" />} iconColor="text-purple-600" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="ALL">All KYC Status</option>
              <option value="PENDING">Not Submitted</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filtered}
            columns={columns}
            loading={loading}
            searchable={false}
            emptyMessage="No creators found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
