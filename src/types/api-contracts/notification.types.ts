export type NotificationType =
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'OFFER_COUNTERED'
  | 'CONTENT_APPROVED'
  | 'CONTENT_REJECTED'
  | 'CAMPAIGN_APPLICATION'
  | 'WITHDRAWAL_PROCESSED'
  | 'SUPPORT_REPLY'
  | 'COMMUNITY_REPLY'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface NotificationListFilters {
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface MarkReadResponse {
  marked: number;
}
