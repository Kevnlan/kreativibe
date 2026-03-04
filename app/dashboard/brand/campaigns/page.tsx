'use client';

import { useState } from 'react';
import { Plus, Search, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const demoCampaigns = [
  {
    id: 1,
    name: 'Summer Collection Launch',
    status: 'active',
    creators: 5,
    budget: 15000,
    spent: 9500,
    engagement: 4.5,
    startDate: 'Jan 15, 2026',
    endDate: 'Feb 15, 2026',
    platform: 'Instagram',
    niche: 'Fashion',
  },
  {
    id: 2,
    name: 'Product Review Series',
    status: 'active',
    creators: 3,
    budget: 8000,
    spent: 4200,
    engagement: 4.2,
    startDate: 'Feb 1, 2026',
    endDate: 'Feb 28, 2026',
    platform: 'TikTok',
    niche: 'Lifestyle',
  },
  {
    id: 3,
    name: 'Brand Awareness Q4',
    status: 'completed',
    creators: 8,
    budget: 25000,
    spent: 25000,
    engagement: 4.8,
    startDate: 'Oct 1, 2025',
    endDate: 'Dec 31, 2025',
    platform: 'Multi-platform',
    niche: 'General',
  },
  {
    id: 4,
    name: 'New Year Promo',
    status: 'completed',
    creators: 4,
    budget: 12000,
    spent: 11800,
    engagement: 5.1,
    startDate: 'Dec 20, 2025',
    endDate: 'Jan 10, 2026',
    platform: 'Instagram',
    niche: 'Lifestyle',
  },
  {
    id: 5,
    name: 'Fitness Challenge Sponsorship',
    status: 'active',
    creators: 6,
    budget: 18000,
    spent: 7200,
    engagement: 6.3,
    startDate: 'Feb 10, 2026',
    endDate: 'Mar 10, 2026',
    platform: 'YouTube',
    niche: 'Fitness',
  },
  {
    id: 6,
    name: 'Valentine\'s Day Special',
    status: 'draft',
    creators: 0,
    budget: 10000,
    spent: 0,
    engagement: 0,
    startDate: 'Feb 10, 2026',
    endDate: 'Feb 14, 2026',
    platform: 'Instagram',
    niche: 'Lifestyle',
  },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  draft: 'bg-yellow-100 text-yellow-700',
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [search, setSearch] = useState('');

  const filtered = demoCampaigns.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBudget = demoCampaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = demoCampaigns.reduce((s, c) => s + c.spent, 0);
  const activeCampaigns = demoCampaigns.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage all your influencer marketing campaigns</p>
        </div>
        <Button variant="brand">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: demoCampaigns.length, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
          { label: 'Active Now', value: activeCampaigns, icon: <Calendar className="h-4 w-4" />, color: 'text-green-600' },
          { label: 'Total Budget', value: formatCurrency(totalBudget), icon: <DollarSign className="h-4 w-4" />, color: 'text-purple-600' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: <Users className="h-4 w-4" />, color: 'text-orange-600' },
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Creators</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Spent</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Engagement</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Dates</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.platform} · {c.niche}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{c.creators}</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(c.budget)}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c.spent > 0 ? formatCurrency(c.spent) : '—'}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c.engagement > 0 ? `${c.engagement}%` : '—'}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      <p>{c.startDate}</p>
                      <p>{c.endDate}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
