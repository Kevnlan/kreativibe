import { apiClient } from '../lib/api-client';
import {
  License,
  LicenseListResponse,
  LicenseListFilters,
  LicenseDownloadResponse,
  LicenseVerifyResponse,
  RevokeLicenseData,
  RevokeLicenseResponse,
} from '../types/api-contracts/license.types';

export const licenseService = {
  // ── Brand-side ──
  async listLicenses(filters?: LicenseListFilters): Promise<LicenseListResponse> {
    return apiClient.post('/licenses/list', filters ?? {});
  },

  async getLicense(contentId: string): Promise<License> {
    return apiClient.post('/licenses/get', { contentId });
  },

  async downloadContent(contentId: string): Promise<LicenseDownloadResponse> {
    return apiClient.post('/licenses/download', { contentId });
  },

  async verifyLicense(contentId: string): Promise<LicenseVerifyResponse> {
    return apiClient.post('/licenses/verify', { contentId });
  },

  // ── Admin-side ──
  async listAllLicenses(filters?: LicenseListFilters): Promise<LicenseListResponse> {
    return apiClient.post('/admin/licenses/list', filters ?? {});
  },

  async revokeLicense(data: RevokeLicenseData): Promise<RevokeLicenseResponse> {
    return apiClient.post('/admin/licenses/revoke', data);
  },
};
