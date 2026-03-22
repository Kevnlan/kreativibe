'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUserRole, useIsLoading } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const userRole = useUserRole();
  const isLoading = useIsLoading();

  useEffect(() => {
    if (!isLoading) {
      if (!userRole) {
        // Redirect to brand/creator login by default
        router.push('/auth/login');
      } else {
        // Redirect based on user role
        switch (userRole) {
          case 'CREATOR':
            router.push('/dashboard/creative');
            break;
          case 'BRAND':
            router.push('/dashboard/brand');
            break;
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'SUPPORT_AGENT':
            router.push('/dashboard/support-agent');
            break;
          default:
            router.push('/auth/login');
        }
      }
    }
  }, [userRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return null;
}
