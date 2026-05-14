'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PayoutStatusEvent {
  id: string;
  timestamp: string;
  type: 'requested' | 'approved' | 'processing' | 'completed' | 'failed' | 'retried';
  status: 'completed' | 'pending' | 'failed';
  actor?: string;
  message: string;
  details?: string;
  amount?: number;
  currency?: string;
}

interface PayoutStatusTrackerProps {
  events: PayoutStatusEvent[];
  currentStatus: string;
  amount?: number;
  currency?: string;
}

const eventTypeIcons = {
  requested: FileText,
  approved: CheckCircle,
  processing: Clock,
  completed: CheckCircle,
  failed: XCircle,
  retried: AlertCircle,
} as const;

const eventTypeColors = {
  requested: 'text-muted-foreground',
  approved: 'text-success',
  processing: 'text-brand-blue',
  completed: 'text-success',
  failed: 'text-destructive',
  retried: 'text-warning',
} as const;

const eventTypeBadgeColors = {
  requested: 'secondary',
  approved: 'success',
  processing: 'brand',
  completed: 'success',
  failed: 'destructive',
  retried: 'warning',
} as const;

const statusOrder = [
  'requested',
  'approved',
  'processing',
  'completed',
  'failed',
  'retried',
];

export function PayoutStatusTracker({ events, currentStatus, amount, currency }: PayoutStatusTrackerProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleExpand = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const currentStatusIndex = statusOrder.indexOf(currentStatus as any);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Payout Status</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant={eventTypeBadgeColors[currentStatus as keyof typeof eventTypeBadgeColors] as any}>
              {currentStatus.replace(/_/g, ' ')}
            </Badge>
            {amount && currency && (
              <Badge variant="outline">
                {currency} {amount.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-6">
            {statusOrder.map((status, index) => {
              const event = sortedEvents.find(e => e.type === status);
              const EventIcon = eventTypeIcons[status as keyof typeof eventTypeIcons];
              const isCurrent = status === currentStatus;
              const isPast = index < currentStatusIndex;
              const isFuture = index > currentStatusIndex;

              return (
                <div key={status} className="relative pl-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10",
                      isPast && "bg-success",
                      isCurrent && "bg-brand-blue",
                      isFuture && "bg-muted"
                    )}
                  >
                    <EventIcon className={cn(
                      "h-4 w-4",
                      isPast && "text-white",
                      isCurrent && "text-white",
                      isFuture && "text-muted-foreground"
                    )} />
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      "border rounded-lg p-3 transition-all",
                      isCurrent && "border-brand-blue bg-brand-blue/5",
                      isPast && "border-success/50 bg-success/5",
                      isFuture && "border-border opacity-50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={eventTypeBadgeColors[status as keyof typeof eventTypeBadgeColors] as any}
                        className="text-xs"
                      >
                        {status.replace(/_/g, ' ')}
                      </Badge>
                      {event && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {event ? (
                      <div>
                        <p className="text-sm font-medium">{event.message}</p>
                        {event.actor && (
                          <p className="text-xs text-muted-foreground mt-1">
                            by {event.actor}
                          </p>
                        )}
                        {event.amount && event.currency && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.currency} {event.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isCurrent ? 'In progress...' : 'Pending'}
                      </p>
                    )}

                    {event && event.details && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">{event.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No status events recorded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
