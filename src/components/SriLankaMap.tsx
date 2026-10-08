import { openGoogleMapsSearch } from '../utils/navigation';
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  Sun,
  Clock,
  ExternalLink,
  Heart,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Train,
  Car,
  Search,
  X,
} from 'lucide-react';
import { Destination, PageId } from '../types';
import { destinationsData } from '../data/destinationsData';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedDestinations } from '../data/translatedDestinations';

interface SriLankaMapProps {
  onSelectDestination: (dest: Destination) => void;
  onNavigatePage: (page: PageId) => void;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
}

// Sri Lanka geographic center and bounds
const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const SRI_LANKA_BOUNDS: L.LatLngBoundsLiteral = [
  [5.85, 79.5],
  [9.95, 82.05],
];

// Key Route Coordinates for Scenic Train & Expressways
const SCENIC_TRAIN_COORDS: [number, number][] = [
  [6.9344, 79.8519], // Colombo Fort
  [7.084, 80.009],  // Ragama
  [7.252, 80.346],  // Polgahawela
  [7.2906, 80.6337], // Kandy
  [7.141, 80.612],  // Peradeniya
  [7.054, 80.665],  // Gampola
  [6.972, 80.685],  // Hatton
  [6.953, 80.748],  // Nanu Oya (Nuwara Eliya)
  [6.866, 81.046],  // Ella
  [6.902, 81.066],  // Demodara
];

const COASTAL_TRAIN_COORDS: [number, number][] = [
  [6.9344, 79.8519], // Colombo Fort
  [6.840, 79.865],  // Mount Lavinia
  [6.585, 79.960],  // Kalutara
  [6.425, 79.998],  // Bentota
  [6.235, 80.054],  // Hikkaduwa
  [6.0535, 80.221], // Galle
  [5.972, 80.385],  // Weligama
  [5.9483, 80.4578], // Mirissa
  [5.948, 80.535],  // Matara
];

const NORTHERN_TRAIN_COORDS: [number, number][] = [
  [6.9344, 79.8519], // Colombo Fort
  [7.486, 80.364],  // Kurunegala
  [8.3114, 80.4037], // Anuradhapura
  [8.754, 80.498],  // Vavuniya
  [9.155, 80.415],  // Kilinochchi
  [9.6615, 80.0255], // Jaffna
];

const SOUTHERN_EXPRESSWAY_COORDS: [number, number][] = [
  [6.842, 79.998],  // Kottawa / Makumbura
  [6.582, 80.082],  // Dodangoda
  [6.350, 80.198],  // Kurundugahahetekma
  [6.095, 80.235],  // Pinnaduwa (Galle)
  [5.985, 80.485],  // Kokmaduwa (Weligama/Mirissa)
  [5.962, 80.575],  // Godagama (Matara)
  [6.125, 81.121],  // Hambantota
];

