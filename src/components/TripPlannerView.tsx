import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Train,
  Hotel,
  UtensilsCrossed,
  Check,
  Bookmark,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Compass,
  DollarSign,
  ArrowRight,
  Car,
  Bus,
  Calculator,
  Navigation,
  X,
  Star,
  AlertTriangle,
  ArrowLeft,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { ItineraryDay, SavedItinerary, HotelBooking, PageId } from '../types';
import { prebuiltItineraries, generateCustomItinerary } from '../data/plannerData';
import { transportData, cityDistanceMatrix } from '../data/transportData';
import { hotelsData } from '../data/hotelsData';
import { foodData } from '../data/foodData';
import { useTranslation } from '../i18n/LanguageContext';

interface TripPlannerViewProps {
  onNavigatePage: (page: PageId) => void;
  onSaveItinerary: (itinerary: SavedItinerary) => void;
  savedItineraries: SavedItinerary[];
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  onNavigatePage,
  onSaveItinerary,
  savedItineraries,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'custom' | 'templates' | 'transport' | 'saved'>(() => {
    try {
      const savedTab = sessionStorage.getItem('lankamate_active_planner_tab');
      if (savedTab === 'saved' || savedTab === 'custom' || savedTab === 'templates' || savedTab === 'transport') {
        sessionStorage.removeItem('lankamate_active_planner_tab');
        return savedTab;
      }
    } catch (e) {
      console.error(e);
    }
    return 'custom';
  });

  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>(() => {
    try {
      const raw = localStorage.getItem('lankamate_hotel_bookings');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<HotelBooking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<HotelBooking | null>(null);
  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTab = sessionStorage.getItem('lankamate_active_planner_tab');
      if (savedTab === 'saved' || savedTab === 'custom' || savedTab === 'templates' || savedTab === 'transport') {
        sessionStorage.removeItem('lankamate_active_planner_tab');
        setActiveTab(savedTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync hotel bookings from localStorage whenever active tab is 'saved'
  useEffect(() => {
    if (activeTab === 'saved') {
      try {
        const raw = localStorage.getItem('lankamate_hotel_bookings');
        if (raw) {
          const parsed: HotelBooking[] = JSON.parse(raw);
          setHotelBookings(parsed);
          if (selectedBookingForDetails) {
            const updatedSelected = parsed.find((b) => b.id === selectedBookingForDetails.id);
            if (updatedSelected) {
              setSelectedBookingForDetails(updatedSelected);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  const handleCopyReference = (ref: string, id: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRefId(id);
    setTimeout(() => setCopiedRefId(null), 2000);
  };

  const handleConfirmCancelBooking = (bookingId: string) => {
    const updated = hotelBookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' as const };
      }
      return b;
    });

    setHotelBookings(updated);
    try {
      localStorage.setItem('lankamate_hotel_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (selectedBookingForDetails && selectedBookingForDetails.id === bookingId) {
      setSelectedBookingForDetails({ ...selectedBookingForDetails, status: 'Cancelled' });
    }

    setBookingToCancel(null);
    setBookingToast('Demo reservation status changed to Cancelled (local record updated).');
    setTimeout(() => setBookingToast(null), 3500);
  };
  const [transportOrigin, setTransportOrigin] = useState<string>('Colombo');
  const [transportDest, setTransportDest] = useState<string>('Kandy');

  // Custom Planner State
  const [daysCount, setDaysCount] = useState<number>(7);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'Colombo',
    'Sigiriya',
    'Kandy',
    'Nuwara Eliya',
    'Ella',
    'Yala',
    'Galle',
  ]);
  const [travelStyle, setTravelStyle] = useState<'budget' | 'balanced' | 'luxury'>('balanced');
  const [pace, setPace] = useState<'relaxed' | 'active'>('active');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Culture & Heritage',
    'Scenic Train & Hiking',
    'Wildlife Safari',
    'Beaches & Coastal',
  ]);

  // Generated Result State
  const [currentItinerary, setCurrentItinerary] = useState<SavedItinerary>(() =>
    generateCustomItinerary({
      daysCount: 7,
      selectedDestinations: [
        'Colombo',
        'Sigiriya',
        'Kandy',
        'Nuwara Eliya',
        'Ella',
        'Yala',
        'Galle',
      ],
      travelStyle: 'balanced',
      pace: 'active',
      activities: ['Culture & Heritage', 'Scenic Train & Hiking'],
    })
  );

  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });
  const [selectedStayDay, setSelectedStayDay] = useState<ItineraryDay | null>(null);
  const [selectedCulinaryDay, setSelectedCulinaryDay] = useState<ItineraryDay | null>(null);
  const modalOpenTimeRef = useRef<number>(0);

  const handleOpenStayModal = (day: ItineraryDay) => {
    modalOpenTimeRef.current = Date.now();
    setSelectedStayDay(day);
  };

  const handleCloseStayModal = () => {
    setSelectedStayDay(null);
  };

  const handleOpenCulinaryModal = (day: ItineraryDay) => {
    modalOpenTimeRef.current = Date.now();
    setSelectedCulinaryDay(day);
  };

  const handleCloseCulinaryModal = () => {
    setSelectedCulinaryDay(null);
  };

  const [copyToast, setCopyToast] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const availableDestinations = [
    'Sigiriya',
    'Kandy',
    'Ella',
    'Galle',
    'Mirissa',
    'Yala',
    'Nuwara Eliya',
    'Jaffna',
    'Colombo',
    'Trincomalee',
  ];

  const availableActivities = [
    'Culture & Heritage',
    'Scenic Train & Hiking',
    'Wildlife Safari',
    'Beaches & Coastal',
    'Tea & Highlands',
    'Sri Lankan Food & Cooking',
    'Ayurveda & Wellness',
  ];

  const toggleDestination = (dest: string) => {
    if (selectedDestinations.includes(dest)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== dest));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, dest]);
    }
  };

