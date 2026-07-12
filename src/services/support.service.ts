import { apiClient } from '../lib/api-client';
import {
  SupportTicket,
  TicketListResponse,
  TicketListFilters,
  CreateTicketData,
  SendMessageData,
  RateTicketData,
  UpdateTicketData,
  SupportStats,
} from '../types/api-contracts/support.types';

export const supportService = {
  // ── User-side ──
  async createTicket(data: CreateTicketData): Promise<SupportTicket> {
    return apiClient.post('/support/tickets/create', data);
  },

  async listMyTickets(filters?: TicketListFilters): Promise<TicketListResponse> {
    return apiClient.post('/support/tickets/list', filters ?? {});
  },

  async getTicket(id: string): Promise<SupportTicket> {
    return apiClient.post('/support/tickets/get', { id });
  },

  async sendMessage(data: SendMessageData): Promise<SupportTicket> {
    return apiClient.post('/support/tickets/message', data);
  },

  async rateTicket(data: RateTicketData): Promise<SupportTicket> {
    return apiClient.post('/support/tickets/rate', data);
  },

  // ── Agent/Admin-side ──
  async listAllTickets(filters?: TicketListFilters): Promise<TicketListResponse> {
    return apiClient.post('/admin/support/tickets/list', filters ?? {});
  },

  async adminGetTicket(id: string): Promise<SupportTicket> {
    return apiClient.post('/admin/support/tickets/get', { id });
  },

  async assignTicket(id: string): Promise<SupportTicket> {
    return apiClient.post('/admin/support/tickets/assign', { id });
  },

  async updateTicket(data: UpdateTicketData): Promise<SupportTicket> {
    return apiClient.post('/admin/support/tickets/update', data);
  },

  async agentReply(data: SendMessageData): Promise<SupportTicket> {
    return apiClient.post('/admin/support/tickets/message', data);
  },

  async getStats(): Promise<SupportStats> {
    return apiClient.post('/admin/support/stats', {});
  },
};
