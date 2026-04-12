import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Heart, Info, AlertCircle, Loader2, Mic, Paperclip,
  Pin, ChevronRight, ChevronLeft, MessageCircle, Sparkles
} from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import Button from '../components/Button';
import { chatAPI, profileAPI, memoryAPI } from '../services/api';

const Chat = () => {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [profile, setProfile]           = useState(null);
  const [memories, setMemories]         = useState([]);
  const [error, setError]               = useState('');
  const [panelOpen, setPanelOpen]       = useState(false);
  const [voiceFile, setVoiceFile]       = useState(null);
  const [initialLoad, setInitialLoad]   = useState(true);
  const scrollRef  = useRef(null);
  const fileRef    = useRef(null);
  const user       = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const load = async () => {
      try {
        const [histRes, profRes, memRes] = await Promise.all([
          chatAPI.getHistory(user._id),
          profileAPI.getProfile(user._id),
          memoryAPI.getMemories(user._id),
        ]);
        setMessages(histRes.data);
        setProfile(profRes.data);
        setMemories(memRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load chat data.');
      } finally {
        setInitialLoad(false);
      }
    };
    load();
  }, [user._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !voiceFile) || loading) return;

    const text = input.trim() || (voiceFile ? `🎤 [Voice note: ${voiceFile.name}]` : '');
    const userMessage = { role: 'user', content: text, createdAt: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setVoiceFile(null);
    setLoading(true);
    setError('');

    try {
      const { data } = await chatAPI.sendMessage(text);
      const aiMessage = { role: 'assistant', content: data.message, createdAt: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError('Message failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── No Profile State ── */
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
                {["Tell me about them", "I miss them today", "Share a memory"].map(s => (
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

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            </div>
          )}
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
          <form onSubmit={handleSend} className="flex items-end gap-3">
            {/* Voice upload */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-primary/10 border border-white/8 hover:border-primary/20 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0"
            >
              <Mic size={18} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setVoiceFile(e.target.files[0])}
            />

            <div className="flex-1 relative group">
              <textarea
                rows={1}
                placeholder="Share a memory or just say hello…"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                }}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200 resize-none placeholder:text-gray-600 text-sm"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
            </div>

            <button
              type="submit"
              disabled={(!input.trim() && !voiceFile) || loading}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo text-white flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 shrink-0"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
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
