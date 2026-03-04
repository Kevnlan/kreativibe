'use client';

import { TrendingUp, Eye, Users, Target, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/utils';

const overallStats = [
  { label: 'Total Reach', value: 485000, change: +18.4, icon: <Eye className="h-4 w-4" />, color: 'text-blue-600', format: formatNumber },
  { label: 'Total Engagement', value: 4.6, change: +0.4, icon: <TrendingUp className="h-4 w-4" />, color: 'text-green-600', format: (v: number) => `${v}%` },
  { label: 'Creators Used', value: 23, change: +8, icon: <Users className="h-4 w-4" />, color: 'text-purple-600', format: (v: number) => v.toString() },
  { label: 'Total Spent', value: 85000, change: +15.2, icon: <DollarSign className="h-4 w-4" />, color: 'text-orange-600', format: formatCurrency },
];

const campaignPerformance = [
  { name: 'Summer Collection Launch', platform: 'Instagram', reach: 92000, engagement: 4.5, clicks: 3200, conversions: 214, roas: 3.2, spent: 9500 },
  { name: 'Product Review Series', platform: 'TikTok', reach: 74000, engagement: 5.8, clicks: 2800, conversions: 187, roas: 2.8, spent: 4200 },
  { name: 'Brand Awareness Q4', platform: 'Multi', reach: 198000, engagement: 4.8, clicks: 8100, conversions: 521, roas: 4.1, spent: 25000 },
  { name: 'New Year Promo', platform: 'Instagram', reach: 61000, engagement: 5.1, clicks: 2300, conversions: 156, roas: 3.5, spent: 11800 },
  { name: 'Fitness Challenge', platform: 'YouTube', reach: 60000, engagement: 6.3, clicks: 1900, conversions: 98, roas: 2.4, spent: 7200 },
];

const topCreators = [
  { name: 'Sarah Kimani', platform: 'Instagram', reach: 48000, engagement: 6.2, campaigns: 3, paid: 18000 },
  { name: 'James Mutua', platform: 'TikTok', reach: 91000, engagement: 7.8, campaigns: 2, paid: 14000 },
  { name: 'Aisha Ndungu', platform: 'YouTube', reach: 65000, engagement: 5.1, campaigns: 2, paid: 22000 },
  { name: 'Tom Ochieng', platform: 'Instagram', reach: 34000, engagement: 8.4, campaigns: 1, paid: 9000 },
  { name: 'Rita Mwangi', platform: 'TikTok', reach: 88000, engagement: 6.9, campaigns: 2, paid: 13500 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Campaign performance overview across all your brand partnerships</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
              <span className={s.color}>{s.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.format(s.value)}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {s.change >= 0
                  ? <ArrowUpRight className="h-3 w-3 text-green-500" />
                  : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className={s.change >= 0 ? 'text-green-600' : 'text-red-500'}>
                  {s.change >= 0 ? '+' : ''}{s.change}%
                </span>
                {' '}vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign performance table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed metrics for each campaign</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Campaign', 'Platform', 'Reach', 'Engagement', 'Clicks', 'Conversions', 'ROAS', 'Spent'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaignPerformance.map(c => (
                  <tr key={c.name} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.platform}</td>
                    <td className="px-5 py-3">{formatNumber(c.reach)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${c.engagement >= 5 ? 'text-green-600' : 'text-foreground'}`}>
                        {c.engagement}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatNumber(c.clicks)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.conversions}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${c.roas >= 3 ? 'text-green-600' : 'text-orange-500'}`}>
                        {c.roas}x
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{formatCurrency(c.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top creators */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Creators</CardTitle>
          <CardDescription>Creators who delivered the best results for your brand</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Creator', 'Platform', 'Total Reach', 'Avg Engagement', 'Campaigns', 'Total Paid'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topCreators.map((c, i) => (
                  <tr key={c.name} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-foreground">{c.name}</span>
                        {i === 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Top</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.platform}</td>
                    <td className="px-5 py-3">{formatNumber(c.reach)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${c.engagement >= 7 ? 'text-green-600' : 'text-foreground'}`}>
                        {c.engagement}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.campaigns}</td>
                    <td className="px-5 py-3 font-medium">{formatCurrency(c.paid)}</td>
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
