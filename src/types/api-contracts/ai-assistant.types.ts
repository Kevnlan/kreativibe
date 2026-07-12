export type AISessionType = 'CAMPAIGN_BUILDER' | 'CONTENT_IDEAS' | 'PRICING_ADVICE' | 'CREATOR_MATCH' | 'GENERAL';

export interface AISession {
  id: string;
  userId: string;
  type: AISessionType;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AISessionListResponse {
  items: AISession[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSessionData {
  type: AISessionType;
  title: string;
}

export interface ChatData {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
  messageId: string;
}

export interface ContentSuggestionData {
  platform: string;
  niche: string;
  audience: string;
  campaignObjective: string;
}

export interface ContentSuggestion {
  title: string;
  description: string;
  format: string;
  hook: string;
  cta: string;
}

export interface ContentSuggestionResponse {
  suggestions: ContentSuggestion[];
}

export interface PricingAdviceData {
  platform: string;
  contentType: string;
  followers: number;
  averageEngagement: number;
  niche: string;
}

export interface PricingAdviceResponse {
  suggestedPrice: number;
  priceRange: { min: number; max: number };
  currency: string;
  reasoning: string;
  tips: string[];
}

export interface CreatorMatchData {
  campaignObjective: string;
  targetAudience: string;
  platforms: string[];
  contentType: string[];
  budgetMin: number;
  budgetMax: number;
  limit?: number;
}

export interface CreatorMatchResult {
  creatorId: string;
  name: string;
  avatar?: string;
  matchScore: number;
  reason: string;
  platforms: string[];
  niches: string[];
  followers: number;
  averageRating: number;
}

export interface CreatorMatchResponse {
  matches: CreatorMatchResult[];
}
