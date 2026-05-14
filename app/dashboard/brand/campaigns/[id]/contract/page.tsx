'use client';

import { useState } from 'react';
import { ContractGenerator, ContractData } from '@/components/campaign/ContractGenerator';
import { ContractViewer } from '@/components/campaign/ContractViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockProposalData = {
  campaignId: '1',
  proposedRate: 150000,
};

const mockContract: ContractData = {
  campaignId: '1',
  brandName: 'Fashion Brand Kenya',
  creativeName: 'Sarah Mwangi',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  totalAmount: 150000,
  currency: 'KES',
  clauses: [
    {
      id: '1',
      title: 'Scope of Work',
      content: 'The Creative agrees to create and deliver social media content as outlined in the campaign brief. This includes but is not limited to Instagram posts, TikTok videos, and YouTube shorts.',
      required: true,
      editable: true,
    },
    {
      id: '2',
      title: 'Deliverables',
      content: '15 Instagram posts, 20 TikTok videos, 10 YouTube shorts, 30 Instagram stories, and monthly performance reports.',
      required: true,
      editable: true,
    },
    {
      id: '3',
      title: 'Payment Terms',
      content: 'Total payment of KES 150,000 will be made in three installments: 30% upon signing, 40% upon milestone 2 completion, and 30% upon final delivery.',
      required: true,
      editable: true,
    },
    {
      id: '4',
      title: 'Timeline',
      content: 'Campaign duration: June 1, 2024 to August 31, 2024. Content creation: Weeks 2-8. Campaign launch: Week 5. Performance review: Week 12.',
      required: true,
      editable: true,
    },
    {
      id: '5',
      title: 'Intellectual Property Rights',
      content: 'All content created under this contract becomes the property of the Brand upon full payment. The Creative retains the right to use the content in their portfolio with proper attribution.',
      required: true,
      editable: true,
    },
    {
      id: '6',
      title: 'Confidentiality',
      content: 'Both parties agree to keep confidential any proprietary information shared during the course of this contract.',
      required: true,
      editable: true,
    },
  ],
  additionalTerms: 'This contract is governed by the laws of Kenya. Any disputes shall be resolved through arbitration in Nairobi.',
};

export default function ContractPage() {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState<'generate' | 'review' | 'signed'>('generate');
  const [contract, setContract] = useState<ContractData | null>(null);

  const handleBack = () => {
    router.push(`/dashboard/brand/campaigns/${params.id}`);
  };

  const handleGenerateContract = (generatedContract: ContractData) => {
    setContract(mockContract);
    setStep('review');
  };

  const handleSignContract = () => {
    setStep('signed');
    // In production, call API to sign contract
    console.log('Signing contract:', contract);
  };

  const handleDownload = () => {
    console.log('Downloading contract PDF');
  };

  const handleShare = () => {
    console.log('Sharing contract');
  };

  const handlePrint = () => {
    window.print();
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
            <h1 className="text-2xl font-bold">Contract Management</h1>
            <p className="text-muted-foreground">Campaign ID: {params.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {step === 'generate' && (
        <ContractGenerator
          proposalData={mockProposalData}
          onGenerate={handleGenerateContract}
        />
      )}

      {step === 'review' && contract && (
        <ContractViewer
          contract={contract}
          onSign={handleSignContract}
          onDownload={handleDownload}
          onShare={handleShare}
          onPrint={handlePrint}
        />
      )}

      {step === 'signed' && contract && (
        <div className="space-y-6">
          <div className="p-6 bg-success/10 border border-success/20 rounded-lg">
            <h2 className="text-lg font-semibold text-success mb-2">Contract Signed Successfully!</h2>
            <p className="text-sm text-muted-foreground">
              The contract has been signed by both parties and is now in effect. You can download a copy for your records.
            </p>
          </div>

          <ContractViewer
            contract={contract}
            onDownload={handleDownload}
            onShare={handleShare}
            onPrint={handlePrint}
            showActions={true}
            signed={true}
          />
        </div>
      )}
    </div>
  );
}
