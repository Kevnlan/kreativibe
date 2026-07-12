'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare, Send } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { reviewService } from '@/services/review.service';
import { Review } from '@/types/api-contracts/review.types';

export default function CreativeReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.list({
        subjectType: 'CREATOR',
        page: 1,
        limit: 50,
      });
      setReviews(res.items || []);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await reviewService.respond({ reviewId, response: responseText });
      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
      setRespondingTo(null);
      setResponseText('');
    } catch {
      setError('Failed to submit response.');
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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Reviews</h1>
        <p className="text-muted-foreground mt-1">Reviews from brands about your work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">{avgRating}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{reviews.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{reviews.filter(r => r.response).length}</p>
            <p className="text-sm text-muted-foreground mt-1">Responded</p>
          </CardContent>
        </Card>
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
          <p>No reviews yet. Reviews from brands will appear here.</p>
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
                    <p className="text-sm text-muted-foreground">{review.body}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {review.reviewer && <span>By {review.reviewer.name}</span>}
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.response && <StatusBadge variant="success" size="sm">Responded</StatusBadge>}
                    </div>

                    {review.response && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Your response:</p>
                        <p className="text-sm">{review.response}</p>
                      </div>
                    )}

                    {!review.response && respondingTo !== review.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => { setRespondingTo(review.id); setResponseText(''); }}
                        leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                      >
                        Respond
                      </Button>
                    )}

                    {respondingTo === review.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          placeholder="Write your response..."
                          rows={3}
                          className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleRespond(review.id)}
                            disabled={submitting || !responseText.trim()}
                            leftIcon={submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          >
                            {submitting ? 'Sending...' : 'Send Response'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setRespondingTo(null); setResponseText(''); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
