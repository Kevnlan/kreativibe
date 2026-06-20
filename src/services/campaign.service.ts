import { apiClient } from '../lib/api-client';
import { normalizeCampaign, normalizeCampaignList, normalizeApplication, normalizeApplicationList } from '../lib/normalize';
import {
  Campaign,
  RawCampaign,
  RawCampaignListResponse,
  CampaignListResponse,
  CreateCampaignData,
  CampaignFilters,
  MarketplaceCampaignFilters,
  CampaignApplication,
  RawCampaignApplication,
  ApplyToCampaignData,
  ApplicationStatus,
  CampaignStats,
  AiChatMessage,
  AiChatResponse,
  CampaignBrief,
  PackageOption,
  AiConversation,
} from '../types/campaign.types';

export const campaignService = {
  async list(filters?: CampaignFilters): Promise<CampaignListResponse> {
    const raw = await apiClient.get<RawCampaignListResponse>('/campaigns', filters);
    return normalizeCampaignList(raw);
  },

  async get(id: string): Promise<Campaign> {
    const raw = await apiClient.get<RawCampaign>(`/campaigns/${id}`);
    return normalizeCampaign(raw);
  },

  async create(data: CreateCampaignData): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns', data);
    return normalizeCampaign(raw);
  },

  async update(id: string, data: Partial<CreateCampaignData>): Promise<Campaign> {
    const raw = await apiClient.put<RawCampaign>(`/campaigns/${id}`, data);
    return normalizeCampaign(raw);
  },

  async deleteCampaign(id: string): Promise<void> {
    return apiClient.delete(`/campaigns/${id}`);
  },

  async publish(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>(`/campaigns/${id}/publish`);
    return normalizeCampaign(raw);
  },

  async pause(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>(`/campaigns/${id}/pause`);
    return normalizeCampaign(raw);
  },

  async resume(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>(`/campaigns/${id}/resume`);
    return normalizeCampaign(raw);
  },

  async complete(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>(`/campaigns/${id}/complete`);
    return normalizeCampaign(raw);
  },

  async cancel(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>(`/campaigns/${id}/cancel`);
    return normalizeCampaign(raw);
  },

  async stats(id: string): Promise<CampaignStats> {
    return apiClient.get(`/campaigns/${id}/stats`);
  },

  async browseMarketplace(filters?: MarketplaceCampaignFilters): Promise<CampaignListResponse> {
    const raw = await apiClient.get<RawCampaignListResponse>('/campaigns/marketplace', filters);
    return normalizeCampaignList(raw);
  },

  async getMarketplaceCampaign(id: string): Promise<Campaign> {
    const raw = await apiClient.get<RawCampaign>(`/campaigns/marketplace/${id}`);
    return normalizeCampaign(raw);
  },

  async listApplications(campaignId: string): Promise<CampaignApplication[]> {
    const raw = await apiClient.get<RawCampaignApplication[]>(`/campaigns/${campaignId}/applications`);
    return normalizeApplicationList(raw);
  },

  async applyToCampaign(campaignId: string, data: ApplyToCampaignData): Promise<CampaignApplication> {
    const raw = await apiClient.post<RawCampaignApplication>(`/campaigns/${campaignId}/applications`, data);
    return normalizeApplication(raw);
  },

  async getApplication(id: string): Promise<CampaignApplication> {
    const raw = await apiClient.get<RawCampaignApplication>(`/campaigns/applications/${id}`);
    return normalizeApplication(raw);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<CampaignApplication> {
    const raw = await apiClient.patch<RawCampaignApplication>(`/campaigns/applications/${id}`, { status });
    return normalizeApplication(raw);
  },

  async withdrawApplication(id: string): Promise<void> {
    return apiClient.delete(`/campaigns/applications/${id}`);
  },

  async myApplications(): Promise<CampaignApplication[]> {
    const raw = await apiClient.get<RawCampaignApplication[]>('/creators/me/applications');
    return normalizeApplicationList(raw);
  },

  async aiChat(messages: AiChatMessage[]): Promise<AiChatResponse> {
    return apiClient.post('/campaigns/ai/chat', { messages });
  },

  async aiBrief(messages: AiChatMessage[]): Promise<CampaignBrief> {
    return apiClient.post('/campaigns/ai/brief', { messages });
  },

  async recommendPackages(brief: CampaignBrief): Promise<PackageOption[]> {
    return apiClient.post('/campaigns/ai/packages/recommend', { brief });
  },

  async listAiConversations(): Promise<AiConversation[]> {
    return apiClient.get('/campaigns/ai/conversations');
  },

  async saveAiConversation(title: string, messages: AiChatMessage[]): Promise<AiConversation> {
    return apiClient.post('/campaigns/ai/conversations', { title, messages });
  },

  async getAiConversation(id: string): Promise<AiConversation> {
    return apiClient.get(`/campaigns/ai/conversations/${id}`);
  },

  async deleteAiConversation(id: string): Promise<void> {
    return apiClient.delete(`/campaigns/ai/conversations/${id}`);
  },
};
