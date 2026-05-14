'use client';

import { useState } from 'react';
import { Check, X, Download, Share2, AlertTriangle, Info, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ContentReview {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  thumbnail?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    verified: boolean;
  };
  category: string;
  platform: string;
  tags: string[];
  submittedAt: string;
  metadata: {
    duration?: number;
    dimensions?: { width: number; height: number };
    fileSize: number;
    format: string;
  };
}

interface ContentReviewPanelProps {
  content: ContentReview;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onFlag: (id: string) => void;
}

export function ContentReviewPanel({ content, onApprove, onReject, onFlag }: ContentReviewPanelProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const rejectionReasons = [
    'Inappropriate content',
    'Copyright violation',
    'Violates community guidelines',
    'Misleading information',
    'Spam or low quality',
    'Other',
  ];

  const handleReject = () => {
    if (rejectionReason) {
      onReject(content.id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason('');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="space-y-6">
      {/* Content Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{content.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
            </div>
            <Badge variant="outline">{content.type.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
            {content.type === 'image' && content.url && (
              <img
                src={content.url}
                alt={content.title}
                className="w-full max-h-[500px] object-contain"
              />
            )}
            {content.type === 'video' && content.url && (
              <video
                src={content.url}
                controls
                className="w-full max-h-[500px]"
              />
            )}
            {content.type === 'audio' && content.url && (
              <div className="p-8 flex items-center justify-center">
                <audio src={content.url} controls className="w-full" />
              </div>
            )}
            {content.type === 'text' && (
              <div className="p-6 bg-background">
                <p className="whitespace-pre-wrap">{content.description}</p>
              </div>
            )}
          </div>

          {/* Content Actions */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Download
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetadata(!showMetadata)}
              leftIcon={showMetadata ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            >
              {showMetadata ? 'Hide' : 'Show'} Metadata
            </Button>
          </div>

          {/* Metadata */}
          {showMetadata && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">File Size:</span>{' '}
                  <span className="font-medium">{formatFileSize(content.metadata.fileSize)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>{' '}
                  <span className="font-medium">{content.metadata.format}</span>
                </div>
                {content.metadata.duration && (
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{' '}
                    <span className="font-medium">{content.metadata.duration}s</span>
                  </div>
                )}
                {content.metadata.dimensions && (
                  <div>
                    <span className="text-muted-foreground">Dimensions:</span>{' '}
                    <span className="font-medium">{content.metadata.dimensions.width}x{content.metadata.dimensions.height}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Submitted:</span>{' '}
                  <span className="font-medium">{new Date(content.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creator Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creator Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {content.creator.avatar ? (
              <img
                src={content.creator.avatar}
                alt={content.creator.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold">
                {content.creator.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{content.creator.name}</h3>
                {content.creator.verified && (
                  <Badge variant="success">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{content.creator.email}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="flex flex-wrap gap-1">
              {content.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Moderation Decision</CardTitle>
        </CardHeader>
        <CardContent>
          {!showRejectForm ? (
            <div className="flex gap-3">
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={() => onApprove(content.id)}
                leftIcon={<Check className="h-5 w-5" />}
              >
                Approve Content
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setShowRejectForm(true)}
                leftIcon={<X className="h-5 w-5" />}
              >
                Reject Content
              </Button>
              <Button
                variant="warning"
                size="lg"
                onClick={() => onFlag(content.id)}
                leftIcon={<AlertTriangle className="h-5 w-5" />}
              >
                Flag for Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                <Info className="h-5 w-5 text-warning mt-0.5" />
                <p className="text-sm text-warning">
                  Please provide a reason for rejection. This will be shared with the creator.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a reason...</option>
                  {rejectionReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Confirm Rejection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
