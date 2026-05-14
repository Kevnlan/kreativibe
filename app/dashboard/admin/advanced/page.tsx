'use client';

import { useState } from 'react';
import { ActivityLog, ActivityLogEntry } from '@/components/admin/ActivityLog';
import { SystemHealth, HealthMetric } from '@/components/admin/SystemHealth';
import { UserManagement, UserAccount } from '@/components/admin/UserManagement';
import { AuditTrail, AuditLogEntry } from '@/components/admin/AuditTrail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    user: {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@kreativibe.com',
    },
    action: 'Suspended user account',
    category: 'user',
    details: 'Suspended user account for policy violation',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:15:00Z',
    user: {
      id: 'u2',
      name: 'Brand User',
      email: 'brand@company.com',
    },
    action: 'Created new campaign',
    category: 'campaign',
    details: 'Campaign ID: CAMP-2024-001',
  },
];

const mockHealthMetrics: HealthMetric[] = [
  {
    id: 'cpu',
    name: 'CPU Usage',
    status: 'healthy',
    value: '45%',
    description: 'Server CPU utilization is within normal range',
    lastChecked: '2024-01-15T10:00:00Z',
  },
  {
    id: 'memory',
    name: 'Memory Usage',
    status: 'warning',
    value: '78%',
    description: 'Memory usage is elevated but not critical',
    lastChecked: '2024-01-15T10:00:00Z',
  },
  {
    id: 'database',
    name: 'Database',
    status: 'healthy',
    value: 'Connected',
    description: 'All database connections are healthy',
    lastChecked: '2024-01-15T10:00:00Z',
  },
  {
    id: 'api',
    name: 'API Response Time',
    status: 'healthy',
    value: '120ms',
    description: 'API response times are within SLA',
    lastChecked: '2024-01-15T10:00:00Z',
  },
];

const mockUsers: UserAccount[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    lastActive: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'brand',
    status: 'active',
    joinedAt: '2024-01-05T00:00:00Z',
    lastActive: '2024-01-14T15:30:00Z',
    campaigns: 5,
  },
  {
    id: 'u3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'creative',
    status: 'suspended',
    joinedAt: '2024-01-10T00:00:00Z',
    lastActive: '2024-01-12T09:00:00Z',
  },
];

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    actor: {
      id: 'u1',
      name: 'Admin User',
      role: 'admin',
    },
    action: 'Updated system configuration',
    target: 'System Settings',
    category: 'system',
    changes: [
      {
        field: 'maintenance_mode',
        oldValue: 'false',
        newValue: 'true',
      },
    ],
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:15:00Z',
    actor: {
      id: 'u1',
      name: 'Admin User',
      role: 'admin',
    },
    action: 'Suspended user account',
    target: 'User ID: u3',
    category: 'user',
    ipAddress: '192.168.1.100',
  },
];

export default function AdvancedAdminPage() {
  const router = useRouter();
  const [view, setView] = useState<'activity' | 'health' | 'users' | 'audit'>('activity');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleBack = () => {
    router.push('/dashboard/admin');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleExportAudit = () => {
    console.log('Exporting audit logs');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Advanced Admin</h1>
              <p className="text-muted-foreground">System administration and monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'activity' ? 'brand' : 'outline'}
          onClick={() => setView('activity')}
        >
          Activity Log
        </Button>
        <Button
          variant={view === 'health' ? 'brand' : 'outline'}
          onClick={() => setView('health')}
        >
          System Health
        </Button>
        <Button
          variant={view === 'users' ? 'brand' : 'outline'}
          onClick={() => setView('users')}
        >
          Users
        </Button>
        <Button
          variant={view === 'audit' ? 'brand' : 'outline'}
          onClick={() => setView('audit')}
        >
          Audit Trail
        </Button>
      </div>

      {/* Content */}
      {view === 'activity' && (
        <ActivityLog entries={mockActivityLogs} />
      )}

      {view === 'health' && (
        <SystemHealth
          metrics={mockHealthMetrics}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      )}

      {view === 'users' && (
        <UserManagement
          users={mockUsers}
          onSuspend={(id) => console.log('Suspend:', id)}
          onActivate={(id) => console.log('Activate:', id)}
          onRoleChange={(id, role) => console.log('Change role:', id, role)}
          onViewDetails={(id) => console.log('View details:', id)}
        />
      )}

      {view === 'audit' && (
        <AuditTrail
          entries={mockAuditLogs}
          onExport={handleExportAudit}
          onLoadMore={() => console.log('Load more')}
        />
      )}
    </div>
  );
}
