import axios, { AxiosInstance } from 'axios';
import { AuthResponse, ApiError, LoginResult } from '../types/auth';
import { normalizeCreatorProfile } from './normalize';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });

      const data = response.data.data;
      if (data.requiresTwoFactor) {
        return { requiresTwoFactor: true, sessionToken: data.sessionToken };
      }

      const { user, accessToken, refreshToken, creatorProfile, brandProfile } = data;

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

  async loginWithTwoFactor(sessionToken: string, code: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/login/2fa', { sessionToken, code });

      const { user, accessToken, refreshToken, creatorProfile, brandProfile } = response.data.data;

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
      await this.client.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API call failed:', error);
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
