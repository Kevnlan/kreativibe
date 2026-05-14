'use client';

import { useState } from 'react';
import { MessageSquare, Search, Filter, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'general' | 'payment' | 'campaign' | 'technical' | 'account';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: number;
}

interface TicketListProps {
  tickets: SupportTicket[];
  onTicketClick?: (ticketId: string) => void;
  onAssign?: (ticketId: string, userId: string) => void;
  onCloseTicket?: (ticketId: string) => void;
}

const categoryColors = {
  general: 'text-gray-600 dark:text-gray-400',
  payment: 'text-green-600 dark:text-green-400',
  campaign: 'text-purple-600 dark:text-purple-400',
  technical: 'text-blue-600 dark:text-blue-400',
  account: 'text-orange-600 dark:text-orange-400',
} as const;

const priorityColors = {
  low: 'text-gray-600 dark:text-gray-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-orange-600 dark:text-orange-400',
  urgent: 'text-red-600 dark:text-red-400',
} as const;

const statusColors = {
  open: 'secondary',
  in_progress: 'brand',
  resolved: 'success',
  closed: 'destructive',
} as const;

const statusIcons = {
  open: Clock,
  in_progress: MessageSquare,
  resolved: CheckCircle,
  closed: AlertCircle,
} as const;

export function TicketList({ tickets, onTicketClick, onAssign, onCloseTicket }: TicketListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = !searchQuery ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Support Tickets</CardTitle>
          </div>
          <Badge variant="outline">{tickets.length} tickets</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="payment">Payment</option>
              <option value="campaign">Campaign</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const StatusIcon = statusIcons[ticket.status];

            return (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-brand-blue/50 transition-colors"
                onClick={() => onTicketClick?.(ticket.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    ticket.status === 'open' && "bg-secondary",
                    ticket.status === 'in_progress' && "bg-brand-blue",
                    ticket.status === 'resolved' && "bg-success",
                    ticket.status === 'closed' && "bg-destructive"
                  )}>
                    <StatusIcon className={cn("h-5 w-5", "text-white")} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <Badge variant="outline" className={cn("text-xs capitalize", categoryColors[ticket.category])}>
                        {ticket.category}
                      </Badge>
                      <Badge variant={statusColors[ticket.status] as any} className="text-xs capitalize">
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs capitalize", priorityColors[ticket.priority])}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{ticket.createdBy.name}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>{ticket.messages} messages</span>
                      {ticket.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned to {ticket.assignedTo.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No support tickets found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
