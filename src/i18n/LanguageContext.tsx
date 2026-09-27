import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '../types';
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  translateKey,
  getLanguageOption,
} from './index';
import { touristCountries } from '../data/touristCountries';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  touristCountry: string;
  setTouristCountry: (countryCode: string) => void;
  targetTranslateLang: LanguageCode;
  setTargetTranslateLang: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentLangOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  applyCountrySuggestion: (countryCode: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('lankamate_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const [touristCountry, setTouristCountryState] = useState<string>(() => {
    try {
      return localStorage.getItem('lankamate_tourist_country') || '';
    } catch {
      return '';
    }
  });

  const [targetTranslateLang, setTargetTranslateLangState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('lankamate_target_translate_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // fallback
    }
    return 'si'; // Default target in Sri Lanka is Sinhala
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('lankamate_lang', newLang);
      document.documentElement.lang = newLang;
      if (newLang === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch (e) {
      console.warn('Failed to persist language in localStorage', e);
    }
  };

  const setTouristCountry = (code: string) => {
    setTouristCountryState(code);
    try {
      localStorage.setItem('lankamate_tourist_country', code);
    } catch (e) {
      console.warn(e);
    }
  };

  const setTargetTranslateLang = (newLang: LanguageCode) => {
    setTargetTranslateLangState(newLang);
    try {
      localStorage.setItem('lankamate_target_translate_lang', newLang);
    } catch (e) {
      console.warn(e);
    }
  };

  const applyCountrySuggestion = (countryCode: string) => {
    setTouristCountry(countryCode);
    const country = touristCountries.find((c) => c.code === countryCode);
    if (country && country.primaryLang) {
      setLanguage(country.primaryLang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const val = translateKey(language, key);
    if (val === key && fallback) {
      return fallback;
    }
    return val;
  };

  const currentLangOption = getLanguageOption(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        touristCountry,
        setTouristCountry,
        targetTranslateLang,
        setTargetTranslateLang,
        t,
        currentLangOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
        applyCountrySuggestion,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
