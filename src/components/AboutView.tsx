import React, { useState } from 'react';
import {
  Info,
  Sparkles,
  Heart,
  Globe,
  Award,
  Send,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { PageId } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface AboutViewProps {
  onNavigatePage: (page: PageId) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigatePage }) => {
  const { t } = useTranslation();
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Trip Suggestion');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
    }, 3500);
  };

  const islandFacts = [
    {
      stat: t('8 UNESCO Sites'),
      label: t('World Heritage Shrines'),
      desc: t('Including Sigiriya Rock Fortress, Ancient Polonnaruwa, Galle Fort, and Sinharaja Rainforest.'),
    },
    {
      stat: t('#1 Leopard Density'),
      label: t('Wildlife Wonder'),
      desc: t('Yala National Park Block 1 hosts the highest wild Panthera pardus kotiya concentration on Earth.'),
    },
    {
      stat: t('Pure Ceylon Tea'),
      label: t('Highland Heritage'),
      desc: t('Since 1867, Sri Lanka produces the globe’s most prized single-origin orthodox black and silver-tip teas.'),
    },
    {
      stat: t('2,500+ Years'),
      label: t('Documented History'),
      desc: t('Chronicles in the Mahavamsa detail ancient hydraulic civilizations, giant stupas, and sacred bo-trees.'),
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            {t('Our Vision & Mission')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            {t('About LankaMate')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
            {t('Sri Lanka’s premier digital travel companion crafted specifically for both domestic Sri Lankan explorers and foreign international tourists.')}
          </p>
        </div>

        {/* Mission & Purpose Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {t('Honoring the Island’s Authenticity')}
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              <strong>LankaMate</strong> {t('was born from a simple belief: Sri Lanka is not just another tourist stop, but a deeply spiritual, ecologically diverse paradise where 2,500 years of civilization meet warm tropical waters, misty tea mountain ranges, and free-roaming wildlife.')}
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {t('We reject cookie-cutter AI tourist itineraries. Every guide, train schedule, emergency contact, food recommendation, and destination portrait in LankaMate has been curated with verified local intelligence — respecting sacred temple customs, realistic road transit durations, and actual local Rupee prices.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{t('For International Visitors')}</h4>
                  <p className="text-[11px] text-stone-500">
                    {t('Clear guidance on dual monsoons, train ticketing, tipping, and tourist police safety.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <Globe className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{t('For Sri Lankan Locals')}</h4>
                  <p className="text-[11px] text-stone-500">
                    {t('Explore hidden gems across the Central Highlands, Northern Peninsula, and pristine southern bays.')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-900 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80"
                alt={t('Sri Lanka scenic train journey')}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {t('Sri Lanka Railways Mainline')}
                </span>
                <p className="text-sm font-bold">{t('Demodara Nine Arches Viaduct, Ella')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sri Lanka Travel Highlights & Facts Grid */}
        <div className="space-y-4">
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-emerald-950">{t('Sri Lanka Island Highlights')}</h2>
            <p className="text-xs text-stone-500">{t('Why Sri Lanka is celebrated among the world’s top travel destinations:')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {islandFacts.map((fact, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors"
              >
                <span className="text-2xl font-black text-emerald-950 block">{fact.stat}</span>
                <span className="text-xs font-bold text-amber-700 block uppercase tracking-wide">
                  {fact.label}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">{fact.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback & Inquiries Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950 tracking-tight">
              {t('Share Feedback or Request a Route')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              {t('Have a suggestion for a new Sri Lankan destination, verified hotel, or culinary spot? We love hearing from our community.')}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
              <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">{t('Bohoma Sthuthi! Thank You!')}</h3>
              <p className="text-xs text-emerald-900 max-w-sm mx-auto">
                {t('Your message has been received by the LankaMate editorial team. We continuously update our guides with user contributions.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">{t('Your Name')}</label>
                  <input
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={t('e.g. Dilshan Perera')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">{t('Email Address')}</label>
                  <input
                    type="email"
                    required
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="dilshan@example.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">{t('Topic')}</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
                >
                  <option>{t('Destination Recommendation')}</option>
                  <option>{t('Restaurant or Street Food Suggestion')}</option>
                  <option>{t('Hotel / Villa Review')}</option>
                  <option>{t('Transport / Schedule Correction')}</option>
                  <option>{t('General Inquiries')}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">{t('Your Message')}</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder={t('Share details about your Sri Lanka travel experience or suggestions...')}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('Submit Feedback to LankaMate')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
