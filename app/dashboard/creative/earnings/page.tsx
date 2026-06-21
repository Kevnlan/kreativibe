'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, FileText, Calendar, Download } from 'lucide-react';
import { Button, StatCard, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useUser } from '@/contexts/AuthContext';
import { earningsService } from '@/services/earnings.service';
import { EarningsSummary } from '@/types/earnings.types';
import { formatCurrency } from '@/lib/utils';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) return;
    earningsService
      .getSummary()
      .then(setEarnings)
      .catch(() => setError('Failed to load earnings. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-2">
            Track your income and performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      ) : earnings ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="This Month"
              value={formatCurrency(earnings.thisMonth, earnings.currency)}
              change={calculateGrowth(earnings.thisMonth, earnings.lastMonth)}
              changeLabel="vs last month"
              trend={earnings.thisMonth > earnings.lastMonth ? 'up' : 'down'}
              icon={<DollarSign className="h-4 w-4" />}
              iconColor="text-green-600"
            />
            <StatCard
              title="Last Month"
              value={formatCurrency(earnings.lastMonth, earnings.currency)}
              icon={<Calendar className="h-4 w-4" />}
              iconColor="text-blue-600"
            />
            <StatCard
              title="This Year"
              value={formatCurrency(earnings.thisYear, earnings.currency)}
              icon={<TrendingUp className="h-4 w-4" />}
              iconColor="text-purple-600"
            />
            <StatCard
              title="Average Per Sale"
              value={formatCurrency(earnings.averagePerSale, earnings.currency)}
              icon={<FileText className="h-4 w-4" />}
              iconColor="text-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Content Sales</p>
                      <p className="text-xs text-muted-foreground">{earnings.breakdown.contentSales.percent}% of earnings</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(earnings.breakdown.contentSales.amount, earnings.currency)}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Custom Requests</p>
                      <p className="text-xs text-muted-foreground">{earnings.breakdown.customRequests.percent}% of earnings</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(earnings.breakdown.customRequests.amount, earnings.currency)}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Bonuses</p>
                      <p className="text-xs text-muted-foreground">{earnings.breakdown.bonuses.percent}% of earnings</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(earnings.breakdown.bonuses.amount, earnings.currency)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                {earnings.topPerformingContent.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    No content sales yet — this fills in once your content starts selling.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {earnings.topPerformingContent.map(item => (
                      <div key={item.contentId} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg"></div>
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.salesCount} sales</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.revenue, earnings.currency)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Maximize Your Earnings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Here are some tips to increase your income on the platform:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Upload high-quality, diverse content regularly</li>
                    <li>Respond quickly to custom content requests</li>
                    <li>Complete your profile and showcase your portfolio</li>
                    <li>Engage with brands and build relationships</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
