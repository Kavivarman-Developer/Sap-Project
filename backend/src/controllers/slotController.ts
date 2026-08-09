import type { Request, Response } from 'express';
import { timeSlots } from '../data/spaData.js';
import { isSlotBooked } from '../services/bookingService.js';
import { getServices } from '../services/serviceService.js';
import { getQueryValue } from '../utils/query.js';

export const listSlots = async (request: Request, response: Response) => {
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
};

