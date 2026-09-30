import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Globe,
  Radio,
  Send,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode, PageId } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, getLanguageOption } from '../i18n';
import { translateText } from '../services/translationService';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking,
} from '../services/voiceService';

interface VoiceTranslatorViewProps {
  onNavigatePage: (page: PageId) => void;
}

type TranslatorTab = 'voice' | 'conversation' | 'quick';

interface ConversationTurn {
  id: string;
  sender: 'tourist' | 'local';
  originalText: string;
  translatedText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  timestamp: string;
}

export const VoiceTranslatorView: React.FC<VoiceTranslatorViewProps> = ({
  onNavigatePage,
}) => {
  const { language, t, targetTranslateLang, setTargetTranslateLang } = useTranslation();

  const [activeTab, setActiveTab] = useState<TranslatorTab>('voice');

  // Source & Target languages
  const [sourceLang, setSourceLang] = useState<LanguageCode>(() => language || 'en');
  const [targetLang, setTargetLang] = useState<LanguageCode>(() => targetTranslateLang || 'si');

  // Sync if app language changes
  useEffect(() => {
    if (language) {
      setSourceLang(language);
    }
  }, [language]);

  // Voice Mode State
  const [inputText, setInputText] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversation Mode State
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([
    {
      id: 'welcome-1',
      sender: 'local',
      originalText: 'ආයුබෝවන්! ශ්‍රී ලංකාවට ඔබව සාදරයෙන් පිළිගනිමු. මම ඔබට උදව් කරන්නේ කෙසේද?',
      translatedText:
        'Ayubowan! Welcome to Sri Lanka. How may I help you with directions or travel today?',
      sourceLang: 'si',
      targetLang: 'en',
      timestamp: 'Just now',
    },
  ]);
  const [activeSpeaker, setActiveSpeaker] = useState<'tourist' | 'local'>('tourist');
  const [dialogInput, setDialogInput] = useState('');

  const recognizerRef = useRef<any>(null);

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  // Handle Voice Recording
  const toggleRecording = (langToListen: LanguageCode, onFinished?: (text: string) => void) => {
    // Cancel any previous speech before starting recording (Requirement 11)
    stopSpeaking();
    setIsPlayingAudio(false);

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setErrorMessage(null);

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage(t('translator.micNotSupported'));
      return;
    }

    const recognizer = createSpeechRecognizer(langToListen, {
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        if (activeTab === 'conversation') {
          setDialogInput(transcript);
        } else {
          setInputText(transcript);
        }

        if (isFinal) {
          setIsListening(false);
          if (onFinished) {
            onFinished(transcript);
          } else {
            handleTranslate(transcript, sourceLang, targetLang);
          }
        }
      },
      onError: (errCode) => {
        setIsListening(false);
        if (errCode === 'micPermissionDenied') {
          setErrorMessage(t('translator.micPermissionDenied'));
        } else if (errCode !== 'no-speech') {
          setErrorMessage(t('translator.micNotSupported'));
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      recognizer.start();
    }
  };

  // Perform translation
  const handleTranslate = async (
    textToTranslate: string,
    sLang: LanguageCode,
    tLang: LanguageCode
  ) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed) return;

    // Cancel any previous speech before starting a new translation (Requirement 11)
    stopSpeaking();
    setIsPlayingAudio(false);

    setIsTranslating(true);
    setErrorMessage(null);

    const res = await translateText(trimmed, sLang, tLang);
    setIsTranslating(false);

    if (res.error) {
      setErrorMessage(t('translator.translationUnavailable'));
      setTranslatedResult('');
    } else {
      setTranslatedResult(res.translatedText);
    }
  };

  // Play audio of translation
  const handlePlayVoice = async (text: string, langCode: LanguageCode) => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    if (!isSpeechSynthesisSupported()) {
      setErrorMessage(t('translator.ttsNotSupported'));
      return;
    }

    setIsPlayingAudio(true);
    const success = await speakText(
      text,
      langCode,
      () => {
        setIsPlayingAudio(false);
      },
      (err) => {
        setIsPlayingAudio(false);
        console.warn('Voice output playback error:', err);
      }
    );

    if (!success) {
      setIsPlayingAudio(false);
      setErrorMessage(t('translator.ttsNotSupported'));
    }
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    // Cancel any ongoing speech when switching languages (Requirement 11)
    stopSpeaking();
    setIsPlayingAudio(false);

    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setTargetTranslateLang(temp);
    setInputText(translatedResult);
    setTranslatedResult(inputText);
  };

  // Send conversation message
  const handleSendConversation = async () => {
    if (!dialogInput.trim()) return;

    // Cancel any previous speech before starting a new translation (Requirement 11)
    stopSpeaking();
    setIsPlayingAudio(false);

    const text = dialogInput.trim();
    setDialogInput('');

    const sLang = activeSpeaker === 'tourist' ? sourceLang : 'si';
    const tLang = activeSpeaker === 'tourist' ? 'si' : sourceLang;

    setIsTranslating(true);
    const res = await translateText(text, sLang, tLang);
    setIsTranslating(false);

    const newTurn: ConversationTurn = {
      id: `turn-${Date.now()}`,
      sender: activeSpeaker,
      originalText: text,
      translatedText: res.translatedText || text,
      sourceLang: sLang,
      targetLang: tLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversationTurns((prev) => [...prev, newTurn]);

    // Automatically speak the translated text for clear travel communication
    if (res.translatedText) {
      handlePlayVoice(res.translatedText, tLang);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleTravelPhrases = [
    { label: t('translator.hello'), text: 'Hello, Ayubowan! How are you?' },
    { label: t('translator.thankYou'), text: 'Thank you very much for your kind help.' },
    { label: t('translator.howMuch'), text: 'How much does this cost in Sri Lankan Rupees?' },
    { label: t('translator.whereTaxi'), text: 'Where can I find a metered taxi or tuk-tuk?' },
    { label: t('translator.spicy'), text: 'Is this curry spicy? Could you make it mild?' },
    { label: t('translator.help'), text: 'Can you please help me find the train station?' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-28 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                {t('translator.title')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('translator.title')}
              </h1>
              <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
                {t('translator.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'voice'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🎤 {t('translator.voiceTranslator')}
              </button>
              <button
                onClick={() => setActiveTab('conversation')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'conversation'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                👥 {t('translator.travelConversation')}
              </button>
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ⚡ {t('translator.quickTranslate')}
              </button>
            </div>
          </div>
        </div>

        {/* Error / Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-medium">
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-500 hover:text-amber-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Mode 1: Voice Translator */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            {/* Language Selection Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('translator.speakInYourLang')}
                </label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value as LanguageCode)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapLanguages}
                className="mt-5 p-2.5 rounded-xl border border-stone-200 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 transition-colors cursor-pointer"
                title={t('translator.swapLanguages')}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('translator.translateTo')}
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => {
                    const next = e.target.value as LanguageCode;
                    setTargetLang(next);
                    setTargetTranslateLang(next);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span className="flex items-center gap-1.5">
                  <span>{getLanguageOption(sourceLang).flag}</span>
                  <span>{getLanguageOption(sourceLang).nativeName}</span>
                </span>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText('');
                      setTranslatedResult('');
                    }}
                    className="text-stone-600 hover:text-stone-700 font-medium"
                  >
                    {t('common.clear')}
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('translator.typePlaceholder')}
                rows={3}
                className="w-full bg-stone-50 rounded-2xl p-4 text-stone-900 placeholder:text-stone-600 text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500 border border-stone-200 resize-none font-medium"
              />

              {/* Big Interactive Microphone / Speak Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => toggleRecording(sourceLang)}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base transition-all cursor-pointer shadow-md ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white active:scale-98'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Radio className="w-5 h-5 animate-spin" />
                      <span>{t('translator.listeningText')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>{t('translator.tapMicToSpeak')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleTranslate(inputText, sourceLang, targetLang)}
                  disabled={!inputText.trim() || isTranslating}
                  className="px-6 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs flex items-center gap-2"
                >
                  {isTranslating ? (
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{t('common.translate')}</span>
                </button>
              </div>
            </div>

            {/* Translation Output Card */}
            {(translatedResult || isTranslating) && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-6 shadow-sm border border-emerald-200/80 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getLanguageOption(targetLang).flag}</span>
                    <span className="uppercase tracking-wider">
                      {getLanguageOption(targetLang).nativeName} ({getLanguageOption(targetLang).name})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(translatedResult)}
                      className="p-2 rounded-xl bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title={t('common.copy')}
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handlePlayVoice(translatedResult, targetLang)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                          : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={isPlayingAudio ? t('translator.stopAudio') : t('translator.playAudio')}
                    >
                      {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isTranslating ? (
                  <div className="py-6 flex items-center justify-center gap-3 text-emerald-800 font-bold text-sm">
                    <Sparkles className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>Translating accurately with cultural nuances...</span>
                  </div>
                ) : (
                  <div className="text-xl sm:text-2xl font-black text-stone-900 leading-relaxed">
                    {translatedResult}
                  </div>
                )}
              </div>
            )}

            {/* Quick Travel Phrases Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                {t('translator.commonPhrases')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {sampleTravelPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(phrase.text);
                      handleTranslate(phrase.text, sourceLang, targetLang);
                    }}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200/80 hover:border-emerald-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-stone-800 group-hover:text-emerald-900">
                      {phrase.label}
                    </div>
                    <div className="text-xs text-stone-600 truncate mt-0.5">
                      {phrase.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Travel Conversation (Tourist ↔ Local Host / Driver) */}
        {activeTab === 'conversation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    {t('translator.travelConversation')}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Two-way live bridge between you ({getLanguageOption(sourceLang).name}) and your local host (Sinhala / Tamil)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Active Speaker:</span>
                  <div className="inline-flex bg-stone-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveSpeaker('tourist')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSpeaker === 'tourist'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {getLanguageOption(sourceLang).flag} {t('translator.touristRole')}
                    </button>
                    <button
                      onClick={() => setActiveSpeaker('local')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSpeaker === 'local'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      🇱🇰 {t('translator.localRole')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat turns list */}
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {conversationTurns.map((turn) => {
                  const isTourist = turn.sender === 'tourist';
                  return (
                    <div
                      key={turn.id}
                      className={`flex flex-col ${
                        isTourist ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[11px] font-bold text-stone-600">
                          {isTourist
                            ? `👤 ${t('translator.touristRole')} (${getLanguageOption(turn.sourceLang).nativeName})`
                            : `🇱🇰 ${t('translator.localRole')} (සිංහල / தமிழ்)`}
                        </span>
                        <span className="text-[10px] text-stone-600">{turn.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-3xl p-4 shadow-xs space-y-2 ${
                          isTourist
                            ? 'bg-emerald-800 text-white rounded-tr-xs'
                            : 'bg-stone-100 text-stone-900 rounded-tl-xs border border-stone-200'
                        }`}
                      >
                        <div className="text-xs opacity-80 italic">
                          "{turn.originalText}"
                        </div>
                        <div className="text-base font-bold flex items-center justify-between gap-3">
                          <span>{turn.translatedText}</span>
                          <button
                            onClick={() => handlePlayVoice(turn.translatedText, turn.targetLang)}
                            className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                              isTourist
                                ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                                : 'bg-white hover:bg-stone-200 text-stone-800 border border-stone-200'
                            }`}
                            title={t('common.play')}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input & Voice Controls */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      toggleRecording(
                        activeSpeaker === 'tourist' ? sourceLang : 'si',
                        (recognized) => {
                          setDialogInput(recognized);
                        }
                      )
                    }
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : activeSpeaker === 'tourist'
                        ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                    title={t('translator.tapMicToSpeak')}
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={dialogInput}
                    onChange={(e) => setDialogInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendConversation();
                    }}
                    placeholder={
                      activeSpeaker === 'tourist'
                        ? `Speak or type as Tourist (${getLanguageOption(sourceLang).nativeName})...`
                        : `Speak or type as Local Host (සිංහල / தமிழ்)...`
                    }
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    onClick={handleSendConversation}
                    disabled={!dialogInput.trim() || isTranslating}
                    className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    {isTranslating ? (
                      <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Quick Translation Box */}
        {activeTab === 'quick' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
            <h3 className="font-black text-stone-900 text-base">
              {t('translator.quickTranslate')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                  <span>From: {getLanguageOption(sourceLang).nativeName}</span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                  placeholder="Enter text to instantly translate..."
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                  <span>To: {getLanguageOption(targetLang).nativeName}</span>
                  {translatedResult && (
                    <button
                      onClick={() => handlePlayVoice(translatedResult, targetLang)}
                      className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Listen
                    </button>
                  )}
                </div>
                <div className="w-full bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 text-sm font-bold text-stone-900 min-h-[105px]">
                  {translatedResult || <span className="text-stone-600 font-normal italic">Translation will appear here...</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleTranslate(inputText, sourceLang, targetLang)}
                disabled={!inputText.trim() || isTranslating}
                className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-all disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {isTranslating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t('common.translate')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