  const toggleActivity = (act: string) => {
    if (selectedActivities.includes(act)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== act));
    } else {
      setSelectedActivities([...selectedActivities, act]);
    }
  };

  const handleGenerate = () => {
    const generated = generateCustomItinerary({
      daysCount,
      selectedDestinations,
      travelStyle,
      pace,
      activities: selectedActivities,
    });
    setCurrentItinerary(generated);
    // Expand first 3 days by default
    setExpandedDays({ 1: true, 2: true, 3: true });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const toggleDayExpansion = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleCopy = () => {
    const text = `${t(currentItinerary.name)}\n${currentItinerary.daysCount} ${t('Days across Sri Lanka')}\n${t('Estimated Cost:')} ~${currentItinerary.estimatedTotalUsd} USD (~${(currentItinerary.estimatedTotalUsd * 310).toLocaleString()} LKR)\n\n` +
      currentItinerary.days.map((d) => `${t('Day')} ${d.dayNumber}: ${t(d.title)} (${d.destination})\n• ${t('Morning:')} ${t(d.morning)}\n• ${t('Afternoon:')} ${t(d.afternoon)}\n• ${t('Evening:')} ${t(d.evening)}\n• ${t('Transport:')} ${t(d.transportInfo)}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const handleSave = () => {
    onSaveItinerary(currentItinerary);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            {t('Smart Itinerary Generator')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            {t('Sri Lanka Trip Planner')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
            {t('Design your personalized island journey with realistic travel timings, authentic meal recommendations, and day-by-day itineraries.')}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            id="tab-custom-planner"
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'custom'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t('Custom Plan Builder')}
          </button>

          <button
            id="tab-prebuilt-routes"
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'templates'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t('Featured Signature Routes')}
          </button>

          <button
            id="tab-transport-options"
            onClick={() => setActiveTab('transport')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'transport'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>{t('Transport')}</span>
          </button>

          <button
            id="tab-saved-plans"
            onClick={() => {
              setActiveTab('saved');
              setSelectedBookingForDetails(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {t('My Trips & Bookings')} ({hotelBookings.length + savedItineraries.length})
            </span>
          </button>
        </div>

        {/* Tab 1: Custom Plan Generator Form */}
        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel (Left Column) */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-6">
              <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t('Customize Your Trip')}
              </h2>

              {/* Number of Days */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{t('Duration:')}</span>
                  <span className="text-emerald-800 text-sm font-black">{daysCount} {t('Days')}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="14"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>{t('3 Days (Weekend)')}</span>
                  <span>{t('7 Days (Highlights)')}</span>
                  <span>{t('14 Days (Grand Tour)')}</span>
                </div>
              </div>

              {/* Select Focus Destinations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  {t('Select Focus Destinations (Min 1):')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableDestinations.map((dest) => {
                    const isSelected = selectedDestinations.includes(dest);
                    return (
                      <button
                        key={dest}
                        onClick={() => toggleDestination(dest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {dest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">{t('Travel Style & Budget:')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: t('Budget'), est: t('~$45/day') },
                    { id: 'balanced', label: t('Balanced'), est: t('~$110/day') },
                    { id: 'luxury', label: t('Luxury'), est: t('~$280/day') },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setTravelStyle(style.id as any)}
                      className={`p-2.5 rounded-xl text-center border transition-colors cursor-pointer ${
                        travelStyle === style.id
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs">{style.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{style.est}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Pace */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">{t('Trip Pace:')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPace('active')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      pace === 'active'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    ⚡ {t('Active & Action-Packed')}
                  </button>
                  <button
                    onClick={() => setPace('relaxed')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      pace === 'relaxed'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    🌴 {t('Relaxed & Leisurely')}
                  </button>
                </div>
              </div>

              {/* Activity Preferences */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">{t('Favorite Activities:')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableActivities.map((act) => {
                    const active = selectedActivities.includes(act);
                    return (
                      <button
                        key={act}
                        onClick={() => toggleActivity(act)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {active && '✓ '}
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                id="generate-itinerary-btn"
                onClick={handleGenerate}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('Generate Itinerary Plan')}</span>
              </button>
            </div>

            {/* Generated Itinerary Display (Right Column) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Itinerary Header Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {currentItinerary.daysCount} {t('Days')} • {currentItinerary.travelStyle} • {currentItinerary.pace}
                    </span>
                    <h2 className="text-2xl font-black text-emerald-950 mt-2 tracking-tight">
                      {t(currentItinerary.name)}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      {t('Destinations:')} {currentItinerary.destinations.join(' → ')}
                    </p>
                  </div>

                  {/* Estimated Cost Badge */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      {t('Estimated Cost (per person)')}
                    </span>
                    <div className="text-xl font-black text-amber-950">
                      ${currentItinerary.estimatedTotalUsd} USD
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      ~{(currentItinerary.estimatedTotalUsd * 310).toLocaleString()} LKR
                    </span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t('Save Plan')}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t('Copy Summary')}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('Print Itinerary')}</span>
                  </button>

                  {saveToast && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg animate-in fade-in">
                      ✓ {t('Saved to Saved Plans!')}
                    </span>
                  )}
                  {copyToast && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg animate-in fade-in">
                      ✓ {t('Copied to Clipboard!')}
                    </span>
                  )}
                </div>
              </div>

              {/* Day-by-Day Timeline Cards */}
              <div className="space-y-4">
                {currentItinerary.days.map((day) => {
                  const isExpanded = expandedDays[day.dayNumber] !== false;
                  return (
                    <div
                      key={day.dayNumber}
                      className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden transition-all"
                    >
                      {/* Day Accordion Header */}
                      <button
                        onClick={() => toggleDayExpansion(day.dayNumber)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-stone-50 transition-colors cursor-pointer border-b border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            {day.dayNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                {day.destination}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                              {t(day.title)}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-stone-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Day Expanded Details */}
                      {isExpanded && (
                        <div className="p-5 space-y-5 text-xs sm:text-sm animate-in fade-in duration-150">
                          {/* Photo Preview if available */}
                          {day.image && (
                            <div className="h-40 w-full rounded-xl overflow-hidden bg-stone-900">
                              <img
                                src={day.image}
                                alt={t(day.title)}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Time Slots: Morning, Afternoon, Evening */}
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] shrink-0 w-20 text-center">
                                {t('Morning')}
                              </span>
                              <p className="text-stone-700 leading-relaxed pt-0.5">{t(day.morning)}</p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="px-2 py-1 rounded-md bg-sky-100 text-sky-900 font-bold text-[11px] shrink-0 w-20 text-center">
                                {t('Afternoon')}
                              </span>
                              <p className="text-stone-700 leading-relaxed pt-0.5">{t(day.afternoon)}</p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-900 font-bold text-[11px] shrink-0 w-20 text-center">
                                {t('Evening')}
                              </span>
                              <p className="text-stone-700 leading-relaxed pt-0.5">{t(day.evening)}</p>
                            </div>
                          </div>

                          {/* Transport & Stay Meta Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('transport');
                                window.scrollTo({ top: 120, behavior: 'smooth' });
                              }}
                              className="flex items-start gap-2 bg-stone-50 hover:bg-emerald-50/80 p-3 rounded-xl border border-stone-200/80 hover:border-emerald-300 transition-all text-left cursor-pointer group w-full"
                              title={t('Click to view transport details & route options')}
                            >
                              <Train className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-stone-900 block">{t('Transport:')}</span>
                                  <span className="text-[10px] text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                                    {t('Options')} <ArrowRight className="w-2.5 h-2.5" />
                                  </span>
                                </div>
                                <span className="text-stone-600 block mt-0.5">{t(day.transportInfo)}</span>
                              </div>
                            </button>

                            {/* Stay Option Card (Tap to open stay details panel / hotels) */}
                            <button
                              type="button"
                              id={`btn-plan-stay-day-${day.dayNumber}`}
                              onClick={() => handleOpenStayModal(day)}
                              className="flex items-start gap-2.5 bg-stone-50 hover:bg-emerald-50/90 active:bg-emerald-100 p-3.5 rounded-xl border border-stone-200/90 hover:border-emerald-300 active:border-emerald-400 transition-all text-left cursor-pointer group w-full touch-manipulation"
                              title={t('Tap to view stay recommendations & accommodation details')}
                            >
                              <Hotel className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-stone-900 block text-xs">{t('Stay Option:')}</span>
                                  <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                                    {t('View Stay')} <ArrowRight className="w-2.5 h-2.5" />
                                  </span>
                                </div>
                                <span className="text-stone-600 block mt-0.5 text-xs leading-snug">{t(day.stayRecommendation)}</span>
                              </div>
                            </button>
                          </div>

                          {/* Meal Recommendations (Culinary Tip - Tap to open culinary details / food guide) */}
                          {day.mealHighlights && (
                            <button
                              type="button"
                              id={`btn-plan-culinary-day-${day.dayNumber}`}
                              onClick={() => handleOpenCulinaryModal(day)}
                              className="flex items-start gap-2.5 text-xs bg-amber-50/70 hover:bg-amber-100/90 active:bg-amber-200/90 p-3.5 rounded-xl border border-amber-200/70 hover:border-amber-300 active:border-amber-400 transition-all text-left cursor-pointer group w-full touch-manipulation"
                              title={t('Tap to view culinary tips, regional dishes & food guide')}
                            >
                              <UtensilsCrossed className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-amber-950 block text-xs">{t('Culinary Tip:')}</span>
                                  <span className="text-[10px] sm:text-[11px] text-amber-800 font-bold group-hover:underline flex items-center gap-0.5">
                                    {t('View Tips')} <ArrowRight className="w-2.5 h-2.5" />
                                  </span>
                                </div>
                                <span className="text-amber-900 block mt-0.5 text-xs leading-snug">
                                  {day.mealHighlights.map((h) => t(h)).join(' • ')}
                                </span>
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Featured Prebuilt Signature Routes */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-xl font-black text-emerald-950">
                {t('Signature Sri Lankan Itineraries')}
              </h2>
              <p className="text-sm text-stone-600">
                {t('Carefully timed and field-tested routes covering iconic archaeological wonders, high tea country, wildlife parks, and pristine southern beaches.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prebuiltItineraries.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <img
                        src={template.coverImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold">
                        {template.durationDays} {t('Days Route')}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold">
                        {t(template.badge)}
                      </span>
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-xl font-black">{t(template.name)}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {t(template.description)}
                      </p>

                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-stone-800 block">{t('Stops included:')}</span>
                        <div className="flex flex-wrap gap-1">
                          {template.destinations.map((d) => (
                            <span key={d} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-xs text-stone-500 flex items-center justify-between border-t border-stone-100">
                        <span>{t('Pace:')} {t(template.pace)}</span>
                        <span className="font-bold text-emerald-800 text-sm">
                          ~${template.estimatedCostUsd} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        const savedObj: SavedItinerary = {
                          id: template.id,
                          name: template.name,
                          daysCount: template.durationDays,
                          travelStyle: template.travelStyle,
                          pace: template.pace,
                          destinations: template.destinations,
                          days: template.days,
                          createdAt: new Date().toLocaleDateString(),
                          estimatedTotalUsd: template.estimatedCostUsd,
                        };
                        setCurrentItinerary(savedObj);
                        setActiveTab('custom');
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{t('Load & Customize This Itinerary')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Island Transport & Transit Options */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                  <Train className="w-5 h-5 text-emerald-700" />
                  {t('Sri Lanka Island Transport & Mobility Guide')}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  {t('Plan your transfers between tour destinations: distance calculations, scenic trains, chauffeur hires, and metered ride-hailing.')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigatePage('transport')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t('Open Full Transit Guide')}</span>
                </button>
              </div>
            </div>

            {/* Quick Route Distance & Time Calculator */}
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <span>{t('Intercity Distance & Travel Timing Lookup')}</span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium">{t('Approximate reference estimates')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('Departure Origin')}</label>
                  <select
                    value={transportOrigin}
                    onChange={(e) => setTransportOrigin(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-700"
                  >
                    {availableDestinations.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('Destination')}</label>
                  <select
                    value={transportDest}
                    onChange={(e) => setTransportDest(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-700"
                  >
                    {availableDestinations
                      .filter((c) => c !== transportOrigin)
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                {(() => {
                  const foundRoute = cityDistanceMatrix.find(
                    (r) =>
                      (r.from === transportOrigin && r.to === transportDest) ||
                      (r.from === transportDest && r.to === transportOrigin)
                  );

                  return (
                    <>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          {t('Road Distance & Car Time')}
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-lg font-black text-emerald-950">
                            {foundRoute ? foundRoute.distanceKm : '~140'} km
                          </span>
                          <span className="text-xs font-bold text-emerald-700">
                            ({foundRoute ? `${foundRoute.carHours} ${t('hrs drive')}` : t('3.5 - 4 Hours')})
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-sky-800 block">
                          {t('Recommended Transit')}
                        </span>
                        <span className="text-xs font-bold text-sky-950 mt-0.5 line-clamp-1">
                          {foundRoute?.bestWay
                            ? `${foundRoute.bestWay}${foundRoute.trainHours ? ` (~${foundRoute.trainHours}h)` : ''}`
                            : t('Scenic rail or road coach available')}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>{t('Travel Tip:')}</strong> {t('Mountain roads (Kandy, Nuwara Eliya, Ella) average 25–35 km/h due to winding elevation climbs. Southern Expressway averages 80–100 km/h.')}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 shrink-0">
                  {t('Rate examples are indicative reference rates')}
                </span>
              </div>
            </div>

            {/* Transport Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option 1: Scenic Railways */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Train className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{t('Scenic Blue Train Network')}</h3>
                      <span className="text-[11px] text-stone-500">{t('Sri Lanka Railways (Main Line & Coastal)')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {t('Most Iconic')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('World-famous Kandy → Ella hill country route across tea hills, mist-veiled valleys, and Nine Arch Bridge. Coastal train links Colombo Fort to Galle alongside ocean surf.')}
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Approximate Cost:')}</span>
                    <span className="font-bold text-stone-800">{t('~3,000–5,000 LKR ($10–$16 USD)')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Booking Rule:')}</span>
                    <span className="font-bold text-stone-800">{t('Opens 30 days prior (10:00 AM)')}</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Private Chauffeur Car / Van */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{t('Private Chauffeur & Vehicle')}</h3>
                      <span className="text-[11px] text-stone-500">{t('Air-Conditioned Sedan, SUV or Van')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
                    {t('Most Flexible')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('The most convenient choice for multi-stop tours with luggage. Drivers are certified, handle mountain driving expertly, and can make spontaneous viewpoint and tea stopovers.')}
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Reference Daily Rate:')}</span>
                    <span className="font-bold text-stone-800">{t('~20,000–26,000 LKR ($65–$85 USD/day)')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Includes:')}</span>
                    <span className="font-bold text-stone-800">{t('Fuel, insurance & highway tolls')}</span>
                  </div>
                </div>
              </div>

              {/* Option 3: Metered Tuk-Tuk & PickMe */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{t('Tuk-Tuk & PickMe Ride-Hailing')}</h3>
                      <span className="text-[11px] text-stone-500">{t('Local Three-Wheelers & City Cabs')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    {t('Short Hops')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('Essential for city exploring, beach hops in Mirissa/Weligama, and reaching trailheads. Install the local ')}<strong>{t('PickMe')}</strong>{t(' app in Colombo, Kandy, and Galle for metered fair rates.')}
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Reference Meter Rate:')}</span>
                    <span className="font-bold text-stone-800">{t('~100 LKR base + ~100 LKR/km')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Best App:')}</span>
                    <span className="font-bold text-stone-800">{t('PickMe (or Uber in Colombo)')}</span>
                  </div>
                </div>
              </div>

              {/* Option 4: Expressway & Public Buses */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{t('Expressway & Intercity Buses')}</h3>
                      <span className="text-[11px] text-stone-500">{t('Southern Expressway AC Coaches & CTB')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                    {t('Budget Fast')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('Southern Expressway AC buses connect Colombo to Galle/Matara in ~1 hour for under $3 USD. Red CTB state buses serve every village, offering high frequency at ultra-low fares.')}
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Expressway Cost:')}</span>
                    <span className="font-bold text-stone-800">{t('~800–1,200 LKR ($2.50–$4 USD)')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">{t('Departure Hub:')}</span>
                    <span className="font-bold text-stone-800">{t('Makumbura Multi-Modal Center')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-stone-200">
              <button
                onClick={() => setActiveTab('custom')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ← {t('Back to Custom Plan Builder')}
              </button>
              <button
                onClick={() => onNavigatePage('transport')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{t('Explore Full Sri Lanka Transit & Mobility Page')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Saved Itineraries & Hotel Bookings */}
        {activeTab === 'saved' && (
          <div className="space-y-8">
            {/* If a specific booking is selected for details, show the full details page */}
            {selectedBookingForDetails ? (
              <div id="booking-details-view" className="space-y-6">
                {/* Header Navigation Bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-stone-200">
                  <button
                    id="btn-details-back-to-trips"
                    type="button"
                    onClick={() => {
                      setSelectedBookingForDetails(null);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 active:bg-stone-100 text-stone-800 text-xs font-black transition-colors cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-800" />
                    <span>{t('Back to My Trips')}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        selectedBookingForDetails.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {selectedBookingForDetails.status === 'Cancelled' ? (
                        <>
                          <X className="w-3.5 h-3.5 text-rose-700" />
                          <span>{t('Status: Cancelled')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('Status: Confirmed')}</span>
                        </>
                      )}
                    </span>

                    {selectedBookingForDetails.status === 'Confirmed' && (
                      <button
                        id="btn-details-top-cancel"
                        type="button"
                        onClick={() => setBookingToCancel(selectedBookingForDetails)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {t('Cancel Booking')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Booking Details Card */}
                <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                  {/* Hotel Header Banner */}
                  <div className="relative h-56 sm:h-72 w-full bg-stone-900">
                    <img
                      src={selectedBookingForDetails.hotelImage}
                      alt={selectedBookingForDetails.hotelName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider text-[10px]">
                          📍 {selectedBookingForDetails.destinationName}, Sri Lanka
                        </span>
                        <span className="bg-emerald-900/80 px-2.5 py-0.5 rounded-full font-bold text-[10px] text-emerald-200">
                          {selectedBookingForDetails.region}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                        <span>🏨</span>
                        <span>{selectedBookingForDetails.hotelName}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-200 font-medium">
                        🛏️ {selectedBookingForDetails.roomType}
                      </p>
                    </div>
                  </div>

                  {/* Reference & Core Stay Information */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Booking Reference Code Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-3 bg-stone-50 rounded-2xl p-4 border border-stone-200">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                          🔖 {t('Booking Reference Number')}
                        </span>
                        <span className="text-base sm:text-lg font-mono font-black text-emerald-950 tracking-wider">
                          {selectedBookingForDetails.referenceNumber}
                        </span>
                      </div>
                      <button
                        id="btn-copy-details-reference"
                        type="button"
                        onClick={() =>
                          handleCopyReference(
                            selectedBookingForDetails.referenceNumber,
                            selectedBookingForDetails.id
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        {copiedRefId === selectedBookingForDetails.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-emerald-700">{t('Copied!')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-500" />
                            <span>{t('Copy Ref')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status Alert Banner */}
                    {selectedBookingForDetails.status === 'Cancelled' ? (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                        <div className="flex items-center gap-2 font-black text-rose-950 text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>{t('Reservation Status: Cancelled')}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">
                          {t('This demo booking was marked as ')}<strong>{t('Cancelled')}</strong>{t(' in your local LankaMate record. No fees were charged, and no real hotel was contacted.')}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <div className="flex items-center gap-2 font-black text-emerald-950 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>{t('Reservation Status: Confirmed')}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">
                          {t('Your stay is saved in your LankaMate trips profile. Present your booking reference upon demo arrival.')}
                        </p>
                      </div>
                    )}

                    {/* Stay Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-stone-500 block uppercase">
                          📅 {t('Check-in Date')}
                        </span>
                        <span className="text-base font-black text-stone-900 block">
                          {selectedBookingForDetails.checkInDate}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          {t('Standard Check-in: 2:00 PM')}
                        </span>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-stone-500 block uppercase">
                          📅 {t('Check-out Date')}
                        </span>
                        <span className="text-base font-black text-stone-900 block">
                          {selectedBookingForDetails.checkOutDate}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          {t('Standard Check-out: 11:00 AM')}
                        </span>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-stone-500 block uppercase">
                          🌙 {t('Duration of Stay')}
                        </span>
                        <span className="text-base font-black text-stone-900 block">
                          {selectedBookingForDetails.nights}{' '}
                          {selectedBookingForDetails.nights === 1 ? t('Night') : t('Nights')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          {selectedBookingForDetails.roomsCount}{' '}
                          {selectedBookingForDetails.roomsCount === 1 ? t('Room') : t('Rooms')}
                        </span>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-stone-500 block uppercase">
                          👥 {t('Guests')}
                        </span>
                        <span className="text-base font-black text-stone-900 block">
                          {selectedBookingForDetails.guestsCount}{' '}
                          {selectedBookingForDetails.guestsCount === 1 ? t('Guest') : t('Guests')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          {t('Party capacity allocated')}
                        </span>
                      </div>
                    </div>

                    {/* Room & Pricing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                        <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                          🛏️ {t('Selected Room & Property')}
                        </h4>
                        <div className="text-xs space-y-1.5 text-stone-700">
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('Property:')}</span>
                            <span className="font-bold text-stone-900">{selectedBookingForDetails.hotelName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('Room Category:')}</span>
                            <span className="font-bold text-stone-900">{selectedBookingForDetails.roomType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('Destination:')}</span>
                            <span className="font-bold text-stone-900">{selectedBookingForDetails.destinationName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('Booked On:')}</span>
                            <span className="font-semibold text-stone-700">{selectedBookingForDetails.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                          💰 {t('Price Calculation & Payment')}
                        </h4>
                        <div className="text-xs space-y-1.5 text-stone-700">
                          <div className="flex justify-between">
                            <span className="text-stone-600">{t('Rate per Night:')}</span>
                            <span className="font-bold text-stone-900">
                              ${selectedBookingForDetails.pricePerNightUsd} USD (~{selectedBookingForDetails.pricePerNightLkr.toLocaleString()} LKR)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-600">{t('Total Nights & Rooms:')}</span>
                            <span className="font-bold text-stone-900">
                              {selectedBookingForDetails.nights} {t('nights')} × {selectedBookingForDetails.roomsCount} {t('room(s)')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-600">{t('Payment Status:')}</span>
                            <span className="font-bold text-emerald-800">
                              {selectedBookingForDetails.paymentMethod || t('Demo Sandbox Payment')}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-emerald-200/80 text-sm">
                            <span className="font-bold text-emerald-950">{t('Estimated Total:')}</span>
                            <span className="font-black text-emerald-950">
                              {selectedBookingForDetails.paidAmountFormatted ||
                                `$${selectedBookingForDetails.totalUsd} USD (~${selectedBookingForDetails.totalLkr.toLocaleString()} LKR)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                      <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                        {t('Primary Guest Details')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 font-bold block uppercase">{t('Full Name')}</span>
                          <span className="font-black text-stone-900">{selectedBookingForDetails.guestName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 font-bold block uppercase">{t('Email Address')}</span>
                          <span className="font-medium text-stone-900">{selectedBookingForDetails.guestEmail}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 font-bold block uppercase">{t('Phone Number')}</span>
                          <span className="font-medium text-stone-900">{selectedBookingForDetails.guestPhone}</span>
                        </div>
                      </div>
                      {selectedBookingForDetails.specialRequests && (
                        <div className="pt-2 border-t border-stone-200 text-xs">
                          <span className="text-[10px] text-stone-400 font-bold block uppercase">{t('Special Requests')}</span>
                          <p className="text-stone-700 italic mt-0.5">"{selectedBookingForDetails.specialRequests}"</p>
                        </div>
                      )}
                    </div>

                    {/* Demo Notice Banner */}
                    <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-black text-amber-950 flex items-center gap-1.5">
                        <span>ℹ️</span>
                        <span>{t('LankaMate Demo Booking Information')}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {t("This is a simulated demo booking stored in your browser's local profile. No real credit card was charged and no external reservation was booked with hotel properties.")}
                      </p>
                    </div>

                    {/* Details Page Footer Action Buttons */}
                    <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        id="btn-details-back-to-trips-footer"
                        type="button"
                        onClick={() => {
                          setSelectedBookingForDetails(null);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('Back to My Trips')}</span>
                      </button>

                      {selectedBookingForDetails.status === 'Confirmed' ? (
                        <button
                          id="btn-details-cancel-booking"
                          type="button"
                          onClick={() => setBookingToCancel(selectedBookingForDetails)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-300 text-rose-700 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                        >
                          <X className="w-4 h-4 text-rose-700" />
                          <span>{t('Cancel Booking')}</span>
                        </button>
                      ) : (
                        <span className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                          ✕ {t('This Booking is Cancelled')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Hotel Bookings List View inside My Trips */
              <div className="space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
                  <div>
                    <h2 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
                      <span>🏨</span>
                      <span>{t('Hotel Bookings & Reservations')}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                      {t('View all your confirmed hotel stays, reservation vouchers, and manage your bookings.')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                      {hotelBookings.length} {hotelBookings.length === 1 ? t('Stay') : t('Stays')}
                    </span>
                    <button
                      id="btn-book-more-hotels"
                      type="button"
                      onClick={() => onNavigatePage('hotels')}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      + {t('Book Another Hotel')}
                    </button>
                  </div>
                </div>

                {/* Empty State */}
                {hotelBookings.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 text-center space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                      <Hotel className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="text-base font-black text-stone-900">{t('No Hotel Bookings Yet')}</h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {t('Explore our curated Sri Lankan hotels and resorts catalog across Sigiriya, Kandy, Galle, Bentota, and more. Tapping "Book Now" will save your demo reservation here!')}
                      </p>
                    </div>
                    <button
                      id="btn-empty-browse-hotels"
                      type="button"
                      onClick={() => {
                        onNavigatePage('hotels');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      {t('Browse All Hotels & Homestays')}
                    </button>
                  </div>
                ) : (
                  /* Cards Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {hotelBookings.map((b) => (
                      <div
                        key={b.id}
                        id={`hotel-booking-card-${b.id}`}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between ${
                          b.status === 'Cancelled'
                            ? 'border-rose-200/90 bg-stone-50/60 opacity-95'
                            : 'border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Top: Hotel Header, Image, Location and Status */}
                          <div className="flex items-start gap-3.5">
                            <img
                              src={b.hotelImage}
                              alt={b.hotelName}
                              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-stone-100 shadow-2xs"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                {/* 📍 Location */}
                                <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                                  <span>📍</span>
                                  <span className="truncate">{b.destinationName}, Sri Lanka</span>
                                </span>

                                {/* Booking status */}
                                <span
                                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 ${
                                    b.status === 'Cancelled'
                                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                                  }`}
                                >
                                  {b.status === 'Cancelled' ? `✕ ${t('Cancelled')}` : `✓ ${t('Confirmed')}`}
                                </span>
                              </div>

                              {/* 🏨 Hotel name */}
                              <h3 className="font-black text-stone-900 text-base leading-tight truncate">
                                🏨 {b.hotelName}
                              </h3>

                              {/* 🛏️ Room type */}
                              <div className="text-xs text-stone-600 mt-1 flex items-center gap-1 font-semibold truncate">
                                <span>🛏️</span>
                                <span>{b.roomType}</span>
                              </div>
                            </div>
                          </div>

                          {/* 🔖 Booking reference number */}
                          <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2 border border-stone-200/70 text-xs">
                            <span className="text-stone-500 font-bold flex items-center gap-1 text-[11px]">
                              <span>🔖</span>
                              <span>{t('Reference:')}</span>
                            </span>
                            <span className="font-mono font-black text-emerald-950 text-xs tracking-wider">
                              {b.referenceNumber}
                            </span>
                          </div>

                          {/* Stay Dates, Nights, and Guests Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-stone-50/90 p-3 rounded-2xl border border-stone-100">
                            {/* 📅 Check-in date */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                                📅 {t('Check-in')}
                              </span>
                              <span className="font-black text-stone-900 text-xs block truncate">
                                {b.checkInDate}
                              </span>
                            </div>

                            {/* 📅 Check-out date */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                                📅 {t('Check-out')}
                              </span>
                              <span className="font-black text-stone-900 text-xs block truncate">
                                {b.checkOutDate}
                              </span>
                            </div>

                            {/* 🌙 Number of nights */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                                🌙 {t('Nights')}
                              </span>
                              <span className="font-black text-stone-900 text-xs block">
                                {b.nights} {b.nights === 1 ? t('Night') : t('Nights')}
                              </span>
                            </div>

                            {/* 👥 Number of guests */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                                👥 {t('Guests')}
                              </span>
                              <span className="font-black text-stone-900 text-xs block truncate">
                                {b.guestsCount} {b.guestsCount === 1 ? t('Guest') : t('Guests')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: 💰 Estimated total and View Booking Details button */}
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100 mt-1">
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                              💰 {t('Estimated Total')}
                            </span>
                            <span className="font-black text-emerald-950 text-sm sm:text-base">
                              {b.paidAmountFormatted || `$${b.totalUsd} USD`}
                            </span>
                          </div>

                          {/* View Booking Details button */}
                          <button
                            id={`btn-view-booking-${b.id}`}
                            type="button"
                            onClick={() => {
                              setSelectedBookingForDetails(b);
                              window.scrollTo({ top: 120, behavior: 'smooth' });
                            }}
                            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <span>{t('View Booking Details')}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Saved Itineraries Section */}
                <div className="space-y-4 pt-6 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-emerald-950">{t('Your Saved Trip Plans')}</h2>
                      <p className="text-xs text-stone-500">
                        {t('Custom itineraries and multi-day signature routes you have saved.')}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                      {savedItineraries.length} {savedItineraries.length === 1 ? t('Plan') : t('Plans')}
                    </span>
                  </div>

                  {savedItineraries.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center space-y-2">
                      <Bookmark className="w-7 h-7 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500 font-medium">
                        {t('No saved custom itineraries yet. Use the Custom Plan Builder to create and save itineraries.')}
                      </p>
                      <button
                        onClick={() => setActiveTab('custom')}
                        className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
                      >
                        {t('Create a Custom Plan')}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedItineraries.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-2xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-black text-stone-900 text-base">{t(item.name)}</h3>
                              <p className="text-xs text-stone-500">
                                {item.daysCount} {t('Days')} • {t('Saved on')} {item.createdAt}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                              ${item.estimatedTotalUsd} USD
                            </span>
                          </div>

                          <div className="text-xs text-stone-600">
                            {t('Destinations:')} {item.destinations.join(' → ')}
                          </div>

                          <button
                            onClick={() => {
                              setCurrentItinerary(item);
                              setActiveTab('custom');
                            }}
                            className="w-full py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-900"
                          >
                            {t('Open Itinerary')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Booking Confirmation Modal */}
        {bookingToCancel && (
          <div
            id="cancel-booking-confirmation-modal"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-stone-950">
                  {t('Cancel Hotel Reservation?')}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t("Are you sure you want to cancel your demo reservation for ")}{' '}
                  <strong className="text-stone-900">{bookingToCancel.hotelName}</strong>?
                </p>
              </div>

              {/* Reservation Snapshot */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">{t('Booking Reference:')}</span>
                  <span className="font-mono font-bold text-emerald-950">{bookingToCancel.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t('Dates:')}</span>
                  <span className="font-semibold text-stone-900">
                    {bookingToCancel.checkInDate} → {bookingToCancel.checkOutDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t('Room Type:')}</span>
                  <span className="font-semibold text-stone-900">{bookingToCancel.roomType}</span>
                </div>
              </div>

              {/* Explicit Demo Disclaimer */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
                <strong>{t('Demo Cancellation Notice:')}</strong> {t('This action updates your local reservation status to ')}<em>{t('Cancelled')}</em>{t('. In accordance with demo mode, no real hotel cancellation or fee was processed with external properties.')}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-cancel-modal-keep"
                  type="button"
                  onClick={() => setBookingToCancel(null)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('Keep Reservation')}
                </button>
                <button
                  id="btn-cancel-modal-confirm"
                  type="button"
                  onClick={() => handleConfirmCancelBooking(bookingToCancel.id)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                >
                  {t('Yes, Cancel Booking')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast for Booking Actions */}
        {bookingToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{bookingToast}</span>
          </div>
        )}

        {/* Stay Details Modal / Panel */}
        {selectedStayDay && (() => {
          const destLower = selectedStayDay.destination.toLowerCase();
          const matchingHotels = hotelsData.filter(
            (h) =>
              h.destinationName.toLowerCase().includes(destLower) ||
              destLower.includes(h.destinationId.toLowerCase()) ||
              h.description.toLowerCase().includes(destLower)
          ).slice(0, 2);

          return (
            <div
              id="stay-details-modal"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation"
              onClick={(e) => {
                if (e.target === e.currentTarget && Date.now() - modalOpenTimeRef.current > 400) {
                  handleCloseStayModal();
                }
              }}
            >
              <div
                className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                        {t('Day')} {selectedStayDay.dayNumber} {t('Accommodation')} • {selectedStayDay.destination}
                      </span>
                      <h3 className="text-lg font-black text-stone-900 leading-snug">
                        {t('Stay Recommendations')}
                      </h3>
                    </div>
                  </div>
                  <button
                    id="btn-close-stay-modal"
                    type="button"
                    onClick={handleCloseStayModal}
                    className="p-2 -mr-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer touch-manipulation"
                    aria-label={t('Close modal')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  {/* Curated Lodging for this day */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block">
                      {t('Curated Option for')} {selectedStayDay.destination}:
                    </span>
                    <p className="font-bold text-emerald-950 text-sm sm:text-base">
                      {selectedStayDay.stayRecommendation}
                    </p>
                  </div>

                  {/* Connected Real Hotels from LankaMate Directory */}
                  {matchingHotels.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                        {t('Featured Stays in')} {selectedStayDay.destination}
                      </span>
                      <div className="space-y-2">
                        {matchingHotels.map((hotel) => (
                          <div
                            key={hotel.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 hover:bg-emerald-50/40 transition-colors"
                          >
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-16 h-16 rounded-lg object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                                  {hotel.name}
                                </h4>
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                  ${hotel.pricePerNightUsd}/nt
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                                <span className="flex items-center text-amber-600 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                                  {hotel.rating}
                                </span>
                                <span>•</span>
                                <span className="truncate">{hotel.badge}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lodging Tip */}
                  <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 space-y-1.5 text-stone-600 text-xs">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('Sri Lankan Accommodation Tip')}</span>
                    </div>
                    <p className="leading-relaxed">
                      {t('Accommodations in')} {selectedStayDay.destination} {t('range from heritage colonial boutique hotels to scenic hill lodges. High season (December to April) books out quickly—reserve top-rated stays in advance.')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    id="btn-navigate-hotels-from-plan"
                    type="button"
                    onClick={() => {
                      handleCloseStayModal();
                      onNavigatePage('hotels');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm touch-manipulation"
                  >
                    <Hotel className="w-4 h-4" />
                    <span>{t('Browse All Hotels & Homestays')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseStayModal}
                    className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer touch-manipulation"
                  >
                    {t('Close')}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Culinary Tip Details Modal / Panel */}
        {selectedCulinaryDay && (() => {
          const featuredDishes = foodData.slice(0, 2);

          return (
            <div
              id="culinary-details-modal"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 touch-manipulation"
              onClick={(e) => {
                if (e.target === e.currentTarget && Date.now() - modalOpenTimeRef.current > 400) {
                  handleCloseCulinaryModal();
                }
              }}
            >
              <div
                className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                        {t('Day')} {selectedCulinaryDay.dayNumber} {t('Dining')} • {selectedCulinaryDay.destination}
                      </span>
                      <h3 className="text-lg font-black text-stone-900 leading-snug">
                        {t('Authentic Culinary Tips & Flavors')}
                      </h3>
                    </div>
                  </div>
                  <button
                    id="btn-close-culinary-modal"
                    type="button"
                    onClick={handleCloseCulinaryModal}
                    className="p-2 -mr-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer touch-manipulation"
                    aria-label={t('Close modal')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  {/* Curated highlights for this day */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                    <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wide block">
                      {t('Recommended Dishes for')} {selectedCulinaryDay.destination}:
                    </span>
                    <div className="space-y-1.5">
                      {selectedCulinaryDay.mealHighlights.map((dish, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-amber-950">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Real Food Specialties from LankaMate Food Guide */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                      {t('Must-Try Sri Lankan Specialties')}
                    </span>
                    <div className="space-y-2">
                      {featuredDishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 hover:bg-amber-50/40 transition-colors"
                        >
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                                {dish.name}
                              </h4>
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                                {dish.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5 font-medium">
                              {dish.sinhalaName} • {dish.priceIndication}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dining Tip */}
                  <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 space-y-1.5 text-stone-600 text-xs">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('Sri Lankan Flavor Guide')}</span>
                    </div>
                    <p className="leading-relaxed">
                      {t('Sri Lankan dishes celebrate Ceylon spices, freshly grated coconut, aromatic curry leaves, and fragrant pandan. You can always ask local eateries for "tourist mild" if you prefer gentler heat.')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    id="btn-navigate-food-from-plan"
                    type="button"
                    onClick={() => {
                      handleCloseCulinaryModal();
                      onNavigatePage('food');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm touch-manipulation"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>{t('Explore Full Sri Lankan Food Guide')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseCulinaryModal}
                    className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer touch-manipulation"
                  >
                    {t('Close')}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
