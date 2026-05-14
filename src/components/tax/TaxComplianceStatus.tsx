'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface TaxComplianceItem {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  dueDate?: string;
  lastUpdated?: string;
  actionRequired?: string;
}

interface TaxComplianceStatusProps {
  items: TaxComplianceItem[];
  overallStatus: 'compliant' | 'non-compliant' | 'partial';
  onAction?: (itemId: string) => void;
}

const statusIcons = {
  compliant: CheckCircle,
  'non-compliant': AlertTriangle,
  pending: Clock,
} as const;

const statusColors = {
  compliant: 'success',
  'non-compliant': 'destructive',
  pending: 'warning',
} as const;

export function TaxComplianceStatus({ items, overallStatus, onAction }: TaxComplianceStatusProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const overallStatusConfig = {
    compliant: { color: 'text-success', bg: 'bg-success/10', label: 'Compliant' },
    'non-compliant': { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Non-Compliant' },
    partial: { color: 'text-warning', bg: 'bg-warning/10', label: 'Partially Compliant' },
  }[overallStatus];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Tax Compliance Status</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(overallStatusConfig.color, overallStatusConfig.bg)}
          >
            {overallStatusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => {
            const StatusIcon = statusIcons[item.status];
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          item.status === 'compliant' && "bg-success",
                          item.status === 'non-compliant' && "bg-destructive",
                          item.status === 'pending' && "bg-warning"
                        )}
                      >
                        <StatusIcon className={cn("h-5 w-5", "text-white")} />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant={statusColors[item.status] as any} className="text-xs capitalize">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.dueDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Expand */}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    {item.lastUpdated && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{new Date(item.lastUpdated).toLocaleString()}</span>
                      </div>
                    )}
                    {item.actionRequired && (
                      <div className="p-2 bg-warning/10 rounded">
                        <p className="text-sm text-warning">{item.actionRequired}</p>
                      </div>
                    )}
                    {onAction && item.status !== 'compliant' && (
                      <Button variant="brand" size="sm" onClick={() => onAction(item.id)}>
                        Take Action
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No compliance items to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
