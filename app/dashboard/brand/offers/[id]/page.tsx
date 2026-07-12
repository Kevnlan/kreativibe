'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Send, Check, X, Ban, Clock, Tag, FileText, MessageSquare } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { offerService } from '@/services/offer.service';
import { Offer, OfferStatus, OfferEvent } from '@/types/api-contracts/offer.types';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;
  const [offer, setOffer] = useState<Offer | null>(null);
  const [history, setHistory] = useState<OfferEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadOffer();
  }, [offerId]);

  const loadOffer = async () => {
    setLoading(true);
    setError(null);
    try {
      const [offerData, historyData] = await Promise.all([
        offerService.getOffer(offerId),
        offerService.getOfferHistory(offerId),
      ]);
      setOffer(offerData);
      setHistory(historyData.events || []);
      setCounterAmount(String(offerData.currentAmount));
    } catch {
      setError('Failed to load offer details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCounter = async () => {
    if (!counterAmount || Number(counterAmount) <= 0) return;
    setActionLoading(true);
    try {
      const updated = await offerService.counterOffer({
        id: offerId,
        amount: Number(counterAmount),
        message: counterMessage || undefined,
      });
      setOffer(updated);
      setShowCounterForm(false);
      setCounterMessage('');
      await loadOffer();
    } catch {
      setError('Failed to submit counter offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      const updated = await offerService.acceptOffer({ id: offerId, message: actionMessage || undefined });
      setOffer(updated);
      setActionMessage('');
      await loadOffer();
    } catch {
      setError('Failed to accept offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await offerService.rejectOffer({ id: offerId, message: actionMessage || undefined });
      setOffer(updated);
      setActionMessage('');
      await loadOffer();
    } catch {
      setError('Failed to reject offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setActionLoading(true);
    try {
      const updated = await offerService.withdrawOffer({ id: offerId, message: actionMessage || undefined });
      setOffer(updated);
      setActionMessage('');
      await loadOffer();
    } catch {
      setError('Failed to withdraw offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusVariant = (status: OfferStatus) => {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'WITHDRAWN': return 'default';
      case 'EXPIRED': return 'default';
      case 'COUNTERED': return 'warning';
      default: return 'default';
    }
  };

  const eventIcon = (type: OfferEvent['eventType']) => {
    switch (type) {
      case 'CREATED': return <Tag className="h-4 w-4 text-blue-600" />;
      case 'COUNTER': return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      case 'ACCEPTED': return <Check className="h-4 w-4 text-green-600" />;
      case 'REJECTED': return <X className="h-4 w-4 text-red-600" />;
      case 'WITHDRAWN': return <Ban className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const canAct = offer && (offer.status === 'PENDING' || offer.status === 'COUNTERED');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading offer details...
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/brand/offers')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Offers
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error || 'Offer not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/brand/offers')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
        Back to Offers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offer Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Offer Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{offer.content?.title ?? 'Untitled Content'}</p>
                </div>
                <StatusBadge variant={getStatusVariant(offer.status)}>
                  {offer.status}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(offer.currentAmount, offer.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Initial Amount</p>
                  <p className="text-lg font-medium">
                    {offer.initialAmount !== offer.currentAmount ? (
                      <span className="line-through text-muted-foreground">
                        {formatCurrency(offer.initialAmount, offer.currency)}
                      </span>
                    ) : (
                      formatCurrency(offer.initialAmount, offer.currency)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expires At</p>
                  <p className="text-sm font-medium">
                    {offer.expiresAt ? new Date(offer.expiresAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {offer.message && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-sm bg-muted/50 rounded-lg p-3">{offer.message}</p>
                </div>
              )}

              {offer.license && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <p className="font-medium text-green-900">License Issued</p>
                  </div>
                  <p className="text-xs text-green-700">
                    Issued on {new Date(offer.license.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Negotiation History */}
          <Card>
            <CardHeader>
              <CardTitle>Negotiation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No negotiation events yet.</p>
                ) : (
                  history.map((event, idx) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {eventIcon(event.eventType)}
                        </div>
                        {idx < history.length - 1 && (
                          <div className="w-px h-full bg-border flex-1 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{event.eventType}</span>
                          {event.amount > 0 && (
                            <span className="text-sm text-muted-foreground">
                              · {formatCurrency(event.amount, offer.currency)}
                            </span>
                          )}
                        </div>
                        {event.message && (
                          <p className="text-sm text-muted-foreground mt-1">{event.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          {canAct && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleAccept}
                  disabled={actionLoading}
                  leftIcon={<Check className="h-4 w-4" />}
                >
                  Accept Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCounterForm(!showCounterForm)}
                  disabled={actionLoading}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Counter Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleReject}
                  disabled={actionLoading}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={actionLoading}
                  leftIcon={<Ban className="h-4 w-4" />}
                >
                  Withdraw
                </Button>

                {showCounterForm && (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <label className="text-xs text-muted-foreground">Counter Amount</label>
                      <input
                        type="number"
                        value={counterAmount}
                        onChange={e => setCounterAmount(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Message (optional)</label>
                      <textarea
                        value={counterMessage}
                        onChange={e => setCounterMessage(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                        rows={3}
                        placeholder="Add a message to the creator..."
                      />
                    </div>
                    <Button className="w-full" onClick={handleCounter} disabled={actionLoading || !counterAmount}>
                      {actionLoading ? 'Submitting...' : 'Submit Counter'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {actionLoading && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
