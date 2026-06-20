'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users, DollarSign, Calendar, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { campaignService } from '@/services/campaign.service';
import { Campaign, CampaignStatus } from '@/types/campaign.types';

const statusStyles: Record<CampaignStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function CampaignsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    campaignService
      .list()
      .then(res => setCampaigns(res.items))
      .catch(() => setError('Failed to load campaigns. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = campaigns.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter.toUpperCase();
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.categories.some(category => category.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalBudget = campaigns.reduce((s, c) => s + c.budgetMax, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage all your influencer marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/brand/campaigns/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          <Button variant="brand" onClick={() => router.push('/dashboard/brand/campaigns/create')}>
            <Sparkles className="h-4 w-4 mr-2" />
            Create with AI
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: campaigns.length, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
          { label: 'Active Now', value: activeCampaigns, icon: <Calendar className="h-4 w-4" />, color: 'text-green-600' },
          { label: 'Drafts', value: draftCampaigns, icon: <Users className="h-4 w-4" />, color: 'text-orange-600' },
          { label: 'Total Budget', value: formatCurrency(totalBudget), icon: <DollarSign className="h-4 w-4" />, color: 'text-purple-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <span className={s.color}>{s.icon}</span>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'completed', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-brand-blue text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading campaigns...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No campaigns yet. Create your first one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Platforms</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Budget</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Dates</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.categories.join(', ') || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[c.status]}`}>
                          {c.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{c.platforms.join(', ')}</td>
                      <td className="px-5 py-4 font-medium">
                        {formatCurrency(c.budgetMin)} - {formatCurrency(c.budgetMax)}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        <p>{c.startDate ? new Date(c.startDate).toLocaleDateString() : '—'}</p>
                        <p>{c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/brand/campaigns/${c.id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
