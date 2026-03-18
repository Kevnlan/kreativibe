import { Country } from '@/types/api-contracts/country.types';
import { Wallet, Transaction } from '@/types/api-contracts/wallet.types';
import { WithdrawalRequest } from '@/types/api-contracts/withdrawal.types';
import { SocialAccount } from '@/types/api-contracts/social.types';

// Simple UUID generator for mock data
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Random number between min and max
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random element from array
function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

// Random date in the past
function randomPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  return date.toISOString();
}

// Country generator
export function generateCountry(overrides?: Partial<Country>): Country {
  const countries = [
    { name: 'Kenya', code: 'KE', currency: 'KES' },
    { name: 'Uganda', code: 'UG', currency: 'UGX' },
    { name: 'Tanzania', code: 'TZ', currency: 'TZS' },
  ];
  
  const country = randomElement(countries);
  
  return {
    id: generateId(),
    name: country.name,
    code: country.code,
    currency: country.currency,
    taxRate: 15,
    isActive: true,
    config: {
      kycRules: [
        {
          fieldName: 'nationalId',
          fieldType: 'text',
          label: 'National ID Number',
          required: true,
          validationRules: { minLength: 6, maxLength: 20 },
          apiValidation: { provider: 'IPRS', endpoint: '/api/iprs/verify' }
        },
        {
          fieldName: 'kraPin',
          fieldType: 'text',
          label: 'KRA PIN',
          required: true,
          validationRules: { pattern: '^[A-Z][0-9]{9}[A-Z]$' },
          apiValidation: { provider: 'KRA', endpoint: '/api/kra/verify' }
        }
      ],
      payoutMethods: [
        {
          type: 'MPESA',
          minAmount: 100,
          maxAmount: 150000,
          fee: 50,
          feeType: 'FIXED',
          processingTime: '1-2 hours',
          isActive: true
        },
        {
          type: 'BANK',
          minAmount: 150000,
          maxAmount: 10000000,
          fee: 2,
          feeType: 'PERCENTAGE',
          processingTime: '1-3 business days',
          isActive: true
        }
      ],
      taxRules: [
        { name: 'Withholding Tax', rate: 5, type: 'WITHHOLDING' },
        { name: 'VAT', rate: 16, type: 'VAT' }
      ],
      currencies: [country.currency],
      minWithdrawalAmount: 100,
      maxWithdrawalAmount: 10000000
    },
    createdAt: randomPastDate(365),
    updatedAt: randomPastDate(30),
    ...overrides
  };
}

// Wallet generator
export function generateWallet(userId: string, overrides?: Partial<Wallet>): Wallet {
  const balance = randomInt(0, 500000);
  const totalEarnings = randomInt(balance, 1000000);
  
  return {
    id: generateId(),
    userId,
    balance,
    currency: 'KES',
    pendingBalance: randomInt(0, 50000),
    totalEarnings,
    totalWithdrawals: totalEarnings - balance,
    createdAt: randomPastDate(365),
    updatedAt: randomPastDate(1),
    ...overrides
  };
}

// Transaction generator
export function generateTransaction(walletId: string, overrides?: Partial<Transaction>): Transaction {
  const types: Transaction['type'][] = ['CREDIT', 'DEBIT', 'COMMISSION', 'WITHDRAWAL', 'TOPUP'];
  const statuses: Transaction['status'][] = ['COMPLETED', 'PENDING', 'FAILED'];
  
  return {
    id: generateId(),
    walletId,
    type: randomElement(types),
    amount: randomInt(100, 50000),
    currency: 'KES',
    status: randomElement(statuses),
    description: 'Transaction description',
    reference: `TXN${randomInt(100000, 999999)}`,
    createdAt: randomPastDate(90),
    completedAt: randomPastDate(89),
    ...overrides
  };
}

// Withdrawal request generator
export function generateWithdrawalRequest(userId: string, overrides?: Partial<WithdrawalRequest>): WithdrawalRequest {
  const amount = randomInt(1000, 100000);
  const fee = amount < 150000 ? 50 : amount * 0.02;
  const methods: WithdrawalRequest['method'][] = ['MPESA', 'BANK'];
  const statuses: WithdrawalRequest['status'][] = ['PENDING', 'PROCESSING', 'APPROVED', 'COMPLETED', 'REJECTED'];
  const method = randomElement(methods);
  
  return {
    id: generateId(),
    userId,
    amount,
    currency: 'KES',
    method,
    status: randomElement(statuses),
    accountDetails: method === 'MPESA' 
      ? { phoneNumber: '+254712345678', accountName: 'John Doe' }
      : { bankName: 'Equity Bank', accountNumber: '1234567890', accountName: 'John Doe', branchCode: '068' },
    fee,
    netAmount: amount - fee,
    createdAt: randomPastDate(30),
    processedAt: randomPastDate(29),
    ...overrides
  };
}

// Social account generator
export function generateSocialAccount(userId: string, overrides?: Partial<SocialAccount>): SocialAccount {
  const platforms: SocialAccount['platform'][] = ['INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'YOUTUBE', 'TWITTER'];
  const platform = randomElement(platforms);
  
  return {
    id: generateId(),
    userId,
    platform,
    platformUserId: `${platform.toLowerCase()}_${randomInt(100000, 999999)}`,
    username: `user_${randomInt(1000, 9999)}`,
    displayName: 'User Name',
    profileImage: `https://i.pravatar.cc/150?u=${generateId()}`,
    accessToken: `token_${generateId()}`,
    refreshToken: `refresh_${generateId()}`,
    tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['read', 'write', 'publish'],
    isActive: true,
    lastSyncedAt: randomPastDate(7),
    createdAt: randomPastDate(180),
    updatedAt: randomPastDate(7),
    ...overrides
  };
}

// Generate multiple items
export function generateCountries(count: number): Country[] {
  return Array.from({ length: count }, () => generateCountry());
}

export function generateTransactions(walletId: string, count: number): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction(walletId));
}

export function generateWithdrawalRequests(userId: string, count: number): WithdrawalRequest[] {
  return Array.from({ length: count }, () => generateWithdrawalRequest(userId));
}

export function generateSocialAccounts(userId: string, count: number): SocialAccount[] {
  return Array.from({ length: count }, () => generateSocialAccount(userId));
}
