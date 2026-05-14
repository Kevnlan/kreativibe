'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, Share2, Calendar, Clock, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PostPreviewData {
  id: string;
  title: string;
  content: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  media?: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  hashtags?: string[];
  mentions?: string[];
}

interface PostPreviewProps {
  post: PostPreviewData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublishNow?: (id: string) => void;
  onShare?: (id: string) => void;
  showActions?: boolean;
}

const platformIcons = {
  instagram: ImageIcon,
  tiktok: Video,
  youtube: Video,
  twitter: FileText,
  facebook: FileText,
} as const;

const platformColors = {
  instagram: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
  tiktok: 'bg-black/10 text-black dark:text-white border-black/20',
  youtube: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  twitter: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  facebook: 'bg-blue-600/10 text-blue-800 dark:text-blue-300 border-blue-600/20',
} as const;

const statusColors = {
  scheduled: 'warning',
  published: 'success',
  failed: 'destructive',
} as const;

export function PostPreview({ post, onEdit, onDelete, onPublishNow, onShare, showActions = true }: PostPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const PlatformIcon = platformIcons[post.platform];

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        post.status === 'published' && "border-success/50 bg-success/5",
        post.status === 'failed' && "border-destructive/50 bg-destructive/5"
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", platformColors[post.platform])}>
              <PlatformIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{post.title}</h4>
              <p className="text-xs text-muted-foreground">
                {new Date(post.scheduledDate).toLocaleDateString()} at {post.scheduledTime}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[post.status] as any} className="text-xs">
            {post.status}
          </Badge>
        </div>

        {/* Media Preview */}
        {post.media && post.media.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {post.media.slice(0, 3).map((media, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
                >
                  <img
                    src={media}
                    alt={`Media ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {post.media.length > 3 && (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-muted-foreground">+{post.media.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="mb-3">
          <p className={cn(
            "text-sm",
            !expanded && "line-clamp-2"
          )}>
            {post.content}
          </p>
          {post.content.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-brand-blue hover:underline mt-1"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Hashtags & Mentions */}
        {(post.hashtags || post.mentions) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags?.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.mentions?.slice(0, 2).map((mention, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                @{mention}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t">
            {post.status === 'scheduled' && onPublishNow && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onPublishNow(post.id)}
                leftIcon={<Clock className="h-4 w-4" />}
              >
                Publish Now
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post.id)}
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Edit
              </Button>
            )}
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(post.id)}
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                Share
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
