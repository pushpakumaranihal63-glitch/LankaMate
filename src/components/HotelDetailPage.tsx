import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Navigation, MapPin, Sparkles, Bed, Check, Wifi, CheckCircle2, Info } from 'lucide-react';
import { Hotel } from '../types';
import { DetectedLocationInfo } from '../utils/locationHelper';
import { useTranslation } from '../i18n/LanguageContext';

export const TRIP_COM_HOTELS_URL = 'https://www.trip.com/hotels/w/home?Allianceid=10767912&SID=332379328&trip_sub1=lankamate&trip_sub3=D20144994';

interface HotelDetailPageProps {
  hotel: Hotel;
  activeLocation: DetectedLocationInfo | null;
  onClose: () => void;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
}

export const HotelDetailPage: React.FC<HotelDetailPageProps> = ({
  hotel,
  activeLocation,
  onClose,
  onToggleFavourite,
  isFavourite,
}) => {
  const { t } = useTranslation();
  const [selectedRoomType, setSelectedRoomType] = useState(hotel.roomTypes[0] || 'Standard Room');

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
                  subtitle: hotel.destinationName,
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


          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================================= */}
        {/* STEP 1: DETAILED HOTEL PAGE */}
        {/* ========================================================================= */}

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
                  </div>
                </div>

                {/* Available Room Types */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                      <Bed className="w-4 h-4 text-emerald-600" />
                      <span>{t('Listed Room Types', 'Listed Room Types')}</span>
                    </h2>
                    <span className="text-xs text-stone-500 font-medium">{t('Catalog information — confirm availability on Trip.com', 'Catalog information — confirm availability on Trip.com')}</span>
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

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg sticky top-20 space-y-4">
                  <h2 className="text-lg font-black text-emerald-950">{t('Booking Partner: Trip.com', 'Booking Partner: Trip.com')}</h2>
                  <p className="text-sm text-stone-700">{t('Hotel search, live prices, availability, reservations and payment are handled on Trip.com.', 'Hotel search, live prices, availability, reservations and payment are handled on Trip.com.')}</p>
                  <p className="text-xs text-stone-600">{t('This link opens the general Trip.com Hotels search page. Your selected hotel, city, dates, room type and guests are not automatically transferred. Enter your preferences on Trip.com.', 'This link opens the general Trip.com Hotels search page. Your selected hotel, city, dates, room type and guests are not automatically transferred. Enter your preferences on Trip.com.')}</p>
                  <a id="btn-hotel-book-now" href={TRIP_COM_HOTELS_URL} target="_blank" rel="noopener noreferrer sponsored" className="w-full py-3.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-sm font-normal shadow-md flex items-center justify-center text-center">
                    <span>{t('More Hotels, Prices & Book on Trip.com', 'More Hotels, Prices & Book on Trip.com').split(/(Trip\.com)/).map((part, index) => part === 'Trip.com' ? <span key={index} style={{ color: '#60C5FF', fontWeight: 700 }}>{part}</span> : part)}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
