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

export interface PlatformStats {
  users: { total: number; creators: number; brands: number; admins: number; active: number };
  content: { total: number; approved: number; sold: number };
  offers: { total: number; accepted: number };
  campaigns: { total: number; active: number };
  revenue: { grossVolume: number; platformCommission: number };
  operations: { pendingWithdrawals: number; openTickets: number; pendingModeration: number };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPPORT_AGENT';
  isActive: boolean;
  isEmailVerified: boolean;
  isVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  countryId: string;
  createdAt: string;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserListFilters {
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetId: string;
  targetType: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuditLogListResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogFilters {
  action?: string;
  page?: number;
  limit?: number;
}

export interface CommissionUpdateData {
  rate: number;
  transactionType: 'PURCHASE' | 'OFFER' | 'WITHDRAWAL';
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return apiClient.get('/admin/stats');
  },

  async getPlatformStats(): Promise<PlatformStats> {
    return apiClient.post('/admin/stats', {});
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

  // ── Phase 4: User Management ──
  async listUsers(filters?: AdminUserListFilters): Promise<AdminUserListResponse> {
    return apiClient.post('/admin/users/list', filters ?? {});
  },

  async banUser(userId: string, reason: string): Promise<AdminUser> {
    return apiClient.post('/admin/users/ban', { userId, reason });
  },

  async suspendUser(userId: string, reason: string): Promise<AdminUser> {
    return apiClient.post('/admin/users/suspend', { userId, reason });
  },

  async reinstateUser(userId: string, reason: string): Promise<AdminUser> {
    return apiClient.post('/admin/users/reinstate', { userId, reason });
  },

  async verifyUser(userId: string, verified: boolean): Promise<AdminUser> {
    return apiClient.post('/admin/users/verify', { userId, verified });
  },

  // ── Phase 4: Content Management ──
  async removeContent(contentId: string, reason: string): Promise<void> {
    return apiClient.post('/admin/content/remove', { contentId, reason });
  },

  async featureContent(contentId: string, featured: boolean): Promise<void> {
    return apiClient.post('/admin/content/feature', { contentId, featured });
  },

  // ── Phase 4: Commission ──
  async updateCommission(data: CommissionUpdateData): Promise<void> {
    return apiClient.post('/admin/commission/update', data);
  },

  // ── Phase 4: Audit Logs ──
  async listAuditLogs(filters?: AuditLogFilters): Promise<AuditLogListResponse> {
    return apiClient.post('/admin/audit-logs/list', filters ?? {});
  },
};
