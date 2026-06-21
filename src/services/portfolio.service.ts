import { apiClient } from '../lib/api-client';
import { RawPortfolioItem, PortfolioItem, AddPortfolioItemData } from '../types/portfolio.types';

function normalizePortfolioItem(raw: RawPortfolioItem): PortfolioItem {
  const { reach, engagement, earnings, rating, ...rest } = raw;
  return {
    ...rest,
    reach: reach ?? undefined,
    engagement: engagement ?? undefined,
    earnings: earnings != null ? Number(earnings) : undefined,
    rating: rating ?? undefined,
  };
}

export const portfolioService = {
  // Omit creatorUserId to fetch the authenticated creator's own portfolio.
  async list(creatorUserId?: string): Promise<PortfolioItem[]> {
    const res = await apiClient.post<{ items: RawPortfolioItem[] }>('/portfolio/list', creatorUserId ? { creatorUserId } : {});
    return res.items.map(normalizePortfolioItem);
  },

  async addExternalItem(data: AddPortfolioItemData): Promise<PortfolioItem> {
    const raw = await apiClient.post<RawPortfolioItem>('/portfolio/add', data);
    return normalizePortfolioItem(raw);
  },

  async deleteExternalItem(id: string): Promise<void> {
    return apiClient.post(`/portfolio/${id}/delete`, {});
  },
};
