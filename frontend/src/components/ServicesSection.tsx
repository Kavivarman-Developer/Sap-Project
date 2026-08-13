import { useState } from 'react';
import { ArrowRight, Clock3, Phone } from 'lucide-react';
import spa1 from '../assets/spa1.jpg';
import spa4 from '../assets/spa4.jpg';
import spa5 from '../assets/spa5.jpg';
import spa6 from '../assets/spa6.jpg';
import spa8 from '../assets/spa8.jpg';
import spa9 from '../assets/spa9.jpg';
import spa10 from '../assets/spa10.jpg';
import spa11 from '../assets/spa11.jpg';
import spa12 from '../assets/spa12.jpg';
import spa13 from '../assets/spa13.jpg';
import spa14 from '../assets/spa14.jpg';

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

const serviceImages: Record<string, { image: string; position: string }> = {
  'thai-massage': { image: spa1, position: 'object-left-top' },
  'aroma-therapy': { image: spa4, position: 'object-center' },
  'swedish-massage': { image: spa5, position: 'object-right-top' },
  'deep-tissue-massage': { image: spa6, position: 'object-center' },
  'balinese-massage': { image: spa8, position: 'object-top' },
  'body-scrub-therapy': { image: spa9, position: 'object-bottom' },
  'foot-reflexology': { image: spa10, position: 'object-left' },
  'couples-therapy': { image: spa11, position: 'object-right' },
  'facial-treatment': { image: spa12, position: 'object-bottom' },
  'steam-sauna': { image: spa13, position: 'object-left' },
  'hot-stone-ritual': { image: spa14, position: 'object-center' },
};

const contactPhone = '9626847595';

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

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  const serviceImage = serviceImages[service.id] ?? serviceImages['thai-massage'];
  const selectService = () => onSelectService(service.id);

  return (
    <article
      className={`group overflow-hidden rounded-lg border text-left transition hover:-translate-y-1 ${
        isSelected
          ? 'border-[#A5CF83] bg-white text-[#10240c] shadow-[0_26px_70px_rgba(165,207,131,0.28)] ring-2 ring-[#A5CF83]/28'
          : 'border-[#A5CF83]/24 bg-white text-[#263a20] shadow-[0_18px_48px_rgba(95,142,67,0.1)] hover:border-[#A5CF83]/70'
      }`}
      onClick={selectService}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectService();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#263a20]">
        <img
          alt={service.name}
          className={`h-full w-full ${serviceImage?.position ?? 'object-center'} object-cover transition duration-700 group-hover:scale-105`}
          src={serviceImage?.image}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1308]/10 via-transparent to-[#1d1308]/50" />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-black">{service.name}</h3>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[#304628]/72">{service.mood}</p>
        <p className="mt-4 inline-flex rounded-full bg-[#F8FFF3] px-4 py-2 text-sm font-black text-[#5F8E43] ring-1 ring-[#A5CF83]/30">
          {service.priceLabel ?? formatPrice(service.price)}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm font-black">
          <span className="inline-flex items-center gap-2 text-[#304628]/80">
            <Clock3 className="h-4 w-4 text-[#D09D2F]" />
            {service.durationMinutes} min
          </span>
          <a
            className="inline-flex items-center gap-2 rounded-full border border-[#E5C77E] bg-[#FFF9EC] px-4 py-2 text-[#C9972D] transition hover:bg-[#FFF3D5]"
            href={`tel:+91${contactPhone}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
          <button
            className="inline-flex items-center gap-1 text-[#263a20] transition hover:text-[#5F8E43]"
            onClick={(event) => {
              event.stopPropagation();
              selectService();
              window.location.hash = 'booking';
            }}
            type="button"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
