'use client';

import { useState } from 'react';
import { AlertCircle, X, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface KYCBannerProps {
  userRole: 'CREATOR' | 'BRAND';
  isKYCComplete: boolean;
  onDismiss?: () => void;
}

export function KYCBanner({ userRole, isKYCComplete, onDismiss }: KYCBannerProps) {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isKYCComplete || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleComplete = () => {
    if (userRole === 'CREATOR') {
      router.push('/onboarding/creator');
    } else {
      router.push('/onboarding/brand');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-1">
              Complete Your {userRole === 'CREATOR' ? 'Creator' : 'Brand'} Verification
            </h3>
            <p className="text-sm text-orange-800 mb-3">
              {userRole === 'CREATOR' 
                ? 'Get verified to start earning from your content. Upload your KYC documents and complete your profile to unlock all features.'
                : 'Complete your business verification to start working with creators. Our team will review your application within 24-48 hours.'
              }
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleComplete}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Complete Verification
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
              >
                Remind me later
              </Button>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-orange-600 hover:text-orange-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
