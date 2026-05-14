'use client';

import { useState, useEffect } from 'react';
import { Settings, DollarSign, Globe, Bell, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { adminSettingsService, SystemSettings, Country, NotificationTemplate } from '@/services/admin-settings.service';

const defaultSettings: SystemSettings = {
  currency: 'KES',
  taxRate: 3,
  payoutMethods: ['MPESA', 'BANK_TRANSFER'],
  platformFee: 10,
};

const defaultCountries: Country[] = [
  { id: 'kenya-001', name: 'Kenya', code: 'KE', currency: 'KES', taxRate: 3 },
  { id: 'uganda-001', name: 'Uganda', code: 'UG', currency: 'UGX', taxRate: 6 },
  { id: 'tanzania-001', name: 'Tanzania', code: 'TZ', currency: 'TZS', taxRate: 5 },
];

const defaultTemplates: NotificationTemplate[] = [
  { id: '1', name: 'KYC Approved', type: 'EMAIL', subject: 'Your account has been verified!', body: 'Dear {{name}}, your KYC verification has been approved. You can now start earning on Kreativibe.', variables: ['name'], isActive: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: '2', name: 'KYC Rejected', type: 'EMAIL', subject: 'KYC Verification Update', body: 'Dear {{name}}, your KYC verification was not approved. Reason: {{reason}}. Please resubmit with correct documents.', variables: ['name', 'reason'], isActive: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: '3', name: 'Withdrawal Processed', type: 'SMS', body: 'Kreativibe: Your withdrawal of {{amount}} {{currency}} has been processed. Reference: {{reference}}', variables: ['amount', 'currency', 'reference'], isActive: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [countries, setCountries] = useState<Country[]>(defaultCountries);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(defaultTemplates);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'countries' | 'notifications'>('general');
  const [newCountry, setNewCountry] = useState({ name: '', code: '', currency: '', taxRate: 0 });
  const [showAddCountry, setShowAddCountry] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [s, c, t] = await Promise.all([
        adminSettingsService.getSettings(),
        adminSettingsService.getCountries(),
        adminSettingsService.getNotificationTemplates(),
      ]);
      setSettings(s);
      setCountries(c);
      setTemplates(t);
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await adminSettingsService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const handleAddCountry = async () => {
    try {
      const added = await adminSettingsService.addCountry(newCountry);
      setCountries(prev => [...prev, added]);
    } catch {
      setCountries(prev => [...prev, { ...newCountry, id: `country-${Date.now()}` }]);
    }
    setNewCountry({ name: '', code: '', currency: '', taxRate: 0 });
    setShowAddCountry(false);
  };

  const handleRemoveCountry = async (id: string) => {
    if (!confirm('Remove this country? This may affect existing users.')) return;
    try {
      await adminSettingsService.removeCountry(id);
    } catch {}
    setCountries(prev => prev.filter(c => c.id !== id));
  };

  const toggleTemplate = async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    try {
      await adminSettingsService.updateNotificationTemplate(id, { isActive: !template.isActive });
    } catch {}
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'countries', label: 'Countries', icon: <Globe className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide settings, countries, and notification templates</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Platform Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Currency</label>
                <select
                  value={settings.currency}
                  onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="KES">KES — Kenyan Shilling</option>
                  <option value="UGX">UGX — Ugandan Shilling</option>
                  <option value="TZS">TZS — Tanzanian Shilling</option>
                </select>
              </div>
              <Input
                label="Platform Fee (%)"
                type="number"
                min="0"
                max="50"
                value={settings.platformFee}
                onChange={e => setSettings(prev => ({ ...prev, platformFee: Number(e.target.value) }))}
              />
              <Input
                label="Default Withholding Tax Rate (%)"
                type="number"
                min="0"
                max="30"
                value={settings.taxRate}
                onChange={e => setSettings(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payout Methods</label>
              <div className="flex gap-3">
                {['MPESA', 'BANK_TRANSFER', 'CARD'].map(method => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payoutMethods.includes(method)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSettings(prev => ({ ...prev, payoutMethods: [...prev.payoutMethods, method] }));
                        } else {
                          setSettings(prev => ({ ...prev, payoutMethods: prev.payoutMethods.filter(m => m !== method) }));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue"
                    />
                    <span className="text-sm">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSaveSettings} disabled={saving} loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" /> Saved successfully
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Countries */}
      {activeTab === 'countries' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Active Countries
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddCountry(true)}>
                <Plus className="h-4 w-4 mr-2" />Add Country
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddCountry && (
              <div className="p-4 border border-brand-blue/30 rounded-lg bg-blue-50/40 space-y-3">
                <h3 className="font-semibold text-sm">Add New Country</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Country Name" placeholder="e.g., Rwanda" value={newCountry.name} onChange={e => setNewCountry(p => ({ ...p, name: e.target.value }))} />
                  <Input label="Country Code" placeholder="e.g., RW" value={newCountry.code} onChange={e => setNewCountry(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                  <Input label="Currency Code" placeholder="e.g., RWF" value={newCountry.currency} onChange={e => setNewCountry(p => ({ ...p, currency: e.target.value.toUpperCase() }))} />
                  <Input label="Tax Rate (%)" type="number" value={newCountry.taxRate} onChange={e => setNewCountry(p => ({ ...p, taxRate: Number(e.target.value) }))} />
                </div>
                <div className="flex gap-3">
                  <Button size="sm" onClick={handleAddCountry} disabled={!newCountry.name || !newCountry.code}>Add Country</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddCountry(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {countries.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center font-bold text-brand-blue text-sm">
                      {c.code}
                    </div>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.currency} · {c.taxRate}% withholding tax</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCountry(c.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map(t => (
              <div key={t.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{t.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.type === 'EMAIL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {t.type}
                      </span>
                    </div>
                    {t.subject && <p className="text-sm text-muted-foreground">Subject: {t.subject}</p>}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.isActive}
                      onChange={() => toggleTemplate(t.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue"
                    />
                    <span className="text-sm">{t.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>
                <div className="bg-muted rounded p-3">
                  <p className="text-sm font-mono text-muted-foreground">{t.body}</p>
                </div>
                {t.variables.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Variables:</span>
                    {t.variables.map(v => (
                      <code key={v} className="text-xs bg-muted px-1.5 py-0.5 rounded">{'{{' + v + '}}'}</code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
