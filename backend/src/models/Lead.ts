import mongoose from 'mongoose';

export type LeadDocument = {
  leadId: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  totalBookings: number;
  lastBookingDate: string;
  createdAt: Date;
  updatedAt: Date;
};

const leadSchema = new mongoose.Schema<LeadDocument>(
  {
    leadId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    gender: { type: String, required: true, enum: ['female', 'male', 'other'] },
    totalBookings: { type: Number, required: true, default: 1 },
    lastBookingDate: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

leadSchema.index({ email: 1, phone: 1 }, { unique: true });

export const LeadModel = mongoose.model<LeadDocument>('Lead', leadSchema);

