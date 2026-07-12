'use client';

import { useState, useEffect } from 'react';
import { Bell, Globe, Shield, Save, RotateCcw, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { settingsService } from '@/services/settings.service';
import { UserSettings, UpdateSettingsData, EmailFrequency } from '@/types/api-contracts/settings.types';

const EMAIL_FREQUENCIES: { value: EmailFrequency; label: string }[] = [
  { value: 'INSTANT', label: 'Instant' },
  { value: 'DAILY', label: 'Daily Digest' },
  { value: 'WEEKLY', label: 'Weekly Digest' },
  { value: 'NEVER', label: 'Never' },
];

const NOTIFICATION_TYPES = [
  'OFFER_RECEIVED',
  'OFFER_ACCEPTED',
  'OFFER_REJECTED',
  'OFFER_COUNTERED',
  'CONTENT_APPROVED',
  'CONTENT_REJECTED',
  'CAMPAIGN_APPLICATION',
  'WITHDRAWAL_PROCESSED',
  'SUPPORT_UPDATE',
  'COMMUNITY_REPLY',
];

const TIMEZONES = ['Africa/Nairobi', 'Africa/Kampala', 'Africa/Dar_es_Salaam', 'UTC'];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Swahili' },
];

const CURRENCIES = ['KES', 'UGX', 'TZS', 'USD'];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'regional'>('notifications');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.get();
      setSettings(data);
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const { id, userId, createdAt, updatedAt, ...updateData } = settings;
      const updated = await settingsService.update(updateData as UpdateSettingsData);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults?')) return;
    setSaving(true);
    setError(null);
    try {
      const reset = await settingsService.reset();
      setSettings(reset);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to reset settings.');
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const toggleNotificationType = (type: string) => {
    if (!settings) return;
    const types = settings.notificationTypes.includes(type)
      ? settings.notificationTypes.filter(t => t !== type)
      : [...settings.notificationTypes, type];
    update('notificationTypes', types);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading settings...
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
        <Button variant="outline" size="sm" className="ml-3" onClick={loadSettings}>Retry</Button>
      </div>
    );
  }

  if (!settings) return null;

  const tabs = [
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'privacy' as const, label: 'Privacy', icon: <Shield className="h-4 w-4" /> },
    { id: 'regional' as const, label: 'Regional', icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings & Preferences</h1>
        <p className="text-muted-foreground mt-1">Manage your notification, privacy, and regional preferences</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Settings saved successfully.
        </div>
      )}

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-blue" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Frequency</label>
              <select
                value={settings.emailFrequency}
                onChange={e => update('emailFrequency', e.target.value as EmailFrequency)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                {EMAIL_FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <button
                onClick={() => update('pushEnabled', !settings.pushEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.pushEnabled ? 'bg-brand-blue' : 'bg-muted'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.pushEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <button
                onClick={() => update('smsEnabled', !settings.smsEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.smsEnabled ? 'bg-brand-blue' : 'bg-muted'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.smsEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Notification Types</label>
              <div className="grid grid-cols-2 gap-2">
                {NOTIFICATION_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.notificationTypes.includes(type)}
                      onChange={() => toggleNotificationType(type)}
                      className="rounded border-input"
                    />
                    <span>{type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-blue" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'profileVisible' as const, label: 'Profile Visible', desc: 'Allow others to view your profile' },
              { key: 'showEarnings' as const, label: 'Show Earnings', desc: 'Display earnings on your public profile' },
              { key: 'allowDirectMessages' as const, label: 'Allow Direct Messages', desc: 'Allow other users to send you messages' },
              { key: 'showInSearch' as const, label: 'Show in Search', desc: 'Appear in search results' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => update(item.key, !settings[item.key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-brand-blue' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'regional' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-blue" />
              Regional Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Language</label>
              <select
                value={settings.preferredLanguage}
                onChange={e => update('preferredLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Currency</label>
              <select
                value={settings.preferredCurrency}
                onChange={e => update('preferredCurrency', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <select
                value={settings.timezone}
                onChange={e => update('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={saving} leftIcon={<RotateCcw className="h-4 w-4" />}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
