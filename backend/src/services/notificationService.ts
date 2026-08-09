import { env } from '../config/env.js';
import type { BookingWithSummary } from '../types/spa.js';

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('91') ? digits : `91${digits}`;
};

const buildMessage = (booking: BookingWithSummary) =>
  `Hi ${booking.customerName}, your Kavi Dall Spa appointment ${booking.id} is confirmed for ${booking.summary.serviceName} on ${booking.date} at ${booking.summary.slotLabel}. Therapist: ${booking.summary.therapist}.`;

export const getBusinessWhatsappUrl = (message = 'Hi, I want to book a spa appointment.') =>
  `https://wa.me/${env.businessWhatsapp}?text=${encodeURIComponent(message)}`;

export const sendConfirmationNotifications = async (booking: BookingWithSummary) => {
  const message = buildMessage(booking);
  const results = {
    email: 'not-configured',
    whatsapp: 'not-configured',
    whatsappUrl: `https://wa.me/${normalizePhone(booking.phone)}?text=${encodeURIComponent(message)}`,
  };

  if (env.resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.resendFromEmail,
        to: booking.email,
        subject: `Appointment confirmed - ${booking.id}`,
        text: message,
      }),
    });
    results.email = response.ok ? 'sent' : 'failed';
  }

  if (env.whatsappToken && env.whatsappPhoneNumberId) {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${env.whatsappPhoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizePhone(booking.phone),
          type: 'text',
          text: { body: message },
        }),
      },
    );
    results.whatsapp = response.ok ? 'sent' : 'failed';
  }

  return results;
};

