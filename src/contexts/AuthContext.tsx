'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';
import { User, CreatorProfile, BrandProfile, AuthContextType, AuthState } from '../types/auth';

const initialState: AuthState = {
  user: null,
  creatorProfile: null,
  brandProfile: null,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ 
      ...prev, 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    }));
  };

  const setCreatorProfile = (creatorProfile: CreatorProfile | null) => {
    setState(prev => ({ ...prev, creatorProfile }));
  };

  const setBrandProfile = (brandProfile: BrandProfile | null) => {
    setState(prev => ({ ...prev, brandProfile }));
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      setCreatorProfile(response.creatorProfile || null);
      setBrandProfile(response.brandProfile || null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'CREATOR' | 'BRAND'): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiClient.signup(email, password, name, role);
      setUser(response.user);
      setCreatorProfile(response.creatorProfile || null);
      setBrandProfile(response.brandProfile || null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setCreatorProfile(null);
      setBrandProfile(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData.user);
      setCreatorProfile(userData.creatorProfile || null);
      setBrandProfile(userData.brandProfile || null);
    } catch (error) {
      // If refresh fails, clear auth state
      setUser(null);
      setCreatorProfile(null);
      setBrandProfile(null);
    }
  };

  const updateProfile = async (data: Partial<CreatorProfile | BrandProfile>): Promise<void> => {
    try {
      const updatedProfile = await apiClient.updateProfile(data);
      
      if (state.user?.role === 'CREATOR' && updatedProfile.id) {
        setCreatorProfile(updatedProfile as CreatorProfile);
      } else if (state.user?.role === 'BRAND' && updatedProfile.id) {
        setBrandProfile(updatedProfile as BrandProfile);
      }
    } catch (error) {
      throw error;
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            await refreshUser();
          } catch (error) {
            console.error('Failed to refresh user:', error);
            // Clear invalid tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hooks for specific auth states
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useCreatorProfile(): CreatorProfile | null {
  const { creatorProfile } = useAuth();
  return creatorProfile;
}

export function useBrandProfile(): BrandProfile | null {
  const { brandProfile } = useAuth();
  return brandProfile;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useIsLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

export function useUserRole(): 'CREATOR' | 'BRAND' | 'ADMIN' | null {
  const { user } = useAuth();
  return user?.role || null;
}

// Role-based hooks
export function useIsCreator(): boolean {
  return useUserRole() === 'CREATOR';
}

export function useIsBrand(): boolean {
  return useUserRole() === 'BRAND';
}

export function useIsAdmin(): boolean {
  return useUserRole() === 'ADMIN';
}

export function useIsVerified(): boolean {
  const { user, creatorProfile, brandProfile } = useAuth();
  
  if (!user) return false;
  
  if (user.role === 'CREATOR' && creatorProfile) {
    return creatorProfile.isVerified;
  }
  
  if (user.role === 'BRAND' && brandProfile) {
    return brandProfile.isVerified;
  }
  
  return user.isEmailVerified;
}
