'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, CurrencyInput } from '@/components/ui';
import { Country } from '@/types/api-contracts/country.types';
import { mockStore } from '@/lib/mock-data/mock-store';
import { generateCountry } from '@/lib/mock-data/generators';

export default function CountryEditPage() {
  const router = useRouter();
  const params = useParams();
  const countryId = params.id as string;
  const isNew = countryId === 'new';

  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<Partial<Country>>({
    name: '',
    code: '',
    currency: '',
    taxRate: 15,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      loadCountry();
    }
  }, [countryId, isNew]);

  const loadCountry = async () => {
    try {
      const data = mockStore.getCountryById(countryId);
      if (data) {
        setCountry(data);
      }
    } catch (error) {
      console.error('Failed to load country:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        const newCountry = generateCountry(country as any);
        mockStore.addCountry(newCountry);
      } else {
        mockStore.updateCountry(countryId, country);
      }
      router.push('/dashboard/admin/countries');
    } catch (error) {
      console.error('Failed to save country:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'Add Country' : 'Edit Country'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isNew ? 'Configure a new country' : 'Update country settings'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-background border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <Input
            label="Country Name"
            type="text"
            placeholder="e.g., Kenya"
            value={country.name}
            onChange={(e) => setCountry({ ...country, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Country Code"
              type="text"
              placeholder="e.g., KE"
              value={country.code}
              onChange={(e) => setCountry({ ...country, code: e.target.value.toUpperCase() })}
              maxLength={2}
              required
            />

            <Input
              label="Currency"
              type="text"
              placeholder="e.g., KES"
              value={country.currency}
              onChange={(e) => setCountry({ ...country, currency: e.target.value.toUpperCase() })}
              maxLength={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Default Tax Rate (%)
            </label>
            <Input
              type="number"
              placeholder="15"
              value={country.taxRate}
              onChange={(e) => setCountry({ ...country, taxRate: parseFloat(e.target.value) })}
              min={0}
              max={100}
              step={0.1}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={country.isActive}
              onChange={(e) => setCountry({ ...country, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">
              Active (users can select this country)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Country'}
          </Button>
        </div>
      </form>
    </div>
  );
}
