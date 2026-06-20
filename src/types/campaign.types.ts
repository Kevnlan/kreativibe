export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  creators: number;
  budget: number;
  spent: number;
  engagement: number;
  startDate: string;
  endDate: string;
  platform: string;
  niche: string;
}

export interface CreateCampaignData {
  name: string;
  objective: string;
  audience: string;
  budget: number;
  platforms: string[];
  contentTypes: string[];
  startDate?: string;
  endDate?: string;
  messaging?: string;
  tone?: string;
  source: 'manual' | 'ai';
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  suggestions?: string[];
}
