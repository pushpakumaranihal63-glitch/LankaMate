import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  Fuel,
  Search,
  MapPin,
  Navigation,
  Clock,
  Phone,
  CreditCard,
  CheckCircle2,
  X,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Info,
  Layers,
  ChevronRight,
  Compass,
  AlertTriangle,
  LocateFixed,
  Sparkles,
  Globe,
  Filter,
} from 'lucide-react';
import { FuelStation, fuelStationsData } from '../data/fuelData';
import { PageId } from '../types';
import { openGoogleMapsDirections } from '../utils/navigation';

interface FuelFinderViewProps {
  onNavigatePage: (page: PageId) => void;
}

// Center and bounds of Sri Lanka
const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const COLOMBO_DEFAULT: { lat: number; lng: number } = { lat: 6.9271, lng: 79.8612 };

// Haversine distance calculator in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Map Jump Hubs: preserving existing jump locations (Ella, Kandy, Jaffna, Colombo, Galle, Mirissa, Nuwara Eliya, Sigiriya, Yala)
// plus nationwide hubs to explore the whole of Sri Lanka
interface JumpHub {
  id: string;
  label: string;
  lat: number;
  lng: number;
  zoom: number;
  province: string;
}

const MAP_JUMP_HUBS: JumpHub[] = [
  { id: 'all-island', label: 'All Island (Whole Sri Lanka)', lat: 7.8731, lng: 80.7718, zoom: 7.5, province: 'All' },
  { id: 'ella', label: 'Ella', lat: 6.8672, lng: 81.0475, zoom: 13, province: 'Uva' },
  { id: 'kandy', label: 'Kandy', lat: 7.2906, lng: 80.6337, zoom: 13, province: 'Central' },
  { id: 'jaffna', label: 'Jaffna', lat: 9.6642, lng: 80.0185, zoom: 13, province: 'Northern' },
  { id: 'colombo', label: 'Colombo', lat: 6.9271, lng: 79.8612, zoom: 13, province: 'Western' },
  { id: 'galle', label: 'Galle', lat: 6.0535, lng: 80.221, zoom: 13, province: 'Southern' },
  { id: 'mirissa', label: 'Mirissa', lat: 5.9498, lng: 80.4592, zoom: 13, province: 'Southern' },
  { id: 'nuwara-eliya', label: 'Nuwara Eliya', lat: 6.9745, lng: 80.7682, zoom: 13, province: 'Central' },
  { id: 'sigiriya', label: 'Sigiriya', lat: 7.9255, lng: 80.6872, zoom: 13, province: 'Central' },
  { id: 'yala', label: 'Yala / Tissa', lat: 6.2785, lng: 81.2892, zoom: 13, province: 'Southern' },
  { id: 'trincomalee', label: 'Trincomalee', lat: 8.5742, lng: 81.2315, zoom: 13, province: 'Eastern' },
  { id: 'kurunegala', label: 'Kurunegala', lat: 7.4865, lng: 80.3645, zoom: 13, province: 'North Western' },
  { id: 'anuradhapura', label: 'Anuradhapura', lat: 8.3285, lng: 80.4124, zoom: 13, province: 'North Central' },
  { id: 'ratnapura', label: 'Ratnapura', lat: 6.6828, lng: 80.4034, zoom: 13, province: 'Sabaragamuwa' },
  { id: 'badulla', label: 'Badulla', lat: 6.989, lng: 81.056, zoom: 13, province: 'Uva' },
  { id: 'batticaloa', label: 'Batticaloa', lat: 7.717, lng: 81.699, zoom: 13, province: 'Eastern' },
];

