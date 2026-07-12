import { Country } from '@/types/api-contracts/country.types';
import { Wallet, Transaction } from '@/types/api-contracts/wallet.types';
import { WithdrawalRequest } from '@/types/api-contracts/withdrawal.types';
import { SocialAccount } from '@/types/api-contracts/social.types';
import { 
  generateCountries, 
  generateWallet, 
  generateTransactions,
  generateWithdrawalRequests,
  generateSocialAccounts
} from './generators';

class MockDataStore {
  private countries: Country[] = [];
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();
  private withdrawals: Map<string, WithdrawalRequest[]> = new Map();
  private socialAccounts: Map<string, SocialAccount[]> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.countries = generateCountries(3);
  }

  getCountries(): Country[] {
    return this.countries;
  }

  getCountryById(id: string): Country | undefined {
    return this.countries.find(c => c.id === id);
  }

  addCountry(country: Country): void {
    this.countries.push(country);
  }

  updateCountry(id: string, updates: Partial<Country>): Country | undefined {
    const index = this.countries.findIndex(c => c.id === id);
    if (index !== -1) {
      this.countries[index] = { ...this.countries[index], ...updates };
      return this.countries[index];
    }
    return undefined;
  }

  deleteCountry(id: string): boolean {
    const index = this.countries.findIndex(c => c.id === id);
    if (index !== -1) {
      this.countries.splice(index, 1);
      return true;
    }
    return false;
  }

  getWallet(userId: string): Wallet {
    if (!this.wallets.has(userId)) {
      this.wallets.set(userId, generateWallet(userId));
    }
    return this.wallets.get(userId)!;
  }

  updateWalletBalance(userId: string, amount: number): Wallet {
    const wallet = this.getWallet(userId);
    wallet.balance = Number(wallet.balance) + amount;
    wallet.updatedAt = new Date().toISOString();
    return wallet;
  }

  getTransactions(userId: string): Transaction[] {
    if (!this.transactions.has(userId)) {
      const wallet = this.getWallet(userId);
      this.transactions.set(userId, generateTransactions(wallet.id, 20));
    }
    return this.transactions.get(userId)!;
  }

  addTransaction(userId: string, transaction: Transaction): void {
    const transactions = this.getTransactions(userId);
    transactions.unshift(transaction);
  }

  getWithdrawals(userId: string): WithdrawalRequest[] {
    if (!this.withdrawals.has(userId)) {
      this.withdrawals.set(userId, generateWithdrawalRequests(userId, 5));
    }
    return this.withdrawals.get(userId)!;
  }

  addWithdrawal(userId: string, withdrawal: WithdrawalRequest): void {
    const withdrawals = this.getWithdrawals(userId);
    withdrawals.unshift(withdrawal);
  }

  updateWithdrawal(userId: string, id: string, updates: Partial<WithdrawalRequest>): WithdrawalRequest | undefined {
    const withdrawals = this.getWithdrawals(userId);
    const index = withdrawals.findIndex(w => w.id === id);
    if (index !== -1) {
      withdrawals[index] = { ...withdrawals[index], ...updates };
      return withdrawals[index];
    }
    return undefined;
  }

  getSocialAccounts(userId: string): SocialAccount[] {
    if (!this.socialAccounts.has(userId)) {
      this.socialAccounts.set(userId, generateSocialAccounts(userId, 2));
    }
    return this.socialAccounts.get(userId)!;
  }

  addSocialAccount(userId: string, account: SocialAccount): void {
    const accounts = this.getSocialAccounts(userId);
    accounts.push(account);
  }

  removeSocialAccount(userId: string, accountId: string): boolean {
    const accounts = this.getSocialAccounts(userId);
    const index = accounts.findIndex(a => a.id === accountId);
    if (index !== -1) {
      accounts.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const mockStore = new MockDataStore();
