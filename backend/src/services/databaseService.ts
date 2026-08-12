import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { services } from '../data/spaData.js';
import { ServiceModel } from '../models/Service.js';

export let isDatabaseConnected = false;

export const connectDatabase = async () => {
  if (!env.mongoUri) {
    console.log('MongoDB URI not set. Using in-memory booking storage.');
    return;
  }

  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDbName,
    serverSelectionTimeoutMS: 15000,
  });

  await Promise.all(
    services.map((service) =>
      ServiceModel.updateOne(
        { slug: service.id },
        {
          $set: {
            name: service.name,
            durationMinutes: service.durationMinutes,
            price: service.price,
            priceLabel: service.priceLabel,
            mood: service.mood,
          },
          $setOnInsert: {
            slug: service.id,
          },
        },
        { upsert: true },
      ),
    ),
  );

  isDatabaseConnected = true;
  console.log('MongoDB connected. Bookings will be stored in the database.');
};
