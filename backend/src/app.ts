import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { bookingRoutes } from './routes/bookingRoutes.js';
import { leadRoutes } from './routes/leadRoutes.js';
import { serviceRoutes } from './routes/serviceRoutes.js';
import { slotRoutes } from './routes/slotRoutes.js';
import { isDatabaseConnected } from './services/databaseService.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
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

  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/slots', slotRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/leads', leadRoutes);

  app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
    void next;
    console.error(error);
    response.status(500).json({ message: 'Something went wrong.' });
  });

  return app;
};
