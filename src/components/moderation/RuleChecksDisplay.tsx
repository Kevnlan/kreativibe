'use client';

import { Check, X, AlertCircle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export interface RuleCheck {
  id: string;
  ruleName: string;
  description: string;
  category: 'content' | 'copyright' | 'safety' | 'quality' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details?: string;
  recommendation?: string;
}

interface RuleChecksDisplayProps {
  checks: RuleCheck[];
}

const severityColors = {
  low: 'text-muted-foreground',
  medium: 'text-warning',
  high: 'text-destructive',
  critical: 'text-destructive font-bold',
} as const;

const statusIcons = {
  passed: Check,
  failed: X,
  warning: AlertCircle,
  pending: Info,
} as const;

const statusColors = {
  passed: 'success',
  failed: 'destructive',
  warning: 'warning',
  pending: 'secondary',
} as const;

export function RuleChecksDisplay({ checks }: RuleChecksDisplayProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const toggleExpand = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const passedCount = checks.filter(c => c.status === 'passed').length;
  const failedCount = checks.filter(c => c.status === 'failed').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const pendingCount = checks.filter(c => c.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Automated Rule Checks</CardTitle>
          <div className="flex gap-2">
            <Badge variant="success">{passedCount} Passed</Badge>
            {failedCount > 0 && <Badge variant="destructive">{failedCount} Failed</Badge>}
            {warningCount > 0 && <Badge variant="warning">{warningCount} Warnings</Badge>}
            {pendingCount > 0 && <Badge variant="secondary">{pendingCount} Pending</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check) => {
            const StatusIcon = statusIcons[check.status];
            const isExpanded = expandedRules.has(check.id);

            return (
              <div
                key={check.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  check.status === 'failed' && "border-destructive/50 bg-destructive/5",
                  check.status === 'warning' && "border-warning/50 bg-warning/5",
                  check.status === 'passed' && "border-success/50 bg-success/5",
                  check.status === 'pending' && "border-muted"
                )}
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(check.id)}
                >
                  <StatusIcon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      check.status === 'passed' && "text-success",
                      check.status === 'failed' && "text-destructive",
                      check.status === 'warning' && "text-warning",
                      check.status === 'pending' && "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{check.ruleName}</h4>
                      <Badge variant={statusColors[check.status]}>{check.status}</Badge>
                      <Badge variant="outline" className={severityColors[check.severity]}>
                        {check.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{check.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {isExpanded && (check.details || check.recommendation) && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    {check.details && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Details</h5>
                        <p className="text-sm text-muted-foreground">{check.details}</p>
                      </div>
                    )}
                    {check.recommendation && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Recommendation</h5>
                        <p className="text-sm text-muted-foreground">{check.recommendation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {checks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No rule checks available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
