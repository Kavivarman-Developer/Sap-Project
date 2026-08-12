import { Router } from 'express';
import {
  confirmBookingById,
  createBooking,
  listBookings,
  searchBookingHistory,
} from '../controllers/bookingController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const bookingRoutes = Router();

bookingRoutes.get('/', requireAdmin, asyncHandler(listBookings));
bookingRoutes.get('/history', requireAdmin, asyncHandler(searchBookingHistory));
bookingRoutes.post('/', asyncHandler(createBooking));
bookingRoutes.patch('/:bookingId/confirm', requireAdmin, asyncHandler(confirmBookingById));
