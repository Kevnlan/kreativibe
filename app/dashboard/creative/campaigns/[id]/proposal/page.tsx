'use client';

import { useState } from 'react';
import { ProposalSubmission, ProposalData } from '@/components/campaign/ProposalSubmission';
import { ProposalPreview } from '@/components/campaign/ProposalPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function ProposalPage() {
  const router = useRouter();
  const params = useParams();
  const [showPreview, setShowPreview] = useState(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);

  const handleBack = () => {
    router.push('/dashboard/creative/campaigns');
  };

  const handleSaveProposal = (savedProposal: ProposalData) => {
    setProposal(savedProposal);
    console.log('Saving proposal:', savedProposal);
  };

  const handleSubmitProposal = (submittedProposal: ProposalData) => {
    setProposal(submittedProposal);
    console.log('Submitting proposal:', submittedProposal);
    // In production, submit to API and redirect
    router.push('/dashboard/creative/campaigns');
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
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
            <h1 className="text-2xl font-bold">Submit Proposal</h1>
            <p className="text-muted-foreground">Campaign ID: {params.id}</p>
          </div>
        </div>
        {!showPreview && (
          <Button variant="outline" onClick={handlePreview} leftIcon={<Eye className="h-4 w-4" />}>
            Preview
          </Button>
        )}
      </div>

      {showPreview && proposal ? (
        <ProposalPreview
          proposal={proposal}
          campaignTitle="Summer Fashion Campaign"
          creativeName="Creative Name"
          onEdit={handlePreview}
          onDownload={() => console.log('Download PDF')}
          onShare={() => console.log('Share proposal')}
        />
      ) : (
        <ProposalSubmission
          campaignId={params.id as string}
          campaignTitle="Summer Fashion Campaign"
          initialProposal={proposal || undefined}
          onSave={handleSaveProposal}
          onSubmit={handleSubmitProposal}
          onPreview={handlePreview}
        />
      )}
    </div>
  );
}
