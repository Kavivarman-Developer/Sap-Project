import { services } from '../data/spaData.js';
import { ServiceModel, type ServiceDocument } from '../models/Service.js';
import { isDatabaseConnected } from './databaseService.js';
import type { SpaService } from '../types/spa.js';

const toApiService = (service: ServiceDocument): SpaService => ({
  id: service.slug,
  name: service.name,
  durationMinutes: service.durationMinutes,
  price: service.price,
  mood: service.mood,
});

export const getServices = async () => {
  if (!isDatabaseConnected) {
    return services;
  }

  const storedServices = await ServiceModel.find().sort({ price: 1 }).lean();
  return storedServices.map(toApiService);
};

