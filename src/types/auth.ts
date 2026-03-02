export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CREATOR' | 'BRAND' | 'ADMIN';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  averageRating: number;
  totalReviews: number;
  pricing: {
    instagramStory?: number;
    instagramPost?: number;
    instagramReel?: number;
    tiktokVideo?: number;
    youtubeShort?: number;
    youtubeVideo?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfile {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  location?: string;
  size?: string;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  creatorProfile: CreatorProfile | null;
  brandProfile: BrandProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'CREATOR' | 'BRAND') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<CreatorProfile | BrandProfile>) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  role: 'CREATOR' | 'BRAND';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  creatorProfile?: CreatorProfile;
  brandProfile?: BrandProfile;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
