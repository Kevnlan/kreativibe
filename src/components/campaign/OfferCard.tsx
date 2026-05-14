'use client';

import { useState } from 'react';
import { DollarSign, Calendar, User, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface OfferData {
  id: string;
  campaignId: string;
  campaignTitle: string;
  from: {
    id: string;
    name: string;
    type: 'brand' | 'creative';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    type: 'brand' | 'creative';
  };
  amount: number;
  currency: string;
  deliverables: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
  expiresAt?: string;
  createdAt: string;
}

interface OfferCardProps {
  offer: OfferData;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string, reason: string) => void;
  onCounter?: (offerId: string) => void;
  onViewDetails?: (offerId: string) => void;
  showActions?: boolean;
}

const statusColors = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'destructive',
  countered: 'brand',
  expired: 'secondary',
} as const;

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle,
  countered: MessageSquare,
  expired: Clock,
} as const;

export function OfferCard({
  offer,
  onAccept,
  onReject,
  onCounter,
  onViewDetails,
  showActions = true,
}: OfferCardProps) {
  const [expanded, setExpanded] = useState(false);

  const StatusIcon = statusIcons[offer.status];

  const handleAccept = () => {
    onAccept?.(offer.id);
  };

  const handleReject = () => {
    onReject?.(offer.id, 'Not interested');
  };

  const handleCounter = () => {
    onCounter?.(offer.id);
  };

  const isExpired = offer.expiresAt && new Date(offer.expiresAt) < new Date();

  return (
    <Card
      className={cn(
        "transition-all",
        offer.status === 'accepted' && "border-success/50 bg-success/5",
        offer.status === 'rejected' && "border-destructive/50 bg-destructive/5",
        isExpired && "opacity-50"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            {offer.from.avatar ? (
              <img src={offer.from.avatar} alt={offer.from.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold">
                {offer.from.name.charAt(0)}
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{offer.from.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {offer.from.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Offer to {offer.to.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(offer.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-5 w-5", statusColors[offer.status] === 'success' && 'text-success', statusColors[offer.status] === 'destructive' && 'text-destructive', statusColors[offer.status] === 'warning' && 'text-warning')} />
            <Badge variant={statusColors[offer.status] as any} className="text-xs">
              {isExpired ? 'Expired' : offer.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Amount & Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <DollarSign className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Offer Amount</p>
              <p className="text-lg font-bold">
                {offer.currency} {offer.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-brand-blue" />
            <div>
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="text-sm font-medium">
                {new Date(offer.timeline.startDate).toLocaleDateString()} - {new Date(offer.timeline.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Deliverables Preview */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Deliverables ({offer.deliverables.length})</p>
          <div className="flex flex-wrap gap-1">
            {offer.deliverables.slice(0, 3).map((deliverable, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {deliverable}
              </Badge>
            ))}
            {offer.deliverables.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{offer.deliverables.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Message */}
        {offer.message && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{offer.message}</p>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          {expanded ? 'Show less' : 'Show more'}
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
            {/* Full Deliverables */}
            <div>
              <h5 className="text-sm font-medium mb-2">All Deliverables</h5>
              <ul className="space-y-1">
                {offer.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expires At */}
            {offer.expiresAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Expires: {new Date(offer.expiresAt).toLocaleString()}
                </span>
              </div>
            )}

            {/* View Details */}
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails(offer.id)}>
                View Full Details
              </Button>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && offer.status === 'pending' && !isExpired && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              variant="success"
              onClick={handleAccept}
              className="flex-1"
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Accept
            </Button>
            <Button
              variant="brand"
              onClick={handleCounter}
              leftIcon={<MessageSquare className="h-4 w-4" />}
            >
              Counter
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
