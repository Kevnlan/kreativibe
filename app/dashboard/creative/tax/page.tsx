'use client';

import { useState } from 'react';
import { TaxReportGenerator } from '@/components/tax/TaxReportGenerator';
import { TaxDocumentUpload } from '@/components/tax/TaxDocumentUpload';
import { TaxComplianceStatus, TaxComplianceItem } from '@/components/tax/TaxComplianceStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for development
const mockComplianceItems: TaxComplianceItem[] = [
  {
    id: '1',
    name: 'Tax Registration',
    description: 'KRA PIN registration and verification',
    status: 'compliant',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Annual Filing',
    description: '2023 annual tax return filing',
    status: 'compliant',
    lastUpdated: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Quarterly Filings',
    description: 'Q4 2023 quarterly tax filing',
    status: 'pending',
    dueDate: '2024-02-28T23:59:59Z',
    actionRequired: 'Submit Q4 2023 tax return by February 28, 2024',
  },
  {
    id: '4',
    name: 'Withholding Tax',
    description: 'Withholding tax compliance for payments',
    status: 'compliant',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
];

export default function TaxPage() {
  const router = useRouter();
  const [view, setView] = useState<'overview' | 'generate' | 'documents'>('overview');

  const handleBack = () => {
    router.push('/dashboard/creative/wallet');
  };

  const handleGenerateReport = (reportData: any) => {
    console.log('Generating tax report:', reportData);
  };

  const handleUploadDocument = async (file: File) => {
    console.log('Uploading document:', file.name);
  };

  const handleRemoveDocument = (docId: string) => {
    console.log('Removing document:', docId);
  };

  const handleComplianceAction = (itemId: string) => {
    console.log('Taking action on compliance item:', itemId);
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
            <FileText className="h-6 w-6 text-brand-blue" />
            <div>
              <h1 className="text-2xl font-bold">Tax Management</h1>
              <p className="text-muted-foreground">Manage your tax information and reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'overview' ? 'brand' : 'outline'}
          onClick={() => setView('overview')}
        >
          Overview
        </Button>
        <Button
          variant={view === 'generate' ? 'brand' : 'outline'}
          onClick={() => setView('generate')}
        >
          Generate Report
        </Button>
        <Button
          variant={view === 'documents' ? 'brand' : 'outline'}
          onClick={() => setView('documents')}
        >
          Documents
        </Button>
      </div>

      {/* Content */}
      {view === 'overview' && (
        <TaxComplianceStatus
          items={mockComplianceItems}
          overallStatus="partial"
          onAction={handleComplianceAction}
        />
      )}

      {view === 'generate' && (
        <TaxReportGenerator onGenerate={handleGenerateReport} />
      )}

      {view === 'documents' && (
        <TaxDocumentUpload
          onUpload={handleUploadDocument}
          onRemove={handleRemoveDocument}
        />
      )}
    </div>
  );
}
