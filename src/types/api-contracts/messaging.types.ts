export type ConversationType = 'DIRECT' | 'GROUP';

export interface MessageAttachment {
  url: string;
  type: string;
  name: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachments?: MessageAttachment[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  initiatorId: string;
  recipientId: string;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  unreadCount?: number;
  messages?: Message[];
  createdAt: string;
}

export interface ConversationListResponse {
  items: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface MessageListResponse {
  items: Message[];
  total: number;
  page: number;
  limit: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface StartConversationData {
  recipientId: string;
  initialMessage: string;
}

export interface SendMessageData {
  conversationId: string;
  body: string;
  attachments?: MessageAttachment[];
}

export interface ListMessagesData {
  conversationId: string;
  page?: number;
  limit?: number;
}
