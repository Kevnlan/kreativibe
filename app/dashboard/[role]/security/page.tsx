'use client';

import { useState } from 'react';
import { TwoFactorAuth, TwoFactorAuthData } from '@/components/auth/TwoFactorAuth';
import { SecuritySettings, SecuritySetting } from '@/components/auth/SecuritySettings';
import { CountryConfig, CountryConfig as CountryConfigType } from '@/components/auth/CountryConfig';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockTwoFactorData: TwoFactorAuthData = {
  enabled: false,
  method: 'sms',
  phoneNumber: '+254 700 000 000',
  email: 'user@example.com',
  backupCodes: [],
};

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: 'password_length',
    name: 'Minimum Password Length',
    description: 'Require passwords to be at least this many characters',
    type: 'select',
    value: '8',
    options: ['6', '8', '12', '16'],
  },
  {
    id: 'password_uppercase',
    name: 'Require Uppercase Letters',
    description: 'Require at least one uppercase letter in passwords',
    type: 'boolean',
    value: true,
  },
  {
    id: 'session_timeout',
    name: 'Session Timeout',
    description: 'Auto-logout after inactivity (minutes)',
    type: 'select',
    value: '30',
    options: ['15', '30', '60', '120'],
  },
  {
    id: 'device_recognition',
    name: 'Device Recognition',
    description: 'Remember trusted devices for easier login',
    type: 'boolean',
    value: true,
  },
];

const mockCountryConfig: CountryConfigType[] = [
  {
    id: 'kenya',
    name: 'Kenya',
    code: 'KE',
    currency: 'KES',
    taxRate: 3,
    payoutMethods: ['MPESA', 'BANK_TRANSFER'],
    enabled: true,
  },
  {
    id: 'uganda',
    name: 'Uganda',
    code: 'UG',
    currency: 'UGX',
    taxRate: 6,
    payoutMethods: ['MTN_MOBILE_MONEY', 'BANK_TRANSFER'],
    enabled: true,
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    code: 'TZ',
    currency: 'TZS',
    taxRate: 5,
    payoutMethods: ['VODACOM_MPESA', 'BANK_TRANSFER'],
    enabled: false,
  },
];

export default function SecurityPage() {
  const router = useRouter();
  const [view, setView] = useState<'2fa' | 'security' | 'countries'>('2fa');

  const handleBack = () => {
    router.back();
  };

  const handleEnable2FA = (method: 'sms' | 'email' | 'authenticator') => {
    console.log('Enabling 2FA with method:', method);
  };

  const handleDisable2FA = () => {
    console.log('Disabling 2FA');
  };

  const handleGenerateBackupCodes = () => {
    console.log('Generating backup codes');
  };

  const handleChange2FAMethod = (method: 'sms' | 'email' | 'authenticator') => {
    console.log('Changing 2FA method to:', method);
  };

  const handleSaveSecuritySettings = (settings: SecuritySetting[]) => {
    console.log('Saving security settings:', settings);
  };

  const handleAddCountry = (country: Omit<CountryConfigType, 'id'>) => {
    console.log('Adding country:', country);
  };

  const handleUpdateCountry = (countryId: string, updates: Partial<CountryConfigType>) => {
    console.log('Updating country:', countryId, updates);
  };

  const handleDeleteCountry = (countryId: string) => {
    console.log('Deleting country:', countryId);
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
            <Shield className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground">Manage your account security and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === '2fa' ? 'brand' : 'outline'}
          onClick={() => setView('2fa')}
        >
          Two-Factor Auth
        </Button>
        <Button
          variant={view === 'security' ? 'brand' : 'outline'}
          onClick={() => setView('security')}
        >
          Security Settings
        </Button>
        <Button
          variant={view === 'countries' ? 'brand' : 'outline'}
          onClick={() => setView('countries')}
        >
          Country Config
        </Button>
      </div>

      {/* Content */}
      {view === '2fa' && (
        <TwoFactorAuth
          data={mockTwoFactorData}
          onEnable={handleEnable2FA}
          onDisable={handleDisable2FA}
          onGenerateBackupCodes={handleGenerateBackupCodes}
          onChangeMethod={handleChange2FAMethod}
        />
      )}

      {view === 'security' && (
        <SecuritySettings
          settings={mockSecuritySettings}
          onSave={handleSaveSecuritySettings}
        />
      )}

      {view === 'countries' && (
        <CountryConfig
          countries={mockCountryConfig}
          onAdd={handleAddCountry}
          onUpdate={handleUpdateCountry}
          onDelete={handleDeleteCountry}
        />
      )}
    </div>
  );
}
