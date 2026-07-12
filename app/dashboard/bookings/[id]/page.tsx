'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, ArrowLeft, Loader2, CheckCircle, XCircle, PlayCircle, AlertCircle, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge, Input } from '@/components/ui';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus, RescheduleBookingData } from '@/types/api-contracts/booking.types';
import { useRouter, useParams } from 'next/navigation';

const statusVariants: Record<BookingStatus, string> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  DECLINED: 'error',
  IN_PROGRESS: 'default',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ startDate: '', endDate: '', notes: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    if (bookingId) loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.get(bookingId);
      setBooking(res);
    } catch {
      setError('Failed to load booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: BookingStatus, reason?: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const data: any = { bookingId, status };
      if (reason) data.cancellationReason = reason;
      const updated = await bookingService.updateStatus(data);
      setBooking(updated);
      setShowCancel(false);
      setCancelReason('');
    } catch {
      setError('Failed to update booking status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.startDate || !rescheduleData.endDate) return;
    setActionLoading(true);
    setError(null);
    try {
      const data: RescheduleBookingData = {
        bookingId,
        startDate: new Date(rescheduleData.startDate).toISOString(),
        endDate: new Date(rescheduleData.endDate).toISOString(),
      };
      if (rescheduleData.notes.trim()) data.notes = rescheduleData.notes;
      const updated = await bookingService.reschedule(data);
      setBooking(updated);
      setShowReschedule(false);
      setRescheduleData({ startDate: '', endDate: '', notes: '' });
    } catch {
      setError('Failed to reschedule booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading booking...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error || 'Booking not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/bookings')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{booking.title}</h1>
            <StatusBadge variant={(statusVariants[booking.status] as any) || 'default'}>
              {booking.status}
            </StatusBadge>
          </div>
          <p className="text-muted-foreground">{booking.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formatDate(booking.startDate)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(booking.startDate)} – {formatTime(booking.endDate)}
                </p>
              </div>
            </div>
            {booking.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{booking.location}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{formatCurrency(booking.price, booking.currency)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Type: {booking.type.replace(/_/g, ' ').toLowerCase()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Timezone: {booking.timezone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {booking.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-600 mb-1">Cancellation Reason</p>
                <p className="text-sm text-red-700">{booking.cancellationReason}</p>
              </div>
            )}

            {booking.status === 'PENDING' && (
              <>
                <Button
                  className="w-full"
                  onClick={() => handleStatusUpdate('CONFIRMED')}
                  disabled={actionLoading}
                  leftIcon={actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                >
                  Confirm Booking
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusUpdate('DECLINED', 'Declined by user')}
                  disabled={actionLoading}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Decline
                </Button>
              </>
            )}

            {booking.status === 'CONFIRMED' && (
              <Button
                className="w-full"
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                disabled={actionLoading}
                leftIcon={actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
              >
                Mark In Progress
              </Button>
            )}

            {booking.status === 'IN_PROGRESS' && (
              <Button
                className="w-full"
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={actionLoading}
                leftIcon={actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              >
                Mark Completed
              </Button>
            )}

            {['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status) && (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReschedule(true)}
                  disabled={actionLoading}
                  leftIcon={<Calendar className="h-4 w-4" />}
                >
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowCancel(true)}
                  disabled={actionLoading}
                  leftIcon={<AlertCircle className="h-4 w-4" />}
                >
                  Cancel Booking
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {showReschedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReschedule(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reschedule Booking</CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowReschedule(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Start Date & Time</label>
                <Input
                  type="datetime-local"
                  value={rescheduleData.startDate}
                  onChange={e => setRescheduleData({ ...rescheduleData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New End Date & Time</label>
                <Input
                  type="datetime-local"
                  value={rescheduleData.endDate}
                  onChange={e => setRescheduleData({ ...rescheduleData, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  value={rescheduleData.notes}
                  onChange={e => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                  placeholder="Reason for rescheduling..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowReschedule(false)}>Cancel</Button>
                <Button
                  onClick={handleReschedule}
                  disabled={actionLoading || !rescheduleData.startDate || !rescheduleData.endDate}
                  leftIcon={actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {actionLoading ? 'Rescheduling...' : 'Reschedule'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCancel(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Cancel Booking</h3>
              </div>
              <p className="text-sm text-muted-foreground">Are you sure you want to cancel this booking?</p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Explain why this booking is being cancelled..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCancel(false)}>Go Back</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate('CANCELLED', cancelReason)}
                  disabled={actionLoading || !cancelReason.trim()}
                  leftIcon={actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
