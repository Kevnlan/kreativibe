import { apiClient } from '../lib/api-client';
import { 
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
  TwoFactorStatus,
  TwoFactorDisableRequest,
  RegenerateBackupCodesResponse
} from '../types/api-contracts/2fa.types';

export const twoFactorService = {
  async setup(): Promise<TwoFactorSetupResponse> {
    return apiClient.post('/auth/2fa/setup');
  },

  async verify(data: TwoFactorVerifyRequest): Promise<TwoFactorVerifyResponse> {
    return apiClient.post('/auth/2fa/verify', data);
  },

  async getStatus(): Promise<TwoFactorStatus> {
    return apiClient.get('/auth/2fa/status');
  },

  async disable(data: TwoFactorDisableRequest): Promise<void> {
    return apiClient.post('/auth/2fa/disable', data);
  },

  async regenerateBackupCodes(): Promise<RegenerateBackupCodesResponse> {
    return apiClient.post('/auth/2fa/backup-codes/regenerate');
  },
};
