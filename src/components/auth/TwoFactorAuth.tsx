'use client';

import { useState } from 'react';
import { Shield, Smartphone, Mail, CheckCircle, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface TwoFactorAuthData {
  enabled: boolean;
  method: 'sms' | 'email' | 'authenticator';
  phoneNumber?: string;
  email?: string;
  backupCodes?: string[];
  lastUsed?: string;
}

interface TwoFactorAuthProps {
  data: TwoFactorAuthData;
  onEnable?: (method: 'sms' | 'email' | 'authenticator') => void;
  onDisable?: () => void;
  onGenerateBackupCodes?: () => void;
  onChangeMethod?: (method: 'sms' | 'email' | 'authenticator') => void;
}

const methodIcons = {
  sms: Smartphone,
  email: Mail,
  authenticator: Shield,
} as const;

export function TwoFactorAuth({ data, onEnable, onDisable, onGenerateBackupCodes, onChangeMethod }: TwoFactorAuthProps) {
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnable = () => {
    setIsEnabling(true);
    onEnable?.(selectedMethod);
    setTimeout(() => setIsEnabling(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {data.enabled ? (
              <CheckCircle className="h-6 w-6 text-success" />
            ) : (
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <h4 className="font-medium">
                {data.enabled ? '2FA Enabled' : '2FA Disabled'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {data.enabled
                  ? `Using ${data.method.replace('_', ' ')}`
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {data.enabled ? (
              <Button variant="destructive" onClick={onDisable}>
                Disable
              </Button>
            ) : (
              <Button variant="brand" onClick={handleEnable} disabled={isEnabling}>
                {isEnabling ? 'Enabling...' : 'Enable'}
              </Button>
            )}
          </div>
        </div>

        {/* Method Selection (when disabled) */}
        {!data.enabled && (
          <div className="space-y-3">
            <h4 className="font-medium">Choose Authentication Method</h4>
            <div className="space-y-2">
              {(['sms', 'email', 'authenticator'] as const).map((method) => {
              const Icon = methodIcons[method];
              return (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={cn(
                    "w-full p-4 border rounded-lg flex items-center gap-3 text-left transition-all",
                    selectedMethod === method ? "border-brand-blue bg-brand-blue/5" : "border-border hover:border-brand-blue/50"
                  )}
                >
                  <Icon className={cn("h-5 w-5", selectedMethod === method ? "text-brand-blue" : "text-muted-foreground")} />
                  <div>
                    <h5 className="font-medium capitalize">{method.replace('_', ' ')}</h5>
                    <p className="text-xs text-muted-foreground">
                      {method === 'sms' && 'Receive codes via SMS'}
                      {method === 'email' && 'Receive codes via Email'}
                      {method === 'authenticator' && 'Use authenticator app'}
                    </p>
                  </div>
                  {selectedMethod === method && (
                    <CheckCircle className="h-5 w-5 text-brand-blue" />
                  )}
                </button>
              );
            })}
            </div>
          </div>
        )}

        {/* Current Method Info (when enabled) */}
        {data.enabled && (
          <div className="space-y-4">
            <h4 className="font-medium">Current Method</h4>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = methodIcons[data.method];
                  return <Icon className="h-5 w-5 text-brand-blue" />;
                })()}
                <div>
                  <h5 className="font-medium capitalize">{data.method.replace('_', ' ')}</h5>
                  {data.method === 'sms' && data.phoneNumber && (
                    <p className="text-sm text-muted-foreground">Phone: {data.phoneNumber}</p>
                  )}
                  {data.method === 'email' && data.email && (
                    <p className="text-sm text-muted-foreground">Email: {data.email}</p>
                  )}
                  {data.lastUsed && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last used: {new Date(data.lastUsed).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={() => onChangeMethod?.(data.method)}>
              Change Method
            </Button>
          </div>
        )}

        {/* Backup Codes */}
        {data.enabled && (
          <div className="space-y-4">
            <h4 className="font-medium">Backup Codes</h4>
            {data.backupCodes && data.backupCodes.length > 0 ? (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                {data.backupCodes.slice(0, 3).map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-background rounded">
                    <code className="font-mono text-sm">{code}</code>
                    <Button variant="ghost" size="icon-sm" leftIcon={<Copy className="h-3 w-3" />}>
                      Copy
                    </Button>
                  </div>
                ))}
                {data.backupCodes.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{data.backupCodes.length - 3} more codes
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No backup codes generated</p>
            )}
            <Button variant="outline" onClick={onGenerateBackupCodes} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Generate New Codes
            </Button>
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
          <Shield className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-blue">
            Two-factor authentication adds an extra layer of security to your account. You'll be required to enter a code when signing in from a new device.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
