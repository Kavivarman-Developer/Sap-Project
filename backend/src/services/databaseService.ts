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

