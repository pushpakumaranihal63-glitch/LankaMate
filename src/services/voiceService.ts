import { LanguageCode } from '../types/index';
import { getLanguageOption } from '../i18n/index';

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';
}

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

// Module-level reference to prevent Chromium garbage collection of active utterance
let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: any = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;

/**
 * Asynchronously wait for speechSynthesis.getVoices() to load before selecting a voice.
 * Solves the issue where getVoices() initially returns an empty list in Chromium / Android / Safari.
 */
export function loadVoices(timeoutMs = 1500): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  // 1. If voices are already loaded and non-empty, return immediately
  const immediate = window.speechSynthesis.getVoices();
  if (immediate && immediate.length > 0) {
    cachedVoices = immediate;
    return Promise.resolve(immediate);
  }

  // 2. Return pending promise if already loading
  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let resolved = false;

    const cleanupAndResolve = (voicesList: SpeechSynthesisVoice[]) => {
      if (resolved) return;
      resolved = true;
      voicesLoadedPromise = null;
      if (voicesList && voicesList.length > 0) {
        cachedVoices = voicesList;
      }
      resolve(cachedVoices);
    };

    // Timeout safety fallback
    const timer = setTimeout(() => {
      const v = window.speechSynthesis.getVoices() || [];
      cleanupAndResolve(v);
    }, timeoutMs);

    // Event listener for voiceschanged
    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        clearTimeout(timer);
        cleanupAndResolve(v);
      }
    };

    try {
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged, { once: true });
    } catch {
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    }

    // Polling fallback specifically for Android Chrome and mobile browsers
    let pollCount = 0;
    const interval = setInterval(() => {
      pollCount++;
      const current = window.speechSynthesis.getVoices();
      if (current && current.length > 0) {
        clearInterval(interval);
        clearTimeout(timer);
        cleanupAndResolve(current);
      } else if (pollCount >= 15) {
        clearInterval(interval);
      }
    }, 80);
  });

  return voicesLoadedPromise;
}

/**
 * Synchronous snapshot of available browser / device voices
 */
export function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
    }
  } catch (e) {
    console.warn('Could not retrieve speech synthesis voices:', e);
  }
  return cachedVoices;
}

// Setup voiceschanged listener early to ensure voice list is ready
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  try {
    const updateHandler = () => {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        cachedVoices = list;
      }
    };
    window.speechSynthesis.onvoiceschanged = updateHandler;
    window.speechSynthesis.addEventListener?.('voiceschanged', updateHandler);
  } catch {
    // Ignore in limited environments
  }
}

export interface LanguageVoiceRule {
  primaryLocale: string;
  candidateLocales: string[];
  nameKeywords: string[];
}

/**
 * Returns voice configuration & candidate locales for each language.
 * Adheres strictly to requirements:
 * - Sinhala: si-LK
 * - Tamil: ta-LK or ta-IN
 * - Arabic: ar-SA (or other available Arabic locale)
 * - English: en-US or en-GB
 */
