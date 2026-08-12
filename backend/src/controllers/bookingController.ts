import type { Request, Response } from 'express';
import { z } from 'zod';
import { services, timeSlots } from '../data/spaData.js';
import {
  confirmBooking,
  isSlotBooked,
  listBookingsWithSummary,
  saveBooking,
  searchBookingsWithSummary,
  withSummary,
} from '../services/bookingService.js';
import { sendConfirmationNotifications } from '../services/notificationService.js';
import { getServices } from '../services/serviceService.js';
import type { Booking } from '../types/spa.js';

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotId: z.string().min(1),
  customerName: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  email: z.email(),
  gender: z.enum(['female', 'male', 'other']),
  notes: z.string().max(300).optional().default(''),
});

const getPositiveNumber = (value: unknown, fallback: number) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const listBookings = async (request: Request, response: Response) => {
  const date = typeof request.query.date === 'string' ? request.query.date : undefined;
  const page = getPositiveNumber(request.query.page, 1);
  const pageSize = getPositiveNumber(request.query.pageSize, 10);
  const result = await listBookingsWithSummary({ date, page, pageSize });
  response.status(200).json(result);
};

export const searchBookingHistory = async (request: Request, response: Response) => {
  const query = typeof request.query.query === 'string' ? request.query.query : '';
  const page = getPositiveNumber(request.query.page, 1);
  const pageSize = getPositiveNumber(request.query.pageSize, 10);

  if (!query.trim()) {
    response.status(400).json({ message: 'Enter a name, email, or phone number to search.' });
    return;
  }

  const result = await searchBookingsWithSummary({ query, page, pageSize });
  response.status(200).json(result);
};

export const createBooking = async (request: Request, response: Response) => {
  const result = bookingSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({ message: 'Please check your booking details.' });
    return;
  }

  const availableServices = await getServices();
  const service =
    availableServices.find((item) => item.id === result.data.serviceId) ??
    services.find((item) => item.id === result.data.serviceId);
  const slot = timeSlots.find((item) => item.id === result.data.slotId);

  if (!service || !slot) {
    response.status(404).json({ message: 'Selected service or slot was not found.' });
    return;
  }

  if (await isSlotBooked(result.data.serviceId, result.data.date, result.data.slotId)) {
    response.status(409).json({ message: 'This slot is already booked. Pick another time.' });
    return;
  }

  const booking: Booking = {
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    ...result.data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const savedBooking = await saveBooking(booking);

  response.status(201).json({
    booking: savedBooking,
    summary: {
      serviceName: service.name,
      slotLabel: slot.label,
      therapist: slot.therapist,
    },
  });
};

export const confirmBookingById = async (request: Request, response: Response) => {
  const bookingId = request.params.bookingId;

  if (typeof bookingId !== 'string' || !bookingId) {
    response.status(400).json({ message: 'Booking id is required.' });
    return;
  }

  const booking = await confirmBooking(bookingId);

  if (!booking) {
    response.status(404).json({ message: 'Booking was not found.' });
    return;
  }

  const bookingWithSummary = await withSummary(booking);
  const notifications = await sendConfirmationNotifications(bookingWithSummary);

  response.status(200).json({ booking: bookingWithSummary, notifications });
};
