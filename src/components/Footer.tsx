import React from 'react';
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
  Phone,
  ShieldCheck,
  Fuel,
  Building2,
  Ticket,
} from 'lucide-react';
import { PageId } from '../types';
import { handleEmergencyCall } from '../utils/emergencyCall';
import { useTranslation } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigatePage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-emerald-950 text-white pt-14 pb-20 xl:pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 font-black shadow-xs">
                🇱🇰
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Lanka<span className="text-amber-400">Mate</span>
              </span>
            </div>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              {t('Sri Lanka’s complete digital travel guide and trip planner. Engineered for authentic journeys, respecting sacred customs, and empowering local & foreign explorers.')}
            </p>
            <div className="text-[11px] text-amber-300/80 font-medium">
              {t('“Ayubowan – May you be blessed with long life”')}
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              {t('Explore the Island')}
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button
                  onClick={() => onNavigatePage('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Sri Lankan Destinations')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('map')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Interactive Travel Map')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Day-by-Day Trip Planner')}
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-7day-itinerary"
                  onClick={() => onNavigatePage('itinerary-7day')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('7-Day Itinerary Guide')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('hotels')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Hotels & Heritage Resorts')}
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-booking"
                  onClick={() => onNavigatePage('booking')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold text-amber-300"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Booking Hub (Hotels, Tours & Rides)')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('food')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Sri Lankan Food & Kottu Guide')}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              {t('Travel Support')}
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button
                  onClick={() => onNavigatePage('transport')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Scenic Trains & Tuk-Tuk Guide')}
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-near-me"
                  onClick={() => onNavigatePage('near-me')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-emerald-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('Near Me (GPS Places & Nav)')}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-fuel-finder"
                  onClick={() => onNavigatePage('fuel')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-amber-300"
                >
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Fuel Finder (Petrol & Diesel)')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('assistant')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('AI Travel Assistant')}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-all-guides"
                  onClick={() => onNavigatePage('guides')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-emerald-200"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('All Travel Guides')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('handbook')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Travel Handbook & Etiquette')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('favourites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('Saved Favourites')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('About LankaMate')}
                </button>
              </li>
              <li className="pt-1.5 border-t border-emerald-900/60">
                <button
                  id="btn-footer-business-portal"
                  onClick={() => onNavigatePage('business-portal')}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-bold cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Business Owner Portal')}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-extrabold">
                    {t('Partner')}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts Direct Access */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              {t('Emergency Helplines')}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-emerald-100/90">
              <button
                type="button"
                id="btn-footer-call-1990"
                onClick={(e) => handleEmergencyCall(e, '1990')}
                className="w-full text-left p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-700/80 border border-emerald-800 block transition-colors group cursor-pointer touch-manipulation"
                title={t('Call Free Ambulance 1990')}
              >
                <span className="text-[10px] text-emerald-300 block font-bold">{t('🚑 Free Ambulance')}</span>
                <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                  1990
                </span>
              </button>
              <button
                type="button"
                id="btn-footer-call-1912"
                onClick={(e) => handleEmergencyCall(e, '1912')}
                className="w-full text-left p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-700/80 border border-emerald-800 block transition-colors group cursor-pointer touch-manipulation"
                title={t('Call Tourist Police 1912')}
              >
                <span className="text-[10px] text-emerald-300 block font-bold">{t('👮 Tourist Police')}</span>
                <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                  1912
                </span>
              </button>
              <button
                type="button"
                id="btn-footer-call-119"
                onClick={(e) => handleEmergencyCall(e, '119')}
                className="w-full text-left p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-700/80 border border-emerald-800 block transition-colors group cursor-pointer touch-manipulation"
                title={t('Call Police Dispatch 119')}
              >
                <span className="text-[10px] text-emerald-300 block font-bold">{t('🚨 Police Dispatch')}</span>
                <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                  119
                </span>
              </button>
              <button
                type="button"
                id="btn-footer-call-110"
                onClick={(e) => handleEmergencyCall(e, '110')}
                className="w-full text-left p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-700/80 border border-emerald-800 block transition-colors group cursor-pointer touch-manipulation"
                title={t('Call Fire & Rescue 110')}
              >
                <span className="text-[10px] text-emerald-300 block font-bold">{t('🚒 Fire & Rescue')}</span>
                <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                  110
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/60">
          <p>© {new Date().getFullYear()} {t('LankaMate – Sri Lanka Travel Guide & Trip Planner. All rights reserved.')}</p>
          <p>{t('Created for local and foreign explorers of Sri Lanka.')}</p>
        </div>
      </div>
    </footer>
  );
};
