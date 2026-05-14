'use client';

import { useState } from 'react';
import { Activity, Cpu, HardDrive, Database, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface HealthMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description?: string;
  lastChecked: string;
}

interface SystemHealthProps {
  metrics: HealthMetric[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle,
} as const;

const statusColors = {
  healthy: 'success',
  warning: 'warning',
  critical: 'destructive',
} as const;

export function SystemHealth({ metrics, onRefresh, isRefreshing }: SystemHealthProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const iconMap: Record<string, any> = {
    cpu: Cpu,
    memory: HardDrive,
    database: Database,
    api: Activity,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">System Health</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            leftIcon={isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const StatusIcon = statusIcons[metric.status];
            const Icon = iconMap[metric.id.toLowerCase()] || Activity;

            return (
              <div
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all hover:border-brand-blue/50",
                  selectedMetric === metric.id && "border-brand-blue bg-brand-blue/5"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "h-5 w-5",
                      metric.status === 'healthy' && "text-success",
                      metric.status === 'warning' && "text-warning",
                      metric.status === 'critical' && "text-destructive"
                    )} />
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <StatusIcon className={cn(
                    "h-5 w-5",
                    metric.status === 'healthy' && "text-success",
                    metric.status === 'warning' && "text-warning",
                    metric.status === 'critical' && "text-destructive"
                  )} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={statusColors[metric.status] as any} className="text-xs capitalize">
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-semibold">{metric.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Checked</span>
                    <span className="text-xs">{new Date(metric.lastChecked).toLocaleString()}</span>
                  </div>
                </div>

                {metric.description && selectedMetric === metric.id && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {metrics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No health metrics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
