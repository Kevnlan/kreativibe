'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Plus,
  Eye,
  Heart,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { useCreatorProfile, useUser } from '@/contexts/AuthContext';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { KYCBanner } from '@/components/dashboard/KYCBanner';
import { useRouter, useSearchParams } from 'next/navigation';
import { dashboardService } from '@/services/earnings.service';
import { DashboardSummary } from '@/types/earnings.types';

export default function CreatorDashboard() {
  const creatorProfile = useCreatorProfile();
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kycSubmittedMsg, setKycSubmittedMsg] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('kyc') === 'submitted') {
      setKycSubmittedMsg(true);
      setTimeout(() => setKycSubmittedMsg(false), 6000);
    }

    dashboardService
      .getCreatorSummary()
      .then(setSummary)
      .catch(() => setError('Failed to load dashboard data.'));
  }, [searchParams]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  const stats = summary?.stats;

  const statCards = [
    {
      title: 'Total Views',
      value: formatNumber(stats?.totalViews ?? 0),
      icon: <Eye className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    {
      title: 'Total Likes',
      value: formatNumber(stats?.totalLikes ?? 0),
      icon: <Heart className="h-4 w-4" />,
      color: 'text-red-600',
    },
    {
      title: 'Wallet Balance',
      value: formatCurrency(stats?.walletBalance ?? 0),
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600',
    },
    {
      title: 'Pending Applications',
      value: (stats?.pendingApplications ?? 0).toString(),
      icon: <Clock className="h-4 w-4" />,
      color: 'text-purple-600',
    },
  ];

  const isVerified = summary
    ? summary.verificationStatus === 'VERIFIED'
    : creatorProfile?.isVerified === true || creatorProfile?.verificationStatus === 'VERIFIED';

  return (
    <div className="space-y-6">
      {kycSubmittedMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-900">KYC Submitted Successfully!</p>
            <p className="text-sm text-green-700">Your verification is under review. We'll notify you within 24-48 hours.</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {/* KYC Completion Banner */}
      <KYCBanner
        userRole="CREATOR"
        isKYCComplete={isVerified}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your creator profile today.
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => router.push('/dashboard/creative/content/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/creative/content/new')}>
              <FileText className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/creative/posts')}>
              <Users className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/creative/withdrawals')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Withdraw Earnings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Check Messages
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest approved content and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!summary ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                Loading activity...
              </div>
            ) : summary.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent activity yet.
              </div>
            ) : (
              <div className="space-y-4">
                {summary.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
