import { LanguageCode } from '../types';
import { en, TranslationDict } from './en';
import { si } from './si';
import { ta } from './ta';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import { de } from './de';
import { fr } from './fr';
import { es } from './es';
import { ru } from './ru';
import { ar } from './ar';
import { hi } from './hi';
import { it } from './it';
import { tr } from './tr';
import { UI_PHRASES } from './uiPhrases';
import { translations as dataTranslations } from '../data/translations';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string; // BCP-47 tag for SpeechSynthesis & SpeechRecognition
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', voiceCode: 'en-US' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', voiceCode: 'si-LK' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰', voiceCode: 'ta-LK' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', voiceCode: 'ar-SA' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', voiceCode: 'tr-TR' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', voiceCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', voiceCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', voiceCode: 'ko-KR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', voiceCode: 'de-DE' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', voiceCode: 'fr-FR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', voiceCode: 'es-ES' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', voiceCode: 'ru-RU' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', voiceCode: 'it-IT' },
];

export const translations: Record<LanguageCode, TranslationDict> = {
  en,
  si,
  ta,
  zh,
  ja,
  ko,
  de,
  fr,
  es,
  ru,
  ar,
  hi,
  it,
  tr,
};

/**
 * Resolve a nested translation key (e.g. 'nav.home', 'translator.playAudio')
 * or a direct UI phrase (e.g. 'Discover Sri Lanka', 'Iconic Destinations')
 * Falls back safely to English dictionary or the original text if undefined.
 */
export function translateKey(lang: LanguageCode, path: string): string {
  if (!path) return '';

  // 1. Direct match in UI phrases map
  if (lang !== 'en' && UI_PHRASES[lang]) {
    if (UI_PHRASES[lang][path]) {
      return UI_PHRASES[lang][path];
    }
    const trimmed = path.trim();
    if (UI_PHRASES[lang][trimmed]) {
      return UI_PHRASES[lang][trimmed];
    }
  }

  // 2. Dot-separated path lookup in translations dictionary
  const activeDict = translations[lang] || en;
  const enDict = en;

  const parts = path.split('.');
  let currentActive: any = activeDict;
  let currentEn: any = enDict;

  for (const part of parts) {
    if (currentActive && typeof currentActive === 'object') {
      currentActive = currentActive[part];
    } else {
      currentActive = undefined;
    }

    if (currentEn && typeof currentEn === 'object') {
      currentEn = currentEn[part];
    } else {
      currentEn = undefined;
    }
  }

  if (typeof currentActive === 'string') {
    return currentActive;
  }
  if (typeof currentEn === 'string') {
    return currentEn;
  }

  // 3. Check if path exists as common phrase in active dict's common or nav sub-objects
  if (lang !== 'en') {
    const commonMatch = (activeDict as any)?.common?.[path];
    if (typeof commonMatch === 'string') return commonMatch;
    const navMatch = (activeDict as any)?.nav?.[path];
    if (typeof navMatch === 'string') return navMatch;

    // 4. Fallback check in dataTranslations
    const dataDict = (dataTranslations as any)?.[lang];
    if (dataDict) {
      let cur = dataDict;
      for (const part of parts) {
        if (cur && typeof cur === 'object') {
          cur = cur[part];
        } else {
          cur = undefined;
          break;
        }
      }
      if (typeof cur === 'string') return cur;
      if (typeof dataDict.common?.[path] === 'string') return dataDict.common[path];
      if (typeof dataDict.nav?.[path] === 'string') return dataDict.nav[path];
      if (typeof dataDict.home?.[path] === 'string') return dataDict.home[path];
    }
  }

  return path;
}

export function getLanguageOption(code: LanguageCode): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export type { TranslationDict };
