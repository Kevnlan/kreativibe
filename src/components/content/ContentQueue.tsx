'use client';

import { useState } from 'react';
import { Clock, Play, Pause, Trash2, ArrowUp, ArrowDown, Filter, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PostPreview } from './PostPreview';
import { cn } from '../../lib/utils';

interface ContentQueueProps {
  posts: PostPreviewData[];
  onEdit?: (id: string, updatedPost?: Partial<PostPreviewData>) => void;
  onDelete?: (id: string) => void;
  onPublishNow?: (id: string) => void;
  onReorder?: (posts: PostPreviewData[]) => void;
}

export interface PostPreviewData {
  id: string;
  title: string;
  content: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  media?: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  hashtags?: string[];
  mentions?: string[];
}

export function ContentQueue({ posts, onEdit, onDelete, onPublishNow, onReorder }: ContentQueueProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'status'>('date');

  const filteredPosts = posts.filter(post => {
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || post.platform === filterPlatform;
    return matchesStatus && matchesPlatform;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    }
    if (sortBy === 'platform') {
      return a.platform.localeCompare(b.platform);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const failedCount = posts.filter(p => p.status === 'failed').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Content Queue</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="warning">{scheduledCount} Scheduled</Badge>
            <Badge variant="success">{publishedCount} Published</Badge>
            {failedCount > 0 && <Badge variant="destructive">{failedCount} Failed</Badge>}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'platform' | 'status')}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="date">Sort by Date</option>
            <option value="platform">Sort by Platform</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublishNow={onPublishNow}
              showActions
            />
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No posts match your filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
