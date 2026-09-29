import React, { useState, useMemo } from 'react';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  Heart,
  Wifi,
  Sparkles,
  Check,
  Calendar,
  X,
  Phone,
  ShieldCheck,
  Search,
  Navigation,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  DollarSign,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { Hotel, HotelBooking, PageId } from '../types';
import { hotelsData } from '../data/hotelsData';
import { HotelLocationSearch } from './HotelLocationSearch';
import { HotelDetailPage } from './HotelDetailPage';
import { DetectedLocationInfo, calculateDistanceKm } from '../utils/locationHelper';
import { useTranslation } from '../i18n/LanguageContext';

interface HotelsViewProps {
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
  onNavigatePage: (page: PageId) => void;
  onBack?: () => void;
  previousPage?: PageId;
}

type DistanceRadius = 1 | 5 | 10 | 25 | 'all';

export type BudgetOption = 'all' | 'under-50' | '50-100' | '100-200' | '200-plus';

interface BudgetConfig {
  id: BudgetOption;
  label: string;
  shortLabel: string;
  min?: number;
  max?: number;
}

export const BUDGET_OPTIONS: BudgetConfig[] = [
  { id: 'all', label: 'All Budgets', shortLabel: 'All Budgets' },
  { id: 'under-50', label: '💰 Under $50 / night', shortLabel: '< $50/nt', max: 50 },
  { id: '50-100', label: '💰 $50–$100 / night', shortLabel: '$50–$100/nt', min: 50, max: 100 },
  { id: '100-200', label: '💰 $100–$200 / night', shortLabel: '$100–$200/nt', min: 100, max: 200 },
  { id: '200-plus', label: '💰 $200+ / night', shortLabel: '$200+/nt', min: 200 },
];

export const HOTEL_TYPES = [
  'All',
  'Hotel',
  'Resort',
  'Guest House',
  'Homestay',
  'Villa',
  'Hostel',
  'Bungalow',
  'Lodge',
  'Boutique hotel',
] as const;

export const matchesBudget = (priceUsd: number, budget: BudgetOption): boolean => {
  if (budget === 'under-50') return priceUsd < 50;
  if (budget === '50-100') return priceUsd >= 50 && priceUsd <= 100;
  if (budget === '100-200') return priceUsd >= 100 && priceUsd <= 200;
  if (budget === '200-plus') return priceUsd > 200;
  return true;
};

