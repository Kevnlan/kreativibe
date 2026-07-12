import { apiClient } from '../lib/api-client';
import {
  ModerationEntry,
  ModerationQueueResponse,
  ModerationQueueFilters,
  ApproveContentData,
  RejectContentData,
  ModerationRule,
  CreateModerationRuleData,
  UpdateModerationRuleData,
  CreatorModerationStatus,
} from '../types/api-contracts/moderation.types';

export const moderationService = {
  // ── Admin moderation ──
  async getQueue(filters?: ModerationQueueFilters): Promise<ModerationQueueResponse> {
    return apiClient.post('/admin/moderation/queue', filters ?? {});
  },

  async getEntry(id: string): Promise<ModerationEntry> {
    return apiClient.post('/admin/moderation/get', { id });
  },

  async assignToSelf(contentId: string): Promise<ModerationEntry> {
    return apiClient.post('/admin/moderation/assign', { contentId });
  },

  async approveContent(data: ApproveContentData): Promise<ModerationEntry> {
    return apiClient.post('/admin/moderation/approve', data);
  },

  async rejectContent(data: RejectContentData): Promise<ModerationEntry> {
    return apiClient.post('/admin/moderation/reject', data);
  },

  // ── Admin moderation rules ──
  async listRules(): Promise<{ items: ModerationRule[] }> {
    return apiClient.post('/admin/moderation/rules/list', {});
  },

  async createRule(data: CreateModerationRuleData): Promise<ModerationRule> {
    return apiClient.post('/admin/moderation/rules/create', data);
  },

  async updateRule(data: UpdateModerationRuleData): Promise<ModerationRule> {
    return apiClient.post('/admin/moderation/rules/update', data);
  },

  async deleteRule(id: string): Promise<void> {
    return apiClient.post('/admin/moderation/rules/delete', { id });
  },

  // ── Creator moderation ──
  async getStatus(contentId: string): Promise<CreatorModerationStatus> {
    return apiClient.post('/moderation/status', { contentId });
  },

  async resubmitContent(contentId: string): Promise<{ message: string }> {
    return apiClient.post('/moderation/resubmit', { contentId });
  },
};
