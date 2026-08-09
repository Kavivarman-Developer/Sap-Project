import type { Request, Response } from 'express';
import { getServices } from '../services/serviceService.js';

export const listServices = async (_request: Request, response: Response) => {
  const availableServices = await getServices();
  response.status(200).json({ services: availableServices });
};

