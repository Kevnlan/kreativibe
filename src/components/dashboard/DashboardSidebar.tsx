'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { 
  Home, 
  User, 
  Settings, 
  Wallet, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Shield
} from 'lucide-react';
import { useUserRole, useUser } from '../../contexts/AuthContext';
import { Avatar, Badge } from '../ui';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: ('CREATOR' | 'BRAND' | 'ADMIN')[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: <User className="h-4 w-4" />,
  },
  {
    name: 'Posts',
    href: '/dashboard/posts',
    icon: <FileText className="h-4 w-4" />,
    roles: ['CREATOR'],
  },
  {
    name: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: <ShoppingBag className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: <TrendingUp className="h-4 w-4" />,
    roles: ['BRAND'],
  },
  {
    name: 'Wallet',
    href: '/dashboard/wallet',
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: 'User Management',
    href: '/dashboard/admin/users',
    icon: <Users className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: <Shield className="h-4 w-4" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-4 w-4" />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useUserRole();
  const user = useUser();

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
    </div>
  );
}
