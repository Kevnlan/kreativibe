'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, CheckCircle, AlertCircle, Search, TrendingUp, Loader2 } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { supportService } from '@/services/support.service';
import { SupportTicket, TicketStatus, TicketPriority, SupportStats } from '@/types/api-contracts/support.types';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  userName: string;
  userEmail: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

function mapTicket(t: SupportTicket): Ticket {
  return {
    id: t.id,
    ticketNumber: t.id.slice(-8).toUpperCase(),
    subject: t.subject,
    userName: t.requesterId.slice(0, 8),
    userEmail: '',
    category: t.category,
    priority: t.priority,
    status: t.status,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    assignedTo: t.assignedAgentId ? 'Assigned' : undefined,
  };
}

export default function SupportAgentDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [stats, setStats] = useState<SupportStats>({
    total: 0,
    resolved: 0,
    resolutionRate: 0,
    averageRating: 0,
    byStatus: [],
    byPriority: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        supportService.listAllTickets({ page: 1, limit: 50 }),
        supportService.getStats(),
      ]);
      setTickets((ticketsRes.items || []).map(mapTicket));
      setStats(statsRes);
    } catch {
      setError('Failed to load support data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'default';
    }
  };

  const getStatusVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'OPEN':
        return 'warning';
      case 'IN_PROGRESS':
        return 'processing';
      case 'WAITING_ON_CUSTOMER':
        return 'pending';
      case 'RESOLVED':
        return 'success';
      case 'CLOSED':
        return 'default';
    }
  };

  const columns = [
    {
      key: 'ticketNumber',
      label: 'Ticket',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium">{value}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (value: string, row: Ticket) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.userName}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: Ticket['priority']) => (
        <StatusBadge variant={getPriorityVariant(value)} size="sm">
          {value}
        </StatusBadge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: Ticket['status']) => (
        <StatusBadge variant={getStatusVariant(value)} size="sm">
          {value.replace('_', ' ')}
        </StatusBadge>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned',
      render: (value: string | undefined) => (
        <span className="text-sm">{value || 'Unassigned'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Ticket) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/support/tickets/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer support tickets and inquiries
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats.total.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Open Tickets"
          value={(stats.byStatus.find(s => s.status === 'OPEN')?.count ?? 0).toString()}
          icon={<AlertCircle className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
        <StatCard
          title="In Progress"
          value={(stats.byStatus.find(s => s.status === 'IN_PROGRESS')?.count ?? 0).toString()}
          icon={<Clock className="h-4 w-4" />}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconColor="text-brand-blue"
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating.toFixed(1)}
          icon={<CheckCircle className="h-4 w-4" />}
          iconColor="text-green-600"
        />
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button className="p-3 border rounded-lg hover:bg-muted transition-colors text-center">
              <p className="text-sm font-medium">All Tickets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </button>
            <button className="p-3 border rounded-lg hover:bg-muted transition-colors text-center">
              <p className="text-sm font-medium">My Tickets</p>
              <p className="text-2xl font-bold text-purple-600">{tickets.filter(t => t.assignedTo).length}</p>
            </button>
            <button className="p-3 border rounded-lg hover:bg-muted transition-colors text-center">
              <p className="text-sm font-medium">Urgent</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </button>
            <button className="p-3 border rounded-lg hover:bg-muted transition-colors text-center">
              <p className="text-sm font-medium">Unassigned</p>
              <p className="text-2xl font-bold text-orange-600">4</p>
            </button>
            <button className="p-3 border rounded-lg hover:bg-muted transition-colors text-center">
              <p className="text-sm font-medium">Waiting</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/support/tickets/new')}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tickets}
            columns={columns}
            loading={loading}
            searchable={false}
            emptyMessage="No support tickets found"
          />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Tickets Resolved Today</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Customer Satisfaction</p>
              <p className="text-2xl font-bold">4.8/5.0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">First Response Time</p>
              <p className="text-2xl font-bold">15 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
