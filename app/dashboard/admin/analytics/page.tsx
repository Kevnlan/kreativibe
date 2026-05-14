'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Globe, BarChart2, ArrowUpRight } from 'lucide-react';
import { StatCard, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { adminService, AdminStats } from '@/services/admin.service';

interface MonthlyData {
  month: string;
  creators: number;
  brands: number;
  revenue: number;
  transactions: number;
}

const mockStats: AdminStats = {
  totalUsers: 1247,
  totalCreators: 856,
  totalBrands: 391,
  pendingKyc: 12,
  totalTransactions: 3421,
  totalRevenue: 45678900,
  monthlyGrowth: 18.5,
};

const mockMonthly: MonthlyData[] = [
  { month: 'Oct', creators: 620, brands: 280, revenue: 28000000, transactions: 2100 },
  { month: 'Nov', creators: 680, brands: 310, revenue: 32000000, transactions: 2450 },
  { month: 'Dec', creators: 720, brands: 340, revenue: 38000000, transactions: 2800 },
  { month: 'Jan', creators: 770, brands: 355, revenue: 40000000, transactions: 3000 },
  { month: 'Feb', creators: 820, brands: 375, revenue: 43000000, transactions: 3200 },
  { month: 'Mar', creators: 856, brands: 391, revenue: 45678900, transactions: 3421 },
];

const topNiches = [
  { niche: 'Fashion', count: 234, revenue: 12500000 },
  { niche: 'Beauty', count: 189, revenue: 9800000 },
  { niche: 'Food & Beverage', count: 156, revenue: 8200000 },
  { niche: 'Technology', count: 134, revenue: 7600000 },
  { niche: 'Lifestyle', count: 143, revenue: 7200000 },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats>(mockStats);
  const [monthly] = useState<MonthlyData[]>(mockMonthly);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch {
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

  const maxRevenue = Math.max(...monthly.map(m => m.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide metrics, growth trends, and performance data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<Users className="h-4 w-4" />} iconColor="text-blue-600" change={stats.monthlyGrowth} changeLabel="this month" trend="up" />
        <StatCard title="Creators" value={stats.totalCreators.toLocaleString()} icon={<Users className="h-4 w-4" />} iconColor="text-orange-600" />
        <StatCard title="Brands" value={stats.totalBrands.toLocaleString()} icon={<Users className="h-4 w-4" />} iconColor="text-purple-600" />
        <StatCard title="Pending KYC" value={stats.pendingKyc.toString()} icon={<FileText className="h-4 w-4" />} iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign className="h-4 w-4" />} iconColor="text-green-600" />
        <StatCard title="Total Transactions" value={stats.totalTransactions.toLocaleString()} icon={<TrendingUp className="h-4 w-4" />} iconColor="text-brand-blue" />
        <StatCard title="Monthly Growth" value={`${stats.monthlyGrowth}%`} icon={<ArrowUpRight className="h-4 w-4" />} iconColor="text-green-600" />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Revenue — Last 6 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('en', { notation: 'compact' }).format(m.revenue)}
                </span>
                <div
                  className="w-full bg-brand-blue/80 rounded-t-sm transition-all hover:bg-brand-blue"
                  style={{ height: `${(m.revenue / maxRevenue) * 160}px` }}
                />
                <span className="text-xs font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth & Top Niches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthly.map((m) => (
                <div key={m.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-10">{m.month}</span>
                  <div className="flex-1 mx-3">
                    <div className="flex gap-1 h-5">
                      <div
                        className="bg-orange-400 rounded-sm"
                        style={{ width: `${(m.creators / 1000) * 100}%` }}
                        title={`${m.creators} creators`}
                      />
                      <div
                        className="bg-blue-400 rounded-sm"
                        style={{ width: `${(m.brands / 500) * 100}%` }}
                        title={`${m.brands} brands`}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {m.creators + m.brands} users
                  </span>
                </div>
              ))}
              <div className="flex gap-4 mt-2 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 bg-orange-400 rounded-sm" /><span>Creators</span></div>
                <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 bg-blue-400 rounded-sm" /><span>Brands</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Content Niches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topNiches.map((n, i) => (
                <div key={n.niche} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm">{n.niche}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(n.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{n.count} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
