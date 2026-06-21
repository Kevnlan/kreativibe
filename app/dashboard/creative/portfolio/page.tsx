'use client';

import { useState, useEffect } from 'react';
import { Plus, Star, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { portfolioService } from '@/services/portfolio.service';
import { PortfolioItem } from '@/types/portfolio.types';

const GRADIENTS = [
  'from-orange-400 to-yellow-400',
  'from-pink-400 to-rose-500',
  'from-cyan-400 to-sky-500',
  'from-green-400 to-teal-500',
  'from-purple-400 to-violet-500',
  'from-blue-400 to-indigo-500',
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    portfolioService
      .list()
      .then(setItems)
      .catch(() => setError('Failed to load portfolio. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const withEngagement = items.filter(i => i.engagement != null);
  const totalEarnings = items.reduce((s, i) => s + (i.earnings ?? 0), 0);
  const avgEngagement = withEngagement.length
    ? withEngagement.reduce((s, i) => s + (i.engagement ?? 0), 0) / withEngagement.length
    : 0;
  const totalReach = items.reduce((s, i) => s + (i.reach ?? 0), 0);

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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: items.length + ' campaigns' },
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
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading portfolio...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No completed work yet. Finish a campaign or add an external sample to build your portfolio.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const color = GRADIENTS[i % GRADIENTS.length];
            return (
              <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-20 bg-gradient-to-r ${color} relative`}>
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
                  <p className="text-xs text-muted-foreground mb-3">
                    {item.brand} · {new Date(item.completedAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(t => (
                      <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                    ))}
                    {item.type && <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{item.type}</span>}
                  </div>

                  {(item.reach != null || item.engagement != null || item.earnings != null) && (
                    <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                      <div>
                        <p className="text-xs font-bold text-foreground">{item.reach != null ? formatNumber(item.reach) : '—'}</p>
                        <p className="text-[10px] text-muted-foreground">Reach</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{item.engagement != null ? `${item.engagement}%` : '—'}</p>
                        <p className="text-[10px] text-muted-foreground">Engagement</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-600">{item.earnings != null ? formatCurrency(item.earnings) : '—'}</p>
                        <p className="text-[10px] text-muted-foreground">Earned</p>
                      </div>
                    </div>
                  )}

                  {item.rating != null && (
                    <div className="flex items-center gap-0.5 mt-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`h-3.5 w-3.5 ${idx < item.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">Brand rating</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
