'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, FileText, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { StatCard, Card, CardContent, CardHeader, CardTitle, DataTable, StatusBadge } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalRevenue: number;
  pendingKYC: number;
  pendingBrandVerification: number;
  pendingContentModeration: number;
  pendingWithdrawals: number;
  activeCountries: number;
  totalContent: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'kyc_submitted' | 'content_uploaded' | 'withdrawal_request' | 'brand_verification';
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    totalCreators: 856,
    totalBrands: 391,
    totalRevenue: 45678900,
    pendingKYC: 12,
    pendingBrandVerification: 5,
    pendingContentModeration: 8,
    pendingWithdrawals: 3,
    activeCountries: 3,
    totalContent: 3421,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'kyc_submitted',
      description: 'New KYC submission from John Doe',
      timestamp: new Date().toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      type: 'brand_verification',
      description: 'Brand verification request from Acme Corp',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'pending',
    },
    {
      id: '3',
      type: 'withdrawal_request',
      description: 'Withdrawal request KES 50,000 from Jane Smith',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending',
    },
    {
      id: '4',
      type: 'content_uploaded',
      description: 'New content uploaded for moderation',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'completed',
    },
    {
      id: '5',
      type: 'user_signup',
      description: 'New creator signup from Kenya',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'completed',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <Users className="h-4 w-4" />;
      case 'kyc_submitted':
        return <FileText className="h-4 w-4" />;
      case 'content_uploaded':
        return <FileText className="h-4 w-4" />;
      case 'withdrawal_request':
        return <DollarSign className="h-4 w-4" />;
      case 'brand_verification':
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Platform overview and key metrics
        </p>
      </div>

      {/* Action Required Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/admin/kyc')}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">{stats.pendingKYC}</span>
              </div>
              <p className="text-sm font-medium text-orange-900">Pending KYC Reviews</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/brands/verification')}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{stats.pendingBrandVerification}</span>
              </div>
              <p className="text-sm font-medium text-blue-900">Brand Verifications</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/content/moderation')}
              className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{stats.pendingContentModeration}</span>
              </div>
              <p className="text-sm font-medium text-purple-900">Content Moderation</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/withdrawals')}
              className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.pendingWithdrawals}</span>
              </div>
              <p className="text-sm font-medium text-green-900">Withdrawal Approvals</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Creators"
          value={stats.totalCreators.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Total Brands"
          value={stats.totalBrands.toLocaleString()}
          icon={<ShoppingBag className="h-4 w-4" />}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Countries"
          value={stats.activeCountries.toString()}
          icon={<TrendingUp className="h-4 w-4" />}
          iconColor="text-brand-blue"
        />
        <StatCard
          title="Total Content"
          value={stats.totalContent.toLocaleString()}
          icon={<FileText className="h-4 w-4" />}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Platform Health"
          value="Excellent"
          icon={<CheckCircle className="h-4 w-4" />}
          iconColor="text-green-600"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  variant={activity.status === 'pending' ? 'pending' : activity.status === 'completed' ? 'success' : 'error'}
                  size="sm"
                >
                  {activity.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push('/dashboard/admin/users')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Manage Users</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/countries')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Countries</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/analytics')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Analytics</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/settings')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
            >
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
