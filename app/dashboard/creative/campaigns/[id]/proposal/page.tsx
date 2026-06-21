'use client';

import { useState, useEffect } from 'react';
import { ProposalSubmission, ProposalData } from '@/components/campaign/ProposalSubmission';
import { ProposalPreview } from '@/components/campaign/ProposalPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { campaignService } from '@/services/campaign.service';
import { Proposal } from '@/types/campaign.types';

function proposalToSaveData(proposal: ProposalData) {
  const deliverables = (proposal.sections.find(s => s.id === '5')?.content || '')
    .split('\n')
    .map(d => d.trim())
    .filter(Boolean);
  const coverLetter = proposal.sections
    .filter(s => s.id !== '4' && s.id !== '5')
    .map(s => s.content)
    .filter(Boolean)
    .join('\n\n') || proposal.additionalNotes || '';

  return {
    proposedRate: proposal.proposedRate,
    currency: proposal.currency,
    deliverables: deliverables.length ? deliverables : ['Deliverables to be confirmed'],
    timeline: proposal.estimatedDelivery || proposal.sections.find(s => s.id === '4')?.content || 'To be confirmed',
    coverLetter: coverLetter || 'No additional notes provided.',
  };
}

function proposalFromExisting(existing: Proposal): Partial<ProposalData> {
  return {
    proposedRate: existing.proposedRate ?? 0,
    currency: existing.currency ?? 'KES',
    estimatedDelivery: existing.timeline ?? '',
    additionalNotes: existing.coverLetter ?? '',
    sections: [
      { id: '5', title: 'Deliverables', content: existing.deliverables.join('\n'), order: 5 },
    ],
  };
}

export default function ProposalPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [showPreview, setShowPreview] = useState(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [initialProposal, setInitialProposal] = useState<Partial<ProposalData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('Campaign');

  useEffect(() => {
    campaignService
      .getMarketplaceCampaign(campaignId)
      .then(c => setCampaignTitle(c.title))
      .catch(() => {
        // Campaign may no longer be ACTIVE — keep the generic fallback title.
      });

    campaignService
      .getProposal(campaignId)
      .then(existing => setInitialProposal(proposalFromExisting(existing)))
      .catch(() => {
        // No proposal saved yet — start from a blank form.
      })
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  const handleBack = () => {
    router.push('/dashboard/creative/campaigns');
  };

  const handleSaveProposal = async (savedProposal: ProposalData) => {
    setProposal(savedProposal);
    setError(null);
    try {
      await campaignService.saveProposal(campaignId, proposalToSaveData(savedProposal));
    } catch {
      setError('Failed to save proposal. Please try again.');
    }
  };

  const handleSubmitProposal = async (submittedProposal: ProposalData) => {
    setProposal(submittedProposal);
    setError(null);
    try {
      await campaignService.saveProposal(campaignId, proposalToSaveData(submittedProposal));
      await campaignService.submitProposal(campaignId);
      router.push('/dashboard/creative/campaigns');
    } catch {
      setError('Failed to submit proposal. Please try again.');
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading proposal...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Submit Proposal</h1>
            <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
          </div>
        </div>
        {!showPreview && (
          <Button variant="outline" onClick={handlePreview} leftIcon={<Eye className="h-4 w-4" />}>
            Preview
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showPreview && proposal ? (
        <ProposalPreview
          proposal={proposal}
          campaignTitle={campaignTitle}
          creativeName="Creative Name"
          onEdit={handlePreview}
          onDownload={() => console.log('Download PDF')}
          onShare={() => console.log('Share proposal')}
        />
      ) : (
        <ProposalSubmission
          campaignId={campaignId}
          campaignTitle={campaignTitle}
          initialProposal={initialProposal}
          onSave={handleSaveProposal}
          onSubmit={handleSubmitProposal}
          onPreview={handlePreview}
        />
      )}
    </div>
  );
}
