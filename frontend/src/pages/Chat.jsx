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

const DEBOUNCE_MS = 2000;

const ErrorCard = ({ errorType, message, onRetry, canRetry }) => {
  const isQuota = errorType === 'QUOTA_EXCEEDED';
  const config = isQuota
    ? {
        border: 'border-orange-500/30', bg: 'bg-orange-500/8', iconBg: 'bg-orange-500/15',
        iconColor: 'text-orange-400', textColor: 'text-orange-200', icon: <Clock size={20} />,
        title: 'Daily Limit Reached',
        hint: 'Free AI quota resets at midnight. Come back tomorrow!',
      }
    : {
        border: 'border-red-500/25', bg: 'bg-red-500/6', iconBg: 'bg-red-500/15',
        iconColor: 'text-red-400', textColor: 'text-red-300', icon: <WifiOff size={20} />,
        title: 'Connection Issue',
        hint: 'This is a temporary issue. You can retry.',
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex justify-center my-2"
    >
      <div className={`${config.bg} ${config.border} border rounded-2xl px-5 py-4 flex flex-col items-center gap-2.5 text-sm max-w-sm w-full text-center shadow-lg`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
          {config.icon}
        </div>
        <div>
          <p className={`font-semibold ${config.textColor} mb-0.5`}>{config.title}</p>
          <p className={`text-xs ${config.textColor} opacity-80`}>{message}</p>
          <p className={`text-xs ${config.textColor} opacity-50 mt-1`}>{config.hint}</p>
        </div>
        {canRetry && !isQuota && (
          <Button variant="outline" size="sm" onClick={onRetry}
            className="mt-1 text-xs py-1.5 px-4 h-auto border-red-500/30 hover:bg-red-500/10 text-red-400">
            Retry Sending
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const Chat = () => {
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
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Heart size={44} className="text-primary" />
        </motion.div>
        <h2 className="text-3xl font-black text-white">Create a Memorial First</h2>
        <p className="text-gray-500 leading-relaxed">
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

      <div className="flex flex-col flex-1 glass-card rounded-2xl sm:rounded-3xl border border-white/6 overflow-hidden min-w-0 h-full">

        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/6 glass-dark shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg shadow-primary/25">
              {profile?.name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-xs sm:text-sm truncate">{profile?.name || 'Loved One'}</p>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium uppercase tracking-wider">AI Companion</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/4 border border-white/6 text-[10px] sm:text-xs font-medium">
              <button
                onClick={() => setVoiceType('female')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all ${voiceType === 'female' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                ♀<span className="hidden xs:inline ml-0.5">Female</span>
              </button>
              <button
                onClick={() => setVoiceType('male')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all ${voiceType === 'male' ? 'bg-indigo text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                ♂<span className="hidden xs:inline ml-0.5">Male</span>
              </button>
            </div>
            <button
              onClick={() => setPanelOpen(p => !p)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 text-gray-400 hover:text-white transition-all text-[10px] sm:text-xs font-medium"
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
              <div className="w-16 h-16 rounded-3xl bg-white/4 border border-white/8 flex items-center justify-center">
                <MessageCircle size={28} className="text-gray-600" />
              </div>
              <p className="text-lg font-bold text-white">Start your journey</p>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Send a message or record a voice note — I'm always here to listen.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Tell me about them', 'I miss them today', 'Share a memory'].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 hover:bg-primary/10 hover:border-primary/20 text-xs text-gray-400 hover:text-primary transition-all"
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
              <div className="w-8 h-8 rounded-2xl bg-white/6 border border-white/8 flex items-center justify-center">
                <Heart size={14} className="text-purple-400 fill-current" />
              </div>
              <div className="glass-light border border-white/8 px-5 py-3.5 rounded-3xl rounded-bl-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
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

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/6 glass-dark shrink-0">

          {isQuotaError && (
            <div className="mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] sm:text-xs text-orange-300 text-center">
              ⚡ Daily AI limit reached — sending is disabled until quota resets.
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2 sm:gap-3">
            <motion.button
              type="button"
              onClick={toggleListening}
              disabled={loading || isQuotaError}
              whileHover={{ scale: !loading ? 1.06 : 1 }}
              whileTap={{ scale: !loading ? 0.92 : 1 }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/8 hover:text-white'
              }`}
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
                className="w-full bg-white/5 border border-white/8 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-4 sm:px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200 resize-none placeholder:text-gray-600 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={!canSend || isQuotaError}
              whileHover={{ scale: canSend ? 1.06 : 1 }}
              whileTap={{ scale: canSend ? 0.92 : 1 }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-indigo text-white flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </motion.button>
          </form>

          <p className="hidden sm:flex text-center text-[11px] text-gray-700 mt-3 items-center justify-center gap-1.5">
            <Heart size={10} className="text-primary" />
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
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="flex flex-col glass-card rounded-2xl sm:rounded-3xl border border-white/6 overflow-hidden shrink-0 absolute lg:relative z-40 right-0 top-0 bottom-0 h-full bg-dark/95 backdrop-blur-xl"
            style={{ width: window.innerWidth < 1024 ? '100%' : 280 }}
          >
            <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pin size={14} className="text-primary" /> Pinned Memories
              </h3>
              <button onClick={() => setPanelOpen(false)} className="text-gray-500 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {memories.length === 0 ? (
                <div className="text-center py-10">
                  <Sparkles size="24" className="text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No memories yet. Add some!</p>
                </div>
              ) : (
                memories.slice(0, 10).map((m, i) => (
                  <button
                    key={m._id || i}
                    onClick={() => { setInput(`Regarding "${m.memoryText.slice(0, 50)}..."`); if(window.innerWidth < 1024) setPanelOpen(false); }}
                    className="w-full text-left p-3 rounded-xl bg-white/3 hover:bg-primary/8 border border-white/4 hover:border-primary/15 transition-all group"
                  >
                    <p className="text-xs text-gray-400 group-hover:text-white line-clamp-3 transition-colors">{m.memoryText}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-primary/60 font-bold uppercase tracking-tighter">{m.emotionTag}</span>
                      <ChevronRight size={10} className="text-gray-700 group-hover:text-primary transition-colors" />
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
