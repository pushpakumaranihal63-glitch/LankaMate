import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Compass,
  Copy,
  Heart,
  Hotel as HotelIcon,
  Info,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
  Wifi,
  X,
  Bed,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  Wallet,
  ArrowRight,
  ShieldAlert,
  FileText,
  Printer,
} from 'lucide-react';
import { Hotel, HotelBooking, PageId } from '../types';
import { DetectedLocationInfo } from '../utils/locationHelper';
import { useTranslation } from '../i18n/LanguageContext';

export type SupportedCurrency = 'USD' | 'LKR' | 'EUR' | 'GBP';

interface CurrencyRateInfo {
  symbol: string;
  label: string;
  name: string;
  rateFromUsd: number;
}

const CURRENCY_RATES: Record<SupportedCurrency, CurrencyRateInfo> = {
  USD: { symbol: '$', label: 'USD', name: 'US Dollar', rateFromUsd: 1.0 },
  LKR: { symbol: 'Rs', label: 'LKR', name: 'Sri Lankan Rupee', rateFromUsd: 310.0 },
  EUR: { symbol: '€', label: 'EUR', name: 'Euro', rateFromUsd: 0.92 },
  GBP: { symbol: '£', label: 'GBP', name: 'British Pound', rateFromUsd: 0.78 },
};

type PaymentMethodType = 'demo-card' | 'lankapay' | 'bank-transfer' | 'pay-on-arrival';

interface HotelDetailPageProps {
  hotel: Hotel;
  activeLocation: DetectedLocationInfo | null;
  onClose: () => void;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
  onBookingConfirmed: (booking: HotelBooking) => void;
  onOpenInquiry: (hotel: Hotel) => void;
  onNavigatePage?: (page: PageId) => void;
  onOpenMyBookings?: () => void;
}

