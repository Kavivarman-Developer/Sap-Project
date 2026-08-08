import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

type SpaService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  mood: string;
};

type TimeSlot = {
  id: string;
  label: string;
  therapist: string;
};

type Booking = {
  id: string;
  serviceId: string;
  date: string;
  slotId: string;
  customerName: string;
  phone: string;
  gender: string;
  notes: string;
  createdAt: string;
};

type ServiceDocument = {
  slug: string;
  name: string;
  durationMinutes: number;
  price: number;
  mood: string;
};

type BookingDocument = {
  bookingId: string;
  serviceId: string;
  date: string;
  slotId: string;
  customerName: string;
  phone: string;
  gender: string;
  notes: string;
  createdAt: Date;
};

const services: SpaService[] = [
  {
    id: 'aroma-therapy',
    name: 'Aroma Therapy',
    durationMinutes: 60,
    price: 2999,
    mood: 'Calming oils and gentle pressure',
  },
  {
    id: 'hot-stone-ritual',
    name: 'Hot Stone Ritual',
    durationMinutes: 90,
    price: 4499,
    mood: 'Warm basalt stones for deep release',
  },
  {
    id: 'couple-retreat',
    name: 'Couple Retreat',
    durationMinutes: 120,
    price: 6999,
    mood: 'Private suite with synchronized care',
  },
  {
    id: 'glow-facial',
    name: 'Glow Facial',
    durationMinutes: 45,
    price: 2499,
    mood: 'Brightening cleanse and facial massage',
  },
];

const timeSlots: TimeSlot[] = [
  { id: '09-00', label: '09:00 AM', therapist: 'Maya' },
  { id: '10-30', label: '10:30 AM', therapist: 'Anika' },
  { id: '12-00', label: '12:00 PM', therapist: 'Leah' },
  { id: '14-30', label: '02:30 PM', therapist: 'Maya' },
  { id: '16-00', label: '04:00 PM', therapist: 'Anika' },
  { id: '17-30', label: '05:30 PM', therapist: 'Leah' },
];

const memoryBookings: Booking[] = [];

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

const bookingSchemaDefinition = new mongoose.Schema<BookingDocument>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    serviceId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    slotId: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ['female', 'male', 'other'] },
    notes: { type: String, default: '', trim: true },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false },
);

bookingSchemaDefinition.index({ serviceId: 1, date: 1, slotId: 1 }, { unique: true });

const ServiceModel = mongoose.model<ServiceDocument>('Service', serviceSchema);
const BookingModel = mongoose.model<BookingDocument>('Booking', bookingSchemaDefinition);

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotId: z.string().min(1),
  customerName: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  gender: z.enum(['female', 'male', 'other']),
  notes: z.string().max(300).optional().default(''),
});

let isDatabaseConnected = false;

const getQueryValue = (value: Request['query'][string]) => (typeof value === 'string' ? value : '');

const toApiService = (service: ServiceDocument): SpaService => ({
  id: service.slug,
  name: service.name,
  durationMinutes: service.durationMinutes,
  price: service.price,
  mood: service.mood,
});

const toApiBooking = (booking: BookingDocument): Booking => ({
  id: booking.bookingId,
  serviceId: booking.serviceId,
  date: booking.date,
  slotId: booking.slotId,
  customerName: booking.customerName,
  phone: booking.phone,
  gender: booking.gender,
  notes: booking.notes,
  createdAt: booking.createdAt.toISOString(),
});

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('MongoDB URI not set. Using in-memory booking storage.');
    return;
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME ?? 'kavi-dall-spa',
  });

  await Promise.all(
    services.map((service) =>
      ServiceModel.updateOne(
        { slug: service.id },
        {
          $setOnInsert: {
            slug: service.id,
            name: service.name,
            durationMinutes: service.durationMinutes,
            price: service.price,
            mood: service.mood,
          },
        },
        { upsert: true },
      ),
    ),
  );

  isDatabaseConnected = true;
  console.log('MongoDB connected. Bookings will be stored in the database.');
};

