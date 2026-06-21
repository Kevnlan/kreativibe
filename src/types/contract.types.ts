export type ContractStatus = 'DRAFT' | 'PARTIALLY_SIGNED' | 'ACTIVE';

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  required: boolean;
  editable: boolean;
}

export interface RawContract {
  id: string;
  campaignId: string;
  applicationId: string;
  brandName: string;
  creativeName: string;
  startDate?: string | null;
  endDate?: string | null;
  totalAmount: string | number;
  currency: string;
  clauses: ContractClause[];
  additionalTerms?: string | null;
  status: ContractStatus;
  brandSignedAt?: string | null;
  creatorSignedAt?: string | null;
}

export interface Contract {
  id: string;
  campaignId: string;
  applicationId: string;
  brandName: string;
  creativeName: string;
  startDate?: string;
  endDate?: string;
  totalAmount: number;
  currency: string;
  clauses: ContractClause[];
  additionalTerms?: string;
  status: ContractStatus;
  brandSignedAt?: string;
  creatorSignedAt?: string;
}

export interface GenerateContractData {
  applicationId: string;
  proposedRate: number;
  currency: string;
}

export interface UpdateContractData {
  clauses?: { id: string; content: string }[];
  additionalTerms?: string;
}

export interface SignContractData {
  signature: string;
}
