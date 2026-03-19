// Enhanced content types for content management module

export type ContentType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'BRAND_ASSET';

export type ContentFormat = 
  | 'IMAGE' 
  | 'VIDEO' 
  | 'CAROUSEL' 
  | 'REEL' 
  | 'STORY'
  | 'AUDIO'
  | 'BRAND_ASSET';

export type Platform = 
  | 'INSTAGRAM' 
  | 'TIKTOK' 
  | 'YOUTUBE' 
  | 'FACEBOOK' 
  | 'TWITTER' 
  | 'RADIO'
  | 'PRINT'
  | 'DIGITAL';

export type ContentCategory =
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

export type ContentStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PUBLISHED' 
  | 'SOLD' 
  | 'ARCHIVED';

export type ModerationStatus = 
  | 'PENDING' 
  | 'IN_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED';

export interface ContentMetadata {
  title: string;
  description?: string;
  category: ContentCategory;
  platforms: Platform[];
  tags?: string[];
  brand?: string;
  duration?: number; // for video/audio in seconds
  resolution?: string; // for video/image
  aspectRatio?: string;
  fileSize?: number;
  format?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  mediaUrls: string[];
  metadata: ContentMetadata;
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface Content {
  id: string;
  creatorId: string;
  type: ContentType;
  format: ContentFormat;
  metadata: ContentMetadata;
  coverImage?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  price: number;
  currency: string;
  status: ContentStatus;
  moderationStatus?: ModerationStatus;
  moderationNotes?: string;
  rejectionReason?: string;
  currentVersion: number;
  versions?: ContentVersion[];
  views: number;
  likes: number;
  purchases: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    isVerified: boolean;
  };
}

export interface CreateContentData {
  type: ContentType;
  format: ContentFormat;
  metadata: ContentMetadata;
  coverImage?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  price: number;
  currency?: string;
}

export interface UpdateContentData {
  metadata?: Partial<ContentMetadata>;
  coverImage?: string;
  mediaUrls?: string[];
  thumbnailUrl?: string;
  price?: number;
  status?: ContentStatus;
}

export interface ContentFilters {
  type?: ContentType;
  category?: ContentCategory;
  platform?: Platform;
  status?: ContentStatus;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  page?: number;
  limit?: number;
}

export interface ContentUploadStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

// Platform-specific requirements
export interface PlatformRequirements {
  platform: Platform;
  aspectRatios: string[];
  maxDuration?: number;
  maxFileSize: number;
  supportedFormats: string[];
}

export const PLATFORM_REQUIREMENTS: Record<Platform, PlatformRequirements> = {
  INSTAGRAM: {
    platform: 'INSTAGRAM',
    aspectRatios: ['1:1', '4:5', '9:16'],
    maxDuration: 60,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['jpg', 'png', 'mp4', 'mov'],
  },
  TIKTOK: {
    platform: 'TIKTOK',
    aspectRatios: ['9:16'],
    maxDuration: 180,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    supportedFormats: ['mp4', 'mov'],
  },
  YOUTUBE: {
    platform: 'YOUTUBE',
    aspectRatios: ['16:9', '9:16'],
    maxDuration: 600,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    supportedFormats: ['mp4', 'mov', 'avi'],
  },
  FACEBOOK: {
    platform: 'FACEBOOK',
    aspectRatios: ['1:1', '16:9', '9:16'],
    maxDuration: 240,
    maxFileSize: 200 * 1024 * 1024, // 200MB
    supportedFormats: ['jpg', 'png', 'mp4', 'mov'],
  },
  TWITTER: {
    platform: 'TWITTER',
    aspectRatios: ['16:9', '1:1'],
    maxDuration: 140,
    maxFileSize: 512 * 1024 * 1024, // 512MB
    supportedFormats: ['jpg', 'png', 'gif', 'mp4', 'mov'],
  },
  RADIO: {
    platform: 'RADIO',
    aspectRatios: [],
    maxDuration: 300,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: ['mp3', 'wav', 'aac'],
  },
  PRINT: {
    platform: 'PRINT',
    aspectRatios: ['A4', 'A3', 'custom'],
    maxFileSize: 20 * 1024 * 1024, // 20MB
    supportedFormats: ['jpg', 'png', 'pdf', 'ai', 'psd'],
  },
  DIGITAL: {
    platform: 'DIGITAL',
    aspectRatios: ['16:9', '1:1', '4:5'],
    maxFileSize: 20 * 1024 * 1024, // 20MB
    supportedFormats: ['jpg', 'png', 'gif', 'svg'],
  },
};
