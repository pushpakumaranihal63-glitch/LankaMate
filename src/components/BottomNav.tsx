import React from 'react';
import { Compass, MapPin, Map, Calendar, Bot, Menu, Mic } from 'lucide-react';
import { PageId } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface BottomNavProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  setCurrentPage,
  onOpenMoreMenu,
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home' as PageId, label: t('nav.home'), icon: <Compass className="w-5 h-5" /> },
    { id: 'destinations' as PageId, label: t('nav.destinations'), icon: <MapPin className="w-5 h-5" /> },
    { id: 'translator' as PageId, label: t('nav.translator'), icon: <Mic className="w-5 h-5 text-emerald-600" /> },
    { id: 'map' as PageId, label: t('nav.map'), icon: <Map className="w-5 h-5" /> },
    { id: 'assistant' as PageId, label: t('nav.assistant'), icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label={t('Mobile Navigation', 'Mobile Navigation')}
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(12,35,64,0.08)] pb-safe"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => {
                setCurrentPage(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 transition-all cursor-pointer touch-manipulation min-h-[48px] rounded-xl ${
                isActive
                  ? 'text-blue-950 font-bold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border border-blue-100/90 shadow-2xs scale-105'
                    : 'hover:bg-stone-50'
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-black text-blue-950' : 'text-stone-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          id="bottom-nav-more"
          type="button"
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 text-stone-500 hover:text-stone-900 transition-all cursor-pointer touch-manipulation min-h-[48px] rounded-xl"
        >
          <div className="p-1.5 rounded-xl hover:bg-stone-50">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-500">
            {t('More', 'More')}
          </span>
        </button>
      </div>
    </nav>
  );
};
