import { apiClient } from '../lib/api-client';
import {
  CommunityPost,
  CommunityPostListResponse,
  CommunityPostFilters,
  CreatePostData,
  UpdatePostData,
  VotePostData,
  CommunityComment,
  CommentListResponse,
  CommentListFilters,
  CreateCommentData,
  VoteCommentData,
} from '../types/api-contracts/community.types';

export const communityService = {
  // ── Posts ──
  async listPosts(filters?: CommunityPostFilters): Promise<CommunityPostListResponse> {
    return apiClient.post('/community/posts/list', filters ?? {});
  },

  async getPost(id: string): Promise<CommunityPost> {
    return apiClient.post('/community/posts/get', { id });
  },

  async createPost(data: CreatePostData): Promise<CommunityPost> {
    return apiClient.post('/community/posts/create', data);
  },

  async updatePost(data: UpdatePostData): Promise<CommunityPost> {
    return apiClient.post('/community/posts/update', data);
  },

  async deletePost(id: string): Promise<void> {
    return apiClient.post('/community/posts/delete', { id });
  },

  async votePost(data: VotePostData): Promise<CommunityPost> {
    return apiClient.post('/community/posts/vote', data);
  },

  // ── Comments ──
  async listComments(filters: CommentListFilters): Promise<CommentListResponse> {
    return apiClient.post('/community/comments/list', filters);
  },

  async createComment(data: CreateCommentData): Promise<CommunityComment> {
    return apiClient.post('/community/comments/create', data);
  },

  async voteComment(data: VoteCommentData): Promise<CommunityComment> {
    return apiClient.post('/community/comments/vote', data);
  },

  async deleteComment(id: string): Promise<void> {
    return apiClient.post('/community/comments/delete', { id });
  },

  // ── Admin ──
  async pinPost(id: string): Promise<CommunityPost> {
    return apiClient.post('/admin/community/posts/pin', { id });
  },

  async lockPost(id: string): Promise<CommunityPost> {
    return apiClient.post('/admin/community/posts/lock', { id });
  },

  async adminDeletePost(id: string): Promise<void> {
    return apiClient.post('/admin/community/posts/delete', { id });
  },
};
