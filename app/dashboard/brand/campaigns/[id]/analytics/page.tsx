'use client';

import { useState } from 'react';
import { CampaignOverview, CampaignOverviewData } from '@/components/analytics/CampaignOverview';
import { CreativePerformance, CreativePerformanceData } from '@/components/analytics/CreativePerformance';
import { ContentPerformanceChart, ContentPerformanceData } from '@/components/analytics/ContentPerformanceChart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockCampaignOverview: CampaignOverviewData = {
  campaignId: '1',
  campaignName: 'Summer Fashion Campaign 2024',
  status: 'active',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  budget: 500000,
  spent: 325000,
  currency: 'KES',
  metrics: {
    totalReach: 2500000,
    totalEngagement: 450000,
    totalImpressions: 5000000,
    clickThroughRate: 3.5,
    conversionRate: 2.1,
  },
  creatives: 15,
  posts: 120,
};

const mockCreativePerformance: CreativePerformanceData[] = [
  {
    creativeId: 'c1',
    name: 'Sarah Mwangi',
    metrics: {
      posts: 12,
      totalReach: 350000,
      totalEngagement: 75000,
      engagementRate: 21.4,
      avgViews: 29167,
      earnings: 125000,
    },
    trend: 15.3,
  },
  {
    creativeId: 'c2',
    name: 'John Kamau',
    metrics: {
      posts: 8,
      totalReach: 280000,
      totalEngagement: 52000,
      engagementRate: 18.6,
      avgViews: 35000,
      earnings: 95000,
    },
    trend: 8.7,
  },
  {
    creativeId: 'c3',
    name: 'Mary Wanjiku',
    metrics: {
      posts: 15,
      totalReach: 420000,
      totalEngagement: 98000,
      engagementRate: 23.3,
      avgViews: 28000,
      earnings: 145000,
    },
    trend: 22.1,
  },
];

const mockContentPerformance: ContentPerformanceData[] = [
  { date: '2024-06-01', views: 50000, engagement: 8500, shares: 1200, comments: 3400 },
  { date: '2024-06-02', views: 62000, engagement: 10500, shares: 1500, comments: 4200 },
  { date: '2024-06-03', views: 58000, engagement: 9800, shares: 1350, comments: 3900 },
  { date: '2024-06-04', views: 75000, engagement: 12800, shares: 1800, comments: 5100 },
  { date: '2024-06-05', views: 68000, engagement: 11500, shares: 1600, comments: 4600 },
  { date: '2024-06-06', views: 82000, engagement: 13900, shares: 1950, comments: 5500 },
  { date: '2024-06-07', views: 79000, engagement: 13400, shares: 1880, comments: 5300 },
];

export default function CampaignAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const [metric, setMetric] = useState<'views' | 'engagement' | 'shares' | 'comments'>('views');

  const handleBack = () => {
    router.push(`/dashboard/brand/campaigns/${params.id}`);
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
              <p className="text-muted-foreground">Campaign ID: {params.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Overview */}
        <div className="lg:col-span-2">
          <CampaignOverview
            campaign={mockCampaignOverview}
            onExport={handleExport}
          />
        </div>

        {/* Content Performance Chart */}
        <div className="lg:col-span-2">
          <ContentPerformanceChart
            data={mockContentPerformance}
            metric={metric}
            onMetricChange={setMetric}
            onExport={handleExport}
          />
        </div>

        {/* Creative Performance */}
        <div className="lg:col-span-2">
          <CreativePerformance
            creatives={mockCreativePerformance}
            onSort={handleSort}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
}
