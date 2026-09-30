import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Compass,
  Clock,
  Sun,
  X,
  Heart,
  Calendar,
  Sparkles,
  Ticket,
  Footprints,
  Lightbulb,
  ArrowRight,
  Navigation,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Destination, Region, PageId, LanguageCode } from '../types';
import { destinationsData } from '../data/destinationsData';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedDestinations, getLocalizedDestination } from '../data/translatedDestinations';

interface DestinationsViewProps {
  onNavigatePage: (page: PageId) => void;
  selectedDestinationModal: Destination | null;
  setSelectedDestinationModal: (dest: Destination | null) => void;
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
  language: LanguageCode;
}

export const DestinationsView: React.FC<DestinationsViewProps> = ({
  onNavigatePage,
  selectedDestinationModal,
  setSelectedDestinationModal,
  onToggleFavourite,
  isFavourite,
  language,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'district'>('popular');

  const { t } = useTranslation();

  const localizedDestinations = useMemo(() => {
    return getLocalizedDestinations(destinationsData, language);
  }, [language]);

  const localizedModal = useMemo(() => {
    return selectedDestinationModal ? getLocalizedDestination(selectedDestinationModal, language) : null;
  }, [selectedDestinationModal, language]);

  const regions: string[] = [
    'All',
    'Cultural Triangle',
    'Hill Country',
    'Southern Coast',
    'Wildlife & Safari',
    'Northern Peninsula',
    'Eastern Coast',
    'Western & Urban',
    'Sabaragamuwa',
  ];

  const categories: string[] = ['All', 'Heritage', 'Mountain', 'Beach', 'Wildlife', 'Nature', 'City'];

  // Key city/district hubs with active counts
  const popularDistricts = useMemo(() => {
    return [
      { name: 'All', label: 'All Places' },
      { name: 'Colombo', label: 'Colombo' },
      { name: 'Ratnapura', label: 'Ratnapura' },
      { name: 'Nuwara Eliya', label: 'Nuwara Eliya' },
      { name: 'Kandy', label: 'Kandy' },
      { name: 'Galle', label: 'Galle' },
      { name: 'Badulla', label: 'Ella & Badulla' },
      { name: 'Matale', label: 'Sigiriya & Matale' },
      { name: 'Anuradhapura', label: 'Anuradhapura' },
      { name: 'Jaffna', label: 'Jaffna' },
      { name: 'Trincomalee', label: 'Trincomalee' },
      { name: 'Hambantota', label: 'Yala & Hambantota' },
    ];
  }, []);

  // Map each destination id to its raw (English) district for stable filtering
  const rawDistrictMap = useMemo(() => {
    const map: Record<string, string> = {};
    destinationsData.forEach((d) => {
      map[d.id] = d.district || 'Other';
    });
    return map;
  }, []);

  // Compute count of places per district from raw data so English button names always match
  const districtCounts = useMemo(() => {
    const map: Record<string, number> = {};
    destinationsData.forEach((d) => {
      const dist = d.district || 'Other';
      map[dist] = (map[dist] || 0) + 1;
    });
    return map;
  }, []);

  const filteredDestinations = useMemo(() => {
    return localizedDestinations
      .filter((dest) => {
        const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
        const matchesDistrict = selectedDistrict === 'All' || rawDistrictMap[dest.id] === selectedDistrict;
        const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          dest.name.toLowerCase().includes(q) ||
          dest.localName.toLowerCase().includes(q) ||
          (rawDistrictMap[dest.id] && rawDistrictMap[dest.id].toLowerCase().includes(q)) ||
          dest.region.toLowerCase().includes(q) ||
          dest.tagline.toLowerCase().includes(q) ||
          dest.description.toLowerCase().includes(q);

        return matchesRegion && matchesDistrict && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'district') {
          return (rawDistrictMap[a.id] || '').localeCompare(rawDistrictMap[b.id] || '');
        }
        return 0; // Default: maintain curated order
      });
  }, [localizedDestinations, selectedRegion, selectedDistrict, selectedCategory, searchQuery, sortBy, rawDistrictMap]);

  // Handle resetting all filters
  const handleResetFilters = () => {
    setSelectedRegion('All');
    setSelectedDistrict('All');
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('popular');
    setVisibleCount(9);
  };

  const handleSelectDistrict = (dist: string) => {
    setSelectedDistrict(dist);
    // Reset pagination when switching hubs so first batch is fresh
    setVisibleCount(9);
  };

  // Sliced items according to visibleCount
  const displayedDestinations = filteredDestinations.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredDestinations.length - visibleCount);

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {t('Verified Sri Lankan Destinations & Attractions')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              {t('Explore Sri Lanka')}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
              {t('Explore authentic attractions across Colombo, Ratnapura, Nuwara Eliya, the Cultural Triangle, and coastal wonderlands. Tap any destination for directions, history, and real coordinates.')}
            </p>
          </div>

          {/* Quick stats and Map Jump Link */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigatePage('map')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer touch-manipulation"
              title={t('Interactive Map')}
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>{t('Interactive Map')}</span>
            </button>
          </div>
        </div>

        {/* Popular Cities / Districts Hub Quick-Selector Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('Select Destination / City:')}</span>
            </span>
            {selectedDistrict !== 'All' && (
              <button
                onClick={() => handleSelectDistrict('All')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                {t('Clear City Filter')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {popularDistricts.map((dist) => {
              const count = dist.name === 'All' ? localizedDestinations.length : districtCounts[dist.name] || 0;
              const isActive = selectedDistrict === dist.name;
              return (
                <button
                  key={dist.name}
                  id={`filter-city-${dist.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleSelectDistrict(dist.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 touch-manipulation ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span>{t(dist.label)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-950 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="destination-search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder={t('Search Colombo, Ratnapura, Nuwara Eliya, temples, waterfalls...')}
                className="w-full pl-10 pr-12 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                >
                  {t('Clear')}
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(9);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer touch-manipulation ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>

            {/* "More Options" Button - Top Level Control */}
            <button
              id="destinations-more-options-top-btn"
              type="button"
              onClick={() => setShowMoreOptions((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer touch-manipulation shadow-2xs shrink-0 ${
                showMoreOptions
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs ring-2 ring-amber-400'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
              }`}
              title={t('More Options')}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-900" />
              <span>{t('More Options')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/70 text-stone-900 font-bold">
                {showMoreOptions ? t('Open') : t('Filters')}
              </span>
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-stone-100 pt-3">
            <span className="text-xs font-bold text-stone-500 shrink-0 mr-1">{t('Region:')}</span>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setVisibleCount(9);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer touch-manipulation ${
                  selectedRegion === region
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-stone-600 hover:text-emerald-900 bg-stone-50 border border-stone-200'
                }`}
              >
                {t(region)}
              </button>
            ))}
          </div>

          {/* Collapsible "More Options" Advanced Drawer */}
          {showMoreOptions && (
            <div
              id="destinations-more-options-drawer"
              className="pt-4 border-t border-stone-200 bg-stone-50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>{t('Advanced Viewing & Display Controls')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('Reset All')}</span>
                  </button>

                  <button
                    onClick={() => setVisibleCount(filteredDestinations.length)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 cursor-pointer"
                  >
                    <ChevronsDown className="w-3.5 h-3.5" />
                    <span>{t('Show All')} ({filteredDestinations.length})</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                {/* Sort Order */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">{t('Sort Attractions By:')}</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="popular">{t('Curated / Popularity')}</option>
                    <option value="name">{t('Name (A to Z)')}</option>
                    <option value="district">{t('By District / City')}</option>
                  </select>
                </div>

                {/* Direct District Select */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">{t('Direct District Filter:')}</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleSelectDistrict(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="All">{t('All 25 Districts')}</option>
                    {Object.keys(districtCounts)
                      .sort()
                      .map((dist) => (
                        <option key={dist} value={dist}>
                          {t(dist)} ({districtCounts[dist]} {t('places')})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Per Page / Reveal Control */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">{t('Places Displayed:')}</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVisibleCount(6)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs border ${
                        visibleCount === 6
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      6
                    </button>
                    <button
                      onClick={() => setVisibleCount(12)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs border ${
                        visibleCount === 12
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      12
                    </button>
                    <button
                      onClick={() => setVisibleCount(filteredDestinations.length)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs border ${
                        visibleCount >= filteredDestinations.length
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {t('All')} ({filteredDestinations.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count & Current Active Filters Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">
              {t('Showing')} {Math.min(visibleCount, filteredDestinations.length)} {t('of')} {filteredDestinations.length} {t('places')}
            </span>
            {selectedDistrict !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                {t(selectedDistrict)} {t('District')} ({filteredDestinations.length})
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-[11px]">
                {t(selectedCategory)}
              </span>
            )}
          </div>

          {remainingCount > 0 && (
            <button
              onClick={() => setVisibleCount(filteredDestinations.length)}
              className="text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
            >
              {t('Reveal all')} {remainingCount} {t('remaining places')}
            </button>
          )}
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
            <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">{t('No destinations found')}</h3>
            <p className="text-xs text-stone-500 mt-1">{t('Try adjusting your city filter, category, or search terms')}</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              {t('Reset Filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDestinations.map((dest) => (
              <div
                key={dest.id}
                id={`destination-card-${dest.id}`}
                className="group bg-white rounded-2xl shadow-xs hover:shadow-md border border-stone-200 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Image Header with Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/destinations/placeholder-destination.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Top Left Badges: Category & District */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-800/90 backdrop-blur-md text-white text-[10px] font-bold shadow-2xs">
                        {t(dest.category)}
                      </span>
                      {dest.district && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-2xs">
                          {t(dest.district)}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-[10px]">
                        {t(dest.region)}
                      </span>
                    </div>

                    {/* Top Right: Favourite Bookmark Button */}
                    <button
                      type="button"
                      onClick={() =>
                        onToggleFavourite({
                          id: dest.id,
                          type: 'destination',
                          title: dest.name,
                          subtitle: dest.district || dest.region,
                          image: dest.heroImage,
                          linkPage: 'destinations',
                          targetId: dest.id,
                        })
                      }
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs touch-manipulation"
                      title={isFavourite(dest.id) ? t('Remove from Favourites') : t('Save to Favourites')}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavourite(dest.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                        }`}
                      />
                    </button>

                    {/* Destination Name & Local Title */}
                    <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-xs">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium truncate drop-shadow-xs mt-0.5">
                        {dest.localName}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3.5">
                    {/* Short Description */}
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Highlights preview */}
                    {dest.highlights && dest.highlights.length > 0 && (
                      <div className="space-y-1 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div className="font-bold text-stone-900 text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{t('Key Highlight:')}</span>
                        </div>
                        <div className="text-stone-700 line-clamp-1 font-medium">
                          ✓ {dest.highlights[0]}
                        </div>
                      </div>
                    )}

                    {/* Quick Meta Specs: Weather, Time, Coordinates */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{dest.weather.tempC}°C • {t(dest.weather.condition.split(' ')[0])}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{dest.travelTimeFromColombo.split(' ')[0]}h {t('from Colombo')}</span>
                      </div>
                    </div>

                    {/* GPS Coordinates Badge */}
                    <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>
                        GPS: {dest.coordinates.lat.toFixed(4)}°, {dest.coordinates.lng.toFixed(4)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Navigate, Explore, Add to Plan */}
                <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-2">
                  <div className="flex items-center gap-2 pt-3">
                    {/* Navigate Button (Google Maps Turn-by-Turn GPS) */}
                    <button
                      id={`navigate-btn-${dest.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}`;
                        window.open(navUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs touch-manipulation"
                      title={`${t('Navigate to')} ${dest.name} in Google Maps`}
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t('Navigate')}</span>
                    </button>

                    {/* Explore Modal Details */}
                    <button
                      id={`dest-details-btn-${dest.id}`}
                      type="button"
                      onClick={() => setSelectedDestinationModal(dest)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs touch-manipulation"
                    >
                      <span>{t('Explore')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Add to Trip Planner */}
                    <button
                      type="button"
                      onClick={() => onNavigatePage('planner')}
                      className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-emerald-800 active:scale-95 transition-all cursor-pointer touch-manipulation"
                      title={t('Plan Itinerary with this Destination')}
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More / Pagination Controls at Bottom */}
        {filteredDestinations.length > 0 && (
          <div className="pt-6 pb-8 space-y-3">
            {remainingCount > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* "View More" Button */}
                <button
                  id="destinations-view-more-bottom-btn"
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <span>{t('View More Places')} ({remainingCount} {t('remaining')})</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* "Show All" Button */}
                <button
                  id="destinations-show-all-bottom-btn"
                  type="button"
                  onClick={() => setVisibleCount(filteredDestinations.length)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 active:scale-95 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation shadow-2xs"
                >
                  <span>{t('Show All')} ({filteredDestinations.length})</span>
                  <ChevronsDown className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            ) : filteredDestinations.length > 9 ? (
              <div className="flex items-center justify-center">
                <button
                  id="destinations-collapse-btn"
                  type="button"
                  onClick={() => {
                    setVisibleCount(9);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
                >
                  <span>{t('Showing all')} {filteredDestinations.length} {t('places')} • {t('Show Less')}</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Detailed Destination Modal Dialog */}
      {localizedModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative">
            {/* Close Button */}
            <button
              id="close-dest-modal-btn"
              onClick={() => setSelectedDestinationModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 active:scale-95 text-white flex items-center justify-center cursor-pointer transition-all touch-manipulation"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Banner */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-950">
              <img
                src={localizedModal.heroImage}
                alt={localizedModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/images/destinations/placeholder-destination.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 z-10">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold">
                    {t(localizedModal.category)}
                  </span>
                  {localizedModal.district && (
                    <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">
                      {t(localizedModal.district)} {t('District')}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs">
                    {t(localizedModal.region)}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  {localizedModal.name}
                </h2>
                <p className="text-sm text-amber-300 font-medium">
                  {localizedModal.localName}
                </p>
                <p className="text-xs text-stone-200 italic pt-0.5">
                  "{localizedModal.tagline}"
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 text-stone-800">
              {/* Navigate & Map Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
                <button
                  id="modal-navigate-maps-btn"
                  onClick={() => {
                    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${localizedModal.coordinates.lat},${localizedModal.coordinates.lng}`;
                    window.open(navUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer touch-manipulation"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>{t('Navigate in Google Maps')}</span>
                </button>

                <button
                  id="modal-interactive-map-btn"
                  onClick={() => {
                    setSelectedDestinationModal(null);
                    onNavigatePage('map');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer touch-manipulation"
                >
                  <Compass className="w-4 h-4 text-emerald-300" />
                  <span>{t('View on Interactive Map')}</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
                  {t('About')} {localizedModal.name}
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  {localizedModal.description}
                </p>
              </div>

              {/* Photo Gallery Row */}
              {localizedModal.gallery && localizedModal.gallery.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t('Location Photo Gallery')}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {localizedModal.gallery.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt={`${localizedModal.name} view ${i + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-xl border border-stone-200"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/destinations/placeholder-destination.svg';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Essential Travel Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">{t('Best Time to Visit:')}</span>
                  <span className="text-stone-600">{localizedModal.bestTimeToVisit}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">{t('Entry & Tickets:')}</span>
                  <span className="text-stone-600">{localizedModal.entryFee}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">{t('Travel From Colombo:')}</span>
                  <span className="text-stone-600">{localizedModal.travelTimeFromColombo}</span>
                </div>
              </div>

              {/* Highlights List */}
              {localizedModal.highlights && localizedModal.highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    {t('Top Attractions & Highlights')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {localizedModal.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span className="text-stone-800 font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {localizedModal.activities && localizedModal.activities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-emerald-700" />
                    {t('Recommended Activities')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {localizedModal.activities.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-amber-600 font-bold">•</span>
                        <span className="text-stone-700">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Tips */}
              {localizedModal.travelTips && localizedModal.travelTips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    {t('Local Insider Travel Tips')}
                  </h4>
                  <div className="space-y-1.5 text-xs text-stone-700 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60">
                    {localizedModal.travelTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinates info in modal */}
              <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>
                    Lat: {localizedModal.coordinates.lat.toFixed(5)}, Lng: {localizedModal.coordinates.lng.toFixed(5)}
                  </span>
                </span>
                <span className="font-semibold text-stone-700">
                  {localizedModal.weather.tempC}°C ({t(localizedModal.weather.condition)})
                </span>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onToggleFavourite({
                      id: localizedModal.id,
                      type: 'destination',
                      title: localizedModal.name,
                      subtitle: localizedModal.district || localizedModal.region,
                      image: localizedModal.heroImage,
                      linkPage: 'destinations',
                      targetId: localizedModal.id,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 active:scale-95 text-stone-800 font-bold text-xs transition-all cursor-pointer touch-manipulation"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavourite(localizedModal.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-stone-600'
                    }`}
                  />
                  <span>
                    {isFavourite(localizedModal.id)
                      ? t('Saved to Favourites')
                      : t('Add to Favourites')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDestinationModal(null);
                    onNavigatePage('planner');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-sm touch-manipulation"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('Plan Trip to')} {localizedModal.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
