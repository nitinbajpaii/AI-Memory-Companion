import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Heart, Info, AlertCircle, Loader2, Mic,
  Pin, ChevronRight, MessageCircle, Sparkles, Clock, WifiOff,
} from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import Button from '../components/Button';
import { chatAPI, profileAPI, memoryAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const DEBOUNCE_MS = 2000;

const ErrorCard = ({ errorType, message, onRetry, canRetry }) => {
  const isQuota = errorType === 'QUOTA_EXCEEDED';

  const quotaStyles = {
    borderColor: 'color-mix(in srgb, var(--color-accent-amber) 30%, transparent)',
    background: 'color-mix(in srgb, var(--color-accent-amber) 8%, transparent)',
    iconBg: 'color-mix(in srgb, var(--color-accent-amber) 15%, transparent)',
    iconColor: 'var(--color-accent-amber)',
    titleColor: 'var(--text-strong)',
    hintColor: 'var(--text-muted)',
  };
  const networkStyles = {
    borderColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
    background: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
    iconBg: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
    iconColor: 'var(--color-primary-dark)',
    titleColor: 'var(--text-strong)',
    hintColor: 'var(--text-muted)',
  };
  const cfg = isQuota ? quotaStyles : networkStyles;
  const Icon    = isQuota ? Clock : WifiOff;
  const title   = isQuota ? 'Daily Limit Reached' : 'Connection Issue';
  const hint    = isQuota
    ? 'Free AI quota resets at midnight. Come back tomorrow!'
    : 'This is a temporary issue. You can retry.';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex justify-center my-2"
    >
      <div
        className="rounded-2xl px-5 py-4 flex flex-col items-center gap-2.5 text-sm max-w-sm w-full text-center shadow-lg border"
        style={{ background: cfg.background, borderColor: cfg.borderColor }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold mb-0.5" style={{ color: cfg.titleColor }}>{title}</p>
          <p className="text-xs opacity-80" style={{ color: cfg.hintColor }}>{message}</p>
          <p className="text-xs opacity-50 mt-1" style={{ color: cfg.hintColor }}>{hint}</p>
        </div>
        {canRetry && !isQuota && (
          <Button variant="outline" size="sm" onClick={onRetry}
            className="mt-1 text-xs py-1.5 px-4 h-auto"
            style={{
              borderColor: cfg.borderColor,
              color: cfg.iconColor,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = cfg.iconBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Retry Sending
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const Chat = () => {
  const { reducedMotion } = useTheme();
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [profile, setProfile]           = useState(null);
  const [memories, setMemories]         = useState([]);
  const [errorInfo, setErrorInfo]       = useState(null);
  const [panelOpen, setPanelOpen]       = useState(false);
  const [initialLoad, setInitialLoad]   = useState(true);
  const [voiceType, setVoiceType]       = useState('female');
  const [isListening, setIsListening]   = useState(false);
  const [recognition, setRecognition]   = useState(null);

  const scrollRef   = useRef(null);
  const textareaRef = useRef(null);
  const isInFlight  = useRef(false);
  const lastSentAt  = useRef(0);
  const abortControllerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleVoiceMessageSend(transcript);
      };
      rec.onerror = (e) => {
        console.error('Speech recognition error', e);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [histRes, profRes, memRes] = await Promise.all([
          chatAPI.getHistory(user._id),
          profileAPI.getProfile(user._id),
          memoryAPI.getMemories(user._id),
        ]);
        if (!cancelled) {
          setMessages(histRes.data);
          setProfile(profRes.data);
          setMemories(memRes.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Chat] Failed to load chat data:', err);
          setErrorInfo({ errorType: 'LOAD_ERROR', message: 'Failed to load chat data. Please refresh.' });
        }
      } finally {
        if (!cancelled) setInitialLoad(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const playAudio = (base64Audio) => {
    try {
      console.log('[Chat] Playing audio, base64 length:', base64Audio?.length);
      if (!base64Audio) {
        console.warn('[Chat] No audio data to play');
        return;
      }
      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      audio.play().catch((err) => {
        console.error('[Chat] Audio playback failed:', err);
      });
    } catch (error) {
      console.error('[Chat] Failed to create/play audio:', error);
    }
  };

  const handleVoiceMessageSend = async (text) => {
    if (!text || loading || isInFlight.current) return;

    console.log('[Chat] Sending voice message to backend:', text.slice(0, 60));
    const now = Date.now();
    if (now - lastSentAt.current < DEBOUNCE_MS) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    isInFlight.current = true;
    lastSentAt.current = now;
    setErrorInfo(null);

    const newUserMsg = { role: 'user', content: `🎤 ${text}`, createdAt: new Date() };
    setMessages(prev => [...prev, newUserMsg]);

    setLoading(true);

    try {
      const { data } = await chatAPI.sendVoiceMessage(text, voiceType, { signal: abortControllerRef.current.signal });
      
      console.log('[Chat] Voice Response:', data);
      console.log('[Chat] Audio Exists:', !!data.audio);
      console.log('Audio received:', !!data.audio);

      if (data.success) {
        const aiMessage = data.message;
        setMessages(prev => [...prev, { role: 'assistant', content: aiMessage, createdAt: new Date() }]);
        if (data.audio) {
          playAudio(data.audio);
        } else {
          console.warn('[Chat] No audio in response — text-only fallback');
        }
      }
    } catch (err) {
      if (err.name === 'CanceledError') return;
      
      console.error('[Chat] Voice error:', err);
      const errorData = err.response?.data;
      setErrorInfo({
        errorType: errorData?.errorType || 'NETWORK_ERROR',
        message: errorData?.message || 'Connection weak. Please try again.'
      });
    } finally {
      setLoading(false);
      isInFlight.current = false;
    }
  };

  const handleSend = useCallback(async (e, retryText = null) => {
    if (e) e.preventDefault();
    const text = retryText ?? input.trim();
    if (!text || loading || isInFlight.current) return;

    console.log("Sending message to backend");
    const now = Date.now();
    if (!retryText && now - lastSentAt.current < DEBOUNCE_MS) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    isInFlight.current = true;
    lastSentAt.current = now;
    setErrorInfo(null);

    if (!retryText) {
      const newUserMsg = { role: 'user', content: text, createdAt: new Date() };
      setMessages(prev => [...prev, newUserMsg]);
      setInput('');
    }

    setLoading(true);

    try {
      const { data } = await chatAPI.sendTextMessage(text, { signal: abortControllerRef.current.signal });
      
      if (data.success) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last?.content === data.message) return prev;
          return [...prev, { role: 'assistant', content: data.message, createdAt: new Date() }];
        });
      }
    } catch (err) {
      if (err.name === 'CanceledError') return;
      
      console.error('[Chat] Error:', err);
      const errorData = err.response?.data;
      setErrorInfo({
        errorType: errorData?.errorType || 'NETWORK_ERROR',
        message: errorData?.message || 'Connection weak. Please try again.'
      });
    } finally {
      setLoading(false);
      isInFlight.current = false;
    }
  }, [input, loading]);

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      const text = lastUserMsg.content.replace('🎤 ', '');
      handleSend(null, text);
    }
  }, [messages, handleSend]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!initialLoad && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center gap-6">
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center border"
          style={{
            background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
          }}
        >
          <Heart size={44} style={{ color: 'var(--color-primary)' }} />
        </motion.div>
        <h2 className="text-3xl font-black" style={{ color: 'var(--text-strong)' }}>Create a Memorial First</h2>
        <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Set up a profile for your loved one so the AI can personalise your healing conversations.
        </p>
        <Link to="/profile">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            Create Profile <ChevronRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  const canSend      = input.trim() && !loading;
  const isQuotaError = errorInfo?.errorType === 'QUOTA_EXCEEDED';

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] gap-4 sm:gap-5 relative">

      <div
        className="flex flex-col flex-1 glass-card rounded-2xl sm:rounded-3xl overflow-hidden min-w-0 h-full border"
        style={{ borderColor: 'var(--border-soft)' }}
      >

        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b glass-dark shrink-0"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-base sm:text-lg"
              style={{
                background: 'var(--color-primary-dark)',
                boxShadow: '0 4px 14px color-mix(in srgb, var(--color-primary-dark) 35%, transparent)',
              }}
            >
              {profile?.name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs sm:text-sm truncate" style={{ color: 'var(--text-strong)' }}>{profile?.name || 'Loved One'}</p>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--color-accent-sage)' }}
                />
                <span
                  className="text-[9px] sm:text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-subtle)' }}
                >AI Companion</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-medium"
              style={{
                background: 'var(--surface-overlay)',
                borderColor: 'var(--border-soft)',
              }}
            >
              <button
                onClick={() => setVoiceType('female')}
                className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all"
                style={voiceType === 'female'
                  ? { background: 'var(--color-primary)', color: 'var(--user-bubble-text)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                  : { color: 'var(--text-muted)' }
                }
                onMouseEnter={(e) => { if (voiceType !== 'female') e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { if (voiceType !== 'female') e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                ♀<span className="hidden xs:inline ml-0.5">Female</span>
              </button>
              <button
                onClick={() => setVoiceType('male')}
                className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all"
                style={voiceType === 'male'
                  ? { background: 'var(--color-primary-dark)', color: 'var(--user-bubble-text)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                  : { color: 'var(--text-muted)' }
                }
                onMouseEnter={(e) => { if (voiceType !== 'male') e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { if (voiceType !== 'male') e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                ♂<span className="hidden xs:inline ml-0.5">Male</span>
              </button>
            </div>
            <button
              onClick={() => setPanelOpen(p => !p)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border transition-all text-[10px] sm:text-xs font-medium"
              style={{
                background: 'var(--surface-overlay)',
                borderColor: 'var(--border-soft)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; e.currentTarget.style.background = 'var(--surface-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--surface-overlay)'; }}
            >
              <Pin size={12} className="sm:w-[13px] sm:h-[13px]" />
              <span className="hidden sm:inline">Memories</span>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 scroll-smooth">

          {messages.length === 0 && !loading && !initialLoad && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center gap-4 py-20"
            >
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center border"
                style={{
                  background: 'var(--surface-overlay)',
                  borderColor: 'var(--border-soft)',
                }}
              >
                <MessageCircle size={28} style={{ color: 'var(--text-subtle)' }} />
              </div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>Start your journey</p>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Send a message or record a voice note — I'm always here to listen.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Tell me about them', 'I miss them today', 'Share a memory'].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-xl border text-xs transition-all"
                    style={{
                      background: 'var(--surface-overlay)',
                      borderColor: 'var(--border-soft)',
                      color: 'var(--text-muted)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 10%, transparent)';
                      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 20%, transparent)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-overlay)';
                      e.currentTarget.style.borderColor = 'var(--border-soft)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble
                key={i}
                message={msg.content}
                role={msg.role}
                timestamp={msg.createdAt}
              />
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-end"
            >
              <div
                className="w-8 h-8 rounded-2xl flex items-center justify-center ai-presence border"
                style={{
                  background: 'var(--ai-bubble-bg)',
                  borderColor: 'var(--ai-bubble-border)',
                  color: 'var(--color-primary)',
                }}
              >
                <Heart size={14} className="fill-current" />
              </div>
              <div
                className="glass-light border px-5 py-3.5 rounded-3xl rounded-bl-sm"
                style={{ borderColor: 'var(--ai-bubble-border)' }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                  <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                  <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {errorInfo && (
              <ErrorCard
                errorType={errorInfo.errorType}
                message={errorInfo.message}
                onRetry={handleRetry}
                canRetry={messages.length > 0 && messages[messages.length - 1]?.role === 'user'}
              />
            )}
          </AnimatePresence>
        </div>

        <div
          className="px-4 sm:px-6 py-3 sm:py-4 border-t glass-dark shrink-0"
          style={{ borderColor: 'var(--border-soft)' }}
        >

          {isQuotaError && (
            <div
              className="mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-center border"
              style={{
                background: 'color-mix(in srgb, var(--color-accent-amber) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-accent-amber) 20%, transparent)',
                color: 'var(--text-strong)',
                fontSize: '0.70rem',
              }}
            >
              ⚡ Daily AI limit reached — sending is disabled until quota resets.
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2 sm:gap-3">
            <motion.button
              type="button"
              onClick={toggleListening}
              disabled={loading || isQuotaError}
              whileHover={loading || reducedMotion ? {} : { scale: 1.06 }}
              whileTap={loading || reducedMotion ? {} : { scale: 0.92 }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0 border`}
              style={isListening
                ? { background: '#ef4444', color: '#fff', borderColor: '#ef4444' }
                : {
                    background: 'var(--surface-overlay)',
                    borderColor: 'var(--border-soft)',
                    color: 'var(--text-muted)',
                  }
              }
              onMouseEnter={(e) => {
                if (!isListening) {
                  e.currentTarget.style.background = 'var(--surface-soft)';
                  e.currentTarget.style.color = 'var(--text-strong)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isListening) {
                  e.currentTarget.style.background = 'var(--surface-overlay)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Mic size={16} className={isListening ? 'fill-current' : ''} />
            </motion.button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={
                  isQuotaError
                    ? 'Limit reached…'
                    : 'Say hello…'
                }
                value={input}
                disabled={loading || isQuotaError}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && !isQuotaError) handleSend(e);
                  }
                }}
                autoComplete="off"
                className="form-input w-full border rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-4 sm:px-5 focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--surface-overlay)',
                  borderColor: 'var(--border-soft)',
                  color: 'var(--text-strong)',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  outlineColor: 'var(--color-primary)',
                  focusRing: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent)';
                  e.target.style.background = 'var(--surface-elev)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-soft)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'var(--surface-overlay)';
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={!canSend || isQuotaError}
              whileHover={canSend && !reducedMotion ? { scale: 1.06 } : {}}
              whileTap={canSend && !reducedMotion ? { scale: 0.92 } : {}}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-indigo text-white flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </motion.button>
          </form>

          <p
            className="hidden sm:flex text-center text-[11px] mt-3 items-center justify-center gap-1.5"
            style={{ color: 'var(--text-subtle)' }}
          >
            <Heart size={10} style={{ color: 'var(--color-primary)' }} />
            Always here to listen · Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 20 }}
            animate={{ opacity: 1, width: window.innerWidth < 1024 ? '100%' : 280, x: 0 }}
            exit={{ opacity: 0, width: 0, x: 20 }}
            transition={{ type: reducedMotion ? 'tween' : 'spring', stiffness: 250, damping: 25, duration: reducedMotion ? 0.05 : undefined }}
            className="flex flex-col glass-card rounded-2xl sm:rounded-3xl border overflow-hidden shrink-0 absolute lg:relative z-40 right-0 top-0 bottom-0 h-full backdrop-blur-xl"
            style={{
              width: window.innerWidth < 1024 ? '100%' : 280,
              borderColor: 'var(--border-soft)',
              background: 'color-mix(in srgb, var(--surface-bg) 95%, transparent)',
            }}
          >
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                <Pin size={14} style={{ color: 'var(--color-primary)' }} /> Pinned Memories
              </h3>
              <button
                onClick={() => setPanelOpen(false)}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {memories.length === 0 ? (
                <div className="text-center py-10">
                  <Sparkles size="24" style={{ color: 'var(--text-subtle)' }} className="mx-auto mb-2" />
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No memories yet. Add some!</p>
                </div>
              ) : (
                memories.slice(0, 10).map((m, i) => (
                  <button
                    key={m._id || i}
                    onClick={() => { setInput(`Regarding "${m.memoryText.slice(0, 50)}..."`); if(window.innerWidth < 1024) setPanelOpen(false); }}
                    className="w-full text-left p-3 rounded-xl border transition-all group"
                    style={{
                      background: 'var(--surface-overlay)',
                      borderColor: 'var(--border-soft)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 8%, transparent)';
                      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 15%, transparent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-overlay)';
                      e.currentTarget.style.borderColor = 'var(--border-soft)';
                    }}
                  >
                    <p
                      className="text-xs line-clamp-3 transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >{m.memoryText}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold uppercase tracking-tighter"
                        style={{ color: 'var(--color-primary-dark)' }}
                      >{m.emotionTag}</span>
                      <ChevronRight
                        size={10}
                        className="group-hover:scale-110 transition-transform"
                        style={{ color: 'var(--text-subtle)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-subtle)'; }}
                      />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
