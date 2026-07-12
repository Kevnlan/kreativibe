import { apiClient } from '../lib/api-client';
import {
  NotificationListResponse,
  NotificationListFilters,
  MarkReadResponse,
} from '../types/api-contracts/notification.types';

export const notificationService = {
  async list(filters?: NotificationListFilters): Promise<NotificationListResponse> {
    return apiClient.post('/notifications/list', filters ?? {});
  },

  async markRead(id: string): Promise<void> {
    return apiClient.post('/notifications/mark-read', { id });
  },

  async markAllRead(): Promise<MarkReadResponse> {
    return apiClient.post('/notifications/mark-all-read', {});
  },

  async delete(id: string): Promise<void> {
    return apiClient.post('/notifications/delete', { id });
  },
};
