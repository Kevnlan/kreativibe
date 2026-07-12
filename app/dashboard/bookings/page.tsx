'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Loader2, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge, Input } from '@/components/ui';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus, BookingType, CreateBookingData } from '@/types/api-contracts/booking.types';
import { useRouter } from 'next/navigation';

const statusVariants: Record<BookingStatus, string> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  DECLINEDED: 'error',
  DECLINED: 'error',
  IN_PROGRESS: 'default',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const typeLabels: Record<BookingType, string> = {
  CONTENT_CREATION: 'Content Creation',
  CAMPAIGN_SHOOT: 'Campaign Shoot',
  MEETING: 'Meeting',
  OTHER: 'Other',
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    creatorId: '',
    type: 'CONTENT_CREATION' as BookingType,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    timezone: 'Africa/Nairobi',
    location: '',
    price: '',
    currency: 'KES',
    notes: '',
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { page: 1, limit: 50 };
      if (statusFilter) filters.status = statusFilter;
      const res = await bookingService.list(filters);
      setBookings(res.items || []);
    } catch {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const handleCreate = async () => {
    if (!formData.creatorId.trim() || !formData.title.trim() || !formData.startDate || !formData.endDate) return;
    setCreating(true);
    setError(null);
    try {
      const data: CreateBookingData = {
        creatorId: formData.creatorId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        timezone: formData.timezone,
        price: Number(formData.price) || 0,
        currency: formData.currency,
      };
      if (formData.location.trim()) data.location = formData.location;
      if (formData.notes.trim()) data.notes = formData.notes;
      const created = await bookingService.create(data);
      setBookings(prev => [created, ...prev]);
      setShowCreate(false);
      setFormData({
        creatorId: '', type: 'CONTENT_CREATION', title: '', description: '',
        startDate: '', endDate: '', timezone: 'Africa/Nairobi',
        location: '', price: '', currency: 'KES', notes: '',
      });
    } catch {
      setError('Failed to create booking.');
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage your content creation bookings and calendar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/bookings/calendar')}>
            <Calendar className="h-4 w-4 mr-2" /> Calendar
          </Button>
          <Button onClick={() => setShowCreate(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New Booking
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-2">
        {(['', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-brand-blue text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No bookings found. Click "New Booking" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(booking => (
            <Card
              key={booking.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
            >
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold">{booking.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{typeLabels[booking.type]}</p>
                  </div>
                  <StatusBadge variant={(statusVariants[booking.status] as any) || 'default'} size="sm">
                    {booking.status}
                  </StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{booking.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDate(booking.startDate)}
                  </span>
                  {booking.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {booking.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {formatCurrency(booking.price, booking.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Booking</CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowCreate(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Creator ID</label>
                <Input
                  value={formData.creatorId}
                  onChange={e => setFormData({ ...formData, creatorId: e.target.value })}
                  placeholder="Enter creator user ID..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as BookingType })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="CONTENT_CREATION">Content Creation</option>
                  <option value="CAMPAIGN_SHOOT">Campaign Shoot</option>
                  <option value="MEETING">Meeting</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Booking title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the booking..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  >
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location (optional)</label>
                <Input
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nairobi, Kenya"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !formData.creatorId.trim() || !formData.title.trim() || !formData.startDate || !formData.endDate}
                  leftIcon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {creating ? 'Creating...' : 'Create Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
