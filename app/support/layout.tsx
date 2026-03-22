'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useUserRole, useIsLoading } from '@/contexts/AuthContext';

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useUserRole();
  const isLoading = useIsLoading();

  // Don't protect the login page
  const isLoginPage = pathname === '/support/login';

  useEffect(() => {
    if (!isLoginPage && !isLoading) {
      if (!userRole) {
        router.push('/support/login');
      } else if (userRole !== 'SUPPORT_AGENT') {
        // Redirect non-support users to their appropriate dashboard
        router.push('/dashboard');
      }
    }
  }, [userRole, isLoading, router, isLoginPage]);

  // Allow login page to render without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!userRole || userRole !== 'SUPPORT_AGENT') {
    return null;
  }

  return <>{children}</>;
}
