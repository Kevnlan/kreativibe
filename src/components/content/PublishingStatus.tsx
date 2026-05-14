'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Eye, Share2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PublishingStatusData {
  postId: string;
  title: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  status: 'pending' | 'processing' | 'published' | 'failed';
  progress?: number;
  errorMessage?: string;
  publishedAt?: string;
  postUrl?: string;
  scheduledFor?: string;
}

interface PublishingStatusProps {
  status: PublishingStatusData;
  onRetry?: (postId: string) => void;
  onView?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  published: CheckCircle,
  failed: XCircle,
} as const;

const statusColors = {
  pending: 'warning',
  processing: 'brand',
  published: 'success',
  failed: 'destructive',
} as const;

export function PublishingStatus({ status, onRetry, onView, onShare }: PublishingStatusProps) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = statusIcons[status.status];

  return (
    <Card
      className={cn(
        "transition-all",
        status.status === 'published' && "border-success/50 bg-success/5",
        status.status === 'failed' && "border-destructive/50 bg-destructive/5",
        status.status === 'processing' && "border-brand-blue/50 bg-brand-blue/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              status.status === 'published' && "bg-success",
              status.status === 'failed' && "bg-destructive",
              status.status === 'processing' && "bg-brand-blue",
              status.status === 'pending' && "bg-muted"
            )}
          >
            <StatusIcon className={cn(
              "h-5 w-5",
              status.status === 'published' && "text-white",
              status.status === 'failed' && "text-white",
              status.status === 'processing' && "text-white animate-spin",
              status.status === 'pending' && "text-muted-foreground"
            )} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{status.title}</h4>
              <Badge variant={statusColors[status.status] as any} className="text-xs">
                {status.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{status.platform}</p>

            {/* Progress Bar */}
            {status.status === 'processing' && status.progress !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-brand-blue h-2 rounded-full transition-all"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{status.progress}% complete</p>
              </div>
            )}

            {/* Error Message */}
            {status.status === 'failed' && status.errorMessage && (
              <div className="mt-2 flex items-start gap-2 p-2 bg-destructive/10 rounded">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-destructive">{status.errorMessage}</p>
              </div>
            )}

            {/* Published Info */}
            {status.status === 'published' && status.publishedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Published {new Date(status.publishedAt).toLocaleString()}
              </p>
            )}

            {/* Scheduled Info */}
            {status.status === 'pending' && status.scheduledFor && (
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled for {new Date(status.scheduledFor).toLocaleString()}
              </p>
            )}
          </div>

          {/* Expand */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0"
          >
            {expanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          </button>
        </div>

        {/* Expanded Actions */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
            {status.status === 'published' && status.postUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(status.postUrl, '_blank')}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                View Post
              </Button>
            )}
            {status.status === 'published' && onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(status.postId)}
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                Share
              </Button>
            )}
            {status.status === 'failed' && onRetry && (
              <Button
                variant="brand"
                size="sm"
                onClick={() => onRetry(status.postId)}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Retry
              </Button>
            )}
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(status.postId)}
              >
                View Details
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
