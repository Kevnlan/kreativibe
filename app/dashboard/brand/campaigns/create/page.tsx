'use client';

import { useState } from 'react';
import { ConversationBuilder, Message } from '@/components/campaign/ConversationBuilder';
import { ConversationHistory } from '@/components/campaign/ConversationHistory';
import { BriefGenerator, CampaignBrief } from '@/components/campaign/BriefGenerator';
import { PackageRecommender, PackageOption } from '@/components/campaign/PackageRecommender';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { campaignService } from '@/services/campaign.service';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<'conversation' | 'brief' | 'package' | 'review'>('conversation');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [brief, setBrief] = useState<CampaignBrief | null>(null);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/dashboard/brand/campaigns');
  };

  const handleMessageSend = async (message: string): Promise<{ content: string; suggestions?: string[] }> => {
    const history = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user' as const, content: message }];
    const response = await campaignService.aiChat(history);
    return { content: response.reply, suggestions: response.suggestions };
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    setError(null);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const generatedBrief = await campaignService.aiBrief(history);
      setBrief(generatedBrief);
      setStep('brief');
    } catch {
      setError('Failed to generate the campaign brief. Please try again.');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleSaveBrief = async () => {
    if (!brief) return;
    setStep('package');
    setIsLoadingPackages(true);
    setError(null);
    try {
      const recommended = await campaignService.recommendPackages(brief);
      setPackages(recommended);
    } catch {
      setError('Failed to load package recommendations.');
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const handleProceedToReview = () => {
    setStep('review');
  };

  const handleSubmitCampaign = async () => {
    if (!brief) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await campaignService.create({
        name: brief.title,
        objective: brief.objective,
        audience: [...brief.targetAudience.demographics, ...brief.targetAudience.interests].join(', '),
        budget: brief.budget.max,
        platforms: brief.platforms,
        contentTypes: brief.contentType,
        startDate: brief.timeline.startDate,
        endDate: brief.timeline.endDate,
        source: 'ai',
      });
      router.push('/dashboard/brand/campaigns');
    } catch {
      setError('Failed to create the campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {step === 'brief' ? 'Continue to Packages' : step === 'package' ? 'Review Campaign' : isSubmitting ? 'Submitting...' : 'Submit Campaign'}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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

          {step === 'package' && brief && isLoadingPackages && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              Loading package recommendations...
            </div>
          )}

          {step === 'package' && brief && !isLoadingPackages && (
            <PackageRecommender
              packages={packages}
              budget={brief.budget}
              onSelectPackage={handleSelectPackage}
            />
          )}

          {step === 'review' && brief && selectedPackage && (
            <div className="space-y-6">
              <BriefGenerator brief={brief} isGenerating={false} />
              <PackageRecommender
                packages={packages}
                budget={brief.budget}
                onSelectPackage={() => {}}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ConversationHistory
            conversations={[]}
            onLoadConversation={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
