import { apiClient } from '../lib/api-client';
import {
  CreatorAnalyticsSummary,
  CampaignAnalyticsSummary,
  ContentAnalyticsSummary,
  AnalyticsSummaryFilters,
  CampaignAnalyticsFilters,
  ContentAnalyticsFilters,
  ExportData,
  ExportResponse,
  IngestMetricsData,
  IngestMetricsResponse,
} from '../types/api-contracts/analytics.types';

export const analyticsService = {
  // ── User-side ──
  async creatorSummary(filters?: AnalyticsSummaryFilters): Promise<CreatorAnalyticsSummary> {
    return apiClient.post('/analytics/creator/summary', filters ?? {});
  },

  async campaignSummary(filters: CampaignAnalyticsFilters): Promise<CampaignAnalyticsSummary> {
    return apiClient.post('/analytics/campaign/summary', filters);
  },

  async contentSummary(filters: ContentAnalyticsFilters): Promise<ContentAnalyticsSummary> {
    return apiClient.post('/analytics/content/summary', filters);
  },

  async export(data: ExportData): Promise<ExportResponse> {
    return apiClient.post('/analytics/export', data);
  },

  // ── Admin-side ──
  async ingestMetrics(data: IngestMetricsData): Promise<IngestMetricsResponse> {
    return apiClient.post('/admin/analytics/ingest', data);
  },
};
