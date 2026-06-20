import { apiClient } from '../lib/api-client';
import { normalizeCreatorProfile, RawCreatorProfile } from '../lib/normalize';
import { CreatorProfileFull, BrandProfileFull, UpdateCreatorProfileData, UpdateBrandProfileData, KycSubmitData, BrandOnboardingData } from '../types/profile.types';

export const profileService = {
  async getCreatorProfile(): Promise<CreatorProfileFull> {
    const raw = await apiClient.get<RawCreatorProfile>('/creator/profile');
    return normalizeCreatorProfile(raw) as unknown as CreatorProfileFull;
  },

  async updateCreatorProfile(data: UpdateCreatorProfileData): Promise<CreatorProfileFull> {
    const raw = await apiClient.put<RawCreatorProfile>('/creator/profile', data);
    return normalizeCreatorProfile(raw) as unknown as CreatorProfileFull;
  },

  async getBrandProfile(): Promise<BrandProfileFull> {
    return apiClient.get('/brand/profile');
  },

  async updateBrandProfile(data: UpdateBrandProfileData): Promise<BrandProfileFull> {
    return apiClient.put('/brand/profile', data);
  },

  async uploadAvatar(file: File, onProgress?: (p: number) => void): Promise<{ url: string }> {
    return apiClient.uploadFile(file, onProgress);
  },
};

export const kycService = {
  async submitKyc(data: KycSubmitData): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/kyc/submit', data);
  },

  async getKycStatus(): Promise<{ status: string; adminComments?: string }> {
    return apiClient.get('/kyc/status');
  },
};

export const brandOnboardingService = {
  async submitBrandProfile(data: BrandOnboardingData): Promise<BrandProfileFull> {
    return apiClient.post('/brand/profile', data);
  },
};
