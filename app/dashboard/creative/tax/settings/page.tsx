'use client';

import { useState } from 'react';
import { TaxInfoForm, TaxInfoData } from '@/components/tax/TaxInfoForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { taxService } from '@/services/tax.service';
import { TaxDocumentType } from '@/types/api-contracts/tax.types';

const DOCUMENT_TYPE_MAP: Record<string, TaxDocumentType> = {
  taxCertificate: 'KRA_CERTIFICATE',
};

export default function TaxSettingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard/creative/tax');
  };

  const handleSaveTaxInfo = async (data: TaxInfoData) => {
    await taxService.saveTaxInfo({
      kraPin: data.taxNumber || data.taxId,
      taxResidency: data.taxResidency,
      withholdingTaxOptIn: true,
    });
  };

  const handleUploadDocument = async (type: string, file: File) => {
    await taxService.uploadDocument(file, DOCUMENT_TYPE_MAP[type] ?? 'OTHER');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Tax Settings</h1>
              <p className="text-muted-foreground">Configure your tax information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <TaxInfoForm onSave={handleSaveTaxInfo} onUploadDocument={handleUploadDocument} />
    </div>
  );
}
