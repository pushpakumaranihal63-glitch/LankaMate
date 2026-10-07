import React, { useState, useEffect } from 'react';
import { PageId, LanguageCode, Destination, FavouriteItem, SavedItinerary } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DestinationsView } from './components/DestinationsView';
import { SriLankaMap } from './components/SriLankaMap';
import { TripPlannerView } from './components/TripPlannerView';
import { HotelsView } from './components/HotelsView';
import { FoodView } from './components/FoodView';
import { TransportView } from './components/TransportView';
import { FavouritesView } from './components/FavouritesView';
import { AIAssistantView } from './components/AIAssistantView';
import { HandbookView } from './components/HandbookView';
import { AboutView } from './components/AboutView';
import { AllGuidesView } from './components/AllGuidesView';
import { SevenDayItineraryView } from './components/SevenDayItineraryView';
import { FuelFinderView } from './components/FuelFinderView';
import { NearMeView } from './components/NearMeView';
import { BusinessOwnerPortalView } from './components/BusinessOwnerPortalView';
import { BookingView } from './components/BookingView';
import { VoiceTranslatorView } from './components/VoiceTranslatorView';
import { LanguageSettingsModal } from './components/LanguageSettingsModal';
import { PaymentMethodsModal } from './components/PaymentMethodsModal';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { destinationsData } from './data/destinationsData';
import { handleEmergencyCall } from './utils/emergencyCall';
const sigiriyaFavouriteImage = '/assets/images/sigiriya_rock_fortress_1789815320599.jpg';
const ellaFavouriteImage = '/assets/images/ella_nine_arch_bridge_1789815333014.jpg';
import {
  Hotel,
  UtensilsCrossed,
  Train,
  Heart,
  BookOpen,
  Info,
  X,
  PhoneCall,
  Globe,
  Sparkles,
  ChevronRight,
  Fuel,
  MapPin,
  Building2,
  Ticket,
  Mic,
} from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const { language, setLanguage, t } = useTranslation();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [globalPaymentModal, setGlobalPaymentModal] = useState<{
    title: string;
    amountUsd: number;
    customerName?: string;
  } | null>(null);

  // Selected Destination for Global Modal View
  const [selectedDestinationModal, setSelectedDestinationModal] = useState<Destination | null>(null);

  // Favourites State with LocalStorage Persistence
  const [favourites, setFavourites] = useState<FavouriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('lankamate_favourites');
      if (saved) {
        const parsed: FavouriteItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          if (
            item.id === 'sigiriya' &&
            (item.image.includes('unsplash.com') ||
              item.image.includes('Nine_arch_bridge') ||
              item.image.includes('photo-'))
          ) {
            return { ...item, image: sigiriyaFavouriteImage };
          }
          if (
            item.id === 'ella' &&
            (item.image.includes('unsplash.com') ||
              item.image.includes('1546708973') ||
              item.image.includes('photo-'))
          ) {
            return { ...item, image: ellaFavouriteImage };
          }
          return item;
        });
      }
    } catch (e) {
      console.error(e);
    }
    // Default pre-saved destination for instant richness
    return [
      {
        id: 'sigiriya',
        type: 'destination',
        title: 'Sigiriya',
        subtitle: 'Cultural Triangle • UNESCO World Heritage',
        image: sigiriyaFavouriteImage,
        linkPage: 'destinations',
        targetId: 'sigiriya',
      },
      {
        id: 'ella',
        type: 'destination',
        title: 'Ella',
        subtitle: 'Central Hill Country • Tea Country',
        image: ellaFavouriteImage,
        linkPage: 'destinations',
        targetId: 'ella',
      },
      {
        id: 'kottu-roti',
        type: 'food',
        title: 'Kottu Roti (කොත්තු)',
        subtitle: 'Street Food • 250 - 1,200 LKR',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        linkPage: 'food',
        targetId: 'kottu-roti',
      },
    ];
  });

  // Saved Itineraries State
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(() => {
    try {
      const saved = localStorage.getItem('lankamate_itineraries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile "More Menu" Drawer State
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Sync Favourites
  useEffect(() => {
    localStorage.setItem('lankamate_favourites', JSON.stringify(favourites));
  }, [favourites]);

  // Sync Itineraries
  useEffect(() => {
    localStorage.setItem('lankamate_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const isFavourite = (id: string): boolean => {
    return favourites.some((item) => item.id === id);
  };

  const toggleFavourite = (item: FavouriteItem) => {
    if (isFavourite(item.id)) {
      setFavourites((prev) => prev.filter((f) => f.id !== item.id));
      showToast(`Removed "${item.title}" from Favourites`);
    } else {
      setFavourites((prev) => [item, ...prev]);
      showToast(`Saved "${item.title}" to Favourites ❤️`);
    }
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
    showToast('Removed item from Favourites');
  };

  const clearFavourites = () => {
    setFavourites([]);
    showToast('Cleared all favourites');
  };

  const saveItinerary = (itinerary: SavedItinerary) => {
    setSavedItineraries((prev) => {
      const exists = prev.find((p) => p.id === itinerary.id);
      if (exists) return prev;
      return [itinerary, ...prev];
    });
    showToast(`Saved "${itinerary.name}" to your plans!`);
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestinationModal(dest);
    handleNavigatePage('destinations');
  };

  // Navigation History Stack for Back Navigation
  const [pageHistory, setPageHistory] = useState<PageId[]>(['home']);

  const handleNavigatePage = (page: PageId) => {
    if (page !== currentPage) {
      setPageHistory((prev) => [...prev, page]);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        window.history.pushState({ page }, '', '');
      } catch {
        // Safe fallback in restricted environments
      }
    }
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const nextHistory = [...pageHistory];
      nextHistory.pop(); // pop current page
      const prevPage = nextHistory[nextHistory.length - 1];
      setPageHistory(nextHistory);
      setCurrentPage(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser back/forward button support
  useEffect(() => {
    try {
      window.history.replaceState({ page: 'home' }, '', '');
    } catch {
      // Safe fallback
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        setPageHistory((prev) => {
          const idx = prev.lastIndexOf(event.state.page);
          if (idx !== -1) {
            return prev.slice(0, idx + 1);
          }
          return [...prev, event.state.page];
        });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigatePage}
        language={language}
        setLanguage={setLanguage}
        favouritesCount={favourites.length}
        onOpenLanguageSettings={() => setIsLangModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigatePage={handleNavigatePage}
            onSelectDestination={handleSelectDestination}
            language={language}
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
          />
        )}

        {currentPage === 'destinations' && (
          <DestinationsView
            onNavigatePage={handleNavigatePage}
            selectedDestinationModal={selectedDestinationModal}
            setSelectedDestinationModal={setSelectedDestinationModal}
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
            language={language}
          />
        )}

        {currentPage === 'map' && (
          <SriLankaMap
            onSelectDestination={handleSelectDestination}
            onNavigatePage={handleNavigatePage}
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
          />
        )}

        {currentPage === 'planner' && (
          <TripPlannerView
            onNavigatePage={handleNavigatePage}
            onSaveItinerary={saveItinerary}
            savedItineraries={savedItineraries}
          />
        )}

        {currentPage === 'hotels' && (
          <HotelsView
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
            onNavigatePage={handleNavigatePage}
            onBack={handleBack}
            previousPage={pageHistory.length > 1 ? pageHistory[pageHistory.length - 2] : 'home'}
          />
        )}

        {currentPage === 'food' && (
          <FoodView
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'transport' && (
          <TransportView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'favourites' && (
          <FavouritesView
            favourites={favourites}
            onRemoveFavourite={removeFavourite}
            onClearFavourites={clearFavourites}
            onNavigatePage={handleNavigatePage}
            onSelectDestinationModal={setSelectedDestinationModal}
          />
        )}

        {currentPage === 'assistant' && (
          <AIAssistantView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'handbook' && (
          <HandbookView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'about' && (
          <AboutView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'guides' && (
          <AllGuidesView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'itinerary-7day' && (
          <SevenDayItineraryView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'fuel' && (
          <FuelFinderView onNavigatePage={handleNavigatePage} />
        )}

        {currentPage === 'near-me' && (
          <NearMeView onNavigatePage={handleNavigatePage} />
        )}


        {currentPage === 'booking' && (
          <BookingView
            onNavigatePage={handleNavigatePage}
            onToggleFavourite={toggleFavourite}
            isFavourite={isFavourite}
          />
        )}

        {currentPage === 'translator' && (
          <VoiceTranslatorView onNavigatePage={handleNavigatePage} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigatePage={handleNavigatePage} />

      {/* Bottom Sticky Mobile Navigation (Hidden on desktop) */}
      <BottomNav
        currentPage={currentPage}
        setCurrentPage={handleNavigatePage}
        onOpenMoreMenu={() => setMoreMenuOpen(true)}
      />

      {/* One shared shortcut to the existing assistant and navigation history. */}
      {currentPage !== 'assistant' && currentPage !== 'translator' && !moreMenuOpen && !isLangModalOpen && !globalPaymentModal && !selectedDestinationModal && !toastMessage && (
        <button
          id="floating-ask-ai"
          type="button"
          onClick={() => handleNavigatePage('assistant')}
          aria-label={t('nav.assistant')}
          title={t('nav.assistant')}
          className="fixed z-40 right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] xl:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] min-h-12 px-4 inline-flex items-center gap-2 rounded-full bg-emerald-800 text-white text-sm font-bold shadow-lg border border-emerald-700 hover:bg-emerald-900 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 transition touch-manipulation [body:has(input:focus)_&]:hidden [body:has(textarea:focus)_&]:hidden"
        >
          <span aria-hidden="true">🤖</span>
          <span>{t('Ask AI', 'Ask AI')}</span>
        </button>
      )}

      {/* Mobile Drawer "More" Menu */}
      {moreMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-950 text-base">
                  {t('LankaMate Services', 'LankaMate Services')}
                </span>
                <button
                  type="button"
                  id="btn-services-all-guides-badge"
                  onClick={() => {
                    setCurrentPage('guides');
                    setMoreMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 text-emerald-900 text-[10px] font-extrabold cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                >
                  <BookOpen className="w-3 h-3 text-emerald-700" />
                  <span>{t('All Guides', 'All Guides')}</span>
                </button>
              </div>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Voice Translator Item */}
              <button
                type="button"
                id="btn-drawer-translator"
                onClick={() => {
                  setCurrentPage('translator');
                  setMoreMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white font-bold text-left transition-all cursor-pointer shadow-sm border border-emerald-600/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500 text-stone-950 shadow-xs">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{t('translator.title')}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-emerald-950 text-[9px] font-extrabold uppercase">
                        {t('Live Voice')}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-200 font-medium">
                      {t('Speech translation & tourist phrase assistance')}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-300 shrink-0 ml-1" />
              </button>

              {/* Language & Country Settings */}
              <button
                type="button"
                id="btn-drawer-language-settings"
                onClick={() => {
                  setMoreMenuOpen(false);
                  setIsLangModalOpen(true);
                }}
                className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-left transition-all cursor-pointer shadow-xs border border-stone-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-stone-900 text-white shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black block">{t('settings.languageSettings')}</span>
                    <span className="text-[10px] text-stone-600 font-medium">
                      {t('country.visitingFrom')} &amp; {t('Voice Language')}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
              </button>

              {/* All Travel Guides Item */}
              <button
                type="button"
                id="btn-services-all-guides"
                onClick={() => {
                  setCurrentPage('guides');
                  setMoreMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200/80 text-emerald-950 font-bold text-left transition-colors cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-700 text-white shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-emerald-950">{t('All Guides')}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-200/90 text-emerald-900 text-[9px] font-extrabold uppercase">
                        {t('Travel Dossier')}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium">
                      {t('Train Ticket, Temple Dress Code, Street Food, Safari, Weather & 7-Day Plan')}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 ml-1" />
              </button>

              {/* Booking Hub Item */}
              <button
                type="button"
                id="btn-drawer-booking"
                onClick={() => {
                  setCurrentPage('booking');
                  setMoreMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-blue-50/90 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 text-blue-950 font-bold text-left transition-colors cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-900 text-amber-400 shadow-xs">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-blue-950">{t('Booking Hub')}</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 text-[9px] font-extrabold uppercase">
                        {t('Reservations')}
                      </span>
                    </div>
                    <div className="text-[10px] text-blue-800 font-medium">
                      {t('Hotels, Homestays, Guided Tours & Island Transit')}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-900 shrink-0 ml-1" />
              </button>

              <button
                id="drawer-nav-hotels"
                onClick={() => {
                  handleNavigatePage('hotels');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <Hotel className="w-4 h-4 text-emerald-700" />
                <span>{t('nav.hotels')}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('food');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                <span>{t('nav.food')}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('transport');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <Train className="w-4 h-4 text-sky-700" />
                <span>{t('nav.transport')}</span>
              </button>

              <button
                id="btn-drawer-near-me"
                onClick={() => {
                  setCurrentPage('near-me');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 font-bold text-left transition-colors border border-emerald-200/70"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{t('nav.nearMe')}</span>
                    <span className="block text-[10px] text-emerald-800 font-medium">
                      {t('Services & Places Near Me')}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[9px] bg-emerald-200 text-emerald-900 rounded font-black uppercase tracking-wider">
                  {t('GPS Guide')}
                </span>
              </button>

              <button
                id="btn-drawer-fuel-finder"
                onClick={() => {
                  setCurrentPage('fuel');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-950 font-bold text-left transition-colors border border-blue-200/60"
              >
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{t('nav.fuel')}</span>
                    <span className="block text-[10px] text-blue-800 font-medium">
                      {t('Petrol & Diesel Stations')}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[9px] bg-blue-200 text-blue-900 rounded font-black uppercase tracking-wider">
                  {t('Travel Support')}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('favourites');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <Heart className="w-4 h-4 text-red-600" />
                <span>{t('nav.favourites')} ({favourites.length})</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('handbook');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{t('nav.handbook')}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('about');
                  setMoreMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 font-bold text-left transition-colors"
              >
                <Info className="w-4 h-4 text-stone-700" />
                <span>{t('About LankaMate')}</span>
              </button>
            </div>

            {/* Quick Emergency In Drawer */}
            <div className="pt-2 border-t border-stone-100 space-y-2 text-xs">
              <span className="text-stone-500 font-medium block">{t('Emergency Helplines (Tap to Call):')}</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-drawer-1990"
                  onClick={(e) => handleEmergencyCall(e, '1990')}
                  className="w-full text-left px-2.5 py-2 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-900 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation"
                  title={t('Call Free Ambulance 1990')}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-[11px]">{t('Free Ambulance')}</span>
                  </div>
                  <span className="font-black text-red-700">1990</span>
                </button>
                <button
                  type="button"
                  id="btn-drawer-1912"
                  onClick={(e) => handleEmergencyCall(e, '1912')}
                  className="w-full text-left px-2.5 py-2 bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-sky-900 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation"
                  title={t('Call Tourist Police 1912')}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-[11px]">{t('Tourist Police')}</span>
                  </div>
                  <span className="font-black text-sky-700">1912</span>
                </button>
                <button
                  type="button"
                  id="btn-drawer-119"
                  onClick={(e) => handleEmergencyCall(e, '119')}
                  className="w-full text-left px-2.5 py-2 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-900 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation"
                  title={t('Call Police Dispatch 119')}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px]">{t('Police Dispatch')}</span>
                  </div>
                  <span className="font-black text-amber-700">119</span>
                </button>
                <button
                  type="button"
                  id="btn-drawer-110"
                  onClick={(e) => handleEmergencyCall(e, '110')}
                  className="w-full text-left px-2.5 py-2 bg-orange-100 hover:bg-orange-200 active:bg-orange-300 text-orange-900 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation"
                  title={t('Call Fire & Rescue 110')}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-[11px]">{t('Fire & Rescue')}</span>
                  </div>
                  <span className="font-black text-orange-700">110</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 xl:bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-stone-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Language & Tourist Settings Modal */}
      <LanguageSettingsModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      {/* Global Payment Methods Modal */}
      {globalPaymentModal && (
        <PaymentMethodsModal
          isOpen={!!globalPaymentModal}
          onClose={() => setGlobalPaymentModal(null)}
          bookingTitle={globalPaymentModal.title}
          amountUsd={globalPaymentModal.amountUsd}
          customerName={globalPaymentModal.customerName}
          onPaymentComplete={(tx) => {
            setToastMessage(`Payment confirmed! Ref: ${tx.id}`);
            setTimeout(() => setToastMessage(null), 4000);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
