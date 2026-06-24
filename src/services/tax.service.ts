import { apiClient } from '../lib/api-client';
import {
  TaxComplianceResponse,
  SaveTaxInfoRequest,
  GenerateTaxReportRequest,
  GenerateTaxReportResponse,
  TaxDocument,
  TaxDocumentListResponse,
  TaxDocumentType,
} from '../types/api-contracts/tax.types';

export const taxService = {
  async getComplianceStatus(): Promise<TaxComplianceResponse> {
    return apiClient.post('/tax/compliance/get', {});
  },

  async saveTaxInfo(data: SaveTaxInfoRequest): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/tax/info/save', data);
  },

  async generateReport(data: GenerateTaxReportRequest): Promise<GenerateTaxReportResponse> {
    return apiClient.post('/tax/report/generate', data);
  },

  async uploadDocument(file: File, type: TaxDocumentType, onProgress?: (progress: number) => void): Promise<TaxDocument> {
    return apiClient.uploadFileTo('/tax/documents/upload', file, { type }, onProgress);
  },

  async listDocuments(): Promise<TaxDocumentListResponse> {
    return apiClient.post('/tax/documents/list', {});
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return apiClient.post('/tax/documents/delete', { id });
  },
};