export function getVoiceRuleForLanguage(langCode: LanguageCode): LanguageVoiceRule {
  switch (langCode) {
    case 'si':
      return {
        primaryLocale: 'si-LK',
        candidateLocales: [
          'si-LK',
          'si_LK',
          'sin-LK',
          'sin_LK',
          'sin-LKA',
          'sin_LKA',
          'si-LKA',
          'si_LKA',
          'sin',
          'si',
        ],
        nameKeywords: [
          'sinhala',
          'singhalese',
          'සිංහල',
          'si-lk',
          'sin-lk',
          'sin-lka',
          'sin',
          'sfg',
        ],
      };
    case 'ta':
      return {
        primaryLocale: 'ta-LK',
        candidateLocales: ['ta-LK', 'ta_LK', 'ta-IN', 'ta_IN', 'ta-SG', 'ta_SG', 'ta'],
        nameKeywords: ['tamil', 'தமிழ்', 'ta-lk', 'ta-in'],
      };
    case 'ar':
      return {
        primaryLocale: 'ar-SA',
        candidateLocales: [
          'ar-SA',
          'ar_SA',
          'ar-XA',
          'ar_XA',
          'ar-001',
          'ar_001',
          'ar-EG',
          'ar_EG',
          'ar-AE',
          'ar_AE',
          'ar',
          'ar-KW',
          'ar_KW',
          'ar-QA',
          'ar_QA',
          'ar-BH',
          'ar_BH',
          'ar-DZ',
          'ar_DZ',
          'ar-MA',
          'ar_MA',
          'ar-OM',
          'ar_OM',
          'ar-TN',
          'ar_TN',
          'ar-IQ',
          'ar_IQ',
          'ar-JO',
          'ar_JO',
          'ar-LB',
          'ar_LB',
          'ar-LY',
          'ar_LY',
          'ar-YE',
          'ar_YE',
        ],
        nameKeywords: [
          'arabic',
          'العربية',
          'عربي',
          'ar-sa',
          'ar-xa',
          'ar-001',
          'ar-eg',
          'ar-ae',
          'maged',
          'tarik',
          'laila',
          'mariam',
          'hoda',
          'naayf',
          'shakir',
          'hamed',
          'salma',
          'zayd',
          'hala',
        ],
      };
    case 'en':
      return {
        primaryLocale: 'en-US',
        candidateLocales: ['en-US', 'en_US', 'en-GB', 'en_GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-IE', 'en'],
        nameKeywords: ['english', 'en-us', 'en-gb'],
      };
    case 'zh':
      return {
        primaryLocale: 'zh-CN',
        candidateLocales: ['zh-CN', 'zh_CN', 'zh-TW', 'zh_TW', 'zh-HK', 'zh'],
        nameKeywords: ['chinese', 'mandarin', 'cmn', '中文', '普通话'],
      };
    case 'ja':
      return {
        primaryLocale: 'ja-JP',
        candidateLocales: ['ja-JP', 'ja_JP', 'ja'],
        nameKeywords: ['japanese', '日本語'],
      };
    case 'ko':
      return {
        primaryLocale: 'ko-KR',
        candidateLocales: ['ko-KR', 'ko_KR', 'ko'],
        nameKeywords: ['korean', '한국어'],
      };
    case 'de':
      return {
        primaryLocale: 'de-DE',
        candidateLocales: ['de-DE', 'de_DE', 'de-AT', 'de-CH', 'de'],
        nameKeywords: ['german', 'deutsch'],
      };
    case 'fr':
      return {
        primaryLocale: 'fr-FR',
        candidateLocales: ['fr-FR', 'fr_FR', 'fr-CA', 'fr-BE', 'fr'],
        nameKeywords: ['french', 'français'],
      };
    case 'es':
      return {
        primaryLocale: 'es-ES',
        candidateLocales: ['es-ES', 'es_ES', 'es-MX', 'es-US', 'es'],
        nameKeywords: ['spanish', 'español'],
      };
    case 'ru':
      return {
        primaryLocale: 'ru-RU',
        candidateLocales: ['ru-RU', 'ru_RU', 'ru'],
        nameKeywords: ['russian', 'русский'],
      };
    case 'hi':
      return {
        primaryLocale: 'hi-IN',
        candidateLocales: ['hi-IN', 'hi_IN', 'hi'],
        nameKeywords: ['hindi', 'हिन्दी'],
      };
    case 'it':
      return {
        primaryLocale: 'it-IT',
        candidateLocales: ['it-IT', 'it_IT', 'it'],
        nameKeywords: ['italian', 'italiano'],
      };
    case 'tr':
      return {
        primaryLocale: 'tr-TR',
        candidateLocales: ['tr-TR', 'tr_TR', 'tr'],
        nameKeywords: ['turkish', 'türkçe', 'turkce', 'tr-tr', 'yelda', 'ahmet', 'emre', 'filiz'],
      };
    default:
      return {
        primaryLocale: 'en-US',
        candidateLocales: ['en-US', 'en'],
        nameKeywords: ['english'],
      };
  }
}

/**
 * Dynamically selects the best matching installed voice for the language
 */
