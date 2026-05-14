'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CampaignOverviewData {
  campaignId: string;
  campaignName: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  currency: string;
  metrics: {
    totalReach: number;
    totalEngagement: number;
    totalImpressions: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  creatives: number;
  posts: number;
}

interface CampaignOverviewProps {
  campaign: CampaignOverviewData;
  onEdit?: () => void;
  onExport?: () => void;
}

const statusColors = {
  active: 'success',
  completed: 'secondary',
  paused: 'warning',
} as const;

export function CampaignOverview({ campaign, onEdit, onExport }: CampaignOverviewProps) {
  const [period, setPeriod] = useState<'all' | '7d' | '30d'>('all');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const budgetRemaining = campaign.budget - campaign.spent;
  const budgetPercentage = (campaign.spent / campaign.budget) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Campaign Overview</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusColors[campaign.status] as any} className="capitalize">
              {campaign.status}
            </Badge>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
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
      <CardContent className="space-y-6">
        {/* Campaign Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">{campaign.campaignName}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
              {campaign.endDate && (
                <>
                  <span>-</span>
                  <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{campaign.creatives} creatives</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{campaign.posts} posts</span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Budget Usage</span>
            </div>
            <span className="text-sm">
              {campaign.currency} {campaign.spent.toLocaleString()} / {campaign.currency} {campaign.budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                budgetPercentage > 80 ? "bg-warning" : budgetPercentage > 100 ? "bg-destructive" : "bg-success"
              )}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {budgetPercentage.toFixed(1)}% used ({campaign.currency} {budgetRemaining.toLocaleString()} remaining)
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Reach</span>
            </div>
            <p className="text-lg font-bold">{formatNumber(campaign.metrics.totalReach)}</p>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Engagement</span>
            </div>
            <p className="text-lg font-bold">{formatNumber(campaign.metrics.totalEngagement)}</p>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Impressions</span>
            </div>
            <p className="text-lg font-bold">{formatNumber(campaign.metrics.totalImpressions)}</p>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CTR</span>
            </div>
            <p className="text-lg font-bold">{campaign.metrics.clickThroughRate.toFixed(2)}%</p>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Conversion</span>
            </div>
            <p className="text-lg font-bold">{campaign.metrics.conversionRate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Actions */}
        {onEdit && (
          <Button variant="outline" className="w-full" onClick={onEdit}>
            Edit Campaign
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
