import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export type ServiceCard = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  priceLabel?: string;
  mood: string;
};

type ServicesSectionProps = {
  services: ServiceCard[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export function ServicesSection({
  services,
  selectedServiceId,
  onSelectService,
}: ServicesSectionProps) {
  const visibleCount = 4;
  const [showAllServices, setShowAllServices] = useState(false);
  const visibleServices = showAllServices ? services : services.slice(0, visibleCount);
  const hasMoreServices = services.length > visibleCount;

  return (
    <section
      className="bg-[linear-gradient(180deg,#F8FFF3_0%,#EEF8E8_100%)] py-16"
      id="services"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43]">
            Our services
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Choose your ritual</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#304628]/75">
            Relax your body with our signature full body massage that relieves stress, improves
            blood circulation, and gives complete relaxation.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map((service) => (
            <ServiceButton
              isSelected={selectedServiceId === service.id}
              key={service.id}
              onSelectService={onSelectService}
              service={service}
            />
          ))}
        </div>

        {hasMoreServices ? (
          <div className="mt-9 flex justify-center">
            <button
              className="rounded-full border border-[#A5CF83]/55 bg-white px-7 py-3 text-xs font-black uppercase tracking-wide text-[#304628] shadow-[0_14px_34px_rgba(95,142,67,0.12)] transition hover:border-[#5F8E43] hover:bg-[#F2FBEA]"
              onClick={() => setShowAllServices((current) => !current)}
              type="button"
            >
              {showAllServices ? 'Show Less' : 'View All'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type ServiceButtonProps = {
  service: ServiceCard;
  isSelected: boolean;
  onSelectService: (serviceId: string) => void;
};

function ServiceButton({ service, isSelected, onSelectService }: ServiceButtonProps) {
  return (
    <button
      className={`rounded-lg border p-5 text-left transition hover:-translate-y-1 ${
        isSelected
          ? 'border-[#F0FFE6] bg-gradient-to-br from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] text-[#10240c] shadow-[0_24px_60px_rgba(165,207,131,0.24)]'
          : 'border-[#A5CF83]/30 bg-white text-[#263a20] shadow-[0_18px_48px_rgba(95,142,67,0.1)] hover:border-[#A5CF83]/70'
      }`}
      onClick={() => onSelectService(service.id)}
      type="button"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4fff0] text-[#1f4a19]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
      <p className="mt-2 min-h-10 text-sm opacity-75">{service.mood}</p>
      <div className="mt-5 flex items-center justify-between gap-4 text-sm font-black">
        <span>{service.durationMinutes} min</span>
        <span>{service.priceLabel ?? formatPrice(service.price)}</span>
      </div>
    </button>
  );
}
