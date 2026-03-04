'use client';

import { Plus, Eye, TrendingUp, Star, CheckCircle, Instagram, Youtube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';

const demoPortfolio = [
  {
    id: 1,
    title: 'GlowUp Skincare Launch',
    brand: 'GlowUp Africa',
    platform: 'Instagram',
    type: 'Reel',
    completedAt: 'Jan 2026',
    reach: 52000,
    engagement: 5.8,
    earnings: 8000,
    rating: 5,
    color: 'from-orange-400 to-yellow-400',
    tags: ['Beauty', 'Skincare'],
  },
  {
    id: 2,
    title: 'StyleHouse Winter Edit',
    brand: 'StyleHouse KE',
    platform: 'TikTok',
    type: 'Video',
    completedAt: 'Dec 2025',
    reach: 88000,
    engagement: 7.2,
    earnings: 6500,
    rating: 5,
    color: 'from-pink-400 to-rose-500',
    tags: ['Fashion', 'Lifestyle'],
  },
  {
    id: 3,
    title: 'Diani Beach Travel Vlog',
    brand: 'VisitKenya',
    platform: 'YouTube',
    type: 'Video',
    completedAt: 'Nov 2025',
    reach: 134000,
    engagement: 4.9,
    earnings: 12000,
    rating: 4,
    color: 'from-cyan-400 to-sky-500',
    tags: ['Travel', 'Lifestyle'],
  },
  {
    id: 4,
    title: 'FoodieKE Street Series Ep.1',
    brand: 'FoodieKE',
    platform: 'TikTok',
    type: 'Video',
    completedAt: 'Oct 2025',
    reach: 41000,
    engagement: 6.1,
    earnings: 4500,
    rating: 5,
    color: 'from-green-400 to-teal-500',
    tags: ['Food', 'Travel'],
  },
  {
    id: 5,
    title: '30-Day Fitness Transformation',
    brand: 'FitLife Nairobi',
    platform: 'Instagram',
    type: 'Post Series',
    completedAt: 'Sep 2025',
    reach: 28500,
    engagement: 8.4,
    earnings: 9500,
    rating: 5,
    color: 'from-purple-400 to-violet-500',
    tags: ['Fitness', 'Health'],
  },
  {
    id: 6,
    title: 'Budget Smartphone Review',
    brand: 'TechKE',
    platform: 'YouTube',
    type: 'Review Video',
    completedAt: 'Aug 2025',
    reach: 61000,
    engagement: 3.7,
    earnings: 9500,
    rating: 4,
    color: 'from-blue-400 to-indigo-500',
    tags: ['Tech', 'Gadgets'],
  },
];

export default function PortfolioPage() {
  const totalEarnings = demoPortfolio.reduce((s, p) => s + p.earnings, 0);
  const avgEngagement = demoPortfolio.reduce((s, p) => s + p.engagement, 0) / demoPortfolio.length;
  const totalReach = demoPortfolio.reduce((s, p) => s + p.reach, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Your completed brand collaborations and campaigns</p>
        </div>
        <Button variant="brand">
          <Plus className="h-4 w-4 mr-2" />
          Add Work Sample
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: demoPortfolio.length + ' campaigns' },
          { label: 'Total Reach', value: formatNumber(totalReach) },
          { label: 'Avg Engagement', value: avgEngagement.toFixed(1) + '%' },
          { label: 'Total Earned', value: formatCurrency(totalEarnings) },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {demoPortfolio.map(item => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-20 bg-gradient-to-r ${item.color} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg opacity-30">{item.platform}</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" /> Completed
              </div>
            </div>

            <CardContent className="pt-4 pb-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-foreground text-sm leading-snug">{item.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{item.brand} · {item.completedAt}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map(t => (
                  <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                ))}
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{item.type}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                <div>
                  <p className="text-xs font-bold text-foreground">{formatNumber(item.reach)}</p>
                  <p className="text-[10px] text-muted-foreground">Reach</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.engagement}%</p>
                  <p className="text-[10px] text-muted-foreground">Engagement</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-600">{formatCurrency(item.earnings)}</p>
                  <p className="text-[10px] text-muted-foreground">Earned</p>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">Brand rating</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
