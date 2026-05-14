'use client';

import { useState } from 'react';
import { Eye, Heart, MessageCircle, Share2, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PostAnalyticsData {
  postId: string;
  title: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  trends?: {
    views: number[];
    likes: number[];
  };
}

interface PostAnalyticsProps {
  analytics: PostAnalyticsData;
  onExport?: (postId: string) => void;
}

const platformColors = {
  instagram: 'text-pink-500',
  tiktok: 'text-black dark:text-white',
  youtube: 'text-red-500',
  twitter: 'text-blue-500',
  facebook: 'text-blue-600',
} as const;

export function PostAnalytics({ analytics, onExport }: PostAnalyticsProps) {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

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
            <TrendingUp className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Post Analytics</CardTitle>
          </div>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="all">All Time</option>
            </select>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(analytics.postId)}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Post Info */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h4 className="font-semibold">{analytics.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-sm font-medium capitalize", platformColors[analytics.platform])}>
                {analytics.platform}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {new Date(analytics.publishedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Views</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(analytics.metrics.views)}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Likes</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(analytics.metrics.likes)}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Comments</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(analytics.metrics.comments)}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Shares</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(analytics.metrics.shares)}</p>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-4 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-blue" />
              <span className="font-medium">Engagement Rate</span>
            </div>
            <Badge variant="brand" className="text-lg px-4 py-1">
              {analytics.metrics.engagementRate.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-sm text-brand-blue mt-2">
            Calculated as (likes + comments + shares) / views × 100
          </p>
        </div>

        {/* Trend Chart Placeholder */}
        {analytics.trends?.views && (() => {
          const views = analytics.trends?.views || [];
          const maxViews = Math.max(...views);
          return (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Trend
              </h4>
              <div className="h-32 flex items-end gap-1">
                {views.slice(0, 10).map((value, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-brand-blue rounded-t transition-all hover:bg-brand-blue-dark"
                    style={{
                      height: `${(value / maxViews) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
