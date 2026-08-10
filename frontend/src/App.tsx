import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Leaf,
  LogOut,
  Menu,
  MapPin,
  Mail,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import heroImage from './assets/spa-hero.png';
import { Gallery } from './components/Gallery';

type SpaService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  mood: string;
};

type TimeSlot = {
  id: string;
  label: string;
  therapist: string;
  available: boolean;
};

type BookingResponse = {
  booking: {
    id: string;
    date: string;
    status: 'pending' | 'confirmed';
  };
  summary: {
    serviceName: string;
    slotLabel: string;
    therapist: string;
  };
};

type AdminBooking = {
  id: string;
  serviceId: string;
  date: string;
  slotId: string;
  customerName: string;
  phone: string;
  email: string;
  gender: string;
  notes: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
  confirmedAt?: string;
  summary: {
    serviceName: string;
    slotLabel: string;
    therapist: string;
  };
};

type AdminLoginResponse = {
  token: string;
  admin: {
    email: string;
  };
};

type AdminLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  totalBookings: number;
  lastBookingDate: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type Toast = {
  message: string;
  type: 'success' | 'error' | 'info';
};

const defaultPagination: Pagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
};

const fallbackServices: SpaService[] = [
  {
    id: 'glow-facial',
    name: 'Glow Facial',
    durationMinutes: 45,
    price: 2499,
    mood: 'Brightening cleanse and facial massage',
  },
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
];

const defaultService = fallbackServices[0] as SpaService;

const fallbackSlots: TimeSlot[] = [
  { id: '09-00', label: '09:00 AM', therapist: 'Maya', available: true },
  { id: '10-30', label: '10:30 AM', therapist: 'Anika', available: true },
  { id: '12-00', label: '12:00 PM', therapist: 'Leah', available: true },
  { id: '14-30', label: '02:30 PM', therapist: 'Maya', available: true },
  { id: '16-00', label: '04:00 PM', therapist: 'Anika', available: true },
  { id: '17-30', label: '05:30 PM', therapist: 'Leah', available: true },
];

const defaultSlot = fallbackSlots[0] as TimeSlot;
const viteEnv = import.meta.env as { readonly VITE_API_BASE_URL?: string };
const apiBaseUrl = viteEnv.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000';
const contactPhone = '9626847595';
const contactEmail = 'priya06kavi04@gmail.com';
const whatsappLink = `https://wa.me/91${contactPhone}`;

const normalizeWhatsappPhone = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '');
  return digits.startsWith('91') ? digits : `91${digits}`;
};

const buildAppointmentLetter = (booking: AdminBooking) =>
  [
    'Kavi Dall Spa - Appointment Confirmation',
    '',
    `Booking ID: ${booking.id}`,
    `Customer: ${booking.customerName}`,
    `Service: ${booking.summary.serviceName}`,
    `Date: ${booking.date}`,
    `Time: ${booking.summary.slotLabel}`,
    `Therapist: ${booking.summary.therapist}`,
    `Status: ${booking.status.toUpperCase()}`,
    '',
    'Your appointment is confirmed. Please arrive 10 minutes before your scheduled time.',
    `Contact: +91 ${contactPhone}`,
  ].join('\n');

const getAppointmentShareUrl = (booking: AdminBooking) =>
  `https://wa.me/${normalizeWhatsappPhone(booking.phone)}?text=${encodeURIComponent(
    buildAppointmentLetter(booking),
  )}`;

const openingHours = [
  ['Monday', '9:00 AM - 8:30 PM'],
  ['Tuesday', '9:00 AM - 8:30 PM'],
  ['Wednesday', '9:00 AM - 8:30 PM'],
  ['Thursday', '9:00 AM - 8:30 PM'],
  ['Friday', '9:00 AM - 8:30 PM'],
  ['Saturday', '9:00 AM - 8:30 PM'],
  ['Sunday', '10:00 AM - 6:00 PM'],
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const getDateOptions = () =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      value: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    };
  });

