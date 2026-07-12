import { apiClient } from '../lib/api-client';
import {
  SubscriptionPlan,
  PlanListResponse,
  Subscription,
  SubscribeData,
  SubscribeResponse,
  CancelSubscriptionData,
  Invoice,
  InvoiceListResponse,
  PayInvoiceData,
} from '../types/api-contracts/subscription.types';

export const subscriptionService = {
  async listPlans(isActive = true): Promise<PlanListResponse> {
    return apiClient.post('/subscriptions/plans/list', { isActive });
  },

  async subscribe(data: SubscribeData): Promise<SubscribeResponse> {
    return apiClient.post('/subscriptions/subscribe', data);
  },

  async mySubscription(): Promise<Subscription | null> {
    return apiClient.post('/subscriptions/me', {});
  },

  async cancel(data: CancelSubscriptionData): Promise<Subscription> {
    return apiClient.post('/subscriptions/cancel', data);
  },

  async listInvoices(page = 1, limit = 20): Promise<InvoiceListResponse> {
    return apiClient.post('/subscriptions/invoices/list', { page, limit });
  },

  async payInvoice(data: PayInvoiceData): Promise<Invoice> {
    return apiClient.post('/subscriptions/invoices/pay', data);
  },
};
