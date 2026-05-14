'use client';

import { useState } from 'react';
import { Check, X, AlertCircle, FileText, Download, Eye, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface DeliveryItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  thumbnail?: string;
  description?: string;
  metadata?: {
    fileSize?: number;
    dimensions?: { width: number; height: number };
    duration?: number;
  };
}

export interface DeliveryData {
  milestoneId: string;
  milestoneTitle: string;
  submittedBy: string;
  submittedAt: string;
  items: DeliveryItem[];
  notes?: string;
}

interface DeliveryApprovalProps {
  delivery: DeliveryData;
  onApprove: (milestoneId: string, feedback?: string) => void;
  onReject: (milestoneId: string, reason: string) => void;
  onRequestRevision: (milestoneId: string, feedback: string) => void;
}

export function DeliveryApproval({ delivery, onApprove, onReject, onRequestRevision }: DeliveryApprovalProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleApprove = () => {
    onApprove(delivery.milestoneId, feedback);
    setFeedback('');
  };

  const handleReject = () => {
    if (feedback.trim()) {
      onReject(delivery.milestoneId, feedback);
      setFeedback('');
      setShowRejectForm(false);
    }
  };

  const handleRequestRevision = () => {
    if (feedback.trim()) {
      onRequestRevision(delivery.milestoneId, feedback);
      setFeedback('');
      setShowRevisionForm(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Delivery Approval</CardTitle>
              <p className="text-muted-foreground">{delivery.milestoneTitle}</p>
            </div>
            <Badge variant="brand">Pending Review</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Submitted by:</span>
              <span className="font-medium ml-1">{delivery.submittedBy}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted at:</span>
              <span className="font-medium ml-1">{new Date(delivery.submittedAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deliverables ({delivery.items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {delivery.items.map((item) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(item.id)}
                >
                  {/* Thumbnail */}
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      {item.metadata?.fileSize && (
                        <span>{formatFileSize(item.metadata.fileSize)}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank');
                      }}
                      leftIcon={<Eye className="h-4 w-4" />}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank');
                      }}
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-2">
                    {item.description && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Description</h5>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                    {item.metadata && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.metadata.dimensions && (
                          <div>
                            <span className="text-muted-foreground">Dimensions:</span>
                            <span className="ml-1">{item.metadata.dimensions.width}x{item.metadata.dimensions.height}</span>
                          </div>
                        )}
                        {item.metadata.duration && (
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="ml-1">{item.metadata.duration}s</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notes */}
      {delivery.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{delivery.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Feedback Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add your feedback on this delivery..."
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      {!showRejectForm && !showRevisionForm ? (
        <div className="flex gap-3">
          <Button
            variant="success"
            onClick={handleApprove}
            className="flex-1"
            leftIcon={<Check className="h-4 w-4" />}
          >
            Approve Delivery
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRevisionForm(true)}
            leftIcon={<MessageSquare className="h-4 w-4" />}
          >
            Request Revision
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowRejectForm(true)}
            leftIcon={<X className="h-4 w-4" />}
          >
            Reject
          </Button>
        </div>
      ) : showRejectForm ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">
              Please provide a reason for rejection. This will be shared with the creative.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!feedback.trim()}
              leftIcon={<X className="h-4 w-4" />}
            >
              Confirm Rejection
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectForm(false);
                setFeedback('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning">
              Please provide feedback for the revision request. This will help the creative improve their work.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="warning"
              onClick={handleRequestRevision}
              disabled={!feedback.trim()}
              leftIcon={<MessageSquare className="h-4 w-4" />}
            >
              Request Revision
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevisionForm(false);
                setFeedback('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
