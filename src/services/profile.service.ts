import { apiClient } from '../lib/api-client';
import { CreatorProfileFull, BrandProfileFull, UpdateCreatorProfileData, UpdateBrandProfileData, KycSubmitData, BrandOnboardingData } from '../types/profile.types';

export const profileService = {
  async getCreatorProfile(): Promise<CreatorProfileFull> {
    return apiClient.get('/creator/profile');
  },

  async updateCreatorProfile(data: UpdateCreatorProfileData): Promise<CreatorProfileFull> {
    return apiClient.put('/creator/profile', data);
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
