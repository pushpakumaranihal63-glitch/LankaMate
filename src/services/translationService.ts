import { LanguageCode } from '../types';

export interface TranslationResponse {
  translatedText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  isOfflineFallback?: boolean;
  error?: string;
}

export async function translateText(
  text: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode
): Promise<TranslationResponse> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { translatedText: '', sourceLang, targetLang };
  }

  if (sourceLang === targetLang) {
    return { translatedText: trimmed, sourceLang, targetLang };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: trimmed,
        sourceLang,
        targetLang,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data.translatedText || trimmed,
      sourceLang,
      targetLang,
      isOfflineFallback: !!data.isOfflineFallback,
      error: data.error,
    };
  } catch (err: any) {
    console.warn('Translation API error:', err);
    return {
      translatedText: '',
      sourceLang,
      targetLang,
      error: 'Translation service is temporarily unavailable. Please try again.',
    };
  }
}
