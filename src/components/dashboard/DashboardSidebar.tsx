'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import {
  Home,
  Wallet,
  FileText,
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Shield,
  MessageSquare,
  Globe,
  Award,
  Star,
  BookOpen,
  Trophy,
  CheckSquare,
} from 'lucide-react';
import { useUserRole, useUser, useCreatorProfile } from '../../contexts/AuthContext';
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
  // Creator
  {
    name: 'My Content',
    href: '/dashboard/creative/content',
    icon: <FileText className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Earnings & Wallet',
    href: '/dashboard/creative/earnings-wallet',
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
  {
    name: 'Reputation',
    href: '/dashboard/creative/reputation',
    icon: <Trophy className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Learning Center',
    href: '/dashboard/creative/education',
    icon: <BookOpen className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'KYC Verification',
    href: '/onboarding/creator',
    icon: <CheckSquare className="h-4 w-4" />,
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
    name: 'Transactions',
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
    name: 'KYC Verification',
    href: '/dashboard/admin/verification',
    icon: <CheckSquare className="h-4 w-4" />,
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
  // Community (visible to creators and brands)
  {
    name: 'Community',
    href: '/community',
    icon: <MessageSquare className="h-4 w-4" />,
    roles: ['CREATOR', 'BRAND'],
  },
  // Support Agent
  {
    name: 'Support',
    href: '/dashboard/support',
    icon: <MessageSquare className="h-4 w-4" />,
    roles: ['SUPPORT_AGENT', 'ADMIN'],
  },
];

type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD';

const BADGE_COLORS: Record<BadgeTier, { bg: string; text: string; border: string }> = {
  BRONZE: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  SILVER: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-400' },
  GOLD: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
};

function getBadgeTier(isVerified: boolean, points: number): BadgeTier {
  if (isVerified && points >= 500) return 'GOLD';
  if (isVerified) return 'SILVER';
  return 'BRONZE';
}

function SidebarBadge({ tier }: { tier: BadgeTier }) {
  const colors = BADGE_COLORS[tier];
  const Icon = tier === 'GOLD' ? Star : tier === 'SILVER' ? Shield : Award;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${colors.bg} ${colors.border} ${colors.text}`}>
      <Icon className="h-3 w-3" />
      {tier === 'BRONZE' ? 'B' : tier === 'SILVER' ? 'S' : 'G'}
    </span>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useUserRole();
  const user = useUser();
  const creatorProfile = useCreatorProfile();

  const isVerified = creatorProfile?.isVerified || false;
  const badgeTier = getBadgeTier(isVerified, 120);

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
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              {userRole === 'CREATOR' && <SidebarBadge tier={badgeTier} />}
            </div>
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

    </div>
  );
}
