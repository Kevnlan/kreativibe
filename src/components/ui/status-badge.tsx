'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'approved';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-orange-100 text-orange-800 border-orange-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function StatusBadge({
  variant = 'default',
  children,
  className,
  size = 'md',
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getStatusVariant(status: string): BadgeVariant {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('pending')) return 'pending';
  if (statusLower.includes('processing')) return 'processing';
  if (statusLower.includes('completed') || statusLower.includes('success')) return 'completed';
  if (statusLower.includes('approved') || statusLower.includes('verified')) return 'approved';
  if (statusLower.includes('rejected') || statusLower.includes('failed')) return 'rejected';
  if (statusLower.includes('warning')) return 'warning';
  
  return 'default';
}
