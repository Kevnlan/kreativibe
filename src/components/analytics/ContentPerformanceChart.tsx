'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, Download, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ContentPerformanceData {
  date: string;
  views: number;
  engagement: number;
  shares: number;
  comments: number;
}

interface ContentPerformanceChartProps {
  data: ContentPerformanceData[];
  metric?: 'views' | 'engagement' | 'shares' | 'comments';
  onMetricChange?: (metric: 'views' | 'engagement' | 'shares' | 'comments') => void;
  onExport?: () => void;
}

export function ContentPerformanceChart({ data, metric = 'views', onMetricChange, onExport }: ContentPerformanceChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getMetricValue = (item: ContentPerformanceData) => {
    switch (metric) {
      case 'views': return item.views;
      case 'engagement': return item.engagement;
      case 'shares': return item.shares;
      case 'comments': return item.comments;
      default: return item.views;
    }
  };

  const maxValue = Math.max(...data.map(getMetricValue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Content Performance</CardTitle>
          </div>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
            <select
              value={metric}
              onChange={(e) => onMetricChange?.(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="views">Views</option>
              <option value="engagement">Engagement</option>
              <option value="shares">Shares</option>
              <option value="comments">Comments</option>
            </select>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium capitalize">{metric} Over Time</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total: {formatNumber(data.reduce((sum, item) => sum + getMetricValue(item), 0))}</span>
              <span>•</span>
              <span>Avg: {formatNumber(data.reduce((sum, item) => sum + getMetricValue(item), 0) / data.length)}</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-48 flex items-end gap-2">
            {data.map((item, idx) => {
              const value = getMetricValue(item);
              const percentage = (value / maxValue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand-blue rounded-t transition-all hover:bg-brand-blue-dark cursor-pointer"
                    style={{ height: `${percentage}%` }}
                    title={`${new Date(item.date).toLocaleDateString()}: ${formatNumber(value)}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="font-semibold">{formatNumber(maxValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Lowest</p>
              <p className="font-semibold">{formatNumber(Math.min(...data.map(getMetricValue)))}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Growth</p>
              <p className={cn(
                "font-semibold",
                data[data.length - 1] && data[0] && getMetricValue(data[data.length - 1]) >= getMetricValue(data[0])
                  ? "text-success"
                  : "text-destructive"
              )}>
                {data[data.length - 1] && data[0]
                  ? `${((getMetricValue(data[data.length - 1]) / getMetricValue(data[0]) - 1) * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
