import React, { useState } from 'react';
import {
  BookOpen,
  Sun,
  Coins,
  PhoneCall,
  HeartHandshake,
  ShieldCheck,
  Wifi,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
} from 'lucide-react';
import { handbookTopics } from '../data/handbookData';
import { PageId } from '../types';
import { handleEmergencyCall } from '../utils/emergencyCall';
import { useTranslation } from '../i18n/LanguageContext';

interface HandbookViewProps {
  onNavigatePage: (page: PageId) => void;
}

export const HandbookView: React.FC<HandbookViewProps> = ({ onNavigatePage }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Weather', 'Currency', 'Emergency', 'Etiquette', 'Safety', 'SIM & Connectivity'];

  const filteredTopics = handbookTopics.filter((topic) => {
    const matchesCat = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const phrases = [
    { phrase: 'Ayubowan (ආයුබෝවන්)', meaning: 'May you live long / Hello & Goodbye', lang: 'Sinhala' },
    { phrase: 'Vanakkam (வணக்கம்)', meaning: 'Respectful Greetings / Hello', lang: 'Tamil' },
    { phrase: 'Bohoma Sthuthi (බොහෝම ස්තූතියි)', meaning: 'Thank you very much', lang: 'Sinhala' },
    { phrase: 'Nandri (நன்றி)', meaning: 'Thank you', lang: 'Tamil' },
    { phrase: 'Kohomada? (කොහොමද?)', meaning: 'How are you?', lang: 'Sinhala' },
    { phrase: 'Epa (එපා)', meaning: 'No / I do not want (useful for persistent touts)', lang: 'Sinhala' },
    { phrase: 'Hari (හරි)', meaning: 'Okay / Alright / Correct', lang: 'Sinhala' },
    { phrase: 'Mila keeyada? (මිල කීයද?)', meaning: 'How much does this cost?', lang: 'Sinhala' },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            {t('Official Traveler Dossier')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            {t('Sri Lanka Travel Handbook')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
            {t('Critical island knowledge: weather seasons, currency handling, emergency speed-dials, temple etiquette, and health safety tips for first-timers and seasoned visitors.')}
          </p>
        </div>

        {/* Emergency Speed Dial Action Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            id="card-emergency-1990"
            onClick={(e) => handleEmergencyCall(e, '1990')}
            className="w-full text-left bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer touch-manipulation group"
            title={t('Call Free Ambulance 1990')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                  {t('Free Ambulance')}
                </span>
                <span className="text-2xl font-black text-red-950">1990</span>
                <span className="text-[10px] text-stone-500 block">{t('Suwa Seriya Pre-Hospital')}</span>
              </div>
            </div>
            <span
              id="btn-call-1990"
              className="px-3 py-2 bg-red-600 group-hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('Call 1990')}</span>
            </span>
          </button>

          <button
            type="button"
            id="card-emergency-1912"
            onClick={(e) => handleEmergencyCall(e, '1912')}
            className="w-full text-left bg-sky-50 hover:bg-sky-100 active:bg-sky-200 border border-sky-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer touch-manipulation group"
            title={t('Call Tourist Police 1912')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  {t('Tourist Police')}
                </span>
                <span className="text-2xl font-black text-sky-950">1912</span>
                <span className="text-[10px] text-stone-500 block">{t('24/7 Multilingual Support')}</span>
              </div>
            </div>
            <span
              id="btn-call-1912"
              className="px-3 py-2 bg-sky-700 group-hover:bg-sky-800 active:bg-sky-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('Call 1912')}</span>
            </span>
          </button>

          <button
            type="button"
            id="card-emergency-119"
            onClick={(e) => handleEmergencyCall(e, '119')}
            className="w-full text-left bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer touch-manipulation group"
            title={t('Call Police Dispatch 119')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  {t('Police Dispatch')}
                </span>
                <span className="text-2xl font-black text-amber-950">119</span>
                <span className="text-[10px] text-stone-500 block">{t('National Police Emergency')}</span>
              </div>
            </div>
            <span
              id="btn-call-119"
              className="px-3 py-2 bg-amber-600 group-hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('Call 119')}</span>
            </span>
          </button>

          <button
            type="button"
            id="card-emergency-110"
            onClick={(e) => handleEmergencyCall(e, '110')}
            className="w-full text-left bg-orange-50 hover:bg-orange-100 active:bg-orange-200 border border-orange-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer touch-manipulation group"
            title={t('Call Fire & Rescue 110')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
                  {t('Fire & Rescue')}
                </span>
                <span className="text-2xl font-black text-orange-950">110</span>
                <span className="text-[10px] text-stone-500 block">{t('Emergency Fire Brigade')}</span>
              </div>
            </div>
            <span
              id="btn-call-110"
              className="px-3 py-2 bg-orange-600 group-hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('Call 110')}</span>
            </span>
          </button>
        </div>

        {/* Category Selector & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search handbook tips...')}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Handbook Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    {t(topic.category)}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {t(topic.badge)}
                  </span>
                </div>

                <h3 className="text-xl font-black text-emerald-950 tracking-tight">
                  {t(topic.title)}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t(topic.summary)}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {topic.content.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{t(point)}</span>
                    </div>
                  ))}
                </div>

                {topic.id === 'emergency-contacts' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      id="btn-topic-call-1990"
                      onClick={(e) => handleEmergencyCall(e, '1990')}
                      className="p-2.5 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-900 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation w-full text-left"
                      title={t('Call Free Ambulance 1990')}
                    >
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                        <span>{t('Free Ambulance')}</span>
                      </span>
                      <span className="font-black text-red-700">1990</span>
                    </button>
                    <button
                      type="button"
                      id="btn-topic-call-1912"
                      onClick={(e) => handleEmergencyCall(e, '1912')}
                      className="p-2.5 bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-sky-900 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation w-full text-left"
                      title={t('Call Tourist Police 1912')}
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>{t('Tourist Police')}</span>
                      </span>
                      <span className="font-black text-sky-700">1912</span>
                    </button>
                    <button
                      type="button"
                      id="btn-topic-call-119"
                      onClick={(e) => handleEmergencyCall(e, '119')}
                      className="p-2.5 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation w-full text-left"
                      title={t('Call Police Dispatch 119')}
                    >
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t('Police Dispatch')}</span>
                      </span>
                      <span className="font-black text-amber-700">119</span>
                    </button>
                    <button
                      type="button"
                      id="btn-topic-call-110"
                      onClick={(e) => handleEmergencyCall(e, '110')}
                      className="p-2.5 bg-orange-100 hover:bg-orange-200 active:bg-orange-300 text-orange-900 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-2xs touch-manipulation w-full text-left"
                      title={t('Call Fire & Rescue 110')}
                    >
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                        <span>{t('Fire & Rescue')}</span>
                      </span>
                      <span className="font-black text-orange-700">110</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Golden Rule / Key Advice Box */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[11px] text-emerald-900">{t('Key Takeaway:')}</span>
                  <p className="text-emerald-950 font-medium leading-relaxed">{t(topic.keyAdvice)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Common Sinhala & Tamil Phrasebook */}
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>{t('Essential Island Greetings & Phrases')}</span>
          </div>

          <p className="text-xs text-stone-500">
            {t('Speaking a few words of Sinhala and Tamil brings warm smiles across the island:')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {phrases.map((p, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <div className="text-xs font-bold text-emerald-950">{p.phrase}</div>
                <div className="text-[11px] text-stone-600">{t(p.meaning)}</div>
                <span className="text-[9px] uppercase font-bold text-stone-400 bg-white px-1.5 py-0.5 rounded-sm inline-block">
                  {t(p.lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
