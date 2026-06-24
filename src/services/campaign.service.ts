import { apiClient } from '../lib/api-client';
import { normalizeCampaign, normalizeCampaignList, normalizeApplication, normalizeApplicationList, normalizeProposal } from '../lib/normalize';
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
  Proposal,
  RawProposal,
  SaveProposalData,
  Milestone,
  MilestoneDelivery,
  SubmitMilestoneDeliveryData,
} from '../types/campaign.types';

export const campaignService = {
  async list(filters?: CampaignFilters): Promise<CampaignListResponse> {
    const raw = await apiClient.post<RawCampaignListResponse>('/campaigns/list', filters ?? {});
    return normalizeCampaignList(raw);
  },

  async get(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/get', { id });
    return normalizeCampaign(raw);
  },

  async create(data: CreateCampaignData): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns', data);
    return normalizeCampaign(raw);
  },

  async update(id: string, data: Partial<CreateCampaignData>): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/update', { id, ...data });
    return normalizeCampaign(raw);
  },

  async deleteCampaign(id: string): Promise<void> {
    return apiClient.post('/campaigns/delete', { id });
  },

  async publish(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/publish', { id });
    return normalizeCampaign(raw);
  },

  async pause(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/pause', { id });
    return normalizeCampaign(raw);
  },

  async resume(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/resume', { id });
    return normalizeCampaign(raw);
  },

  async complete(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/complete', { id });
    return normalizeCampaign(raw);
  },

  async cancel(id: string): Promise<Campaign> {
    const raw = await apiClient.post<RawCampaign>('/campaigns/cancel', { id });
    return normalizeCampaign(raw);
  },

  async stats(id: string): Promise<CampaignStats> {
    return apiClient.post('/campaigns/stats', { id });
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
    const raw = await apiClient.post<RawCampaignApplication[]>('/campaigns/applications/list', { id: campaignId });
    return normalizeApplicationList(raw);
  },

  async applyToCampaign(campaignId: string, data: ApplyToCampaignData): Promise<CampaignApplication> {
    const raw = await apiClient.post<RawCampaignApplication>('/campaigns/applications/apply', { campaignId, ...data });
    return normalizeApplication(raw);
  },

  async getApplication(id: string): Promise<CampaignApplication> {
    const raw = await apiClient.post<RawCampaignApplication>('/campaigns/applications/get', { id });
    return normalizeApplication(raw);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<CampaignApplication> {
    const raw = await apiClient.post<RawCampaignApplication>('/campaigns/applications/update', { id, status });
    return normalizeApplication(raw);
  },

  async withdrawApplication(id: string): Promise<void> {
    return apiClient.post('/campaigns/applications/withdraw', { id });
  },

  async myApplications(): Promise<CampaignApplication[]> {
    const raw = await apiClient.post<RawCampaignApplication[]>('/creators/me/applications', {});
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
    return apiClient.post('/campaigns/ai/conversations/list', {});
  },

  async saveAiConversation(title: string, messages: AiChatMessage[]): Promise<AiConversation> {
    return apiClient.post('/campaigns/ai/conversations', { title, messages });
  },

  async getAiConversation(id: string): Promise<AiConversation> {
    return apiClient.post('/campaigns/ai/conversations/get', { id });
  },

  async deleteAiConversation(id: string): Promise<void> {
    return apiClient.post('/campaigns/ai/conversations/delete', { id });
  },

  async saveProposal(campaignId: string, data: SaveProposalData): Promise<Proposal> {
    const raw = await apiClient.post<RawProposal>('/campaigns/proposal/save', { campaignId, ...data });
    return normalizeProposal(raw);
  },

  async submitProposal(campaignId: string): Promise<Proposal> {
    const raw = await apiClient.post<RawProposal>('/campaigns/proposal/submit', { campaignId });
    return normalizeProposal(raw);
  },

  async getProposal(campaignId: string): Promise<Proposal> {
    const raw = await apiClient.post<RawProposal>('/campaigns/proposal/get', { campaignId });
    return normalizeProposal(raw);
  },

  async listMilestones(campaignId: string): Promise<Milestone[]> {
    const res = await apiClient.post<{ milestones: Milestone[] }>('/campaigns/milestones/list', { campaignId });
    return res.milestones;
  },

  async getMilestoneDelivery(campaignId: string, milestoneId: string): Promise<MilestoneDelivery> {
    return apiClient.post('/campaigns/milestones/delivery/get', { campaignId, milestoneId });
  },

  async submitMilestoneDelivery(campaignId: string, milestoneId: string, data: SubmitMilestoneDeliveryData): Promise<MilestoneDelivery> {
    return apiClient.post('/campaigns/milestones/delivery/submit', { campaignId, milestoneId, ...data });
  },

  async approveMilestoneDelivery(campaignId: string, milestoneId: string): Promise<{ milestoneId: string; status: string; approvedAt: string }> {
    return apiClient.post('/campaigns/milestones/delivery/approve', { campaignId, milestoneId });
  },

  async rejectMilestoneDelivery(campaignId: string, milestoneId: string, reason: string): Promise<{ milestoneId: string; status: string; reviewNotes: string }> {
    return apiClient.post('/campaigns/milestones/delivery/reject', { campaignId, milestoneId, reason });
  },

  async requestMilestoneRevision(campaignId: string, milestoneId: string, notes: string): Promise<{ milestoneId: string; status: string; reviewNotes: string }> {
    return apiClient.post('/campaigns/milestones/delivery/request-revision', { campaignId, milestoneId, notes });
  },
};
