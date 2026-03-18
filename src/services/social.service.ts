import { apiClient } from '../lib/api-client';
import { 
  SocialAccount,
  SocialAccountListResponse,
  ConnectSocialAccountRequest,
  ConnectSocialAccountResponse,
  SocialAccountCallback,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SocialPlatform
} from '../types/api-contracts/social.types';

export const socialService = {
  async getAccounts(): Promise<SocialAccountListResponse> {
    return apiClient.get('/social/accounts');
  },

  async getAccountById(id: string): Promise<SocialAccount> {
    return apiClient.get(`/social/accounts/${id}`);
  },

  async connectAccount(data: ConnectSocialAccountRequest): Promise<ConnectSocialAccountResponse> {
    return apiClient.post('/social/connect', data);
  },

  async handleCallback(platform: SocialPlatform, data: SocialAccountCallback): Promise<SocialAccount> {
    return apiClient.post(`/social/callback/${platform.toLowerCase()}`, data);
  },

  async disconnectAccount(id: string): Promise<void> {
    return apiClient.delete(`/social/accounts/${id}`);
  },

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return apiClient.post('/social/refresh-token', data);
  },

  async syncAccount(id: string): Promise<SocialAccount> {
    return apiClient.post(`/social/accounts/${id}/sync`);
  },
};
