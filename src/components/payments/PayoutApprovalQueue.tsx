'use client';

import { useState } from 'react';
import { Check, X, AlertTriangle, Clock, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PayoutRequest {
  id: string;
  creative: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    phone: string;
  };
  amount: number;
  currency: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
  campaign?: string;
}

interface PayoutApprovalQueueProps {
  requests: PayoutRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onBulkApprove: (ids: string[]) => void;
}

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  processing: 'brand',
  completed: 'success',
  failed: 'destructive',
} as const;

export function PayoutApprovalQueue({ requests, onApprove, onReject, onBulkApprove }: PayoutApprovalQueueProps) {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

  const filteredRequests = requests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  );

  const toggleSelection = (id: string) => {
    setSelectedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedRequests(prev => {
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
    if (selectedRequests.size === filteredRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(filteredRequests.map(r => r.id)));
    }
  };

  const handleBulkApprove = () => {
    onBulkApprove(Array.from(selectedRequests));
    setSelectedRequests(new Set());
  };

  const pendingCount = filteredRequests.filter(r => r.status === 'pending').length;
  const totalAmount = filteredRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Payout Approval Queue</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="warning">{pendingCount} Pending</Badge>
            <Badge variant="outline">
              {filteredRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()} KES
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {selectedRequests.size > 0 && (
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={handleBulkApprove}
                leftIcon={<Check className="h-4 w-4" />}
              >
                Approve ({selectedRequests.size})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payout requests match your filters</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const isExpanded = expandedRequests.has(request.id);
              const isSelected = selectedRequests.has(request.id);

              return (
                <div
                  key={request.id}
                  className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    isSelected && "border-brand-blue bg-brand-blue/5",
                    request.status === 'failed' && "border-destructive/50 bg-destructive/5",
                    request.status === 'completed' && "border-success/50 bg-success/5"
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(request.id)}
                        className="h-4 w-4 rounded border-input mt-1"
                      />

                      {/* Creative Info */}
                      {request.creative.avatar ? (
                        <img
                          src={request.creative.avatar}
                          alt={request.creative.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold">
                          {request.creative.name.charAt(0)}
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{request.creative.name}</h4>
                          <Badge variant={statusColors[request.status] as any} className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{request.creative.email}</span>
                          <span>•</span>
                          <span>{request.creative.phone}</span>
                        </div>
                        {request.campaign && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Campaign: {request.campaign}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {request.currency} {request.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Expand */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleExpand(request.id)}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                        {/* Bank Details */}
                        <div>
                          <h5 className="text-sm font-medium mb-2">Bank Details</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bank:</span>
                              <span className="font-medium">{request.bankDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Account:</span>
                              <span className="font-medium font-mono">{request.bankDetails.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Account Name:</span>
                              <span className="font-medium">{request.bankDetails.accountName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => onApprove(request.id)}
                              leftIcon={<Check className="h-4 w-4" />}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onReject(request.id, 'Insufficient documentation')}
                              leftIcon={<X className="h-4 w-4" />}
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {request.failureReason && (
                          <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-destructive">{request.failureReason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
