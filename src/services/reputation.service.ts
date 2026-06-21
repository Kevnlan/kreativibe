import { apiClient } from '../lib/api-client';
import { ReputationSummary, PointsHistoryResponse, Achievement } from '../types/reputation.types';

export const reputationService = {
  async getSummary(): Promise<ReputationSummary> {
    return apiClient.post('/reputation/summary', {});
  },

  async listPointsHistory(page = 1, limit = 20): Promise<PointsHistoryResponse> {
    return apiClient.post('/reputation/points/list', { page, limit });
  },

  // Progress is computed live each call; earnedAt freezes once a CreatorAchievement row is persisted.
  async listAchievements(): Promise<{ items: Achievement[] }> {
    return apiClient.post('/reputation/achievements/list', {});
  },
};
