export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED' | 'COUNTERED';

export type OfferEventType = 'CREATED' | 'COUNTER' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface OfferEvent {
  id: string;
  offerId: string;
  actorId: string;
  eventType: OfferEventType;
  amount: number;
  message?: string;
  createdAt: string;
}

export interface OfferContentSummary {
  id: string;
  title: string;
  type: string;
  thumbnailUrl?: string;
  price?: number;
  status?: string;
}

export interface OfferBrandProfile {
  id: string;
  companyName: string;
  logo?: string;
  isVerified: boolean;
}

export interface OfferLicense {
  id: string;
  contentId: string;
  brandUserId: string;
  offerId: string;
  issuedAt: string;
  licenseText: string;
}

export interface Offer {
  id: string;
  contentId: string;
  brandProfileId: string;
  creatorProfileId: string;
  initialAmount: number;
  currentAmount: number;
  currency: string;
  status: OfferStatus;
  expiresAt: string;
  message?: string;
  events: OfferEvent[];
  content?: OfferContentSummary;
  brandProfile?: OfferBrandProfile;
  license?: OfferLicense | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferListResponse {
  items: Offer[];
  total: number;
  page: number;
  limit: number;
}

export interface OfferFilters {
  status?: OfferStatus;
  page?: number;
  limit?: number;
}

export interface CreateOfferData {
  contentId: string;
  amount: number;
  message?: string;
  expiresAt?: string;
}

export interface CounterOfferData {
  id: string;
  amount: number;
  message?: string;
}

export interface OfferActionData {
  id: string;
  message?: string;
}

export interface OfferHistoryResponse {
  events: OfferEvent[];
}
