'use client';

import { useState } from 'react';
import { ArrowLeftRight, CheckCircle, XCircle, Calendar, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface OfferComparisonData {
  original: {
    amount: number;
    currency: string;
    deliverables: string[];
    timeline: {
      startDate: string;
      endDate: string;
    };
  };
  counter: {
    amount: number;
    currency: string;
    deliverables: string[];
    timeline: {
      startDate: string;
      endDate: string;
    };
  };
}

interface OfferComparisonProps {
  comparison: OfferComparisonData;
  onAcceptCounter?: () => void;
  onRejectCounter?: () => void;
  onProposeNew?: () => void;
}

export function OfferComparison({ comparison, onAcceptCounter, onRejectCounter, onProposeNew }: OfferComparisonProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpand = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const calculateDifference = (original: number, counter: number) => {
    const diff = counter - original;
    const percent = ((diff / original) * 100).toFixed(1);
    return { diff, percent };
  };

  const amountDiff = calculateDifference(comparison.original.amount, comparison.counter.amount);
  const deliverablesDiff = comparison.counter.deliverables.length - comparison.original.deliverables.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Offer Comparison</CardTitle>
          </div>
          <Badge variant="brand">Side-by-Side</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Comparison */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('amount')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Amount</span>
              </div>
              {expandedSections.has('amount') ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x border-t">
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Original</p>
              <p className="text-xl font-bold">
                {comparison.original.currency} {comparison.original.amount.toLocaleString()}
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Difference</p>
              <p className={cn(
                "text-xl font-bold",
                amountDiff.diff > 0 ? "text-success" : amountDiff.diff < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {amountDiff.diff > 0 ? '+' : ''}{comparison.counter.currency} {amountDiff.diff.toLocaleString()}
              </p>
              <p className={cn(
                "text-xs mt-1",
                amountDiff.diff > 0 ? "text-success" : amountDiff.diff < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                ({amountDiff.percent}%)
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Counter Offer</p>
              <p className="text-xl font-bold">
                {comparison.counter.currency} {comparison.counter.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Comparison */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('timeline')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Timeline</span>
              </div>
              {expandedSections.has('timeline') ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x border-t">
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Original</p>
              <p className="text-sm font-medium">
                {new Date(comparison.original.timeline.startDate).toLocaleDateString()} - {new Date(comparison.original.timeline.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium">
                {Math.ceil((new Date(comparison.original.timeline.endDate).getTime() - new Date(comparison.original.timeline.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Counter Offer</p>
              <p className="text-sm font-medium">
                {new Date(comparison.counter.timeline.startDate).toLocaleDateString()} - {new Date(comparison.counter.timeline.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Deliverables Comparison */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('deliverables')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Deliverables</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {deliverablesDiff > 0 ? `+${deliverablesDiff}` : deliverablesDiff < 0 ? deliverablesDiff : 'Same'}
                </Badge>
                {expandedSections.has('deliverables') ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x border-t">
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2">Original ({comparison.original.deliverables.length})</p>
              <ul className="space-y-1">
                {comparison.original.deliverables.map((d, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2">Counter Offer ({comparison.counter.deliverables.length})</p>
              <ul className="space-y-1">
                {comparison.counter.deliverables.map((d, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>
                {amountDiff.diff > 0 ? 'Counter offer is higher by' : amountDiff.diff < 0 ? 'Counter offer is lower by' : 'Amount is the same'} {comparison.counter.currency} {Math.abs(amountDiff.diff).toLocaleString()} ({amountDiff.percent}%)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>
                {deliverablesDiff > 0 ? `${deliverablesDiff} additional deliverables` : deliverablesDiff < 0 ? `${Math.abs(deliverablesDiff)} fewer deliverables` : 'Same number of deliverables'}
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onAcceptCounter && (
            <Button
              variant="success"
              onClick={onAcceptCounter}
              className="flex-1"
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Accept Counter Offer
            </Button>
          )}
          {onRejectCounter && (
            <Button
              variant="destructive"
              onClick={onRejectCounter}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Reject
            </Button>
          )}
          {onProposeNew && (
            <Button
              variant="outline"
              onClick={onProposeNew}
              leftIcon={<ArrowLeftRight className="h-4 w-4" />}
            >
              Propose New
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
