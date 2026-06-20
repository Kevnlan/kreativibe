export interface TaxComplianceItem {
  id: string;
  name: string;
  description: string;
  status: 'COMPLIANT' | 'PENDING';
  lastUpdated?: string;
  dueDate?: string;
  actionRequired: boolean;
}

export interface TaxComplianceResponse {
  items: TaxComplianceItem[];
}

export interface SaveTaxInfoRequest {
  kraPin: string;
  taxResidency: string;
  withholdingTaxOptIn: boolean;
}

export interface GenerateTaxReportRequest {
  year: number;
  format: 'PDF' | 'CSV';
}

export interface GenerateTaxReportResponse {
  reportUrl: string;
  generatedAt: string;
}

export type TaxDocumentType = 'KRA_CERTIFICATE' | 'WITHHOLDING_CERT' | 'OTHER';

export interface TaxDocument {
  id: string;
  type: TaxDocumentType;
  url: string;
  uploadedAt: string;
}

export interface TaxDocumentListResponse {
  items: TaxDocument[];
}
