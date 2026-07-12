'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, AlertCircle, Smartphone, Building2 } from 'lucide-react';
import { Button, Input, CurrencyInput, Card, CardContent } from '@/components/ui';
import { Wallet as WalletType } from '@/types/api-contracts/wallet.types';
import { walletService } from '@/services/wallet.service';
import { withdrawalService } from '@/services/withdrawal.service';
import { useUser } from '@/contexts/AuthContext';

type WithdrawalMethod = 'MPESA' | 'BANK';

export default function NewWithdrawalPage() {
  const router = useRouter();
  const user = useUser();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [method, setMethod] = useState<WithdrawalMethod>('MPESA');
  const [amount, setAmount] = useState(0);
  
  // MPESA details
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  
  // Bank details
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const { wallet: walletData } = await walletService.getWalletBalance();
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    if (method === 'MPESA') {
      return 50; // Fixed fee for MPESA
    } else {
      return amount * 0.02; // 2% for bank transfer
    }
  };

  const calculateNetAmount = () => {
    return amount - calculateFee();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: wallet?.currency || 'KES',
    }).format(value);
  };

  const validateForm = () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!wallet || amount > wallet.balance) {
      setError('Insufficient balance');
      return false;
    }

    if (method === 'MPESA') {
      if (amount < 100) {
        setError('Minimum withdrawal amount is KES 100');
        return false;
      }
      if (amount > 150000) {
        setError('Maximum MPESA withdrawal is KES 150,000');
        return false;
      }
      if (!phoneNumber || !accountName) {
        setError('Please fill in all MPESA details');
        return false;
      }
    } else {
      if (amount < 150000) {
        setError('Minimum bank transfer amount is KES 150,000');
        return false;
      }
      if (!bankName || !accountNumber || !accountName) {
        setError('Please fill in all bank details');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await withdrawalService.createWithdrawal({
        amount,
        method,
        accountDetails: method === 'MPESA'
          ? { phoneNumber, accountName }
          : { bankName, accountNumber, accountName, branchCode },
      });
      router.push('/dashboard/creative/withdrawals?success=true');
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request Withdrawal</h1>
          <p className="text-muted-foreground mt-2">
            Transfer funds from your wallet
          </p>
        </div>
      </div>

      {wallet && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-blue/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Withdrawal Method</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod('MPESA')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  method === 'MPESA'
                    ? 'border-brand-blue bg-brand-blue/5'
                    : 'border-border hover:border-brand-blue/50'
                }`}
              >
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-brand-blue" />
                <p className="font-medium">M-PESA</p>
                <p className="text-xs text-muted-foreground mt-1">
                  KES 100 - 150,000
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMethod('BANK')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  method === 'BANK'
                    ? 'border-brand-blue bg-brand-blue/5'
                    : 'border-border hover:border-brand-blue/50'
                }`}
              >
                <Building2 className="h-8 w-8 mx-auto mb-2 text-brand-blue" />
                <p className="font-medium">Bank Transfer</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Above KES 150,000
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Withdrawal Amount</h2>
            
            <CurrencyInput
              value={amount}
              onChange={setAmount}
              currency={wallet?.currency}
              max={wallet?.balance}
              placeholder="Enter amount"
            />

            {amount > 0 && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium">{formatCurrency(calculateFee())}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">You will receive</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(calculateNetAmount())}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {method === 'MPESA' ? 'M-PESA Details' : 'Bank Details'}
            </h2>

            {method === 'MPESA' ? (
              <>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <Input
                  label="Account Name"
                  type="text"
                  placeholder="Your name as registered"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                <Input
                  label="Bank Name"
                  type="text"
                  placeholder="e.g., Equity Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
                <Input
                  label="Account Number"
                  type="text"
                  placeholder="Your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <Input
                  label="Account Name"
                  type="text"
                  placeholder="Account holder name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
                <Input
                  label="Branch Code (Optional)"
                  type="text"
                  placeholder="Branch code"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                />
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !amount}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
