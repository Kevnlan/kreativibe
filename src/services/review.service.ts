import { apiClient } from '../lib/api-client';
import {
  Review,
  ReviewListResponse,
  ReviewListFilters,
  CreateReviewData,
  RespondReviewData,
  DeleteReviewData,
} from '../types/api-contracts/review.types';

export const reviewService = {
  async create(data: CreateReviewData): Promise<Review> {
    return apiClient.post('/reviews/create', data);
  },

  async list(filters: ReviewListFilters): Promise<ReviewListResponse> {
    return apiClient.post('/reviews/list', filters);
  },

  async myReviews(filters?: { page?: number; limit?: number }): Promise<ReviewListResponse> {
    return apiClient.post('/reviews/mine', filters ?? {});
  },

  async respond(data: RespondReviewData): Promise<Review> {
    return apiClient.post('/reviews/respond', data);
  },

  async adminDelete(data: DeleteReviewData): Promise<void> {
    return apiClient.post('/admin/reviews/delete', data);
  },
};
