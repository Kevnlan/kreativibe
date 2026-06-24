import { apiClient } from '../lib/api-client';
import { ScheduledPost, CreateScheduledPostData, UpdateScheduledPostData } from '../types/api-contracts/scheduling.types';

export const schedulingService = {
  // Only valid for a campaign the creator has an ACCEPTED application on (404 otherwise).
  async listScheduledPosts(campaignId: string): Promise<{ posts: ScheduledPost[] }> {
    return apiClient.post('/campaigns/schedule/list', { campaignId });
  },

  async createScheduledPost(campaignId: string, data: CreateScheduledPostData): Promise<ScheduledPost> {
    return apiClient.post('/campaigns/schedule/create', { campaignId, ...data });
  },

  async updateScheduledPost(campaignId: string, postId: string, data: UpdateScheduledPostData): Promise<ScheduledPost> {
    return apiClient.post('/campaigns/schedule/update', { campaignId, postId, ...data });
  },

  async deleteScheduledPost(campaignId: string, postId: string): Promise<void> {
    return apiClient.post('/campaigns/schedule/delete', { campaignId, postId });
  },

  // STUBBED on the backend: flips status to PUBLISHED and fabricates a platformPostUrl.
  // Returns 409 SOCIAL_ACCOUNT_UNAVAILABLE if the linked social account is missing/inactive/expired.
  async publishNow(campaignId: string, postId: string): Promise<ScheduledPost> {
    return apiClient.post('/campaigns/schedule/publish-now', { campaignId, postId });
  },
};
