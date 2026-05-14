'use client';

import { useState } from 'react';
import { PaymentMethodSelector, PaymentMethod } from '@/components/payments/PaymentMethodSelector';
import { BankTransferForm, BankTransferData } from '@/components/payments/BankTransferForm';
import { PaymentConfirmation, PaymentStatus } from '@/components/payments/PaymentConfirmation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Smartphone, CreditCard, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const paymentMethods: PaymentMethod[] = [
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

const mockBankDetails: BankTransferData = {
  accountName: 'Kreativibe Limited',
  accountNumber: '0123456789',
  bankName: 'Equity Bank',
  branch: 'Nairobi Branch',
  reference: '',
  amount: 150000,
  currency: 'KES',
};

export default function BankTransferPage() {
  const router = useRouter();
  const [step, setStep] = useState<'method' | 'transfer' | 'confirmation'>('method');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [amount] = useState(150000);
  const [currency] = useState('KES');
  const [transactionId, setTransactionId] = useState('');

  const handleBack = () => {
    router.push('/dashboard/brand/wallet');
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    if (methodId === 'mpesa') {
      router.push('/dashboard/brand/wallet/mpesa');
    } else if (methodId === 'card') {
      router.push('/dashboard/brand/wallet/card');
    } else if (methodId === 'bank') {
      setStep('transfer');
    }
  };

  const handleConfirmTransfer = (reference: string) => {
    setStep('confirmation');
    setPaymentStatus('processing');
    
    // Simulate processing
    setTimeout(() => {
      setPaymentStatus('completed');
      setTransactionId('BANK' + Date.now());
    }, 2000);
  };

  const handleRetry = () => {
    setStep('transfer');
    setPaymentStatus('pending');
  };

  const handleContinue = () => {
    router.push('/dashboard/brand/wallet');
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt');
  };

  const handleShare = () => {
    console.log('Sharing receipt');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Wallet</h1>
              <p className="text-muted-foreground">Add funds via Bank Transfer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {step === 'method' && (
          <PaymentMethodSelector
            methods={paymentMethods}
            selectedMethod={selectedMethod}
            onSelect={handleSelectMethod}
            amount={amount}
            currency={currency}
          />
        )}

        {step === 'transfer' && (
          <div>
            <Button
              variant="ghost"
              onClick={() => setStep('method')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="mb-4"
            >
              Change Method
            </Button>
            <BankTransferForm
              amount={amount}
              currency={currency}
              bankDetails={mockBankDetails}
              onConfirm={handleConfirmTransfer}
              onDownloadReceipt={handleDownloadReceipt}
            />
          </div>
        )}

        {step === 'confirmation' && (
          <PaymentConfirmation
            status={paymentStatus}
            amount={amount}
            currency={currency}
            paymentMethod="Bank Transfer"
            transactionId={transactionId}
            onRetry={handleRetry}
            onDownloadReceipt={handleDownloadReceipt}
            onShare={handleShare}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
