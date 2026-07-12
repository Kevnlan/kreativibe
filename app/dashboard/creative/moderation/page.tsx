'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock, Upload } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge, EmptyState } from '@/components/ui';
import { moderationService } from '@/services/moderation.service';
import { contentService } from '@/services/content.service';
import { CreatorModerationStatus, ModerationStatus } from '@/types/api-contracts/moderation.types';
import { Content } from '@/types/api-contracts/content.types';

export default function CreatorModerationPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [moderationStatuses, setModerationStatuses] = useState<Record<string, CreatorModerationStatus | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contentService.getMyContents({ limit: 50 });
      const items = response.data || [];
      setContents(items);
      const statuses: Record<string, CreatorModerationStatus | null> = {};
      await Promise.all(
        items.map(async (content: Content) => {
          try {
            const status = await moderationService.getStatus(content.id);
            statuses[content.id] = status;
          } catch {
            statuses[content.id] = null;
          }
        })
      );
      setModerationStatuses(statuses);
    } catch {
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async (contentId: string) => {
    setActionLoading(contentId);
    try {
      await moderationService.resubmitContent(contentId);
      const status = await moderationService.getStatus(contentId);
      setModerationStatuses(prev => ({ ...prev, [contentId]: status }));
    } catch {
      setError('Failed to resubmit content.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: ModerationStatus) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'IN_REVIEW': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: ModerationStatus) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'IN_REVIEW': return 'warning';
      default: return 'pending';
    }
  };

  const submittedContents = contents.filter(c =>
    c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'REJECTED' || c.moderationStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading moderation status...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderation Status</h1>
          <p className="text-muted-foreground">Track your submitted content through the moderation process</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadContents} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {submittedContents.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="h-8 w-8" />}
          title="No submitted content"
          description="Your submitted content will appear here for moderation tracking."
        />
      ) : (
        <div className="space-y-3">
          {submittedContents.map((content) => {
            const modStatus = moderationStatuses[content.id];
            const rawStatus = modStatus?.moderationStatus ?? content.moderationStatus ?? 'QUEUED';
            const status = (rawStatus === 'PENDING' ? 'QUEUED' : rawStatus) as ModerationStatus;
            const isRejected = status === 'REJECTED';

            return (
              <Card key={content.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {content.thumbnailUrl ? (
                        <img
                          src={content.thumbnailUrl}
                          alt={content.metadata?.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{content.metadata?.title ?? 'Untitled'}</h3>
                          <StatusBadge variant={getStatusVariant(status)}>
                            {status}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{content.type}</span>
                          <span>·</span>
                          <span>Updated {new Date(content.updatedAt).toLocaleDateString()}</span>
                        </div>

                        {isRejected && modStatus?.rejectionReasons && modStatus.rejectionReasons.length > 0 && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-red-900 mb-2">Rejection Reasons:</p>
                            <ul className="space-y-1">
                              {modStatus.rejectionReasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-red-700">
                                  <strong>{reason.reasonCode}</strong>: {reason.notes}
                                </li>
                              ))}
                            </ul>
                            {modStatus.reviewedAt && (
                              <p className="text-xs text-red-600 mt-2">
                                Reviewed on {new Date(modStatus.reviewedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {status === 'APPROVED' && (
                          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs text-green-700">
                              Your content has been approved and is now available in the marketplace.
                            </p>
                          </div>
                        )}

                        {status === 'IN_REVIEW' && (
                          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-700">
                              Your content is currently under review by our moderation team.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {isRejected && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResubmit(content.id)}
                        disabled={actionLoading === content.id}
                        leftIcon={<Upload className="h-4 w-4" />}
                        className="flex-shrink-0"
                      >
                        {actionLoading === content.id ? 'Resubmitting...' : 'Resubmit'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
