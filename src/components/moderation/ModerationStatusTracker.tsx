'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, User, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface StatusEvent {
  id: string;
  timestamp: string;
  type: 'submitted' | 'review_started' | 'approved' | 'rejected' | 'flagged' | 'resubmitted' | 'escalated';
  status: 'completed' | 'pending' | 'failed';
  actor?: {
    name: string;
    role: string;
    avatar?: string;
  };
  message: string;
  details?: string;
  attachments?: string[];
}

interface ModerationStatusTrackerProps {
  events: StatusEvent[];
  currentStatus: string;
}

const eventTypeIcons = {
  submitted: Clock,
  review_started: User,
  approved: CheckCircle,
  rejected: XCircle,
  flagged: AlertTriangle,
  resubmitted: MessageSquare,
  escalated: AlertTriangle,
} as const;

const eventTypeColors = {
  submitted: 'text-muted-foreground',
  review_started: 'text-brand-blue',
  approved: 'text-success',
  rejected: 'text-destructive',
  flagged: 'text-warning',
  resubmitted: 'text-brand-blue',
  escalated: 'text-destructive',
} as const;

const eventTypeBadgeColors = {
  submitted: 'secondary',
  review_started: 'brand',
  approved: 'success',
  rejected: 'destructive',
  flagged: 'warning',
  resubmitted: 'brand',
  escalated: 'destructive',
} as const;

export function ModerationStatusTracker({ events, currentStatus }: ModerationStatusTrackerProps) {
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
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const latestEvent = sortedEvents[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Status Tracker</CardTitle>
          </div>
          <Badge variant={eventTypeBadgeColors[currentStatus as keyof typeof eventTypeBadgeColors] as any}>
            {currentStatus}
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
            {sortedEvents.map((event, index) => {
              const EventIcon = eventTypeIcons[event.type];
              const isExpanded = expandedEvents.has(event.id);
              const isLast = index === sortedEvents.length - 1;

              return (
                <div key={event.id} className="relative pl-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10",
                      event.status === 'completed' && "bg-success",
                      event.status === 'pending' && "bg-warning",
                      event.status === 'failed' && "bg-destructive"
                    )}
                  >
                    <EventIcon className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      "border rounded-lg overflow-hidden transition-all cursor-pointer hover:bg-muted/50",
                      event.status === 'failed' && "border-destructive/50 bg-destructive/5",
                      event.status === 'pending' && "border-warning/50 bg-warning/5",
                      event.status === 'completed' && "border-success/50 bg-success/5"
                    )}
                    onClick={() => toggleExpand(event.id)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={eventTypeBadgeColors[event.type] as any}
                            className="text-xs"
                          >
                            {event.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <p className="text-sm font-medium">{event.message}</p>

                      {event.actor && (
                        <div className="flex items-center gap-2 mt-2">
                          {event.actor.avatar ? (
                            <img
                              src={event.actor.avatar}
                              alt={event.actor.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs">
                              {event.actor.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {event.actor.name} • {event.actor.role}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (event.details || event.attachments) && (
                      <div className="px-3 pb-3 pt-0 border-t border-border/50 space-y-2">
                        {event.details && (
                          <div>
                            <p className="text-sm text-muted-foreground">{event.details}</p>
                          </div>
                        )}
                        {event.attachments && event.attachments.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">Attachments</p>
                            <div className="flex flex-wrap gap-1">
                              {event.attachments.map((attachment, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {attachment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
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
            No status events recorded
          </div>
        )}
      </CardContent>
    </Card>
  );
}
