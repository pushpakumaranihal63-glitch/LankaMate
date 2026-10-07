import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  RefreshCw,
  Mic,
  MicOff,
  Loader2,
} from 'lucide-react';
import { PageId } from '../types';
import { QUICK_ASK_ITEMS, QuickAskItem, getQuickAskAnswer } from '../data/quickAskAnswers';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageCode } from '../types';
import { detectPlaceSearchCategory, extractNamedSearchLocation, type PlaceSearchCategory } from '../utils/placeSearchIntent';
import { requestUserLocation } from '../utils/navigation';
import { formatVerifiedPlaceSearch, VERIFIED_PLACE_LABELS, type VerifiedPlaceSearch } from '../utils/verifiedPlaceResults';
import { detectPlaceFollowup } from '../utils/placeFollowupIntent';


const SPEECH_TO_TEXT_LANG_MAP: Record<string, string> = {
  en: 'English',
  si: 'Sinhala',
  ta: 'Tamil',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
  it: 'Italian',
  tr: 'Turkish',
};

async function translateAnswer(text: string, lang: LanguageCode): Promise<string> {
  if (lang === 'en' || !text) return text;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang: 'en' as LanguageCode, targetLang: lang }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
}

interface AssistantNearbySearch {
  category: PlaceSearchCategory;
  lat?: number;
  lng?: number;
  locationUnavailable?: boolean;
}

const detectNearbySearch = detectPlaceSearchCategory;

// Local label selection only; no translation of returned place records.
function resolveConversationLanguage(text: string, established: LanguageCode | undefined, fallback: LanguageCode): LanguageCode {
  const query = text.normalize('NFKC').toLocaleLowerCase();
  const scripts: [LanguageCode, RegExp][] = [
    ['si', /\p{Script=Sinhala}/gu], ['ta', /\p{Script=Tamil}/gu],
    ['ja', /[\p{Script=Hiragana}\p{Script=Katakana}]/gu], ['ko', /\p{Script=Hangul}/gu],
    ['ru', /\p{Script=Cyrillic}/gu], ['ar', /\p{Script=Arabic}/gu], ['hi', /\p{Script=Devanagari}/gu],
  ];
  const matches = scripts.map(([code, pattern]) => ({ code, count: query.match(pattern)?.length || 0 }))
    .filter(item => item.count >= 2);
  // Mixed distinctive scripts are ambiguous. Kana takes precedence over shared Han.
  if (matches.length === 1) return matches[0].code;
  if (!matches.length && (query.match(/\p{Script=Han}/gu)?.length || 0) >= 2) return 'zh';
  if (matches.length) return established || fallback;
  // Require two distinct language-specific words; place names and single loanwords
  // cannot change the conversation language. Short requests inherit it.
  const words = new Set(query.match(/\p{L}+/gu) || []);
  const indicators: Partial<Record<LanguageCode, string[]>> = {
    en: ['find', 'near', 'nearby', 'where', 'please', 'looking', 'hospital', 'school', 'pharmacy'],
    de: ['suche', 'finde', 'krankenhaus', 'nähe', 'apotheke', 'bitte'],
    fr: ['trouver', 'cherche', 'près', 'pharmacie', 'hôpital', 'bonjour'],
    es: ['buscar', 'busca', 'encuentra', 'cerca', 'farmacia', 'hola'],
    it: ['trova', 'cerca', 'vicino', 'farmacia', 'ospedale', 'buongiorno'],
    tr: ['yakınında', 'yakındaki', 'hastane', 'eczane', 'bul', 'lütfen'],
  };
  const candidates = Object.entries(indicators).filter(([, terms]) => terms!.filter(word => words.has(word)).length >= 2);
  return candidates.length === 1 ? candidates[0][0] as LanguageCode : established || fallback;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  verifiedPlaceSearch?: VerifiedPlaceSearch;
  responseLanguage?: LanguageCode;
}