const PROVINCE_OPTIONS = [
  'All Island',
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const;

export const FuelFinderView: React.FC<FuelFinderViewProps> = ({ onNavigatePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('All Island');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<'all' | 'petrol' | 'diesel'>('all');
  const [fuelSubFilter, setFuelSubFilter] = useState<'all' | '92' | '95' | 'auto' | 'super'>('all');
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'near-me' | '10' | '25' | '50'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isRealGpsActive, setIsRealGpsActive] = useState<boolean>(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeJumpHubId, setActiveJumpHubId] = useState<string>('all-island');

  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(fuelStationsData[0]);
  const [detailModalStation, setDetailModalStation] = useState<FuelStation | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const stationMarkersMap = useRef<Map<string, L.Marker>>(new Map());

  // Check if real GPS was already detected in this session (e.g. from Near Me or previous visit)
  useEffect(() => {
    try {
      const savedGps = sessionStorage.getItem('lankamate_detected_user_gps');
      if (savedGps) {
        const parsed = JSON.parse(savedGps);
        if (parsed.lat && parsed.lng) {
          setUserLocation({ lat: parsed.lat, lng: parsed.lng });
          setIsRealGpsActive(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Handle Geolocation for "Near Me"
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setUserLocation(COLOMBO_DEFAULT);
      setIsRealGpsActive(false);
      return;
    }
    setLocatingUser(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        // Check if inside or near Sri Lanka bounds
        if (latitude >= 5.5 && latitude <= 10.5 && longitude >= 79.0 && longitude <= 82.5) {
          const userGps = { lat: latitude, lng: longitude };
          setUserLocation(userGps);
          setIsRealGpsActive(true);
          try {
            sessionStorage.setItem(
              'lankamate_detected_user_gps',
              JSON.stringify({ lat: latitude, lng: longitude, accuracy: pos.coords.accuracy })
            );
          } catch (e) {}
        } else {
          // Overseas or simulator fallback to Colombo with clear explanation
          setUserLocation(COLOMBO_DEFAULT);
          setIsRealGpsActive(false);
          setLocationError('Your current GPS is outside Sri Lanka. Distances are calculated relative to Colombo City Center.');
        }
      },
      (err) => {
        setLocatingUser(false);
        setUserLocation(COLOMBO_DEFAULT);
        setIsRealGpsActive(false);
        setLocationError('Could not acquire GPS permission. Distances calculated relative to Colombo Center.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // When user switches to 'near-me'
  useEffect(() => {
    if (distanceFilter === 'near-me' && !userLocation) {
      handleRequestLocation();
    }
  }, [distanceFilter, userLocation]);

  // Compute stations with dynamic distance
  const stationsWithDistance = useMemo(() => {
    const origin = userLocation || COLOMBO_DEFAULT;
    return fuelStationsData.map((station) => {
      const dist = calculateDistanceKm(
        origin.lat,
        origin.lng,
        station.coordinates.lat,
        station.coordinates.lng
      );
      return {
        ...station,
        dynamicDistanceKm: dist,
      };
    });
  }, [userLocation]);

  // Determine if user has initiated a search or active filter (vs default sample browsing)
  const isSearchActive = useMemo(() => {
    return searchQuery.trim().length > 0 || provinceFilter !== 'All Island';
  }, [searchQuery, provinceFilter]);

  // Filter stations based on criteria across the WHOLE of Sri Lanka
  const filteredStations = useMemo(() => {
    return stationsWithDistance
      .filter((station) => {
        // Province Filter
        if (provinceFilter !== 'All Island') {
          if (station.province !== provinceFilter) return false;
        }

        // Search query filter (matches name, city, area, address, province, district, operator)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            station.name.toLowerCase().includes(q) ||
            station.city.toLowerCase().includes(q) ||
            station.area.toLowerCase().includes(q) ||
            station.address.toLowerCase().includes(q) ||
            station.province.toLowerCase().includes(q) ||
            (station.district && station.district.toLowerCase().includes(q)) ||
            station.operator.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Fuel Type & Subtype Filter
        if (fuelTypeFilter === 'petrol') {
          if (!station.fuelTypes.petrol92 && !station.fuelTypes.petrol95) return false;
          if (fuelSubFilter === '92' && !station.fuelTypes.petrol92) return false;
          if (fuelSubFilter === '95' && !station.fuelTypes.petrol95) return false;
        } else if (fuelTypeFilter === 'diesel') {
          if (!station.fuelTypes.autoDiesel && !station.fuelTypes.superDiesel) return false;
          if (fuelSubFilter === 'auto' && !station.fuelTypes.autoDiesel) return false;
          if (fuelSubFilter === 'super' && !station.fuelTypes.superDiesel) return false;
        }

        // Distance Filter
        if (distanceFilter === '10') {
          if (station.dynamicDistanceKm > 10) return false;
        } else if (distanceFilter === '25') {
          if (station.dynamicDistanceKm > 25) return false;
        } else if (distanceFilter === '50') {
          if (station.dynamicDistanceKm > 50) return false;
        } else if (distanceFilter === 'near-me') {
          if (station.dynamicDistanceKm > 35) return false;
        }

        return true;
      })
      .sort((a, b) => a.dynamicDistanceKm - b.dynamicDistanceKm);
  }, [stationsWithDistance, provinceFilter, searchQuery, fuelTypeFilter, fuelSubFilter, distanceFilter]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: 7.5,
      minZoom: 6.5,
      maxZoom: 16,
      maxBounds: [
        [4.5, 78.0],
        [11.0, 83.5],
      ],
      maxBoundsViscosity: 0.8,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Markers when filtered stations or selectedStation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    stationMarkersMap.current.clear();

    filteredStations.forEach((st) => {
      const isSelected = selectedStation?.id === st.id;

      // Color coding based on brand
      const brandColor =
        st.operator === 'Ceypetco'
          ? '#15803d' // green
          : st.operator === 'Lanka IOC'
          ? '#1d4ed8' // blue
          : '#ea580c'; // orange / sinopec

      const markerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -100%);">
          ${
            isSelected
              ? '<span class="absolute top-1 w-8 h-8 rounded-full bg-amber-400/60 animate-ping pointer-events-none"></span>'
              : ''
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white transition-all transform group-hover:scale-110 ${
            isSelected ? 'ring-3 ring-amber-400 scale-110' : ''
          }" style="background-color: ${brandColor};">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" x2="15" y1="22" y2="22"/>
              <line x1="4" x2="14" y1="9" y2="9"/>
              <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/>
              <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>
            </svg>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight whitespace-nowrap shadow-xs transition-all pointer-events-none ${
            isSelected
              ? 'bg-stone-900 text-white ring-1 ring-amber-400 opacity-100 scale-105'
              : 'bg-white/95 text-stone-900 border border-stone-200 opacity-90 group-hover:opacity-100'
          }">
            ${st.city} (${st.operator})
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-fuel-marker',
        html: markerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([st.coordinates.lat, st.coordinates.lng], { icon });

      // Leaflet Popup with navigation button
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-stone-900 font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center gap-1.5 mb-1">
          <span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white" style="background-color: ${brandColor};">
            ${st.operator}
          </span>
          <span class="text-[10px] text-stone-500 font-semibold">${st.city} • ${st.province}</span>
        </div>
        <h4 class="font-bold text-xs leading-tight mb-1 text-stone-900">${st.name}</h4>
        <p class="text-[11px] text-stone-600 mb-2">${st.address}</p>
        <div class="flex items-center gap-1.5">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${st.coordinates.lat},${st.coordinates.lng}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-[10px] font-bold shadow-2xs no-underline"
          >
            <span>Navigate</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedStation(st);
      });

      marker.addTo(markersGroup);
      stationMarkersMap.current.set(st.id, marker);
    });
  }, [filteredStations, selectedStation]);

  // Pan to selected station on map
  const handleSelectStation = (station: FuelStation) => {
    setSelectedStation(station);
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([station.coordinates.lat, station.coordinates.lng], 13, {
        animate: true,
        duration: 0.8,
      });
      const marker = stationMarkersMap.current.get(station.id);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 400);
      }
    }
  };

  // Handle Quick Jump Hub (keeps Ella, Kandy, Jaffna and all other current jump locations accessible)
  const handleJumpToHub = (hub: JumpHub) => {
    setActiveJumpHubId(hub.id);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hub.id === 'all-island') {
      map.setView(SRI_LANKA_CENTER, 7.5, { animate: true, duration: 0.8 });
      setProvinceFilter('All Island');
      return;
    }

    map.setView([hub.lat, hub.lng], hub.zoom, { animate: true, duration: 0.8 });

    // Find nearest station to this jump hub and highlight it
    let nearestSt = fuelStationsData[0];
    let minD = Infinity;
    fuelStationsData.forEach((st) => {
      const d = calculateDistanceKm(hub.lat, hub.lng, st.coordinates.lat, st.coordinates.lng);
      if (d < minD) {
        minD = d;
        nearestSt = st;
      }
    });

    if (nearestSt) {
      setSelectedStation(nearestSt);
      setTimeout(() => {
        const marker = stationMarkersMap.current.get(nearestSt.id);
        if (marker) {
          marker.openPopup();
        }
      }, 450);
    }
  };

  // Clear all filters and reset to whole island sample view
  const handleClearFilters = () => {
    setSearchQuery('');
    setProvinceFilter('All Island');
    setFuelTypeFilter('all');
    setFuelSubFilter('all');
    setDistanceFilter('all');
    setActiveJumpHubId('all-island');
    setSelectedStation(fuelStationsData[0]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(SRI_LANKA_CENTER, 7.5, { animate: true });
    }
  };

  // Open Google Maps Directions via unified navigation utility
  const handleNavigate = (station: FuelStation) => {
    openGoogleMapsDirections(station.coordinates.lat, station.coordinates.lng, station.name);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0c2340] via-blue-900 to-[#0c2340] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-blue-950/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700/80 text-sky-200 text-xs font-bold tracking-wide">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Sri Lanka Travel Support</span>
              </div>

              <button
                type="button"
                id="btn-fuel-to-near-me"
                onClick={() => onNavigatePage('near-me')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-emerald-300" />
                <span>All Near Me Places (Hotels, ATMs, Hospitals...)</span>
              </button>
            </div>

            {/* Clear Mode Status Badge (Distinguishes between Demo Reference vs Active Search Results) */}
            {isSearchActive ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Active Search Results</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
                <Info className="w-3.5 h-3.5 text-amber-300" />
                <span>Demo / Reference Directory</span>
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Fuel Finder
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium mt-2 leading-relaxed">
              Find fuel stations across all 9 provinces and regions of Sri Lanka
            </p>
          </div>

          {/* Guidance note explaining scope & data integrity */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-start gap-3 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Island-wide Coverage:</strong> Fuel stations available across
              all provinces — Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, and
              Sabaragamuwa. Search by city, town, or province, or use your GPS location to calculate exact travel distances.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filter Bar Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-stone-200/90 space-y-5">
          {/* Row 1: Search Input & Primary Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-7 relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="fuel-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, town, or area (e.g., Ratnapura, Kurunegala, Galle, Ella, Jaffna, Trincomalee)..."
                className="w-full pl-11 pr-10 py-3 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-2xl text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-full cursor-pointer"
                  title="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-5 flex items-center gap-2">
              <button
                type="button"
                id="btn-fuel-search"
                onClick={() => {
                  const resultsEl = document.getElementById('fuel-results-section');
                  resultsEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 px-4 bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <Search className="w-4 h-4" />
                <span>Search Stations</span>
              </button>

              <button
                type="button"
                id="btn-fuel-clear-filters"
                onClick={handleClearFilters}
                className="py-3 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                title="Reset all filters to All Island"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Row 2: Whole Sri Lanka Province Selector */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-900" />
                <span>Browse Province / Island-wide Region</span>
              </label>
              <span className="text-[11px] text-stone-500">
                {provinceFilter === 'All Island' ? 'All 9 Provinces' : `${provinceFilter} Province`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {PROVINCE_OPTIONS.map((prov) => (
                <button
                  key={prov}
                  type="button"
                  id={`province-tab-${prov.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setProvinceFilter(prov);
                    setActiveJumpHubId('all-island');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    provinceFilter === prov
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Fuel Type Selector & Proximity / GPS Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-stone-100">
            {/* Fuel Type Selector */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-blue-900" />
                <span>Fuel Type Selector</span>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="filter-fuel-all"
                  onClick={() => {
                    setFuelTypeFilter('all');
                    setFuelSubFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    fuelTypeFilter === 'all'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  All Fuels
                </button>

                <button
                  type="button"
                  id="filter-fuel-petrol"
                  onClick={() => {
                    setFuelTypeFilter('petrol');
                    setFuelSubFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    fuelTypeFilter === 'petrol'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Petrol</span>
                </button>

                <button
                  type="button"
                  id="filter-fuel-diesel"
                  onClick={() => {
                    setFuelTypeFilter('diesel');
                    setFuelSubFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    fuelTypeFilter === 'diesel'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Diesel</span>
                </button>
              </div>

              {/* Sub-chips for specific fuel grades */}
              {fuelTypeFilter === 'petrol' && (
                <div className="flex items-center gap-1.5 pt-1 animate-in fade-in duration-150">
                  <span className="text-[11px] text-stone-500 font-medium mr-1">Grade:</span>
                  {[
                    { id: 'all', label: 'All Petrol' },
                    { id: '92', label: 'Petrol 92 Octane' },
                    { id: '95', label: 'Petrol 95 Octane' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setFuelSubFilter(sub.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        fuelSubFilter === sub.id
                          ? 'bg-emerald-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {fuelTypeFilter === 'diesel' && (
                <div className="flex items-center gap-1.5 pt-1 animate-in fade-in duration-150">
                  <span className="text-[11px] text-stone-500 font-medium mr-1">Grade:</span>
                  {[
                    { id: 'all', label: 'All Diesel' },
                    { id: 'auto', label: 'Auto Diesel' },
                    { id: 'super', label: 'Super Diesel (Euro 4)' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setFuelSubFilter(sub.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        fuelSubFilter === sub.id
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Distance / GPS Proximity Options */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-900" />
                  <span>Distance / Real GPS Location</span>
                </span>
                {isRealGpsActive && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Real GPS Active</span>
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="filter-dist-near-me"
                  onClick={() => {
                    setDistanceFilter('near-me');
                    if (!userLocation || !isRealGpsActive) handleRequestLocation();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    distanceFilter === 'near-me'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-sky-50 hover:bg-sky-100 text-blue-900 border border-sky-200'
                  }`}
                >
                  <LocateFixed
                    className={`w-3.5 h-3.5 ${locatingUser ? 'animate-spin text-amber-400' : ''}`}
                  />
                  <span>Near Me (GPS)</span>
                </button>

                <button
                  type="button"
                  id="filter-dist-10"
                  onClick={() => setDistanceFilter('10')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    distanceFilter === '10'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Within 10 km
                </button>

                <button
                  type="button"
                  id="filter-dist-25"
                  onClick={() => setDistanceFilter('25')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    distanceFilter === '25'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Within 25 km
                </button>

                <button
                  type="button"
                  id="filter-dist-50"
                  onClick={() => setDistanceFilter('50')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    distanceFilter === '50'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Within 50 km
                </button>

                <button
                  type="button"
                  id="filter-dist-all"
                  onClick={() => setDistanceFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    distanceFilter === 'all'
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  All Island
                </button>
              </div>

              {locationError && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  {locationError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Clear Distinction Banner: Demo / Sample Directory vs Searched Fuel Results */}
        <div className="mt-4">
          {isSearchActive ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                    Actual Searched Fuel Station Results ({filteredStations.length} stations found)
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Showing matched stations for {searchQuery ? `"${searchQuery}"` : ''} {provinceFilter !== 'All Island' ? `in ${provinceFilter} Province` : 'across Sri Lanka'}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Back to All Island Reference Directory
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950">
                    Curated Sample & Reference Stations Across Sri Lanka (Browse Mode)
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Currently browsing sample stations nationwide. Type any city (e.g. Ratnapura, Batticaloa, Kurunegala, Chilaw) above to view actual local search results.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300/60">
                  {filteredStations.length} Reference Stations Loaded
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Map & Station Details Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (Interactive Sri Lanka Fuel Map) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3">
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      Sri Lanka Fuel Station Map
                    </h3>
                    <p className="text-xs text-stone-500">
                      Showing {filteredStations.length} stations across Sri Lanka • Tap marker to view details & navigate
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Legend badges */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Ceypetco</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Lanka IOC</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                    <span>Sinopec</span>
                  </span>
                </div>
              </div>

              {/* Quick Jump Bar: Preserving Ella, Kandy, Jaffna and other current map jump locations */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin text-xs">
                <span className="font-extrabold text-stone-500 uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-blue-900" />
                  <span>Quick Jump:</span>
                </span>
                {MAP_JUMP_HUBS.map((hub) => {
                  const isActive = activeJumpHubId === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      id={`jump-location-${hub.id}`}
                      onClick={() => handleJumpToHub(hub)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {hub.label}
                    </button>
                  );
                })}
              </div>

              {/* Leaflet Map Container */}
              <div
                id="fuel-leaflet-map"
                ref={mapContainerRef}
                className="w-full h-[380px] sm:h-[460px] rounded-2xl border border-stone-200 shadow-inner z-0"
              />

              {/* Selected Station Sticky Preview on Map */}
              {selectedStation && (
                <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-stone-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-900 text-white rounded text-[10px] font-black uppercase">
                        Selected on Map
                      </span>
                      <span className="text-xs font-bold text-stone-500">
                        {selectedStation.area} • {selectedStation.province} Province
                      </span>
                      {selectedStation.isCuratedSample && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                          Curated Guide Sample
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-stone-900">{selectedStation.name}</h4>
                    <p className="text-xs text-stone-600">{selectedStation.address}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id={`btn-map-navigate-${selectedStation.id}`}
                      onClick={() => handleNavigate(selectedStation)}
                      className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer touch-manipulation"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-300" />
                      <span>Navigate</span>
                    </button>
                    <button
                      type="button"
                      id={`btn-map-details-${selectedStation.id}`}
                      onClick={() => setDetailModalStation(selectedStation)}
                      className="px-3.5 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer touch-manipulation"
                    >
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Travel Driving Advice Tip Box */}
            <div className="bg-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Sri Lanka Road Trip Advice</span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                Driving Across Provinces & Rural Corridors
              </h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                When traveling across remote highland passes (Ella, Nuwara Eliya, Hatton) or coastal national park
                routes (Yala, Wilpattu, Kumana, Bundala), fuel stations can be 20–35 km apart. Major expressways (E01
                Southern Expressway, E03 Airport Highway, E02 Outer Circular) have dedicated 24-hour service plazas like
                Welipenna. Keep tire pressure checked at 32 psi and maintain at least half a tank when climbing hills.
              </p>
            </div>
          </div>

          {/* Right Column: Station Cards List */}
          <div id="fuel-results-section" className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
                <span>{isSearchActive ? 'Search Results' : 'Fuel Stations'}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isSearchActive ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                }`}>
                  {filteredStations.length}
                </span>
              </h3>
              <span className="text-[11px] text-stone-500 font-medium">
                {userLocation ? 'Sorted by GPS distance' : 'Sorted from Colombo'}
              </span>
            </div>

            {filteredStations.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-base">No Matching Stations</h4>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    No station found matching "{searchQuery}". Try selecting another province or broadening your search distance.
                  </p>
                </div>

                {searchQuery && (
                  <div className="pt-2">
                    <a
                      href={`https://www.google.com/maps/search/fuel+station+in+${encodeURIComponent(searchQuery)}+sri+lanka`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      <span>Search "{searchQuery}" on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[780px] overflow-y-auto pr-1">
                {filteredStations.map((station) => {
                  const isSelected = selectedStation?.id === station.id;
                  const brandBadgeClass =
                    station.operator === 'Ceypetco'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      : station.operator === 'Lanka IOC'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-orange-100 text-orange-900 border-orange-200';

                  return (
                    <div
                      key={station.id}
                      id={`station-card-${station.id}`}
                      onClick={() => handleSelectStation(station)}
                      className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer text-left space-y-3 group touch-manipulation ${
                        isSelected
                          ? 'border-blue-700 ring-2 ring-blue-700/20 shadow-md bg-blue-50/20'
                          : 'border-stone-200/90 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top row: Brand & Status & Distinction Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${brandBadgeClass}`}
                          >
                            {station.operator}
                          </span>

                          {/* Clear Distinction: Searched Result vs Curated Sample vs Directory */}
                          {isSearchActive ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-600 text-white flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Search Result</span>
                            </span>
                          ) : station.isCuratedSample ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                              Guide Sample
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-600 border border-stone-200">
                              Directory Entry
                            </span>
                          )}

                          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{station.dynamicDistanceKm} km</span>
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                            station.openStatus.includes('Open')
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{station.openStatus}</span>
                        </span>
                      </div>

                      {/* Station Name, City & Province */}
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-stone-900 group-hover:text-blue-950 transition-colors leading-snug">
                          {station.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                          {station.city}, {station.area} • <strong className="text-stone-700">{station.province} Province</strong>
                        </p>
                      </div>

                      {/* Fuel Types Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {station.fuelTypes.petrol92 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                            Petrol 92
                          </span>
                        )}
                        {station.fuelTypes.petrol95 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300">
                            Petrol 95
                          </span>
                        )}
                        {station.fuelTypes.autoDiesel && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                            Auto Diesel
                          </span>
                        )}
                        {station.fuelTypes.superDiesel && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-black border border-amber-300">
                            Super Diesel
                          </span>
                        )}
                        {station.fuelTypes.kerosene && (
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200">
                            Kerosene
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: Preserving Navigate & Details */}
                      <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                        <button
                          type="button"
                          id={`btn-card-navigate-${station.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(station);
                          }}
                          className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-950 active:bg-[#0c2340] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs touch-manipulation"
                        >
                          <Navigation className="w-3.5 h-3.5 text-sky-300" />
                          <span>Navigate</span>
                        </button>

                        <button
                          type="button"
                          id={`btn-card-view-details-${station.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailModalStation(station);
                          }}
                          className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Station Details Modal */}
      {detailModalStation && (
        <div
          id="fuel-detail-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation animate-in fade-in duration-150"
          onClick={() => setDetailModalStation(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      detailModalStation.operator === 'Ceypetco'
                        ? 'bg-emerald-100 text-emerald-900'
                        : detailModalStation.operator === 'Lanka IOC'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-orange-100 text-orange-900'
                    }`}
                  >
                    {detailModalStation.operator}
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {detailModalStation.city} • {detailModalStation.province} Province
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                  {detailModalStation.name}
                </h3>
              </div>

              <button
                type="button"
                id="btn-close-fuel-modal"
                onClick={() => setDetailModalStation(null)}
                className="p-2 -mr-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Hours */}
            <div className="space-y-2.5 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Address</span>
                  <span>{detailModalStation.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Operating Hours</span>
                  <span>{detailModalStation.openingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Station Contact</span>
                  <a
                    href={`tel:${detailModalStation.contactPhone}`}
                    className="text-blue-800 font-bold hover:underline"
                  >
                    {detailModalStation.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Fuel Grades Available */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Available Fuel Grades
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    detailModalStation.fuelTypes.petrol92
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span>Petrol 92 Octane</span>
                  <span>{detailModalStation.fuelTypes.petrol92 ? '✓ Available' : '—'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    detailModalStation.fuelTypes.petrol95
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span>Petrol 95 Octane</span>
                  <span>{detailModalStation.fuelTypes.petrol95 ? '✓ Available' : '—'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    detailModalStation.fuelTypes.autoDiesel
                      ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span>Auto Diesel</span>
                  <span>{detailModalStation.fuelTypes.autoDiesel ? '✓ Available' : '—'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    detailModalStation.fuelTypes.superDiesel
                      ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span>Super Diesel (Euro 4)</span>
                  <span>{detailModalStation.fuelTypes.superDiesel ? '✓ Available' : '—'}</span>
                </div>
              </div>
            </div>

            {/* Payment & Amenities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-800" />
                  <span>Payment Options</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailModalStation.paymentMethods.map((pm, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-medium"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Station Amenities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailModalStation.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tourist / Route Note */}
            {detailModalStation.notes && (
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-950 leading-relaxed">
                <strong className="font-bold">Traveler Note: </strong>
                {detailModalStation.notes}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <button
                type="button"
                id="btn-modal-navigate-now"
                onClick={() => handleNavigate(detailModalStation)}
                className="flex-1 py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Navigation className="w-4 h-4 text-sky-300" />
                <span>Navigate in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDetailModalStation(null)}
                className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
