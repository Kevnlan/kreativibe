import { apiClient } from '../lib/api-client';
import { 
  Wallet,
  WalletBalanceResponse,
  TransactionListResponse,
  TransactionFilters,
  TopUpRequest,
  TopUpResponse
} from '../types/api-contracts/wallet.types';

export const walletService = {
  async getWalletBalance(): Promise<WalletBalanceResponse> {
    return apiClient.post('/wallet/balance', {});
  },

  async getTransactions(filters?: TransactionFilters): Promise<TransactionListResponse> {
    return apiClient.post('/wallet/transactions', filters ?? {});
  },

  async topUpWallet(data: TopUpRequest): Promise<TopUpResponse> {
    return apiClient.post('/wallet/topup', data);
  },

  async exportTransactions(filters?: TransactionFilters & { format?: 'CSV' | 'PDF' }): Promise<{ format: string; filename: string; content: string }> {
    return apiClient.post('/wallet/transactions/export', filters ?? {});
  },
};
