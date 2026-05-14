'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Calendar, Filter, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PaymentTransaction {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  category: 'campaign' | 'payout' | 'platform_fee' | 'refund';
  reference?: string;
}

interface PaymentOversightProps {
  transactions: PaymentTransaction[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const typeColors = {
  inflow: 'text-success',
  outflow: 'text-destructive',
} as const;

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'destructive',
} as const;

const categoryColors = {
  campaign: 'text-purple-600 dark:text-purple-400',
  payout: 'text-blue-600 dark:text-blue-400',
  platform_fee: 'text-orange-600 dark:text-orange-400',
  refund: 'text-red-600 dark:text-red-400',
} as const;

export function PaymentOversight({ transactions, onApprove, onReject, onViewDetails }: PaymentOversightProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());

  const toggleExpand = (transactionId: string) => {
    setExpandedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const totalInflow = transactions.filter(t => t.type === 'inflow' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions.filter(t => t.type === 'outflow' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Payment Oversight</CardTitle>
          </div>
          <Badge variant="outline">{transactions.length} transactions</Badge>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Total Inflow</span>
            </div>
            <p className="text-lg font-bold text-success">
              KES {totalInflow.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Total Outflow</span>
            </div>
            <p className="text-lg font-bold text-destructive">
              KES {totalOutflow.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-lg font-bold text-warning">
              KES {pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="inflow">Inflow</option>
              <option value="outflow">Outflow</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const isExpanded = expandedTransactions.has(transaction.id);

            return (
              <div
                key={transaction.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(transaction.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        transaction.type === 'inflow' ? "bg-success" : "bg-destructive"
                      )}>
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <Badge variant="outline" className={cn("text-xs capitalize", categoryColors[transaction.category])}>
                            {transaction.category}
                          </Badge>
                          <Badge variant={statusColors[transaction.status] as any} className="text-xs capitalize">
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className={cn("font-bold", typeColors[transaction.type])}>
                            {transaction.type === 'inflow' ? '+' : '-'}{transaction.currency} {transaction.amount.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{new Date(transaction.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expand */}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    {transaction.reference && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-mono">{transaction.reference}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {transaction.status === 'pending' && onApprove && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onApprove(transaction.id)}
                          leftIcon={<CheckCircle className="h-4 w-4" />}
                        >
                          Approve
                        </Button>
                      )}
                      {transaction.status === 'pending' && onReject && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onReject(transaction.id)}
                          leftIcon={<AlertTriangle className="h-4 w-4" />}
                        >
                          Reject
                        </Button>
                      )}
                      {onViewDetails && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(transaction.id)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
