'use client';

import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, ArrowRight, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface NegotiationEvent {
  id: string;
  type: 'offer' | 'counter' | 'accept' | 'reject';
  from: {
    id: string;
    name: string;
    type: 'brand' | 'creative';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
  };
  amount: number;
  currency: string;
  deliverables: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

interface NegotiationHistoryProps {
  events: NegotiationEvent[];
  onViewOffer?: (eventId: string) => void;
}

const typeIcons = {
  offer: MessageSquare,
  counter: ArrowRight,
  accept: CheckCircle,
  reject: XCircle,
} as const;

const typeColors = {
  offer: 'text-brand-blue',
  counter: 'text-warning',
  accept: 'text-success',
  reject: 'text-destructive',
} as const;

const typeBadgeColors = {
  offer: 'brand',
  counter: 'warning',
  accept: 'success',
  reject: 'destructive',
} as const;

export function NegotiationHistory({ events, onViewOffer }: NegotiationHistoryProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Negotiation History</CardTitle>
          </div>
          <Badge variant="outline">{events.length} events</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEvents.map((event, index) => {
            const TypeIcon = typeIcons[event.type];
            const isExpanded = expandedEvents.has(event.id);
            const isLast = index === sortedEvents.length - 1;

            return (
              <div
                key={event.id}
                className="relative"
              >
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                )}

                {/* Event */}
                <div
                  className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    event.status === 'accepted' && "border-success/50 bg-success/5",
                    event.status === 'rejected' && "border-destructive/50 bg-destructive/5",
                    event.status === 'pending' && "border-border"
                  )}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpand(event.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                          event.type === 'offer' && "bg-brand-blue text-white",
                          event.type === 'counter' && "bg-warning text-white",
                          event.type === 'accept' && "bg-success text-white",
                          event.type === 'reject' && "bg-destructive text-white"
                        )}
                      >
                        <TypeIcon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{event.from.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.from.type}
                          </Badge>
                          <Badge variant={typeBadgeColors[event.type] as any} className="text-xs">
                            {event.type}
                          </Badge>
                          {event.status !== 'pending' && (
                            <Badge variant={event.status === 'accepted' ? 'success' : 'destructive'} className="text-xs">
                              {event.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.type === 'offer' ? 'Sent offer to' : event.type === 'counter' ? 'Countered offer to' : event.type === 'accept' ? 'Accepted offer from' : 'Rejected offer from'} {event.to.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="font-medium">
                            {event.currency} {event.amount.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {event.deliverables.length} deliverables
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Expand */}
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                      {/* Message */}
                      {event.message && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">Message</h5>
                          <p className="text-sm text-muted-foreground">{event.message}</p>
                        </div>
                      )}

                      {/* Deliverables */}
                      <div>
                        <h5 className="text-sm font-medium mb-1">Deliverables</h5>
                        <div className="flex flex-wrap gap-1">
                          {event.deliverables.slice(0, 3).map((d, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {d}
                            </Badge>
                          ))}
                          {event.deliverables.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{event.deliverables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h5 className="text-sm font-medium mb-1">Timeline</h5>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timeline.startDate).toLocaleDateString()} - {new Date(event.timeline.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* View Details */}
                      {onViewOffer && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewOffer(event.id);
                          }}
                        >
                          View Full Details
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No negotiation history yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
