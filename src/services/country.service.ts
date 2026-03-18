import { apiClient } from '../lib/api-client';
import { 
  Country, 
  CountryListResponse, 
  CreateCountryRequest, 
  UpdateCountryRequest 
} from '../types/api-contracts/country.types';

export const countryService = {
  async getCountries(): Promise<CountryListResponse> {
    return apiClient.get('/countries');
  },

  async getCountryById(id: string): Promise<Country> {
    return apiClient.get(`/countries/${id}`);
  },

  async createCountry(data: CreateCountryRequest): Promise<Country> {
    return apiClient.post('/admin/countries', data);
  },

  async updateCountry(id: string, data: UpdateCountryRequest): Promise<Country> {
    return apiClient.put(`/admin/countries/${id}`, data);
  },

  async deleteCountry(id: string): Promise<void> {
    return apiClient.delete(`/admin/countries/${id}`);
  },

  async getCountryConfig(id: string): Promise<Country['config']> {
    return apiClient.get(`/countries/${id}/config`);
  },

  async updateCountryConfig(id: string, config: Country['config']): Promise<Country> {
    return apiClient.put(`/admin/countries/${id}/config`, config);
  },
};
