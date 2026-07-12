export type ReviewSubjectType = 'CREATOR' | 'BRAND';

export interface ReviewReviewer {
  id: string;
  name: string;
  role: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  subjectId: string;
  subjectType: ReviewSubjectType;
  campaignId: string | null;
  rating: number;
  title: string;
  body: string;
  response: string | null;
  respondedAt: string | null;
  isPublic: boolean;
  reviewer?: ReviewReviewer;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface ReviewListFilters {
  subjectId?: string;
  subjectType?: ReviewSubjectType;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface CreateReviewData {
  subjectId: string;
  subjectType: ReviewSubjectType;
  campaignId?: string;
  rating: number;
  title: string;
  body: string;
}

export interface RespondReviewData {
  reviewId: string;
  response: string;
}

export interface DeleteReviewData {
  reviewId: string;
  reason: string;
}
