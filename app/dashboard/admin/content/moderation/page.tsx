'use client';

import { useState } from 'react';
import { ModerationQueue, ContentItem } from '@/components/moderation/ModerationQueue';
import { ContentReviewPanel, ContentReview } from '@/components/moderation/ContentReviewPanel';
import { RuleChecksDisplay, RuleCheck } from '@/components/moderation/RuleChecksDisplay';
import { MLModerationResults, MLAnalysis } from '@/components/moderation/MLModerationResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Summer Fashion Lookbook',
    type: 'image',
    creator: { id: 'c1', name: 'Sarah Mwangi' },
    category: 'Fashion',
    platform: 'Instagram',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    ruleViolations: 0,
    mlScore: 15,
    thumbnail: '/placeholder.jpg',
  },
  {
    id: '2',
    title: 'Tech Review Video',
    type: 'video',
    creator: { id: 'c2', name: 'James Kamau' },
    category: 'Tech',
    platform: 'YouTube',
    status: 'pending',
    submittedAt: '2024-01-15T09:45:00Z',
    ruleViolations: 2,
    mlScore: 65,
  },
  {
    id: '3',
    title: 'Fitness Tutorial',
    type: 'video',
    creator: { id: 'c3', name: 'Fitness Pro' },
    category: 'Fitness',
    platform: 'TikTok',
    status: 'flagged',
    submittedAt: '2024-01-15T08:20:00Z',
    ruleViolations: 3,
    mlScore: 78,
  },
];

const mockRuleChecks: RuleCheck[] = [
  {
    id: 'r1',
    ruleName: 'Content Quality',
    description: 'Checks for minimum resolution and quality standards',
    category: 'quality',
    severity: 'medium',
    status: 'passed',
  },
  {
    id: 'r2',
    ruleName: 'Copyright Detection',
    description: 'Scans for potential copyright violations',
    category: 'copyright',
    severity: 'high',
    status: 'passed',
  },
  {
    id: 'r3',
    ruleName: 'Safety Guidelines',
    description: 'Ensures content meets safety standards',
    category: 'safety',
    severity: 'high',
    status: 'failed',
    details: 'Content contains potentially harmful material',
    recommendation: 'Review and remove or edit flagged sections',
  },
];

const mockMLAnalysis: MLAnalysis = {
  overallRiskScore: 65,
  confidence: 92,
  categories: [
    {
      name: 'Inappropriate Content',
      score: 45,
      confidence: 88,
      flagged: false,
    },
    {
      name: 'Copyright Violation',
      score: 20,
      confidence: 95,
      flagged: false,
    },
    {
      name: 'Safety Guidelines',
      score: 78,
      confidence: 91,
      flagged: true,
      details: 'Detected content that may violate safety guidelines',
    },
  ],
  recommendations: [
    'Manual review recommended due to high safety risk score',
    'Consider requesting creator to edit flagged sections',
    'Document decision for future reference',
  ],
  processedAt: new Date().toISOString(),
  modelVersion: '2.1.0',
};

const mockContentReview: ContentReview = {
  id: '1',
  title: 'Summer Fashion Lookbook',
  description: 'A stunning summer fashion lookbook featuring the latest trends in casual wear.',
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
  tags: ['fashion', 'summer', 'casual', 'trends'],
  submittedAt: '2024-01-15T10:30:00Z',
  metadata: {
    dimensions: { width: 1920, height: 1080 },
    fileSize: 2500000,
    format: 'jpg',
  },
};

export default function ModerationPage() {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);

  const handleItemClick = (id: string) => {
    setSelectedItemId(id);
  };

  const handleBack = () => {
    setSelectedItemId(null);
  };

  const handleApprove = (id: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'approved' as const } : item
      )
    );
    setSelectedItemId(null);
  };

  const handleReject = (id: string, reason: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'rejected' as const } : item
      )
    );
    setSelectedItemId(null);
  };

  const handleFlag = (id: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'flagged' as const } : item
      )
    );
    setSelectedItemId(null);
  };

  const handleBulkApprove = (ids: string[]) => {
    setContentItems(prev =>
      prev.map(item =>
        ids.includes(item.id) ? { ...item, status: 'approved' as const } : item
      )
    );
  };

  const handleBulkReject = (ids: string[]) => {
    setContentItems(prev =>
      prev.map(item =>
        ids.includes(item.id) ? { ...item, status: 'rejected' as const } : item
      )
    );
  };

  if (selectedItemId) {
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
              content={mockContentReview}
              onApprove={handleApprove}
              onReject={handleReject}
              onFlag={handleFlag}
            />
          </div>

          <div className="space-y-6">
            <MLModerationResults analysis={mockMLAnalysis} />
            <RuleChecksDisplay checks={mockRuleChecks} />
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
