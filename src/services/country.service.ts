import { apiClient } from '../lib/api-client';
import { 
  Country, 
  CountryListResponse, 
  CreateCountryRequest, 
  UpdateCountryRequest 
} from '../types/api-contracts/country.types';

export const countryService = {
  async getCountries(): Promise<CountryListResponse> {
    return apiClient.post('/countries/list', {});
  },

  async getCountryById(id: string): Promise<Country> {
    return apiClient.post('/countries/get', { id });
  },

  async createCountry(data: CreateCountryRequest): Promise<Country> {
    return apiClient.post('/admin/countries/create', data);
  },

  async updateCountry(id: string, data: UpdateCountryRequest): Promise<Country> {
    return apiClient.post('/admin/countries/update', { id, ...data });
  },

  async deleteCountry(id: string): Promise<void> {
    return apiClient.post('/admin/countries/delete', { id });
  },

  async getCountryConfig(id: string): Promise<Country['config']> {
    return apiClient.post('/countries/config', { id });
  },

  async updateCountryConfig(id: string, config: Country['config']): Promise<Country> {
    return apiClient.post('/admin/countries/config/update', { id, ...config });
  },
};
