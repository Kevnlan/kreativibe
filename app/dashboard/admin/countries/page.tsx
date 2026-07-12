'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, DollarSign } from 'lucide-react';
import { Button, DataTable, StatusBadge, EmptyState } from '@/components/ui';
import { Country } from '@/types/api-contracts/country.types';
import { countryService } from '@/services/country.service';
import { useRouter } from 'next/navigation';

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const response = await countryService.getCountries();
      setCountries(response.countries || []);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Country',
      sortable: true,
      render: (value: string, row: Country) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{row.code === 'KE' ? '🇰🇪' : row.code === 'UG' ? '🇺🇬' : '🇹🇿'}</span>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'currency',
      label: 'Currency',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{value}</span>
        </div>
      ),
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      sortable: true,
      render: (value: number) => `${value}%`,
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <StatusBadge variant={value ? 'success' : 'error'}>
          {value ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Country) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/admin/countries/${row.id}`)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this country?')) {
      try {
        await countryService.deleteCountry(id);
        loadCountries();
      } catch (error) {
        console.error('Failed to delete country:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countries</h1>
          <p className="text-muted-foreground mt-2">
            Manage countries and their configurations
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/countries/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      {loading ? (
        <DataTable data={[]} columns={columns} loading={true} />
      ) : countries.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-12 w-12" />}
          title="No countries configured"
          description="Add your first country to enable country-specific features"
          action={{
            label: 'Add Country',
            onClick: () => router.push('/dashboard/admin/countries/new'),
          }}
        />
      ) : (
        <DataTable
          data={countries}
          columns={columns}
          searchable
          searchPlaceholder="Search countries..."
        />
      )}
    </div>
  );
}
