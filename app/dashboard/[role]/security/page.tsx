'use client';

import { useState, useEffect } from 'react';
import { TwoFactorAuth, TwoFactorAuthData } from '@/components/auth/TwoFactorAuth';
import { SecuritySettings, SecuritySetting } from '@/components/auth/SecuritySettings';
import { CountryConfig, CountryConfig as CountryConfigType } from '@/components/auth/CountryConfig';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { twoFactorService } from '@/services/2fa.service';
import { countryService } from '@/services/country.service';
import { Country } from '@/types/api-contracts/country.types';

const defaultSecuritySettings: SecuritySetting[] = [
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

function mapCountryToConfig(c: Country): CountryConfigType {
  return {
    id: c.id,
    name: c.name,
    code: c.code,
    currency: c.currency,
    taxRate: c.taxRate,
    payoutMethods: c.config?.payoutMethods?.map(p => p.type) ?? [],
    enabled: c.isActive,
  };
}

export default function SecurityPage() {
  const router = useRouter();
  const [view, setView] = useState<'2fa' | 'security' | 'countries'>('2fa');
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorAuthData>({
    enabled: false,
    method: 'authenticator',
  });
  const [countries, setCountries] = useState<CountryConfigType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const status = await twoFactorService.getStatus();
      setTwoFactorData({
        enabled: status.enabled,
        method: 'authenticator',
        backupCodes: [],
      });
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    }
    try {
      const response = await countryService.getCountries();
      setCountries((response.countries || []).map(mapCountryToConfig));
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEnable2FA = async (method: 'sms' | 'email' | 'authenticator') => {
    try {
      await twoFactorService.setup();
      setTwoFactorData(prev => ({ ...prev, enabled: true, method }));
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await twoFactorService.disable({ password: '', code: '' });
      setTwoFactorData(prev => ({ ...prev, enabled: false }));
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
    }
  };

  const handleGenerateBackupCodes = async () => {
    try {
      const response = await twoFactorService.regenerateBackupCodes();
      setTwoFactorData(prev => ({ ...prev, backupCodes: response.backupCodes }));
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
    }
  };

  const handleChange2FAMethod = (method: 'sms' | 'email' | 'authenticator') => {
    setTwoFactorData(prev => ({ ...prev, method }));
  };

  const handleSaveSecuritySettings = (settings: SecuritySetting[]) => {
    console.log('Saving security settings:', settings);
  };

  const handleAddCountry = async (country: Omit<CountryConfigType, 'id'>) => {
    try {
      await countryService.createCountry({
        name: country.name,
        code: country.code,
        currency: country.currency,
        taxRate: country.taxRate,
        config: {
          kycRules: [],
          payoutMethods: [],
          taxRules: [],
          currencies: [country.currency],
          minWithdrawalAmount: 0,
          maxWithdrawalAmount: 0,
        },
      });
      loadData();
    } catch (error) {
      console.error('Failed to add country:', error);
    }
  };

  const handleUpdateCountry = async (countryId: string, updates: Partial<CountryConfigType>) => {
    try {
      await countryService.updateCountry(countryId, {
        name: updates.name,
        code: updates.code,
        currency: updates.currency,
        taxRate: updates.taxRate,
        isActive: updates.enabled,
      });
      loadData();
    } catch (error) {
      console.error('Failed to update country:', error);
    }
  };

  const handleDeleteCountry = async (countryId: string) => {
    try {
      await countryService.deleteCountry(countryId);
      loadData();
    } catch (error) {
      console.error('Failed to delete country:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading security settings...
      </div>
    );
  }

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
          data={twoFactorData}
          onEnable={handleEnable2FA}
          onDisable={handleDisable2FA}
          onGenerateBackupCodes={handleGenerateBackupCodes}
          onChangeMethod={handleChange2FAMethod}
        />
      )}

      {view === 'security' && (
        <SecuritySettings
          settings={defaultSecuritySettings}
          onSave={handleSaveSecuritySettings}
        />
      )}

      {view === 'countries' && (
        <CountryConfig
          countries={countries}
          onAdd={handleAddCountry}
          onUpdate={handleUpdateCountry}
          onDelete={handleDeleteCountry}
        />
      )}
    </div>
  );
}
