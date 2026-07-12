'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2, Trash2, Search, AlertCircle, X } from 'lucide-react';
import { Button, Input, Card, CardContent, StatusBadge } from '@/components/ui';
import { reviewService } from '@/services/review.service';
import { Review, ReviewListFilters } from '@/types/api-contracts/review.types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: ReviewListFilters = { page: 1, limit: 100 };
      if (ratingFilter) filters.minRating = ratingFilter;
      const res = await reviewService.list(filters);
      setReviews(res.items || []);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteReason.trim()) return;
    setDeleting(true);
    setError(null);
    try {
      await reviewService.adminDelete({ reviewId: deleteTarget.id, reason: deleteReason });
      setReviews(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteReason('');
    } catch {
      setError('Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and moderate user reviews</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={ratingFilter ?? ''}
          onChange={e => { setRatingFilter(e.target.value ? Number(e.target.value) : null); }}
          className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
        <Button variant="outline" onClick={loadReviews}>Refresh</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <Card key={review.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{review.title}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.body}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{review.subjectType}</span>
                      {review.reviewer && <span>• By {review.reviewer.name}</span>}
                      <span>• {new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.response && <StatusBadge variant="success" size="sm">Responded</StatusBadge>}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { setDeleteTarget(review); setDeleteReason(''); }}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Delete Review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{deleteTarget.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{deleteTarget.body}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for deletion</label>
                <textarea
                  value={deleteReason}
                  onChange={e => setDeleteReason(e.target.value)}
                  placeholder="Explain why this review is being removed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting || !deleteReason.trim()}
                  leftIcon={deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                >
                  {deleting ? 'Deleting...' : 'Delete Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
