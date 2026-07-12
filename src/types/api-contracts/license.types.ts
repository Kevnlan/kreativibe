export interface LicenseContentSummary {
  id: string;
  title: string;
  type: string;
  thumbnailUrl?: string;
  creatorProfile?: {
    id: string;
    bio?: string;
    avatar?: string;
  };
}

export interface LicenseOfferSummary {
  id: string;
  currentAmount: number;
  currency: string;
}

export interface License {
  id: string;
  contentId: string;
  brandUserId: string;
  offerId: string;
  issuedAt: string;
  licenseText: string;
  content?: LicenseContentSummary;
  offer?: LicenseOfferSummary;
}

export interface LicenseListResponse {
  items: License[];
  total: number;
  page: number;
  limit: number;
}

export interface LicenseListFilters {
  page?: number;
  limit?: number;
  brandUserId?: string;
}

export interface LicenseDownloadResponse {
  downloadUrl: string;
  expiresAt: string;
  contentTitle: string;
}

export interface LicenseVerifyResponse {
  valid: boolean;
  license: License;
  content: {
    id: string;
    title: string;
    type: string;
  };
}

export interface RevokeLicenseData {
  contentId: string;
  reason: string;
}

export interface RevokeLicenseResponse {
  id: string;
  contentId: string;
  revoked: boolean;
  reason: string;
}
