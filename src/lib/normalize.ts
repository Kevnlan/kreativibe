import { CreatorProfile } from '../types/auth';

export interface RawCreatorProfile {
  id: string;
  userId: string;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  location?: string | null;
  website?: string | null;
  instagram?: string | null;
  instagramFollowers?: number | null;
  tiktok?: string | null;
  tiktokFollowers?: number | null;
  youtube?: string | null;
  youtubeFollowers?: number | null;
  facebook?: string | null;
  twitter?: string | null;
  behance?: string | null;
  categories?: string[] | null;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  averageRating: number;
  totalReviews: number;
  totalEarnings?: string | number | null;
  pricingJson?: Record<string, number> | string | null;
  createdAt: string;
  updatedAt: string;
}

// Backend returns pricingJson (raw JSON column) and totalEarnings as a decimal
// string; the rest of the app works with a parsed `pricing` object and a number.
export function normalizeCreatorProfile(raw: RawCreatorProfile | null | undefined): CreatorProfile | null {
  if (!raw) return null;

  const { pricingJson, totalEarnings, categories, ...rest } = raw;

  let pricing: CreatorProfile['pricing'] = {};
  if (pricingJson) {
    pricing = typeof pricingJson === 'string' ? JSON.parse(pricingJson) : pricingJson;
  }

  return {
    ...rest,
    categories: categories ?? [],
    totalEarnings: totalEarnings != null ? Number(totalEarnings) : 0,
    pricing,
  } as CreatorProfile;
}
