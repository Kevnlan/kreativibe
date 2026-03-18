'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
  className?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  KES: 'KSh',
  UGX: 'USh',
  TZS: 'TSh',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function CurrencyInput({
  value = 0,
  onChange,
  currency = 'KES',
  placeholder = '0.00',
  disabled = false,
  error,
  min = 0,
  max,
  className,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = parseNumber(input);

    if (max !== undefined && numericValue > max) {
      return;
    }

    if (numericValue < min) {
      return;
    }

    setDisplayValue(input);
    onChange(numericValue);
  };

  const handleBlur = () => {
    const numericValue = parseNumber(displayValue);
    setDisplayValue(formatNumber(numericValue));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-muted-foreground font-medium">{currencySymbol}</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-12 pr-4 py-2.5 rounded-lg border bg-background',
            'text-foreground placeholder:text-muted-foreground',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'border-border hover:border-brand-blue'
          )}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {max && (
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum: {currencySymbol} {formatNumber(max)}
        </p>
      )}
    </div>
  );
}
