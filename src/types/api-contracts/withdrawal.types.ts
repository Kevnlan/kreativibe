export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'MPESA' | 'BANK';
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'FAILED';
  accountDetails: MPESADetails | BankDetails;
  fee: number;
  netAmount: number;
  adminComments?: string;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
}

export interface MPESADetails {
  phoneNumber: string;
  accountName: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  swiftCode?: string;
}

export interface CreateWithdrawalRequest {
  amount: number;
  method: 'MPESA' | 'BANK';
  accountDetails: MPESADetails | BankDetails;
}

export interface WithdrawalListResponse {
  withdrawals: WithdrawalRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface WithdrawalFilters {
  status?: WithdrawalRequest['status'];
  method?: WithdrawalRequest['method'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ApproveWithdrawalRequest {
  adminComments?: string;
}

export interface RejectWithdrawalRequest {
  rejectionReason: string;
  adminComments?: string;
}