const ALL_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
];

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  onSelectDestination,
  onNavigatePage,
  onToggleFavourite,
  isFavourite,
}) => {
  const { t, language } = useTranslation();

  const localizedDestinations = React.useMemo(() => {
    return getLocalizedDestinations(destinationsData, language);
  }, [language]);

  // Map each destination id to its raw (English) district and category for stable filtering
  // regardless of the active display language (translations change district and category names)
  const rawDistrictMap = React.useMemo(() => {
    const dMap: Record<string, string> = {};
    const cMap: Record<string, string> = {};
    destinationsData.forEach((d) => {
      dMap[d.id] = d.district || '';
      cMap[d.id] = d.category || '';
    });
    return { dMap, cMap };
  }, []);

  const [selectedDestId, setSelectedDestId] = useState<string>('sigiriya');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [tileLayerType, setTileLayerType] = useState<'streets' | 'topo'>('streets');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const districtHighlightLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const selectedDestination =
    localizedDestinations.find((d) => d.id === selectedDestId) || localizedDestinations[0];

  // Filter pins based on selected category, district, and search query
  const filteredDestinations = localizedDestinations.filter((dest) => {
    // 1. Category filter
    if (activeFilter === 'beach' && rawDistrictMap.cMap[dest.id] !== 'Beach') return false;
    if (activeFilter === 'heritage' && rawDistrictMap.cMap[dest.id] !== 'Heritage') return false;
    if (activeFilter === 'mountain' && rawDistrictMap.cMap[dest.id] !== 'Mountain') return false;
    if (activeFilter === 'wildlife' && rawDistrictMap.cMap[dest.id] !== 'Wildlife') return false;
    if (activeFilter === 'nature' && rawDistrictMap.cMap[dest.id] !== 'Nature') return false;

    // 2. District filter (use raw English district so it works in all languages)
    if (selectedDistrict !== 'all' && rawDistrictMap.dMap[dest.id] !== selectedDistrict) return false;

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        dest.name.toLowerCase().includes(q) ||
        dest.localName.toLowerCase().includes(q) ||
        (dest.district && dest.district.toLowerCase().includes(q)) ||
        dest.region.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q) ||
        dest.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Helper to generate custom styled Leaflet DivIcon with active district & selection state
  const createMarkerIcon = (
    dest: Destination,
    isSelected: boolean,
    isDistrictActive: boolean
  ) => {
    const getBgColor = () => {
      if (isSelected) return 'bg-amber-500 ring-4 ring-amber-300 shadow-2xl';
      if (isDistrictActive) return 'bg-emerald-600 ring-3 ring-emerald-300 shadow-lg';
      switch (dest.category) {
        case 'Beach':
          return 'bg-sky-600 hover:bg-sky-700';
        case 'Heritage':
          return 'bg-amber-700 hover:bg-amber-800';
        case 'Mountain':
          return 'bg-emerald-700 hover:bg-emerald-800';
        case 'Wildlife':
          return 'bg-orange-600 hover:bg-orange-700';
        case 'Nature':
          return 'bg-teal-700 hover:bg-teal-800';
        case 'City':
          return 'bg-violet-700 hover:bg-violet-800';
        default:
          return 'bg-emerald-800 hover:bg-emerald-900';
      }
    };

    const isFeatured = ['colombo', 'kandy', 'ella', 'galle', 'sigiriya'].includes(dest.id);

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -100%);">
          ${
            isSelected
              ? '<span class="absolute top-2 w-7 h-7 rounded-full bg-amber-400/60 animate-ping pointer-events-none"></span>'
              : isDistrictActive
              ? '<span class="absolute top-2 w-6 h-6 rounded-full bg-emerald-400/50 animate-pulse pointer-events-none"></span>'
              : ''
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            isSelected
              ? 'border-white scale-125'
              : isDistrictActive
              ? 'border-emerald-200 scale-110'
              : 'border-white'
          } shadow-md text-white transition-all transform group-hover:scale-115 ${getBgColor()}">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md text-[11px] font-black tracking-tight whitespace-nowrap shadow-sm transition-all pointer-events-none ${
            isSelected
              ? 'bg-stone-900 text-white ring-2 ring-amber-400 opacity-100 scale-105'
              : isDistrictActive
              ? 'bg-emerald-950 text-emerald-100 ring-1 ring-emerald-400 opacity-100 font-extrabold scale-105 shadow-md'
              : isFeatured
              ? 'bg-white/95 text-stone-900 border border-stone-200 opacity-95 group-hover:opacity-100 group-hover:bg-stone-900 group-hover:text-white'
              : 'bg-white/90 text-stone-800 border border-stone-200 opacity-90 group-hover:opacity-100'
          }">
            ${dest.name}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -38],
    });
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: 7.5,
      minZoom: 6.5,
      maxZoom: 15,
      maxBounds: [
        [4.5, 78.0],
        [11.0, 83.5],
      ],
      maxBoundsViscosity: 0.8,
      zoomControl: false,
    });

    // Clean, crisp vector-styled OpenStreetMap / Carto tile layer
    const tileUrl =
      tileLayerType === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    routesLayerRef.current = L.layerGroup().addTo(map);
    districtHighlightLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Fit to Sri Lanka bounds cleanly
    map.fitBounds(SRI_LANKA_BOUNDS, { padding: [20, 20] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl =
      tileLayerType === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [tileLayerType]);

  // 3. Render Routes Layer
  useEffect(() => {
    if (!routesLayerRef.current) return;
    routesLayerRef.current.clearLayers();

    if (!showRoutes) return;

    // Main Scenic Railway Line (Blue dashed)
    L.polyline(SCENIC_TRAIN_COORDS, {
      color: '#0284c7',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 6',
    })
      .bindTooltip('Main Line Scenic Train (Colombo – Kandy – Nuwara Eliya – Ella)', {
        sticky: true,
      })
      .addTo(routesLayerRef.current);

    // Coastal Railway Line (Cyan dashed)
    L.polyline(COASTAL_TRAIN_COORDS, {
      color: '#0369a1',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 6',
    })
      .bindTooltip('Coastal Railway Line (Colombo – Galle – Mirissa – Matara)', {
        sticky: true,
      })
      .addTo(routesLayerRef.current);

    // Northern Yal Devi Line
    L.polyline(NORTHERN_TRAIN_COORDS, {
      color: '#0ea5e9',
      weight: 3,
      opacity: 0.75,
      dashArray: '5, 5',
    })
      .bindTooltip('Yal Devi Northern Railway (Colombo – Anuradhapura – Jaffna)', {
        sticky: true,
      })
      .addTo(routesLayerRef.current);

    // Southern Expressway E01 (Red solid)
    L.polyline(SOUTHERN_EXPRESSWAY_COORDS, {
      color: '#dc2626',
      weight: 3.5,
      opacity: 0.8,
    })
      .bindTooltip('Southern Expressway E01 (Colombo – Galle – Matara – Hambantota)', {
        sticky: true,
      })
      .addTo(routesLayerRef.current);
  }, [showRoutes]);

  // 4. Render Markers Layer with Active District Highlighting
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    filteredDestinations.forEach((dest) => {
      const isSelected = dest.id === selectedDestId;
      const isDistrictActive = selectedDistrict !== 'all' && rawDistrictMap.dMap[dest.id] === selectedDistrict;
      const icon = createMarkerIcon(dest, isSelected, isDistrictActive);

      const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], {
        icon,
        title: dest.name,
        zIndexOffset: isSelected ? 1000 : isDistrictActive ? 600 : 100,
      });

      marker.on('click', () => {
        setSelectedDestId(dest.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([dest.coordinates.lat, dest.coordinates.lng], 11, {
            duration: 0.8,
          });
        }
      });

      // Simple popup
      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px; padding: 2px;">
          <strong style="display: block; font-size: 14px; color: #064e3b; margin-bottom: 2px;">${dest.name}</strong>
          <span style="display: inline-block; font-size: 10px; font-weight: bold; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;">
            ${dest.category}${dest.district ? ' • ' + dest.district + ' District' : ''} • ${dest.region}
          </span>
          <p style="font-size: 11px; color: #57534e; margin: 0 0 6px 0; line-height: 1.3;">${dest.tagline}</p>
          <div style="font-size: 11px; font-weight: bold; color: #1c1917;">Weather: ${dest.weather.tempC}°C • ${dest.weather.condition}</div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredDestinations, selectedDestId, selectedDistrict]);

  // 5. District Selection & Highlighting Action (Moves map, fits bounds, highlights group)
  const handleDistrictSelect = (districtName: string, targetDestId?: string) => {
    setSelectedDistrict(districtName);

    if (districtName === 'all') {
      if (districtHighlightLayerRef.current) {
        districtHighlightLayerRef.current.clearLayers();
      }
      if (targetDestId) {
        setSelectedDestId(targetDestId);
        const target = destinationsData.find((d) => d.id === targetDestId);
        if (target && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 9.5, {
            duration: 0.8,
          });
        }
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.flyToBounds(SRI_LANKA_BOUNDS, {
          padding: [20, 20],
          duration: 0.8,
        });
      }
      return;
    }

    // Find all attractions in the chosen district
    const districtPlaces = destinationsData.filter((d) => d.district === districtName);
    if (districtPlaces.length === 0) return;

    // Pick selected destination: prefer targetDestId if inside district, else keep current if in district, else pick first
    const hasTarget = targetDestId && districtPlaces.some((d) => d.id === targetDestId);
    const currentInDistrict = districtPlaces.some((d) => d.id === selectedDestId);
    const nextSelectedId = hasTarget
      ? targetDestId!
      : currentInDistrict
      ? selectedDestId
      : districtPlaces[0].id;

    setSelectedDestId(nextSelectedId);

    // Zoom and pan to fit all attractions in this district
    if (mapInstanceRef.current) {
      if (districtPlaces.length === 1) {
        mapInstanceRef.current.flyTo(
          [districtPlaces[0].coordinates.lat, districtPlaces[0].coordinates.lng],
          11,
          { duration: 0.9 }
        );
      } else {
        const bounds = L.latLngBounds(
          districtPlaces.map((p) => [p.coordinates.lat, p.coordinates.lng])
        );
        mapInstanceRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12.5,
          duration: 0.9,
        });
      }

      // Draw subtle halo circle around the district cluster
      if (districtHighlightLayerRef.current) {
        districtHighlightLayerRef.current.clearLayers();
        const centerLat =
          districtPlaces.reduce((s, p) => s + p.coordinates.lat, 0) / districtPlaces.length;
        const centerLng =
          districtPlaces.reduce((s, p) => s + p.coordinates.lng, 0) / districtPlaces.length;

        let maxDistMeters = 4000;
        districtPlaces.forEach((p) => {
          const d = mapInstanceRef.current!.distance(
            [centerLat, centerLng],
            [p.coordinates.lat, p.coordinates.lng]
          );
          if (d > maxDistMeters) maxDistMeters = d;
        });

        const highlightZone = L.circle([centerLat, centerLng], {
          radius: maxDistMeters + 3500,
          color: '#059669',
          weight: 2,
          dashArray: '6, 8',
          fillColor: '#10b981',
          fillOpacity: 0.08,
          interactive: false,
        });
        districtHighlightLayerRef.current.addLayer(highlightZone);
      }
    }
  };

  // 6. Jump to Travel Hub (Synchronizes with district & zooms to destination)
  const handleJumpToHub = (hubId: string) => {
    const dest = destinationsData.find((d) => d.id === hubId);
    if (dest && dest.district) {
      handleDistrictSelect(dest.district, dest.id);
    } else {
      handleSelectAndPan(hubId);
    }
  };

  // 7. Center map on selected destination when clicked
  const handleSelectAndPan = (destId: string) => {
    setSelectedDestId(destId);
    const dest = destinationsData.find((d) => d.id === destId);
    if (dest && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([dest.coordinates.lat, dest.coordinates.lng], 11, {
        duration: 0.8,
      });
    }
  };

  const handleResetView = () => {
    handleDistrictSelect('all');
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              {t('Real Interactive Map')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              {t('Sri Lanka Interactive Travel Map')}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
              {t('Zoom, pan, and click on key travel hubs across Sri Lanka. Discover regional travel times, scenic train routes, and comprehensive travel details.')}
            </p>
          </div>

          {/* Map Layer & Display Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                showRoutes
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showRoutes ? t('Train & Highway Routes: On') : t('Show Transit Routes')}</span>
            </button>

            <button
              onClick={() => setTileLayerType(tileLayerType === 'streets' ? 'topo' : 'streets')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>{t('Map Style:')} {tileLayerType === 'streets' ? t('Voyager') : t('Topography')}</span>
            </button>
          </div>
        </div>

        {/* Search, District and Category Filters Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search Colombo, Ratnapura, Nuwara Eliya, temples, waterfalls...')}
                className="w-full pl-10 pr-9 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
                  title={t('Clear')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* District Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-stone-600 shrink-0 hidden md:inline">{t('District:')}</span>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">{t('All 25 Districts')}</option>
                {ALL_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {t(d)} {t('District')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { id: 'all', label: `${t('All Attractions')} (${localizedDestinations.length})` },
              { id: 'heritage', label: t('UNESCO & Heritage') },
              { id: 'mountain', label: t('Highlands & Peaks') },
              { id: 'beach', label: t('Beaches & Coastal') },
              { id: 'wildlife', label: t('National Parks & Wildlife') },
              { id: 'nature', label: t('Nature & Waterfalls') },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Result Counter & Reset */}
          {(searchQuery || selectedDistrict !== 'all' || activeFilter !== 'all') && (
            <div className="flex items-center justify-between text-[11px] text-stone-600 pt-2 border-t border-stone-100">
              <span>
                {t('Showing')} <strong>{filteredDestinations.length}</strong> {t('places')}
                {selectedDistrict !== 'all' && ` ${t('in')} ${t(selectedDistrict)} ${t('District')}`}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  handleDistrictSelect('all');
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                {t('Reset Filters')}
              </button>
            </div>
          )}
        </div>

        {/* Quick Hub Shortcut Bar with District Synchronization */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-stone-500 uppercase text-[10px] tracking-wider shrink-0 mr-1">
            {t('Quick Jump:')}
          </span>
          {[
            { id: 'colombo', label: 'Colombo', district: 'Colombo' },
            { id: 'ratnapura-saman-dewalaya', label: 'Ratnapura', district: 'Ratnapura' },
            { id: 'nuwara-eliya', label: 'Nuwara Eliya', district: 'Nuwara Eliya' },
            { id: 'kandy', label: 'Kandy', district: 'Kandy' },
            { id: 'ella', label: 'Ella', district: 'Badulla' },
            { id: 'galle', label: 'Galle', district: 'Galle' },
            { id: 'mirissa', label: 'Mirissa', district: 'Matara' },
            { id: 'sigiriya', label: 'Sigiriya', district: 'Matale' },
            { id: 'yala', label: 'Yala', district: 'Hambantota' },
            { id: 'jaffna', label: 'Jaffna', district: 'Jaffna' },
            { id: 'anuradhapura', label: 'Anuradhapura', district: 'Anuradhapura' },
            { id: 'trincomalee', label: 'Trincomalee', district: 'Trincomalee' },
            { id: 'dambulla', label: 'Dambulla', district: 'Matale' },
            { id: 'polonnaruwa', label: 'Polonnaruwa', district: 'Polonnaruwa' },
            { id: 'horton-plains', label: 'Horton Plains', district: 'Nuwara Eliya' },
            { id: 'bentota', label: 'Bentota', district: 'Galle' },
            { id: 'arugam-bay', label: 'Arugam Bay', district: 'Ampara' },
            { id: 'udawalawe', label: 'Udawalawe', district: 'Ratnapura' },
          ].map((hub) => {
            const isHubActive =
              selectedDestId === hub.id ||
              (selectedDistrict === hub.district && selectedDistrict !== 'all');
            return (
              <button
                key={hub.id}
                onClick={() => handleJumpToHub(hub.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-all ${
                  isHubActive
                    ? 'bg-emerald-800 text-white ring-2 ring-emerald-500 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {t(hub.label)}
              </button>
            );
          })}
        </div>

        {/* Main Map Layout: Left (Leaflet Map), Right (Selected Destination Dossier) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Real Interactive Map Canvas */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl shadow-xs border border-stone-200 p-3 sm:p-4 overflow-hidden relative">
            {/* Map Canvas Header Info */}
            <div className="flex items-center justify-between mb-2 text-xs text-stone-500 font-medium px-1">
              <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                Interactive OpenStreetMap & Carto Navigation
              </span>
              <span className="hidden sm:inline-block text-[11px] text-stone-400">
                Pan, scroll to zoom, or click markers
              </span>
            </div>

            {/* Leaflet Container */}
            <div className="relative w-full h-[540px] sm:h-[620px] rounded-xl overflow-hidden border border-stone-200 shadow-inner z-0">
              <div ref={mapContainerRef} className="w-full h-full" />

              {/* Floating District Highlight Indicator */}
              {selectedDistrict !== 'all' && (
                <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow-lg text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{selectedDistrict} District</span>
                  <span className="text-emerald-300 text-[11px]">
                    ({filteredDestinations.filter((d) => d.district === selectedDistrict).length} highlighted)
                  </span>
                  <button
                    onClick={() => handleDistrictSelect('all')}
                    className="ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200 hover:text-white bg-white/10 hover:bg-white/25 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    title="Clear District Filter"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Floating Zoom & Pan Controls */}
              <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-200 shadow-md">
                <button
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
                  title="Reset Map to Sri Lanka View"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-700" />
                </button>
              </div>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-stone-200 text-[11px] space-y-1.5">
                <div className="font-bold text-stone-800 border-b border-stone-100 pb-1">
                  {t('Map Legend')}
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white" />
                  <span>{t('Highlands & Valleys')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="w-3 h-3 rounded-full bg-amber-700 border border-white" />
                  <span>{t('Cultural Triangle')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="w-3 h-3 rounded-full bg-sky-600 border border-white" />
                  <span>{t('Coastal & Beach')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="w-3 h-3 rounded-full bg-orange-600 border border-white" />
                  <span>{t('Wildlife Reserve')}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="w-3 h-3 rounded-full bg-teal-700 border border-white" />
                  <span>{t('Nature & Waterfalls')}</span>
                </div>
                {showRoutes && (
                  <>
                    <div className="flex items-center gap-2 text-stone-600 pt-1 border-t border-stone-100">
                      <span className="w-4 h-0.5 bg-sky-600 border-t border-dashed border-sky-400" />
                      <span>{t('Scenic Train Lines')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="w-4 h-0.5 bg-red-600" />
                      <span>{t('Southern Expressway')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Destination Travel Dossier */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden sticky top-24">
            {/* Card Hero Image with Badge */}
            <div className="relative h-52 w-full overflow-hidden bg-stone-900">
              <img
                src={selectedDestination.heroImage}
                alt={selectedDestination.name}
                className="w-full h-full object-cover transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/images/destinations/placeholder-destination.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {selectedDestination.photoCredit && (
                <a
                  href={selectedDestination.photoCredit.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 z-20 rounded bg-black/70 px-2 py-1 text-[9px] text-white hover:bg-black/90"
                >
                  Photo: {selectedDestination.photoCredit.author} · {selectedDestination.photoCredit.source} · {selectedDestination.photoCredit.license}
                </a>
              )}

              {/* Category, District & Region Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide">
                  {t(selectedDestination.category)}
                </span>
                {selectedDestination.district && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide">
                    {t(selectedDestination.district)} {t('District')}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-[11px] font-medium">
                  {t(selectedDestination.region)}
                </span>
              </div>

              {/* Save to Favourite Button */}
              <button
                onClick={() =>
                  onToggleFavourite({
                    id: selectedDestination.id,
                    type: 'destination',
                    title: selectedDestination.name,
                    subtitle: selectedDestination.region,
                    image: selectedDestination.heroImage,
                    linkPage: 'destinations',
                    targetId: selectedDestination.id,
                  })
                }
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                title={t('Save destination to Favourites')}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavourite(selectedDestination.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-stone-700'
                  }`}
                />
              </button>

              {/* Title & Local Name */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h2 className="text-2xl font-black tracking-tight">{selectedDestination.name}</h2>
                <p className="text-xs text-amber-300 font-medium">{selectedDestination.localName}</p>
              </div>
            </div>

            {/* Body Information */}
            <div className="p-5 space-y-4 text-sm">
              {/* Weather & Transit Row */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">{t('Weather')}</span>
                    <span className="font-bold text-stone-800 text-xs">
                      {selectedDestination.weather.tempC}°C • {t(selectedDestination.weather.condition)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">{t('From Colombo')}</span>
                    <span className="font-bold text-stone-800 text-xs truncate block max-w-[120px]">
                      {t(selectedDestination.travelTimeFromColombo)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline & Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {selectedDestination.description}
              </p>

              {/* Top Highlights */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {t('Key Highlights')}
                </h3>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {selectedDestination.highlights.slice(0, 3).map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{t(hl)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best Time to Visit & Entry Fee */}
              <div className="border-t border-stone-100 pt-3 text-xs space-y-1.5 text-stone-600">
                <div>
                  <span className="font-bold text-stone-800">{t('Best Season:')} </span>
                  <span>{t(selectedDestination.bestTimeToVisit)}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-800">{t('Entry Reference:')} </span>
                  <span>{t(selectedDestination.entryFee)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    openGoogleMapsSearch(selectedDestination.name, selectedDestination.district || selectedDestination.region, selectedDestination.coordinates);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Confirm the destination in Google Maps before choosing Directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('Navigate')}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectDestination(selectedDestination);
                    onNavigatePage('destinations');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{t('Full Guide')}</span>
                </button>

                <button
                  onClick={() => onNavigatePage('planner')}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                  title={t('Add to Trip Plan')}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('Plan')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
