'use client';

import { useState } from 'react';
import { PostScheduler, ScheduledPost } from '@/components/content/PostScheduler';
import { ContentQueue, PostPreviewData } from '@/components/content/ContentQueue';
import { PlatformIntegrations, PlatformIntegration } from '@/components/content/PlatformIntegrations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockScheduledPosts: ScheduledPost[] = [
  {
    id: 'p1',
    title: 'Summer Fashion Lookbook',
    platform: 'instagram',
    scheduledDate: '2024-06-15',
    scheduledTime: '10:00',
    status: 'scheduled',
    content: 'Check out our summer fashion collection! ☀️ #SummerFashion #OOTD',
    media: ['/placeholder1.jpg', '/placeholder2.jpg'],
    campaignId: '1',
  },
  {
    id: 'p2',
    title: 'Product Reveal Video',
    platform: 'tiktok',
    scheduledDate: '2024-06-16',
    scheduledTime: '14:00',
    status: 'scheduled',
    content: 'New product drop! Watch till the end 🎬 #NewProduct #Drop',
    media: ['/placeholder3.mp4'],
    campaignId: '1',
  },
  {
    id: 'p3',
    title: 'Behind the Scenes',
    platform: 'youtube',
    scheduledDate: '2024-06-10',
    scheduledTime: '18:00',
    status: 'published',
    content: 'Behind the scenes of our latest campaign shoot',
    media: ['/placeholder4.mp4'],
    campaignId: '1',
  },
];

const mockIntegrations: PlatformIntegration[] = [
  {
    id: 'ig',
    platform: 'instagram',
    name: 'Instagram Business',
    status: 'connected',
    lastSync: '2024-01-15T10:00:00Z',
    accountName: 'Fashion Brand Kenya',
    accountHandle: '@fashionbrandke',
    followerCount: 15000,
  },
  {
    id: 'tt',
    platform: 'tiktok',
    name: 'TikTok Business',
    status: 'connected',
    lastSync: '2024-01-15T09:30:00Z',
    accountName: 'Fashion Brand Kenya',
    accountHandle: '@fashionbrandke',
    followerCount: 25000,
  },
  {
    id: 'yt',
    platform: 'youtube',
    name: 'YouTube Channel',
    status: 'disconnected',
  },
  {
    id: 'fb',
    platform: 'facebook',
    name: 'Facebook Page',
    status: 'error',
    errorMessage: 'API key expired',
  },
];

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const [view, setView] = useState<'calendar' | 'queue' | 'integrations'>('calendar');
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);

  const handleBack = () => {
    router.push(`/dashboard/creative/campaigns/${params.id}`);
  };

  const handleAddPost = (post: Omit<ScheduledPost, 'id'>) => {
    const newPost: ScheduledPost = {
      ...post,
      id: Date.now().toString(),
    };
    setPosts([...posts, newPost]);
  };

  const handleEditPost = (id: string, updatedPost: Partial<ScheduledPost>) => {
    setPosts(posts.map(p => p.id === id ? { ...p, ...updatedPost } : p));
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handlePublishNow = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: 'published' } : p));
  };

  // Convert ScheduledPost to PostPreviewData for ContentQueue
  const postsAsPreviewData = posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    platform: p.platform,
    media: p.media,
    scheduledDate: p.scheduledDate,
    scheduledTime: p.scheduledTime,
    status: p.status,
  }));

  const handleConnect = (platformId: string) => {
    console.log('Connecting platform:', platformId);
  };

  const handleDisconnect = (platformId: string) => {
    console.log('Disconnecting platform:', platformId);
  };

  const handleSync = (platformId: string) => {
    console.log('Syncing platform:', platformId);
  };

  const handleSettings = (platformId: string) => {
    console.log('Opening settings for:', platformId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Post Scheduling</h1>
              <p className="text-muted-foreground">Campaign ID: {params.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'calendar' ? 'brand' : 'outline'}
          onClick={() => setView('calendar')}
          leftIcon={<Calendar className="h-4 w-4" />}
        >
          Calendar
        </Button>
        <Button
          variant={view === 'queue' ? 'brand' : 'outline'}
          onClick={() => setView('queue')}
        >
          Queue
        </Button>
        <Button
          variant={view === 'integrations' ? 'brand' : 'outline'}
          onClick={() => setView('integrations')}
        >
          Integrations
        </Button>
      </div>

      {/* Content */}
      {view === 'calendar' && (
        <PostScheduler
          posts={posts}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onPublishNow={handlePublishNow}
        />
      )}

      {view === 'queue' && (
        <ContentQueue
          posts={postsAsPreviewData}
          onEdit={(id) => handleEditPost(id, {})}
          onDelete={handleDeletePost}
          onPublishNow={handlePublishNow}
        />
      )}

      {view === 'integrations' && (
        <PlatformIntegrations
          integrations={mockIntegrations}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onSync={handleSync}
          onSettings={handleSettings}
        />
      )}
    </div>
  );
}
