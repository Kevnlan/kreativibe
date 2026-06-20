import { apiClient } from '../lib/api-client';
import { CampaignBrief } from '../components/campaign/BriefGenerator';
import { PackageOption } from '../components/campaign/PackageRecommender';
import { Campaign, CreateCampaignData, AiChatMessage, AiChatResponse } from '../types/campaign.types';

export const campaignService = {
  async list(): Promise<Campaign[]> {
    return apiClient.get('/campaigns');
  },

  async get(id: string): Promise<Campaign> {
    return apiClient.get(`/campaigns/${id}`);
  },

  async create(data: CreateCampaignData): Promise<Campaign> {
    return apiClient.post('/campaigns', data);
  },

  async publish(id: string): Promise<Campaign> {
    return apiClient.post(`/campaigns/${id}/publish`);
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
};
