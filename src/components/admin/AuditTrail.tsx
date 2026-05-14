'use client';

import { useState } from 'react';
import { FileText, Search, Filter, Calendar, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  target: string;
  category: 'user' | 'campaign' | 'payment' | 'system' | 'security';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress?: string;
  userAgent?: string;
}

interface AuditTrailProps {
  entries: AuditLogEntry[];
  onExport?: () => void;
  onLoadMore?: () => void;
}

const categoryColors = {
  user: 'text-blue-600 dark:text-blue-400',
  campaign: 'text-purple-600 dark:text-purple-400',
  payment: 'text-green-600 dark:text-green-400',
  system: 'text-gray-600 dark:text-gray-400',
  security: 'text-red-600 dark:text-red-400',
} as const;

export function AuditTrail({ entries, onExport, onLoadMore }: AuditTrailProps) {
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
      entry.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Audit Trail</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{entries.length} entries</Badge>
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
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
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
              <option value="security">Security</option>
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
                      <FileText className="h-4 w-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.action}</span>
                        <Badge variant="outline" className={cn("text-xs capitalize", categoryColors[entry.category])}>
                          {entry.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Target: {entry.target}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>Actor: {entry.actor.name}</span>
                        <span>•</span>
                        <span>Role: {entry.actor.role}</span>
                        <span>•</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Expand */}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    {entry.changes && entry.changes.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Changes Made</h5>
                        {entry.changes.map((change, idx) => (
                          <div key={idx} className="p-2 bg-muted rounded text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{change.field}:</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-destructive line-through">{change.oldValue}</span>
                              <span>→</span>
                              <span className="text-success">{change.newValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {entry.ipAddress && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>IP: {entry.ipAddress}</span>
                      </div>
                    )}
                    {entry.userAgent && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>User Agent: {entry.userAgent.substring(0, 50)}...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit log entries found</p>
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
