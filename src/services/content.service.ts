import { apiClient } from '../lib/api-client';
import { Content, CreateContentData, UpdateContentData, ContentFilters, ContentStatus } from '../types/api-contracts/content.types';
import { PaginatedResponse } from '../types/api.types';

export const contentService = {
  async getContents(filters?: ContentFilters): Promise<PaginatedResponse<Content>> {
    return apiClient.get('/contents', filters);
  },

  async getMyContents(filters?: Omit<ContentFilters, 'creatorId'>): Promise<PaginatedResponse<Content>> {
    return apiClient.get('/contents/me', filters);
  },

  async getContentById(id: string): Promise<Content> {
    return apiClient.get(`/contents/${id}`);
  },

  async createContent(data: CreateContentData): Promise<Content> {
    return apiClient.post('/contents', data);
  },

  async updateContent(id: string, data: UpdateContentData): Promise<Content> {
    return apiClient.put(`/contents/${id}`, data);
  },

  async updateContentStatus(id: string, status: ContentStatus): Promise<Content> {
    return apiClient.put(`/contents/${id}/status`, { status });
  },

  async deleteContent(id: string): Promise<void> {
    return apiClient.delete(`/contents/${id}`);
  },

  async duplicateContent(id: string): Promise<Content> {
    return apiClient.post(`/contents/${id}/duplicate`);
  },

  async getContentVersions(id: string) {
    return apiClient.get(`/contents/${id}/versions`);
  },
};