const getServices = async () => {
  if (!isDatabaseConnected) {
    return services;
  }

  const storedServices = await ServiceModel.find().sort({ price: 1 }).lean();
  return storedServices.map(toApiService);
};

const isSlotBooked = async (serviceId: string, date: string, slotId: string) => {
  if (!isDatabaseConnected) {
    return memoryBookings.some(
      (booking) =>
        booking.serviceId === serviceId && booking.date === date && booking.slotId === slotId,
    );
  }

  const existingBooking = await BookingModel.exists({ serviceId, date, slotId });
  return existingBooking !== null;
};

const saveBooking = async (booking: Booking) => {
  if (!isDatabaseConnected) {
    memoryBookings.push(booking);
    return booking;
  }

  const createdBooking = await BookingModel.create({
    bookingId: booking.id,
    serviceId: booking.serviceId,
    date: booking.date,
    slotId: booking.slotId,
    customerName: booking.customerName,
    phone: booking.phone,
    gender: booking.gender,
    notes: booking.notes,
    createdAt: new Date(booking.createdAt),
  });

  return toApiBooking(createdBooking.toObject());
};

const listBookings = async () => {
  if (!isDatabaseConnected) {
    return [...memoryBookings].sort((first, second) =>
      second.createdAt.localeCompare(first.createdAt),
    );
  }

  const storedBookings = await BookingModel.find().sort({ createdAt: -1 }).lean();
  return storedBookings.map(toApiBooking);
};

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'kavi-dall-spa-api',
    database: isDatabaseConnected ? 'connected' : 'memory',
  });
});

app.get('/api/services', (_request: Request, response: Response) => {
  void (async () => {
    const availableServices = await getServices();
    response.status(200).json({ services: availableServices });
  })().catch((error: unknown) => {
    console.error(error);
    response.status(500).json({ message: 'Unable to load services.' });
  });
});

app.get('/api/slots', (request: Request, response: Response) => {
  void (async () => {
    const serviceId = getQueryValue(request.query.serviceId);
    const date = getQueryValue(request.query.date);
    const availableServices = await getServices();
    const serviceExists = availableServices.some((service) => service.id === serviceId);

    if (!serviceExists || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      response.status(400).json({ message: 'Choose a valid service and date.' });
      return;
    }

    const slots = await Promise.all(
      timeSlots.map(async (slot) => ({
        ...slot,
        available: !(await isSlotBooked(serviceId, date, slot.id)),
      })),
    );

    response.status(200).json({ slots });
  })().catch((error: unknown) => {
    console.error(error);
    response.status(500).json({ message: 'Unable to load slots.' });
  });
});

app.get('/api/bookings', (_request: Request, response: Response) => {
  void (async () => {
    const bookingList = await listBookings();
    const availableServices = await getServices();

    const bookingsWithSummary = bookingList.map((booking) => {
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
    });

    response.status(200).json({ bookings: bookingsWithSummary });
  })().catch((error: unknown) => {
    console.error(error);
    response.status(500).json({ message: 'Unable to load bookings.' });
  });
});

app.post('/api/bookings', (request: Request, response: Response) => {
  void (async () => {
    const result = bookingSchema.safeParse(request.body);

    if (!result.success) {
      response.status(400).json({ message: 'Please check your booking details.' });
      return;
    }

    const availableServices = await getServices();
    const service = availableServices.find((item) => item.id === result.data.serviceId);
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
  })().catch((error: unknown) => {
    console.error(error);
    response.status(500).json({ message: 'Unable to confirm booking.' });
  });
});

void connectDatabase()
  .catch((error: unknown) => {
    console.error('MongoDB connection failed. Falling back to in-memory storage.', error);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Kavi Dall spa API listening on port ${port}`);
    });
  });
