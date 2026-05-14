'use client';

import { useState } from 'react';
import { FileText, Download, Trash2, Search, Filter, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ReportRecord {
  id: string;
  name: string;
  type: string;
  format: 'pdf' | 'csv' | 'excel';
  generatedAt: string;
  generatedBy: string;
  size: number;
  status: 'ready' | 'generating' | 'failed';
  downloadUrl?: string;
}

interface ReportHistoryProps {
  reports: ReportRecord[];
  onDownload?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onRegenerate?: (reportId: string) => void;
}

const formatIcons = {
  pdf: FileText,
  csv: FileText,
  excel: FileText,
} as const;

const formatColors = {
  pdf: 'text-red-600 dark:text-red-400',
  csv: 'text-green-600 dark:text-green-400',
  excel: 'text-emerald-600 dark:text-emerald-400',
} as const;

const statusColors = {
  ready: 'success',
  generating: 'brand',
  failed: 'destructive',
} as const;

export function ReportHistory({ reports, onDownload, onDelete, onRegenerate }: ReportHistoryProps) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesFormat = filterFormat === 'all' || report.format === filterFormat;
    return matchesType && matchesFormat;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Report History</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{reports.length} reports</Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="campaign">Campaign</option>
              <option value="creative">Creative</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const Icon = formatIcons[report.format];
            const isExpanded = expandedReport === report.id;

            return (
              <div
                key={report.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(report.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        report.status === 'ready' ? "bg-success" : report.status === 'generating' ? "bg-brand-blue" : "bg-destructive"
                      )}>
                        <Icon className={cn("h-5 w-5", report.status === 'ready' ? "text-white" : report.status === 'generating' ? "text-white animate-spin" : "text-white")} />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge
                            variant="outline"
                            className={cn("text-xs uppercase", formatColors[report.format])}
                          >
                            {report.format}
                          </Badge>
                          <Badge variant={statusColors[report.status] as any} className="text-xs">
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{formatSize(report.size)}</span>
                          <span>•</span>
                          <span>{new Date(report.generatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {report.status === 'ready' && onDownload && (
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(report.id);
                          }}
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Download
                        </Button>
                      )}
                      {report.status === 'failed' && onRegenerate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegenerate(report.id);
                          }}
                        >
                          Regenerate
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(report.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Generated by:</span>
                      <span>{report.generatedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Generated at:</span>
                      <span>{new Date(report.generatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reports found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
