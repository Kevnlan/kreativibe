'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Tag, Clock, CheckCircle, Building2 } from 'lucide-react';
import { Button, Card, CardContent, StatusBadge, EmptyState } from '@/components/ui';
import { offerService } from '@/services/offer.service';
import { Offer, OfferStatus } from '@/types/api-contracts/offer.types';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function CreatorOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadOffers();
  }, [statusFilter]);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await offerService.listReceivedOffers(
        statusFilter !== 'ALL' ? { status: statusFilter } : undefined
      );
      setOffers(response.items || []);
    } catch {
      setError('Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
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

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'PENDING' || o.status === 'COUNTERED').length,
    accepted: offers.filter(o => o.status === 'ACCEPTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading offers...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Received Offers</h1>
        <p className="text-muted-foreground">Offers from brands interested in your content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Offers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Awaiting Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'COUNTERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED'] as const).map(s => (
          <Button
            key={s}
            variant={statusFilter === s ? 'brand' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {offers.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-8 w-8" />}
          title="No offers received"
          description="When brands make offers on your content, they'll appear here."
        />
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/creative/offers/${offer.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {offer.brandProfile?.logo ? (
                      <img
                        src={offer.brandProfile.logo}
                        alt={offer.brandProfile.companyName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {offer.brandProfile?.companyName ?? 'Unknown Brand'}
                        </h3>
                        <StatusBadge variant={getStatusVariant(offer.status)}>
                          {offer.status}
                        </StatusBadge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="truncate">{offer.content?.title ?? 'Untitled Content'}</span>
                        <span>·</span>
                        <span>{formatCurrency(offer.currentAmount, offer.currency)}</span>
                        <span>·</span>
                        <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
