'use client';

import { useState } from 'react';
import { ContentReviewPanel, ContentReview } from '@/components/moderation/ContentReviewPanel';
import { RuleChecksDisplay, RuleCheck } from '@/components/moderation/RuleChecksDisplay';
import { MLModerationResults, MLAnalysis } from '@/components/moderation/MLModerationResults';
import { RejectionReasonSelector } from '@/components/moderation/RejectionReasonSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockContentReview: ContentReview = {
  id: '1',
  title: 'Summer Fashion Lookbook',
  description: 'A stunning summer fashion lookbook featuring the latest trends in casual wear. This collection showcases vibrant colors, comfortable fabrics, and modern designs perfect for the season.',
  type: 'image',
  url: '/placeholder.jpg',
  thumbnail: '/placeholder.jpg',
  creator: {
    id: 'c1',
    name: 'Sarah Mwangi',
    email: 'sarah@example.com',
    verified: true,
  },
  category: 'Fashion',
  platform: 'Instagram',
  tags: ['fashion', 'summer', 'casual', 'trends', 'style'],
  submittedAt: '2024-01-15T10:30:00Z',
  metadata: {
    dimensions: { width: 1920, height: 1080 },
    fileSize: 2500000,
    format: 'jpg',
  },
};

const mockRuleChecks: RuleCheck[] = [
  {
    id: 'r1',
    ruleName: 'Content Quality',
    description: 'Checks for minimum resolution and quality standards',
    category: 'quality',
    severity: 'medium',
    status: 'passed',
    details: 'Image meets minimum resolution requirements (1920x1080)',
  },
  {
    id: 'r2',
    ruleName: 'Copyright Detection',
    description: 'Scans for potential copyright violations',
    category: 'copyright',
    severity: 'high',
    status: 'passed',
    details: 'No copyright violations detected',
  },
  {
    id: 'r3',
    ruleName: 'Safety Guidelines',
    description: 'Ensures content meets safety standards',
    category: 'safety',
    severity: 'high',
    status: 'passed',
    details: 'Content passes all safety guidelines',
  },
  {
    id: 'r4',
    ruleName: 'Platform Compliance',
    description: 'Checks platform-specific requirements',
    category: 'compliance',
    severity: 'medium',
    status: 'passed',
    details: 'Meets Instagram content guidelines',
  },
  {
    id: 'r5',
    ruleName: 'Content Classification',
    description: 'Automatically categorizes content type',
    category: 'content',
    severity: 'low',
    status: 'passed',
    details: 'Classified as fashion/lifestyle content',
  },
];

const mockMLAnalysis: MLAnalysis = {
  overallRiskScore: 15,
  confidence: 94,
  categories: [
    {
      name: 'Inappropriate Content',
      score: 5,
      confidence: 96,
      flagged: false,
    },
    {
      name: 'Copyright Violation',
      score: 10,
      confidence: 92,
      flagged: false,
    },
    {
      name: 'Safety Guidelines',
      score: 8,
      confidence: 95,
      flagged: false,
    },
    {
      name: 'Quality Standards',
      score: 20,
      confidence: 90,
      flagged: false,
    },
    {
      name: 'Brand Safety',
      score: 12,
      confidence: 93,
      flagged: false,
    },
  ],
  recommendations: [
    'Content appears safe for approval',
    'No issues detected by automated systems',
    'Manual review recommended for final decision',
  ],
  processedAt: new Date().toISOString(),
  modelVersion: '2.1.0',
};

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const handleBack = () => {
    router.push('/dashboard/admin/content/moderation');
  };

  const handleApprove = () => {
    // In production, call API to approve content
    console.log('Approving content:', params.id);
    router.push('/dashboard/admin/content/moderation');
  };

  const handleReject = () => {
    if (rejectionReasons.length === 0) {
      alert('Please select at least one rejection reason');
      return;
    }
    // In production, call API to reject content with reasons
    console.log('Rejecting content:', params.id, 'Reasons:', rejectionReasons, 'Custom:', customReason);
    router.push('/dashboard/admin/content/moderation');
  };

  const handleFlag = () => {
    // In production, call API to flag content
    console.log('Flagging content:', params.id);
    router.push('/dashboard/admin/content/moderation');
  };

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
            content={mockContentReview}
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
                disabled={rejectionReasons.length === 0}
                leftIcon={<X className="h-4 w-4" />}
              >
                Confirm Rejection
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
        </div>

        <div className="space-y-6">
          <MLModerationResults analysis={mockMLAnalysis} />
          <RuleChecksDisplay checks={mockRuleChecks} />
        </div>
      </div>
    </div>
  );
}
