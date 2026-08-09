import { timeSlots } from '../data/spaData.js';
import { BookingModel, type BookingDocument } from '../models/Booking.js';
import type { Booking, BookingWithSummary, Pagination } from '../types/spa.js';
import { isDatabaseConnected } from './databaseService.js';
import { upsertLeadFromBooking } from './leadService.js';
import { getServices } from './serviceService.js';

const memoryBookings: Booking[] = [];
const clampPage = (value: number) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 1);
const clampPageSize = (value: number) =>
  Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 50) : 10;

const toApiBooking = (booking: BookingDocument): Booking => ({
  id: booking.bookingId,
  serviceId: booking.serviceId,
  date: booking.date,
  slotId: booking.slotId,
  customerName: booking.customerName,
  phone: booking.phone,
  email: booking.email,
  gender: booking.gender,
  notes: booking.notes,
  status: booking.status,
  createdAt: booking.createdAt.toISOString(),
  confirmedAt: booking.confirmedAt?.toISOString(),
});

export const isSlotBooked = async (serviceId: string, date: string, slotId: string) => {
  if (!isDatabaseConnected) {
    return memoryBookings.some(
      (booking) =>
        booking.serviceId === serviceId && booking.date === date && booking.slotId === slotId,
    );
  }

  const existingBooking = await BookingModel.exists({ serviceId, date, slotId });
  return existingBooking !== null;
};

export const saveBooking = async (booking: Booking) => {
  if (!isDatabaseConnected) {
    memoryBookings.push(booking);
    await upsertLeadFromBooking(booking);
    return booking;
  }

  const createdBooking = await BookingModel.create({
    bookingId: booking.id,
    serviceId: booking.serviceId,
    date: booking.date,
    slotId: booking.slotId,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    gender: booking.gender,
    notes: booking.notes,
    status: booking.status,
    createdAt: new Date(booking.createdAt),
  });

  const savedBooking = toApiBooking(createdBooking.toObject());
  await upsertLeadFromBooking(savedBooking);
  return savedBooking;
};

export const listBookings = async (date?: string) => {
  if (!isDatabaseConnected) {
    return [...memoryBookings]
      .filter((booking) => (date ? booking.date === date : true))
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }

  const storedBookings = await BookingModel.find(date ? { date } : {}).sort({ createdAt: -1 }).lean();
  return storedBookings.map(toApiBooking);
};

export const listBookingsPage = async (options: {
  date?: string;
  page: number;
  pageSize: number;
}) => {
  const page = clampPage(options.page);
  const pageSize = clampPageSize(options.pageSize);

  if (!isDatabaseConnected) {
    const filteredBookings = await listBookings(options.date);
    const total = filteredBookings.length;
    const bookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);
    const pagination: Pagination = {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };

    return { bookings, pagination };
  }

  const query = options.date ? { date: options.date } : {};
  const total = await BookingModel.countDocuments(query);
  const storedBookings = await BookingModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  const pagination: Pagination = {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };

  return { bookings: storedBookings.map(toApiBooking), pagination };
};

export const getBookingById = async (bookingId: string) => {
  if (!isDatabaseConnected) {
    return memoryBookings.find((booking) => booking.id === bookingId) ?? null;
  }

  const booking = await BookingModel.findOne({ bookingId }).lean();
  return booking ? toApiBooking(booking) : null;
};

export const confirmBooking = async (bookingId: string) => {
  const confirmedAt = new Date().toISOString();

  if (!isDatabaseConnected) {
    const booking = memoryBookings.find((item) => item.id === bookingId);
    if (!booking) {
      return null;
    }

    booking.status = 'confirmed';
    booking.confirmedAt = confirmedAt;
    return booking;
  }

  const booking = await BookingModel.findOneAndUpdate(
    { bookingId },
    { $set: { status: 'confirmed', confirmedAt: new Date(confirmedAt) } },
    { new: true },
  ).lean();

  return booking ? toApiBooking(booking) : null;
};

export const withSummary = async (booking: Booking): Promise<BookingWithSummary> => {
  const availableServices = await getServices();
  const service = availableServices.find((item) => item.id === booking.serviceId);
  const slot = timeSlots.find((item) => item.id === booking.slotId);

  return {
    ...booking,
    summary: {
      serviceName: service?.name ?? booking.serviceId,
      slotLabel: slot?.label ?? booking.slotId,
      therapist: slot?.therapist ?? 'Not assigned',
    },
  };
};

export const listBookingsWithSummary = async (options: {
  date?: string;
  page: number;
  pageSize: number;
}) => {
  const bookingPage = await listBookingsPage(options);
  const bookings = await Promise.all(bookingPage.bookings.map(withSummary));
  return { bookings, pagination: bookingPage.pagination };
};
