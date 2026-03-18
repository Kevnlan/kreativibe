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
    return apiClient.get('/wallet/balance');
  },

  async getTransactions(filters?: TransactionFilters): Promise<TransactionListResponse> {
    return apiClient.get('/wallet/transactions', filters);
  },

  async topUpWallet(data: TopUpRequest): Promise<TopUpResponse> {
    return apiClient.post('/wallet/topup', data);
  },

  async exportTransactions(filters?: TransactionFilters): Promise<Blob> {
    return apiClient.get('/wallet/transactions/export', filters);
  },
};
