import { apiClient } from '../lib/api-client';
import { Post, PostFilters } from '../types/post.types';
import { PaginatedResponse } from '../types/api.types';

export const marketplaceService = {
  async getPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    return apiClient.get('/marketplace/posts', filters);
  },

  async getPostById(id: string): Promise<Post> {
    return apiClient.get(`/marketplace/posts/${id}`);
  },

  async likePost(id: string): Promise<void> {
    return apiClient.post(`/marketplace/posts/${id}/like`);
  },

  async messageCreator(creatorId: string, postId: string, message: string): Promise<void> {
    return apiClient.post('/messages', { creatorId, postId, message });
  },
};
