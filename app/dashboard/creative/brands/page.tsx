'use client';

import { useState } from 'react';
import { Search, Building2, Target, DollarSign, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const demoBrands = [
  {
    id: 1,
    initials: 'SH',
    name: 'StyleHouse KE',
    industry: 'Fashion & Apparel',
    color: 'from-pink-400 to-rose-500',
    budgetMin: 5000,
    budgetMax: 30000,
    activeCampaigns: 3,
    niches: ['Fashion', 'Lifestyle'],
    location: 'Nairobi',
    description: 'Leading fashion retailer in Kenya looking for style influencers.',
  },
  {
    id: 2,
    initials: 'GL',
    name: 'GlowUp Africa',
    industry: 'Beauty & Skincare',
    color: 'from-orange-400 to-yellow-400',
    budgetMin: 4000,
    budgetMax: 20000,
    activeCampaigns: 2,
    niches: ['Beauty', 'Skincare', 'Wellness'],
    location: 'Nairobi',
    description: 'Pan-African beauty brand focused on natural skincare products.',
  },
  {
    id: 3,
    initials: 'FK',
    name: 'FoodieKE',
    industry: 'Food & Beverage',
    color: 'from-green-400 to-teal-500',
    budgetMin: 3000,
    budgetMax: 15000,
    activeCampaigns: 4,
    niches: ['Food', 'Travel', 'Lifestyle'],
    location: 'Multiple Cities',
    description: 'Kenya\'s top food delivery platform seeking food content creators.',
  },
  {
    id: 4,
    initials: 'TK',
    name: 'TechKE',
    industry: 'Technology',
    color: 'from-blue-400 to-indigo-500',
    budgetMin: 6000,
    budgetMax: 40000,
    activeCampaigns: 2,
    niches: ['Tech', 'Gadgets', 'Gaming'],
    location: 'Nairobi',
    description: 'Tech retailer specialising in smartphones and accessories.',
  },
  {
    id: 5,
    initials: 'VK',
    name: 'VisitKenya',
    industry: 'Tourism & Travel',
    color: 'from-cyan-400 to-sky-500',
    budgetMin: 8000,
    budgetMax: 50000,
    activeCampaigns: 1,
    niches: ['Travel', 'Lifestyle', 'Adventure'],
    location: 'Nationwide',
    description: 'Tourism board promoting Kenya as a top travel destination.',
  },
  {
    id: 6,
    initials: 'FL',
    name: 'FitLife Nairobi',
    industry: 'Health & Fitness',
    color: 'from-purple-400 to-violet-500',
    budgetMin: 4500,
    budgetMax: 18000,
    activeCampaigns: 2,
    niches: ['Fitness', 'Health', 'Wellness'],
    location: 'Nairobi',
    description: 'Premium gym chain looking for fitness content creators.',
  },
];

export default function BrowseBrandsPage() {
  const [search, setSearch] = useState('');

  const filtered = demoBrands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.industry.toLowerCase().includes(search.toLowerCase()) ||
    b.niches.some(n => n.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Browse Brands</h1>
        <p className="text-muted-foreground mt-1">Discover brands actively looking for creators like you</p>
      </div>

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
          { label: 'Brands Available', value: demoBrands.length },
          { label: 'Active Campaigns', value: demoBrands.reduce((s, b) => s + b.activeCampaigns, 0) },
          { label: 'Avg Budget', value: formatCurrency(Math.round(demoBrands.reduce((s, b) => s + (b.budgetMin + b.budgetMax) / 2, 0) / demoBrands.length)) },
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(brand => (
          <Card key={brand.id} className="group hover:shadow-md transition-shadow">
            <div className={`h-16 rounded-t-xl bg-gradient-to-r ${brand.color}`} />
            <CardContent className="pt-0 pb-5">
              <div className={`-mt-7 mb-3 w-14 h-14 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-white font-bold text-lg border-[3px] border-white shadow-sm`}>
                {brand.initials}
              </div>

              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{brand.name}</h3>
                  <p className="text-xs text-muted-foreground">{brand.location}</p>
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
        ))}
      </div>
    </div>
  );
}
