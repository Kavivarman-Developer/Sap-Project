export type SpaService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  priceLabel?: string;
  mood: string;
};

export type TimeSlot = {
  id: string;
  label: string;
  therapist: string;
};

export type BookingStatus = 'pending' | 'confirmed';

export type Booking = {
  id: string;
  serviceId: string;
  date: string;
  slotId: string;
  customerName: string;
  phone: string;
  email: string;
  gender: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  confirmedAt?: string;
};

export type BookingSummary = {
  serviceName: string;
  slotLabel: string;
  therapist: string;
};

export type BookingWithSummary = Booking & {
  summary: BookingSummary;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  totalBookings: number;
  lastBookingDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
