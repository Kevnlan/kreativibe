import { apiClient } from '../lib/api-client';
import {
  Offer,
  OfferListResponse,
  OfferFilters,
  CreateOfferData,
  CounterOfferData,
  OfferActionData,
  OfferHistoryResponse,
} from '../types/api-contracts/offer.types';

export const offerService = {
  // ── Brand-side ──
  async createOffer(data: CreateOfferData): Promise<Offer> {
    return apiClient.post('/offers/create', data);
  },

  async listOffers(filters?: OfferFilters): Promise<OfferListResponse> {
    return apiClient.post('/offers/list', filters ?? {});
  },

  async getOffer(id: string): Promise<Offer> {
    return apiClient.post('/offers/get', { id });
  },

  async getOfferHistory(id: string): Promise<OfferHistoryResponse> {
    return apiClient.post('/offers/history', { id });
  },

  async counterOffer(data: CounterOfferData): Promise<Offer> {
    return apiClient.post('/offers/counter', data);
  },

  async acceptOffer(data: OfferActionData): Promise<Offer> {
    return apiClient.post('/offers/accept', data);
  },

  async rejectOffer(data: OfferActionData): Promise<Offer> {
    return apiClient.post('/offers/reject', data);
  },

  async withdrawOffer(data: OfferActionData): Promise<Offer> {
    return apiClient.post('/offers/withdraw', data);
  },

  // ── Creator-side ──
  async listReceivedOffers(filters?: OfferFilters): Promise<OfferListResponse> {
    return apiClient.post('/offers/received', filters ?? {});
  },
};
