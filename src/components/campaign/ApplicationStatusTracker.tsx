'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ApplicationStatusEvent {
  id: string;
  timestamp: string;
  type: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted' | 'proposal_requested' | 'proposal_submitted' | 'contract_sent' | 'contract_signed';
  status: 'completed' | 'pending' | 'failed';
  actor?: string;
  message: string;
  details?: string;
}

interface ApplicationStatusTrackerProps {
  events: ApplicationStatusEvent[];
  currentStatus: string;
}

const eventTypeIcons = {
  submitted: FileText,
  under_review: Clock,
  shortlisted: CheckCircle,
  rejected: XCircle,
  accepted: CheckCircle,
  proposal_requested: FileText,
  proposal_submitted: FileText,
  contract_sent: FileText,
  contract_signed: CheckCircle,
} as const;

const eventTypeColors = {
  submitted: 'text-muted-foreground',
  under_review: 'text-brand-blue',
  shortlisted: 'text-warning',
  rejected: 'text-destructive',
  accepted: 'text-success',
  proposal_requested: 'text-brand-blue',
  proposal_submitted: 'text-brand-blue',
  contract_sent: 'text-brand-blue',
  contract_signed: 'text-success',
} as const;

const eventTypeBadgeColors = {
  submitted: 'secondary',
  under_review: 'brand',
  shortlisted: 'warning',
  rejected: 'destructive',
  accepted: 'success',
  proposal_requested: 'brand',
  proposal_submitted: 'brand',
  contract_sent: 'brand',
  contract_signed: 'success',
} as const;

const statusOrder = [
  'submitted',
  'under_review',
  'shortlisted',
  'proposal_requested',
  'proposal_submitted',
  'contract_sent',
  'contract_signed',
  'accepted',
  'rejected',
];

export function ApplicationStatusTracker({ events, currentStatus }: ApplicationStatusTrackerProps) {
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
            <CardTitle className="text-lg">Application Status</CardTitle>
          </div>
          <Badge variant={eventTypeBadgeColors[currentStatus as keyof typeof eventTypeBadgeColors] as any}>
            {currentStatus.replace(/_/g, ' ')}
          </Badge>
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
