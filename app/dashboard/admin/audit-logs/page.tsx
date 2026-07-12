'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, FileText, RefreshCw } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, DataTable, StatusBadge } from '@/components/ui';
import { adminService, AuditLog, AuditLogFilters } from '@/services/admin.service';

const ACTION_VARIANTS: Record<string, string> = {
  USER_BANNED: 'error',
  USER_SUSPENDED: 'warning',
  USER_REINSTATED: 'success',
  USER_VERIFIED: 'success',
  CONTENT_REMOVED: 'error',
  CONTENT_FEATURED: 'success',
  COMMISSION_UPDATED: 'default',
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: AuditLogFilters = { page: 1, limit: 100 };
      if (actionFilter) filters.action = actionFilter;
      const res = await adminService.listAuditLogs(filters);
      setLogs(res.items || []);
    } catch {
      setError('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      key: 'actorName',
      label: 'Actor',
      sortable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      render: (value: string) => (
        <StatusBadge variant={(ACTION_VARIANTS[value] as any) || 'default'} size="sm">
          {value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
        </StatusBadge>
      ),
    },
    {
      key: 'targetType',
      label: 'Target',
      render: (value: string, row: AuditLog) => (
        <div>
          <p className="text-sm">{value}</p>
          <p className="text-xs text-muted-foreground">{row.targetId.slice(0, 12)}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all administrative actions on the platform</p>
        </div>
        <Button variant="outline" onClick={loadLogs} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor or action..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="">All Actions</option>
              <option value="USER_BANNED">User Banned</option>
              <option value="USER_SUSPENDED">User Suspended</option>
              <option value="USER_REINSTATED">User Reinstated</option>
              <option value="USER_VERIFIED">User Verified</option>
              <option value="CONTENT_REMOVED">Content Removed</option>
              <option value="CONTENT_FEATURED">Content Featured</option>
              <option value="COMMISSION_UPDATED">Commission Updated</option>
            </select>
            <Button onClick={loadLogs}>Apply Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading audit logs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found.</p>
            </div>
          ) : (
            <DataTable
              data={filtered}
              columns={columns}
              loading={loading}
              searchable={false}
              emptyMessage="No audit logs found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
