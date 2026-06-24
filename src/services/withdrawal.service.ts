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
    return apiClient.post('/withdrawals/get', { id });
  },

  async createWithdrawal(data: CreateWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post('/withdrawals/create', data);
  },

  async cancelWithdrawal(id: string): Promise<void> {
    return apiClient.post('/withdrawals/cancel', { id });
  },

  async approveWithdrawal(id: string, data?: ApproveWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post('/admin/withdrawals/approve', { id, ...data });
  },

  async rejectWithdrawal(id: string, data: RejectWithdrawalRequest): Promise<WithdrawalRequest> {
    return apiClient.post('/admin/withdrawals/reject', { id, ...data });
  },

  async processWithdrawal(id: string): Promise<WithdrawalRequest> {
    return apiClient.post('/admin/withdrawals/process', { id });
  },
};
