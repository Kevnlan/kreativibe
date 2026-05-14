'use client';

import { useState } from 'react';
import { FileText, Sparkles, Download, Eye, Check, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  required: boolean;
  editable: boolean;
}

export interface ContractData {
  campaignId: string;
  brandName: string;
  creativeName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  clauses: ContractClause[];
  additionalTerms?: string;
}

interface ContractGeneratorProps {
  proposalData: any;
  onGenerate: (contract: ContractData) => void;
  onPreview?: (contract: ContractData) => void;
  onDownload?: (contract: ContractData) => void;
}

const defaultClauses: Omit<ContractClause, 'content'>[] = [
  { id: '1', title: 'Scope of Work', required: true, editable: true },
  { id: '2', title: 'Deliverables', required: true, editable: true },
  { id: '3', title: 'Payment Terms', required: true, editable: true },
  { id: '4', title: 'Timeline', required: true, editable: true },
  { id: '5', title: 'Intellectual Property Rights', required: true, editable: true },
  { id: '6', title: 'Confidentiality', required: true, editable: true },
  { id: '7', title: 'Termination Clause', required: false, editable: true },
  { id: '8', title: 'Governing Law', required: false, editable: true },
];

export function ContractGenerator({ proposalData, onGenerate, onPreview, onDownload }: ContractGeneratorProps) {
  const [clauses, setClauses] = useState<ContractClause[]>(
    defaultClauses.map(c => ({ ...c, content: '' }))
  );
  const [additionalTerms, setAdditionalTerms] = useState('');
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleExpand = (clauseId: string) => {
    setExpandedClauses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clauseId)) {
        newSet.delete(clauseId);
      } else {
        newSet.add(clauseId);
      }
      return newSet;
    });
  };

  const updateClause = (clauseId: string, content: string) => {
    setClauses(prev => prev.map(c => (c.id === clauseId ? { ...c, content } : c)));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const contract: ContractData = {
        campaignId: proposalData.campaignId,
        brandName: 'Brand Name',
        creativeName: 'Creative Name',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: proposalData.proposedRate || 0,
        currency: 'KES',
        clauses,
        additionalTerms,
      };
      setIsGenerating(false);
      onGenerate(contract);
    }, 2000);
  };

  const handleAutoFill = () => {
    // Simulate AI-generated clauses
    const autoFilledClauses = clauses.map(c => ({
      ...c,
      content: `This ${c.title.toLowerCase()} clause outlines the terms and conditions agreed upon by both parties...`,
    }));
    setClauses(autoFilledClauses);
  };

  const isValid = clauses.filter(c => c.required).every(c => c.content.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-blue" />
              <CardTitle className="text-lg">Contract Generator</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleAutoFill}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                AI Auto-Fill
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contract Clauses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contract Clauses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clauses.map((clause) => {
            const isExpanded = expandedClauses.has(clause.id);
            const isFilled = clause.content.trim().length > 0;

            return (
              <div
                key={clause.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  isFilled && "border-success/50 bg-success/5",
                  clause.required && !isFilled && "border-warning/50 bg-warning/5"
                )}
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(clause.id)}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      isFilled ? "bg-success" : clause.required ? "bg-warning" : "bg-muted"
                    )}
                  >
                    {isFilled ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : clause.required ? (
                      <AlertCircle className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{clause.title}</h4>
                      {clause.required && (
                        <Badge variant="warning" className="text-xs">Required</Badge>
                      )}
                      {isFilled && (
                        <Badge variant="success" className="text-xs">Filled</Badge>
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    <textarea
                      value={clause.content}
                      onChange={(e) => updateClause(clause.id, e.target.value)}
                      placeholder={`Enter ${clause.title.toLowerCase()}...`}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={6}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={additionalTerms}
            onChange={(e) => setAdditionalTerms(e.target.value)}
            placeholder="Any additional terms or conditions..."
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="brand"
          onClick={handleGenerate}
          disabled={!isValid || isGenerating}
          className="flex-1"
          leftIcon={isGenerating ? <Sparkles className="h-4 w-4 animate-pulse" /> : <FileText className="h-4 w-4" />}
        >
          {isGenerating ? 'Generating Contract...' : 'Generate Contract'}
        </Button>
        {onPreview && (
          <Button variant="outline" onClick={() => onPreview({} as ContractData)} leftIcon={<Eye className="h-4 w-4" />}>
            Preview
          </Button>
        )}
        {onDownload && (
          <Button variant="outline" onClick={() => onDownload({} as ContractData)} leftIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
        <AlertCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
        <p className="text-sm text-brand-blue">
          The generated contract will be based on the proposal details and standard templates. Review all clauses before finalizing.
        </p>
      </div>
    </div>
  );
}
