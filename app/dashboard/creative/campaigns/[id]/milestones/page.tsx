'use client';

import { useState, useEffect } from 'react';
import { MilestoneTracker, Milestone as TrackerMilestone } from '@/components/campaign/MilestoneTracker';
import { DeliveryApproval, DeliveryData } from '@/components/campaign/DeliveryApproval';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { campaignService } from '@/services/campaign.service';
import { Milestone, MilestoneStatus, MilestoneDeliveryItemType } from '@/types/campaign.types';

const STATUS_MAP: Record<MilestoneStatus, TrackerMilestone['status']> = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'in_progress',
};

const ITEM_TYPE_MAP: Record<MilestoneDeliveryItemType, 'image' | 'video' | 'document' | 'link'> = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'document',
  LINK: 'link',
};

function toTrackerMilestone(m: Milestone): TrackerMilestone {
  return {
    id: m.id,
    title: m.title,
    description: m.description || '',
    dueDate: m.dueDate || '',
    amount: m.amount,
    currency: m.currency,
    status: STATUS_MAP[m.status],
    deliverables: m.deliverables,
    submittedAt: m.submittedAt,
    approvedAt: m.approvedAt,
  };
}

export default function MilestonesPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [view, setView] = useState<'tracker' | 'delivery'>('tracker');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    campaignService
      .listMilestones(campaignId)
      .then(setMilestones)
      .catch(() => setError('Failed to load milestones. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  const handleBack = () => {
    router.push(`/dashboard/creative/campaigns`);
  };

  const handleSubmitDelivery = async (milestoneId: string, data: any) => {
    setError(null);
    try {
      const updated = await campaignService.submitMilestoneDelivery(campaignId, milestoneId, {
        items: data.items ?? [],
        notes: data.notes,
      });
      setMilestones(prev => prev.map(m => (m.id === milestoneId ? { ...m, status: 'SUBMITTED', submittedAt: updated.submittedAt } : m)));
    } catch {
      setError('Failed to submit delivery. Please try again.');
    }
  };

  const handleViewDetails = async (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    if (milestone.status !== 'SUBMITTED' && milestone.status !== 'APPROVED' && milestone.status !== 'REJECTED') return;

    try {
      const result = await campaignService.getMilestoneDelivery(campaignId, milestoneId);
      setDelivery({
        milestoneId: result.milestoneId,
        milestoneTitle: result.milestoneTitle,
        submittedBy: result.submittedBy,
        submittedAt: result.submittedAt,
        items: result.items.map((item, i) => ({
          id: String(i),
          title: item.title,
          type: ITEM_TYPE_MAP[item.type],
          url: item.url,
          thumbnail: item.thumbnail,
          description: item.description,
        })),
        notes: result.notes,
      });
      setView('delivery');
    } catch {
      setError('No delivery found for this milestone yet.');
    }
  };

  const handleApproveDelivery = async (milestoneId: string) => {
    setError(null);
    try {
      await campaignService.approveMilestoneDelivery(campaignId, milestoneId);
      setMilestones(prev => prev.map(m => (m.id === milestoneId ? { ...m, status: 'APPROVED' } : m)));
      setView('tracker');
    } catch {
      setError('Failed to approve delivery. Please try again.');
    }
  };

  const handleRejectDelivery = async (milestoneId: string, reason: string) => {
    setError(null);
    try {
      await campaignService.rejectMilestoneDelivery(campaignId, milestoneId, reason);
      setMilestones(prev => prev.map(m => (m.id === milestoneId ? { ...m, status: 'REJECTED' } : m)));
      setView('tracker');
    } catch {
      setError('Failed to reject delivery. Please try again.');
    }
  };

  const handleRequestRevision = async (milestoneId: string, feedback: string) => {
    setError(null);
    try {
      await campaignService.requestMilestoneRevision(campaignId, milestoneId, feedback);
      setMilestones(prev => prev.map(m => (m.id === milestoneId ? { ...m, status: 'REVISION_REQUESTED' } : m)));
      setView('tracker');
    } catch {
      setError('Failed to request revision. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Milestone Tracking</h1>
            <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading milestones...
        </div>
      ) : view === 'tracker' ? (
        <MilestoneTracker
          milestones={milestones.map(toTrackerMilestone)}
          onSubmitDelivery={handleSubmitDelivery}
          onViewDetails={handleViewDetails}
        />
      ) : delivery ? (
        <div>
          <Button
            variant="ghost"
            onClick={() => setView('tracker')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
          >
            Back to Milestones
          </Button>
          <DeliveryApproval
            delivery={delivery}
            onApprove={handleApproveDelivery}
            onReject={handleRejectDelivery}
            onRequestRevision={handleRequestRevision}
          />
        </div>
      ) : null}
    </div>
  );
}
