'use client';

import { useState } from 'react';
import { Smartphone, CreditCard, Building2, Check, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card' | 'bank';
  name: string;
  icon: any;
  description: string;
  fee?: number;
  processingTime?: string;
  recommended?: boolean;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod?: string;
  onSelect: (methodId: string) => void;
  amount: number;
  currency: string;
}

const defaultMethods: PaymentMethod[] = [
  {
    id: 'mpesa',
    type: 'mpesa',
    name: 'M-PESA',
    icon: Smartphone,
    description: 'Instant mobile money payment',
    fee: 0,
    processingTime: 'Instant',
    recommended: true,
  },
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay with Visa, Mastercard, or other cards',
    fee: 0,
    processingTime: 'Instant',
  },
  {
    id: 'bank',
    type: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct bank transfer',
    fee: 0,
    processingTime: '1-2 business days',
  },
];

export function PaymentMethodSelector({
  methods = defaultMethods,
  selectedMethod,
  onSelect,
  amount,
  currency,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Payment Method</CardTitle>
        <p className="text-sm text-muted-foreground">
          Amount: {currency} {amount.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all hover:border-brand-blue/50",
                isSelected ? "border-brand-blue bg-brand-blue/5" : "border-border"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-brand-blue text-white" : "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{method.name}</h4>
                    {method.recommended && (
                      <Badge variant="success" className="text-xs">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {method.fee !== undefined && (
                      <span>Fee: {method.fee === 0 ? 'Free' : `${currency} ${method.fee}`}</span>
                    )}
                    {method.processingTime && (
                      <span>• {method.processingTime}</span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
