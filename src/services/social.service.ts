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
    return apiClient.post('/social/accounts/list', {});
  },

  async getAccountById(id: string): Promise<SocialAccount> {
    return apiClient.post(`/social/accounts/${id}/get`, {});
  },

  async connectAccount(data: ConnectSocialAccountRequest): Promise<ConnectSocialAccountResponse> {
    return apiClient.post('/social/connect', data);
  },

  async handleCallback(platform: SocialPlatform, data: SocialAccountCallback): Promise<SocialAccount> {
    return apiClient.post(`/social/callback/${platform}`, data);
  },

  async disconnectAccount(id: string): Promise<void> {
    return apiClient.post(`/social/accounts/${id}/disconnect`, {});
  },

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return apiClient.post('/social/refresh-token', data);
  },

  async syncAccount(id: string): Promise<SocialAccount> {
    return apiClient.post(`/social/accounts/${id}/sync`, {});
  },
};
