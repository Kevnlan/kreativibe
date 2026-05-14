'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Eye, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface EngagementMetric {
  label: string;
  value: number;
  change: number;
  icon: any;
}

interface EngagementMetricsProps {
  metrics: EngagementMetric[];
  period?: '24h' | '7d' | '30d' | 'all';
  onExport?: () => void;
}

export function EngagementMetrics({ metrics, period = '7d', onExport }: EngagementMetricsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Engagement Metrics</CardTitle>
          </div>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              Export Data
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const isPositive = metric.change >= 0;

            return (
              <div key={metric.label} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(metric.value)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    isPositive ? "text-success" : "text-destructive"
                  )} />
                  <span className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-success" : "text-destructive"
                  )}>
                    {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last {period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Engagement Summary</h4>
          <p className="text-sm text-muted-foreground">
            Total engagement across all posts: {formatNumber(
              metrics.reduce((sum, m) => sum + m.value, 0)
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Average growth rate: {
              (metrics.reduce((sum, m) => sum + m.change, 0) / metrics.length).toFixed(1)
            }%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
