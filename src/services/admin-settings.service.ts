import { apiClient } from '../lib/api-client';

export interface SystemSettings {
  currency: string;
  taxRate: number;
  payoutMethods: string[];
  platformFee: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  taxRate: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'SMS' | 'EMAIL';
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminSettingsService = {
  async getSettings(): Promise<SystemSettings> {
    return apiClient.get('/admin/settings');
  },

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    return apiClient.put('/admin/settings', data);
  },

  async getCountries(): Promise<Country[]> {
    const res = await apiClient.post<{ countries: Country[]; total: number }>('/countries/list', {});
    return res.countries;
  },

  async addCountry(data: Omit<Country, 'id'>): Promise<Country> {
    return apiClient.post('/admin/countries/create', data);
  },

  async removeCountry(id: string): Promise<void> {
    return apiClient.post(`/admin/countries/${id}/delete`, {});
  },

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return apiClient.get('/admin/notifications');
  },

  async createNotificationTemplate(data: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    return apiClient.post('/admin/notifications', data);
  },

  async updateNotificationTemplate(id: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    return apiClient.put(`/admin/notifications/${id}`, data);
  },
};
