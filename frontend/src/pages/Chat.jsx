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

// ─────────────────────────────────────────────────────────────────────────────
// ErrorCard — distinct visuals for quota vs temporary errors
// ─────────────────────────────────────────────────────────────────────────────
const ErrorCard = ({ errorType, message, onRetry, canRetry }) => {
  const isQuota = errorType === 'QUOTA_EXCEEDED';

  const config = isQuota
    ? {
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/8',
        iconBg: 'bg-orange-500/15',
        iconColor: 'text-orange-400',
        textColor: 'text-orange-200',
        icon: <Clock size={20} />,
        title: 'Daily Limit Reached',
        hint: 'Free AI quota resets at midnight (IST). Come back tomorrow!',
      }
    : {
        border: 'border-red-500/25',
        bg: 'bg-red-500/6',
        iconBg: 'bg-red-500/15',
        iconColor: 'text-red-400',
        textColor: 'text-red-300',
        icon: <WifiOff size={20} />,
        title: 'Connection Issue',
        hint: 'This is a temporary issue. You can retry sending.',
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex justify-center my-2"
    >
      <div
        className={`${config.bg} ${config.border} border rounded-2xl px-5 py-4 flex flex-col items-center gap-2.5 text-sm max-w-sm w-full text-center shadow-lg`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
          {config.icon}
        </div>
        <div>
          <p className={`font-semibold ${config.textColor} mb-0.5`}>{config.title}</p>
          <p className={`text-xs ${config.textColor} opacity-80`}>{message}</p>
          <p className={`text-xs ${config.textColor} opacity-50 mt-1`}>{config.hint}</p>
        </div>
        {canRetry && !isQuota && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-1 text-xs py-1.5 px-4 h-auto border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300"
          >
            Retry Sending
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Chat page
// ─────────────────────────────────────────────────────────────────────────────
const DEBOUNCE_MS = 2000; // 2-second debounce

const Chat = () => {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [profile, setProfile]         = useState(null);
  const [memories, setMemories]       = useState([]);
  const [errorInfo, setErrorInfo]     = useState(null); // { errorType, message }
  const [panelOpen, setPanelOpen]     = useState(false);
  const [voiceFile, setVoiceFile]     = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const scrollRef   = useRef(null);
  const fileRef     = useRef(null);
  const textareaRef = useRef(null);

  /**
   * isInFlight ref — TRUE while a Gemini request is in-progress.
   * Using a ref (not state) means it is synchronously updated and is
   * immune to React StrictMode's double-invocation of render functions.
   * Even if handleSend is called twice in the same tick, the second call
   * will see isInFlight.current === true and bail out immediately.
   */
  const isInFlight = useRef(false);

  /**
   * lastSentAt ref — timestamp of the last successful send.
   * Prevents rapid double-clicks bypassing the loading state.
   */
  const lastSentAt = useRef(0);

  const user = JSON.parse(localStorage.getItem('user'));

  // ── Load chat history, profile, memories on mount ─────────────────────
  useEffect(() => {
    let cancelled = false; // guard against StrictMode double-mount cleanup
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
  }, [user._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-scroll to bottom ──────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // ── Core send handler ──────────────────────────────────────────────────
  const handleSend = useCallback(async (e, retryText = null) => {
    if (e) e.preventDefault();

    const text = retryText ?? (input.trim() || (voiceFile ? `🎤 [Voice note: ${voiceFile.name}]` : ''));
    if (!text) return;

    // ── Guard 1: in-flight ref lock (synchronous — StrictMode safe) ───────
    if (isInFlight.current) {
      console.warn('[Chat] Request already in-flight — ignoring duplicate call.');
      return;
    }

    // ── Guard 2: 2-second debounce ─────────────────────────────────────────
    const now = Date.now();
    if (!retryText && now - lastSentAt.current < DEBOUNCE_MS) {
      console.warn('[Chat] Debounce active — ignoring rapid send.');
      return;
    }

    // ── Acquire lock ───────────────────────────────────────────────────────
    isInFlight.current = true;
    lastSentAt.current = now;

    // Optimistically add user message (only on fresh send, not retry)
    if (!retryText) {
      setMessages(prev => [...prev, { role: 'user', content: text, createdAt: new Date() }]);
      setInput('');
      setVoiceFile(null);
    }

    setLoading(true);
    setErrorInfo(null);

    // ── Audit log — verify exactly one request per message ─────────────────
    console.log("Sending message to backend");
    console.log('[Chat] Message snippet:', text.slice(0, 80));

    try {
      const { data } = await chatAPI.sendMessage(text);

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message, createdAt: new Date() }]);
      } else {
        // Backend returned a structured error (rare; usually thrown by axios)
        setErrorInfo({ errorType: data.errorType || 'UNKNOWN_ERROR', message: data.message });
      }
    } catch (err) {
      const errorType = err.response?.data?.errorType || 'UNKNOWN_ERROR';
      const message   = err.response?.data?.message   || err.message || 'Something went wrong. Please try again.';
      console.error('[Chat] API error:', errorType, message);
      setErrorInfo({ errorType, message });
    } finally {
      setLoading(false);
      isInFlight.current = false; // ── Release lock ────────────────────────
    }
  }, [input, voiceFile]);

  // ── Retry last user message ────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) handleSend(null, lastUserMsg.content);
  }, [messages, handleSend]);

  // ── No profile state ───────────────────────────────────────────────────
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

  const canSend = (input.trim() || voiceFile) && !loading;
  const isQuotaError = errorInfo?.errorType === 'QUOTA_EXCEEDED';

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-5 relative">

      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 glass-card rounded-3xl border border-white/6 overflow-hidden min-w-0">

        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 glass-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/25">
              {profile?.name?.[0] || '?'}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{profile?.name || 'Loved One'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">AI Companion</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPanelOpen(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 text-gray-400 hover:text-white transition-all text-xs font-medium"
            >
              <Pin size={13} />
              <span className="hidden sm:inline">Memories</span>
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scroll-smooth">

          {/* Empty state */}
          {messages.length === 0 && !loading && !initialLoad && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center gap-4 py-20"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/4 border border-white/8 flex items-center justify-center">
                <MessageCircle size={28} className="text-gray-600" />
              </div>
              <p className="text-lg font-bold text-white">Start your journey</p>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Send a message to begin reminiscing. I'm here to listen, always.
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

          {/* Message bubbles */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.content} role={msg.role} timestamp={msg.createdAt} />
            ))}
          </AnimatePresence>

          {/* Typing animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
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

          {/* Error card */}
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

        {/* Voice file preview */}
        {voiceFile && (
          <div className="px-6 py-2 border-t border-white/6 bg-primary/5 flex items-center gap-3">
            <Mic size={16} className="text-primary" />
            <span className="text-sm text-gray-300 flex-1 truncate">{voiceFile.name}</span>
            <button onClick={() => setVoiceFile(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-white/6 glass-dark shrink-0">

          {/* Quota banner */}
          {isQuotaError && (
            <div className="mb-3 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 text-center">
              ⚡ Daily AI limit reached — sending is disabled until quota resets.
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="flex items-end gap-3"
          >
            {/* Voice upload */}
            <button
              type="button"
              disabled={loading || isQuotaError}
              onClick={() => fileRef.current?.click()}
              className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-primary/10 border border-white/8 hover:border-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mic size={18} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={e => setVoiceFile(e.target.files[0])}
            />

            <div className="flex-1 relative group">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={
                  isQuotaError
                    ? 'Daily limit reached — try again tomorrow…'
                    : 'Share a memory or just say hello…'
                }
                value={input}
                disabled={loading || isQuotaError}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={e => {
                  // Enter sends; Shift+Enter inserts newline
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && !isQuotaError) handleSend(e);
                  }
                }}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200 resize-none placeholder:text-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!canSend || isQuotaError}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo text-white flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 shrink-0"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <Send size={18} />
              }
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-700 mt-3 flex items-center justify-center gap-1.5">
            <Heart size={10} className="text-primary" />
            Always here to listen · Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* ── Pinned Memories Panel ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 20 }}
            animate={{ opacity: 1, width: 280, x: 0 }}
            exit={{ opacity: 0, width: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="hidden lg:flex flex-col glass-card rounded-3xl border border-white/6 overflow-hidden shrink-0"
            style={{ width: 280 }}
          >
            <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pin size={14} className="text-primary" /> Pinned Memories
              </h3>
              <button onClick={() => setPanelOpen(false)} className="text-gray-500 hover:text-white">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {memories.length === 0 ? (
                <div className="text-center py-10">
                  <Sparkles size={24} className="text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No memories yet. Add some!</p>
                </div>
              ) : (
                memories.slice(0, 10).map((m, i) => (
                  <button
                    key={m._id || i}
                    onClick={() => setInput(`Regarding "${m.memoryText.slice(0, 50)}..."`)}
                    className="w-full text-left p-3 rounded-xl bg-white/3 hover:bg-primary/8 border border-white/4 hover:border-primary/15 transition-all group"
                  >
                    <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-200 leading-relaxed">{m.memoryText}</p>
                    <span className="text-[10px] text-primary/60 mt-1 inline-block font-medium uppercase tracking-wide">{m.emotionTag}</span>
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
