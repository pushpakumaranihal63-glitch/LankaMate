import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { PageId } from '../types';
import { QUICK_ASK_ITEMS, QuickAskItem, getQuickAskAnswer } from '../data/quickAskAnswers';
import { useTranslation } from '../i18n/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIAssistantViewProps {
  onNavigatePage: (page: PageId) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigatePage }) => {
  const { language, t, currentLangOption } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: t(`**Ayubowan! 🙏 Welcome to LankaMate AI.**\n\nI am your culturally grounded Sri Lankan travel companion. Ask me anything or tap any topic below:\n\n• **Blue Train Tickets:** Kandy to Ella booking guidance & unreserved seats.\n• **Temple Dress Code:** Sacred site etiquette, shoulders/knees rules & customs.\n• **Best Street Food:** Crispy hoppers, hot kottu, isso wade & food safety.\n• **Yala Safari Guide:** Leopard tracking tips, 4x4 jeeps & park safety.\n• **Weather & Seasons:** Dual monsoon patterns & best regional travel times.\n• **7-Day Itinerary:** Balanced Colombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle route.\n\nAsk me in any language (English, Sinhala, Tamil, Korean, Japanese, Chinese, German, French, Spanish, Russian, Arabic, Hindi, Italian) and I will gladly guide you!`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [activeQuickAsk, setActiveQuickAsk] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle Quick Ask click: immediately display selected question and comprehensive answer in the visible response area
  const handleQuickAsk = (item: QuickAskItem) => {
    setActiveQuickAsk(item.label);
    setLoading(false);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: item.prompt,
      timestamp: timeNow,
    };

    const assistantMessage: Message = {
      id: `assistant-${Date.now() + 1}`,
      sender: 'assistant',
      text: item.answer,
      timestamp: timeNow,
    };

    // Replace or set visible messages with the selected Quick Ask
    setMessages([userMessage, assistantMessage]);

    // Scroll internal response container to top so the answer is immediately visible at the start, without scrolling the page
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

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || getQuickAskAnswer(query);

      const assistantMessage: Message = {
        id: `assistant-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Backend assistant error, falling back to local database', err);
      const fallbackAnswer = getQuickAskAnswer(query);
      const assistantMessage: Message = {
        id: `assistant-${Date.now() + 1}`,
        sender: 'assistant',
        text: fallbackAnswer,
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
    setActiveQuickAsk(null);
    setLoading(false);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t(`**Ayubowan! 🙏 Welcome back to LankaMate AI.**\n\nHow can I help plan your Sri Lanka travels today? Tap any Quick Ask topic above or type a custom question below.`),
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
              {item.label}
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
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
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
              placeholder={t('Ask anything: blue train tickets, temple dress code, seafood spots, monsoons...')}
              autoComplete="off"
              className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent cursor-text select-text"
              aria-label={t('Ask AI travel question')}
            />

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
        </div>
      </div>
    </div>
  );
};
