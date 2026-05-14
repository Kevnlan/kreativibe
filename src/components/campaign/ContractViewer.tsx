'use client';

import { useState } from 'react';
import { FileText, Download, Share2, Printer, Check, AlertCircle, Calendar, DollarSign, User, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ContractData } from './ContractGenerator';

interface ContractViewerProps {
  contract: ContractData;
  onSign?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  showActions?: boolean;
  signed?: boolean;
}

export function ContractViewer({
  contract,
  onSign,
  onDownload,
  onShare,
  onPrint,
  showActions = true,
  signed = false,
}: ContractViewerProps) {
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set());

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-blue" />
              <CardTitle className="text-xl">Campaign Contract</CardTitle>
              {signed && (
                <Badge variant="success" className="ml-2">Signed</Badge>
              )}
            </div>
            {showActions && (
              <div className="flex gap-2">
                {onPrint && (
                  <Button variant="outline" size="sm" onClick={onPrint} leftIcon={<Printer className="h-4 w-4" />}>
                    Print
                  </Button>
                )}
                {onDownload && (
                  <Button variant="outline" size="sm" onClick={onDownload} leftIcon={<Download className="h-4 w-4" />}>
                    Download
                  </Button>
                )}
                {onShare && (
                  <Button variant="outline" size="sm" onClick={onShare} leftIcon={<Share2 className="h-4 w-4" />}>
                    Share
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Building2 className="h-5 w-5 text-brand-blue" />
              <div>
                <p className="text-xs text-muted-foreground">Brand</p>
                <p className="font-medium">{contract.brandName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <User className="h-5 w-5 text-brand-blue" />
              <div>
                <p className="text-xs text-muted-foreground">Creative</p>
                <p className="font-medium">{contract.creativeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-brand-blue" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-sm">
                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="font-medium">
                  {contract.currency} {contract.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Clauses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contract Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contract.clauses.map((clause) => {
            const isExpanded = expandedClauses.has(clause.id);

            return (
              <div
                key={clause.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(clause.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{clause.title}</h4>
                      {clause.required && (
                        <Badge variant="warning" className="text-xs">Required</Badge>
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Check className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{clause.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Terms */}
      {contract.additionalTerms && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contract.additionalTerms}</p>
          </CardContent>
        </Card>
      )}

      {/* Sign Section */}
      {showActions && !signed && onSign && (
        <Card className="border-brand-blue/50 bg-brand-blue/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-brand-blue mb-1">Review Before Signing</h4>
                <p className="text-sm text-muted-foreground">
                  By signing this contract, you agree to all terms and conditions outlined above. This is a legally binding agreement.
                </p>
              </div>
            </div>
            <Button variant="brand" onClick={onSign} className="w-full" leftIcon={<Check className="h-4 w-4" />}>
              Sign Contract
            </Button>
          </CardContent>
        </Card>
      )}

      {signed && (
        <Card className="border-success/50 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-success" />
              <div>
                <h4 className="font-medium text-success">Contract Signed</h4>
                <p className="text-sm text-muted-foreground">
                  This contract has been signed by both parties and is now in effect.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
