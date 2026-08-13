import dotenv from 'dotenv';

dotenv.config();

const defaultClientOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const clientOrigins = (process.env.CLIENT_ORIGIN ?? defaultClientOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  clientOrigins,
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME ?? 'kavi-dall-spa',
  adminEmail: process.env.ADMIN_EMAIL ?? 'priya06kavi04@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
  authSecret: process.env.AUTH_SECRET ?? 'change-this-secret',
  businessWhatsapp: process.env.BUSINESS_WHATSAPP ?? '919626847595',
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? 'Kavi Dall Spa <onboarding@resend.dev>',
  whatsappToken: process.env.WHATSAPP_TOKEN,
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
};
