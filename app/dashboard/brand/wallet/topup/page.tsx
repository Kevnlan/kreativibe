'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Building2, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function WalletTopUpPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'MPESA' | 'BANK'>('MPESA');
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    if (amount < 100) {
      alert('Minimum top-up amount is KES 100');
      return;
    }

    setIsProcessing(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (method === 'MPESA') {
        alert(`M-PESA STK push sent to ${phoneNumber}. Please enter your PIN to complete the transaction.`);
      } else {
        alert('Bank transfer instructions sent to your email. Please complete the transfer within 24 hours.');
      }
      
      router.push('/dashboard/brand/wallet?topup=success');
    } catch (error) {
      console.error('Top-up failed:', error);
      alert('Top-up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Wallet
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Top Up Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Add funds to your wallet to purchase content
        </p>
      </div>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('MPESA')}
              className={`p-4 border-2 rounded-lg transition-all ${
                method === 'MPESA'
                  ? 'border-green-600 bg-green-50'
                  : 'border-border hover:border-green-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${method === 'MPESA' ? 'bg-green-600' : 'bg-muted'}`}>
                  <CreditCard className={`h-6 w-6 ${method === 'MPESA' ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <p className="font-semibold">M-PESA</p>
                  <p className="text-xs text-muted-foreground">Instant</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMethod('BANK')}
              className={`p-4 border-2 rounded-lg transition-all ${
                method === 'BANK'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-border hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${method === 'BANK' ? 'bg-blue-600' : 'bg-muted'}`}>
                  <Building2 className={`h-6 w-6 ${method === 'BANK' ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">1-2 days</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Amount Input */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Amount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount (KES)
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="100"
              step="100"
              placeholder="0"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-2xl font-semibold"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum amount: KES 100
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 20000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount)}
                className="px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                {formatCurrency(quickAmount)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      {method === 'MPESA' && (
        <Card>
          <CardHeader>
            <CardTitle>M-PESA Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>How it works:</strong> You'll receive an M-PESA STK push on your phone. 
                Enter your PIN to complete the payment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {method === 'BANK' && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-blue-900">Transfer to:</p>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Bank:</strong> Equity Bank</p>
                <p><strong>Account Name:</strong> Kreativibe Limited</p>
                <p><strong>Account Number:</strong> 0123456789</p>
                <p><strong>Branch:</strong> Westlands</p>
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-900">
                Please use your email address as the payment reference. 
                Funds will be credited within 1-2 business days after verification.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {amount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="font-semibold">{formatCurrency(0)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(amount)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <Button
        onClick={handleTopUp}
        className="w-full"
        size="lg"
        disabled={amount < 100 || (method === 'MPESA' && !phoneNumber) || isProcessing}
        loading={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Top Up ${formatCurrency(amount)}`}
      </Button>
    </div>
  );
}
