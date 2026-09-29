import React, { useState, useMemo } from 'react';
import {
  Hotel as HotelIcon,
  Home as HomeIcon,
  Compass,
  Car,
  Calendar,
  MapPin,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  Users,
  Phone,
  MessageSquare,
  Navigation,
  Heart,
  Search,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Info,
  X,
  Smartphone,
  Plane,
  Award,
  DollarSign,
  Luggage,
} from 'lucide-react';
import { PageId } from '../types';
import {
  bookingHotels,
  bookingHomestays,
  bookingTours,
  bookingTransports,
  BookingHotel,
  BookingHomestay,
  BookingTour,
  BookingTransportOption,
} from '../data/bookingData';
import { PaymentMethodsModal } from './PaymentMethodsModal';
import { useTranslation } from '../i18n/LanguageContext';

interface BookingViewProps {
  onNavigatePage: (page: PageId) => void;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
}

type BookingCategory = 'all' | 'hotels' | 'homestays' | 'tours' | 'transport';

export const BookingView: React.FC<BookingViewProps> = ({
  onNavigatePage,
  onToggleFavourite,
  isFavourite,
}) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedTourModal, setSelectedTourModal] = useState<BookingTour | null>(null);
  const [availabilityModalItem, setAvailabilityModalItem] = useState<{
    type: 'hotel' | 'homestay';
    title: string;
    location: string;
    image: string;
    priceIndicator: string;
    partnerName: string;
    partnerUrl?: string;
    phone?: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const [transportRequestModal, setTransportRequestModal] = useState<BookingTransportOption | null>(null);
  const [inquirySuccessMessage, setInquirySuccessMessage] = useState<string | null>(null);
  const [paymentCheckoutModal, setPaymentCheckoutModal] = useState<{
    title: string;
    amountUsd: number;
    customerName?: string;
  } | null>(null);

  // Form states
  const [formCheckIn, setFormCheckIn] = useState('2026-10-15');
  const [formCheckOut, setFormCheckOut] = useState('2026-10-18');
  const [formGuests, setFormGuests] = useState('2 Guests');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Transport request form states
  const [transPickup, setTransPickup] = useState('');
  const [transDropoff, setTransDropoff] = useState('');
  const [transDate, setTransDate] = useState('2026-10-15');
  const [transTime, setTransTime] = useState('10:00 AM');
  const [transVehicle, setTransVehicle] = useState('Sedan Car (1-3 Pax)');
  const [transPassengers, setTransPassengers] = useState('2');

  // Filtered lists
  const query = searchQuery.toLowerCase().trim();

  const filteredHotels = useMemo(() => {
    if (!query) return bookingHotels;
    return bookingHotels.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query) ||
        h.region.toLowerCase().includes(query) ||
        h.shortDescription.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredHomestays = useMemo(() => {
    if (!query) return bookingHomestays;
    return bookingHomestays.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query) ||
        h.region.toLowerCase().includes(query) ||
        h.shortDescription.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredTours = useMemo(() => {
    if (!query) return bookingTours;
    return bookingTours.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query) ||
        t.region.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredTransports = useMemo(() => {
    if (!query) return bookingTransports;
    return bookingTransports.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query)
    );
  }, [query]);

  const handleOpenAvailability = (
    type: 'hotel' | 'homestay',
    item: BookingHotel | BookingHomestay
  ) => {
    setAvailabilityModalItem({
      type,
      title: item.name,
      location: item.location,
      image: item.image,
      priceIndicator: item.priceIndicator,
      partnerName: item.partnerName,
      partnerUrl: item.partnerUrl,
      phone: item.phone,
      coordinates: item.coordinates,
    });
    setFormNotes('');
  };

  const handleBookNow = (
    item: BookingHotel | BookingHomestay | BookingTour,
    categoryType: 'hotel' | 'homestay' | 'tour'
  ) => {
    if (item.partnerUrl) {
      window.open(item.partnerUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Direct booking inquiry
      if (categoryType === 'tour') {
        setSelectedTourModal(item as BookingTour);
      } else {
        handleOpenAvailability(categoryType, item as BookingHotel | BookingHomestay);
      }
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContact) {
      alert(t('Please enter your WhatsApp number or email address.'));
      return;
    }

    const title = availabilityModalItem?.title || transportRequestModal?.title || t('Travel Booking');
    const message = `${t('Ayubowan! We have received your booking inquiry for')} "${title}". ${t('Our verified partner concierge will contact you shortly via')} ${formContact}. ${t('No payment has been charged.')}`;
    
    setInquirySuccessMessage(message);
    setAvailabilityModalItem(null);
    setTransportRequestModal(null);
    setFormName('');
    setFormContact('');
    setFormNotes('');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 sm:pb-28">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-[#0c2340] via-blue-950 to-emerald-950 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('Verified Sri Lanka Travel Concierge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
            <span>{t('Booking Hub')}</span>
            <span className="text-3xl sm:text-4xl" aria-hidden="true">🎫</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {t('Reserve authentic Sri Lankan heritage resorts, welcoming family-run homestays, licensed wildlife safaris, and island-wide airport & chauffeur transfers with transparent pricing and direct partner assurance.')}
          </p>

          {/* Quick Category Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            {[
              { id: 'all', label: t('All Bookings'), icon: <Compass className="w-4 h-4" /> },
              { id: 'hotels', label: '🏨 ' + t('Hotels & Resorts'), count: bookingHotels.length },
              { id: 'homestays', label: '🏠 ' + t('Guest Houses & Homestays'), count: bookingHomestays.length },
              { id: 'tours', label: '🧭 ' + t('Tours & Activities'), count: bookingTours.length },
              { id: 'transport', label: '🚐 ' + t('Transport & Transfers'), count: bookingTransports.length },
            ].map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`btn-booking-cat-${cat.id}`}
                  onClick={() => {
                    setActiveCategory(cat.id as BookingCategory);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation shadow-xs ${
                    active
                      ? 'bg-amber-400 text-stone-950 shadow-md font-black scale-102'
                      : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/10'
                  }`}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                        active ? 'bg-stone-950/20 text-stone-950' : 'bg-white/20 text-white'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-10 sm:space-y-12">
        {/* Search & Transparency Alert */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search by hotel, homestay, tour, or region...')}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                {t('Clear')}
              </button>
            )}
          </div>

          {/* Booking Notice Pill & Payment Checkout Demo Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/70 text-xs text-blue-900 font-medium">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                {t('Direct partner links & transparent concierge inquiries. No markups.')}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setPaymentCheckoutModal({
                  title: t('Sri Lanka Travel & Tour Reservation'),
                  amountUsd: 145,
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{t('Payment Methods & Checkout')}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner (if inquiry submitted) */}
        {inquirySuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <Check className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">{t('Booking Inquiry Dispatched')}</h4>
                <p className="text-xs mt-0.5 leading-relaxed">{inquirySuccessMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setInquirySuccessMessage(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1: 🏨 Hotels & Resorts
        ══════════════════════════════════════════════════════════════════════ */}
        {(activeCategory === 'all' || activeCategory === 'hotels') && (
          <section id="booking-section-hotels" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                  <HotelIcon className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t('Category 1 • Luxury & Heritage Lodging')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{t('Hotels & Resorts')}</span>
                  <span className="text-2xl" aria-hidden="true">🏨</span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                  {t('Handpicked 5-star properties, architectural icons by Geoffrey Bawa, tea estate bungalows, and coastal sanctuaries.')}
                </p>
              </div>
              <span className="text-xs font-bold text-stone-500">
                {t('Showing')} {filteredHotels.length} {t('Luxury Resorts')}
              </span>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                {t('No hotels found matching')} "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    id={`booking-card-${hotel.id}`}
                    className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                  >
                    {/* Hotel Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-900/90 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                          {hotel.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-stone-200 text-[10px]">
                          {hotel.region}
                        </span>
                      </div>

                      {/* Favourites Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite({
                            id: hotel.id,
                            type: 'hotel',
                            title: hotel.name,
                            subtitle: hotel.location,
                            image: hotel.image,
                            linkPage: 'booking',
                            targetId: hotel.id,
                          });
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs"
                        title={isFavourite(hotel.id) ? t('Remove from Favourites') : t('Save to Favourites')}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavourite(hotel.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                          }`}
                        />
                      </button>

                      {/* Title & Location on Image */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <h3 className="text-xl font-black tracking-tight leading-tight drop-shadow-xs">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{hotel.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2">
                        {/* Price Indicator */}
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-bold">
                            <span>{hotel.priceIndicator}</span>
                          </div>
                          <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                            ★ {hotel.rating} ({hotel.reviewsCount})
                          </span>
                        </div>

                        {/* Short Description */}
                        <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                          {hotel.shortDescription}
                        </p>

                        {/* Amenities Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hotel.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons: Check Availability & Book Now */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            id={`btn-check-avail-${hotel.id}`}
                            onClick={() => handleOpenAvailability('hotel', hotel)}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer touch-manipulation"
                          >
                            <Calendar className="w-3.5 h-3.5 text-stone-700" />
                            <span>{t('Check Availability')}</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-book-now-${hotel.id}`}
                            onClick={() => handleBookNow(hotel, 'hotel')}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 active:bg-blue-900 text-white text-xs font-bold transition-colors cursor-pointer touch-manipulation shadow-2xs"
                          >
                            <span>{t('Book Now')}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                          </button>
                        </div>

                        {/* Partner Link Notice & Map Pin */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium px-0.5">
                          <span className="truncate max-w-[180px]">
                            {hotel.status === 'partner_ready' ? t('Partner Booking') : t('Coming Soon')} • {hotel.partnerName}
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.coordinates.lat},${hotel.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>{t('Map')}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2: 🏠 Guest Houses & Homestays
        ══════════════════════════════════════════════════════════════════════ */}
        {(activeCategory === 'all' || activeCategory === 'homestays') && (
          <section id="booking-section-homestays" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  <HomeIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('Category 2 • Authentic Local Hospitality')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{t('Guest Houses & Homestays')}</span>
                  <span className="text-2xl" aria-hidden="true">🏠</span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                  {t('Stay with warm Sri Lankan host families, enjoy homecooked coconut curries, and discover hidden neighborhood tranquility.')}
                </p>
              </div>
              <span className="text-xs font-bold text-stone-500">
                {t('Showing')} {filteredHomestays.length} {t('Homestays')}
              </span>
            </div>

            {filteredHomestays.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                {t('No homestays found matching')} "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHomestays.map((home) => (
                  <div
                    key={home.id}
                    id={`booking-card-${home.id}`}
                    className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                  >
                    {/* Homestay Image */}
                    <div className="relative h-50 w-full overflow-hidden bg-stone-900">
                      <img
                        src={home.image}
                        alt={home.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Region & Host Pill */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-800/95 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                          {t('Host')}: {home.hostName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-stone-200 text-[10px]">
                          {home.region}
                        </span>
                      </div>

                      {/* Favourites Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite({
                            id: home.id,
                            type: 'homestay',
                            title: home.name,
                            subtitle: home.location,
                            image: home.image,
                            linkPage: 'booking',
                            targetId: home.id,
                          });
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs"
                        title={isFavourite(home.id) ? t('Remove from Favourites') : t('Save to Favourites')}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavourite(home.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                          }`}
                        />
                      </button>

                      {/* Name & Location */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <h3 className="text-xl font-black tracking-tight leading-tight drop-shadow-xs">
                          {home.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{home.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2">
                        {/* Price Indicator */}
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-950 text-xs font-bold">
                            <span>{home.priceIndicator}</span>
                          </div>
                          <span className="text-[11px] text-stone-600 font-bold">
                            ★ {home.rating} ({t('Local Host')})
                          </span>
                        </div>

                        {/* Short Description */}
                        <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                          {home.shortDescription}
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {home.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100 px-2 py-0.5 rounded-md"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons: Check Availability & Book Now */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            id={`btn-homestay-avail-${home.id}`}
                            onClick={() => handleOpenAvailability('homestay', home)}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer touch-manipulation"
                          >
                            <Calendar className="w-3.5 h-3.5 text-stone-700" />
                            <span>{t('Check Availability')}</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-homestay-book-${home.id}`}
                            onClick={() => handleBookNow(home, 'homestay')}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold transition-colors cursor-pointer touch-manipulation shadow-2xs"
                          >
                            <span>{t('Book Now')}</span>
                            <Check className="w-3.5 h-3.5 text-amber-300" />
                          </button>
                        </div>

                        {/* Partner Link Notice & Map Pin */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium px-0.5">
                          <span className="truncate max-w-[180px]">
                            {home.status === 'partner_ready' ? t('Partner Booking') : t('Coming Soon')} • {home.partnerName}
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${home.coordinates.lat},${home.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>{t('Map')}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3: 🧭 Tours & Activities
        ══════════════════════════════════════════════════════════════════════ */}
        {(activeCategory === 'all' || activeCategory === 'tours') && (
          <section id="booking-section-tours" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('Category 3 • Certified Guided Excursions')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{t('Tours & Activities')}</span>
                  <span className="text-2xl" aria-hidden="true">🧭</span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                  {t('Wildlife 4x4 safaris, deep ocean whale cruises, ancient fortress sunrise treks, and scenic tea train passes.')}
                </p>
              </div>
              <span className="text-xs font-bold text-stone-500">
                {t('Showing')} {filteredTours.length} {t('Curated Tours')}
              </span>
            </div>

            {filteredTours.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                {t('No tours found matching')} "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <div
                    key={tour.id}
                    id={`booking-card-${tour.id}`}
                    className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                  >
                    {/* Tour Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Duration & Region Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{tour.duration.split('(')[0].trim()}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-stone-200 text-[10px]">
                          {tour.region}
                        </span>
                      </div>

                      {/* Title on Image */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <h3 className="text-xl font-black tracking-tight leading-tight drop-shadow-xs">
                          {tour.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{tour.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2">
                        {/* Price Indicator */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-900 text-xs font-bold w-full">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{tour.priceIndicator}</span>
                        </div>

                        {/* Short Description */}
                        <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                          {tour.shortDescription}
                        </p>

                        {/* Highlights snippet */}
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                            {t('Key Highlights')}
                          </span>
                          <ul className="text-xs text-stone-700 space-y-0.5">
                            {tour.highlights.slice(0, 2).map((h, i) => (
                              <li key={i} className="flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="truncate">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Buttons: “View Details” and “Book Now” */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            id={`btn-tour-details-${tour.id}`}
                            onClick={() => setSelectedTourModal(tour)}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer touch-manipulation"
                          >
                            <Info className="w-3.5 h-3.5 text-stone-700" />
                            <span>{t('View Details')}</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-tour-book-${tour.id}`}
                            onClick={() => handleBookNow(tour, 'tour')}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold transition-colors cursor-pointer touch-manipulation shadow-2xs"
                          >
                            <span>{t('Book Now')}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                          </button>
                        </div>

                        {/* Partner Link Notice & Map Pin */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium px-0.5">
                          <span className="truncate max-w-[180px]">
                            {tour.status === 'partner_ready' ? t('Partner Booking') : t('Coming Soon')} • {tour.partnerName}
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${tour.coordinates.lat},${tour.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>{t('Meeting Pin')}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 4: 🚐 Transport & Transfers
        ══════════════════════════════════════════════════════════════════════ */}
        {(activeCategory === 'all' || activeCategory === 'transport') && (
          <section id="booking-section-transport" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 mb-1">
                  <Car className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t('Category 4 • Island-Wide Mobility')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{t('Transport & Transfers')}</span>
                  <span className="text-2xl" aria-hidden="true">🚐</span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                  {t('Airport transfers, private chauffeur tourist guides, and verified car & tuk-tuk rentals.')}
                </p>
              </div>
              <span className="text-xs font-bold text-stone-500">
                {t('3 Key Transit Services')}
              </span>
            </div>

            {/* 3 Core Transport Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredTransports.map((trans) => (
                <div
                  key={trans.id}
                  id={`booking-card-${trans.id}`}
                  className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={trans.image}
                      alt={trans.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-900/90 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                        {trans.type === 'airport'
                          ? t('Airport Transfers')
                          : trans.type === 'chauffeur'
                          ? t('Private Chauffeur')
                          : t('Car & Tuk-Tuk Rental')}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight drop-shadow-xs">
                        {trans.title}
                      </h3>
                      <p className="text-[11px] text-amber-300 font-medium truncate drop-shadow-xs mt-0.5">
                        {trans.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2.5">
                      <p className="text-stone-600 text-xs leading-relaxed">
                        {trans.shortDescription}
                      </p>

                      {/* Pricing Guide */}
                      <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-950 font-medium">
                        <span className="font-bold block text-[11px] text-blue-900">{t('Rates Guide:')}</span>
                        <span>{trans.pricingGuide}</span>
                      </div>

                      {/* Vehicle Options */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                          {t('Available Fleets')}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {trans.vehicleOptions.map((v, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Button: “Request Booking” */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <button
                        type="button"
                        id={`btn-request-booking-${trans.id}`}
                        onClick={() => {
                          setTransportRequestModal(trans);
                          setTransVehicle(trans.vehicleOptions[0] || 'Standard Vehicle');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 active:bg-blue-900 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer touch-manipulation shadow-2xs group"
                      >
                        <span>{t('Request Booking')}</span>
                        <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium px-0.5">
                        <span>{t('Partner Booking')} • {trans.partnerName}</span>
                        <span className="text-emerald-700 font-semibold">{t('Fixed & Transparent')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Existing On-Demand Ride-Hailing (PickMe & Uber) Integration */}
            <div className="bg-gradient-to-br from-white to-stone-100 rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                    <Smartphone className="w-3 h-3 text-emerald-700" />
                    <span>{t('Instant City Rides & Tuk-Tuks')}</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">
                    {t('On-Demand Ride-Hailing Apps in Sri Lanka')}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm">
                    {t('For immediate street pickups in Colombo, Kandy, Galle, and major coastal hubs, use Sri Lanka’s two official ride-hailing networks.')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PickMe Card */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-base shadow-2xs">
                        P
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-stone-900">PickMe Sri Lanka</h4>
                        <p className="text-[11px] text-stone-500">{t('Homegrown #1 Tuk-Tuk & Taxi App')}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-bold text-[10px]">
                      {t('Island-Wide')}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {t('Widely available for metered Tuk-Tuks, compact cars, large passenger vans, and express deliveries.')}
                  </p>
                  <a
                    href="https://pickme.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{t('Launch PickMe Official')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Uber Card */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-base shadow-2xs">
                        U
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-stone-900">Uber Sri Lanka</h4>
                        <p className="text-[11px] text-stone-500">{t('Global Reliability in Sri Lanka')}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                      {t('Urban & Airport')}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {t('Ideal for international credit cards, airport runs, Uber Auto (tuk-tuk), and Uber Premier sedans.')}
                  </p>
                  <a
                    href="https://m.uber.com/looking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black hover:bg-stone-900 text-white font-black text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{t('Launch Uber Sri Lanka')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 1: Availability & Booking Inquiry Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {availabilityModalItem && (
        <div
          id="booking-availability-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation animate-in fade-in duration-150"
          onClick={() => setAvailabilityModalItem(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-blue-950 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  {availabilityModalItem.type === 'hotel' ? t('Hotel / Resort Reservation') : t('Homestay Inquiry')}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {availabilityModalItem.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{availabilityModalItem.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAvailabilityModalItem(null)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSendInquiry} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">{t('Estimated Seasonal Guide:')}</span>
                <span className="font-black text-stone-900">{availabilityModalItem.priceIndicator}</span>
              </div>

              {/* Check-In / Out Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Check-in Date')}</label>
                  <input
                    type="date"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Check-out Date')}</label>
                  <input
                    type="date"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">{t('Travelers / Guests')}</label>
                <select
                  value={formGuests}
                  onChange={(e) => setFormGuests(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                >
                  <option value="1 Solo Traveler">{t('1 Solo Traveler')}</option>
                  <option value="2 Guests (1 Room)">{t('2 Guests (1 Double/Twin Room)')}</option>
                  <option value="3 Guests (Triple)">{t('3 Guests (1 Triple Room)')}</option>
                  <option value="4+ Family / Group">{t('4+ Family / Group (2+ Rooms)')}</option>
                </select>
              </div>

              {/* Traveler Contact */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  {t('Your WhatsApp Number or Email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder={t('+94 77 123 4567 or yourname@gmail.com')}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                  required
                />
                <span className="text-[10px] text-stone-400 block">
                  {t('Used strictly to send your reservation confirmation & partner verification.')}
                </span>
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">{t('Special Requests (Optional)')}</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t('e.g. Airport pickup required, king bed, vegetarian meals, early arrival...')}
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  {t('Send Reservation Request to Host / Partner')}
                </button>

                {availabilityModalItem.partnerUrl && (
                  <a
                    href={availabilityModalItem.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>{t('Open Official Partner Portal Directly')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 2: Tour Details Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedTourModal && (
        <div
          id="booking-tour-details-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation animate-in fade-in duration-150"
          onClick={() => setSelectedTourModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-56 w-full bg-stone-900 shrink-0">
              <img
                src={selectedTourModal.image}
                alt={selectedTourModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedTourModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black shadow-xs">
                  {selectedTourModal.duration}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-xs">
                  {selectedTourModal.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedTourModal.location}</span>
                </div>
              </div>
            </div>

            {/* Tour Details Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 font-medium">
                <span className="font-bold block text-[11px] text-amber-900">{t('Pricing & Capacity:')}</span>
                <span>{selectedTourModal.priceIndicator} • {selectedTourModal.groupSize}</span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-stone-900 uppercase tracking-wider text-[11px]">
                  {t('Experience Overview')}
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {selectedTourModal.shortDescription}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <h4 className="font-black text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('Tour Highlights')}</span>
                </h4>
                <ul className="space-y-1 text-stone-700">
                  {selectedTourModal.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is Included & What to Bring */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="font-bold text-stone-900 block text-[11px]">{t('Included:')}</span>
                  <ul className="space-y-1 text-stone-600">
                    {selectedTourModal.includes.map((inc, i) => (
                      <li key={i}>• {inc}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="font-bold text-stone-900 block text-[11px]">{t('What to Bring:')}</span>
                  <ul className="space-y-1 text-stone-600">
                    {selectedTourModal.whatToBring.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting Point & Navigation */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block text-[11px]">{t('Meeting Point:')}</span>
                  <span className="text-emerald-900">{selectedTourModal.meetingPoint}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTourModal.coordinates.lat},${selectedTourModal.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
                >
                  <Navigation className="w-3 h-3 text-amber-300" />
                  <span>{t('Navigate')}</span>
                </a>
              </div>

              {/* Book Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTourModal(null);
                    setAvailabilityModalItem({
                      type: 'hotel',
                      title: selectedTourModal.name,
                      location: selectedTourModal.location,
                      image: selectedTourModal.image,
                      priceIndicator: selectedTourModal.priceIndicator,
                      partnerName: selectedTourModal.partnerName,
                      partnerUrl: selectedTourModal.partnerUrl,
                      coordinates: selectedTourModal.coordinates,
                    });
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{t('Book This Tour Experience')}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 3: Transport Booking Request Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {transportRequestModal && (
        <div
          id="booking-transport-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation animate-in fade-in duration-150"
          onClick={() => setTransportRequestModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-sky-950 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                  {t('Transport Booking Concierge')}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {transportRequestModal.title}
                </h3>
                <p className="text-xs text-stone-300">{transportRequestModal.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setTransportRequestModal(null)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transport Request Form */}
            <form onSubmit={handleSendInquiry} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950 font-medium">
                <span className="font-bold block text-[11px] text-blue-900">{t('Standard Pricing:')}</span>
                <span>{transportRequestModal.pricingGuide}</span>
              </div>

              {/* Pickup & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Pickup Location')}</label>
                  <input
                    type="text"
                    value={transPickup}
                    onChange={(e) => setTransPickup(e.target.value)}
                    placeholder={t('e.g. BIA Colombo Airport or Hotel')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Destination')}</label>
                  <input
                    type="text"
                    value={transDropoff}
                    onChange={(e) => setTransDropoff(e.target.value)}
                    placeholder={t('e.g. Kandy, Galle, Sigiriya...')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Date of Transit')}</label>
                  <input
                    type="date"
                    value={transDate}
                    onChange={(e) => setTransDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Pickup Time / Flight #')}</label>
                  <input
                    type="text"
                    value={transTime}
                    onChange={(e) => setTransTime(e.target.value)}
                    placeholder={t('e.g. 10:30 AM or UL 504')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Selection & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Preferred Fleet')}</label>
                  <select
                    value={transVehicle}
                    onChange={(e) => setTransVehicle(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                  >
                    {transportRequestModal.vehicleOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">{t('Passengers & Luggage')}</label>
                  <select
                    value={transPassengers}
                    onChange={(e) => setTransPassengers(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                  >
                    <option value="1 Passenger, 1 Luggage">{t('1 Pax, 1 Suitcase')}</option>
                    <option value="2 Passengers, 2 Luggage">{t('2 Pax, 2 Suitcases')}</option>
                    <option value="3-4 Passengers, 3-4 Luggage">{t('3-4 Pax, Family Bags')}</option>
                    <option value="5-8 Group, Large Luggage">{t('5-8 Group, Large Luggage')}</option>
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  {t('Your WhatsApp or Phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder={t('+94 77 123 4567 or international number')}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-blue-800"
                  required
                />
                <span className="text-[10px] text-stone-400 block">
                  {t('Our chauffeur dispatch coordinator will verify the flight & driver details via WhatsApp.')}
                </span>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  {t('Submit Transport Booking Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 4: Payment Methods & Sandbox Checkout Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {paymentCheckoutModal && (
        <PaymentMethodsModal
          isOpen={!!paymentCheckoutModal}
          onClose={() => setPaymentCheckoutModal(null)}
          bookingTitle={paymentCheckoutModal.title}
          amountUsd={paymentCheckoutModal.amountUsd}
          customerName={paymentCheckoutModal.customerName || t('Valued Traveler')}
          onPaymentComplete={(tx) => {
            setInquirySuccessMessage(
              `${t('Payment confirmed for')} ${paymentCheckoutModal.title}. ${t('Reference:')} ${tx.id}. ${t('Official receipt generated.')}`
            );
          }}
        />
      )}
    </div>
  );
};
