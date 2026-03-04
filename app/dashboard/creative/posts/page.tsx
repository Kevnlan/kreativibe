'use client';

import { useState } from 'react';
import { Plus, Eye, Heart, MessageCircle, MoreHorizontal, Instagram, Youtube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';

const demoPosts = [
  {
    id: 1,
    title: 'Summer Fashion Lookbook',
    platform: 'Instagram',
    type: 'Reel',
    status: 'active',
    views: 48200,
    likes: 3100,
    comments: 214,
    price: 6500,
    postedAt: '2 days ago',
    brand: 'StyleHouse KE',
  },
  {
    id: 2,
    title: 'Skincare Morning Routine',
    platform: 'TikTok',
    type: 'Video',
    status: 'active',
    views: 91500,
    likes: 7200,
    comments: 430,
    price: 8000,
    postedAt: '5 days ago',
    brand: 'GlowUp Africa',
  },
  {
    id: 3,
    title: 'Nairobi Street Food Guide',
    platform: 'YouTube',
    type: 'Video',
    status: 'completed',
    views: 22300,
    likes: 1890,
    comments: 98,
    price: 12000,
    postedAt: '2 weeks ago',
    brand: 'FoodieKE',
  },
  {
    id: 4,
    title: 'Fitness Challenge Week 1',
    platform: 'Instagram',
    type: 'Post',
    status: 'active',
    views: 15600,
    likes: 980,
    comments: 67,
    price: 4500,
    postedAt: '3 days ago',
    brand: 'FitLife Nairobi',
  },
  {
    id: 5,
    title: 'Tech Review: Budget Phones',
    platform: 'YouTube',
    type: 'Video',
    status: 'pending',
    views: 0,
    likes: 0,
    comments: 0,
    price: 9500,
    postedAt: 'Scheduled',
    brand: 'TechKE',
  },
  {
    id: 6,
    title: 'Travel Vlog: Diani Beach',
    platform: 'TikTok',
    type: 'Video',
    status: 'completed',
    views: 134000,
    likes: 11200,
    comments: 670,
    price: 7500,
    postedAt: '1 month ago',
    brand: 'VisitKenya',
  },
];

const platformIcon = (platform: string) => {
  if (platform === 'YouTube') return <Youtube className="h-3.5 w-3.5" />;
  return <Instagram className="h-3.5 w-3.5" />;
};

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function MyPostsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');

  const filtered = filter === 'all' ? demoPosts : demoPosts.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Posts</h1>
          <p className="text-muted-foreground mt-1">Manage and track your content across all platforms</p>
        </div>
        <Button variant="brand">
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: demoPosts.length },
          { label: 'Active', value: demoPosts.filter(p => p.status === 'active').length },
          { label: 'Total Views', value: formatNumber(demoPosts.reduce((s, p) => s + p.views, 0)) },
          { label: 'Total Earned', value: formatCurrency(demoPosts.reduce((s, p) => s + p.price, 0)) },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-brand-blue text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.map(post => (
          <Card key={post.id}>
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{post.title}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[post.status]}`}>
                      {post.status}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {platformIcon(post.platform)} {post.platform} · {post.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.brand} · {post.postedAt}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatNumber(post.views)}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{formatNumber(post.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(post.price)}</span>
                </div>

                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
