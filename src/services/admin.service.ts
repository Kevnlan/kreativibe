import { apiClient } from '../lib/api-client';
import { PaginatedResponse } from '../types/api.types';

export interface AdminCreator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  joinedAt: string;
  kyc: {
    status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    iprsStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
    kraStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
    nationalId?: string;
    kraPin?: string;
    phone?: string;
    city?: string;
    adminComments?: string;
    submittedAt?: string;
  };
}

export interface AdminBrand {
  id: string;
  name: string;
  email: string;
  companyName: string;
  industry?: string;
  isActive: boolean;
  joinedAt: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface KycReviewData {
  status: 'VERIFIED' | 'REJECTED';
  adminComments?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  pendingKyc: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return apiClient.get('/admin/stats');
  },

  async getCreators(params?: { page?: number; limit?: number; query?: string; kycStatus?: string }): Promise<PaginatedResponse<AdminCreator>> {
    return apiClient.get('/admin/creators', params);
  },

  async getCreatorById(id: string): Promise<AdminCreator> {
    return apiClient.get(`/admin/creators/${id}`);
  },

  async reviewKyc(userId: string, data: KycReviewData): Promise<void> {
    return apiClient.put(`/admin/kyc/${userId}`, data);
  },

  async toggleUser(userId: string): Promise<{ isActive: boolean }> {
    return apiClient.put(`/admin/users/${userId}/toggle`);
  },

  async getBrands(params?: { page?: number; limit?: number; query?: string }): Promise<PaginatedResponse<AdminBrand>> {
    return apiClient.get('/admin/brands', params);
  },

  async getTransactions(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<any>> {
    return apiClient.get('/admin/transactions', params);
  },

  async getUsers(params?: { page?: number; limit?: number; query?: string; role?: string }): Promise<PaginatedResponse<any>> {
    return apiClient.get('/admin/users', params);
  },
};
