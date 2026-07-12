import { apiClient } from '../lib/api-client';
import {
  UserSettings,
  UpdateSettingsData,
} from '../types/api-contracts/settings.types';

export const settingsService = {
  async get(): Promise<UserSettings> {
    return apiClient.post('/settings/get', {});
  },

  async update(data: UpdateSettingsData): Promise<UserSettings> {
    return apiClient.post('/settings/update', data);
  },

  async reset(): Promise<UserSettings> {
    return apiClient.post('/settings/reset', {});
  },
};