export const HotelDetailPage: React.FC<HotelDetailPageProps> = ({
  hotel,
  activeLocation,
  onClose,
  onToggleFavourite,
  isFavourite,
  onBookingConfirmed,
  onOpenInquiry,
  onNavigatePage,
  onOpenMyBookings,
}) => {
  const { t } = useTranslation();
  // Tomorrow's date as default check-in
  const defaultCheckIn = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // 3 days after tomorrow as default check-out
  const defaultCheckOut = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  }, []);

  // Booking Parameters State
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string>(
    hotel.roomTypes[0] || 'Standard Room'
  );
  const [checkInDate, setCheckInDate] = useState<string>(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [roomsCount, setRoomsCount] = useState<number>(1);

  // Currency Selector: USD / LKR / EUR / GBP
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD');

  // Flow State: 'details' -> 'summary' -> 'payment' -> 'confirmed-screen'
  const [flowStep, setFlowStep] = useState<'details' | 'summary' | 'payment' | 'confirmed-screen'>('details');

  // Guest Information Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Payment Screen State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('demo-card');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Confirmed Booking Output
  const [confirmedBooking, setConfirmedBooking] = useState<HotelBooking | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Calculate number of nights
  const nightsCount = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [checkInDate, checkOutDate]);

  // Pricing calculations according to selected currency
  const pricePerNightConverted = useMemo(() => {
    if (selectedCurrency === 'LKR') return hotel.pricePerNightLkr;
    if (selectedCurrency === 'EUR') return Math.round(hotel.pricePerNightUsd * 0.92);
    if (selectedCurrency === 'GBP') return Math.round(hotel.pricePerNightUsd * 0.78);
    return hotel.pricePerNightUsd;
  }, [hotel, selectedCurrency]);

  const totalConverted = useMemo(() => {
    return pricePerNightConverted * nightsCount * roomsCount;
  }, [pricePerNightConverted, nightsCount, roomsCount]);

  // Formatted price string helper
  const formatAmount = (amt: number, curr: SupportedCurrency) => {
    if (curr === 'USD') return `$${Math.round(amt).toLocaleString()} USD`;
    if (curr === 'LKR') return `LKR ${Math.round(amt).toLocaleString()}`;
    if (curr === 'EUR') return `€${Math.round(amt).toLocaleString()} EUR`;
    if (curr === 'GBP') return `£${Math.round(amt).toLocaleString()} GBP`;
    return `$${Math.round(amt).toLocaleString()}`;
  };

  // Base USD & LKR totals for persistent records
  const totalUsd = hotel.pricePerNightUsd * nightsCount * roomsCount;
  const totalLkr = hotel.pricePerNightLkr * nightsCount * roomsCount;

  // Handlers for step navigation
  const handleProceedToSummary = () => {
    setFormError(null);
    setFlowStep('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError(t('Please enter your full name.'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError(t('Please enter a valid email address.'));
      return;
    }
    if (!phone.trim()) {
      setFormError(t('Please enter a contact phone number.'));
      return;
    }

    setFormError(null);
    setFlowStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Payment in Demo Mode
  const handleExecutePayNow = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const refNum = `LM-BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const paymentMethodNames: Record<PaymentMethodType, string> = {
        'demo-card': 'Credit/Debit Card (Demo Sandbox)',
        'lankapay': 'LankaPay / QR Wallet (Demo)',
        'bank-transfer': 'Direct Bank Deposit (Demo)',
        'pay-on-arrival': 'Pay on Arrival at Hotel',
      };

      const newBooking: HotelBooking = {
        id: `booking-${Date.now()}`,
        referenceNumber: refNum,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        destinationName: hotel.destinationName,
        region: hotel.region,
        roomType: selectedRoomType,
        checkInDate,
        checkOutDate,
        nights: nightsCount,
        roomsCount,
        guestsCount,
        pricePerNightUsd: hotel.pricePerNightUsd,
        pricePerNightLkr: hotel.pricePerNightLkr,
        totalUsd,
        totalLkr,
        currency: selectedCurrency,
        paymentMethod: paymentMethodNames[selectedPaymentMethod],
        paidAmountFormatted: formatAmount(totalConverted, selectedCurrency),
        guestName: fullName.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        specialRequests: specialRequests.trim() || undefined,
        status: 'Confirmed',
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);

      // Ensure immediate persistence in localStorage for LankaMate My Trips / Profile
      try {
        const raw = localStorage.getItem('lankamate_hotel_bookings');
        const list = raw ? JSON.parse(raw) : [];
        const updated = [newBooking, ...list.filter((b: any) => b.id !== newBooking.id)];
        localStorage.setItem('lankamate_hotel_bookings', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      setFlowStep('confirmed-screen');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1300);
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <button
            id="btn-back-to-hotels"
            onClick={onClose}
            className="flex items-center gap-2 text-stone-700 hover:text-emerald-900 text-xs sm:text-sm font-bold transition-colors cursor-pointer py-1 px-2.5 -ml-2.5 rounded-xl hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Hotels Catalog')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onToggleFavourite({
                  id: hotel.id,
                  type: 'hotel',
                  title: hotel.name,
                  subtitle: `${hotel.destinationName} • $${hotel.pricePerNightUsd}/night`,
                  image: hotel.image,
                  linkPage: 'hotels',
                  targetId: hotel.id,
                })
              }
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isFavourite(hotel.id)
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title={t('Save to Favourites')}
            >
              <Heart
                className={`w-4 h-4 ${isFavourite(hotel.id) ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="hidden sm:inline">
                {isFavourite(hotel.id) ? t('Saved') : t('Save')}
              </span>
            </button>

            <button
              onClick={() => onOpenInquiry(hotel)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-600 text-stone-700 hover:text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {t('Inquire Only')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================================= */}
        {/* STEP 1: DETAILED HOTEL PAGE */}
        {/* ========================================================================= */}
        {flowStep === 'details' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Image & Headline Header */}
            <div className="relative rounded-3xl overflow-hidden shadow-md bg-stone-900 border border-stone-200">
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.starRating} {t('Star Heritage')}</span>
                  </span>
                  {hotel.badge && (
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/30">
                      ★ {hotel.badge}
                    </span>
                  )}
                </div>

                {/* Distance Badge if location active */}
                {hotel.distanceKm !== undefined && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-black shadow-md">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{hotel.distanceKm < 1 ? t('Less than 1 km away') : `${hotel.distanceKm} km ${t('away')}`}</span>
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs sm:text-sm font-bold mb-1">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{hotel.destinationName} • {hotel.region}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-200">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      ★ {hotel.rating} / 5.0
                    </span>
                    <span>•</span>
                    <span>{hotel.reviewsCount} {t('verified guest reviews')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance Callout Banner */}
            {activeLocation && (
              <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      {t('Distance from Your Search Location')}
                    </span>
                    <p className="text-stone-800 text-xs sm:text-sm font-medium">
                      {t('Calculated from')} <strong>{activeLocation.city || t('Detected Location')}</strong>
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-emerald-200 px-4 py-2 rounded-xl text-emerald-950 font-black text-sm sm:text-base shrink-0 shadow-2xs">
                  {hotel.distanceKm !== undefined
                    ? hotel.distanceKm < 1
                      ? t('Less than 1 km away')
                      : `${hotel.distanceKm} km ${t('away')}`
                    : t('Distance calculated via GPS')}
                </div>
              </div>
            )}

            {/* Main Content Grid: Left details + Right sticky booking panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (2 Cols): Overview, Amenities, Room Types */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description Card */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                  <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{t('About')} {hotel.name}</span>
                  </h2>
                  <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                    {hotel.description}
                  </p>

                  <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                    <div className="bg-stone-50 rounded-xl p-2.5">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Region')}</span>
                      <span className="font-bold text-stone-800">{t(hotel.region)}</span>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-2.5">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Heritage Class')}</span>
                      <span className="font-bold text-stone-800">{hotel.starRating} {t('Stars Luxury')}</span>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Pricing Tier')}</span>
                      <span className="font-bold text-emerald-800">${hotel.pricePerNightUsd} USD / night</span>
                    </div>
                  </div>
                </div>

                {/* Available Room Types */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                      <Bed className="w-4 h-4 text-emerald-600" />
                      <span>{t('Available Room Types')}</span>
                    </h2>
                    <span className="text-xs text-stone-500 font-medium">{t('Select your preferred room')}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {hotel.roomTypes.map((room, idx) => {
                      const isSelected = selectedRoomType === room;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedRoomType(room)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                              : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                              {t('Option')} {idx + 1}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>
                          <h4 className="font-black text-stone-900 text-sm">{room}</h4>
                          <p className="text-[11px] text-stone-500 mt-1">
                            {t('Air-conditioned, private bath, balcony view')}
                          </p>
                          <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                            <span className="text-stone-500">{t('Base rate:')}</span>
                            <span className="font-bold text-emerald-950">
                              ${hotel.pricePerNightUsd} USD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hotel Amenities & Facilities */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span>{t('Amenities & Services')}</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {hotel.facilities.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p>
                      <strong>{t('Authentic Hospitality Guarantee:')}</strong> {t('Welcome king coconut drink upon arrival, daily complimentary Ceylon tea tastings, and on-site safari/trekking concierge assistance.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Booking Widget & Clear Price Calculation */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg sticky top-20 space-y-5">
                  <div className="border-b border-stone-100 pb-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 block uppercase font-bold">
                          {t('Starting From')}
                        </span>
                        <div className="text-2xl font-black text-emerald-950">
                          ${hotel.pricePerNightUsd} <span className="text-xs font-semibold text-stone-500">{t('USD / night')}</span>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500">
                        ~{hotel.pricePerNightLkr.toLocaleString()} LKR
                      </span>
                    </div>
                    <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100/70 font-semibold px-2 py-0.5 rounded-md">
                      ★ {t('Demo Rate')} • {t('No Immediate Payment Required')}
                    </span>
                  </div>

                  {/* Booking Fields */}
                  <div className="space-y-3.5 text-xs">
                    {/* Check-in & Check-out */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('Check-in')}</span>
                        </label>
                        <input
                          type="date"
                          value={checkInDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('Check-out')}</span>
                        </label>
                        <input
                          type="date"
                          value={checkOutDate}
                          min={checkInDate || defaultCheckIn}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-emerald-700"
                        />
                      </div>
                    </div>

                    {/* Guests & Rooms */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('Guests')}</span>
                        </label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-emerald-700"
                        >
                          {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? t('Guest') : t('Guests')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('Rooms')}</span>
                        </label>
                        <select
                          value={roomsCount}
                          onChange={(e) => setRoomsCount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:border-emerald-700"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? t('Room') : t('Rooms')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Selected Room Type Reminder */}
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-stone-600">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        {t('Selected Room Option')}
                      </span>
                      <span className="font-bold text-stone-900 text-xs">{selectedRoomType}</span>
                    </div>
                  </div>

                  {/* Clear Price Calculation Breakdown */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2.5 text-xs">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 block">
                      {t('Price Calculation')}
                    </span>

                    <div className="flex items-center justify-between text-stone-700">
                      <span>{t('Price per night:')}</span>
                      <span className="font-bold">${hotel.pricePerNightUsd} USD</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-700">
                      <span>{t('Stay duration:')}</span>
                      <span className="font-bold">{nightsCount} {nightsCount === 1 ? t('night') : t('nights')}</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-700">
                      <span>{t('Number of rooms:')}</span>
                      <span className="font-bold">{roomsCount} {roomsCount === 1 ? t('room') : t('rooms')}</span>
                    </div>

                    <div className="text-[11px] text-stone-500 pt-1 border-t border-emerald-200/60 font-mono">
                      ${hotel.pricePerNightUsd} × {nightsCount} {t('nights')} × {roomsCount} {roomsCount === 1 ? t('room') : t('rooms')}
                    </div>

                    <div className="pt-2 border-t border-emerald-200 flex items-baseline justify-between">
                      <div>
                        <span className="font-black text-emerald-950 text-sm block">{t('Estimated Total')}</span>
                        <span className="text-[10px] text-stone-500 block">{t('Taxes & breakfast included')}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-950">
                          ${totalUsd} USD
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium">
                          ~{totalLkr.toLocaleString()} LKR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prominent Book Now Button */}
                  <button
                    id="btn-hotel-book-now"
                    onClick={handleProceedToSummary}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-2xl text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <HotelIcon className="w-4 h-4" />
                    <span>{t('Book Now')} • {t('View Summary')} (${totalUsd} USD)</span>
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => onOpenInquiry(hotel)}
                      className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer underline"
                    >
                      {t('Need custom dates or special safari group? Inquire here')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: FINAL BOOKING SUMMARY BEFORE PAYMENT */}
        {/* ========================================================================= */}
        {flowStep === 'summary' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Header & Back to Details */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <button
                  id="btn-back-to-room-select"
                  onClick={() => setFlowStep('details')}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('Modify Dates & Room Selection')}</span>
                </button>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {t('Final Booking Summary')}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t('Review your reservation details and select your preferred currency before payment.')}
                </p>
              </div>
            </div>

            {/* Currency Selector Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-400 block">
                  {t('Select Currency')}
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  {t('Currently Viewing in')} <strong>{CURRENCY_RATES[selectedCurrency].name} ({selectedCurrency})</strong>
                </p>
              </div>

              {/* Currency Selector Buttons */}
              <div
                id="currency-selector-group"
                className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200/90 self-start sm:self-auto"
              >
                {(['USD', 'LKR', 'EUR', 'GBP'] as SupportedCurrency[]).map((curr) => {
                  const isActive = selectedCurrency === curr;
                  return (
                    <button
                      key={curr}
                      id={`currency-btn-${curr}`}
                      type="button"
                      onClick={() => setSelectedCurrency(curr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      {CURRENCY_RATES[curr].symbol} {curr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Final Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-5">
              {/* Hotel Overview Header in Summary */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-stone-100">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full sm:w-28 h-36 sm:h-28 rounded-2xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                      ★ {hotel.starRating} {t('Stars Luxury')}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {hotel.region}
                    </span>
                  </div>
                  {/* Hotel Name */}
                  <h3 className="font-black text-stone-900 text-xl tracking-tight">
                    {hotel.name}
                  </h3>
                  {/* Hotel Location */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{t('Location:')} <strong>{hotel.destinationName}, Sri Lanka</strong></span>
                  </div>
                  {hotel.distanceKm !== undefined && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold pt-0.5">
                      <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{hotel.distanceKm < 1 ? t('Less than 1 km away') : `${hotel.distanceKm} km ${t('from search location')}`}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exact Required Summary Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {/* Room Type */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Room Type')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {selectedRoomType}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Balcony & En-suite')}</span>
                </div>

                {/* Check-in Date */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Check-in Date')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {checkInDate}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Standard 2:00 PM')}</span>
                </div>

                {/* Check-out Date */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Check-out Date')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {checkOutDate}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Standard 11:00 AM')}</span>
                </div>

                {/* Number of Nights */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Number of Nights')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {nightsCount} {nightsCount === 1 ? t('Night') : t('Nights')}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Duration')}</span>
                </div>

                {/* Guests */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Guests')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {guestsCount} {guestsCount === 1 ? t('Guest') : t('Guests')}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Adults / Family')}</span>
                </div>

                {/* Number of Rooms */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-1">
                    {t('Number of Rooms')}
                  </span>
                  <span className="font-black text-stone-900 text-sm block">
                    {roomsCount} {roomsCount === 1 ? t('Room') : t('Rooms')}
                  </span>
                  <span className="text-[11px] text-stone-500">{t('Reserved Units')}</span>
                </div>
              </div>

              {/* Price Calculation & Estimated Total Highlight Box */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
                  <div>
                    {/* Price per night */}
                    <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider block">
                      {t('Price Per Night')} ({selectedCurrency})
                    </span>
                    <span className="text-lg font-black text-emerald-950">
                      {formatAmount(pricePerNightConverted, selectedCurrency)}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-500 block font-medium">
                      {t('Stay Formula')}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-900">
                      {formatAmount(pricePerNightConverted, selectedCurrency)} × {nightsCount} {t('nights')} × {roomsCount} {roomsCount === 1 ? t('room') : t('rooms')}
                    </span>
                  </div>
                </div>

                {/* Estimated Total Price */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                      {t('Estimated Total Price')}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {t('Includes service charge, heritage preservation fee & Sri Lankan taxes')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      id="summary-total-amount"
                      className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight"
                    >
                      {formatAmount(totalConverted, selectedCurrency)}
                    </div>
                    {selectedCurrency !== 'USD' && (
                      <span className="text-[11px] text-stone-500 block">
                        {t('Equivalent to approx.')} ${totalUsd} USD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details Entry Form */}
            <form onSubmit={handleProceedToPayment} className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{t('Guest Details for Reservation Voucher')}</span>
                </h3>
                <span className="text-[11px] text-stone-400">{t('Required before payment')}</span>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t('Primary Guest Full Name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-guest-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('e.g. Kasun Silva / Sarah Jenkins')}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      {t('Email Address')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-guest-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('e.g. guest@example.com')}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      {t('Contact Phone / WhatsApp')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-guest-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('e.g. +94 77 123 4567 / +44 7911 123456')}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t('Special Requests or Arrival Notes (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={t('e.g. Late check-in after 6 PM, quiet room, honeymoon arrangement...')}

                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Action Buttons: Continue to Payment */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setFlowStep('details')}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  ← {t('Edit Room & Dates')}
                </button>

                <button
                  id="btn-continue-to-payment"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t('Continue to Payment')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PAYMENT SCREEN (DEMO / TEST PAYMENT FLOW) */}
        {/* ========================================================================= */}
        {flowStep === 'payment' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <button
                  id="btn-back-to-summary"
                  onClick={() => setFlowStep('summary')}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('Back to Booking Summary')}</span>
                </button>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {t('Checkout & Payment')}
                </h2>
                <p className="text-xs text-stone-500">
                  {t('Select your payment method and complete your reservation.')}
                </p>
              </div>
            </div>

            {/* Prominent Demo Mode Disclaimer Banner */}
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-amber-900 block uppercase tracking-wider text-[11px]">
                  {t('Sandbox Demo Payment Flow')}
                </span>
                <p className="mt-0.5 text-stone-700 leading-relaxed">
                  {t('This checkout is running in')} <strong>{t('Demo Mode')}</strong>. {t('No real credit card or bank payments will be processed, and no real financial information is collected or stored.')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 Cols): Payment Method Options UI */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span>{t('Select Payment Method')}</span>
                    </h3>
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      4 {t('Options Available')}
                    </span>
                  </div>

                  {/* Payment Method Options UI List */}
                  <div className="space-y-3">
                    {/* Option 1: Credit / Debit Card (Demo) */}
                    <div
                      id="payment-opt-demo-card"
                      onClick={() => setSelectedPaymentMethod('demo-card')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPaymentMethod === 'demo-card'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <CreditCard className="w-5 h-5 text-emerald-800" />
                          </div>
                          <div>
                            <span className="font-black text-stone-900 text-sm block">
                              {t('Credit or Debit Card (Demo Test Card)')}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {t('Visa, Mastercard, Amex • Sandbox Simulated')}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                            selectedPaymentMethod === 'demo-card'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {selectedPaymentMethod === 'demo-card' && (
                            <Check className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Simulated Card Details when selected */}
                      {selectedPaymentMethod === 'demo-card' && (
                        <div className="mt-4 pt-3 border-t border-emerald-200/80 space-y-3 animate-in fade-in duration-150 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                              {t('Simulated Test Card Number')}
                            </label>
                            <div className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-stone-800 flex items-center justify-between text-xs">
                              <span>4242 •••• •••• 4242</span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {t('Test Ready')}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                                {t('Expiry Date')}
                              </label>
                              <div className="px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-stone-800 text-xs">
                                12 / 28
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                                {t('CVC Code')}
                              </label>
                              <div className="px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-stone-800 text-xs">
                                ••• (888)
                              </div>
                            </div>
                          </div>

                          <p className="text-[10px] text-stone-500 italic">
                            {t('Pre-configured for sandbox testing. No real card verification or storage.')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Option 2: LankaPay / Genie / FriMi (Sri Lanka Mobile Wallets) */}
                    <div
                      id="payment-opt-lankapay"
                      onClick={() => setSelectedPaymentMethod('lankapay')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPaymentMethod === 'lankapay'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <QrCode className="w-5 h-5 text-amber-800" />
                          </div>
                          <div>
                            <span className="font-black text-stone-900 text-sm block">
                              {t('LankaPay QR / FriMi / Genie (Demo)')}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {t('National Payment Network & Mobile Wallets')}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                            selectedPaymentMethod === 'lankapay'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {selectedPaymentMethod === 'lankapay' && (
                            <Check className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>

                      {selectedPaymentMethod === 'lankapay' && (
                        <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-stone-600 animate-in fade-in duration-150">
                          <p className="text-[11px] bg-white p-2.5 rounded-xl border border-stone-200">
                            <strong>{t('Simulated LankaPay Flow:')}</strong> {t('A demo QR authorization will automatically approve upon tapping Pay Now.')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Option 3: Direct Bank Deposit (Commercial Bank / HNB Demo) */}
                    <div
                      id="payment-opt-bank-transfer"
                      onClick={() => setSelectedPaymentMethod('bank-transfer')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPaymentMethod === 'bank-transfer'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <Building2 className="w-5 h-5 text-blue-800" />
                          </div>
                          <div>
                            <span className="font-black text-stone-900 text-sm block">
                              {t('Direct Bank Transfer / Deposit (Demo)')}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {t('Commercial Bank of Ceylon / Hatton National Bank')}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                            selectedPaymentMethod === 'bank-transfer'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {selectedPaymentMethod === 'bank-transfer' && (
                            <Check className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>

                      {selectedPaymentMethod === 'bank-transfer' && (
                        <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-stone-600 animate-in fade-in duration-150">
                          <p className="text-[11px] bg-white p-2.5 rounded-xl border border-stone-200">
                            <strong>{t('Bank Transfer Notice:')}</strong> {t('Demo booking reference will act as your deposit voucher. No physical slip upload required.')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Option 4: Pay Upon Arrival at Hotel Desk */}
                    <div
                      id="payment-opt-pay-on-arrival"
                      onClick={() => setSelectedPaymentMethod('pay-on-arrival')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPaymentMethod === 'pay-on-arrival'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <Wallet className="w-5 h-5 text-stone-800" />
                          </div>
                          <div>
                            <span className="font-black text-stone-900 text-sm block">
                              {t('Pay on Arrival at Hotel')}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {t('Zero pre-payment • Settle at front reception desk')}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                            selectedPaymentMethod === 'pay-on-arrival'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {selectedPaymentMethod === 'pay-on-arrival' && (
                            <Check className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>

                      {selectedPaymentMethod === 'pay-on-arrival' && (
                        <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-stone-600 animate-in fade-in duration-150">
                          <p className="text-[11px] bg-white p-2.5 rounded-xl border border-stone-200">
                            <strong>{t('Arrival Guarantee:')}</strong> {t('Your room is reserved. Payment will be collected in person upon arrival via Cash or Card.')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (1 Col): Booking Summary & Total Amount & Pay Now Button */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-md space-y-4">
                  <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider pb-2 border-b border-stone-100">
                    {t('Booking Summary')}
                  </h3>

                  {/* Summary Details */}
                  <div className="space-y-2 text-xs text-stone-600">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Hotel')}</span>
                      <strong className="text-stone-900 font-black">{hotel.name}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Location')}</span>
                      <span className="text-stone-800">{hotel.destinationName}, Sri Lanka</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Room Type')}</span>
                      <span className="text-stone-800">{selectedRoomType}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Check-in')}</span>
                        <span className="text-stone-800 font-semibold">{checkInDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Check-out')}</span>
                        <span className="text-stone-800 font-semibold">{checkOutDate}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Duration & Units')}</span>
                      <span className="text-stone-800 font-semibold">
                        {nightsCount} {t('Nights')} • {roomsCount} {roomsCount === 1 ? t('Room') : t('Rooms')} • {guestsCount} {t('Guests')}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('Guest Name')}</span>
                      <span className="text-stone-800 font-semibold truncate block">{fullName || t('Guest')}</span>
                    </div>
                  </div>

                  {/* Total Amount Box */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                      {t('Total Amount')} ({selectedCurrency})
                    </span>
                    <div
                      id="payment-screen-total-amount"
                      className="text-2xl font-black text-emerald-950"
                    >
                      {formatAmount(totalConverted, selectedCurrency)}
                    </div>
                    {selectedCurrency !== 'USD' && (
                      <span className="text-[11px] text-stone-500 block">
                        {t('Approx.')} ${totalUsd} USD
                      </span>
                    )}
                  </div>

                  {/* “Pay Now” Button */}
                  <button
                    id="btn-pay-now"
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleExecutePayNow}
                    className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:bg-stone-400 text-white rounded-2xl text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('Processing Booking…')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-emerald-300" />
                        <span>{t('Pay Now')} • {formatAmount(totalConverted, selectedCurrency)}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setFlowStep('summary')}
                      className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer underline"
                    >
                      {t('Change currency or edit details')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Booking Overlay */}
        {isProcessingPayment && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-800">
                <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-emerald-950">{t('Processing Booking…')}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('Completing demo reservation for')} <strong>{hotel.name}</strong>.
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('Demo Sandbox Mode')} • {t('No real money or card details processed')}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: BOOKING CONFIRMED SCREEN */}
        {/* ========================================================================= */}
        {flowStep === 'confirmed-screen' && confirmedBooking && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
              {/* Header: ✅ Booking Confirmed */}
              <div className="text-center space-y-3 pb-5 border-b border-stone-100">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>✅ {t('Booking Confirmed')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                    {t('Booking Confirmed!')}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                    {t('Thank you,')} <strong>{confirmedBooking.guestName}</strong>. {t('Your demo reservation for')}{' '}
                    <strong>{confirmedBooking.hotelName}</strong> {t('has been logged in your LankaMate trip records.')}
                  </p>
                </div>

                {/* Unique Booking Reference Number Card */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between gap-4 mt-2">
                  <div className="text-left">
                    <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">
                      {t('Unique Booking Reference Number')}
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-black text-emerald-950 tracking-wider">
                      {confirmedBooking.referenceNumber}
                    </span>
                  </div>
                  <button
                    id="btn-copy-booking-ref"
                    onClick={() => handleCopyReference(confirmedBooking.referenceNumber)}
                    className="px-3 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                    title={t('Copy Reference Number')}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 text-xs">{t('Copied!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-xs">{t('Copy Ref')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Exact Confirmed Booking Details Summary Box */}
              <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200/90 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <HotelIcon className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                      {t('Confirmed Reservation Summary')}
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-0.5 rounded-full">
                    ★ {confirmedBooking.status} ({t('Demo')})
                  </span>
                </div>

                {/* Hotel Name and Location */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider">
                      {t('Hotel Name')}
                    </span>
                    <h3 className="font-black text-stone-900 text-base sm:text-lg">
                      {confirmedBooking.hotelName}
                    </h3>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider">
                      {t('Location')}
                    </span>
                    <span className="font-bold text-stone-800 text-xs sm:text-sm flex sm:justify-end items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{confirmedBooking.destinationName}, Sri Lanka</span>
                    </span>
                  </div>
                </div>

                {/* Grid for Required Summary Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* Room type */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-0.5">
                      {t('Room Type')}
                    </span>
                    <span className="font-black text-stone-900 text-sm block">
                      {confirmedBooking.roomType}
                    </span>
                    <span className="text-[11px] text-stone-500">{t('Reserved Suite')}</span>
                  </div>

                  {/* Check-in date */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-0.5">
                      {t('Check-in Date')}
                    </span>
                    <span className="font-black text-stone-900 text-sm block">
                      {confirmedBooking.checkInDate}
                    </span>
                    <span className="text-[11px] text-stone-500">{t('From 2:00 PM')}</span>
                  </div>

                  {/* Check-out date */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-0.5">
                      {t('Check-out Date')}
                    </span>
                    <span className="font-black text-stone-900 text-sm block">
                      {confirmedBooking.checkOutDate}
                    </span>
                    <span className="text-[11px] text-stone-500">{t('Until 11:00 AM')}</span>
                  </div>

                  {/* Number of nights */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-0.5">
                      {t('Number of Nights')}
                    </span>
                    <span className="font-black text-stone-900 text-sm block">
                      {confirmedBooking.nights} {confirmedBooking.nights === 1 ? t('Night') : t('Nights')}
                    </span>
                    <span className="text-[11px] text-stone-500">{t('Stay Duration')}</span>
                  </div>

                  {/* Guests */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider mb-0.5">
                      {t('Guests')}
                    </span>
                    <span className="font-black text-stone-900 text-sm block">
                      {confirmedBooking.guestsCount} {confirmedBooking.guestsCount === 1 ? t('Guest') : t('Guests')}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {confirmedBooking.roomsCount} {confirmedBooking.roomsCount === 1 ? t('Room') : t('Rooms')}
                    </span>
                  </div>

                  {/* Total estimated amount */}
                  <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block font-black uppercase tracking-wider mb-0.5">
                      {t('Total Estimated Amount')}
                    </span>
                    <span className="font-black text-emerald-950 text-base sm:text-lg block">
                      {confirmedBooking.paidAmountFormatted || `$${confirmedBooking.totalUsd} USD`}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block truncate">
                      {confirmedBooking.paymentMethod || t('Demo Payment')}
                    </span>
                  </div>
                </div>

                {/* Primary Guest Details */}
                <div className="pt-2 border-t border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-stone-600">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">
                      {t('Primary Guest')}
                    </span>
                    <span className="font-semibold text-stone-800">
                      {confirmedBooking.guestName} ({confirmedBooking.guestEmail})
                    </span>
                  </div>
                  {confirmedBooking.specialRequests && (
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-black block">
                        {t('Special Requests')}
                      </span>
                      <span className="italic text-stone-700">
                        {confirmedBooking.specialRequests}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Notice Banner */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">{t('Demo / Test Payment Completed')}</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {t('This reservation was processed in sandbox test mode. No real credit or debit card details were collected, and no real money was charged. This confirmed booking is stored in your LankaMate local storage and accessible under')} <strong>{t('My Trips')}</strong>.
                  </p>
                </div>
              </div>

              {/* The 3 Required Action Buttons: View My Booking, Back to Hotels, Go to My Trips */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1. View My Booking */}
                <button
                  id="btn-view-my-booking"
                  type="button"
                  onClick={() => setShowVoucherModal(true)}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>{t('View My Booking')}</span>
                </button>

                {/* 2. Back to Hotels */}
                <button
                  id="btn-back-to-hotels"
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <HotelIcon className="w-4 h-4 text-stone-600" />
                  <span>{t('Back to Hotels')}</span>
                </button>

                {/* 3. Go to My Trips */}
                <button
                  id="btn-go-to-my-trips"
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.setItem('lankamate_active_planner_tab', 'saved');
                    } catch (e) {
                      console.error(e);
                    }
                    if (onNavigatePage) {
                      onNavigatePage('planner');
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-emerald-300" />
                  <span>{t('Go to My Trips')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Official Reservation Voucher Modal (View My Booking) */}
        {showVoucherModal && confirmedBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('Official Demo Voucher')}</span>
                  </div>
                  <h3 className="text-xl font-black text-emerald-950">
                    {t('LankaMate Reservation Voucher')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title={t('Close Voucher')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Voucher Content */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 text-xs text-stone-700">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Reference Code')}</span>
                    <span className="text-base font-mono font-black text-emerald-900">{confirmedBooking.referenceNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Issued On')}</span>
                    <span className="font-semibold text-stone-800">{confirmedBooking.createdAt}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Reserved Property')}</span>
                  <div className="text-base font-black text-stone-900">{confirmedBooking.hotelName}</div>
                  <div className="text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{confirmedBooking.destinationName}, Sri Lanka • {confirmedBooking.region}</span>
                  </div>
                  <div className="text-stone-500 flex items-center gap-1 pt-0.5">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{t('Front Desk:')} {hotel.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Room Type')}</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.roomType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Duration')}</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.nights} {t('Nights')} ({confirmedBooking.checkInDate} {t('to')} {confirmedBooking.checkOutDate})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Party')}</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.guestsCount} {t('Guests')} • {confirmedBooking.roomsCount} {t('Rooms')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Total Amount')}</span>
                    <span className="font-black text-emerald-950">{confirmedBooking.paidAmountFormatted || `$${confirmedBooking.totalUsd} USD`}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Primary Guest')}</span>
                  <span className="font-bold text-stone-900">{confirmedBooking.guestName}</span>
                  <span className="text-stone-500 block">{confirmedBooking.guestEmail} • {confirmedBooking.guestPhone}</span>
                </div>

                {confirmedBooking.specialRequests && (
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-black block">{t('Special Requests')}</span>
                    <span className="italic text-stone-700">{confirmedBooking.specialRequests}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{t('Policy: Standard Check-in 2:00 PM • Free cancellation up to 48h')}</span>
                  <span className="font-bold text-emerald-800">{t('Status:')} {confirmedBooking.status}</span>
                </div>
              </div>

              {/* Voucher Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('Print Voucher')}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onOpenMyBookings && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowVoucherModal(false);
                        onOpenMyBookings();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('View All Saved Bookings')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowVoucherModal(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('Done')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
