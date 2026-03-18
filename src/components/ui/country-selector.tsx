'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CountryOption {
  id: string;
  name: string;
  code: string;
  currency: string;
  flag?: string;
}

interface CountrySelectorProps {
  value?: string;
  onChange: (countryId: string) => void;
  countries?: CountryOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const DEFAULT_COUNTRIES: CountryOption[] = [
  { id: '1', name: 'Kenya', code: 'KE', currency: 'KES', flag: '🇰🇪' },
  { id: '2', name: 'Uganda', code: 'UG', currency: 'UGX', flag: '🇺🇬' },
  { id: '3', name: 'Tanzania', code: 'TZ', currency: 'TZS', flag: '🇹🇿' },
];

export function CountrySelector({
  value,
  onChange,
  countries = DEFAULT_COUNTRIES,
  placeholder = 'Select country',
  disabled = false,
  error,
  className,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  useEffect(() => {
    if (value) {
      const country = countries.find(c => c.id === value);
      setSelectedCountry(country || null);
    }
  }, [value, countries]);

  const handleSelect = (country: CountryOption) => {
    setSelectedCountry(country);
    onChange(country.id);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border',
          'bg-background text-foreground transition-colors',
          'hover:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500',
          !error && 'border-border'
        )}
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div className="text-left">
                <div className="font-medium">{selectedCountry.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedCountry.code} • {selectedCountry.currency}
                </div>
              </div>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                    'hover:bg-muted',
                    selectedCountry?.id === country.id && 'bg-brand-blue/10'
                  )}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {country.code} • {country.currency}
                    </div>
                  </div>
                  {selectedCountry?.id === country.id && (
                    <Check className="h-4 w-4 text-brand-blue" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
