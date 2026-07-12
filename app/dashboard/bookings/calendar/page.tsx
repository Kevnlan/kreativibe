'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Button, Card, CardContent, StatusBadge } from '@/components/ui';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types/api-contracts/booking.types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const statusVariants: Record<BookingStatus, string> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  DECLINED: 'error',
  IN_PROGRESS: 'default',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingsCalendarPage() {
  const router = useRouter();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCalendar();
  }, [month, year]);

  const loadCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.calendar({ month, year });
      setBookings(res.bookings || []);
    } catch {
      setError('Failed to load calendar.');
    } finally {
      setLoading(false);
    }
  };

  const bookingsByDay = useMemo(() => {
    const map: Record<number, Booking[]> = {};
    for (const b of bookings) {
      const day = new Date(b.startDate).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(b);
    }
    return map;
  }, [bookings]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isToday = (day: number) => {
    const t = new Date();
    return day === t.getDate() && month === t.getMonth() + 1 && year === t.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">View your bookings by month</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/bookings')}>
          List View
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Card>
        <CardContent className="pt-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">{monthNames[month - 1]} {year}</h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading calendar...
            </div>
          ) : (
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px]" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayBookings = bookingsByDay[day] || [];
                  return (
                    <div
                      key={day}
                      className={cn(
                        'min-h-[100px] border rounded-lg p-1.5 overflow-hidden',
                        isToday(day) ? 'border-brand-blue border-2' : 'border-border'
                      )}
                    >
                      <p className={cn(
                        'text-xs font-medium mb-1',
                        isToday(day) ? 'text-brand-blue' : 'text-muted-foreground'
                      )}>
                        {day}
                      </p>
                      <div className="space-y-1">
                        {dayBookings.slice(0, 3).map(b => (
                          <button
                            key={b.id}
                            onClick={() => router.push(`/dashboard/bookings/${b.id}`)}
                            className="w-full text-left p-1 rounded text-xs bg-muted hover:bg-muted/70 transition-colors truncate"
                          >
                            {b.title}
                          </button>
                        ))}
                        {dayBookings.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{dayBookings.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bookings List Below Calendar */}
              {bookings.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-sm">All bookings this month</h3>
                  {bookings.map(b => (
                    <button
                      key={b.id}
                      onClick={() => router.push(`/dashboard/bookings/${b.id}`)}
                      className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium">{b.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' at '}
                          {new Date(b.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <StatusBadge variant={(statusVariants[b.status] as any) || 'default'} size="sm">
                        {b.status}
                      </StatusBadge>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
