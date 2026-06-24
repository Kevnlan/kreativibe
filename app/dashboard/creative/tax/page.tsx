'use client';

import { useState, useEffect } from 'react';
import { TaxReportGenerator, TaxReportData } from '@/components/tax/TaxReportGenerator';
import { TaxDocumentUpload } from '@/components/tax/TaxDocumentUpload';
import { TaxComplianceStatus, TaxComplianceItem as TaxComplianceItemUi } from '@/components/tax/TaxComplianceStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { taxService } from '@/services/tax.service';
import { TaxComplianceItem as TaxComplianceItemApi } from '@/types/api-contracts/tax.types';

function toUiComplianceItem(item: TaxComplianceItemApi): TaxComplianceItemUi {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    status: item.status === 'COMPLIANT' ? 'compliant' : 'pending',
    dueDate: item.dueDate,
    lastUpdated: item.lastUpdated,
    actionRequired: item.actionRequired ? 'Action required to maintain compliance.' : undefined,
  };
}

export default function TaxPage() {
  const router = useRouter();
  const [view, setView] = useState<'overview' | 'generate' | 'documents'>('overview');
  const [items, setItems] = useState<TaxComplianceItemUi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    taxService
      .getComplianceStatus()
      .then((res) => setItems(res.items.map(toUiComplianceItem)))
      .catch(() => setError('Failed to load tax compliance status. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const overallStatus: 'compliant' | 'non-compliant' | 'partial' = items.length === 0
    ? 'compliant'
    : items.every(i => i.status === 'compliant')
      ? 'compliant'
      : items.some(i => i.status === 'compliant')
        ? 'partial'
        : 'non-compliant';

  const handleBack = () => {
    router.push('/dashboard/creative/wallet');
  };

  const handleGenerateReport = async (reportData: Omit<TaxReportData, 'reportId' | 'generatedAt'>) => {
    try {
      const result = await taxService.generateReport({ year: reportData.year, format: 'PDF' });
      window.open(result.reportUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate tax report:', err);
      setError('Failed to generate tax report. Please try again.');
    }
  };

  const handleUploadDocument = async (file: File) => {
    await taxService.uploadDocument(file, 'OTHER');
  };

  const handleRemoveDocument = async (docId: string) => {
    try {
      await taxService.deleteDocument(docId);
    } catch (err) {
      console.error('Failed to remove document:', err);
    }
  };

  const handleComplianceAction = (itemId: string) => {
    setView('documents');
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
        isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading compliance status...
          </div>
        ) : (
          <TaxComplianceStatus
            items={items}
            overallStatus={overallStatus}
            onAction={handleComplianceAction}
          />
        )
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
