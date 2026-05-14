'use client';

import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar, DollarSign, ChevronDown, ChevronRight, Upload, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed';
  deliverables: string[];
  submittedAt?: string;
  approvedAt?: string;
  feedback?: string;
  attachments?: string[];
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onSubmitDelivery?: (milestoneId: string, data: any) => void;
  onViewDetails?: (milestoneId: string) => void;
}

const statusIcons = {
  pending: Clock,
  in_progress: Clock,
  submitted: Upload,
  approved: CheckCircle,
  rejected: AlertCircle,
  completed: CheckCircle,
} as const;

const statusColors = {
  pending: 'text-muted-foreground',
  in_progress: 'text-brand-blue',
  submitted: 'text-warning',
  approved: 'text-success',
  rejected: 'text-destructive',
  completed: 'text-success',
} as const;

const statusBadgeColors = {
  pending: 'secondary',
  in_progress: 'brand',
  submitted: 'warning',
  approved: 'success',
  rejected: 'destructive',
  completed: 'success',
} as const;

export function MilestoneTracker({ milestones, onSubmitDelivery, onViewDetails }: MilestoneTrackerProps) {
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());

  const toggleExpand = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const completedAmount = milestones
    .filter(m => m.status === 'completed' || m.status === 'approved')
    .reduce((sum, m) => sum + m.amount, 0);
  const progress = (completedAmount / totalAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Milestone Tracker</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              {milestones.filter(m => m.status === 'completed').length}/{milestones.length} Completed
            </Badge>
            <Badge variant="success">
              {completedAmount.toLocaleString()} / {totalAmount.toLocaleString()} {milestones[0]?.currency}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((milestone) => {
            const StatusIcon = statusIcons[milestone.status];
            const isExpanded = expandedMilestones.has(milestone.id);

            return (
              <div
                key={milestone.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  milestone.status === 'completed' && "border-success/50 bg-success/5",
                  milestone.status === 'approved' && "border-success/50 bg-success/5",
                  milestone.status === 'rejected' && "border-destructive/50 bg-destructive/5",
                  milestone.status === 'in_progress' && "border-brand-blue/50 bg-brand-blue/5"
                )}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(milestone.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        milestone.status === 'completed' && "bg-success",
                        milestone.status === 'approved' && "bg-success",
                        milestone.status === 'rejected' && "bg-destructive",
                        milestone.status === 'in_progress' && "bg-brand-blue",
                        (milestone.status === 'pending' || milestone.status === 'submitted') && "bg-muted"
                      )}
                    >
                      <StatusIcon className={cn(
                        "h-4 w-4",
                        (milestone.status === 'pending' || milestone.status === 'submitted') && "text-muted-foreground",
                        milestone.status === 'in_progress' && "text-white",
                        milestone.status === 'completed' && "text-white",
                        milestone.status === 'approved' && "text-white",
                        milestone.status === 'rejected' && "text-white"
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge variant={statusBadgeColors[milestone.status] as any} className="text-xs">
                          {milestone.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>

                      {/* Amount & Due Date */}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-success" />
                          <span className="font-medium">
                            {milestone.currency} {milestone.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                    {/* Deliverables */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Deliverables</h5>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dates */}
                    {milestone.submittedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Submitted:</span>
                        <span className="font-medium">{new Date(milestone.submittedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {milestone.approvedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Approved:</span>
                        <span className="font-medium">{new Date(milestone.approvedAt).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Feedback */}
                    {milestone.feedback && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Feedback</h5>
                        <p className="text-sm text-muted-foreground">{milestone.feedback}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {milestone.attachments && milestone.attachments.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Attachments</h5>
                        <div className="flex flex-wrap gap-1">
                          {milestone.attachments.map((attachment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {milestone.status === 'in_progress' && onSubmitDelivery && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSubmitDelivery(milestone.id, {});
                          }}
                          leftIcon={<Upload className="h-4 w-4" />}
                        >
                          Submit Delivery
                        </Button>
                      </div>
                    )}

                    {onViewDetails && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(milestone.id);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {milestones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No milestones defined yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
