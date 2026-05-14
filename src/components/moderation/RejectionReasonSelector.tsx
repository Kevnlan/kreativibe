'use client';

import { useState } from 'react';
import { AlertCircle, X, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface RejectionReasonSelectorProps {
  selectedReasons: string[];
  onReasonsChange: (reasons: string[]) => void;
  customReason?: string;
  onCustomReasonChange?: (reason: string) => void;
}

const predefinedReasons = [
  { id: 'inappropriate', label: 'Inappropriate Content', category: 'content' },
  { id: 'copyright', label: 'Copyright Violation', category: 'legal' },
  { id: 'guidelines', label: 'Violates Community Guidelines', category: 'policy' },
  { id: 'misleading', label: 'Misleading Information', category: 'content' },
  { id: 'spam', label: 'Spam or Low Quality', category: 'quality' },
  { id: 'harmful', label: 'Harmful or Dangerous Content', category: 'safety' },
  { id: 'harassment', label: 'Harassment or Hate Speech', category: 'safety' },
  { id: 'privacy', label: 'Privacy Violation', category: 'legal' },
  { id: 'impersonation', label: 'Impersonation', category: 'policy' },
  { id: 'adult', label: 'Adult Content', category: 'content' },
  { id: 'violence', label: 'Violence or Gore', category: 'safety' },
  { id: 'other', label: 'Other', category: 'general' },
];

const categoryColors = {
  content: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  legal: 'bg-red-500/10 text-red-700 dark:text-red-400',
  policy: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  quality: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  safety: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  general: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
} as const;

export function RejectionReasonSelector({
  selectedReasons,
  onReasonsChange,
  customReason = '',
  onCustomReasonChange,
}: RejectionReasonSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleReason = (reasonId: string) => {
    if (reasonId === 'other') {
      setShowCustomInput(!showCustomInput);
      if (!showCustomInput && !selectedReasons.includes('other')) {
        onReasonsChange([...selectedReasons, 'other']);
      } else if (showCustomInput) {
        onReasonsChange(selectedReasons.filter(r => r !== 'other'));
      }
      return;
    }

    onReasonsChange(
      selectedReasons.includes(reasonId)
        ? selectedReasons.filter(r => r !== reasonId)
        : [...selectedReasons, reasonId]
    );
  };

  const removeReason = (reasonId: string) => {
    onReasonsChange(selectedReasons.filter(r => r !== reasonId));
    if (reasonId === 'other') {
      setShowCustomInput(false);
      onCustomReasonChange?.('');
    }
  };

  const getReasonLabel = (reasonId: string) => {
    return predefinedReasons.find(r => r.id === reasonId)?.label || reasonId;
  };

  const getReasonCategory = (reasonId: string): keyof typeof categoryColors => {
    return (predefinedReasons.find(r => r.id === reasonId)?.category || 'general') as keyof typeof categoryColors;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rejection Reason</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Reasons Display */}
        {selectedReasons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedReasons.map(reasonId => (
              <Badge
                key={reasonId}
                variant="outline"
                className={cn(
                  "gap-1 pr-2",
                  categoryColors[getReasonCategory(reasonId) as keyof typeof categoryColors]
                )}
              >
                {getReasonLabel(reasonId)}
                <button
                  onClick={() => removeReason(reasonId)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Reason Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Select a reason:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedReasons.map(reason => (
              <button
                key={reason.id}
                onClick={() => toggleReason(reason.id)}
                className={cn(
                  "p-3 text-left rounded-lg border transition-all text-sm",
                  selectedReasons.includes(reason.id)
                    ? "border-brand-blue bg-brand-blue/5"
                    : "border-border hover:border-brand-blue/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{reason.label}</span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", categoryColors[reason.category as keyof typeof categoryColors])}
                  >
                    {reason.category}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Reason Input */}
        {showCustomInput && onCustomReasonChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Details</label>
            <textarea
              value={customReason}
              onChange={(e) => onCustomReasonChange(e.target.value)}
              placeholder="Please provide additional details about the rejection reason..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Warning */}
        {selectedReasons.length === 0 && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning">
              Please select at least one rejection reason before proceeding.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
