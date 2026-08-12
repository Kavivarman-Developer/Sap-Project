import { services } from '../data/spaData.js';
import { ServiceModel, type ServiceDocument } from '../models/Service.js';
import { isDatabaseConnected } from './databaseService.js';
import type { SpaService } from '../types/spa.js';

const toApiService = (service: ServiceDocument): SpaService => ({
  id: service.slug,
  name: service.name,
  durationMinutes: service.durationMinutes,
  price: service.price,
  priceLabel: service.priceLabel,
  mood: service.mood,
});

export const getServices = async () => {
  if (!isDatabaseConnected) {
    return services;
  }

  const serviceOrder = new Map(services.map((service, index) => [service.id, index]));
  const storedServices = await ServiceModel.find({ slug: { $in: services.map((service) => service.id) } })
    .lean()
    .then((items) =>
      items.sort(
        (first, second) =>
          (serviceOrder.get(first.slug) ?? Number.MAX_SAFE_INTEGER) -
          (serviceOrder.get(second.slug) ?? Number.MAX_SAFE_INTEGER),
      ),
    );

  return storedServices.map(toApiService);
};
