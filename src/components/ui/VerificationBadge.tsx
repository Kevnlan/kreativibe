'use client';

import { Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function VerificationBadge({ 
  isVerified, 
  size = 'md', 
  showLabel = false,
  className 
}: VerificationBadgeProps) {
  if (!isVerified) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSize = sizeClasses[size];

  if (showLabel) {
    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200',
        className
      )}>
        <Shield className={cn(iconSize, 'text-blue-600')} />
        <span className="text-xs font-semibold text-blue-700">Verified</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center justify-center rounded-full bg-blue-500',
      size === 'sm' && 'h-5 w-5',
      size === 'md' && 'h-6 w-6',
      size === 'lg' && 'h-8 w-8',
      className
    )}>
      <CheckCircle className={cn(iconSize, 'text-white')} />
    </div>
  );
}
