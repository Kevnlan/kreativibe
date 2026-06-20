import { apiClient } from '../lib/api-client';

export interface UploadResult {
  url: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface OcrResult {
  name?: string;
  nationalId?: string;
  dateOfBirth?: string;
  kraPin?: string;
  effectiveDate?: string;
  taxObligation?: string;
}

export type UploadPurpose = 'KYC_ID_FRONT' | 'KYC_ID_BACK' | 'KYC_KRA_CERT' | 'PORTFOLIO_SAMPLE' | 'BRAND_LOGO' | 'BRAND_COVER' | 'BRAND_DOCUMENT';

export const uploadService = {
  async uploadFile(file: File, onProgress?: (progress: number) => void, purpose?: UploadPurpose): Promise<UploadResult> {
    return apiClient.uploadFile(file, onProgress, purpose ? { purpose } : undefined);
  },

  async ocrDocument(file: File, type: 'id_front' | 'id_back' | 'kra'): Promise<OcrResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return apiClient.post('/ocr', formData);
  },
};
