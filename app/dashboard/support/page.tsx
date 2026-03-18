'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  userName: string;
  userEmail: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setTickets([
        {
          id: '1',
          ticketNumber: 'TKT-1001',
          subject: 'Cannot upload content',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          category: 'Technical',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: '2024-03-18T10:00:00Z',
          updatedAt: '2024-03-18T10:00:00Z',
        },
        {
          id: '2',
          ticketNumber: 'TKT-1002',
          subject: 'Payment not received',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          category: 'Billing',
          priority: 'URGENT',
          status: 'IN_PROGRESS',
          createdAt: '2024-03-18T09:30:00Z',
          updatedAt: '2024-03-18T11:00:00Z',
        },
        {
          id: '3',
          ticketNumber: 'TKT-1003',
          subject: 'How to verify my account?',
          userName: 'Mike Johnson',
          userEmail: 'mike@example.com',
          category: 'Account',
          priority: 'MEDIUM',
          status: 'WAITING',
          createdAt: '2024-03-17T14:00:00Z',
          updatedAt: '2024-03-18T08:00:00Z',
        },
      ]);
    } catch (error) {
      console.error('Failed to load tickets:', error);
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
      case 'WAITING':
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

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer support tickets and inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets.toString()}
          icon={<AlertCircle className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress.toString()}
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
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        loading={loading}
        searchable={false}
        emptyMessage="No support tickets found"
      />
    </div>
  );
}
