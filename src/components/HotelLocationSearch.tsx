import React, { useState } from 'react';
import {
  LocateFixed,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Compass,
  Building2,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  DetectedLocationInfo,
  SRI_LANKAN_HUBS,
  SriLankanHub,
  calculateDistanceKm,
  findClosestSriLankanHub,
  isCoordinatesInSriLanka,
  reverseGeocodeCoords,
} from '../utils/locationHelper';
import { useTranslation } from '../i18n/LanguageContext';

interface HotelLocationSearchProps {
  activeLocation: DetectedLocationInfo | null;
  onSelectLocation: (info: DetectedLocationInfo | null) => void;
  onClearLocation: () => void;
  nearbyCount: number;
  isManualSearchOpen?: boolean;
  onToggleManualSearch?: (open: boolean) => void;
}

export const HotelLocationSearch: React.FC<HotelLocationSearchProps> = ({
  activeLocation,
  onSelectLocation,
  onClearLocation,
  nearbyCount,
  isManualSearchOpen: controlledManualOpen,
  onToggleManualSearch,
}) => {
  const { t } = useTranslation();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [localManualSearchOpen, setLocalManualSearchOpen] = useState(false);
  const [manualQuery, setManualQuery] = useState('');

  const isManualOpen = controlledManualOpen !== undefined ? controlledManualOpen : localManualSearchOpen;
  const setManualOpen = (open: boolean) => {
    if (onToggleManualSearch) {
      onToggleManualSearch(open);
    } else {
      setLocalManualSearchOpen(open);
    }
  };

  // Handle "Use My Location" GPS request
  const handleUseMyLocation = () => {
    setDetectionError(null);

    if (!navigator.geolocation) {
      setDetectionError('Geolocation is not supported by your browser or device.');
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const inSriLanka = isCoordinatesInSriLanka(lat, lng);
          const { hub } = findClosestSriLankanHub(lat, lng);

          // Attempt reverse geocoding
          const geo = await reverseGeocodeCoords(lat, lng);

          const locationInfo: DetectedLocationInfo = {
            coordinates: { lat, lng },
            displayName: geo.displayName,
            city: geo.city,
            areaOrDistrict: geo.areaOrDistrict,
            country: geo.country,
            isWithinSriLanka: inSriLanka,
            closestSriLankaHub: hub,
            source: 'gps',
          };

          onSelectLocation(locationInfo);
          setManualOpen(false);
        } catch (err) {
          console.error('Error resolving location details:', err);
          // Still create location with raw coordinates
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const inSriLanka = isCoordinatesInSriLanka(lat, lng);
          const { hub } = findClosestSriLankanHub(lat, lng);

          onSelectLocation({
            coordinates: { lat, lng },
            displayName: inSriLanka ? `${hub.name}, Sri Lanka` : `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
            city: inSriLanka ? hub.name : 'Current Location',
            country: inSriLanka ? 'Sri Lanka' : 'Detected Location',
            isWithinSriLanka: inSriLanka,
            closestSriLankaHub: hub,
            source: 'gps',
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setDetectionError(
              'Location permission was declined. Please allow location access in your browser or select your city using "Search Another Location" below.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setDetectionError(
              'GPS position unavailable. You can choose a city or area using "Search Another Location" below.'
            );
            break;
          case error.TIMEOUT:
            setDetectionError(
              'Location request timed out. Please try again or search by city/area name.'
            );
            break;
          default:
            setDetectionError(
              'Could not determine your location. Please choose a city below.'
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Select a preset Sri Lankan hub or city
  const handleSelectHub = (hub: SriLankanHub) => {
    setDetectionError(null);
    const locationInfo: DetectedLocationInfo = {
      coordinates: hub.coordinates,
      displayName: `${hub.name}, ${hub.province}, Sri Lanka`,
      city: hub.name,
      areaOrDistrict: hub.district,
      country: 'Sri Lanka',
      isWithinSriLanka: true,
      closestSriLankaHub: hub,
      source: 'manual',
    };
    onSelectLocation(locationInfo);
    setManualOpen(false);
    setManualQuery('');
  };

  // Filter hubs based on manual input
  const filteredHubs = SRI_LANKAN_HUBS.filter(
    (hub) =>
      hub.name.toLowerCase().includes(manualQuery.toLowerCase()) ||
      hub.district.toLowerCase().includes(manualQuery.toLowerCase()) ||
      hub.region.toLowerCase().includes(manualQuery.toLowerCase())
  );

  return (
    <div
      id="hotel-location-search-section"
      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-5"
    >
      {/* Top Header & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>📍 Find Hotels Near Me</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
            Discover Stays Near Your Location
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
            Detect your live device location or search any Sri Lankan city to find heritage resorts, boutique villas, and luxury hotels sorted by distance.
          </p>
        </div>

        {/* Action Buttons: Use My Location & Search Another Location */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="use-my-location-btn"
            onClick={handleUseMyLocation}
            disabled={isDetecting}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isDetecting
                ? 'bg-emerald-700 text-white opacity-80 cursor-wait'
                : activeLocation?.source === 'gps'
                ? 'bg-emerald-900 hover:bg-emerald-950 text-white'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white active:scale-98'
            }`}
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                <span>{t('Detecting Location...')}</span>
              </>
            ) : (
              <>
                <LocateFixed className="w-4 h-4 text-emerald-300" />
                <span>{t('Use My Location')}</span>
              </>
            )}
          </button>

          <button
            id="search-another-location-btn"
            onClick={() => setManualOpen(!isManualOpen)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isManualOpen
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
            }`}
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span>{t('Search Another Location')}</span>
          </button>

          {activeLocation && (
            <button
              id="clear-location-filter-btn"
              onClick={onClearLocation}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset location filter and show all hotels"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('Reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Denied or Detection Error Notice */}
      {detectionError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{detectionError}</p>
            <p className="text-amber-800 text-[11px]">
              Tip: You can tap <strong>"Search Another Location"</strong> to manually choose cities like Galle, Ella, Kandy, Sigiriya, or Colombo.
            </p>
          </div>
        </div>
      )}

      {/* Active Location Display Banner */}
      {activeLocation && (
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              {activeLocation.source === 'gps' ? (
                <LocateFixed className="w-5 h-5 text-emerald-300" />
              ) : (
                <Building2 className="w-5 h-5 text-emerald-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  {activeLocation.source === 'gps' ? 'Current Device Location' : 'Selected Destination'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                  Active
                </span>
              </div>
              <h3 className="text-lg font-black text-emerald-950 mt-0.5">
                {activeLocation.displayName}
              </h3>
              <p className="text-xs text-emerald-800/90 mt-0.5">
                {activeLocation.isWithinSriLanka ? (
                  <>
                    Showing curated hotels near <strong>{activeLocation.city}</strong> sorted by shortest distance. Found {nearbyCount} available hotel{nearbyCount === 1 ? '' : 's'}.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Note:</span> Detected coordinates ({activeLocation.coordinates.lat.toFixed(3)}°, {activeLocation.coordinates.lng.toFixed(3)}°) are outside Sri Lanka. Stays are ordered by distance from your location towards Sri Lankan destinations.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setManualOpen(true)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
            >
              Change Location
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={onClearLocation}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Manual Search Modal / Expandable Panel */}
      {isManualOpen && (
        <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/70 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-stone-900">
                Search Another City or Area in Sri Lanka
              </h3>
            </div>
            <button
              onClick={() => setManualOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder="Type city or region name (e.g. Galle, Ella, Kandy, Colombo, Sigiriya)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
              autoFocus
            />
          </div>

          {/* Popular Sri Lanka Hubs Quick-Selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Popular Travel Destinations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filteredHubs.map((hub) => {
                const isSelected = activeLocation?.city === hub.name;
                return (
                  <button
                    key={hub.id}
                    onClick={() => handleSelectHub(hub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{hub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