export function findBestVoice(
  langCode: LanguageCode,
  voices: SpeechSynthesisVoice[]
): { voice: SpeechSynthesisVoice | null; locale: string } {
  const rule = getVoiceRuleForLanguage(langCode);

  if (!voices || voices.length === 0) {
    return { voice: null, locale: rule.primaryLocale };
  }

  const cleanLocale = (l: string) => (l || '').replace(/_/g, '-').toLowerCase();

  // 1. Exact candidate match (e.g. si-LK, ta-LK, ta-IN, ar-SA, en-US, en-GB)
  for (const candidate of rule.candidateLocales) {
    const candNorm = cleanLocale(candidate);
    const match = voices.find((v) => cleanLocale(v.lang) === candNorm);
    if (match) {
      return { voice: match, locale: match.lang || candidate };
    }
  }

  // 2. Prefix candidate match (e.g. ta-in matching ta-in-x-..., ar-sa matching ar-sa-x-...)
  for (const candidate of rule.candidateLocales) {
    const candNorm = cleanLocale(candidate);
    const match = voices.find((v) => {
      const vLang = cleanLocale(v.lang);
      return vLang.startsWith(candNorm) || candNorm.startsWith(vLang);
    });
    if (match) {
      return { voice: match, locale: match.lang || candidate };
    }
  }

  // 3. Language code prefix match (e.g. starts with 'si'/'sin' for Sinhala, 'ar' for Arabic, or 'ta-', 'en-')
  const langPrefix = langCode.toLowerCase();
  const langMatch = voices.find((v) => {
    const vLang = cleanLocale(v.lang);
    if (langCode === 'si') {
      return (
        vLang === 'si' ||
        vLang.startsWith('si-') ||
        vLang.startsWith('si_') ||
        vLang === 'sin' ||
        vLang.startsWith('sin-') ||
        vLang.startsWith('sin_')
      );
    }
    if (langCode === 'ar') {
      return vLang === 'ar' || vLang.startsWith('ar-') || vLang.startsWith('ar_');
    }
    if (langCode === 'tr') {
      return vLang === 'tr' || vLang.startsWith('tr-') || vLang.startsWith('tr_');
    }
    return vLang === langPrefix || vLang.startsWith(langPrefix + '-');
  });
  if (langMatch) {
    return { voice: langMatch, locale: langMatch.lang || rule.primaryLocale };
  }

  // 4. Voice name keywords match (e.g. "Google Sinhala", "Tamil (India)", "Arabic", "Valluvar")
  for (const kw of rule.nameKeywords) {
    const kwLower = kw.toLowerCase();
    const nameMatch = voices.find((v) => (v.name || '').toLowerCase().includes(kwLower));
    if (nameMatch) {
      return { voice: nameMatch, locale: nameMatch.lang || rule.primaryLocale };
    }
  }

  return { voice: null, locale: rule.primaryLocale };
}

/**
 * Finds a suitable fallback voice and locale on the device if the exact voice is missing.
 * Ensures the app does NOT silently fail when a native voice is missing on the device.
 */
