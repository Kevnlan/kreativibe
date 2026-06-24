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
    return apiClient.post('/contents/get', { id });
  },

  async createContent(data: CreateContentData): Promise<Content> {
    return apiClient.post('/contents/create', data);
  },

  async updateContent(id: string, data: UpdateContentData): Promise<Content> {
    return apiClient.post('/contents/update', { id, ...data });
  },

  async deleteContent(id: string): Promise<void> {
    return apiClient.post('/contents/delete', { id });
  },

  async duplicateContent(id: string): Promise<Content> {
    return apiClient.post('/contents/duplicate', { id });
  },

  async getContentVersions(id: string): Promise<{ versions: ContentVersion[] }> {
    return apiClient.post('/contents/versions/list', { id });
  },

  async adviseContentStrategy(data: ContentAdviceRequest): Promise<ContentAdviceResponse> {
    return apiClient.post('/contents/optimize/advise', data);
  },
};
