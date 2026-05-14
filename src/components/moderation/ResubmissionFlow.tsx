'use client';

import { useState } from 'react';
import { Upload, X, AlertCircle, Info, CheckCircle, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface RejectionFeedback {
  reason: string;
  details: string;
  suggestedFixes: string[];
  examples?: string[];
}

export interface ResubmissionData {
  contentId: string;
  originalContent: {
    title: string;
    description: string;
    type: 'image' | 'video' | 'audio' | 'text';
    url: string;
  };
  rejectionFeedback: RejectionFeedback;
  resubmissionNotes?: string;
  revisedFiles?: File[];
}

interface ResubmissionFlowProps {
  data: ResubmissionData;
  onSubmit: (data: ResubmissionData) => void;
  onCancel: () => void;
}

const contentTypeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  text: FileText,
} as const;

export function ResubmissionFlow({ data, onSubmit, onCancel }: ResubmissionFlowProps) {
  const [notes, setNotes] = useState(data.resubmissionNotes || '');
  const [revisedFiles, setRevisedFiles] = useState<File[]>(data.revisedFiles || []);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [step, setStep] = useState<'review' | 'edit' | 'submit'>('review');

  const ContentIcon = contentTypeIcons[data.originalContent.type];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setRevisedFiles(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const handleRemoveFile = (index: number) => {
    setRevisedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({
      ...data,
      resubmissionNotes: notes,
      revisedFiles,
    });
  };

  const canSubmit = notes.length > 0 || revisedFiles.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Content Resubmission</CardTitle>
            <Badge variant="warning">Revision Required</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            {data.originalContent.url ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {data.originalContent.type === 'image' && (
                  <img
                    src={data.originalContent.url}
                    alt={data.originalContent.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {data.originalContent.type !== 'image' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <ContentIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <ContentIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{data.originalContent.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {data.originalContent.description}
              </p>
              <Badge variant="outline" className="mt-2">
                {data.originalContent.type.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rejection Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-destructive">{data.rejectionFeedback.reason}</h4>
              <p className="text-sm text-muted-foreground mt-1">{data.rejectionFeedback.details}</p>
            </div>
          </div>

          {data.rejectionFeedback.suggestedFixes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suggested Fixes</h4>
              <ul className="space-y-2">
                {data.rejectionFeedback.suggestedFixes.map((fix, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.rejectionFeedback.examples && data.rejectionFeedback.examples.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Examples</h4>
              <div className="space-y-2">
                {data.rejectionFeedback.examples.map((example, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm">
                    {example}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resubmission Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Revision Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the changes you've made to address the feedback..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Revised Files (Optional)</label>
            {showFileUpload ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full"
                  accept={
                    data.originalContent.type === 'image'
                      ? 'image/*'
                      : data.originalContent.type === 'video'
                      ? 'video/*'
                      : data.originalContent.type === 'audio'
                      ? 'audio/*'
                      : '*/*'
                  }
                />
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowFileUpload(true)}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Upload Revised Files
              </Button>
            )}

            {/* File List */}
            {revisedFiles.length > 0 && (
              <div className="space-y-2 mt-3">
                {revisedFiles.map((file, index) => (
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
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
            <Info className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-blue">
              Your resubmission will be reviewed by our moderation team. Please ensure all feedback has been addressed before submitting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="brand"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1"
        >
          Submit Resubmission
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
