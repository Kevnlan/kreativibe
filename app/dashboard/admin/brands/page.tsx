'use client';

import { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button, Input, DataTable, StatCard, StatusBadge, Card, CardContent, CardHeader } from '@/components/ui';
import { adminService, AdminBrand } from '@/services/admin.service';
import { useRouter } from 'next/navigation';

const STATUS_VARIANT: Record<string, any> = {
  VERIFIED: 'success',
  PENDING: 'pending',
  REJECTED: 'error',
};

const mockBrands: AdminBrand[] = [
  { id: '1', name: 'TechBrand KE', email: 'info@techbrand.ke', companyName: 'TechBrand Kenya Ltd', industry: 'Technology', isActive: true, joinedAt: '2026-01-10T10:00:00Z', verificationStatus: 'VERIFIED' },
  { id: '2', name: 'FashionHouse', email: 'contact@fashionhouse.com', companyName: 'Fashion House Limited', industry: 'Fashion & Apparel', isActive: true, joinedAt: '2026-01-25T10:00:00Z', verificationStatus: 'PENDING' },
  { id: '3', name: 'FitLife Kenya', email: 'hello@fitlife.ke', companyName: 'FitLife Kenya', industry: 'Healthcare', isActive: true, joinedAt: '2026-02-05T10:00:00Z', verificationStatus: 'VERIFIED' },
  { id: '4', name: 'Safari Bites', email: 'info@safaribites.com', companyName: 'Safari Bites Ltd', industry: 'Food & Beverage', isActive: false, joinedAt: '2026-02-15T10:00:00Z', verificationStatus: 'REJECTED' },
  { id: '5', name: 'GlowUp Beauty', email: 'team@glowup.co.ke', companyName: 'GlowUp Beauty', industry: 'Beauty & Cosmetics', isActive: true, joinedAt: '2026-03-01T10:00:00Z', verificationStatus: 'PENDING' },
];

export default function AdminBrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => { loadBrands(); }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const response = await adminService.getBrands({ limit: 50 });
      setBrands(response.data || []);
    } catch {
      setBrands(mockBrands);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await adminService.toggleUser(id);
    } catch {}
    setBrands(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    setTogglingId(null);
  };

  const filtered = brands.filter(b => {
    const matchesSearch = !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: brands.length,
    verified: brands.filter(b => b.verificationStatus === 'VERIFIED').length,
    pending: brands.filter(b => b.verificationStatus === 'PENDING').length,
    active: brands.filter(b => b.isActive).length,
  };

  const columns = [
    {
      key: 'companyName',
      label: 'Brand',
      sortable: true,
      render: (value: string, row: AdminBrand) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: 'industry', label: 'Industry', render: (v: string) => <span className="text-sm">{v || '—'}</span> },
    {
      key: 'verificationStatus',
      label: 'Verification',
      render: (v: string) => (
        <StatusBadge variant={STATUS_VARIANT[v] || 'default'} size="sm">{v}</StatusBadge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (v: boolean) => (
        <StatusBadge variant={v ? 'success' : 'error'} size="sm">{v ? 'Active' : 'Deactivated'}</StatusBadge>
      ),
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      sortable: true,
      render: (v: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(v).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: AdminBrand) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/admin/brands/${row.id}`)}>
            View
          </Button>
          <Button
            variant={row.isActive ? 'destructive' : 'outline'}
            size="sm"
            disabled={togglingId === row.id}
            onClick={() => handleToggle(row.id)}
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
          <h1 className="text-3xl font-bold text-foreground">Brand Management</h1>
          <p className="text-muted-foreground mt-1">Review brand applications and manage verified accounts</p>
        </div>
        <Button variant="outline" onClick={loadBrands}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Brands" value={stats.total.toString()} icon={<Building2 className="h-4 w-4" />} iconColor="text-blue-600" />
        <StatCard title="Verified" value={stats.verified.toString()} icon={<CheckCircle className="h-4 w-4" />} iconColor="text-green-600" />
        <StatCard title="Pending" value={stats.pending.toString()} icon={<Clock className="h-4 w-4" />} iconColor="text-orange-600" />
        <StatCard title="Active" value={stats.active.toString()} icon={<Building2 className="h-4 w-4" />} iconColor="text-purple-600" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
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
            emptyMessage="No brands found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
