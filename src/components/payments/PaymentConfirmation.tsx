'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, Download, Share2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PaymentConfirmationProps {
  status: PaymentStatus;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onDownloadReceipt?: () => void;
  onShare?: () => void;
  onContinue?: () => void;
}

export function PaymentConfirmation({
  status,
  amount,
  currency,
  paymentMethod,
  transactionId,
  errorMessage,
  onRetry,
  onDownloadReceipt,
  onShare,
  onContinue,
}: PaymentConfirmationProps) {
  const [countdown, setCountdown] = useState(5);

  // Countdown for redirect on success
  useState(() => {
    if (status === 'completed' && onContinue) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onContinue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  });

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/50',
      title: 'Payment Pending',
      message: 'Your payment is being processed. Please wait...',
    },
    processing: {
      icon: RefreshCw,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      borderColor: 'border-brand-blue/50',
      title: 'Processing Payment',
      message: 'Please wait while we process your payment...',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/50',
      title: 'Payment Successful!',
      message: 'Your payment has been processed successfully.',
    },
    failed: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/50',
      title: 'Payment Failed',
      message: errorMessage || 'Your payment could not be processed. Please try again.',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      title: 'Payment Cancelled',
      message: 'The payment was cancelled.',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn("border-2", config.borderColor)}>
      <CardContent className="p-8">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              config.bgColor
            )}
          >
            <StatusIcon className={cn("h-10 w-10", config.color, status === 'processing' && 'animate-spin')} />
          </div>
        </div>

        {/* Title */}
        <h2 className={cn("text-2xl font-bold text-center mb-2", config.color)}>
          {config.title}
        </h2>

        {/* Message */}
        <p className="text-center text-muted-foreground mb-6">{config.message}</p>

        {/* Payment Details */}
        {(status === 'completed' || status === 'failed' || status === 'cancelled') && (
          <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-medium">
                {currency} {amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="font-medium font-mono text-sm">{transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {status === 'completed' && (
            <>
              {onDownloadReceipt && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onDownloadReceipt}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download Receipt
                </Button>
              )}
              {onShare && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onShare}
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  Share Receipt
                </Button>
              )}
              {onContinue && (
                <div className="text-center">
                  <Button
                    variant="brand"
                    className="w-full"
                    onClick={onContinue}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Continue ({countdown}s)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Redirecting automatically...
                  </p>
                </div>
              )}
            </>
          )}

          {status === 'failed' && onRetry && (
            <Button
              variant="brand"
              className="w-full"
              onClick={onRetry}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
          )}

          {status === 'cancelled' && onContinue && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onContinue}
            >
              Return to Dashboard
            </Button>
          )}

          {(status === 'pending' || status === 'processing') && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing your payment...
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        {status === 'failed' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a href="#" className="text-brand-blue hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
