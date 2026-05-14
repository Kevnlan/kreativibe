'use client';

import { useState } from 'react';
import { FileText, Sparkles, Edit, Check, AlertCircle, Download, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CampaignBrief {
  title: string;
  objective: string;
  targetAudience: {
    demographics: string[];
    interests: string[];
    location?: string;
  };
  platforms: string[];
  contentType: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    milestones: string[];
  };
  deliverables: string[];
  kpis: string[];
  additionalNotes?: string;
}

interface BriefGeneratorProps {
  brief: CampaignBrief | null;
  isGenerating: boolean;
  onEdit?: (field: keyof CampaignBrief, value: any) => void;
  onSave?: () => void;
  onExport?: () => void;
  onCopy?: () => void;
}

export function BriefGenerator({
  brief,
  isGenerating,
  onEdit,
  onSave,
  onExport,
  onCopy,
}: BriefGeneratorProps) {
  const [editingField, setEditingField] = useState<keyof CampaignBrief | null>(null);

  if (!brief && !isGenerating) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Complete the conversation to generate a campaign brief
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Sparkles className="h-12 w-12 text-brand-blue mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Generating your campaign brief...</p>
        </CardContent>
      </Card>
    );
  }

  if (!brief) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Campaign Brief</CardTitle>
          </div>
          <div className="flex gap-2">
            {onCopy && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCopy}
                leftIcon={<Copy className="h-4 w-4" />}
              >
                Copy
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            )}
            {onSave && (
              <Button
                variant="brand"
                size="sm"
                onClick={onSave}
                leftIcon={<Check className="h-4 w-4" />}
              >
                Save Brief
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Title</label>
          {editingField === 'title' && onEdit ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={brief.title}
                onChange={(e) => onEdit('title', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingField(null)}
                leftIcon={<Check className="h-4 w-4" />}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <p className="font-medium">{brief.title}</p>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingField('title')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Objective */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Objective</label>
          {editingField === 'objective' && onEdit ? (
            <div className="flex gap-2">
              <textarea
                value={brief.objective}
                onChange={(e) => onEdit('objective', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
                autoFocus
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingField(null)}
                leftIcon={<Check className="h-4 w-4" />}
              />
            </div>
          ) : (
            <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
              <p className="text-sm flex-1">{brief.objective}</p>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingField('objective')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Audience</label>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Demographics:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {brief.targetAudience.demographics.map((demo, idx) => (
                  <Badge key={idx} variant="outline">{demo}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Interests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {brief.targetAudience.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
            {brief.targetAudience.location && (
              <div>
                <span className="text-xs text-muted-foreground">Location:</span>
                <p className="text-sm mt-1">{brief.targetAudience.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Platforms</label>
          <div className="flex flex-wrap gap-1">
            {brief.platforms.map((platform, idx) => (
              <Badge key={idx} variant="brand">{platform}</Badge>
            ))}
          </div>
        </div>

        {/* Content Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <div className="flex flex-wrap gap-1">
            {brief.contentType.map((type, idx) => (
              <Badge key={idx} variant="outline">{type}</Badge>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget Range</label>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">
              {brief.budget.currency} {brief.budget.min.toLocaleString()} - {brief.budget.max.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Timeline</label>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="font-medium">{new Date(brief.timeline.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">End Date:</span>
              <span className="font-medium">{new Date(brief.timeline.endDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Milestones:</span>
              <ul className="mt-1 space-y-1">
                {brief.timeline.milestones.map((milestone, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <Check className="h-3 w-3 text-success" />
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Deliverables</label>
          <ul className="space-y-2">
            {brief.deliverables.map((deliverable, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm">{deliverable}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KPIs */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Key Performance Indicators</label>
          <ul className="space-y-2">
            {brief.kpis.map((kpi, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                <AlertCircle className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm">{kpi}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Notes */}
        {brief.additionalNotes && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
              {brief.additionalNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
