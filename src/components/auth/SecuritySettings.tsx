'use client';

import { useState } from 'react';
import { Shield, Lock, Bell, Eye, EyeOff, Save, Globe, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  type: 'boolean' | 'select' | 'text';
  value: any;
  options?: string[];
}

interface SecuritySettingsProps {
  settings: SecuritySetting[];
  onSave?: (settings: SecuritySetting[]) => void;
}

export function SecuritySettings({ settings, onSave }: SecuritySettingsProps) {
  const [localSettings, setLocalSettings] = useState<SecuritySetting[]>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateSetting = (settingId: string, value: any) => {
    setLocalSettings(prev =>
      prev.map(s => s.id === settingId ? { ...s, value } : s)
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave?.(localSettings);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Security Settings</CardTitle>
          </div>
          <Button
            variant="brand"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={isSaving ? <Shield className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </h4>
          {settings.filter(s => s.id.startsWith('password')).map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{setting.name}</span>
                {setting.type === 'boolean' && (
                  <input
                    type="checkbox"
                    checked={localSettings.find(s => s.id === setting.id)?.value}
                    onChange={(e) => updateSetting(setting.id, e.target.checked)}
                    className="h-4 w-4"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
              {setting.type === 'select' && setting.options && (
                <select
                  value={localSettings.find(s => s.id === setting.id)?.value || ''}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {setting.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Session Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Session
          </h4>
          {settings.filter(s => s.id.startsWith('session')).map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{setting.name}</span>
                {setting.type === 'boolean' && (
                  <input
                    type="checkbox"
                    checked={localSettings.find(s => s.id === setting.id)?.value}
                    onChange={(e) => updateSetting(setting.id, e.target.checked)}
                    className="h-4 w-4"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
              {setting.type === 'select' && setting.options && (
                <select
                  value={localSettings.find(s => s.id === setting.id)?.value || ''}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {setting.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Device Recognition */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Device Recognition
          </h4>
          {settings.filter(s => s.id.startsWith('device')).map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{setting.name}</span>
                {setting.type === 'boolean' && (
                  <input
                    type="checkbox"
                    checked={localSettings.find(s => s.id === setting.id)?.value}
                    onChange={(e) => updateSetting(setting.id, e.target.checked)}
                    className="h-4 w-4"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Location Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Location
          </h4>
          {settings.filter(s => s.id.startsWith('location')).map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{setting.name}</span>
                {setting.type === 'boolean' && (
                  <input
                    type="checkbox"
                    checked={localSettings.find(s => s.id === setting.id)?.value}
                    onChange={(e) => updateSetting(setting.id, e.target.checked)}
                    className="h-4 w-4"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
          <Shield className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-blue">
            These settings help protect your account from unauthorized access. Review them regularly to ensure optimal security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
