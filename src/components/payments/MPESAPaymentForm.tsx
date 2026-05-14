'use client';

import { useState } from 'react';
import { Smartphone, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface MPESAPaymentData {
  phoneNumber: string;
  amount: number;
  currency: string;
}

interface MPESAPaymentFormProps {
  amount: number;
  currency: string;
  onSubmit: (data: MPESAPaymentData) => Promise<void>;
  isLoading?: boolean;
}

export function MPESAPaymentForm({ amount, currency, onSubmit, isLoading }: MPESAPaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    // Ensure it starts with 254 for Kenya
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    }
    if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (phoneNumber.length !== 12 || !phoneNumber.startsWith('254')) {
      setError('Please enter a valid M-PESA phone number (format: 2547XXXXXXXX)');
      return;
    }

    try {
      await onSubmit({
        phoneNumber,
        amount,
        currency,
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">M-PESA Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Display */}
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold">
              {currency} {amount.toLocaleString()}
            </p>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">M-PESA Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="2547XXXXXXXX"
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-lg border text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring",
                  error ? "border-destructive" : "border-input"
                )}
                maxLength={12}
              />
              <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
            <Shield className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-brand-blue">Secure Payment</p>
              <p className="text-brand-blue/80">
                You will receive an STK prompt on your phone to confirm the payment.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={!phoneNumber || isLoading}
            leftIcon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
          >
            {isLoading ? 'Processing...' : 'Pay with M-PESA'}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to the M-PESA terms and conditions.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
