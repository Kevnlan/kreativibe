'use client';

import { useState } from 'react';
import { Globe, MapPin, DollarSign, CheckCircle, AlertTriangle, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CountryConfig {
  id: string;
  name: string;
  code: string;
  currency: string;
  taxRate: number;
  payoutMethods: string[];
  enabled: boolean;
}

interface CountryConfigProps {
  countries: CountryConfig[];
  onAdd?: (country: Omit<CountryConfig, 'id'>) => void;
  onUpdate?: (countryId: string, updates: Partial<CountryConfig>) => void;
  onDelete?: (countryId: string) => void;
}

export function CountryConfig({ countries, onAdd, onUpdate, onDelete }: CountryConfigProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCountry, setNewCountry] = useState({
    name: '',
    code: '',
    currency: '',
    taxRate: 0,
    payoutMethods: [] as string[],
    enabled: false,
  });

  const handleAdd = () => {
    if (newCountry.name && newCountry.code && newCountry.currency) {
      onAdd?.(newCountry);
      setNewCountry({ name: '', code: '', currency: '', taxRate: 0, payoutMethods: [], enabled: false });
      setIsAdding(false);
    }
  };

  const handleToggleEnabled = (countryId: string) => {
    onUpdate?.(countryId, { enabled: !countries.find(c => c.id === countryId)?.enabled });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Country Configuration</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Country
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Country Form */}
        {isAdding && (
          <div className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country Name</label>
                <input
                  type="text"
                  value={newCountry.name}
                  onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Kenya"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country Code</label>
                <input
                  type="text"
                  value={newCountry.code}
                  onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., KE"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <input
                  type="text"
                  value={newCountry.currency}
                  onChange={(e) => setNewCountry({ ...newCountry, currency: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., KES"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Rate (%)</label>
                <input
                  type="number"
                  value={newCountry.taxRate}
                  onChange={(e) => setNewCountry({ ...newCountry, taxRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="brand" onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
                Add Country
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Country List */}
        <div className="space-y-3">
          {countries.map((country) => (
            <div key={country.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Flag */}
                  <div className="w-12 h-8 rounded flex items-center justify-center bg-muted">
                    <span className="text-2xl">{getFlagEmoji(country.code)}</span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{country.name}</h4>
                      <Badge variant="outline">{country.code}</Badge>
                      {country.enabled ? (
                        <Badge variant="success" className="text-xs">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Disabled</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {country.currency}
                      </span>
                      <span>•</span>
                      <span>{country.taxRate}% tax rate</span>
                      <span>•</span>
                      <span>{country.payoutMethods.length} payout methods</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleEnabled(country.id)}
                  >
                    {country.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(country.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Payout Methods */}
              {country.payoutMethods.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Payout Methods:</p>
                  <div className="flex flex-wrap gap-1">
                    {country.payoutMethods.map((method, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {countries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No countries configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getFlagEmoji(code: string): string {
  const flags: Record<string, string> = {
    KE: '🇰🇪',
    UG: '🇺🇬',
    TZ: '🇹🇿',
    NG: '🇳🇬',
    ZA: '🇿🇦',
    RW: '🇷🇼',
    ET: '🇪🇹',
  };
  return flags[code] || '🏳';
}
