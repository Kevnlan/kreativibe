export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

export type PostFormat = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL' | 'STORY';

export type Platform = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'FACEBOOK' | 'TWITTER' | 'BEHANCE';

export type ContentNiche =
  | 'FASHION'
  | 'BEAUTY'
  | 'FOOD'
  | 'TRAVEL'
  | 'FITNESS'
  | 'TECH'
  | 'LIFESTYLE'
  | 'ENTERTAINMENT'
  | 'BUSINESS'
  | 'EDUCATION'
  | 'OTHER';

export interface Post {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  brand?: string;
  category: ContentNiche;
  format: PostFormat;
  platforms: Platform[];
  price: number;
  coverImage?: string;
  mediaUrls: string[];
  status: PostStatus;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
  };
}

export interface CreatePostData {
  title: string;
  description?: string;
  brand?: string;
  category: ContentNiche;
  format: PostFormat;
  platforms: Platform[];
  price: number;
  coverImage?: string;
  mediaUrls: string[];
}

export interface PostFilters {
  niche?: ContentNiche;
  platform?: Platform;
  minPrice?: number;
  maxPrice?: number;
  minFollowers?: number;
  status?: PostStatus;
  query?: string;
  page?: number;
  limit?: number;
}
