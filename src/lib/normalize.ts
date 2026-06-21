import { CreatorProfile } from '../types/auth';
import {
  Campaign,
  RawCampaign,
  RawCampaignListResponse,
  CampaignListResponse,
  CampaignApplication,
  RawCampaignApplication,
  Proposal,
  RawProposal,
} from '../types/campaign.types';
import { Contract, RawContract } from '../types/contract.types';

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

// Backend returns budgetMin/budgetMax as decimal strings and nullable fields as
// null rather than undefined; the rest of the app works with plain numbers.
export function normalizeCampaign(raw: RawCampaign): Campaign {
  const { description, audience, messaging, tone, startDate, endDate, brief, budgetMin, budgetMax, _count, brandProfile, ...rest } = raw;

  return {
    ...rest,
    description: description ?? undefined,
    audience: audience ?? undefined,
    messaging: messaging ?? undefined,
    tone: tone ?? undefined,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    brief: brief ?? undefined,
    budgetMin: Number(budgetMin),
    budgetMax: Number(budgetMax),
    applicationCount: _count?.applications ?? 0,
    brandProfile: brandProfile ? { ...brandProfile, logo: brandProfile.logo ?? undefined } : undefined,
  };
}

export function normalizeCampaignList(raw: RawCampaignListResponse): CampaignListResponse {
  return { items: raw.items.map(normalizeCampaign), total: raw.total, page: raw.page, limit: raw.limit };
}

// proposedRate is a decimal string from the backend like budgetMin/budgetMax above.
export function normalizeApplication(raw: RawCampaignApplication): CampaignApplication {
  const { proposedRate, currency, creatorProfile, ...rest } = raw;

  return {
    ...rest,
    proposedRate: proposedRate != null ? Number(proposedRate) : undefined,
    currency: currency ?? undefined,
    creatorProfile: creatorProfile
      ? { ...creatorProfile, bio: creatorProfile.bio ?? undefined, avatar: creatorProfile.avatar ?? undefined }
      : undefined,
  };
}

export function normalizeApplicationList(raw: RawCampaignApplication[]): CampaignApplication[] {
  return raw.map(normalizeApplication);
}

// totalAmount is a decimal string from the backend like budgetMin/budgetMax above.
export function normalizeContract(raw: RawContract): Contract {
  const { startDate, endDate, totalAmount, additionalTerms, brandSignedAt, creatorSignedAt, ...rest } = raw;

  return {
    ...rest,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    totalAmount: Number(totalAmount),
    additionalTerms: additionalTerms ?? undefined,
    brandSignedAt: brandSignedAt ?? undefined,
    creatorSignedAt: creatorSignedAt ?? undefined,
  };
}

// proposedRate is a decimal string from the backend like budgetMin/budgetMax above.
export function normalizeProposal(raw: RawProposal): Proposal {
  const { proposedRate, currency, timeline, coverLetter, submittedAt, ...rest } = raw;

  return {
    ...rest,
    proposedRate: proposedRate != null ? Number(proposedRate) : undefined,
    currency: currency ?? undefined,
    timeline: timeline ?? undefined,
    coverLetter: coverLetter ?? undefined,
    submittedAt: submittedAt ?? undefined,
  };
}
