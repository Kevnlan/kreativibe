'use client';

import { useState } from 'react';
import { Search, Filter, Check, X, AlertTriangle, Clock, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'text';
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  submittedAt: string;
  ruleViolations: number;
  mlScore: number;
  thumbnail?: string;
}

interface ModerationQueueProps {
  items: ContentItem[];
  onItemClick: (id: string) => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
}

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  flagged: 'destructive',
} as const;

export function ModerationQueue({ items, onItemClick, onBulkApprove, onBulkReject }: ModerationQueueProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Tech', 'Fitness', 'Gaming', 'Music', 'Art'];

  const filteredItems = items.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleBulkApprove = () => {
    onBulkApprove(Array.from(selectedItems));
    setSelectedItems(new Set());
  };

  const handleBulkReject = () => {
    onBulkReject(Array.from(selectedItems));
    setSelectedItems(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation Queue</h2>
          <p className="text-muted-foreground">
            {filteredItems.length} items awaiting review
          </p>
        </div>
        {selectedItems.size > 0 && (
          <div className="flex gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={handleBulkApprove}
              leftIcon={<Check className="h-4 w-4" />}
            >
              Approve ({selectedItems.size})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkReject}
              leftIcon={<X className="h-4 w-4" />}
            >
              Reject ({selectedItems.size})
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search content or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No content items match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedItems.has(item.id) && "ring-2 ring-brand-blue"
              )}
              onClick={() => onItemClick(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id);
                    }}
                    className="h-4 w-4 rounded border-input"
                  />

                  {/* Thumbnail */}
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground uppercase">{item.type}</span>
                    </div>
                  )}

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <Badge variant={statusColors[item.status]}>{item.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{item.creator.name}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.platform}</span>
                    </div>
                  </div>

                  {/* Moderation Metrics */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <AlertTriangle className={cn(
                          "h-4 w-4",
                          item.ruleViolations > 0 ? "text-destructive" : "text-success"
                        )} />
                        <span className={cn(
                          item.ruleViolations > 0 ? "text-destructive font-medium" : "text-success"
                        )}>
                          {item.ruleViolations} violations
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm">
                        <span className={cn(
                          item.mlScore > 70 ? "text-destructive" : item.mlScore > 40 ? "text-warning" : "text-success"
                        )}>
                          {item.mlScore}% risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
