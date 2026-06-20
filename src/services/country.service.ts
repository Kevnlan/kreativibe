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
    return apiClient.post(`/countries/${id}/get`, {});
  },

  async createCountry(data: CreateCountryRequest): Promise<Country> {
    return apiClient.post('/admin/countries/create', data);
  },

  async updateCountry(id: string, data: UpdateCountryRequest): Promise<Country> {
    return apiClient.post(`/admin/countries/${id}/update`, data);
  },

  async deleteCountry(id: string): Promise<void> {
    return apiClient.post(`/admin/countries/${id}/delete`, {});
  },

  async getCountryConfig(id: string): Promise<Country['config']> {
    return apiClient.post(`/countries/${id}/config`, {});
  },

  async updateCountryConfig(id: string, config: Country['config']): Promise<Country> {
    return apiClient.post(`/admin/countries/${id}/config/update`, config);
  },
};
