'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw, XCircle, CheckCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface FailedPayout {
  id: string;
  creative: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
  };
  failureReason: string;
  failureCode: string;
  attemptCount: number;
  lastAttemptAt: string;
  nextRetryAt?: string;
  status: 'failed' | 'retrying' | 'resolved';
}

interface FailedPayoutHandlerProps {
  failedPayouts: FailedPayout[];
  onRetry: (id: string) => void;
  onResolve: (id: string, resolution: string) => void;
  onManualTransfer: (id: string) => void;
}

const failureReasons = {
  INSUFFICIENT_FUNDS: 'Insufficient funds in platform account',
  INVALID_ACCOUNT: 'Invalid bank account details',
  BANK_ERROR: 'Bank processing error',
  TIMEOUT: 'Transaction timeout',
  NETWORK_ERROR: 'Network connectivity issue',
  OTHER: 'Other error',
};

export function FailedPayoutHandler({
  failedPayouts,
  onRetry,
  onResolve,
  onManualTransfer,
}: FailedPayoutHandlerProps) {
  const [expandedPayouts, setExpandedPayouts] = useState<Set<string>>(new Set());
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  const toggleExpand = (id: string) => {
    setExpandedPayouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRetry = (id: string) => {
    onRetry(id);
  };

  const handleResolve = (id: string) => {
    const notes = resolutionNotes[id];
    if (notes) {
      onResolve(id, notes);
    }
  };

  const handleManualTransfer = (id: string) => {
    onManualTransfer(id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Failed Payouts</CardTitle>
          </div>
          <Badge variant="destructive">{failedPayouts.length} Failed</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {failedPayouts.map((payout) => {
            const isExpanded = expandedPayouts.has(payout.id);

            return (
              <div
                key={payout.id}
                className="border rounded-lg overflow-hidden border-destructive/50 bg-destructive/5"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-destructive/10"
                  onClick={() => toggleExpand(payout.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-5 w-5 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{payout.creative.name}</h4>
                        <Badge variant="destructive" className="text-xs">{payout.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{payout.creative.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="font-medium">
                          {payout.currency} {payout.amount.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="text-muted-foreground">
                          {payout.bankDetails.bankName}
                        </span>
                        <span>•</span>
                        <span className="text-muted-foreground">
                          {payout.attemptCount} attempt{payout.attemptCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Expand */}
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                    {/* Failure Details */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Failure Details</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium">{failureReasons[payout.failureCode as keyof typeof failureReasons] || payout.failureReason}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Code:</span>
                          <span className="font-mono text-xs">{payout.failureCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Attempt:</span>
                          <span className="font-medium">{new Date(payout.lastAttemptAt).toLocaleString()}</span>
                        </div>
                        {payout.nextRetryAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Next Retry:</span>
                            <span className="font-medium">{new Date(payout.nextRetryAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Bank Details</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="font-medium">{payout.bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account:</span>
                          <span className="font-mono">{payout.bankDetails.accountNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Notes */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Resolution Notes</h5>
                      <textarea
                        value={resolutionNotes[payout.id] || ''}
                        onChange={(e) => setResolutionNotes(prev => ({ ...prev, [payout.id]: e.target.value }))}
                        placeholder="Add notes about how this was resolved..."
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => handleRetry(payout.id)}
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                      >
                        Retry
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleResolve(payout.id)}
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                      >
                        Mark Resolved
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManualTransfer(payout.id)}
                      >
                        Manual Transfer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {failedPayouts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-success" />
            <p>No failed payouts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
