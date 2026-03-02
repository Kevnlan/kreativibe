'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Plus,
  Search,
  Filter,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { useBrandProfile, useUser } from '@/contexts/AuthContext';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function BrandDashboard() {
  const brandProfile = useBrandProfile();
  const user = useUser();
  const [stats, setStats] = useState({
    activeCampaigns: 5,
    totalSpent: 85000,
    creatorsEngaged: 23,
    avgEngagement: 4.2,
    pendingOrders: 2,
    completedCampaigns: 12,
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      activeCampaigns: 5,
      totalSpent: 85000,
      creatorsEngaged: 23,
      avgEngagement: 4.2,
      pendingOrders: 2,
      completedCampaigns: 12,
    });
  }, []);

  if (!brandProfile || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      change: '+2',
      icon: <Target className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      change: '+15%',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600',
    },
    {
      title: 'Creators Engaged',
      value: stats.creatorsEngaged.toString(),
      change: '+8',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Engagement',
      value: stats.avgEngagement.toFixed(1),
      change: '+0.3',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-orange-600',
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: 'Summer Collection Launch',
      status: 'active',
      creators: 5,
      budget: 15000,
      engagement: 4.5,
    },
    {
      id: 2,
      name: 'Product Review Campaign',
      status: 'active',
      creators: 3,
      budget: 8000,
      engagement: 4.2,
    },
    {
      id: 3,
      name: 'Brand Awareness Q3',
      status: 'completed',
      creators: 8,
      budget: 25000,
      engagement: 4.8,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {brandProfile.companyName} Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your campaigns and track performance
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Find Creators
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
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
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  Your latest marketing campaigns
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{campaign.creators} creators</span>
                      <span>{formatCurrency(campaign.budget)}</span>
                      <span>{campaign.engagement} avg engagement</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Find Creators
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      {stats.pendingOrders > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
            <CardDescription>
              You have {stats.pendingOrders} orders awaiting your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Campaign Order #{order}</p>
                    <p className="text-sm text-muted-foreground">Creator #{order * 3} - Instagram Post</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
