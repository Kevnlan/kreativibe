import { apiClient } from '../lib/api-client';
import { Post, PostFilters } from '../types/post.types';
import { PaginatedResponse } from '../types/api.types';

export interface MarketplaceContentItem {
  id: string;
  creatorProfileId: string;
  title: string;
  description?: string;
  type: string;
  platforms: string[];
  status: string;
  thumbnailUrl?: string;
  coverImage?: string;
  price: number;
  currency: string;
  creatorProfile?: {
    id: string;
    bio?: string;
    avatar?: string;
    isVerified: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
}

export interface MarketplaceBrowseFilters {
  type?: string;
  platform?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MarketplaceBrowseResponse {
  items: MarketplaceContentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface PublicContent {
  id: string;
  creatorProfileId: string;
  title: string;
  description?: string;
  type: string;
  platforms: string[];
  status: string;
  thumbnailUrl?: string;
  price: number;
  currency: string;
  creatorProfile?: {
    id: string;
    bio?: string;
    avatar?: string;
    isVerified: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
}

export const marketplaceService = {
  // ── Phase 2: Content marketplace ──
  async browse(filters?: MarketplaceBrowseFilters): Promise<MarketplaceBrowseResponse> {
    return apiClient.post('/marketplace/browse', filters ?? {});
  },

  async getPublicContent(id: string): Promise<PublicContent> {
    return apiClient.post('/marketplace/get', { id });
  },

  // ── Legacy endpoints ──
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
