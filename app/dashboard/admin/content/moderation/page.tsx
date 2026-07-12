'use client';

import { useState, useEffect } from 'react';
import { ModerationQueue, ContentItem } from '@/components/moderation/ModerationQueue';
import { ContentReviewPanel, ContentReview } from '@/components/moderation/ContentReviewPanel';
import { RuleChecksDisplay, RuleCheck } from '@/components/moderation/RuleChecksDisplay';
import { MLModerationResults, MLAnalysis } from '@/components/moderation/MLModerationResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { moderationService } from '@/services/moderation.service';
import { ModerationEntry } from '@/types/api-contracts/moderation.types';

function mapEntryToContentItem(entry: ModerationEntry): ContentItem {
  const statusMap: Record<string, ContentItem['status']> = {
    QUEUED: 'pending',
    IN_REVIEW: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };
  const failedRules = entry.ruleResults?.filter(r => !r.passed).length ?? 0;
  return {
    id: entry.contentId,
    title: entry.content?.title ?? 'Untitled',
    type: (entry.content?.type?.toLowerCase() as ContentItem['type']) ?? 'image',
    creator: {
      id: entry.content?.creatorProfile?.id ?? '',
      name: entry.content?.creatorProfile?.bio ?? 'Unknown creator',
      avatar: entry.content?.creatorProfile?.avatar,
    },
    category: 'General',
    platform: 'All',
    status: statusMap[entry.status] ?? 'pending',
    submittedAt: entry.submittedAt,
    ruleViolations: failedRules,
    mlScore: 0,
    thumbnail: entry.content?.thumbnailUrl,
  };
}

export default function ModerationPage() {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ModerationEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const response = await moderationService.getQueue({ page: 1, limit: 50 });
      setContentItems(response.items.map(mapEntryToContentItem));
    } catch (error) {
      console.error('Failed to load moderation queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (id: string) => {
    setSelectedItemId(id);
    try {
      const entry = await moderationService.getEntry(id);
      setSelectedEntry(entry);
    } catch (error) {
      console.error('Failed to load moderation entry:', error);
    }
  };

  const handleBack = () => {
    setSelectedItemId(null);
    setSelectedEntry(null);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await moderationService.approveContent({ contentId: id });
      await loadQueue();
      setSelectedItemId(null);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to approve content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      await moderationService.rejectContent({
        contentId: id,
        reasons: [{ reasonCode: 'MANUAL_REVIEW', notes: reason }],
      });
      await loadQueue();
      setSelectedItemId(null);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to reject content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlag = (id: string) => {
    console.log('Flagging content:', id);
    setSelectedItemId(null);
  };

  const handleBulkApprove = async (ids: string[]) => {
    setActionLoading(true);
    try {
      await Promise.all(ids.map(id => moderationService.approveContent({ contentId: id })));
      await loadQueue();
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkReject = async (ids: string[]) => {
    setActionLoading(true);
    try {
      await Promise.all(ids.map(id =>
        moderationService.rejectContent({
          contentId: id,
          reasons: [{ reasonCode: 'BULK_REJECTION', notes: 'Bulk rejected' }],
        })
      ));
      await loadQueue();
    } catch (error) {
      console.error('Failed to bulk reject:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const contentReview: ContentReview | null = selectedEntry ? {
    id: selectedEntry.contentId,
    title: selectedEntry.content?.title ?? 'Untitled',
    description: '',
    type: (selectedEntry.content?.type?.toLowerCase() as ContentReview['type']) ?? 'image',
    url: selectedEntry.content?.thumbnailUrl ?? '/placeholder.jpg',
    thumbnail: selectedEntry.content?.thumbnailUrl,
    creator: {
      id: selectedEntry.content?.creatorProfile?.id ?? '',
      name: selectedEntry.content?.creatorProfile?.bio ?? 'Unknown creator',
      email: '',
      verified: false,
    },
    category: 'General',
    platform: 'All',
    tags: [],
    submittedAt: selectedEntry.submittedAt,
    metadata: {
      fileSize: 0,
      format: 'unknown',
    },
  } : null;

  const ruleChecks: RuleCheck[] = selectedEntry?.ruleResults?.map(r => ({
    id: r.id,
    ruleName: r.ruleName,
    description: r.details ?? '',
    category: 'compliance',
    severity: r.passed ? 'low' : 'high',
    status: r.passed ? 'passed' : 'failed',
    details: r.details,
  })) ?? [];

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading moderation queue...
      </div>
    );
  }

  if (selectedItemId && contentReview) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Queue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContentReviewPanel
              content={contentReview}
              onApprove={handleApprove}
              onReject={handleReject}
              onFlag={handleFlag}
            />
          </div>

          <div className="space-y-6">
            {actionLoading && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </div>
            )}
            <RuleChecksDisplay checks={ruleChecks} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ModerationQueue
        items={contentItems}
        onItemClick={handleItemClick}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
      />
    </div>
  );
}
