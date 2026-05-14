'use client';

import { useState } from 'react';
import { ConversationBuilder, Message } from '@/components/campaign/ConversationBuilder';
import { ConversationHistory, Conversation } from '@/components/campaign/ConversationHistory';
import { BriefGenerator, CampaignBrief } from '@/components/campaign/BriefGenerator';
import { PackageRecommender, PackageOption } from '@/components/campaign/PackageRecommender';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Mock data for development
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Summer Fashion Campaign',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    messageCount: 12,
    status: 'completed',
    summary: 'Campaign targeting young adults for summer fashion collection',
  },
];

const mockPackages: PackageOption[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    description: 'Perfect for small businesses and first-time campaigns',
    price: 50000,
    currency: 'KES',
    features: [
      '3-5 influencers',
      '10-15 content pieces',
      'Basic analytics',
      '1 month duration',
      'Instagram & TikTok',
    ],
    recommended: false,
    estimatedReach: 50000,
    estimatedEngagement: 5000,
    suitableFor: ['Small Business', 'First Campaign', 'Limited Budget'],
  },
  {
    id: 'growth',
    name: 'Growth Package',
    description: 'Ideal for growing brands looking to expand their reach',
    price: 150000,
    currency: 'KES',
    features: [
      '8-12 influencers',
      '25-40 content pieces',
      'Advanced analytics',
      '2 month duration',
      'Multi-platform support',
      'Dedicated account manager',
    ],
    recommended: true,
    estimatedReach: 200000,
    estimatedEngagement: 25000,
    suitableFor: ['Growing Brand', 'Multi-platform', 'Extended Campaign'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    description: 'Comprehensive solution for large-scale campaigns',
    price: 500000,
    currency: 'KES',
    features: [
      '20+ influencers',
      '50+ content pieces',
      'Premium analytics dashboard',
      '3 month duration',
      'All platforms',
      '24/7 support',
      'Custom integrations',
    ],
    recommended: false,
    estimatedReach: 1000000,
    estimatedEngagement: 150000,
    suitableFor: ['Enterprise', 'Large Campaign', 'Full Service'],
  },
];

const mockBrief: CampaignBrief = {
  title: 'Summer Fashion Collection Launch',
  objective: 'Promote the new summer fashion collection to young adults aged 18-30, driving brand awareness and sales through influencer partnerships.',
  targetAudience: {
    demographics: ['18-30 years old', 'Urban dwellers', 'Fashion-conscious'],
    interests: ['Fashion', 'Lifestyle', 'Social Media', 'Trends'],
    location: 'Kenya',
  },
  platforms: ['Instagram', 'TikTok', 'YouTube'],
  contentType: ['Photos', 'Videos', 'Stories', 'Reels'],
  budget: {
    min: 100000,
    max: 200000,
    currency: 'KES',
  },
  timeline: {
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    milestones: [
      'Influencer selection - Week 1',
      'Content creation - Weeks 2-4',
      'Campaign launch - Week 5',
      'Performance review - Week 12',
    ],
  },
  deliverables: [
    '15 Instagram posts',
    '20 TikTok videos',
    '10 YouTube shorts',
    '30 Instagram stories',
    'Monthly performance reports',
  ],
  kpis: [
    'Reach: 500,000 unique users',
    'Engagement rate: 5%+',
    'Website traffic: 20,000 visits',
    'Sales conversion: 2%+',
    'Brand mentions: 500+',
  ],
  additionalNotes: 'Focus on sustainable fashion messaging and local influencers.',
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<'conversation' | 'brief' | 'package' | 'review'>('conversation');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [brief, setBrief] = useState<CampaignBrief | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/dashboard/brand/campaigns');
  };

  const handleMessageSend = async (message: string): Promise<string> => {
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `I understand you're interested in "${message}". Let me help you create a campaign brief. Can you tell me more about your target audience and budget?`;
  };

  const handleGenerateBrief = () => {
    setIsGeneratingBrief(true);
    setTimeout(() => {
      setBrief(mockBrief);
      setIsGeneratingBrief(false);
      setStep('brief');
    }, 2000);
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleSaveBrief = () => {
    setStep('package');
  };

  const handleProceedToReview = () => {
    setStep('review');
  };

  const handleSubmitCampaign = () => {
    // In production, submit to API
    console.log('Submitting campaign:', { brief, selectedPackage });
    router.push('/dashboard/brand/campaigns');
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
            <h1 className="text-2xl font-bold">Create Campaign</h1>
            <p className="text-muted-foreground">
              {step === 'conversation' && 'Describe your campaign idea to get started'}
              {step === 'brief' && 'Review and customize your campaign brief'}
              {step === 'package' && 'Select the best package for your campaign'}
              {step === 'review' && 'Review your campaign before submitting'}
            </p>
          </div>
        </div>
        {step !== 'conversation' && (
          <Button
            variant="brand"
            onClick={step === 'brief' ? handleSaveBrief : step === 'package' ? handleProceedToReview : handleSubmitCampaign}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {step === 'brief' ? 'Continue to Packages' : step === 'package' ? 'Review Campaign' : 'Submit Campaign'}
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {['conversation', 'brief', 'package', 'review'].map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === s
                  ? 'bg-brand-blue text-white'
                  : ['conversation', 'brief', 'package', 'review'].indexOf(step) > idx
                  ? 'bg-success text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {idx + 1}
            </div>
            {idx < 3 && <div className="w-16 h-0.5 bg-border" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 'conversation' && (
            <ConversationBuilder
              initialMessages={messages}
              onMessageSend={handleMessageSend}
              onBriefGenerate={handleGenerateBrief}
            />
          )}

          {step === 'brief' && brief && (
            <BriefGenerator
              brief={brief}
              isGenerating={isGeneratingBrief}
              onSave={handleSaveBrief}
            />
          )}

          {step === 'package' && brief && (
            <PackageRecommender
              packages={mockPackages}
              budget={brief.budget}
              onSelectPackage={handleSelectPackage}
            />
          )}

          {step === 'review' && brief && selectedPackage && (
            <div className="space-y-6">
              <BriefGenerator brief={brief} isGenerating={false} />
              <PackageRecommender
                packages={mockPackages}
                budget={brief.budget}
                onSelectPackage={() => {}}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ConversationHistory
            conversations={mockConversations}
            onLoadConversation={(id) => console.log('Load conversation:', id)}
          />
        </div>
      </div>
    </div>
  );
}
