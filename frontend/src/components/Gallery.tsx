import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Droplets,
  Flower2,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import galleryImage from '../assets/spa-gallery.png';
import heroImage from '../assets/spa-hero.png';

type GalleryProps = {
  onBack: () => void;
};

const galleryItems = [
  {
    title: 'Ocean calm suite',
    category: 'Treatment Room',
    image: galleryImage,
    className: 'md:col-span-2 md:row-span-2',
    position: 'object-left',
  },
  {
    title: 'Hydro ritual bowls',
    category: 'Water Therapy',
    image: galleryImage,
    className: '',
    position: 'object-right',
  },
  {
    title: 'Pearl towel setup',
    category: 'Service Detail',
    image: galleryImage,
    className: '',
    position: 'object-bottom',
  },
  {
    title: 'Private treatment room',
    category: 'Signature Suite',
    image: heroImage,
    className: 'md:col-span-2',
    position: 'object-center',
  },
  {
    title: 'Skincare essentials',
    category: 'Products',
    image: galleryImage,
    className: '',
    position: 'object-top',
  },
  {
    title: 'Aqua wellness textures',
    category: 'Ambience',
    image: galleryImage,
    className: '',
    position: 'object-center',
  },
];

const galleryHighlights = [
  {
    title: 'Curated visual mood',
    copy: 'Aqua, pearl, teal, and soft lavender accents keep the spa feeling premium and fresh.',
    icon: Sparkles,
  },
  {
    title: 'Hydro-inspired details',
    copy: 'Water bowls, clean glass, and gentle blue tones make the appointment experience calmer.',
    icon: Droplets,
  },
  {
    title: 'Prepared treatment spaces',
    copy: 'Every gallery view focuses on readiness, comfort, and polished service details.',
    icon: Flower2,
  },
];

const filters = ['All', 'Treatment Room', 'Water Therapy', 'Products', 'Ambience'];

export function Gallery({ onBack }: GalleryProps) {
  return (
    <main className="min-h-screen bg-[#F8FFF3] text-[#162312]">
      <nav className="sticky top-0 z-30 border-b border-[#A5CF83]/30 bg-[#FBFFF7]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <button
            className="flex items-center gap-2 rounded-full border border-[#A5CF83]/40 bg-white px-4 py-2 text-sm font-bold text-[#304628] shadow-[0_10px_24px_rgba(95,142,67,0.12)] transition hover:border-[#5F8E43] hover:bg-[#F2FBEA]"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-center font-display text-xl font-semibold text-[#A5CF83] sm:text-2xl">
            Kavi Dall Gallery
          </p>
          <button
            className="rounded-full bg-gradient-to-r from-[#A5CF83] via-[#D8EDC5] to-[#F3FFE8] px-4 py-2.5 text-xs font-black uppercase text-[#10240c] shadow-[0_14px_35px_rgba(165,207,131,0.28)] transition hover:brightness-110 sm:px-5"
            onClick={onBack}
            type="button"
          >
            Book Slot
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(165,207,131,0.26),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.9),transparent_30%),linear-gradient(135deg,#F8FFF3_0%,#EEF8E8_48%,#E2F1D5_100%)] py-12 sm:py-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A5CF83]/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#D8EDC5] sm:tracking-[0.38em]">
                <Camera className="h-4 w-4" />
                Gallery
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl">
                Calm visuals, refined spaces, premium care.
              </h1>
            </div>
            <div className="rounded-lg border border-[#A5CF83]/25 bg-white/85 p-5 shadow-[0_28px_90px_rgba(95,142,67,0.14)] backdrop-blur-xl">
              <p className="text-sm leading-7 text-[#304628]/78">
                A professional gallery experience for Kavi Dall with balanced image hierarchy, clean
                hover states, and a polished green palette based on #A5CF83.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide ${
                      index === 0
                        ? 'border-[#A5CF83] bg-[#A5CF83] text-[#10240c]'
                        : 'border-[#A5CF83]/30 bg-white text-[#304628]'
                    }`}
                    key={filter}
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid auto-rows-[220px] gap-4 sm:mt-12 sm:auto-rows-[230px] md:grid-cols-4">
            {galleryItems.map((item) => (
              <article
                className={`group relative overflow-hidden rounded-lg border border-[#A5CF83]/25 bg-white shadow-[0_26px_80px_rgba(95,142,67,0.16)] ${item.className}`}
                key={item.title}
              >
                <img
                  alt={item.title}
                  className={`h-full w-full object-cover ${item.position} transition duration-700 group-hover:scale-105`}
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07110a]/78 via-[#07110a]/8 to-transparent opacity-90" />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white backdrop-blur">
                  {item.category}
                </div>
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3FFE8] text-[#10240c] opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="text-xl font-black">{item.title}</h2>
                  <p className="mt-1 text-sm text-[#f4fff0]/68">
                    Kavi Dall signature wellness atmosphere.
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {galleryHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="rounded-lg border border-[#A5CF83]/25 bg-white/88 p-5 shadow-[0_18px_50px_rgba(95,142,67,0.14)] backdrop-blur"
                  key={item.title}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#A5CF83] via-[#D8EDC5] to-[#F3FFE8] text-[#10240c]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#263a20]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#304628]/70">{item.copy}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#A5CF83]/30 bg-white/82 p-5 shadow-[0_22px_70px_rgba(95,142,67,0.14)] md:flex-row md:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-[#5F8E43]">
                <CalendarDays className="h-4 w-4" />
                Ready to reserve your session?
              </p>
              <p className="mt-2 text-sm text-[#304628]/70">
                Return to booking and choose your treatment, date, and available time slot.
              </p>
            </div>
            <button
              className="rounded-full bg-gradient-to-r from-[#A5CF83] via-[#D8EDC5] to-[#F3FFE8] px-6 py-3 text-sm font-black uppercase text-[#10240c] shadow-[0_14px_40px_rgba(165,207,131,0.24)]"
              onClick={onBack}
              type="button"
            >
              Open Booking
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
