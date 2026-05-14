'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CardPaymentData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
  currency: string;
}

interface CardPaymentFormProps {
  amount: number;
  currency: string;
  onSubmit: (data: CardPaymentData) => Promise<void>;
  isLoading?: boolean;
}

export function CardPaymentForm({ amount, currency, onSubmit, isLoading }: CardPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      setError('Please enter a valid card number');
      return;
    }
    if (!cardholderName.trim()) {
      setError('Please enter the cardholder name');
      return;
    }
    if (!expiryMonth || !expiryYear) {
      setError('Please enter the expiry date');
      return;
    }
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      return;
    }

    try {
      await onSubmit({
        cardNumber: cleanedCardNumber,
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv,
        amount,
        currency,
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Card Payment</CardTitle>
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

          {/* Card Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className={cn(
                "w-full px-4 py-3 rounded-lg border text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ring",
                error ? "border-destructive" : "border-input"
              )}
              maxLength={19}
            />
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                setError('');
              }}
              placeholder="JOHN DOE"
              className={cn(
                "w-full px-4 py-3 rounded-lg border uppercase focus:outline-none focus:ring-2 focus:ring-ring",
                error ? "border-destructive" : "border-input"
              )}
            />
          </div>

          {/* Expiry Date & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <div className="flex gap-2">
                <select
                  value={expiryMonth}
                  onChange={(e) => {
                    setExpiryMonth(e.target.value);
                    setError('');
                  }}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring",
                    error ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                      {(i + 1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={expiryYear}
                  onChange={(e) => {
                    setExpiryYear(e.target.value);
                    setError('');
                  }}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring",
                    error ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">YY</option>
                  {years.map(year => (
                    <option key={year} value={year.toString()}>
                      {year.toString().slice(-2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.slice(0, 4));
                  setError('');
                }}
                placeholder="•••"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-ring",
                  error ? "border-destructive" : "border-input"
                )}
                maxLength={4}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}

          {/* Security Info */}
          <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
            <Lock className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-brand-blue">Secure Payment</p>
              <p className="text-brand-blue/80">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv || isLoading}
            leftIcon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          >
            {isLoading ? 'Processing...' : `Pay ${currency} ${amount.toLocaleString()}`}
          </Button>

          {/* Card Icons */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-xs">Powered by</span>
            <span className="text-sm font-semibold">Stripe</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
