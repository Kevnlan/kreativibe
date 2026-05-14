'use client';

import { useState } from 'react';
import { Activity, Search, Filter, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: string;
  category: 'user' | 'campaign' | 'payment' | 'system' | 'content';
  details?: string;
  ipAddress?: string;
}

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  onLoadMore?: () => void;
}

const categoryColors = {
  user: 'text-blue-600 dark:text-blue-400',
  campaign: 'text-purple-600 dark:text-purple-400',
  payment: 'text-green-600 dark:text-green-400',
  system: 'text-gray-600 dark:text-gray-400',
  content: 'text-orange-600 dark:text-orange-400',
} as const;

export function ActivityLog({ entries, onLoadMore }: ActivityLogProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesSearch = !searchQuery || 
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Activity Log</CardTitle>
          </div>
          <Badge variant="outline">{entries.length} entries</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="user">User</option>
              <option value="campaign">Campaign</option>
              <option value="payment">Payment</option>
              <option value="system">System</option>
              <option value="content">Content</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.id);

            return (
              <div key={entry.id} className="border rounded-lg overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <Activity className="h-4 w-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.user.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.category}
                        </Badge>
                      </div>
                      <p className="text-sm">{entry.action}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{entry.user.email}</span>
                        <span>•</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        {entry.ipAddress && (
                          <>
                            <span>•</span>
                            <span>{entry.ipAddress}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expand */}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-2">
                    {entry.details && (
                      <div className="p-2 bg-muted rounded">
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>User ID: {entry.user.id}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity log entries found</p>
          </div>
        )}

        {onLoadMore && entries.length > 0 && (
          <Button variant="outline" className="w-full mt-4" onClick={onLoadMore}>
            Load More
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
