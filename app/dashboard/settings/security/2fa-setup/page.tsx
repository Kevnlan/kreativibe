'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Key, Download, CheckCircle } from 'lucide-react';
import { Button, Input, MultiStepWizard, Card, CardContent } from '@/components/ui';
import type { WizardStep } from '@/components/ui/multi-step-wizard';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupData, setSetupData] = useState({
    secret: 'JBSWY3DPEHPK3PXP',
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    backupCodes: ['12345678', '23456789', '34567890', '45678901', '56789012'],
  });

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard/settings/security?2fa=enabled');
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = setupData.backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kreativibe-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps: WizardStep[] = [
    {
      id: 'install-app',
      title: 'Install App',
      description: 'Get an authenticator app',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex p-4 bg-brand-blue/10 rounded-full mb-4">
              <Smartphone className="h-12 w-12 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Install an Authenticator App</h2>
            <p className="text-muted-foreground">
              You'll need an authenticator app to generate verification codes
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recommended Apps:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Google Authenticator</p>
                    <p className="text-sm text-muted-foreground">iOS & Android</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Authy</p>
                    <p className="text-sm text-muted-foreground">iOS, Android & Desktop</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Microsoft Authenticator</p>
                    <p className="text-sm text-muted-foreground">iOS & Android</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'scan-qr',
      title: 'Scan QR Code',
      description: 'Link your account',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Scan the QR Code</h2>
            <p className="text-muted-foreground">
              Open your authenticator app and scan this QR code
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-6 bg-white rounded-lg border-2 border-border">
              <img
                src={setupData.qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">Can't scan the QR code?</p>
              <p className="text-sm text-muted-foreground mb-3">
                Enter this code manually in your authenticator app:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                  {setupData.secret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(setupData.secret)}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'verify',
      title: 'Verify',
      description: 'Enter verification code',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex p-4 bg-brand-blue/10 rounded-full mb-4">
              <Key className="h-12 w-12 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>
            <p className="text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
            />
            <p className="text-sm text-muted-foreground text-center mt-2">
              The code changes every 30 seconds
            </p>
          </div>
        </div>
      ),
      isValid: verificationCode.length === 6,
    },
    {
      id: 'backup-codes',
      title: 'Backup Codes',
      description: 'Save recovery codes',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Save Your Backup Codes</h2>
            <p className="text-muted-foreground">
              Store these codes in a safe place. You can use them to access your account if you lose your device.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {setupData.backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-muted rounded font-mono text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={downloadBackupCodes}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Backup Codes
              </Button>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Each backup code can only be used once. Keep them secure and don't share them with anyone.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Settings
        </Button>
      </div>

      <MultiStepWizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
        onCancel={() => router.back()}
        canGoNext={currentStep !== 2 || verificationCode.length === 6}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
