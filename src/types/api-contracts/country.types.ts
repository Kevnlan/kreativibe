export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  taxRate: number;
  isActive: boolean;
  config: CountryConfig;
  createdAt: string;
  updatedAt: string;
}

export interface CountryConfig {
  kycRules: KYCRule[];
  payoutMethods: PayoutMethod[];
  taxRules: TaxRule[];
  currencies: string[];
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
}

export interface KYCRule {
  fieldName: string;
  fieldType: 'text' | 'file' | 'date' | 'select';
  label: string;
  required: boolean;
  validationRules?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    options?: string[];
  };
  apiValidation?: {
    provider: 'IPRS' | 'KRA' | 'OTHER';
    endpoint: string;
  };
}

export interface PayoutMethod {
  type: 'MPESA' | 'BANK' | 'PAYPAL';
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: 'FIXED' | 'PERCENTAGE';
  processingTime: string;
  isActive: boolean;
}

export interface TaxRule {
  name: string;
  rate: number;
  threshold?: number;
  type: 'WITHHOLDING' | 'VAT' | 'INCOME';
}

export interface CreateCountryRequest {
  name: string;
  code: string;
  currency: string;
  taxRate: number;
  config: CountryConfig;
}

export interface UpdateCountryRequest extends Partial<CreateCountryRequest> {
  isActive?: boolean;
}

export interface CountryListResponse {
  countries: Country[];
  total: number;
}
