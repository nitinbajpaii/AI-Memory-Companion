import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Bot, Loader2, AlertCircle } from 'lucide-react';
import { voiceAPI } from '../services/api';

// ─── AUDIO CACHE ───────────────────────────────────────────────────────────
const audioCache = new Map();

const VoiceBubble = ({ audioBase64: initialAudio, text, isAI = false, isUser = false, voiceType = 'female' }) => {
  const [audioBase64, setAudioBase64] = useState(initialAudio);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Sync audio ref with state
  useEffect(() => {
    if (!audioBase64) return;
    
    // Check cache first
    let url;
    if (audioCache.has(text)) {
      url = audioCache.get(text);
    } else {
      const bytes = atob(audioBase64);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: 'audio/mpeg' });
      url = URL.createObjectURL(blob);
      audioCache.set(text, url);
    }

    audioUrlRef.current = url;
    if (audioRef.current) {
      audioRef.current.src = url;
    }

    return () => {
      // Don't revoke if we're caching
    };
  }, [audioBase64, text]);

  const togglePlay = async () => {
    if (loading) return;

    // ── VOICE ON DEMAND ──
    if (!audioBase64 && !audioCache.has(text)) {
      setLoading(true);
      setError(null);
      try {
        const { data } = await voiceAPI.getTTS(text, voiceType);
        if (data.success && data.audio) {
          setAudioBase64(data.audio);
          // Audio will play automatically via useEffect + ref
          setTimeout(() => audioRef.current?.play(), 100);
        } else {
          throw new Error('TTS_FAILED');
        }
      } catch (err) {
        console.error('[VoiceBubble] TTS Error:', err);
        setError('Voice failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal play/pause
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const fmt = (s) => {
    const sec = Math.floor(s);
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md ${
        isUser
          ? 'bg-gradient-to-br from-primary to-indigo text-white'
          : 'bg-white/8 border border-white/10 text-purple-400'
      }`}>
        {isUser ? 'You' : <Bot size={14} />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Audio bubble card */}
        <div className={`relative rounded-3xl overflow-hidden shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-primary to-indigo rounded-br-md shadow-primary/20'
            : 'glass-light border border-white/8 rounded-bl-md'
        }`}>
          <div className="px-4 py-3 flex items-center gap-3 min-w-[200px]">

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            />

            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              disabled={loading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isUser
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-primary/15 hover:bg-primary/25 border border-primary/25 text-primary'
              } disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Waveform / Progress area */}
            <div className="flex-1 min-w-[120px]">
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-[10px] font-bold tracking-wider uppercase ${isUser ? 'text-white/60' : 'text-gray-500'}`}>
                  {error ? 'Error' : isPlaying ? 'Playing' : loading ? 'Generating...' : 'Voice Note'}
                </span>
                <span className={`text-[10px] font-mono ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
              </div>
              
              <div className={`h-1.5 w-full rounded-full overflow-hidden ${isUser ? 'bg-white/10' : 'bg-black/5'}`}>
                <motion.div
                  className={`h-full ${isUser ? 'bg-white' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              </div>
            </div>

            {/* Error Icon */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500"
                >
                  <AlertCircle size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI text caption */}
        {text && (
          <div className={`text-sm leading-relaxed px-4 py-3 rounded-3xl max-w-sm ${
            isUser
              ? 'bg-gradient-to-br from-primary/80 to-indigo/80 text-white rounded-br-md'
              : 'glass-light border border-white/8 text-gray-200 rounded-bl-md'
          }`}>
            {text}
          </div>
        )}

        {/* Ethical badge — AI bubbles only */}
        {isAI && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/3 border border-white/6">
            <Bot size={10} className="text-primary/60" />
            <span className="text-[10px] text-gray-600 font-medium">AI Generated Voice</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceBubble;
