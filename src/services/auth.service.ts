import { apiClient } from '../lib/api-client';
import { AuthResponse, LoginResult } from '../types/auth';

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    return apiClient.login(email, password);
  },

  async loginWithTwoFactor(sessionToken: string, code: string): Promise<AuthResponse> {
    return apiClient.loginWithTwoFactor(sessionToken, code);
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: 'CREATOR' | 'BRAND',
    countryId?: string
  ): Promise<AuthResponse> {
    return apiClient.signup(email, password, name, role, countryId);
  },

  async logout(): Promise<void> {
    return apiClient.logout();
  },

  async forgotPassword(email: string): Promise<void> {
    return apiClient.forgotPassword(email);
  },

  async resetPassword(token: string, password: string): Promise<void> {
    return apiClient.resetPassword(token, password);
  },

  async verifyEmail(token: string): Promise<void> {
    return apiClient.verifyEmail(token);
  },

  async resendVerification(email: string): Promise<void> {
    return apiClient.resendVerificationEmail(email);
  },

  async getMe(): Promise<any> {
    return apiClient.getCurrentUser();
  },
};
