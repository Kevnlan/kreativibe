'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostScheduler, ScheduledPost as UiScheduledPost } from '@/components/content/PostScheduler';
import { ContentQueue, PostPreviewData } from '@/components/content/ContentQueue';
import { PlatformIntegrations, PlatformIntegration } from '@/components/content/PlatformIntegrations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { schedulingService } from '@/services/scheduling.service';
import { socialService } from '@/services/social.service';
import { ScheduledPost as ApiScheduledPost, ScheduledPostPlatform, ScheduledPostStatus } from '@/types/api-contracts/scheduling.types';
import { SocialAccount, SocialPlatform } from '@/types/api-contracts/social.types';

// UI components use lowercase platform/status values; the API uses uppercase.
const platformToUi: Record<ScheduledPostPlatform, UiScheduledPost['platform']> = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
};

const platformToApi: Record<UiScheduledPost['platform'], ScheduledPostPlatform> = {
  instagram: 'INSTAGRAM',
  tiktok: 'TIKTOK',
  youtube: 'YOUTUBE',
  twitter: 'FACEBOOK', // not supported by the API; falls back to Facebook
  facebook: 'FACEBOOK',
};

const statusToUi: Record<ScheduledPostStatus, UiScheduledPost['status']> = {
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  FAILED: 'failed',
};

function toUiPost(post: ApiScheduledPost): UiScheduledPost {
  return {
    id: post.id,
    title: post.title,
    platform: platformToUi[post.platform],
    scheduledDate: post.scheduledDate,
    scheduledTime: post.scheduledTime,
    status: statusToUi[post.status],
    content: post.content,
    media: post.media,
    campaignId: post.campaignId,
  };
}

const socialPlatformToUi: Record<SocialPlatform, PlatformIntegration['platform'] | null> = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
};

function toIntegration(account: SocialAccount): PlatformIntegration {
  return {
    id: account.id,
    platform: socialPlatformToUi[account.platform] ?? 'instagram',
    name: `${account.platform.charAt(0)}${account.platform.slice(1).toLowerCase()} Account`,
    status: account.isActive ? 'connected' : 'disconnected',
    lastSync: account.lastSyncedAt,
    accountName: account.displayName,
    accountHandle: account.username ? `@${account.username}` : undefined,
  };
}

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [view, setView] = useState<'calendar' | 'queue' | 'integrations'>('calendar');
  const [posts, setPosts] = useState<UiScheduledPost[]>([]);
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([
      schedulingService.listScheduledPosts(campaignId),
      socialService.getAccounts(),
    ])
      .then(([postsRes, accountsRes]) => {
        setPosts(postsRes.posts.map(toUiPost));
        setIntegrations(accountsRes.accounts.map(toIntegration));
      })
      .catch(() => setError('Failed to load scheduling data. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => {
    router.push(`/dashboard/creative/campaigns/${campaignId}`);
  };

  const handleAddPost = async (post: Omit<UiScheduledPost, 'id'>) => {
    try {
      const created = await schedulingService.createScheduledPost(campaignId, {
        title: post.title,
        platform: platformToApi[post.platform],
        scheduledDate: post.scheduledDate,
        scheduledTime: post.scheduledTime,
        content: post.content,
        media: post.media ?? [],
      });
      setPosts(prev => [...prev, toUiPost(created)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post.');
    }
  };

  const handleEditPost = async (id: string, updatedPost: Partial<UiScheduledPost>) => {
    try {
      const updated = await schedulingService.updateScheduledPost(campaignId, id, {
        ...(updatedPost.title !== undefined && { title: updatedPost.title }),
        ...(updatedPost.platform !== undefined && { platform: platformToApi[updatedPost.platform] }),
        ...(updatedPost.scheduledDate !== undefined && { scheduledDate: updatedPost.scheduledDate }),
        ...(updatedPost.scheduledTime !== undefined && { scheduledTime: updatedPost.scheduledTime }),
        ...(updatedPost.content !== undefined && { content: updatedPost.content }),
        ...(updatedPost.media !== undefined && { media: updatedPost.media }),
      });
      setPosts(prev => prev.map(p => (p.id === id ? toUiPost(updated) : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post.');
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await schedulingService.deleteScheduledPost(campaignId, id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post.');
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      const published = await schedulingService.publishNow(campaignId, id);
      setPosts(prev => prev.map(p => (p.id === id ? toUiPost(published) : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish post.');
    }
  };

  // Convert ScheduledPost to PostPreviewData for ContentQueue
  const postsAsPreviewData: PostPreviewData[] = posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    platform: p.platform,
    media: p.media,
    scheduledDate: p.scheduledDate,
    scheduledTime: p.scheduledTime,
    status: p.status,
  }));

  const handleConnect = async (platformId: string) => {
    try {
      const apiPlatform = (Object.entries(socialPlatformToUi).find(([, ui]) => ui === platformId)?.[0] ??
        'INSTAGRAM') as SocialPlatform;
      await socialService.connectAccount({
        platform: apiPlatform,
        redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
      });
      // OAuth is stubbed server-side; refresh the list once the flow completes elsewhere.
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect platform.');
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      await socialService.disconnectAccount(platformId);
      setIntegrations(prev => prev.filter(i => i.id !== platformId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect platform.');
    }
  };

  const handleSync = async (platformId: string) => {
    try {
      const synced = await socialService.syncAccount(platformId);
      setIntegrations(prev => prev.map(i => (i.id === platformId ? toIntegration(synced) : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync platform.');
    }
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
              <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading scheduling data...
        </div>
      ) : (
        <>
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
            integrations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No social accounts connected yet.
              </div>
            ) : (
              <PlatformIntegrations
                integrations={integrations}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSync={handleSync}
                onSettings={handleSettings}
              />
            )
          )}
        </>
      )}
    </div>
  );
}
