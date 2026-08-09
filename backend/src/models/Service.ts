import mongoose from 'mongoose';

export type ServiceDocument = {
  slug: string;
  name: string;
  durationMinutes: number;
  price: number;
  mood: string;
};

const serviceSchema = new mongoose.Schema<ServiceDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 15 },
    price: { type: Number, required: true, min: 0 },
    mood: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const ServiceModel = mongoose.model<ServiceDocument>('Service', serviceSchema);

