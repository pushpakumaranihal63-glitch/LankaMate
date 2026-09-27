import React, { useState } from 'react';
import {
  X,
  Globe,
  Compass,
  Mic,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { touristCountries } from '../data/touristCountries';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    setLanguage,
    touristCountry,
    setTouristCountry,
    targetTranslateLang,
    setTargetTranslateLang,
    t,
    supportedLanguages,
    applyCountrySuggestion,
  } = useTranslation();

  const [suggestedNotice, setSuggestedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCountryChange = (countryCode: string) => {
    setTouristCountry(countryCode);
    const found = touristCountries.find((c) => c.code === countryCode);
    if (found && found.primaryLang && found.primaryLang !== language) {
      setSuggestedNotice(
        `Suggested language for ${found.name} is ${
          supportedLanguages.find((l) => l.code === found.primaryLang)?.nativeName || found.primaryLang
        }. Tap "Apply Suggestion" below if you wish to switch.`
      );
    } else {
      setSuggestedNotice(null);
    }
  };

  const handleApplySuggestion = () => {
    const found = touristCountries.find((c) => c.code === touristCountry);
    if (found && found.primaryLang) {
      setLanguage(found.primaryLang);
      setSuggestedNotice(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-600 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('settings.languageSettings')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {t('settings.languageSettings')}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Customize display language, tourist origin, and voice translation options.
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. Tourist Country Selector */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>{t('country.visitingFrom')} (Optional)</span>
            </div>
            <select
              value={touristCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Choose Country of Origin --</option>
              {touristCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            {suggestedNotice && (
              <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col gap-2">
                <span>{suggestedNotice}</span>
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="self-start px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  {t('country.applySuggestion')}
                </button>
              </div>
            )}
          </div>

          {/* 2. Primary App Display Language */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
              {t('settings.yourLanguage')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {supportedLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{l.flag}</span>
                      <div>
                        <div className="text-xs font-bold">{l.nativeName}</div>
                        <div className="text-[10px] text-stone-600">{l.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Translation Target Language */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
              <span>{t('settings.translationLanguage')} (In Sri Lanka)</span>
            </div>
            <select
              value={targetTranslateLang}
              onChange={(e) => setTargetTranslateLang(e.target.value as LanguageCode)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-600">
              Default destination language for speech translation in Sri Lanka (e.g. Sinhala or Tamil).
            </p>
          </div>

          {/* Done button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
