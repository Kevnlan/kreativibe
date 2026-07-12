import { apiClient } from '../lib/api-client';
import {
  AISession,
  AISessionListResponse,
  CreateSessionData,
  ChatData,
  ChatResponse,
  ContentSuggestionData,
  ContentSuggestionResponse,
  PricingAdviceData,
  PricingAdviceResponse,
  CreatorMatchData,
  CreatorMatchResponse,
} from '../types/api-contracts/ai-assistant.types';

export const aiAssistantService = {
  async createSession(data: CreateSessionData): Promise<AISession> {
    return apiClient.post('/ai-assistant/sessions/create', data);
  },

  async listSessions(page = 1, limit = 20): Promise<AISessionListResponse> {
    return apiClient.post('/ai-assistant/sessions/list', { page, limit });
  },

  async getSession(sessionId: string): Promise<AISession> {
    return apiClient.post('/ai-assistant/sessions/get', { sessionId });
  },

  async chat(data: ChatData): Promise<ChatResponse> {
    return apiClient.post('/ai-assistant/chat', data);
  },

  async deleteSession(id: string): Promise<void> {
    return apiClient.post('/ai-assistant/sessions/delete', { id });
  },

  async contentSuggestions(data: ContentSuggestionData): Promise<ContentSuggestionResponse> {
    return apiClient.post('/ai-assistant/content-suggestions', data);
  },

  async pricingAdvice(data: PricingAdviceData): Promise<PricingAdviceResponse> {
    return apiClient.post('/ai-assistant/pricing-advice', data);
  },

  async creatorMatch(data: CreatorMatchData): Promise<CreatorMatchResponse> {
    return apiClient.post('/ai-assistant/creator-match', data);
  },
};
