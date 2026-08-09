import type { SpaService, TimeSlot } from '../types/spa.js';

export const services: SpaService[] = [
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

export const timeSlots: TimeSlot[] = [
  { id: '09-00', label: '09:00 AM', therapist: 'Maya' },
  { id: '10-30', label: '10:30 AM', therapist: 'Anika' },
  { id: '12-00', label: '12:00 PM', therapist: 'Leah' },
  { id: '14-30', label: '02:30 PM', therapist: 'Maya' },
  { id: '16-00', label: '04:00 PM', therapist: 'Anika' },
  { id: '17-30', label: '05:30 PM', therapist: 'Leah' },
];

