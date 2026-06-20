import { apiClient } from '../lib/api-client';
import { 
  WithdrawalRequest,
  WithdrawalListResponse,
  WithdrawalFilters,
  CreateWithdrawalRequest,
  ApproveWithdrawalRequest,
  RejectWithdrawalRequest
} from '../types/api-contracts/withdrawal.types';

export const withdrawalService = {
  async getWithdrawals(filters?: WithdrawalFilters): Promise<WithdrawalListResponse> {
    return apiClient.post('/withdrawals/list', filters ?? {});
  },

  async getWithdrawalById(id: string): Promise<WithdrawalRequest> {
    return apiClient.post(`/withdrawals/${id}/get`, {});
  },

  async createWithdrawal(data: CreateWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post('/withdrawals/create', data);
  },

  async cancelWithdrawal(id: string): Promise<void> {
    return apiClient.post(`/withdrawals/${id}/cancel`, {});
  },

  async approveWithdrawal(id: string, data?: ApproveWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post(`/admin/withdrawals/${id}/approve`, data ?? {});
  },

  async rejectWithdrawal(id: string, data: RejectWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post(`/admin/withdrawals/${id}/reject`, data);
  },

  async processWithdrawal(id: string): Promise<WithdrawalRequest> {
    return apiClient.post(`/admin/withdrawals/${id}/process`, {});
  },
};
