'use client';

import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountryBadgeProps {
  countryCode: string;
  countryName?: string;
  showFlag?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FLAGS: Record<string, string> = {
  KE: '🇰🇪',
  UG: '🇺🇬',
  TZ: '🇹🇿',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function CountryBadge({
  countryCode,
  countryName,
  showFlag = true,
  showName = true,
  size = 'md',
  className,
}: CountryBadgeProps) {
  const flag = FLAGS[countryCode];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-muted font-medium',
        sizeStyles[size],
        className
      )}
    >
      {showFlag && flag ? (
        <span className={size === 'sm' ? 'text-sm' : 'text-base'}>{flag}</span>
      ) : (
        <Globe className={cn('h-3 w-3', size === 'lg' && 'h-4 w-4')} />
      )}
      {showName && (countryName || countryCode)}
    </span>
  );
}
