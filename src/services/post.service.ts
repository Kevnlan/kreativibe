import { apiClient } from '../lib/api-client';
import { Post, CreatePostData, PostFilters, PostStatus } from '../types/post.types';
import { PaginatedResponse } from '../types/api.types';

export const postService = {
  async getPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    return apiClient.get('/posts', filters);
  },

  async getMyPosts(filters?: Omit<PostFilters, 'creatorId'>): Promise<PaginatedResponse<Post>> {
    return apiClient.get('/posts/me', filters);
  },

  async getPostById(id: string): Promise<Post> {
    return apiClient.get(`/posts/${id}`);
  },

  async createPost(data: CreatePostData): Promise<Post> {
    return apiClient.post('/posts', data);
  },

  async updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
    return apiClient.put(`/posts/${id}`, data);
  },

  async updatePostStatus(id: string, status: PostStatus): Promise<Post> {
    return apiClient.put(`/posts/${id}/status`, { status });
  },

  async deletePost(id: string): Promise<void> {
    return apiClient.delete(`/posts/${id}`);
  },
};
