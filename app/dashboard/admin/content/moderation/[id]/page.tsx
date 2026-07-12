'use client';

import { useState, useEffect } from 'react';
import { ContentReviewPanel, ContentReview } from '@/components/moderation/ContentReviewPanel';
import { RuleChecksDisplay, RuleCheck } from '@/components/moderation/RuleChecksDisplay';
import { RejectionReasonSelector } from '@/components/moderation/RejectionReasonSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { moderationService } from '@/services/moderation.service';
import { ModerationEntry } from '@/types/api-contracts/moderation.types';

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;
  const [entry, setEntry] = useState<ModerationEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [contentId]);

  const loadEntry = async () => {
    setLoading(true);
    try {
      const data = await moderationService.getEntry(contentId);
      setEntry(data);
    } catch (error) {
      console.error('Failed to load moderation entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/admin/content/moderation');
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await moderationService.approveContent({ contentId });
      router.push('/dashboard/admin/content/moderation');
    } catch (error) {
      console.error('Failed to approve content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (rejectionReasons.length === 0) {
      alert('Please select at least one rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      const reasons = rejectionReasons.map(code => ({
        reasonCode: code.toUpperCase().replace(/\s+/g, '_'),
        notes: customReason || '',
      }));
      await moderationService.rejectContent({ contentId, reasons });
      router.push('/dashboard/admin/content/moderation');
    } catch (error) {
      console.error('Failed to reject content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlag = () => {
    console.log('Flagging content:', contentId);
    router.push('/dashboard/admin/content/moderation');
  };

  const contentReview: ContentReview | null = entry ? {
    id: entry.contentId,
    title: entry.content?.title ?? 'Untitled',
    description: '',
    type: (entry.content?.type?.toLowerCase() as ContentReview['type']) ?? 'image',
    url: entry.content?.thumbnailUrl ?? '/placeholder.jpg',
    thumbnail: entry.content?.thumbnailUrl,
    creator: {
      id: entry.content?.creatorProfile?.id ?? '',
      name: entry.content?.creatorProfile?.bio ?? 'Unknown creator',
      email: '',
      verified: false,
    },
    category: 'General',
    platform: 'All',
    tags: [],
    submittedAt: entry.submittedAt,
    metadata: {
      fileSize: 0,
      format: 'unknown',
    },
  } : null;

  const ruleChecks: RuleCheck[] = entry?.ruleResults?.map(r => ({
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
        Loading content review...
      </div>
    );
  }

  if (!contentReview) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Queue
        </Button>
        <p className="text-muted-foreground">Failed to load content.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to Queue
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContentReviewPanel
            content={contentReview}
            onApprove={handleApprove}
            onReject={() => setShowRejectionForm(true)}
            onFlag={handleFlag}
          />

          {showRejectionForm && (
            <RejectionReasonSelector
              selectedReasons={rejectionReasons}
              onReasonsChange={setRejectionReasons}
              customReason={customReason}
              onCustomReasonChange={setCustomReason}
            />
          )}

          {showRejectionForm && (
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejectionReasons.length === 0 || actionLoading}
                leftIcon={<X className="h-4 w-4" />}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReasons([]);
                  setCustomReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {actionLoading && !showRejectionForm && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </div>
          )}
        </div>

        <div className="space-y-6">
          <RuleChecksDisplay checks={ruleChecks} />
        </div>
      </div>
    </div>
  );
}
