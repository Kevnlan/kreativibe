'use client';

import { useState, useEffect } from 'react';
import { ContractGenerator, ContractData } from '@/components/campaign/ContractGenerator';
import { ContractViewer } from '@/components/campaign/ContractViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/AuthContext';
import { contractService } from '@/services/contract.service';
import { campaignService } from '@/services/campaign.service';
import { Contract } from '@/types/contract.types';

function toContractData(contract: Contract): ContractData {
  return {
    campaignId: contract.campaignId,
    brandName: contract.brandName,
    creativeName: contract.creativeName,
    startDate: contract.startDate || '',
    endDate: contract.endDate || '',
    totalAmount: contract.totalAmount,
    currency: contract.currency,
    clauses: contract.clauses,
    additionalTerms: contract.additionalTerms,
  };
}

export default function ContractPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const campaignId = params.id as string;

  const [step, setStep] = useState<'generate' | 'review' | 'signed'>('generate');
  const [contract, setContract] = useState<Contract | null>(null);
  const [acceptedApplication, setAcceptedApplication] = useState<{ applicationId: string; proposedRate: number; currency: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contractService
      .getContract(campaignId)
      .then(existing => {
        setContract(existing);
        setStep(existing.status === 'ACTIVE' ? 'signed' : 'review');
      })
      .catch(() => {
        // No contract generated yet — fetch the accepted application to seed generation.
        campaignService
          .listApplications(campaignId)
          .then(applications => {
            const accepted = applications.find(a => a.status === 'ACCEPTED');
            if (accepted) {
              setAcceptedApplication({
                applicationId: accepted.id,
                proposedRate: accepted.proposedRate ?? 0,
                currency: accepted.currency ?? 'KES',
              });
            }
          })
          .catch(() => setError('Failed to load campaign applications.'));
      })
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  const handleBack = () => {
    router.push(`/dashboard/brand/campaigns/${campaignId}`);
  };

  const handleGenerateContract = async (generatedContract: ContractData) => {
    if (!acceptedApplication) {
      setError('No accepted application found for this campaign — accept a creator application first.');
      return;
    }
    setError(null);
    try {
      const created = await contractService.generateContract(campaignId, {
        applicationId: acceptedApplication.applicationId,
        proposedRate: acceptedApplication.proposedRate,
        currency: acceptedApplication.currency,
      });
      if (generatedContract.additionalTerms) {
        const updated = await contractService.updateContractClauses(campaignId, { additionalTerms: generatedContract.additionalTerms });
        setContract(updated);
      } else {
        setContract(created);
      }
      setStep('review');
    } catch {
      setError('Failed to generate contract. Please try again.');
    }
  };

  const handleSignContract = async () => {
    setError(null);
    try {
      const signed = await contractService.signContract(campaignId, { signature: user?.name || 'Brand' });
      setContract(signed);
      setStep(signed.status === 'ACTIVE' ? 'signed' : 'review');
    } catch {
      setError('Failed to sign contract. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      const { url } = await contractService.downloadContract(campaignId);
      window.open(url, '_blank');
    } catch {
      setError('Failed to generate the contract download.');
    }
  };

  const handleShare = () => {
    console.log('Sharing contract');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading contract...
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
            <h1 className="text-2xl font-bold">Contract Management</h1>
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
      {step === 'generate' && (
        <ContractGenerator
          proposalData={{ campaignId, proposedRate: acceptedApplication?.proposedRate ?? 0 }}
          onGenerate={handleGenerateContract}
        />
      )}

      {step === 'review' && contract && (
        <ContractViewer
          contract={toContractData(contract)}
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
            contract={toContractData(contract)}
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
