'use client';

import { useState } from 'react';
import { User, TrendingUp, DollarSign, BarChart3, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CreativePerformanceData {
  creativeId: string;
  name: string;
  avatar?: string;
  metrics: {
    posts: number;
    totalReach: number;
    totalEngagement: number;
    engagementRate: number;
    avgViews: number;
    earnings: number;
  };
  trend: number;
}

interface CreativePerformanceProps {
  creatives: CreativePerformanceData[];
  onSort?: (field: string) => void;
  onViewDetails?: (creativeId: string) => void;
}

export function CreativePerformance({ creatives, onSort, onViewDetails }: CreativePerformanceProps) {
  const [sortBy, setSortBy] = useState<'engagement' | 'reach' | 'earnings'>('engagement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSort = (field: 'engagement' | 'reach' | 'earnings') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    onSort?.(field);
  };

  const sortedCreatives = [...creatives].sort((a, b) => {
    let aValue, bValue;
    if (sortBy === 'engagement') {
      aValue = a.metrics.totalEngagement;
      bValue = b.metrics.totalEngagement;
    } else if (sortBy === 'reach') {
      aValue = a.metrics.totalReach;
      bValue = b.metrics.totalReach;
    } else {
      aValue = a.metrics.earnings;
      bValue = b.metrics.earnings;
    }
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Creative Performance</CardTitle>
          </div>
          <Badge variant="outline">{creatives.length} Creatives</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="space-y-3">
          {sortedCreatives.map((creative) => (
            <div
              key={creative.creativeId}
              className="flex items-center gap-4 p-4 border rounded-lg hover:border-brand-blue/50 transition-colors"
            >
              {/* Avatar */}
              {creative.avatar ? (
                <img src={creative.avatar} alt={creative.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold">
                  {creative.name.charAt(0)}
                </div>
              )}

              {/* Name */}
              <div className="flex-1">
                <h4 className="font-medium">{creative.name}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{creative.metrics.posts} posts</span>
                  <span>•</span>
                  <span className={cn(creative.trend >= 0 ? "text-success" : "text-destructive")}>
                    {creative.trend >= 0 ? '+' : ''}{creative.trend.toFixed(1)}% trend
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                  <p className="font-semibold">{formatNumber(creative.metrics.totalEngagement)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Reach</p>
                  <p className="font-semibold">{formatNumber(creative.metrics.totalReach)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Earnings</p>
                  <p className="font-semibold">KES {formatNumber(creative.metrics.earnings)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Rate</p>
                  <p className="font-semibold">{creative.metrics.engagementRate.toFixed(2)}%</p>
                </div>
              </div>

              {/* Action */}
              {onViewDetails && (
                <Button variant="outline" size="sm" onClick={() => onViewDetails(creative.creativeId)}>
                  Details
                </Button>
              )}
            </div>
          ))}
        </div>

        {creatives.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No creative performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