export function findSuitableFallbackVoice(
  langCode: LanguageCode,
  voices: SpeechSynthesisVoice[]
): { voice: SpeechSynthesisVoice | null; locale: string } {
  const rule = getVoiceRuleForLanguage(langCode);

  if (!voices || voices.length === 0) {
    return { voice: null, locale: rule.primaryLocale };
  }

  const cleanLocale = (l: string) => (l || '').replace(/_/g, '-').toLowerCase();

  // For Sinhala: Never fall back to English or Hindi/Tamil Indic voices which cannot pronounce Sinhala script!
  // If an exact native voice wasn't matched above, check if any voice has Sinhala keywords or variant tags.
  // Otherwise return voice: null with locale 'si-LK' so Web Speech API delegates to the system Sinhala engine.
  if (langCode === 'si') {
    const altSinhalaVoice = voices.find((v) => {
      const l = cleanLocale(v.lang);
      const name = (v.name || '').toLowerCase();
      return (
        l.startsWith('si') ||
        l.startsWith('sin') ||
        name.includes('sinhala') ||
        name.includes('singhalese') ||
        name.includes('සිංහල')
      );
    });
    if (altSinhalaVoice) {
      return { voice: altSinhalaVoice, locale: altSinhalaVoice.lang || 'si-LK' };
    }
    return { voice: null, locale: 'si-LK' };
  }

  // For Arabic: Check for any Arabic voice on the device (ar-XA, ar-EG, ar-AE, ar-001, ar, etc.).
  // Never fall back to English default voice which cannot speak Arabic!
  // If no Arabic voice object is present, return voice: null with 'ar-SA' to allow system-level Arabic TTS.
  if (langCode === 'ar') {
    const altArabicVoice = voices.find((v) => {
      const l = cleanLocale(v.lang);
      const name = (v.name || '').toLowerCase();
      return (
        l.startsWith('ar') ||
        name.includes('arabic') ||
        name.includes('العربية') ||
        name.includes('عربي') ||
        name.includes('maged') ||
        name.includes('tarik') ||
        name.includes('laila')
      );
    });
    if (altArabicVoice) {
      return { voice: altArabicVoice, locale: altArabicVoice.lang || 'ar-SA' };
    }
    return { voice: null, locale: 'ar-SA' };
  }

  // For Turkish: Check for any Turkish voice on the device (tr-TR, tr).
  if (langCode === 'tr') {
    const altTurkishVoice = voices.find((v) => {
      const l = cleanLocale(v.lang);
      const name = (v.name || '').toLowerCase();
      return (
        l.startsWith('tr') ||
        name.includes('turkish') ||
        name.includes('türkçe') ||
        name.includes('turkce')
      );
    });
    if (altTurkishVoice) {
      return { voice: altTurkishVoice, locale: altTurkishVoice.lang || 'tr-TR' };
    }
    return { voice: null, locale: 'tr-TR' };
  }

  // For Tamil: Check regional Indic voice (hi-IN, en-IN)
  if (langCode === 'ta') {
    const indicVoice = voices.find((v) => {
      const l = cleanLocale(v.lang);
      return l.startsWith('hi-') || l.startsWith('en-in');
    });
    if (indicVoice) {
      return { voice: indicVoice, locale: indicVoice.lang || 'hi-IN' };
    }
  }

  // Device default voice
  const defaultVoice = voices.find((v) => v.default);
  if (defaultVoice) {
    return { voice: defaultVoice, locale: defaultVoice.lang || 'en-US' };
  }

  // Standard English voice (en-US or en-GB)
  const enVoice = voices.find((v) => {
    const l = cleanLocale(v.lang);
    return l.startsWith('en-us') || l.startsWith('en-gb') || l.startsWith('en');
  });
  if (enVoice) {
    return { voice: enVoice, locale: enVoice.lang || 'en-US' };
  }

  const first = voices[0];
  return { voice: first, locale: first.lang || 'en-US' };
}

/**
 * Helper to check whether a native voice for the given language is installed on this device
 */
export function isVoiceAvailableForLanguage(
  langCode: LanguageCode,
  voices: SpeechSynthesisVoice[] = cachedVoices
): boolean {
  const { voice } = findBestVoice(langCode, voices);
  return voice !== null;
}

/**
 * Speech Recognition factory for microphone input
 */
export function createSpeechRecognizer(
  langCode: LanguageCode,
  handlers: SpeechRecognitionHandlers
): { start: () => void; stop: () => void; abort: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.('micNotSupported');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  const rule = getVoiceRuleForLanguage(langCode);

  recognizer.lang = rule.primaryLocale;
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onstart = () => {
    handlers.onStart?.();
  };

  recognizer.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const transcript = final || interim;
    handlers.onResult?.(transcript, !!final);
  };

  recognizer.onerror = (event: any) => {
    console.warn('Speech recognition error event:', event.error);
    if (event.error === 'not-allowed') {
      handlers.onError?.('micPermissionDenied');
    } else if (event.error === 'no-speech') {
      handlers.onError?.('no-speech');
    } else {
      handlers.onError?.(event.error || 'speech_recognition_failed');
    }
  };

  recognizer.onend = () => {
    handlers.onEnd?.();
  };

  return {
    start: () => {
      try {
        recognizer.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    },
    stop: () => {
      try {
        recognizer.stop();
      } catch (err) {
        console.warn('Could not stop recognition:', err);
      }
    },
    abort: () => {
      try {
        recognizer.abort();
      } catch (err) {
        console.warn('Could not abort recognition:', err);
      }
    },
  };
}

/**
 * Speaks text using the browser/device SpeechSynthesis API with:
 * 1. Waiting for speechSynthesis.getVoices() to load before selecting a voice.
 * 2. Proper selection of Sinhala (si-LK), Tamil (ta-LK/ta-IN), Arabic (ar-SA), and English (en-US/en-GB).
 * 3. Automatic selection of a suitable fallback voice and locale when exact locale is missing.
 * 4. Never failing silently when a native voice is unavailable.
 * 5. Calling speechSynthesis.speak() with the translated text.
 * 6. Clean cancellation of previous speech and proper Android/mobile audio handling.
 */