export const HotelsView: React.FC<HotelsViewProps> = ({
  onToggleFavourite,
  isFavourite,
  onNavigatePage,
  onBack,
  previousPage,
}) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedHotelType, setSelectedHotelType] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<BudgetOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryModalHotel, setInquiryModalHotel] = useState<Hotel | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [activeLocation, setActiveLocation] = useState<DetectedLocationInfo | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceRadius>(25);
  const [isManualSearchOpen, setIsManualSearchOpen] = useState(false);
  const [selectedHotelForDetail, setSelectedHotelForDetail] = useState<Hotel | null>(null);

  // Persistent Hotel Bookings State
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>(() => {
    try {
      const saved = localStorage.getItem('lankamate_hotel_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [showBookingsModal, setShowBookingsModal] = useState<boolean>(false);

  // Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [nights, setNights] = useState(3);
  const [guestsCount, setGuestsCount] = useState(2);

  const locations = [
    'All',
    'Sigiriya',
    'Ella',
    'Galle',
    'Kandy',
    'Nuwara Eliya',
    'Yala',
    'Mirissa',
    'Colombo',
    'Jaffna',
  ];

  // Calculate distance for all hotels relative to detected or selected location
  const hotelsWithDistance = useMemo(() => {
    return hotelsData.map((h) => {
      if (!activeLocation || !h.coordinates) {
        return { ...h, distanceKm: undefined };
      }
      const dist = calculateDistanceKm(
        activeLocation.coordinates.lat,
        activeLocation.coordinates.lng,
        h.coordinates.lat,
        h.coordinates.lng
      );
      return { ...h, distanceKm: dist };
    });
  }, [activeLocation]);

  // Compute counts for distance filters
  const distanceCounts = useMemo(() => {
    if (!activeLocation) return { 1: 0, 5: 0, 10: 0, 25: 0, all: hotelsData.length };
    return {
      1: hotelsWithDistance.filter((h) => h.distanceKm !== undefined && h.distanceKm <= 1).length,
      5: hotelsWithDistance.filter((h) => h.distanceKm !== undefined && h.distanceKm <= 5).length,
      10: hotelsWithDistance.filter((h) => h.distanceKm !== undefined && h.distanceKm <= 10).length,
      25: hotelsWithDistance.filter((h) => h.distanceKm !== undefined && h.distanceKm <= 25).length,
      all: hotelsWithDistance.length,
    };
  }, [activeLocation, hotelsWithDistance]);

  // Dynamic counts for each budget bracket based on other active filters
  const budgetCounts = useMemo(() => {
    const baseList = hotelsWithDistance.filter((h) => {
      if (activeLocation && distanceFilter !== 'all') {
        if (h.distanceKm === undefined || h.distanceKm > distanceFilter) return false;
      }
      if (!activeLocation && selectedLocation !== 'All') {
        if (!h.destinationName.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }
      if (selectedRegion !== 'All' && h.region !== selectedRegion) return false;
      if (selectedHotelType !== 'All' && h.hotelType !== selectedHotelType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          h.name.toLowerCase().includes(q) ||
          h.destinationName.toLowerCase().includes(q) ||
          (h.badge && h.badge.toLowerCase().includes(q)) ||
          (h.hotelType && h.hotelType.toLowerCase().includes(q)) ||
          h.facilities.some((f) => f.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    return {
      all: baseList.length,
      'under-50': baseList.filter((h) => h.pricePerNightUsd < 50).length,
      '50-100': baseList.filter((h) => h.pricePerNightUsd >= 50 && h.pricePerNightUsd <= 100).length,
      '100-200': baseList.filter((h) => h.pricePerNightUsd >= 100 && h.pricePerNightUsd <= 200).length,
      '200-plus': baseList.filter((h) => h.pricePerNightUsd > 200).length,
    };
  }, [
    hotelsWithDistance,
    activeLocation,
    distanceFilter,
    selectedLocation,
    selectedRegion,
    selectedHotelType,
    searchQuery,
  ]);

  // Dynamic counts for each hotel type based on other active filters
  const hotelTypeCounts = useMemo(() => {
    const baseList = hotelsWithDistance.filter((h) => {
      if (activeLocation && distanceFilter !== 'all') {
        if (h.distanceKm === undefined || h.distanceKm > distanceFilter) return false;
      }
      if (!activeLocation && selectedLocation !== 'All') {
        if (!h.destinationName.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }
      if (selectedRegion !== 'All' && h.region !== selectedRegion) return false;
      if (budgetFilter !== 'all' && !matchesBudget(h.pricePerNightUsd, budgetFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          h.name.toLowerCase().includes(q) ||
          h.destinationName.toLowerCase().includes(q) ||
          (h.badge && h.badge.toLowerCase().includes(q)) ||
          h.facilities.some((f) => f.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    const counts: Record<string, number> = { All: baseList.length };
    HOTEL_TYPES.forEach((type) => {
      if (type !== 'All') {
        counts[type] = baseList.filter((h) => h.hotelType === type).length;
      }
    });
    return counts;
  }, [
    hotelsWithDistance,
    activeLocation,
    distanceFilter,
    selectedLocation,
    selectedRegion,
    budgetFilter,
    searchQuery,
  ]);

  // Filtered hotels combining Location, Distance, Region, Hotel Type, Budget, and Search Query
  const filteredHotels = useMemo(() => {
    let list = hotelsWithDistance;

    // 1. Distance filter (when activeLocation is detected/selected)
    if (activeLocation) {
      if (distanceFilter !== 'all') {
        list = list.filter((h) => h.distanceKm !== undefined && h.distanceKm <= distanceFilter);
      }
    } else {
      // 2. City / Destination filter (when standard browse is used)
      if (selectedLocation !== 'All') {
        list = list.filter((h) =>
          h.destinationName.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }
    }

    // 3. Region filter
    if (selectedRegion !== 'All') {
      list = list.filter((h) => h.region === selectedRegion);
    }

    // 4. Hotel Type filter
    if (selectedHotelType !== 'All') {
      list = list.filter((h) => h.hotelType === selectedHotelType);
    }

    // 5. Budget per Night filter
    if (budgetFilter !== 'all') {
      list = list.filter((h) => matchesBudget(h.pricePerNightUsd, budgetFilter));
    }

    // 6. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.destinationName.toLowerCase().includes(q) ||
          (h.badge && h.badge.toLowerCase().includes(q)) ||
          (h.hotelType && h.hotelType.toLowerCase().includes(q)) ||
          h.facilities.some((f) => f.toLowerCase().includes(q))
      );
    }

    // 7. Distance sorting when active location is present
    if (activeLocation) {
      return [...list].sort((a, b) => {
        const distA = a.distanceKm ?? Infinity;
        const distB = b.distanceKm ?? Infinity;
        return distA - distB;
      });
    }

    return list;
  }, [
    hotelsWithDistance,
    activeLocation,
    distanceFilter,
    selectedLocation,
    selectedRegion,
    selectedHotelType,
    budgetFilter,
    searchQuery,
  ]);

  const hasActiveFilters =
    budgetFilter !== 'all' ||
    selectedHotelType !== 'All' ||
    selectedRegion !== 'All' ||
    selectedLocation !== 'All' ||
    searchQuery.trim() !== '' ||
    (activeLocation !== null && distanceFilter !== 'all');

  const handleClearFilters = () => {
    setBudgetFilter('all');
    setSelectedHotelType('All');
    setSelectedRegion('All');
    setSelectedLocation('All');
    setSearchQuery('');
    if (activeLocation) {
      setDistanceFilter('all');
    }
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryModalHotel(null);
    }, 2800);
  };

  // If a hotel card has been tapped, display the detailed hotel page
  if (selectedHotelForDetail) {
    return (
      <HotelDetailPage
        hotel={selectedHotelForDetail}
        activeLocation={activeLocation}
        onClose={() => setSelectedHotelForDetail(null)}
        onToggleFavourite={onToggleFavourite}
        isFavourite={isFavourite}
        onBookingConfirmed={(newBooking) => {
          setHotelBookings((prev) => {
            const next = [newBooking, ...prev];
            localStorage.setItem('lankamate_hotel_bookings', JSON.stringify(next));
            return next;
          });
        }}
        onOpenInquiry={(hotel) => {
          setSelectedHotelForDetail(null);
          setInquiryModalHotel(hotel);
        }}
        onNavigatePage={onNavigatePage}
        onOpenMyBookings={() => {
          setSelectedHotelForDetail(null);
          setShowBookingsModal(true);
        }}
      />
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            id="btn-hotels-back"
            type="button"
            onClick={onBack ? onBack : () => onNavigatePage(previousPage || 'home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-700 hover:text-emerald-950 border border-stone-200 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer touch-manipulation group"
            aria-label={t('Back to previous page')}
          >
            <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:text-emerald-800 transition-colors" />
            <span>
              {t('Back')}{previousPage === 'planner' ? ` ${t('to Trip Planner')}` : previousPage === 'home' ? ` ${t('to Home')}` : previousPage === 'booking' ? ` ${t('to Booking Hub')}` : previousPage === 'destinations' ? ` ${t('to Destinations')}` : ` ${t('to Previous')}`}
            </span>
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <HotelIcon className="w-3.5 h-3.5 text-emerald-700" />
              {t('Curated Sri Lankan Hospitality')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              {t('Hotels & Homestays')}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
              {t("From Geoffrey Bawa's legendary architecture at Heritance Kandalama to cliffside luxury chalets overlooking Ella Gap, welcoming family homestays, and colonial villas in Galle Fort.")}
            </p>
          </div>

          {hotelBookings.length > 0 && (
            <button
              id="btn-view-my-hotel-bookings"
              onClick={() => setShowBookingsModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('My Bookings')} ({hotelBookings.length})</span>
            </button>
          )}
        </div>

        {/* 📍 Find Hotels Near Me - Location Search Section */}
        <HotelLocationSearch
          activeLocation={activeLocation}
          onSelectLocation={(loc) => {
            setActiveLocation(loc);
            if (loc) {
              setSelectedLocation('All');
              setDistanceFilter(25);
            }
          }}
          onClearLocation={() => {
            setActiveLocation(null);
            setDistanceFilter(25);
          }}
          nearbyCount={filteredHotels.length}
          isManualSearchOpen={isManualSearchOpen}
          onToggleManualSearch={setIsManualSearchOpen}
        />

        {/* Nearby Hotels Results Header & Distance Filter or Standard Filters */}
        {activeLocation ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
            {/* Top row: Current location details & quick actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Navigation className="w-3 h-3 text-emerald-700" />
                  <span>{t('Nearby Hotel Results')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {t('Hotels near')} {activeLocation.city || t('Your Location')}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-600 mt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{t('Current location:')}</span>
                    <strong className="text-stone-900 font-semibold">{activeLocation.displayName}</strong>
                  </span>
                  {activeLocation.source === 'gps' && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                      GPS
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <button
                  onClick={() => setIsManualSearchOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t('Search Another Location')}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveLocation(null);
                    setDistanceFilter(25);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={t('Clear location filter')}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t('Reset to All')}</span>
                </button>
              </div>
            </div>

            {/* Distance Filter Controls */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Filter by Distance:')}</span>
                </span>
                <span className="text-stone-500 font-medium">
                  {filteredHotels.length === 0
                    ? `${t('0 hotels within')} ${distanceFilter === 'all' ? t('any distance') : `${distanceFilter} km`}`
                    : `${filteredHotels.length} ${t('curated hotel' + (filteredHotels.length === 1 ? '' : 's') + ' found within')} ${distanceFilter === 'all' ? t('all distances') : `${distanceFilter} km`}`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'All Island', value: 'all' as const },
                  { label: 'Within 5 km', value: 5 as const },
                  { label: 'Within 10 km', value: 10 as const },
                  { label: 'Within 25 km', value: 25 as const },
                ].map((opt) => {
                  const isSelected = distanceFilter === opt.value;
                  const count = distanceCounts[opt.value];

                  return (
                    <button
                      key={opt.label}
                      id={`distance-filter-${opt.value}`}
                      onClick={() => setDistanceFilter(opt.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      <span>{t(opt.label)}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-200'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget per Night Filter Controls */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Budget per Night:')}</span>
                </span>
                {budgetFilter !== 'all' && (
                  <button
                    onClick={() => setBudgetFilter('all')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>{t('Reset Budget')}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = budgetFilter === opt.id;
                  const count = budgetCounts[opt.id];

                  return (
                    <button
                      key={opt.id}
                      id={`nearby-budget-filter-${opt.id}`}
                      type="button"
                      onClick={() => setBudgetFilter(isSelected && opt.id !== 'all' ? 'all' : opt.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      <span>{t(opt.label)}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-200'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotel Type Filter Controls */}
            <div className="space-y-2 pt-2.5 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                  <HotelIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Hotel Type:')}</span>
                </span>
                {selectedHotelType !== 'All' && (
                  <button
                    onClick={() => setSelectedHotelType('All')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('Reset Type')}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {HOTEL_TYPES.map((type) => {
                  const isSelected = selectedHotelType === type;
                  const count = hotelTypeCounts[type] ?? 0;
                  return (
                    <button
                      key={type}
                      id={`nearby-hotel-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setSelectedHotelType(isSelected && type !== 'All' ? 'All' : type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold shadow-2xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      <span>{t(type)}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-stone-700 text-stone-100 font-bold' : 'bg-white text-stone-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional search input to filter hotels within this area */}
            <div className="pt-2.5 border-t border-stone-100">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search hotels near') + ` ${activeLocation.city} ` + t('by name or amenity...')}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Filter Controls when no location is active */
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search hotels by name, city or amenity...')}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                />
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Cultural Triangle', 'Hill Country', 'Southern Coast', 'Wildlife & Safari'].map(
                  (region) => (
                    <button
                      key={region}
                      id={`region-filter-${region.toLowerCase().replace(/[\s&]+/g, '-')}`}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                        selectedRegion === region
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 border border-stone-200/80 hover:bg-stone-200'
                      }`}
                    >
                      {t(region)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Location Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-stone-400 shrink-0 uppercase tracking-wider">{t('City:')}</span>
              {locations.map((loc) => (
                <button
                  key={loc}
                  id={`city-filter-${loc.toLowerCase()}`}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    selectedLocation === loc
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Budget per Night Filter Controls */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Budget per Night:')}</span>
                </span>
                {budgetFilter !== 'all' && (
                  <button
                    onClick={() => setBudgetFilter('all')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>{t('Reset Budget')}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = budgetFilter === opt.id;
                  const count = budgetCounts[opt.id];

                  return (
                    <button
                      key={opt.id}
                      id={`budget-filter-${opt.id}`}
                      type="button"
                      onClick={() => setBudgetFilter(isSelected && opt.id !== 'all' ? 'all' : opt.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      <span>{t(opt.label)}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-200'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotel Type Filter Controls */}
            <div className="pt-2.5 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                  <HotelIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Hotel Type:')}</span>
                </span>
                {selectedHotelType !== 'All' && (
                  <button
                    onClick={() => setSelectedHotelType('All')}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('Reset Type')}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {HOTEL_TYPES.map((type) => {
                  const isSelected = selectedHotelType === type;
                  const count = hotelTypeCounts[type] ?? 0;
                  return (
                    <button
                      key={type}
                      id={`hotel-type-filter-${type.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setSelectedHotelType(isSelected && type !== 'All' ? 'All' : type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold shadow-2xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      <span>{t(type)}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-stone-700 text-stone-100 font-bold' : 'bg-white text-stone-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Results Header & Active Filter Bar with Clear Filters option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 py-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-stone-900 text-sm">
              {filteredHotels.length} {filteredHotels.length === 1 ? t('hotel') : t('hotels')} {t('found')}
            </span>
            {hasActiveFilters && <span className="text-stone-300">|</span>}
            {/* Active budget filter chip */}
            {budgetFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-medium border border-emerald-200">
                <span>{t('Budget')}: {t(BUDGET_OPTIONS.find((b) => b.id === budgetFilter)?.label)}</span>
                <button
                  onClick={() => setBudgetFilter('all')}
                  className="hover:text-emerald-700 cursor-pointer ml-0.5"
                  title={t('Remove budget filter')}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {/* Active hotel type filter chip */}
            {selectedHotelType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <span>{t('Type')}: {t(selectedHotelType)}</span>
                <button
                  onClick={() => setSelectedHotelType('All')}
                  className="hover:text-stone-900 cursor-pointer ml-0.5"
                  title={t('Remove hotel type filter')}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {/* Active region filter chip */}
            {selectedRegion !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <span>{t('Region')}: {selectedRegion}</span>
                <button
                  onClick={() => setSelectedRegion('All')}
                  className="hover:text-stone-900 cursor-pointer ml-0.5"
                  title={t('Remove region filter')}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {/* Active city filter chip */}
            {!activeLocation && selectedLocation !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-medium border border-amber-200">
                <span>{t('City')}: {selectedLocation}</span>
                <button
                  onClick={() => setSelectedLocation('All')}
                  className="hover:text-amber-700 cursor-pointer ml-0.5"
                  title={t('Remove city filter')}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {/* Active search filter chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <span>{t('Search')}: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-stone-900 cursor-pointer ml-0.5"
                  title={t('Clear search')}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              id="clear-all-filters-btn"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('Clear Filters')}</span>
            </button>
          )}
        </div>

        {/* Hotels Grid or Empty State */}
        {filteredHotels.length === 0 ? (
          activeLocation ? (
            /* Clear "No hotels found in this area" display */
            <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {distanceFilter !== 'all'
                    ? `${t('No accommodation found within')} ${distanceFilter} km.`
                    : `${t('No accommodation found matching your filters')}`}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                  {budgetFilter !== 'all' ? (
                    <>
                      {t('No accommodation near')} <strong className="text-stone-800">{activeLocation.displayName}</strong> {t('match the selected budget of')}{' '}
                      <strong className="text-emerald-800">{t(BUDGET_OPTIONS.find((b) => b.id === budgetFilter)?.label)}</strong>.
                    </>
                  ) : distanceFilter !== 'all' ? (
                    <>
                      {t('No accommodation found within')}{' '}
                      <strong className="text-emerald-900">{distanceFilter} km</strong> {t('of')}{' '}
                      <strong className="text-stone-800">{activeLocation.displayName}</strong>. {t('Expand the radius to view more accommodations.')}
                    </>
                  ) : (
                    <>
                      {t('No accommodation found matching your current filter criteria near')}{' '}
                      <strong className="text-stone-800">{activeLocation.displayName}</strong>.
                    </>
                  )}
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {t('Try adjusting your budget per night, expanding the distance radius, or clearing applied filters.')}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                {budgetFilter !== 'all' && (
                  <button
                    onClick={() => setBudgetFilter('all')}
                    className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer transition-colors shadow-2xs"
                  >
                    {t('Reset Budget Filter')}
                  </button>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 cursor-pointer transition-colors"
                  >
                    {t('Clear Filters')}
                  </button>
                )}
                {distanceFilter !== 25 && distanceFilter !== 'all' && (
                  <button
                    onClick={() => setDistanceFilter(25)}
                    className="px-4 py-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-200 cursor-pointer transition-colors"
                  >
                    {t('Expand to Within 25 km')} ({distanceCounts[25]})
                  </button>
                )}
                {distanceFilter !== 'all' && (
                  <button
                    onClick={() => setDistanceFilter('all')}
                    className="px-4 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-200 border border-stone-200 cursor-pointer transition-colors"
                  >
                    {t('Show All Distances')} ({distanceCounts.all})
                  </button>
                )}
                <button
                  onClick={() => setIsManualSearchOpen(true)}
                  className="px-4 py-2.5 bg-white text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  {t('Search Another Location')}
                </button>
                <button
                  onClick={() => {
                    setActiveLocation(null);
                    handleClearFilters();
                  }}
                  className="px-4 py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                >
                  {t('Reset to All Hotels')}
                </button>
              </div>
            </div>
          ) : (
            /* Standard no matches state */
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-stone-900">{t('No hotels match your filters')}</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {budgetFilter !== 'all' ? (
                  <>
                    {t('No hotels match the selected budget')} ({t(BUDGET_OPTIONS.find((b) => b.id === budgetFilter)?.label)}) {t('with your current filters')}.
                  </>
                ) : (
                  <>{t("We couldn't find any hotels matching your current city, region, or search criteria.")}</>
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {budgetFilter !== 'all' && (
                  <button
                    onClick={() => setBudgetFilter('all')}
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer transition-colors"
                  >
                    {t('Reset Budget Filter')}
                  </button>
                )}
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 cursor-pointer transition-colors"
                >
                  {t('Clear Filters')}
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                id={`hotel-card-${hotel.id}`}
                onClick={() => setSelectedHotelForDetail(hotel)}
                className="group bg-white rounded-2xl shadow-xs hover:shadow-md border border-stone-200 hover:border-emerald-600/50 overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-900">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Rating & Star Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{hotel.starRating} {t('Stars')}</span>
                      </span>
                      {hotel.hotelType && (
                        <span className="px-2 py-0.5 rounded-full bg-stone-900/90 backdrop-blur-xs text-amber-300 border border-stone-700 text-[10px] font-bold shadow-xs">
                          {t(hotel.hotelType)}
                        </span>
                      )}
                      {hotel.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] truncate max-w-[140px]">
                          {hotel.badge}
                        </span>
                      )}
                    </div>

                    {/* Proximity / Distance Badge if Location Active */}
                    {hotel.distanceKm !== undefined && (
                      <div className="absolute top-10 left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[85%]">
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-950/90 backdrop-blur-xs text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          <Navigation className="w-3 h-3 text-emerald-400" />
                          <span>{hotel.distanceKm < 1 ? t('< 1 km away') : `${hotel.distanceKm} km ${t('away')}`}</span>
                        </span>
                        {hotel.distanceKm <= 35 && activeLocation?.city && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                            {t('Near')} {activeLocation.city}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite({
                          id: hotel.id,
                          type: 'hotel',
                          title: hotel.name,
                          subtitle: `${hotel.destinationName} • $${hotel.pricePerNightUsd}/night`,
                          image: hotel.image,
                          linkPage: 'hotels',
                          targetId: hotel.id,
                        });
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                      title={t('Save hotel to Favourites')}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavourite(hotel.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                        }`}
                      />
                    </button>

                    {/* Hotel Name & Location */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-amber-300 font-medium">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{hotel.destinationName}</span>
                        </div>
                        {hotel.distanceKm !== undefined && (
                          <span className="shrink-0 text-stone-900 text-[10px] font-black bg-amber-400 px-2 py-0.5 rounded-full shadow-2xs">
                            {hotel.distanceKm < 1 ? '< 1 km' : `${hotel.distanceKm} km`}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black tracking-tight">{hotel.name}</h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {hotel.badge && (
                      <p className="text-xs text-amber-800 font-semibold italic">★ {hotel.badge}</p>
                    )}
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Proximity Callout when location active */}
                    {activeLocation && hotel.distanceKm !== undefined && (
                      <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t('Distance from')} {activeLocation.city || t('your location')}:</span>
                        </span>
                        <span className="font-black text-emerald-950">
                          {hotel.distanceKm < 1 ? t('Less than 1 km') : `${hotel.distanceKm} km`}
                        </span>
                      </div>
                    )}

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hotel.facilities.slice(0, 4).map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                        >
                          ✓ {a}
                        </span>
                      ))}
                    </div>

                    {/* Reviews summary */}
                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                      <span className="font-bold text-emerald-900">
                        ★ {hotel.rating} / 5.0 ({hotel.reviewsCount} {t('reviews')})
                      </span>
                      <span className="text-[11px] text-stone-400">{hotel.roomTypes[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Booking Action */}
                <div className="p-5 pt-0 border-t border-stone-100/80 mt-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">{t('Per Night')}</span>
                    <div className="text-base font-black text-emerald-950">
                      ${hotel.pricePerNightUsd} USD
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      ~{hotel.pricePerNightLkr.toLocaleString()} LKR
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`view-detail-btn-${hotel.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotelForDetail(hotel);
                      }}
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>{t('Book')}</span>
                    </button>

                    <button
                      id={`book-hotel-btn-${hotel.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInquiryModalHotel(hotel);
                      }}
                      className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title={t('Send reservation inquiry')}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('Inquire')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reserve / Booking Inquiry Modal */}
        {inquiryModalHotel && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="relative h-44 bg-stone-900">
                <img
                  src={inquiryModalHotel.image}
                  alt={inquiryModalHotel.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <button
                  onClick={() => setInquiryModalHotel(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{inquiryModalHotel.starRating} {t('Star Luxury Heritage')}</span>
                    {inquiryModalHotel.distanceKm !== undefined && (
                      <span className="text-white bg-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                        {inquiryModalHotel.distanceKm < 1 ? t('< 1 km away') : `${inquiryModalHotel.distanceKm} km ${t('away')}`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black">{inquiryModalHotel.name}</h3>
                  <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {inquiryModalHotel.destinationName} • {inquiryModalHotel.region}
                  </p>
                </div>
              </div>

              {/* Inquiry Form */}
              {inquirySuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-emerald-950">{t('Inquiry Received!')}</h4>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto">
                      {t("Our LankaMate concierge and the hotel reservations desk will confirm room availability and special rates within 2 hours.")}
                    </p>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700">
                    {t('Reference Code')}: <span className="font-mono font-bold text-emerald-800">LM-RES-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                      {t('Direct Reservation Inquiry')}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {t('Best rate guarantee with complimentary breakfast & free cancellation.')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{t('Your Full Name')}</label>
                      <input
                        type="text"
                        required
                        placeholder={t('e.g. Maya Fernando')}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{t('Email Address')}</label>
                      <input
                        type="email"
                        required
                        placeholder="maya@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{t('Check-in')}</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-2 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{t('Nights')}</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={nights}
                        onChange={(e) => setNights(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{t('Guests')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Pricing estimation */}
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-900 font-bold block">{t('Estimated Total')}</span>
                      <span className="text-stone-500 text-[11px]">
                        ${inquiryModalHotel.pricePerNightUsd} × {nights} {t('nights')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-950">
                        ${inquiryModalHotel.pricePerNightUsd * nights} USD
                      </div>
                      <div className="text-[11px] text-stone-500">
                        ~{(inquiryModalHotel.pricePerNightLkr * nights).toLocaleString()} LKR
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1">
                    <p className="flex items-center gap-1 text-emerald-800 font-medium">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {t('Free cancellation up to 48 hours prior to check-in.')}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {t('Hotel desk')}: {inquiryModalHotel.phone}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryModalHotel(null)}
                      className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {t('Submit Reservation Inquiry')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* My Confirmed Bookings Modal */}
        {showBookingsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('Trip Records')}</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950">{t('My Hotel Bookings')}</h3>
                </div>
                <button
                  onClick={() => setShowBookingsModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {hotelBookings.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <HotelIcon className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-stone-600 text-sm">{t("You haven't made any hotel reservations yet.")}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {hotelBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-200/80 pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.hotelImage}
                            alt={b.hotelName}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-black text-stone-900 text-sm sm:text-base">
                              {b.hotelName}
                            </h4>
                            <p className="text-xs text-stone-500">
                              {b.destinationName} • {b.roomType}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full block sm:inline-block w-fit sm:w-auto">
                            {b.referenceNumber}
                          </span>
                          <span className="text-xs font-black text-emerald-950 block mt-1">
                            {b.paidAmountFormatted || `$${b.totalUsd} USD (~${b.totalLkr.toLocaleString()} LKR)`}
                          </span>
                          {b.paymentMethod && (
                            <span className="text-[10px] text-stone-500 font-medium block">
                              {b.paymentMethod}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Dates')}</span>
                          <span className="font-semibold text-stone-800">
                            {b.checkInDate} → {b.checkOutDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Duration')}</span>
                          <span className="font-semibold text-stone-800">{b.nights} {t('Nights')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Guests & Rooms')}</span>
                          <span className="font-semibold text-stone-800">
                            {b.guestsCount} {t('Guests')} ({b.roomsCount} {t('Rooms')})
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">{t('Guest Name')}</span>
                          <span className="font-semibold text-stone-800 truncate block">{b.guestName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowBookingsModal(false)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
