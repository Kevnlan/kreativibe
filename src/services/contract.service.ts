import { apiClient } from '../lib/api-client';
import { normalizeContract } from '../lib/normalize';
import { Contract, RawContract, GenerateContractData, UpdateContractData, SignContractData } from '../types/contract.types';

export const contractService = {
  // BRAND only. 409 if a contract already exists for this campaign.
  async generateContract(campaignId: string, data: GenerateContractData): Promise<Contract> {
    const raw = await apiClient.post<RawContract>(`/campaigns/${campaignId}/contract/generate`, data);
    return normalizeContract(raw);
  },

  async getContract(campaignId: string): Promise<Contract> {
    const raw = await apiClient.post<RawContract>(`/campaigns/${campaignId}/contract/get`, {});
    return normalizeContract(raw);
  },

  // BRAND only, only while status is DRAFT.
  async updateContractClauses(campaignId: string, data: UpdateContractData): Promise<Contract> {
    const raw = await apiClient.post<RawContract>(`/campaigns/${campaignId}/contract/update`, data);
    return normalizeContract(raw);
  },

  // BRAND or CREATOR — call once per side. DRAFT -> PARTIALLY_SIGNED -> ACTIVE.
  async signContract(campaignId: string, data: SignContractData): Promise<Contract> {
    const raw = await apiClient.post<RawContract>(`/campaigns/${campaignId}/contract/sign`, data);
    return normalizeContract(raw);
  },

  // STUBBED on the backend — returns a deterministic fake URL, no real PDF renderer yet.
  async downloadContract(campaignId: string): Promise<{ url: string }> {
    return apiClient.post(`/campaigns/${campaignId}/contract/download`, {});
  },
};