export async function speakText(
  text: string,
  langCode: LanguageCode,
  onEnd?: () => void,
  onError?: (error: any) => void
): Promise<boolean> {
  if (!isSpeechSynthesisSupported() || !text || !text.trim()) {
    return false;
  }

  const cleanText = text.trim();

  try {
    // 1. Cancel previous speech before starting new speech (Requirement 11)
    stopSpeaking();

    // 2. Wait for speechSynthesis.getVoices() to load before selecting a voice (Requirement 6)
    const voices = await loadVoices();

    // 3. Select the best available voice by matching the language/locale (Requirements 1, 2, 3, 4, 7)
    const rule = getVoiceRuleForLanguage(langCode);
    const { voice: matchedVoice, locale: matchedLocale } = findBestVoice(langCode, voices);

    // 4. If exact voice is unavailable, select suitable fallback voice and locale (Requirements 8, 9)
    const { voice: fallbackVoice, locale: fallbackLocale } = matchedVoice
      ? { voice: null, locale: '' }
      : findSuitableFallbackVoice(langCode, voices);

    const chosenVoice = matchedVoice || fallbackVoice;
    // When using a matched native voice, use its matched locale (si-LK, ta-LK, ar-SA, etc.)
    // When using a fallback voice, use the fallback voice's own locale
    // NEVER override Sinhala or Arabic to English/Hindi locales
    let chosenLocale = rule.primaryLocale;
    if (matchedVoice) {
      chosenLocale = matchedLocale || matchedVoice.lang || rule.primaryLocale;
    } else if (fallbackVoice) {
      chosenLocale = fallbackLocale || fallbackVoice.lang || rule.primaryLocale;
    } else {
      chosenLocale = fallbackLocale || rule.primaryLocale;
    }

    // Safety guard: ensure Sinhala and Arabic always retain their proper target language locales
    if (
      langCode === 'si' &&
      !chosenLocale.toLowerCase().startsWith('si') &&
      !chosenLocale.toLowerCase().startsWith('sin')
    ) {
      chosenLocale = 'si-LK';
    }
    if (langCode === 'ar' && !chosenLocale.toLowerCase().startsWith('ar')) {
      chosenLocale = 'ar-SA';
    }
    if (langCode === 'tr' && !chosenLocale.toLowerCase().startsWith('tr')) {
      chosenLocale = 'tr-TR';
    }

    // 5. Small delay (60ms) after cancel() before speak() to avoid Chromium cancel queue drop bug
    await new Promise((resolve) => setTimeout(resolve, 60));

    // 6. Resume speech synthesis if paused (handles mobile and background pause states)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const UtteranceClass =
      typeof window !== 'undefined' && window.SpeechSynthesisUtterance
        ? window.SpeechSynthesisUtterance
        : (SpeechSynthesisUtterance as any);

    const utterance = new UtteranceClass(cleanText);
    activeUtterance = utterance;

    // Requirement 10: Make sure speechSynthesis.speak() is actually called with the translated text
    utterance.text = cleanText;
    utterance.lang = chosenLocale;
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    let hasEnded = false;
    const cleanup = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      if (activeUtterance === utterance) {
        activeUtterance = null;
      }
    };

    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };

    utterance.onerror = (event: any) => {
      console.warn(`TTS utterance error for [${langCode} / ${chosenLocale}]:`, event.error);
      cleanup();

      // If user cancelled, don't trigger error
      if (event.error === 'canceled' || event.error === 'interrupted') {
        onEnd?.();
        return;
      }

      // If language was unavailable or voice failed, attempt one safe retry for the specific language
      if (
        (event.error === 'language-unavailable' ||
          event.error === 'voice-unavailable' ||
          event.error === 'synthesis-failed') &&
        !(utterance as any)._isRetry
      ) {
        if (langCode === 'si') {
          // Retry Sinhala with alternate supported locales (sin-LK or si) without changing Sinhala text
          const altLocales = ['sin-LK', 'si', 'sin'];
          const nextLocale = altLocales.find((l) => l.toLowerCase() !== chosenLocale.toLowerCase());
          if (nextLocale) {
            try {
              const retryUtterance = new UtteranceClass(cleanText);
              (retryUtterance as any)._isRetry = true;
              activeUtterance = retryUtterance;
              retryUtterance.text = cleanText;
              retryUtterance.lang = nextLocale;
              retryUtterance.rate = 0.95;
              retryUtterance.pitch = 1.0;
              retryUtterance.onend = () => {
                activeUtterance = null;
                onEnd?.();
              };
              retryUtterance.onerror = (errEvt: any) => {
                activeUtterance = null;
                onError?.(errEvt);
                onEnd?.();
              };
              window.speechSynthesis.speak(retryUtterance);
              return;
            } catch {
              // fall through to error handler
            }
          }
        } else if (langCode === 'ar') {
          // Retry Arabic with alternate standard Arabic locales (ar-XA, ar-001, ar-EG, ar) without changing Arabic text
          const altLocales = ['ar-XA', 'ar-001', 'ar-EG', 'ar'];
          const nextLocale = altLocales.find((l) => l.toLowerCase() !== chosenLocale.toLowerCase());
          if (nextLocale) {
            try {
              const retryUtterance = new UtteranceClass(cleanText);
              (retryUtterance as any)._isRetry = true;
              activeUtterance = retryUtterance;
              retryUtterance.text = cleanText;
              retryUtterance.lang = nextLocale;
              retryUtterance.rate = 0.95;
              retryUtterance.pitch = 1.0;
              retryUtterance.onend = () => {
                activeUtterance = null;
                onEnd?.();
              };
              retryUtterance.onerror = (errEvt: any) => {
                activeUtterance = null;
                onError?.(errEvt);
                onEnd?.();
              };
              window.speechSynthesis.speak(retryUtterance);
              return;
            } catch {
              // fall through to error handler
            }
          }
        } else if (langCode === 'tr') {
          // Retry Turkish with alternate standard Turkish locales ('tr', 'tr-TR') without changing Turkish text
          const altLocales = ['tr', 'tr-TR'];
          const nextLocale = altLocales.find((l) => l.toLowerCase() !== chosenLocale.toLowerCase());
          if (nextLocale) {
            try {
              const retryUtterance = new UtteranceClass(cleanText);
              (retryUtterance as any)._isRetry = true;
              activeUtterance = retryUtterance;
              retryUtterance.text = cleanText;
              retryUtterance.lang = nextLocale;
              retryUtterance.rate = 0.95;
              retryUtterance.pitch = 1.0;
              retryUtterance.onend = () => {
                activeUtterance = null;
                onEnd?.();
              };
              retryUtterance.onerror = (errEvt: any) => {
                activeUtterance = null;
                onError?.(errEvt);
                onEnd?.();
              };
              window.speechSynthesis.speak(retryUtterance);
              return;
            } catch {
              // fall through to error handler
            }
          }
        } else {
          // Keep existing fallback for other working languages
          try {
            const retryUtterance = new UtteranceClass(cleanText);
            (retryUtterance as any)._isRetry = true;
            activeUtterance = retryUtterance;
            retryUtterance.lang = 'en-US';
            const defaultV = (window.speechSynthesis.getVoices() || []).find((v) => v.default) || null;
            if (defaultV) {
              retryUtterance.voice = defaultV;
              retryUtterance.lang = defaultV.lang || 'en-US';
            }
            retryUtterance.onend = () => {
              activeUtterance = null;
              onEnd?.();
            };
            retryUtterance.onerror = (errEvt: any) => {
              activeUtterance = null;
              onError?.(errEvt);
              onEnd?.();
            };
            window.speechSynthesis.speak(retryUtterance);
            return;
          } catch {
            // fall through to error handler
          }
        }
      }

      onError?.(event);
      onEnd?.();
    };

    // Keep-alive timer for Chromium long speech freeze bug
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
    }
    keepAliveTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (keepAliveTimer) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
        }
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 1000);

    // Call speechSynthesis.speak with the translated text (Requirement 10)
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Failed to start speech synthesis:', err);
    onError?.(err);
    onEnd?.();
    return false;
  }
}

/**
 * Stops ongoing speech synthesis cleanly
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch (e) {
      console.warn('Error stopping speech synthesis:', e);
    }
  }
}
