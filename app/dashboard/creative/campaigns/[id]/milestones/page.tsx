'use client';

import { useState } from 'react';
import { MilestoneTracker, Milestone } from '@/components/campaign/MilestoneTracker';
import { DeliveryApproval, DeliveryData } from '@/components/campaign/DeliveryApproval';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Initial Content Creation',
    description: 'Create and submit first batch of content for review',
    dueDate: '2024-06-15',
    amount: 45000,
    currency: 'KES',
    status: 'completed',
    deliverables: [
      '5 Instagram posts',
      '8 TikTok videos',
      '5 Instagram stories',
    ],
    submittedAt: '2024-06-10T14:30:00Z',
    approvedAt: '2024-06-12T10:00:00Z',
  },
  {
    id: '2',
    title: 'Mid-Campaign Content',
    description: 'Create and submit second batch of content',
    dueDate: '2024-07-15',
    amount: 60000,
    currency: 'KES',
    status: 'in_progress',
    deliverables: [
      '5 Instagram posts',
      '8 TikTok videos',
      '10 Instagram stories',
      '5 YouTube shorts',
    ],
  },
  {
    id: '3',
    title: 'Final Deliverables',
    description: 'Submit all remaining content and final report',
    dueDate: '2024-08-25',
    amount: 45000,
    currency: 'KES',
    status: 'pending',
    deliverables: [
      '5 Instagram posts',
      '4 TikTok videos',
      '15 Instagram stories',
      '5 YouTube shorts',
      'Final performance report',
    ],
  },
];

const mockDelivery: DeliveryData = {
  milestoneId: '2',
  milestoneTitle: 'Mid-Campaign Content',
  submittedBy: 'You',
  submittedAt: '2024-07-10T10:00:00Z',
  items: [
    {
      id: '1',
      title: 'Summer Fashion Post 1',
      type: 'image',
      url: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      description: 'Instagram post showcasing summer collection',
      metadata: {
        fileSize: 2500000,
        dimensions: { width: 1080, height: 1080 },
      },
    },
    {
      id: '2',
      title: 'Fashion TikTok Video',
      type: 'video',
      url: '/placeholder.mp4',
      thumbnail: '/placeholder.jpg',
      description: 'TikTok video with fashion trends',
      metadata: {
        fileSize: 15000000,
        duration: 60,
      },
    },
  ],
  notes: 'All content follows brand guidelines and includes required hashtags.',
};

export default function MilestonesPage() {
  const router = useRouter();
  const params = useParams();
  const [view, setView] = useState<'tracker' | 'delivery'>('tracker');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const handleBack = () => {
    router.push(`/dashboard/creative/campaigns/${params.id}`);
  };

  const handleSubmitDelivery = (milestoneId: string, data: any) => {
    console.log('Submitting delivery for milestone:', milestoneId, data);
    // In production, handle file upload and submission
  };

  const handleViewDetails = (milestoneId: string) => {
    const milestone = mockMilestones.find(m => m.id === milestoneId);
    if (milestone) {
      setSelectedMilestone(milestone);
      if (milestone.status === 'submitted') {
        setView('delivery');
      }
    }
  };

  const handleApproveDelivery = (milestoneId: string, feedback?: string) => {
    console.log('Approving delivery:', milestoneId, feedback);
    setView('tracker');
  };

  const handleRejectDelivery = (milestoneId: string, reason: string) => {
    console.log('Rejecting delivery:', milestoneId, reason);
    setView('tracker');
  };

  const handleRequestRevision = (milestoneId: string, feedback: string) => {
    console.log('Requesting revision:', milestoneId, feedback);
    setView('tracker');
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
            <p className="text-muted-foreground">Campaign ID: {params.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'tracker' ? (
        <MilestoneTracker
          milestones={mockMilestones}
          onSubmitDelivery={handleSubmitDelivery}
          onViewDetails={handleViewDetails}
        />
      ) : (
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
            delivery={mockDelivery}
            onApprove={handleApproveDelivery}
            onReject={handleRejectDelivery}
            onRequestRevision={handleRequestRevision}
          />
        </div>
      )}
    </div>
  );
}
