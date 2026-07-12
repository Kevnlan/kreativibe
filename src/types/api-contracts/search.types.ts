export type SearchSortBy = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popular';
export type RecommendationType = 'content' | 'creators' | 'campaigns';

export interface ContentSearchResult {
  id: string;
  title: string;
  type: string;
  price: number;
  currency: string;
  creatorProfile?: {
    id: string;
    avatar?: string;
    isVerified: boolean;
    averageRating: number;
  };
}

export interface CreatorSearchResult {
  id: string;
  name: string;
  avatar?: string;
  category?: string;
  isVerified: boolean;
  averageRating: number;
  totalFollowers?: number;
}

export interface CampaignSearchResult {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  currency: string;
  platform?: string;
  brandName?: string;
}

export interface SearchResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ContentSearchFilters {
  query: string;
  type?: string;
  platform?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SearchSortBy;
  page?: number;
  limit?: number;
}

export interface CreatorSearchFilters {
  query: string;
  category?: string;
  minRating?: number;
  isVerified?: boolean;
  sortBy?: SearchSortBy;
  page?: number;
  limit?: number;
}

export interface CampaignSearchFilters {
  query: string;
  status?: string;
  platform?: string;
  minBudget?: number;
  page?: number;
  limit?: number;
}

export interface RecommendationFilters {
  type: RecommendationType;
  limit?: number;
}
