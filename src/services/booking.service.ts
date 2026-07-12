import { apiClient } from '../lib/api-client';
import {
  Booking,
  BookingListResponse,
  CreateBookingData,
  UpdateBookingStatusData,
  RescheduleBookingData,
  CalendarData,
  CalendarResponse,
  BookingStatus,
} from '../types/api-contracts/booking.types';

export const bookingService = {
  async create(data: CreateBookingData): Promise<Booking> {
    return apiClient.post('/bookings/create', data);
  },

  async list(filters?: { status?: BookingStatus; page?: number; limit?: number }): Promise<BookingListResponse> {
    return apiClient.post('/bookings/list', filters ?? { page: 1, limit: 20 });
  },

  async get(bookingId: string): Promise<Booking> {
    return apiClient.post('/bookings/get', { bookingId });
  },

  async updateStatus(data: UpdateBookingStatusData): Promise<Booking> {
    return apiClient.post('/bookings/status/update', data);
  },

  async reschedule(data: RescheduleBookingData): Promise<Booking> {
    return apiClient.post('/bookings/reschedule', data);
  },

  async calendar(data: CalendarData): Promise<CalendarResponse> {
    return apiClient.post('/bookings/calendar', data);
  },
};
