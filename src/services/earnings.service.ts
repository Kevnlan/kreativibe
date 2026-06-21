import { apiClient } from '../lib/api-client';
import { EarningsSummary, DashboardSummary } from '../types/earnings.types';

export const earningsService = {
  // contentSales/topPerformingContent stay empty until the Offer/ContentLicense purchase
  // flow writes to the wallet ledger — customRequests (CampaignMilestone credits) is the
  // only real money-in path wired up so far.
  async getSummary(): Promise<EarningsSummary> {
    return apiClient.post('/earnings/summary', {});
  },
};

export const dashboardService = {
  async getCreatorSummary(): Promise<DashboardSummary> {
    return apiClient.post('/creator/dashboard/summary', {});
  },
};
