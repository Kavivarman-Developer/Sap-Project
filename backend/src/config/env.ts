import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
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
