export type BookingType = 'CONTENT_CREATION' | 'CAMPAIGN_SHOOT' | 'MEETING' | 'OTHER';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  creatorId: string;
  brandId: string;
  type: BookingType;
  title: string;
  description: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
  price: number;
  currency: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingListResponse {
  items: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookingData {
  creatorId: string;
  type: BookingType;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
  price: number;
  currency: string;
  notes?: string;
}

export interface UpdateBookingStatusData {
  bookingId: string;
  status: BookingStatus;
  cancellationReason?: string;
}

export interface RescheduleBookingData {
  bookingId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CalendarData {
  month: number;
  year: number;
}

export interface CalendarResponse {
  bookings: Booking[];
}
