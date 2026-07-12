export type TicketCategory = 'PAYMENT' | 'CAMPAIGN' | 'TECHNICAL' | 'ACCOUNT' | 'GENERAL';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'USER' | 'AGENT' | 'SYSTEM';
  body: string;
  attachments: string[];
  isInternal: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  requesterId: string;
  assignedAgentId: string | null;
  slaDeadline: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  rating: number | null;
  ratingComment: string | null;
  messages?: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketListResponse {
  items: SupportTicket[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketListFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  page?: number;
  limit?: number;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface SendMessageData {
  ticketId: string;
  body: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface RateTicketData {
  ticketId: string;
  rating: number;
  ratingComment?: string;
}

export interface UpdateTicketData {
  ticketId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface SupportStats {
  total: number;
  resolved: number;
  resolutionRate: number;
  averageRating: number;
  byStatus: { status: TicketStatus; count: number }[];
  byPriority: { priority: TicketPriority; count: number }[];
}
