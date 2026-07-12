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
    const raw = await apiClient.post<WalletBalanceResponse>('/wallet/balance', {});
    const w = raw.wallet;
    return {
      wallet: {
        ...w,
        balance: Number(w.balance) || 0,
        pendingBalance: Number(w.pendingBalance) || 0,
        totalEarnings: Number(w.totalEarnings) || 0,
        totalWithdrawals: Number(w.totalWithdrawals) || 0,
      },
      recentTransactions: Array.isArray(raw.recentTransactions) ? raw.recentTransactions : [],
    };
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
