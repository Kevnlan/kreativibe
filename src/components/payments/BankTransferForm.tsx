'use client';

import { useState } from 'react';
import { Building2, Copy, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface BankTransferData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  reference: string;
  amount: number;
  currency: string;
}

interface BankTransferFormProps {
  amount: number;
  currency: string;
  bankDetails: BankTransferData;
  onConfirm: (reference: string) => void;
  onDownloadReceipt?: () => void;
}

export function BankTransferForm({ amount, currency, bankDetails, onConfirm, onDownloadReceipt }: BankTransferFormProps) {
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!reference.trim()) {
      setError('Please enter a reference number');
      return;
    }
    onConfirm(reference);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Bank Transfer</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Amount to Transfer</p>
          <p className="text-3xl font-bold">
            {currency} {amount.toLocaleString()}
          </p>
        </div>

        {/* Bank Details */}
        <div className="space-y-3">
          <h3 className="font-semibold">Bank Account Details</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Account Name</p>
                <p className="font-medium">{bankDetails.accountName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleCopy(bankDetails.accountName)}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="font-medium font-mono">{bankDetails.accountNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleCopy(bankDetails.accountNumber)}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Bank Name</p>
                <p className="font-medium">{bankDetails.bankName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleCopy(bankDetails.bankName)}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Branch</p>
                <p className="font-medium">{bankDetails.branch}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleCopy(bankDetails.branch)}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Reference Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => {
              setReference(e.target.value);
              setError('');
            }}
            placeholder="Enter your transaction reference number"
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring",
              error ? "border-destructive" : "border-input"
            )}
          />
          {error && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
          <AlertCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-brand-blue">Important</p>
            <p className="text-brand-blue/80">
              Bank transfers take 1-2 business days to process. Please use the exact amount and include the reference number for faster processing.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onDownloadReceipt && (
            <Button
              variant="outline"
              onClick={onDownloadReceipt}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Download Receipt
            </Button>
          )}
          <Button
            variant="brand"
            onClick={handleConfirm}
            disabled={!reference.trim()}
            className="flex-1"
            leftIcon={<Upload className="h-4 w-4" />}
          >
            Confirm Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
