import { apiClient } from '../lib/api-client';

export interface BrandProfileData {
  companyName: string;
  industry: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  contactEmail: string;
  registrationNumber?: string;
  contactPersonName: string;
  contactPersonId: string;
  contactPersonRole: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  registrationCertUrl?: string;
  taxComplianceUrl?: string;
}

export interface BrandProfile extends BrandProfileData {
  id: string;
  userId: string;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface BrandDashboardStats {
  activeCampaigns: number;
  totalSpent: number;
  creatorsEngaged: number;
  avgEngagement: number;
  pendingOrders: number;
  completedCampaigns: number;
}

export interface BrandSummary {
  id: string;
  companyName: string;
  logo?: string;
  industry: string;
  isVerified: boolean;
  description: string;
  location?: string;
  niches: string[];
  activeCampaigns: number;
  budgetMin: number;
  budgetMax: number;
}

export interface BrowseBrandsFilters {
  search?: string;
  industry?: string;
  niche?: string;
  page?: number;
  limit?: number;
}

export interface BrowseBrandsResponse {
  items: BrandSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface BrandPublicProfile {
  id: string;
  companyName: string;
  logo?: string;
  coverImage?: string;
  industry: string;
  isVerified: boolean;
  description: string;
  website?: string;
  activeCampaigns: { id: string; title: string; budgetMin: number; budgetMax: number; platforms: string[] }[];
}

export const brandService = {
  async submitBrandProfile(data: BrandProfileData): Promise<{ message: string }> {
    return apiClient.post('/brand/profile', data);
  },

  async getBrandProfile(): Promise<BrandProfile> {
    return apiClient.get('/brand/profile');
  },

  async updateBrandProfile(data: Partial<BrandProfileData>): Promise<BrandProfile> {
    return apiClient.put('/brand/profile', data);
  },

  async getDashboardStats(): Promise<BrandDashboardStats> {
    return apiClient.get('/brand/dashboard');
  },

  async getAllBrands(params?: { page?: number; limit?: number; query?: string }): Promise<any> {
    return apiClient.get('/brands', params);
  },

  // Creator-side discovery — only returns brands with at least one ACTIVE campaign.
  async browseBrands(filters?: BrowseBrandsFilters): Promise<BrowseBrandsResponse> {
    return apiClient.post('/brands/browse', filters ?? {});
  },

  async getBrandPublicProfile(brandProfileId: string): Promise<BrandPublicProfile> {
    return apiClient.post(`/brands/${brandProfileId}/get`, {});
  },
};
