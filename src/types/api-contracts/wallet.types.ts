export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'CREDIT' | 'DEBIT' | 'COMMISSION' | 'REFUND' | 'WITHDRAWAL' | 'TOPUP';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  reference?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}

export interface WalletBalanceResponse {
  wallet: Wallet;
  recentTransactions: Transaction[];
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionFilters {
  type?: Transaction['type'];
  status?: Transaction['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TopUpRequest {
  amount: number;
  paymentMethod: 'MPESA' | 'CARD' | 'BANK';
  reference?: string;
}

export interface TopUpResponse {
  transactionId: string;
  amount: number;
  status: string;
  paymentUrl?: string;
}
