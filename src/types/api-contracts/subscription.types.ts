export type SubscriptionTier = 'FREE' | 'CREATOR_PRO' | 'BRAND_PRO' | 'ENTERPRISE';
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
export type PaymentMethod = 'MPESA' | 'CARD' | 'BANK';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  trialDays: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIALING';
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export interface SubscribeData {
  planId: string;
  autoRenew: boolean;
}

export interface SubscribeResponse {
  subscription: Subscription;
  invoices?: Invoice[];
}

export interface CancelSubscriptionData {
  subscriptionId: string;
  reason: string;
}

export interface PayInvoiceData {
  invoiceId: string;
  method: PaymentMethod;
}

export interface InvoiceListResponse {
  items: Invoice[];
  total: number;
  page: number;
  limit: number;
}

export interface PlanListResponse {
  items: SubscriptionPlan[];
}

export interface CreatePlanData {
  name: string;
  description: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  trialDays: number;
  features: Record<string, any>;
  isActive: boolean;
}

export interface UpdatePlanData {
  planId: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  trialDays?: number;
  features?: Record<string, any>;
  isActive?: boolean;
}
