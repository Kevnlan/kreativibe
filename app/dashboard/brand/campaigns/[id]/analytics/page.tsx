'use client';

import { useState, useEffect } from 'react';
import { CampaignOverview, CampaignOverviewData } from '@/components/analytics/CampaignOverview';
import { CreativePerformance, CreativePerformanceData } from '@/components/analytics/CreativePerformance';
import { ContentPerformanceChart, ContentPerformanceData } from '@/components/analytics/ContentPerformanceChart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { campaignService } from '@/services/campaign.service';
import { Campaign, CampaignStats } from '@/types/campaign.types';

export default function CampaignAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [metric, setMetric] = useState<'views' | 'engagement' | 'shares' | 'comments'>('views');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [campaignId]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [campaignData, statsData] = await Promise.all([
        campaignService.get(campaignId),
        campaignService.stats(campaignId),
      ]);
      setCampaign(campaignData);
      setStats(statsData);
    } catch {
      setError('Failed to load campaign analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/dashboard/brand/campaigns/${campaignId}`);
  };

  const handleExport = () => {
    console.log('Exporting analytics data');
  };

  const handleSort = (field: string) => {
    console.log('Sorting by:', field);
  };

  const handleViewDetails = (creativeId: string) => {
    console.log('Viewing details for creative:', creativeId);
  };

  const campaignOverview: CampaignOverviewData | null = campaign ? {
    campaignId: campaign.id,
    campaignName: campaign.title,
    status: campaign.status.toLowerCase(),
    startDate: campaign.startDate || '',
    endDate: campaign.endDate || '',
    budget: campaign.budgetMax,
    spent: 0,
    currency: campaign.currency,
    metrics: {
      totalReach: 0,
      totalEngagement: 0,
      totalImpressions: 0,
      clickThroughRate: 0,
      conversionRate: 0,
    },
    creatives: stats?.acceptedCreators ?? 0,
    posts: 0,
  } : null;

  const creativePerformance: CreativePerformanceData[] = [];
  const contentPerformance: ContentPerformanceData[] = [];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading campaign analytics...
        </div>
      </div>
    );
  }

  if (error || !campaignOverview) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Campaign Analytics</h1>
              <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error || 'Failed to load campaign data.'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Campaign Analytics</h1>
              <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Overview */}
        <div className="lg:col-span-2">
          <CampaignOverview
            campaign={campaignOverview}
            onExport={handleExport}
          />
        </div>

        {/* Content Performance Chart */}
        <div className="lg:col-span-2">
          <ContentPerformanceChart
            data={contentPerformance}
            metric={metric}
            onMetricChange={setMetric}
            onExport={handleExport}
          />
        </div>

        {/* Creative Performance */}
        <div className="lg:col-span-2">
          <CreativePerformance
            creatives={creativePerformance}
            onSort={handleSort}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
}
