import { apiClient } from '../lib/api-client';
import {
  Content,
  CreateContentData,
  UpdateContentData,
  ContentFilters,
  ContentVersion,
  ContentAdviceRequest,
  ContentAdviceResponse,
} from '../types/api-contracts/content.types';
import { PaginatedResponse } from '../types/api.types';

export const contentService = {
  // Marketplace-wide content listing — not yet covered by a confirmed backend contract.
  async getContents(filters?: ContentFilters): Promise<PaginatedResponse<Content>> {
    return apiClient.get('/contents', filters);
  },

  async getMyContents(filters?: Omit<ContentFilters, 'creatorId'>): Promise<PaginatedResponse<Content> & { stats: { total: number; published: number; draft: number; underReview: number; totalRevenue: number } }> {
    return apiClient.post('/contents/me/list', filters ?? {});
  },

  async getContentById(id: string): Promise<Content> {
    return apiClient.post(`/contents/${id}/get`, {});
  },

  async createContent(data: CreateContentData): Promise<Content> {
    return apiClient.post('/contents/create', data);
  },

  async updateContent(id: string, data: UpdateContentData): Promise<Content> {
    return apiClient.post(`/contents/${id}/update`, data);
  },

  async deleteContent(id: string): Promise<void> {
    return apiClient.post(`/contents/${id}/delete`, {});
  },

  async duplicateContent(id: string): Promise<Content> {
    return apiClient.post(`/contents/${id}/duplicate`, {});
  },

  async getContentVersions(id: string): Promise<{ versions: ContentVersion[] }> {
    return apiClient.post(`/contents/${id}/versions/list`, {});
  },

  async adviseContentStrategy(data: ContentAdviceRequest): Promise<ContentAdviceResponse> {
    return apiClient.post('/contents/optimize/advise', data);
  },
};
