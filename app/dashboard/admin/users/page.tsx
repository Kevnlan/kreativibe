'use client';

import { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { Button, Input, DataTable, StatCard, StatusBadge, Card, CardContent, CardHeader } from '@/components/ui';
import { adminService } from '@/services/admin.service';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPPORT_AGENT';
  isActive: boolean;
  isEmailVerified: boolean;
  countryId: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  CREATOR: 'bg-orange-100 text-orange-700',
  BRAND: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-red-100 text-red-700',
  SUPPORT_AGENT: 'bg-green-100 text-green-700',
};

const COUNTRY_NAMES: Record<string, string> = {
  'kenya-001': 'Kenya',
  'uganda-001': 'Uganda',
  'tanzania-001': 'Tanzania',
};

const mockUsers: AdminUser[] = [
  { id: '1', name: 'Sarah Kimani', email: 'sarah@example.com', role: 'CREATOR', isActive: true, isEmailVerified: true, countryId: 'kenya-001', createdAt: '2026-01-15T10:00:00Z' },
  { id: '2', name: 'TechBrand KE', email: 'info@techbrand.ke', role: 'BRAND', isActive: true, isEmailVerified: true, countryId: 'kenya-001', createdAt: '2026-01-10T10:00:00Z' },
  { id: '3', name: 'Admin User', email: 'admin@kreativibe.com', role: 'ADMIN', isActive: true, isEmailVerified: true, countryId: 'kenya-001', createdAt: '2025-12-01T10:00:00Z' },
  { id: '4', name: 'Grace Wanjiru', email: 'grace@example.com', role: 'CREATOR', isActive: false, isEmailVerified: true, countryId: 'kenya-001', createdAt: '2026-02-10T10:00:00Z' },
  { id: '5', name: 'Support Agent', email: 'support@kreativibe.com', role: 'SUPPORT_AGENT', isActive: true, isEmailVerified: true, countryId: 'kenya-001', createdAt: '2026-01-05T10:00:00Z' },
  { id: '6', name: 'Michael Kamau', email: 'michael@example.com', role: 'CREATOR', isActive: true, isEmailVerified: false, countryId: 'kenya-001', createdAt: '2026-01-20T10:00:00Z' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch {
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await adminService.toggleUser(id);
    } catch {}
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    setTogglingId(null);
  };

  const filtered = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    creators: users.filter(u => u.role === 'CREATOR').length,
    brands: users.filter(u => u.role === 'BRAND').length,
    active: users.filter(u => u.isActive).length,
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (value: string, row: AdminUser) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (v: string) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[v] || 'bg-gray-100 text-gray-700'}`}>{v}</span>
      ),
    },
    {
      key: 'countryId',
      label: 'Country',
      render: (v: string) => <span className="text-sm">{COUNTRY_NAMES[v] || v}</span>,
    },
    {
      key: 'isEmailVerified',
      label: 'Email',
      render: (v: boolean) => (
        <StatusBadge variant={v ? 'success' : 'warning'} size="sm">{v ? 'Verified' : 'Unverified'}</StatusBadge>
      ),
    },
    {
      key: 'isActive',
      label: 'Account',
      render: (v: boolean) => (
        <StatusBadge variant={v ? 'success' : 'error'} size="sm">{v ? 'Active' : 'Suspended'}</StatusBadge>
      ),
    },
    {
      key: 'createdAt',
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
      render: (_: any, row: AdminUser) => (
        <Button
          variant={row.isActive ? 'destructive' : 'outline'}
          size="sm"
          disabled={togglingId === row.id || row.role === 'ADMIN'}
          onClick={() => handleToggle(row.id)}
        >
          {row.isActive ? 'Suspend' : 'Restore'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users, roles, and account status</p>
        </div>
        <Button variant="outline" onClick={loadUsers}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.total.toString()} icon={<Users className="h-4 w-4" />} iconColor="text-blue-600" />
        <StatCard title="Creators" value={stats.creators.toString()} icon={<UserCheck className="h-4 w-4" />} iconColor="text-orange-600" />
        <StatCard title="Brands" value={stats.brands.toString()} icon={<UserCheck className="h-4 w-4" />} iconColor="text-purple-600" />
        <StatCard title="Active" value={stats.active.toString()} icon={<UserCheck className="h-4 w-4" />} iconColor="text-green-600" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="ALL">All Roles</option>
              <option value="CREATOR">Creators</option>
              <option value="BRAND">Brands</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPPORT_AGENT">Support Agents</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filtered}
            columns={columns}
            loading={loading}
            searchable={false}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