interface AIAssistantViewProps {
  onNavigatePage: (page: PageId) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigatePage }) => {
  const { language, t, currentLangOption } = useTranslation();
  const verifiedPlaceContext = useRef<{ token: string; search: VerifiedPlaceSearch } | null>(null);

  const conversationLanguage = useRef<LanguageCode | undefined>(undefined);
  // An explicit UI-language change becomes the fallback for subsequent messages.
  useEffect(() => { conversationLanguage.current = language; }, [language]);

  const welcomeText = `**Ayubowan! 🙏 Welcome to LankaMate AI.**\n\nI am your culturally grounded Sri Lankan travel companion. Ask me anything or tap any topic below:\n\n• **Blue Train Tickets:** Kandy to Ella booking guidance & unreserved seats.\n• **Temple Dress Code:** Sacred site etiquette, shoulders/knees rules & customs.\n• **Best Street Food:** Crispy hoppers, hot kottu, isso wade & food safety.\n• **Yala Safari Guide:** Leopard tracking tips, 4x4 jeeps & park safety.\n• **Weather & Seasons:** Dual monsoon patterns & best regional travel times.\n• **7-Day Itinerary:** Balanced Colombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle route.\n\nAsk me in any language and I will gladly guide you!`;

  const [translatedWelcome, setTranslatedWelcome] = useState<string>(welcomeText);

  useEffect(() => {
    if (language === 'en') {
      setTranslatedWelcome(welcomeText);
      return;
    }
    let cancelled = false;
    translateAnswer(welcomeText, language).then((translated) => {
      if (!cancelled) setTranslatedWelcome(translated);
    });
    return () => { cancelled = true; };
  }, [language]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Update welcome message in place when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.id === 'welcome' ? { ...m, text: translatedWelcome } : m))
    );
  }, [translatedWelcome]);

  const [activeQuickAsk, setActiveQuickAsk] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const baseInputRef = useRef<string>('');
  const microphoneRequestRef = useRef(0);

  const stopMediaTracks = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try { recorder.stop(); } catch { /* noop */ }
      return;
    }

    microphoneRequestRef.current += 1;
    stopMediaTracks();
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsListening(false);
  }, [stopMediaTracks]);

  const transcribeAudio = useCallback(async (audioBlob: Blob, lang: string, existingText: string): Promise<string> => {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Could not read recorded audio.'));
          return;
        }
        const base64 = reader.result.split(',')[1];
        if (base64) resolve(base64);
        else reject(new Error('Recorded audio was empty.'));
      };
      reader.onerror = () => reject(new Error('Could not read recorded audio.'));
      reader.readAsDataURL(audioBlob);
    });

    const audio = await base64Promise;
    const langName = SPEECH_TO_TEXT_LANG_MAP[lang] || 'English';
    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio,
        mimeType: audioBlob.type || 'audio/webm',
        language: langName,
      }),
    });
    if (!response.ok) {
      let serverError = '';
      try {
        const errorData = await response.json();
        if (typeof errorData?.error === 'string') serverError = errorData.error;
      } catch {
        // Use the HTTP status when the error response is not valid JSON.
      }
      throw new Error(serverError
        ? `Transcription failed: ${response.status}: ${serverError}`
        : `Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    const transcript = typeof data.transcript === 'string' ? data.transcript.trim() : '';
    if (!transcript) throw new Error('Speech transcription returned an empty transcript.');
    return existingText ? `${existingText} ${transcript}`.trim() : transcript;
  }, []);

  const startMediaRecorderFallback = useCallback(async (lang: string, existingText: string) => {
    const requestId = ++microphoneRequestRef.current;
    setIsListening(true);
    setMicError(null);
    baseInputRef.current = existingText;
    audioChunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setIsListening(false);
      setMicError(t('Microphone access is not available in this browser. Please try Chrome or type your question.'));
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (requestId !== microphoneRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stopMediaTracks();
        mediaRecorderRef.current = null;
        setIsListening(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        audioChunksRef.current = [];
        if (audioBlob.size < 1000) {
          setMicError(t('No speech was detected. Please try speaking again.'));
          return;
        }

        setIsTranscribing(true);
        try {
          const combined = await transcribeAudio(audioBlob, lang, baseInputRef.current);
          setInputText(combined);
          setTimeout(() => inputRef.current?.focus(), 100);
        } catch (err) {
          const transcriptionError = err as { name?: string; message?: string };
          console.error('AI_MIC_TRANSCRIPTION_ERROR', {
            errorName: transcriptionError?.name || 'Error',
            errorMessage: transcriptionError?.message || String(err),
          });
          setMicError(t('Could not transcribe your speech. Please try again or type your question.'));
        } finally {
          setIsTranscribing(false);
        }
      };
      recorder.onerror = () => {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        if (recorder.state !== 'inactive') {
          try { recorder.stop(); } catch { /* noop */ }
        }
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
        stopMediaTracks();
        setIsListening(false);
        setMicError(t('Could not transcribe your speech. Please try again or type your question.'));
      };

      recorder.start(1000);
    } catch (err: any) {
      stream?.getTracks().forEach((track) => track.stop());
      if (mediaStreamRef.current === stream) mediaStreamRef.current = null;
      if (requestId !== microphoneRequestRef.current) return;
      mediaRecorderRef.current = null;
      setIsListening(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setMicError(t('Microphone access was denied. Please allow microphone permissions to use voice input.'));
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setMicError(t('No microphone was found on this device.'));
      } else if (err?.name === 'NotReadableError') {
        setMicError(t('Microphone is in use by another app. Please close it and try again.'));
      } else {
        setMicError(t('Could not start voice input. Please check microphone permissions and try again.'));
      }
    }
  }, [stopMediaTracks, transcribeAudio, t]);

  const handleMicToggle = useCallback(() => {
    setMicError(null);

    if (isListening) {
      stopListening();
      return;
    }

    if (isTranscribing) return;

    startMediaRecorderFallback(language, inputText);
  }, [isListening, isTranscribing, language, inputText, stopListening, startMediaRecorderFallback]);

  useEffect(() => {
    return () => {
      microphoneRequestRef.current += 1;
      const recorder = mediaRecorderRef.current;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.onerror = null;
        if (recorder.state !== 'inactive') {
          try { recorder.stop(); } catch { /* noop */ }
        }
        mediaRecorderRef.current = null;
      }
      audioChunksRef.current = [];
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  // Handle Quick Ask click: translate answer if needed, then display
  const handleQuickAsk = async (item: QuickAskItem) => {
    setActiveQuickAsk(item.label);
    setLoading(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: item.prompt,
      timestamp: timeNow,
    };

    const answerText = await translateAnswer(item.answer, language);

    const assistantMessage: Message = {
      id: `assistant-${Date.now() + 1}`,
      sender: 'assistant',
      text: answerText,
      timestamp: timeNow,
    };

    verifiedPlaceContext.current = null;
    setMessages([userMessage, assistantMessage]);
    setLoading(false);

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    setActiveQuickAsk(null);
    setInputText('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: timeNow,
    };

    // Replace welcome message with the user's question (welcome is only an empty-state message)
    setMessages((prev) => {
      const withoutWelcome = prev.filter((m) => m.id !== 'welcome');
      return [...withoutWelcome, userMessage];
    });
    setLoading(true);

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    const responseLanguage = resolveConversationLanguage(query, conversationLanguage.current, language);
    conversationLanguage.current = responseLanguage;
    const previousPlaceContext = verifiedPlaceContext.current;
    const placeFollowup = detectPlaceFollowup(query, previousPlaceContext?.search.places || []);
    if (!placeFollowup) verifiedPlaceContext.current = null;
    try {
      let nearbySearch: AssistantNearbySearch | undefined;
      const nearbyCategory = detectNearbySearch(query);
      if (!placeFollowup && nearbyCategory && extractNamedSearchLocation(query)) {
        // The server resolves the explicit area; do not prompt for or substitute GPS.
        nearbySearch = { category: nearbyCategory };
      } else if (!placeFollowup && nearbyCategory) {
        try {
          const location = await requestUserLocation();
          const locationUnavailable = !(location.coordinates && location.isRealGps && location.isInsideSriLanka);
          console.info('[AI nearby GPS] location resolved', {
            isRealGps: location.isRealGps,
            hasCoordinates: Boolean(location.coordinates),
            locationUnavailable,
            ...(location.errorName ? { errorName: location.errorName } : {}),
            ...(location.errorCode !== undefined ? { errorCode: location.errorCode } : {}),
            ...(location.error ? { error: location.error } : {}),
          });
          nearbySearch = location.coordinates && location.isRealGps && location.isInsideSriLanka
            ? { category: nearbyCategory, lat: location.coordinates.lat, lng: location.coordinates.lng }
            : { category: nearbyCategory, locationUnavailable: true };
        } catch (error) {
          const diagnosticError = error as { name?: string; message?: string; code?: number };
          console.warn('[AI nearby GPS] location request threw', {
            locationUnavailable: true,
            ...(diagnosticError?.name ? { errorName: diagnosticError.name } : {}),
            ...(diagnosticError?.code !== undefined ? { errorCode: diagnosticError.code } : {}),
            ...(diagnosticError?.message ? { error: diagnosticError.message } : {}),
          });
          nearbySearch = { category: nearbyCategory, locationUnavailable: true };
        }
      }
      console.info('[AI nearby GPS] outgoing assistant request', {
        hasLatitude: typeof nearbySearch?.lat === 'number' && Number.isFinite(nearbySearch.lat),
        hasLongitude: typeof nearbySearch?.lng === 'number' && Number.isFinite(nearbySearch.lng),
        locationUnavailable: nearbySearch?.locationUnavailable === true,
      });
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: nearbyCategory || placeFollowup ? responseLanguage : language,
          history: messages.filter((m) => m.id !== 'welcome').slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
          ...(nearbySearch ? { nearbySearch } : {}),
          ...(placeFollowup && previousPlaceContext ? { verifiedPlaceContext: previousPlaceContext.token } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      const verifiedPlaceSearch: VerifiedPlaceSearch | undefined = data.verifiedPlaceSearch;
      if ((detectNearbySearch(query) || placeFollowup) && !verifiedPlaceSearch) {
        throw new Error('Place search response did not include verified records');
      }
      if (verifiedPlaceSearch?.status === 'results' && typeof data.verifiedPlaceContext === 'string') {
        // Keep the complete original candidate set when a follow-up selects one.
        verifiedPlaceContext.current = previousPlaceContext?.token === data.verifiedPlaceContext
          ? previousPlaceContext : { token: data.verifiedPlaceContext, search: verifiedPlaceSearch };
      } else if (verifiedPlaceSearch) verifiedPlaceContext.current = null;
      let replyText = verifiedPlaceSearch ? formatVerifiedPlaceSearch(verifiedPlaceSearch, responseLanguage) : data.reply || getQuickAskAnswer(query);
      if (!verifiedPlaceSearch && data.isOfflineFallback && language !== 'en') {
        replyText = await translateAnswer(replyText, language);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        ...(verifiedPlaceSearch ? { verifiedPlaceSearch, responseLanguage } : {}),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Backend assistant error, falling back to local database', err);
      const failedPlaceSearch: VerifiedPlaceSearch | undefined = detectNearbySearch(query) || placeFollowup ? { status: placeFollowup ? 'context_unavailable' : 'unavailable', places: [] } : undefined;
      const fallbackAnswer = failedPlaceSearch ? formatVerifiedPlaceSearch(failedPlaceSearch, responseLanguage) : await translateAnswer(getQuickAskAnswer(query), language);
      const assistantMessage: Message = {
        id: `assistant-${Date.now() + 1}`,
        sender: 'assistant',
        text: fallbackAnswer,
        ...(failedPlaceSearch ? { verifiedPlaceSearch: failedPlaceSearch, responseLanguage } : {}),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    conversationLanguage.current = language;
    verifiedPlaceContext.current = null;
    setActiveQuickAsk(null);
    setLoading(false);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: translatedWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8 pb-28 xl:pb-8">
      <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-210px)] xl:h-[calc(100vh-140px)] min-h-[500px]">
        {/* Chat Header */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-emerald-950">
                  {t('LankaMate AI Travel Guide')}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {t('Culturally grounded assistant for Sri Lanka local and tourist travel')}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
            title={t('Clear Chat Conversation')}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Reset')}</span>
          </button>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 shrink-0 mr-1">{t('Quick asks:')}</span>
          {QUICK_ASK_ITEMS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAsk(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer shadow-2xs ${
                activeQuickAsk === item.label
                  ? 'bg-emerald-800 text-white font-bold border border-emerald-800 shadow-xs ring-2 ring-emerald-600/30'
                  : 'bg-white text-emerald-950 border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        {/* Message Stream Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 bg-white rounded-2xl shadow-xs border border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-4"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-emerald-800 text-white rounded-tr-xs'
                      : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-tl-xs'
                  }`}
                >
                  {/* Message Content formatted with line breaks and lists */}
                  <div className="space-y-2">
                    {(msg.verifiedPlaceSearch ? formatVerifiedPlaceSearch(msg.verifiedPlaceSearch, msg.responseLanguage || language, false) : msg.text).split('\n\n').map((paragraph, pIdx) => {
                      const lines = paragraph.split('\n');
                      return (
                        <div key={pIdx} className="space-y-1">
                          {lines.map((line, lIdx) => {
                            const trimmed = line.trim();
                            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
                            const isHeader = (trimmed.startsWith('**') && trimmed.endsWith('**')) || trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.') || trimmed.startsWith('5.') || trimmed.startsWith('6.');

                            return (
                              <p
                                key={lIdx}
                                className={`leading-relaxed ${
                                  isBullet ? 'pl-2 text-stone-700' : ''
                                } ${isHeader && !isUser ? 'font-semibold text-emerald-950 pt-0.5' : ''}`}
                              >
                                {line.split('**').map((chunk, cIdx) =>
                                  cIdx % 2 === 1 ? (
                                    <strong
                                      key={cIdx}
                                      className={
                                        isUser
                                          ? 'text-amber-300 font-bold'
                                          : 'text-emerald-950 font-bold'
                                      }
                                    >
                                      {chunk}
                                    </strong>
                                  ) : (
                                    chunk
                                  )
                                )}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                    {msg.verifiedPlaceSearch?.places.map((place, index) => (
                      <div key={`${place.latitude},${place.longitude}-${index}`} className="rounded-xl border border-stone-200 bg-white p-3 space-y-1">
                        <p className="font-semibold text-emerald-950">{place.name}</p>
                        <p>{place.distanceKm.toFixed(1)} km</p>
                        {place.address && <p>{place.address}</p>}
                        <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-emerald-800 font-semibold underline">
                          {(VERIFIED_PLACE_LABELS[msg.responseLanguage || language] || VERIFIED_PLACE_LABELS.en).maps}
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Timestamp & Copy */}
                  <div
                    className={`mt-3 pt-2 flex items-center justify-between border-t text-[10px] ${
                      isUser ? 'border-white/20 text-emerald-200' : 'border-stone-200 text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-stone-700 flex items-center gap-1 cursor-pointer"
                        title={t('Copy text')}
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">{t('Copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t('Copy')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>{t('LankaMate AI is consulting Sri Lanka travel knowledge...')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative z-20 bg-white rounded-2xl p-2 shadow-xs border border-stone-200 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20 transition-all cursor-text"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              id="ask-ai-input"
              name="askAiQuery"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isTranscribing ? t('Transcribing your speech...') : isListening ? t('Listening... speak your question') : t('Ask anything: blue train tickets, temple dress code, seafood spots, monsoons...')}
              autoComplete="off"
              className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent cursor-text select-text"
              aria-label={t('Ask AI travel question')}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleMicToggle();
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer shrink-0 select-none ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800'
              }`}
              title={isListening ? t('Stop listening') : t('Tap to speak')}
              aria-label={isListening ? t('Stop listening') : t('Tap to speak')}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <button
              id="ask-ai-submit-button"
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 select-none"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Ask AI')}</span>
            </button>
          </form>

          {micError && (
            <div className="px-2 pb-1 text-[11px] text-red-600 font-medium">
              {micError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
