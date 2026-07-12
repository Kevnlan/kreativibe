'use client';

import { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, Download, RefreshCw } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { TwoFactorStatus } from '@/types/api-contracts/2fa.types';
import { twoFactorService } from '@/services/2fa.service';
import { useRouter } from 'next/navigation';

export default function SecuritySettingsPage() {
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTwoFactorStatus();
  }, []);

  const loadTwoFactorStatus = async () => {
    setLoading(true);
    try {
      const status = await twoFactorService.getStatus();
      setTwoFactorStatus(status);
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = () => {
    router.push('/dashboard/settings/security/2fa-setup');
  };

  const handleDisable2FA = () => {
    router.push('/dashboard/settings/security/2fa-disable');
  };

  const handleRegenerateBackupCodes = () => {
    router.push('/dashboard/settings/security/backup-codes');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and authentication methods
        </p>
      </div>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <Shield className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <StatusBadge variant={twoFactorStatus.enabled ? 'success' : 'warning'}>
              {twoFactorStatus.enabled ? 'Enabled' : 'Disabled'}
            </StatusBadge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {twoFactorStatus.enabled
                  ? 'Two-factor authentication is currently enabled for your account. You will be asked for a verification code when signing in.'
                  : 'Enable two-factor authentication to add an extra layer of security to your account. You will need an authenticator app like Google Authenticator or Authy.'}
              </p>

              {twoFactorStatus.enabled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Backup codes remaining: {twoFactorStatus.backupCodesRemaining || 0}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleRegenerateBackupCodes}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Backup Codes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDisable2FA}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={handleSetup2FA}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/10 rounded-lg">
              <Key className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <CardTitle>Password</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Change your password regularly to keep your account secure
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <Smartphone className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage devices where you're currently signed in
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-muted-foreground">
                  Windows • Chrome • Last active now
                </p>
              </div>
              <StatusBadge variant="success">Active</StatusBadge>
            </div>

            <Button variant="outline" className="w-full">
              View All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
