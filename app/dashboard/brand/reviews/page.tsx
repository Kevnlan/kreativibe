'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Loader2, MessageSquare, Trash2, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { reviewService } from '@/services/review.service';
import { Review, ReviewListFilters } from '@/types/api-contracts/review.types';

export default function BrandReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: '',
    subjectType: 'CREATOR' as 'CREATOR' | 'BRAND',
    campaignId: '',
    rating: 5,
    title: '',
    body: '',
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.myReviews({ page: 1, limit: 50 });
      setReviews(res.items || []);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.subjectId.trim() || !formData.title.trim() || !formData.body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const data: any = {
        subjectId: formData.subjectId,
        subjectType: formData.subjectType,
        rating: formData.rating,
        title: formData.title,
        body: formData.body,
      };
      if (formData.campaignId.trim()) data.campaignId = formData.campaignId;
      const created = await reviewService.create(data);
      setReviews(prev => [created, ...prev]);
      setShowCreate(false);
      setFormData({ subjectId: '', subjectType: 'CREATOR', campaignId: '', rating: 5, title: '', body: '' });
    } catch {
      setError('Failed to create review.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-1">Reviews you've given to creators and brands</p>
        </div>
        <Button onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />}>
          New Review
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No reviews yet. Click "New Review" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <Card key={review.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{review.title}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{review.body}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{review.subjectType === 'CREATOR' ? 'Creator' : 'Brand'}: {review.subjectId.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.response && (
                        <>
                          <span>•</span>
                          <StatusBadge variant="success" size="sm">Responded</StatusBadge>
                        </>
                      )}
                    </div>
                    {review.response && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Response:</p>
                        <p className="text-sm">{review.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Review</CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowCreate(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Type</label>
                <select
                  value={formData.subjectType}
                  onChange={e => setFormData({ ...formData, subjectType: e.target.value as 'CREATOR' | 'BRAND' })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="CREATOR">Creator</option>
                  <option value="BRAND">Brand</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject ID</label>
                <input
                  type="text"
                  value={formData.subjectId}
                  onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                  placeholder="Enter user ID..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign ID (optional)</label>
                <input
                  type="text"
                  value={formData.campaignId}
                  onChange={e => setFormData({ ...formData, campaignId: e.target.value })}
                  placeholder="Enter campaign ID..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setFormData({ ...formData, rating: n })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${n <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summary title..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <textarea
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button
                  onClick={handleCreate}
                  disabled={submitting || !formData.subjectId.trim() || !formData.title.trim() || !formData.body.trim()}
                  leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
