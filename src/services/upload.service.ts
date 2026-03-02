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

export const uploadService = {
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
    return apiClient.uploadFile(file, onProgress);
  },

  async ocrDocument(file: File, type: 'id_front' | 'id_back' | 'kra'): Promise<OcrResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return apiClient.post('/ocr', formData);
  },
};
