import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './services/databaseService.js';

void connectDatabase()
  .catch((error: unknown) => {
    console.error('MongoDB connection failed. Falling back to in-memory storage.', error);
  })
  .finally(() => {
    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Kavi Dall spa API listening on port ${env.port}`);
    });
  });
