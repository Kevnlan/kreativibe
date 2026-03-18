export type SocialPlatform = 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE' | 'TWITTER';

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  username: string;
  displayName: string;
  profileImage?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  permissions: string[];
  isActive: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectSocialAccountRequest {
  platform: SocialPlatform;
  redirectUrl: string;
}

export interface ConnectSocialAccountResponse {
  authUrl: string;
  state: string;
}

export interface SocialAccountCallback {
  code: string;
  state: string;
}

export interface SocialAccountListResponse {
  accounts: SocialAccount[];
  total: number;
}

export interface RefreshTokenRequest {
  accountId: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  expiresAt: string;
  message: string;
}
