'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { 
  Home, 
  User, 
  Wallet, 
  FileText, 
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Shield,
  LogOut,
  MessageSquare,
  Settings,
  Globe
} from 'lucide-react';
import { useUserRole, useUser, useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, Badge } from '../ui';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: ('CREATOR' | 'BRAND' | 'ADMIN' | 'SUPPORT_AGENT')[];
}

const sidebarItems: SidebarItem[] = [
  // Shared
  {
    name: 'Overview',
    href: '/dashboard',
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: <User className="h-4 w-4" />,
    roles: ['CREATOR', 'BRAND'],
  },
  // Creator
  {
    name: 'My Content',
    href: '/dashboard/creative/content',
    icon: <FileText className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'My Posts',
    href: '/dashboard/creative/posts',
    icon: <FileText className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Wallet',
    href: '/dashboard/creative/wallet',
    icon: <Wallet className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Earnings',
    href: '/dashboard/creative/earnings',
    icon: <TrendingUp className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Withdrawals',
    href: '/dashboard/creative/withdrawals',
    icon: <Wallet className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Browse Brands',
    href: '/dashboard/creative/brands',
    icon: <ShoppingBag className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Portfolio',
    href: '/dashboard/creative/portfolio',
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  // Brand
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: <ShoppingBag className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Wallet',
    href: '/dashboard/brand/wallet',
    icon: <Wallet className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Purchases',
    href: '/dashboard/brand/purchases',
    icon: <ShoppingBag className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Social Media',
    href: '/dashboard/brand/social',
    icon: <Users className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Campaigns',
    href: '/dashboard/brand/campaigns',
    icon: <TrendingUp className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Analytics',
    href: '/dashboard/brand/analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  // Admin
  {
    name: 'Creators',
    href: '/dashboard/admin/creators',
    icon: <Users className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Brands',
    href: '/dashboard/admin/brands',
    icon: <ShoppingBag className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Transactions',
    href: '/dashboard/admin/transactions',
    icon: <Wallet className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'User Management',
    href: '/dashboard/admin/users',
    icon: <Users className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Countries',
    href: '/dashboard/admin/countries',
    icon: <Globe className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: <Shield className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  // Support Agent
  {
    name: 'Support',
    href: '/dashboard/support',
    icon: <MessageSquare className="h-4 w-4" />,
    roles: ['SUPPORT_AGENT', 'ADMIN'],
  },
  // Settings (all users)
  {
    name: 'Settings',
    href: '/dashboard/settings/security',
    icon: <Settings className="h-4 w-4" />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useUserRole();
  const user = useUser();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(userRole as any)
  );

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen p-4">
      {/* User Profile Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Avatar
            src={user?.avatar}
            alt={user?.name || ''}
            size="sm"
            fallback={user?.name || 'User'}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole?.toLowerCase()}
            </p>
          </div>
          {userRole === 'ADMIN' && (
            <Badge variant="brand" className="text-xs">
              Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-blue text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="space-y-2">
          <Link
            href="/marketplace"
            className="block px-3 py-2 text-sm text-brand-blue hover:text-brand-blue-dark font-medium"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/help"
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Help & Support
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
