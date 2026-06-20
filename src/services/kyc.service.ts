import { apiClient } from '../lib/api-client';

export interface KycSubmissionData {
  nationalId: string;
  kraPin: string;
  phone: string;
  city: string;
  dateOfBirth: string;
  idFrontUrl: string;
  idBackUrl: string;
  kraCertUrl: string;
  bio: string;
  categories: string[];
  portfolioUrls?: string[];
  instagram?: string;
  instagramFollowers?: number;
  tiktok?: string;
  tiktokFollowers?: number;
  youtube?: string;
  youtubeFollowers?: number;
  facebook?: string;
  twitter?: string;
}

export interface KycStatus {
  status: 'NOT_SUBMITTED' | 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  iprsStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
  kraStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
  adminComments?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export const kycService = {
  async submitKyc(data: KycSubmissionData): Promise<{ message: string }> {
    return apiClient.post('/kyc/submit', data);
  },

  async getKycStatus(): Promise<KycStatus> {
    return apiClient.post('/kyc/status', {});
  },

  async resubmitKyc(data: Partial<KycSubmissionData>): Promise<{ message: string }> {
    return apiClient.post('/kyc/resubmit', data);
  },
};
