import { apiClient } from '../lib/api-client';
import {
  Conversation,
  ConversationListResponse,
  Message,
  MessageListResponse,
  UnreadCountResponse,
  StartConversationData,
  SendMessageData,
  ListMessagesData,
} from '../types/api-contracts/messaging.types';

export const messagingService = {
  async startConversation(data: StartConversationData): Promise<Conversation> {
    return apiClient.post('/messaging/conversations/start', data);
  },

  async listConversations(page = 1, limit = 20): Promise<ConversationListResponse> {
    return apiClient.post('/messaging/conversations/list', { page, limit });
  },

  async sendMessage(data: SendMessageData): Promise<Message> {
    return apiClient.post('/messaging/messages/send', data);
  },

  async listMessages(data: ListMessagesData): Promise<MessageListResponse> {
    return apiClient.post('/messaging/messages/list', data);
  },

  async markConversationRead(conversationId: string): Promise<void> {
    return apiClient.post('/messaging/conversations/mark-read', { conversationId });
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.post('/messaging/unread-count', {});
  },
};