export function App() {
  const [activeView, setActiveView] = useState<'home' | 'gallery' | 'admin'>('home');
  const dateOptions = useMemo(() => getDateOptions(), []);
  const defaultDate = dateOptions[0];
  const [services, setServices] = useState<SpaService[]>(fallbackServices);
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService.id);
  const [selectedDate, setSelectedDate] = useState(defaultDate?.value ?? '');
  const [slots, setSlots] = useState<TimeSlot[]>(fallbackSlots);
  const [selectedSlotId, setSelectedSlotId] = useState(defaultSlot.id);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);
  const [adminEmail, setAdminEmail] = useState(contactEmail);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('kavi-admin-token') ?? '');
  const [adminTab, setAdminTab] = useState<'appointments' | 'leads'>('appointments');
  const [adminBookings, setAdminBookings] = useState<AdminBooking[]>([]);
  const [adminLeads, setAdminLeads] = useState<AdminLead[]>([]);
  const [bookingPagination, setBookingPagination] = useState<Pagination>(defaultPagination);
  const [leadPagination, setLeadPagination] = useState<Pagination>(defaultPagination);
  const [bookingFilterDate, setBookingFilterDate] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [confirmingBookingId, setConfirmingBookingId] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  const toastElement = toast ? (
    <div className="fixed right-4 top-20 z-50 max-w-sm rounded-lg border border-[#A5CF83]/35 bg-white px-4 py-3 text-sm font-bold text-[#263a20] shadow-[0_18px_50px_rgba(95,142,67,0.2)]">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            toast.type === 'error'
              ? 'bg-[#B42318]'
              : toast.type === 'info'
                ? 'bg-[#5F8E43]'
                : 'bg-[#A5CF83]'
          }`}
        />
        <p>{toast.message}</p>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/services`);
        const data = (await response.json()) as { services: SpaService[] };
        const nextServices = data.services.length > 0 ? data.services : fallbackServices;
        setServices(nextServices);
        setSelectedServiceId(nextServices[0]?.id ?? defaultService.id);
      } catch {
        setServices(fallbackServices);
      }
    };

    void loadServices();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const query = new URLSearchParams({
          serviceId: selectedServiceId,
          date: selectedDate,
        });
        const response = await fetch(`${apiBaseUrl}/api/slots?${query.toString()}`);
        const data = (await response.json()) as { slots: TimeSlot[] };
        setSlots(data.slots);
        setSelectedSlotId(data.slots.find((slot) => slot.available)?.id ?? '');
      } catch {
        setSlots(fallbackSlots);
        setSelectedSlotId(defaultSlot.id);
      }
    };

    void loadSlots();
  }, [selectedDate, selectedServiceId]);

  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setConfirmation(null);

    if (!selectedSlotId) {
      setMessage('Please choose an available time slot.');
      showToast('Please choose an available time slot.', 'error');
      return;
    }

    if (!acceptedTerms) {
      setMessage('Please accept the booking confirmation terms.');
      showToast('Please accept the booking confirmation terms.', 'error');
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          date: selectedDate,
          slotId: selectedSlotId,
          customerName,
          phone,
          email,
          gender,
          notes,
        }),
      });

      const data = (await response.json()) as BookingResponse | { message: string };

      if (!response.ok || 'message' in data) {
        setMessage('message' in data ? data.message : 'Booking failed. Please try again.');
        showToast('message' in data ? data.message : 'Booking failed. Please try again.', 'error');
        return;
      }

      setConfirmation(data);
      showToast('Appointment booking confirmed successfully.', 'success');
      setCustomerName('');
      setPhone('');
      setEmail('');
      setGender('');
      setNotes('');
      setAcceptedTerms(false);
    } catch {
      setMessage('Backend is not reachable. Start backend server and try again.');
      showToast('Backend is not reachable. Start backend server and try again.', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const openHome = () => {
    setActiveView('home');
    setIsMobileMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const openGallery = () => {
    setActiveView('gallery');
    setIsMobileMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openAdmin = () => {
    setActiveView('admin');
    setIsMobileMenuOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const loadAdminBookings = async (
    token = adminToken,
    page = bookingPagination.page,
    date = bookingFilterDate,
  ) => {
    if (!token) {
      return;
    }

    setIsAdminLoading(true);
    setAdminMessage('');

    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(bookingPagination.pageSize),
      });

      if (date) {
        query.set('date', date);
      }

      const response = await fetch(`${apiBaseUrl}/api/bookings?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as {
        bookings: AdminBooking[];
        pagination: Pagination;
        message?: string;
      };

      if (!response.ok) {
        setAdminMessage(data.message ?? 'Unable to load appointments.');
        showToast(data.message ?? 'Unable to load appointments.', 'error');
        return;
      }

      setAdminBookings(data.bookings);
      setBookingPagination(data.pagination);
    } catch {
      setAdminMessage('Backend is not reachable. Start backend server and try again.');
      showToast('Backend is not reachable. Start backend server and try again.', 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const loadAdminLeads = async (token = adminToken, page = leadPagination.page) => {
    if (!token) {
      return;
    }

    setIsAdminLoading(true);
    setAdminMessage('');

    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(leadPagination.pageSize),
      });
      const response = await fetch(`${apiBaseUrl}/api/leads?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as {
        leads: AdminLead[];
        pagination: Pagination;
        message?: string;
      };

      if (!response.ok) {
        setAdminMessage(data.message ?? 'Unable to load leads.');
        showToast(data.message ?? 'Unable to load leads.', 'error');
        return;
      }

      setAdminLeads(data.leads);
      setLeadPagination(data.pagination);
    } catch {
      setAdminMessage('Backend is not reachable. Start backend server and try again.');
      showToast('Backend is not reachable. Start backend server and try again.', 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAdminLoading(true);
    setAdminMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = (await response.json()) as AdminLoginResponse | { message: string };

      if (!response.ok || 'message' in data) {
        setAdminMessage('message' in data ? data.message : 'Admin login failed.');
        showToast('message' in data ? data.message : 'Admin login failed.', 'error');
        return;
      }

      localStorage.setItem('kavi-admin-token', data.token);
      setAdminToken(data.token);
      setAdminPassword('');
      showToast('Admin login successful.', 'success');
      await loadAdminBookings(data.token);
      await loadAdminLeads(data.token, 1);
    } catch {
      setAdminMessage('Backend is not reachable. Start backend server and try again.');
      showToast('Backend is not reachable. Start backend server and try again.', 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('kavi-admin-token');
    setAdminToken('');
    setAdminBookings([]);
    setAdminLeads([]);
    setBookingPagination(defaultPagination);
    setLeadPagination(defaultPagination);
    setAdminPassword('');
    setAdminMessage('');
    showToast('Admin logged out.', 'info');
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setConfirmingBookingId(bookingId);
    setAdminMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = (await response.json()) as { booking: AdminBooking; message?: string };

      if (!response.ok) {
        setAdminMessage(data.message ?? 'Unable to confirm appointment.');
        showToast(data.message ?? 'Unable to confirm appointment.', 'error');
        return;
      }

      setAdminBookings((bookings) =>
        bookings.map((booking) => (booking.id === bookingId ? data.booking : booking)),
      );
      setAdminMessage('Appointment confirmed. Email and WhatsApp notifications were triggered.');
      showToast('Appointment confirmed. You can share it on WhatsApp now.', 'success');
    } catch {
      setAdminMessage('Backend is not reachable. Start backend server and try again.');
      showToast('Backend is not reachable. Start backend server and try again.', 'error');
    } finally {
      setConfirmingBookingId('');
    }
  };

  const handleBookingFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast(bookingFilterDate ? 'Date filter applied.' : 'Showing all appointment dates.', 'info');
    void loadAdminBookings(adminToken, 1, bookingFilterDate);
  };

  const clearBookingFilter = () => {
    setBookingFilterDate('');
    showToast('Date filter cleared.', 'info');
    void loadAdminBookings(adminToken, 1, '');
  };

  const changeBookingPage = (page: number) => {
    void loadAdminBookings(adminToken, page, bookingFilterDate);
  };

  const changeLeadPage = (page: number) => {
    void loadAdminLeads(adminToken, page);
  };

  const shareAppointmentOnWhatsapp = (booking: AdminBooking) => {
    window.open(getAppointmentShareUrl(booking), '_blank', 'noopener,noreferrer');
    showToast('WhatsApp share opened with the appointment letter.', 'success');
  };

  useEffect(() => {
    if (activeView === 'admin' && adminToken) {
      if (adminTab === 'appointments') {
        void loadAdminBookings();
      } else {
        void loadAdminLeads();
      }
    }
  }, [activeView, adminToken, adminTab]);

  if (activeView === 'gallery') {
    return <Gallery onBack={openHome} />;
  }

  if (activeView === 'admin') {
    return (
      <main className="min-h-screen bg-[#F8FFF3] text-[#162312]">
        {toastElement}
        <nav className="sticky top-0 z-30 border-b border-[#A5CF83]/30 bg-[#FBFFF7]/92 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <button
              className="flex items-center gap-2 font-display text-2xl font-semibold"
              onClick={openHome}
              type="button"
            >
              <Leaf className="h-6 w-6 text-[#A5CF83]" />
              Kavi Dall
            </button>
            {adminToken ? (
              <button
                className="flex items-center gap-2 rounded-full border border-[#A5CF83]/40 bg-white px-4 py-2 text-sm font-bold text-[#304628] transition hover:bg-[#F2FBEA]"
                onClick={handleAdminLogout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : null}
          </div>
        </nav>

        <section className="bg-[linear-gradient(135deg,#F8FFF3_0%,#EEF8E8_52%,#DCEFCF_100%)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43]">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </p>
                <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                  Appointment Monitor
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#304628]/75">
                  Login, review customer bookings, and confirm appointments. Confirmation triggers
                  email and WhatsApp notification from the backend when provider keys are configured.
                </p>
              </div>
              {adminToken ? (
                <button
                  className="rounded-full bg-gradient-to-r from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] px-5 py-3 text-xs font-black uppercase text-[#10240c] shadow-[0_14px_35px_rgba(165,207,131,0.24)]"
                  onClick={() => {
                    if (adminTab === 'appointments') {
                      void loadAdminBookings();
                    } else {
                      void loadAdminLeads();
                    }
                  }}
                  type="button"
                >
                  Refresh
                </button>
              ) : null}
            </div>

            {!adminToken ? (
              <form
                className="mt-10 max-w-xl rounded-lg border border-[#A5CF83]/30 bg-white/92 p-6 shadow-[0_24px_70px_rgba(95,142,67,0.14)]"
                onSubmit={(event) => {
                  void handleAdminLogin(event);
                }}
              >
                <label className="text-xs font-bold text-[#263a20]">
                  Admin Email
                  <input
                    className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm outline-none focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                    onChange={(event) => setAdminEmail(event.target.value)}
                    type="email"
                    value={adminEmail}
                  />
                </label>
                <label className="mt-5 block text-xs font-bold text-[#263a20]">
                  Password
                  <input
                    className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm outline-none focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                    onChange={(event) => setAdminPassword(event.target.value)}
                    type="password"
                    value={adminPassword}
                  />
                </label>
                <button
                  className="mt-6 rounded-full bg-gradient-to-r from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] px-7 py-3 text-xs font-black uppercase text-[#10240c] disabled:opacity-70"
                  disabled={isAdminLoading}
                  type="submit"
                >
                  {isAdminLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            ) : (
              <div className="mt-10">
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase ${
                      adminTab === 'appointments'
                        ? 'bg-[#A5CF83] text-[#10240c]'
                        : 'border border-[#A5CF83]/35 bg-white text-[#304628]'
                    }`}
                    onClick={() => setAdminTab('appointments')}
                    type="button"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Appointments
                  </button>
                  <button
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase ${
                      adminTab === 'leads'
                        ? 'bg-[#A5CF83] text-[#10240c]'
                        : 'border border-[#A5CF83]/35 bg-white text-[#304628]'
                    }`}
                    onClick={() => setAdminTab('leads')}
                    type="button"
                  >
                    <UsersRound className="h-4 w-4" />
                    Leads
                  </button>
                </div>

                {adminTab === 'appointments' ? (
                  <>
                    <form
                      className="mt-5 flex flex-col gap-3 rounded-lg border border-[#A5CF83]/25 bg-white/88 p-4 sm:flex-row sm:items-end"
                      onSubmit={handleBookingFilter}
                    >
                      <label className="text-xs font-bold text-[#263a20]">
                        Date Filter
                        <input
                          className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm outline-none focus:border-[#5F8E43] sm:w-56"
                          onChange={(event) => setBookingFilterDate(event.target.value)}
                          type="date"
                          value={bookingFilterDate}
                        />
                      </label>
                      <button
                        className="rounded-full bg-[#A5CF83] px-5 py-3 text-xs font-black uppercase text-[#10240c]"
                        type="submit"
                      >
                        Apply
                      </button>
                      <button
                        className="rounded-full border border-[#A5CF83]/40 bg-white px-5 py-3 text-xs font-black uppercase text-[#304628]"
                        onClick={clearBookingFilter}
                        type="button"
                      >
                        Clear
                      </button>
                      <p className="text-xs font-semibold text-[#304628]/65 sm:ml-auto">
                        {bookingPagination.total} appointment records
                      </p>
                    </form>

                    <div className="mt-5 overflow-hidden rounded-lg border border-[#A5CF83]/25 bg-white/92 shadow-[0_24px_70px_rgba(95,142,67,0.14)]">
                      <div className="grid gap-4 border-b border-[#A5CF83]/20 bg-[#F2FBEA] px-4 py-3 text-xs font-black uppercase text-[#5F8E43] md:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr]">
                        <span>Customer</span>
                        <span>Appointment</span>
                        <span>Contact</span>
                        <span>Status</span>
                        <span>Action</span>
                      </div>
                      {adminBookings.length === 0 ? (
                        <p className="p-5 text-sm text-[#304628]/70">
                          {isAdminLoading ? 'Loading appointments...' : 'No appointments found.'}
                        </p>
                      ) : (
                        adminBookings.map((booking) => (
                          <article
                            className="grid gap-4 border-b border-[#A5CF83]/15 px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr]"
                            key={booking.id}
                          >
                            <div>
                              <p className="font-black text-[#263a20]">{booking.customerName}</p>
                              <p className="mt-1 text-xs text-[#304628]/65">{booking.id}</p>
                            </div>
                            <div>
                              <p className="font-bold text-[#263a20]">
                                {booking.summary.serviceName}
                              </p>
                              <p className="mt-1 text-xs text-[#304628]/65">
                                {booking.date} at {booking.summary.slotLabel}
                              </p>
                            </div>
                            <div className="break-words text-xs leading-5 text-[#304628]/75">
                              <p>{booking.phone}</p>
                              <p>{booking.email}</p>
                            </div>
                            <span
                              className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${
                                booking.status === 'confirmed'
                                  ? 'bg-[#A5CF83]/25 text-[#315226]'
                                  : 'bg-[#fff7d6] text-[#765600]'
                              }`}
                            >
                              {booking.status}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="h-fit rounded-full bg-[#A5CF83] px-4 py-2 text-xs font-black uppercase text-[#10240c] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={
                                  booking.status === 'confirmed' ||
                                  confirmingBookingId === booking.id
                                }
                                onClick={() => {
                                  void handleConfirmBooking(booking.id);
                                }}
                                type="button"
                              >
                                {confirmingBookingId === booking.id ? 'Sending...' : 'Confirm'}
                              </button>
                              <button
                                className="flex h-fit items-center gap-1 rounded-full border border-[#A5CF83]/50 bg-white px-4 py-2 text-xs font-black uppercase text-[#315226] transition hover:bg-[#F2FBEA] disabled:cursor-not-allowed disabled:opacity-45"
                                disabled={booking.status !== 'confirmed'}
                                onClick={() => shareAppointmentOnWhatsapp(booking)}
                                type="button"
                              >
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#A5CF83]/25 bg-white/82 p-3 text-sm text-[#304628]">
                      <button
                        className="flex items-center gap-1 rounded-full border border-[#A5CF83]/40 px-3 py-2 font-bold disabled:opacity-40"
                        disabled={bookingPagination.page <= 1}
                        onClick={() => changeBookingPage(bookingPagination.page - 1)}
                        type="button"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <span className="text-xs font-black uppercase">
                        Page {bookingPagination.page} of {bookingPagination.totalPages}
                      </span>
                      <button
                        className="flex items-center gap-1 rounded-full border border-[#A5CF83]/40 px-3 py-2 font-bold disabled:opacity-40"
                        disabled={bookingPagination.page >= bookingPagination.totalPages}
                        onClick={() => changeBookingPage(bookingPagination.page + 1)}
                        type="button"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-5 rounded-lg border border-[#A5CF83]/25 bg-white/88 p-4">
                      <p className="text-xs font-semibold text-[#304628]/65">
                        {leadPagination.total} leads maintained separately from appointments
                      </p>
                    </div>
                    <div className="mt-5 overflow-hidden rounded-lg border border-[#A5CF83]/25 bg-white/92 shadow-[0_24px_70px_rgba(95,142,67,0.14)]">
                      <div className="grid gap-4 border-b border-[#A5CF83]/20 bg-[#F2FBEA] px-4 py-3 text-xs font-black uppercase text-[#5F8E43] md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr]">
                        <span>Lead</span>
                        <span>Contact</span>
                        <span>Bookings</span>
                        <span>Last Visit</span>
                      </div>
                      {adminLeads.length === 0 ? (
                        <p className="p-5 text-sm text-[#304628]/70">
                          {isAdminLoading ? 'Loading leads...' : 'No leads found.'}
                        </p>
                      ) : (
                        adminLeads.map((lead) => (
                          <article
                            className="grid gap-4 border-b border-[#A5CF83]/15 px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr]"
                            key={lead.id}
                          >
                            <div>
                              <p className="font-black text-[#263a20]">{lead.name}</p>
                              <p className="mt-1 text-xs text-[#304628]/65">{lead.id}</p>
                            </div>
                            <div className="break-words text-xs leading-5 text-[#304628]/75">
                              <p>{lead.phone}</p>
                              <p>{lead.email}</p>
                            </div>
                            <p className="font-black text-[#315226]">{lead.totalBookings}</p>
                            <p className="text-xs font-semibold text-[#304628]/70">
                              {lead.lastBookingDate}
                            </p>
                          </article>
                        ))
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#A5CF83]/25 bg-white/82 p-3 text-sm text-[#304628]">
                      <button
                        className="flex items-center gap-1 rounded-full border border-[#A5CF83]/40 px-3 py-2 font-bold disabled:opacity-40"
                        disabled={leadPagination.page <= 1}
                        onClick={() => changeLeadPage(leadPagination.page - 1)}
                        type="button"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <span className="text-xs font-black uppercase">
                        Page {leadPagination.page} of {leadPagination.totalPages}
                      </span>
                      <button
                        className="flex items-center gap-1 rounded-full border border-[#A5CF83]/40 px-3 py-2 font-bold disabled:opacity-40"
                        disabled={leadPagination.page >= leadPagination.totalPages}
                        onClick={() => changeLeadPage(leadPagination.page + 1)}
                        type="button"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {adminMessage ? (
              <p className="mt-5 rounded-md border border-[#A5CF83]/40 bg-white p-3 text-sm text-[#304628]">
                {adminMessage}
              </p>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FFF3] text-[#162312]">
      {toastElement}
      <nav className="sticky top-0 z-30 border-b border-[#A5CF83]/30 bg-[#FBFFF7]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <button
            className="flex items-center gap-2 font-display text-2xl font-semibold"
            onClick={openHome}
            type="button"
          >
            <Leaf className="h-6 w-6 text-[#A5CF83]" />
            <span>
              Kavi Dall
              <span className="block text-[10px] font-medium uppercase tracking-[0.32em] text-[#5F8E43]">
                Luxury Spa
              </span>
            </span>
          </button>
          <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wide text-[#304628]/75 md:flex">
            <a className="hover:text-[#A5CF83]" href="#home">
              Home
            </a>
            <a className="hover:text-[#A5CF83]" href="#services">
              Services
            </a>
            <button className="hover:text-[#A5CF83]" onClick={openGallery} type="button">
              Gallery
            </button>
            <button className="hover:text-[#A5CF83]" onClick={openAdmin} type="button">
              Admin
            </button>
            <a className="hover:text-[#A5CF83]" href="#booking">
              Booking
            </a>
            <a className="hover:text-[#A5CF83]" href="#contact">
              Contact
            </a>
          </div>
          <a
            className="hidden rounded-full bg-gradient-to-r from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] px-5 py-2.5 text-xs font-black uppercase text-[#10240c] shadow-[0_14px_35px_rgba(165,207,131,0.28)] transition hover:brightness-110 sm:inline-flex"
            href="#booking"
          >
            Book Now
          </a>
          <button
            aria-expanded={isMobileMenuOpen}
            aria-label="Open navigation menu"
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#A5CF83]/55 bg-[#F2FBEA] text-[#5F8E43] shadow-[0_10px_24px_rgba(95,142,67,0.14)] md:hidden"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            type="button"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-7 w-7" />}
          </button>
          {isMobileMenuOpen ? (
            <div className="w-full rounded-lg border border-[#A5CF83]/35 bg-[#FBFFF7]/98 p-3 shadow-[0_22px_60px_rgba(95,142,67,0.18)] md:hidden">
              <a
                className="block rounded-md px-4 py-3 text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                href="#home"
                onClick={closeMobileMenu}
              >
                Home
              </a>
              <a
                className="block rounded-md px-4 py-3 text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                href="#services"
                onClick={closeMobileMenu}
              >
                Services
              </a>
              <button
                className="block w-full rounded-md px-4 py-3 text-left text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                onClick={openGallery}
                type="button"
              >
                Gallery
              </button>
              <button
                className="block w-full rounded-md px-4 py-3 text-left text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                onClick={openAdmin}
                type="button"
              >
                Admin
              </button>
              <a
                className="block rounded-md px-4 py-3 text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                href="#booking"
                onClick={closeMobileMenu}
              >
                Booking
              </a>
              <a
                className="block rounded-md px-4 py-3 text-sm font-black uppercase text-[#263a20] hover:bg-[#A5CF83]/14"
                href="#contact"
                onClick={closeMobileMenu}
              >
                Contact
              </a>
            </div>
          ) : null}
          <div className="hidden w-full grid-cols-2 gap-2 md:hidden">
            <button
              className="rounded-full border border-[#A5CF83]/35 bg-white/5 px-4 py-2 text-xs font-black uppercase text-[#f4fff0]"
              onClick={openGallery}
              type="button"
            >
              Gallery
            </button>
            <a
              className="rounded-full border border-[#A5CF83]/35 bg-white/5 px-4 py-2 text-center text-xs font-black uppercase text-[#f4fff0]"
              href="#booking"
            >
              Booking
            </a>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[84vh] overflow-hidden" id="home">
        <img
          alt="Luxury spa treatment room"
          className="absolute inset-0 h-full w-full object-cover"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FFF3]/96 via-[#F8FFF3]/78 to-[#A5CF83]/14" />
        <div className="relative mx-auto flex min-h-[84vh] max-w-7xl items-center px-4 py-16 sm:px-5 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43] sm:tracking-[0.48em]">
              Reserve your slot
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl">
              Book an Appointment
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#304628]/80 sm:text-lg">
              Fill in your details, choose a treatment, select an available time, and confirm your
              spa booking instantly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-gradient-to-r from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] px-7 py-3 text-center text-sm font-black uppercase text-[#10240c] shadow-[0_18px_48px_rgba(165,207,131,0.3)] transition hover:brightness-110"
                href="#booking"
              >
                Check Available Time
              </a>
              <a
                className="rounded-full border border-[#A5CF83]/55 bg-white/70 px-7 py-3 text-center text-sm font-bold uppercase text-[#304628] transition hover:bg-[#F2FBEA]"
                href="#services"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#F8FFF3_0%,#EEF8E8_100%)] py-16" id="services">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43]">
              Our services
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Choose your ritual</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <button
                className={`rounded-lg border p-5 text-left transition hover:-translate-y-1 ${
                  selectedServiceId === service.id
                    ? 'border-[#F0FFE6] bg-gradient-to-br from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] text-[#10240c] shadow-[0_24px_60px_rgba(165,207,131,0.24)]'
                    : 'border-[#A5CF83]/30 bg-white text-[#263a20] shadow-[0_18px_48px_rgba(95,142,67,0.1)] hover:border-[#A5CF83]/70'
                }`}
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                type="button"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4fff0] text-[#1f4a19]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
                <p className="mt-2 min-h-10 text-sm opacity-75">{service.mood}</p>
                <div className="mt-5 flex items-center justify-between text-sm font-black">
                  <span>{service.durationMinutes} min</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[radial-gradient(circle_at_18%_10%,rgba(165,207,131,0.24),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(255,255,255,0.8),transparent_28%),linear-gradient(135deg,#F8FFF3_0%,#EAF6DF_52%,#DCEFCF_100%)] py-16 sm:py-20"
        id="booking"
      >
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43] sm:tracking-[0.48em]">
              Reserve your slot
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Book an Appointment
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#304628]/75">
              Fill the details below and our team will confirm your booking. Available time slots
              update based on your service and date.
            </p>
          </div>

          <form
            className="mt-10 rounded-lg border border-[#A5CF83]/35 bg-white/92 p-4 shadow-[0_30px_90px_rgba(95,142,67,0.16)] backdrop-blur-xl sm:p-5 md:p-8"
            onSubmit={(event) => {
              void handleBooking(event);
            }}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#5F8E43]">
              <UserRound className="h-4 w-4" />
              Personal details
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-bold text-[#263a20]">
                Full Name *
                <input
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition placeholder:text-[#809675] focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                  required
                  value={customerName}
                />
              </label>
              <label className="text-xs font-bold text-[#263a20]">
                Phone Number *
                <input
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition placeholder:text-[#809675] focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                  required
                  type="tel"
                  value={phone}
                />
              </label>
              <label className="text-xs font-bold text-[#263a20]">
                Email Address *
                <input
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition placeholder:text-[#809675] focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email address"
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label className="text-xs font-bold text-[#263a20]">
                Gender *
                <select
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                  onChange={(event) => setGender(event.target.value)}
                  required
                  value={gender}
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#5F8E43]">
              <CalendarDays className="h-4 w-4" />
              Appointment details
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-bold text-[#263a20]">
                Select Service *
                <select
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                  onChange={(event) => setSelectedServiceId(event.target.value)}
                  value={selectedServiceId}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold text-[#263a20]">
                Preferred Therapist
                <input
                  className="mt-2 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none"
                  readOnly
                  value={selectedSlot?.therapist ?? 'Select available time'}
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-[#263a20]">Preferred Date *</p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {dateOptions.map((date) => (
                    <button
                      className={`rounded-md border px-3 py-3 text-sm font-bold transition ${
                        selectedDate === date.value
                          ? 'border-[#F0FFE6] bg-gradient-to-r from-[#A5CF83] to-[#F0FFE6] text-[#10240c]'
                          : 'border-[#A5CF83]/55 bg-[#F8FFF3] text-[#263a20] hover:border-[#5F8E43]'
                      }`}
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      type="button"
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-bold text-[#263a20]">
                  <Clock3 className="h-4 w-4 text-[#5F8E43]" />
                  Available Time *
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {slots.map((slot) => (
                    <button
                      className={`rounded-md border px-3 py-3 text-left transition ${
                        selectedSlotId === slot.id
                          ? 'border-[#F0FFE6] bg-gradient-to-r from-[#A5CF83] to-[#F0FFE6] text-[#10240c]'
                          : 'border-[#A5CF83]/55 bg-[#F8FFF3] text-[#263a20] hover:border-[#5F8E43]'
                      } ${slot.available ? '' : 'cursor-not-allowed opacity-40'}`}
                      disabled={!slot.available}
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      type="button"
                    >
                      <span className="block text-sm font-black">{slot.label}</span>
                      <span className="text-[11px] font-semibold opacity-75">
                        {slot.available ? slot.therapist : 'Booked'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="mt-5 block text-xs font-bold text-[#263a20]">
              Special Requests / Notes
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-[#A5CF83]/50 bg-[#F8FFF3] px-4 py-3 text-sm text-[#263a20] outline-none transition placeholder:text-[#809675] focus:border-[#5F8E43] focus:ring-2 focus:ring-[#A5CF83]/30"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Pressure preference, occasion, or special request"
                value={notes}
              />
            </label>

            <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-[#304628]/75">
              <input
                checked={acceptedTerms}
                className="mt-1 h-4 w-4 accent-[#A5CF83]"
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                type="checkbox"
              />
              I agree to be contacted regarding this booking and confirm the selected appointment
              details.
            </label>

            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                className="rounded-full bg-gradient-to-r from-[#A5CF83] via-[#CFEAB7] to-[#F0FFE6] px-8 py-3 text-xs font-black uppercase tracking-wide text-[#10240c] shadow-[0_18px_45px_rgba(165,207,131,0.3)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                disabled={isBooking}
                type="submit"
              >
                {isBooking ? 'Confirming...' : 'Confirm Booking'}
              </button>

              {message ? (
                <p className="w-full rounded-md border border-[#A5CF83]/50 bg-[#A5CF83]/10 p-3 text-center text-sm text-[#263a20]">
                  {message}
                </p>
              ) : null}

              {confirmation ? (
                <div className="w-full rounded-md border border-[#A5CF83]/40 bg-[#A5CF83]/10 p-4 text-sm">
                  <p className="flex items-center justify-center gap-2 font-black text-[#42652f]">
                    <CheckCircle2 className="h-5 w-5" />
                    Booking confirmed: {confirmation.booking.id}
                  </p>
                  <p className="mt-2 text-center text-[#304628]/75">
                    {confirmation.summary.serviceName} on {confirmation.booking.date} at{' '}
                    {confirmation.summary.slotLabel} with {confirmation.summary.therapist}.
                  </p>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="bg-[#F8FFF3] py-16" id="contact">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43]">
              Opening hours
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">When to Visit Us</h2>
            <div className="mt-7 overflow-hidden rounded-lg border border-[#A5CF83]/20">
              {openingHours.map(([day, time]) => (
                <div
                  className="flex items-center justify-between border-b border-[#A5CF83]/15 bg-white px-4 py-3 text-sm last:border-b-0"
                  key={day}
                >
                  <span className="font-bold">{day}</span>
                  <span className="text-[#5F8E43]">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#A5CF83]/30 bg-gradient-to-br from-white via-[#F2FBEA] to-[#E4F4D7] p-6 shadow-[0_24px_60px_rgba(95,142,67,0.16)]">
            <div className="flex h-full min-h-72 flex-col justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#5F8E43]">
                  Contact info
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold">Kavi Dall Spa</h3>
                <p className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#304628]/75">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#5F8E43]" />
                  48, Thiru Nagar Street, Puducherry
                </p>
                <a
                  className="mt-3 flex items-center gap-3 text-sm font-semibold text-[#304628]/75 transition hover:text-[#5F8E43]"
                  href={`tel:+91${contactPhone}`}
                >
                  <Phone className="h-4 w-4 text-[#5F8E43]" />
                  +91 {contactPhone}
                </a>
                <a
                  className="mt-3 flex items-center gap-3 text-sm font-semibold text-[#304628]/75 transition hover:text-[#5F8E43]"
                  href={`mailto:${contactEmail}`}
                >
                  <Mail className="h-4 w-4 text-[#5F8E43]" />
                  {contactEmail}
                </a>
                <a
                  className="mt-3 flex items-center gap-3 text-sm font-semibold text-[#304628]/75 transition hover:text-[#5F8E43]"
                  href={whatsappLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-4 w-4 text-[#5F8E43]" />
                  WhatsApp +91 {contactPhone}
                </a>
              </div>
              <div className="mt-8 rounded-md bg-[#A5CF83]/12 p-4">
                <p className="text-sm text-[#304628]/75">
                  Late appointments are accepted one hour before closing time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#A5CF83]/25 bg-[#FBFFF7] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-[#304628]/65 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl font-semibold text-[#A5CF83]">Kavi Dall</p>
          <p>Booking and slot management only. No login required.</p>
        </div>
      </footer>
    </main>
  );
}
