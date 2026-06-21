'use client';

import { useState, useEffect } from 'react';
import { Search, Target, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { brandService, BrandSummary } from '@/services/brand.service';

const GRADIENTS = [
  'from-pink-400 to-rose-500',
  'from-orange-400 to-yellow-400',
  'from-green-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-cyan-400 to-sky-500',
  'from-purple-400 to-violet-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

export default function BrowseBrandsPage() {
  const [search, setSearch] = useState('');
  const [brands, setBrands] = useState<BrandSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    brandService
      .browseBrands()
      .then(res => setBrands(res.items))
      .catch(() => setError('Failed to load brands. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = brands.filter(b =>
    b.companyName.toLowerCase().includes(search.toLowerCase()) ||
    b.industry.toLowerCase().includes(search.toLowerCase()) ||
    b.niches.some(n => n.toLowerCase().includes(search.toLowerCase()))
  );

  const avgBudget = brands.length
    ? Math.round(brands.reduce((s, b) => s + (b.budgetMin + b.budgetMax) / 2, 0) / brands.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Browse Brands</h1>
        <p className="text-muted-foreground mt-1">Discover brands actively looking for creators like you</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search brands, industries, niches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Brands Available', value: brands.length },
          { label: 'Active Campaigns', value: brands.reduce((s, b) => s + b.activeCampaigns, 0) },
          { label: 'Avg Budget', value: formatCurrency(avgBudget) },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading brands...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No brands with active campaigns right now. Check back soon.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((brand, i) => {
            const color = GRADIENTS[i % GRADIENTS.length];
            return (
              <Card key={brand.id} className="group hover:shadow-md transition-shadow">
                <div className={`h-16 rounded-t-xl bg-gradient-to-r ${color}`} />
                <CardContent className="pt-0 pb-5">
                  <div className={`-mt-7 mb-3 w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg border-[3px] border-white shadow-sm`}>
                    {getInitials(brand.companyName)}
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{brand.companyName}</h3>
                      {brand.location && <p className="text-xs text-muted-foreground">{brand.location}</p>}
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{brand.industry}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{brand.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {brand.niches.map(n => (
                      <span key={n} className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">{n}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      <span>{brand.activeCampaigns} campaigns</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{formatCurrency(brand.budgetMin)}+</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-3 group-hover:border-brand-blue group-hover:text-brand-blue transition-colors" size="sm">
                    View Opportunities <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
