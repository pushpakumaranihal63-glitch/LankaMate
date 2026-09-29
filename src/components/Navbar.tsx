import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Map,
  Calendar,
  Hotel,
  UtensilsCrossed,
  Train,
  Heart,
  Bot,
  BookOpen,
  Info,
  Menu,
  X,
  Globe,
  Sparkles,
  Fuel,
  Building2,
  Ticket,
  Mic,
  Sliders,
} from 'lucide-react';
import { PageId, LanguageCode } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  favouritesCount: number;
  onOpenLanguageSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  favouritesCount,
  onOpenLanguageSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t, supportedLanguages, currentLangOption } = useTranslation();

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('nav.home'), icon: <Compass className="w-4 h-4" /> },
    { id: 'destinations', label: t('nav.destinations'), icon: <MapPin className="w-4 h-4" /> },
    { id: 'map', label: t('nav.map'), icon: <Map className="w-4 h-4" /> },
    { id: 'translator', label: t('nav.translator'), icon: <Mic className="w-4 h-4 text-emerald-600" /> },
    { id: 'planner', label: t('nav.planner'), icon: <Calendar className="w-4 h-4" /> },
    { id: 'hotels', label: t('nav.hotels'), icon: <Hotel className="w-4 h-4" /> },
    { id: 'food', label: t('nav.food'), icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'transport', label: t('nav.transport'), icon: <Train className="w-4 h-4" /> },
    { id: 'booking', label: t('nav.booking'), icon: <Ticket className="w-4 h-4 text-amber-500" /> },
    { id: 'near-me', label: t('nav.nearMe'), icon: <MapPin className="w-4 h-4 text-emerald-500" /> },
    { id: 'fuel', label: t('nav.fuel'), icon: <Fuel className="w-4 h-4 text-amber-500" /> },
    {
      id: 'favourites',
      label: t('nav.favourites'),
      icon: (
        <span className="relative">
          <Heart className="w-4 h-4" />
          {favouritesCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favouritesCount}
            </span>
          )}
        </span>
      ),
    },
    { id: 'assistant', label: t('nav.assistant'), icon: <Bot className="w-4 h-4 text-emerald-600" /> },
    { id: 'handbook', label: t('nav.handbook'), icon: <BookOpen className="w-4 h-4" /> },
  ];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල (Sinhala)', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇱🇰' },
    { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  ];

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c2340] to-blue-900 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl select-none">🇱🇰</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-blue-950">
                  Lanka<span className="text-sky-500">Mate</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-blue-900 rounded-full">
                  {t('Sri Lanka')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                {t('Your Local Friend in Sri Lanka')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 9).map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : 'text-stone-700 hover:text-blue-900 hover:bg-stone-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Translator Quick Button */}
            <button
              id="top-translator-btn"
              onClick={() => handleNavigate('translator')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'translator'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100'
              }`}
              title={t('translator.title')}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('nav.translator')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
                title={t('Select Language', 'Select Language')}
              >
                <span>{currentLangOption.flag}</span>
                <span className="uppercase tracking-wider font-bold">{language}</span>
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                      <span>{t('common.language')}</span>
                      {onOpenLanguageSettings && (
                        <button
                          onClick={() => {
                            setLangDropdownOpen(false);
                            onOpenLanguageSettings();
                          }}
                          className="text-[10px] text-emerald-700 hover:underline font-bold lowercase"
                        >
                          {t('more...', 'more...')}
                        </button>
                      )}
                    </div>
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        id={`lang-opt-${l.code}`}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                          language === l.code
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span className="truncate">{l.nativeName}</span>
                        </span>
                        {language === l.code && <span className="text-emerald-700 font-bold">✓</span>}
                      </button>
                    ))}

                    {onOpenLanguageSettings && (
                      <div className="pt-1.5 mt-1 border-t border-stone-100 px-2">
                        <button
                          onClick={() => {
                            setLangDropdownOpen(false);
                            onOpenLanguageSettings();
                          }}
                          className="w-full py-2 px-2 text-center text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer"
                        >
                          ⚙️ {t('settings.languageSettings')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick AI Assistant Button */}
            <button
              id="top-ai-assistant-btn"
              onClick={() => handleNavigate('assistant')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'assistant'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-sky-50 text-blue-900 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{t('nav.assistant')}</span>
            </button>

            {/* Plan Trip CTA Button */}
            <button
              id="top-plan-trip-btn"
              onClick={() => handleNavigate('planner')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0c2340] to-blue-900 hover:from-[#091b31] hover:to-blue-950 text-white rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('nav.planner')}</span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label={t('Toggle navigation menu', 'Toggle navigation menu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 pt-2 pb-3">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-stone-700 bg-stone-50 hover:bg-blue-50'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-blue-900'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">{t('LankaMate • Sri Lanka', 'LankaMate • Sri Lanka')}</span>
            <button
              id="mobile-planner-quick-btn"
              onClick={() => handleNavigate('planner')}
              className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold"
            >
              {t('Plan My Trip')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
