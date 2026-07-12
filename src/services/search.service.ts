import { apiClient } from '../lib/api-client';
import {
  ContentSearchResult,
  CreatorSearchResult,
  CampaignSearchResult,
  SearchResponse,
  ContentSearchFilters,
  CreatorSearchFilters,
  CampaignSearchFilters,
  RecommendationFilters,
} from '../types/api-contracts/search.types';

export const searchService = {
  async searchContent(filters: ContentSearchFilters): Promise<SearchResponse<ContentSearchResult>> {
    return apiClient.post('/search/content', filters);
  },

  async searchCreators(filters: CreatorSearchFilters): Promise<SearchResponse<CreatorSearchResult>> {
    return apiClient.post('/search/creators', filters);
  },

  async searchCampaigns(filters: CampaignSearchFilters): Promise<SearchResponse<CampaignSearchResult>> {
    return apiClient.post('/search/campaigns', filters);
  },

  async recommendations(filters: RecommendationFilters): Promise<SearchResponse<any>> {
    return apiClient.post('/search/recommendations', filters);
  },
};
