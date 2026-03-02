export type KycStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface SocialLink {
  platform: string;
  handle: string;
  followers?: number;
  url?: string;
}

export interface CreatorKyc {
  id: string;
  creatorId: string;
  nationalId?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  kraPin?: string;
  kraCertUrl?: string;
  phone?: string;
  city?: string;
  dateOfBirth?: string;
  iprsStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
  kraStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
  status: KycStatus;
  adminComments?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface CreatorProfileFull {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  instagram?: string;
  instagramFollowers?: number;
  tiktok?: string;
  tiktokFollowers?: number;
  youtube?: string;
  youtubeFollowers?: number;
  facebook?: string;
  twitter?: string;
  behance?: string;
  isVerified: boolean;
  verificationStatus: KycStatus;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  pricing: {
    instagramStory?: number;
    instagramPost?: number;
    instagramReel?: number;
    tiktokVideo?: number;
    youtubeShort?: number;
    youtubeVideo?: number;
  };
  kyc?: CreatorKyc;
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfileFull {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  phone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  country?: string;
  countryId?: string;
  isVerified: boolean;
  verificationStatus: KycStatus;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCreatorProfileData {
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  instagramFollowers?: number;
  tiktok?: string;
  tiktokFollowers?: number;
  youtube?: string;
  youtubeFollowers?: number;
  facebook?: string;
  twitter?: string;
  behance?: string;
  pricing?: {
    instagramStory?: number;
    instagramPost?: number;
    instagramReel?: number;
    tiktokVideo?: number;
    youtubeShort?: number;
    youtubeVideo?: number;
  };
}

export interface UpdateBrandProfileData {
  companyName?: string;
  industry?: string;
  description?: string;
  website?: string;
  phone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  country?: string;
  countryId?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
}

export interface KycSubmitData {
  nationalId?: string;
  idFrontUrl: string;
  idBackUrl: string;
  kraPin?: string;
  kraCertUrl: string;
  phone: string;
  city: string;
  dateOfBirth?: string;
  instagram: string;
  instagramFollowers: number;
  tiktok: string;
  tiktokFollowers: number;
  youtube?: string;
  youtubeFollowers?: number;
  facebook?: string;
  twitter?: string;
  behance?: string;
  termsAccepted: boolean;
}

export interface BrandOnboardingData {
  companyName: string;
  industry: string;
  description: string;
  address: string;
  city: string;
  country: string;
  countryId: string;
  website?: string;
  phone: string;
  contactEmail: string;
  logo?: string;
  coverImage?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  termsAccepted: boolean;
}
