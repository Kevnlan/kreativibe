'use client';

import { useState } from 'react';
import { Workflow, CheckCircle, Clock, AlertCircle, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  assignee?: string;
  completedAt?: string;
  estimatedDuration?: number;
  dependencies?: string[];
  notes?: string;
}

interface ModerationWorkflowProps {
  steps: WorkflowStep[];
  currentStepId?: string;
  onStepAction?: (stepId: string, action: string) => void;
}

const statusIcons = {
  pending: Clock,
  'in-progress': Workflow,
  completed: CheckCircle,
  failed: AlertCircle,
  skipped: Clock,
} as const;

const statusColors = {
  pending: 'text-muted-foreground',
  'in-progress': 'text-brand-blue',
  completed: 'text-success',
  failed: 'text-destructive',
  skipped: 'text-muted-foreground',
} as const;

const statusBadgeColors = {
  pending: 'secondary',
  'in-progress': 'brand',
  completed: 'success',
  failed: 'destructive',
  skipped: 'secondary',
} as const;

export function ModerationWorkflow({ steps, currentStepId, onStepAction }: ModerationWorkflowProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Moderation Workflow</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="success">{completedCount}/{steps.length} Completed</Badge>
            {failedCount > 0 && <Badge variant="destructive">{failedCount} Failed</Badge>}
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
          {steps.map((step, index) => {
            const StatusIcon = statusIcons[step.status];
            const isExpanded = expandedSteps.has(step.id);
            const isCurrent = step.id === currentStepId;
            const isNext = index === currentIndex + 1;

            return (
              <div
                key={step.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  isCurrent && "border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20",
                  step.status === 'failed' && "border-destructive/50 bg-destructive/5",
                  step.status === 'completed' && "border-success/50 bg-success/5"
                )}
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(step.id)}
                >
                  {/* Step Number */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step.status === 'completed' && "bg-success text-white",
                      step.status === 'failed' && "bg-destructive text-white",
                      step.status === 'in-progress' && "bg-brand-blue text-white",
                      (step.status === 'pending' || step.status === 'skipped') && "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : step.status === 'failed' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.name}</h4>
                      <Badge variant={statusBadgeColors[step.status] as any} className="text-xs">
                        {step.status}
                      </Badge>
                      {isCurrent && <Badge variant="brand" className="text-xs">Current</Badge>}
                      {isNext && <Badge variant="outline" className="text-xs">Next</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Duration */}
                  {step.estimatedDuration && (
                    <div className="text-sm text-muted-foreground">
                      ~{step.estimatedDuration}m
                    </div>
                  )}

                  {/* Expand Icon */}
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                    {step.assignee && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Assignee:</span>
                        <span className="font-medium">{step.assignee}</span>
                      </div>
                    )}
                    {step.completedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-medium">{new Date(step.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {step.notes && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Notes</h5>
                        <p className="text-sm text-muted-foreground">{step.notes}</p>
                      </div>
                    )}
                    {step.dependencies && step.dependencies.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Dependencies</h5>
                        <div className="flex flex-wrap gap-1">
                          {step.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {onStepAction && step.status === 'in-progress' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepAction(step.id, 'complete');
                          }}
                        >
                          Complete Step
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepAction(step.id, 'skip');
                          }}
                        >
                          Skip
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workflow Actions */}
        {onStepAction && currentIndex >= 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex gap-3">
              <Button
                variant="brand"
                onClick={() => {
                  const nextStep = steps[currentIndex + 1];
                  if (nextStep) {
                    onStepAction(nextStep.id, 'start');
                  }
                }}
                disabled={!steps[currentIndex + 1]}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Advance to Next Step
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
