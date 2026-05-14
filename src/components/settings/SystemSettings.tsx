'use client';

import { useState } from 'react';
import { Settings, Save, Globe, Bell, Shield, Database, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface SystemSetting {
  id: string;
  category: 'general' | 'regional' | 'notifications' | 'security' | 'database';
  name: string;
  description: string;
  type: 'boolean' | 'text' | 'number' | 'select';
  value: any;
  options?: string[];
}

interface SystemSettingsProps {
  settings: SystemSetting[];
  onSave?: (settings: SystemSetting[]) => void;
}

const categoryIcons = {
  general: Settings,
  regional: Globe,
  notifications: Bell,
  security: Shield,
  database: Database,
} as const;

const categoryColors = {
  general: 'text-gray-600 dark:text-gray-400',
  regional: 'text-blue-600 dark:text-blue-400',
  notifications: 'text-yellow-600 dark:text-yellow-400',
  security: 'text-red-600 dark:text-red-400',
  database: 'text-green-600 dark:text-green-400',
} as const;

export function SystemSettings({ settings, onSave }: SystemSettingsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [localSettings, setLocalSettings] = useState<SystemSetting[]>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">System Settings</CardTitle>
          </div>
          <Button
            variant="brand"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={isSaving ? <Settings className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(groupedSettings).map(([category, categorySettings]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", categoryColors[category as keyof typeof categoryColors])} />
                    <span className="font-medium capitalize">{category}</span>
                    <Badge variant="outline">{categorySettings.length} settings</Badge>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="p-4 border-t space-y-4">
                    {categorySettings.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{setting.name}</h4>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>

                        {setting.type === 'boolean' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={localSettings.find(s => s.id === setting.id)?.value}
                              onChange={(e) => updateSetting(setting.id, e.target.checked)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{localSettings.find(s => s.id === setting.id)?.value ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        )}

                        {setting.type === 'text' && (
                          <input
                            type="text"
                            value={localSettings.find(s => s.id === setting.id)?.value || ''}
                            onChange={(e) => updateSetting(setting.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        )}

                        {setting.type === 'number' && (
                          <input
                            type="number"
                            value={localSettings.find(s => s.id === setting.id)?.value || 0}
                            onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
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
                )}
              </div>
            );
          })}
        </div>

        {settings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No system settings configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
