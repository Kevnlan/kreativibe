'use client';

import { useState } from 'react';
import { FileText, Upload, X, Plus, Sparkles, Eye, Save, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ProposalData {
  campaignId: string;
  creativeId: string;
  sections: ProposalSection[];
  attachments: File[];
  proposedRate: number;
  currency: string;
  estimatedDelivery: string;
  additionalNotes?: string;
}

interface ProposalSubmissionProps {
  campaignId: string;
  campaignTitle: string;
  initialProposal?: Partial<ProposalData>;
  onSave?: (proposal: ProposalData) => void;
  onSubmit?: (proposal: ProposalData) => void;
  onPreview?: () => void;
}

const defaultSections: Omit<ProposalSection, 'content'>[] = [
  { id: '1', title: 'Campaign Understanding', order: 1 },
  { id: '2', title: 'Creative Approach', order: 2 },
  { id: '3', title: 'Content Strategy', order: 3 },
  { id: '4', title: 'Timeline', order: 4 },
  { id: '5', title: 'Deliverables', order: 5 },
];

export function ProposalSubmission({
  campaignId,
  campaignTitle,
  initialProposal,
  onSave,
  onSubmit,
  onPreview,
}: ProposalSubmissionProps) {
  const [sections, setSections] = useState<ProposalSection[]>(
    initialProposal?.sections || defaultSections.map(s => ({ ...s, content: '' }))
  );
  const [attachments, setAttachments] = useState<File[]>(initialProposal?.attachments || []);
  const [proposedRate, setProposedRate] = useState(initialProposal?.proposedRate || 0);
  const [estimatedDelivery, setEstimatedDelivery] = useState(initialProposal?.estimatedDelivery || '');
  const [additionalNotes, setAdditionalNotes] = useState(initialProposal?.additionalNotes || '');
  const [showFileUpload, setShowFileUpload] = useState(false);

  const updateSection = (sectionId: string, content: string) => {
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, content } : s))
    );
  };

  const addSection = () => {
    const newSection: ProposalSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      order: sections.length + 1,
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const proposal: ProposalData = {
      campaignId,
      creativeId: 'current-user-id',
      sections,
      attachments,
      proposedRate,
      currency: 'KES',
      estimatedDelivery,
      additionalNotes,
    };
    onSave?.(proposal);
  };

  const handleSubmit = () => {
    const proposal: ProposalData = {
      campaignId,
      creativeId: 'current-user-id',
      sections,
      attachments,
      proposedRate,
      currency: 'KES',
      estimatedDelivery,
      additionalNotes,
    };
    onSubmit?.(proposal);
  };

  const isValid = sections.every(s => s.content.trim().length > 0) && proposedRate > 0 && estimatedDelivery;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Proposal Submission</CardTitle>
              <p className="text-muted-foreground">{campaignTitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onPreview} leftIcon={<Eye className="h-4 w-4" />}>
                Preview
              </Button>
              <Button variant="outline" onClick={handleSave} leftIcon={<Save className="h-4 w-4" />}>
                Save Draft
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Proposal Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposal Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{section.title}</label>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeSection(section.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, e.target.value)}
                placeholder={`Describe your ${section.title.toLowerCase()}...`}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={4}
              />
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addSection}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attachments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFileUpload ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full"
                accept="image/*,video/*,application/pdf"
              />
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowFileUpload(true)}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload Files
            </Button>
          )}

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing & Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposed Rate (KES)</label>
              <input
                type="number"
                value={proposedRate}
                onChange={(e) => setProposedRate(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Delivery Date</label>
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional information you'd like to share..."
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="border-brand-blue/50 bg-brand-blue/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-brand-blue mb-1">AI Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Based on the campaign requirements, consider highlighting your experience with similar brands and including metrics from past campaigns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={!isValid}
          className="flex-1"
          leftIcon={<Send className="h-4 w-4" />}
        >
          Submit Proposal
        </Button>
      </div>
    </div>
  );
}
