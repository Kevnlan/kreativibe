import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, ApiError } from '../types/auth';
import { normalizeCreatorProfile } from './normalize';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3050/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.removeTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  private removeTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      this.setTokens(accessToken, newRefreshToken);
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken, creatorProfile, brandProfile } = response.data.data;
      this.setTokens(accessToken, refreshToken);

      return {
        user,
        accessToken,
        refreshToken,
        creatorProfile: normalizeCreatorProfile(creatorProfile) || undefined,
        brandProfile,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(email: string, password: string, name: string, role: 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPPORT_AGENT', countryId?: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/signup', {
        email,
        password,
        name,
        role,
        countryId,
      });

      const { user, accessToken, refreshToken, creatorProfile, brandProfile } = response.data.data;
      this.setTokens(accessToken, refreshToken);

      return {
        user,
        accessToken,
        refreshToken,
        creatorProfile: normalizeCreatorProfile(creatorProfile) || undefined,
        brandProfile,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      await this.client.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      this.removeTokens();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.client.post('/auth/forgot-password', { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await this.client.post('/auth/reset-password', { token, password });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.client.post('/auth/verify-email', { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await this.client.post('/auth/resend-verification', { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.client.get('/auth/me');
      const { user, creatorProfile, brandProfile } = response.data.data;
      return {
        user,
        creatorProfile: normalizeCreatorProfile(creatorProfile) || undefined,
        brandProfile,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: any): Promise<any> {
    try {
      const response = await this.client.put('/user/profile', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.client.put('/user/password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unwraps the backend's { success, data } envelope, falling back to the raw body
  // for endpoints that don't use the envelope (e.g. return just a message).
  private unwrapEnvelope<T>(body: any): T {
    if (body && typeof body === 'object' && 'data' in body) {
      return body.data;
    }
    return body;
  }

  // Generic GET method
  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get(url, { params });
      return this.unwrapEnvelope<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic POST method
  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post(url, data);
      return this.unwrapEnvelope<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT method
  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put(url, data);
      return this.unwrapEnvelope<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PATCH method
  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.patch(url, data);
      return this.unwrapEnvelope<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE method
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete(url);
      return this.unwrapEnvelope<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload method
  async uploadFile(file: File, onProgress?: (progress: number) => void, fields?: Record<string, string>): Promise<any> {
    return this.uploadFileTo('/upload', file, fields, onProgress);
  }

  // Generic file upload to an arbitrary endpoint (e.g. /tax/documents/upload)
  async uploadFileTo<T>(url: string, file: File, fields?: Record<string, string>, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
    }

    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return this.unwrapEnvelope(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
