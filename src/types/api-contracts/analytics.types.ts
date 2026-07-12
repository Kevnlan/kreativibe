export type AnalyticsMetric =
  | 'VIEWS'
  | 'LIKES'
  | 'COMMENTS'
  | 'SHARES'
  | 'SAVES'
  | 'IMPRESSIONS'
  | 'REACH'
  | 'ENGAGEMENT_RATE';

export type AnalyticsScope = 'creator' | 'campaign' | 'content';
export type ExportFormat = 'CSV' | 'JSON' | 'PDF';

export interface MetricTotal {
  metric: AnalyticsMetric;
  value: number;
}

export interface PlatformBreakdown {
  platform: string;
  value: number;
}

export interface TopPostEntry {
  post: {
    id: string;
    title: string;
    platform: string;
  };
  views: number;
}

export interface TimeSeriesEntry {
  date: string;
  value: number;
  platform?: string;
}

export interface CreatorAnalyticsSummary {
  totals: MetricTotal[];
  byPlatform: PlatformBreakdown[];
  topPosts: TopPostEntry[];
  timeSeries: TimeSeriesEntry[];
}

export interface CampaignAnalyticsSummary {
  totals: MetricTotal[];
  byCreator?: { creatorId: string; name: string; value: number }[];
  timeSeries: TimeSeriesEntry[];
}

export interface ContentAnalyticsSummary {
  totals: MetricTotal[];
  timeSeries: TimeSeriesEntry[];
}

export interface AnalyticsSummaryFilters {
  startDate?: string;
  endDate?: string;
  platform?: string;
}

export interface CampaignAnalyticsFilters extends AnalyticsSummaryFilters {
  campaignId: string;
}

export interface ContentAnalyticsFilters extends AnalyticsSummaryFilters {
  publishedPostId: string;
}

export interface ExportData {
  scope: AnalyticsScope;
  scopeId: string;
  startDate?: string;
  endDate?: string;
  format: ExportFormat;
}

export interface ExportResponse {
  downloadUrl: string;
  expiresAt: string;
}

export interface IngestMetric {
  metricType: AnalyticsMetric;
  value: number;
}

export interface IngestMetricsData {
  publishedPostId: string;
  creatorProfileId: string;
  campaignId?: string;
  platform: string;
  metrics: IngestMetric[];
}

export interface IngestMetricsResponse {
  ingested: number;
}
