'use client';

import { useState } from 'react';
import { Download, FileText, Image, Table, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ExportOption {
  id: string;
  name: string;
  format: 'pdf' | 'csv' | 'excel' | 'json';
  icon: any;
  description: string;
}

interface ExportOptionsProps {
  options: ExportOption[];
  selectedOption?: string;
  onSelect?: (optionId: string) => void;
  onExport?: (optionId: string) => void;
}

const formatIcons = {
  pdf: FileText,
  csv: Table,
  excel: Table,
  json: FileText,
} as const;

const formatColors = {
  pdf: 'text-red-600 dark:text-red-400',
  csv: 'text-green-600 dark:text-green-400',
  excel: 'text-emerald-600 dark:text-emerald-400',
  json: 'text-yellow-600 dark:text-yellow-400',
} as const;

export function ExportOptions({ options, selectedOption, onSelect, onExport }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (optionId: string) => {
    setIsExporting(true);
    onExport?.(optionId);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Export Options</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option) => {
            const Icon = formatIcons[option.format];
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                onClick={() => onSelect?.(option.id)}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all hover:border-brand-blue/50",
                  isSelected ? "border-brand-blue bg-brand-blue/5" : "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-brand-blue text-white" : "bg-muted"
                    )}
                  >
                    <Icon className={cn("h-6 w-6", isSelected && "text-white")} />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{option.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", formatColors[option.format])}
                      >
                        {option.format.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>

                  {/* Selection */}
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-brand-blue" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        {selectedOption && (
          <Button
            variant="brand"
            className="w-full mt-4"
            onClick={() => handleExport(selectedOption)}
            disabled={isExporting}
            leftIcon={isExporting ? <CheckCircle className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          >
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
