import mongoose from 'mongoose';
import type { BookingStatus } from '../types/spa.js';

export type BookingDocument = {
  bookingId: string;
  serviceId: string;
  date: string;
  slotId: string;
  customerName: string;
  phone: string;
  email: string;
  gender: string;
  notes: string;
  status: BookingStatus;
  createdAt: Date;
  confirmedAt?: Date;
};

const bookingSchema = new mongoose.Schema<BookingDocument>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    serviceId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    slotId: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    gender: { type: String, required: true, enum: ['female', 'male', 'other'] },
    notes: { type: String, default: '', trim: true },
    status: { type: String, required: true, enum: ['pending', 'confirmed'], default: 'pending' },
    createdAt: { type: Date, required: true, default: Date.now },
    confirmedAt: { type: Date },
  },
  { versionKey: false },
);

bookingSchema.index({ serviceId: 1, date: 1, slotId: 1 }, { unique: true });

export const BookingModel = mongoose.model<BookingDocument>('Booking', bookingSchema);

