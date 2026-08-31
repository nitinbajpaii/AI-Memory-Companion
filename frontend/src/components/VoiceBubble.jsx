import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Bot, Loader2, AlertCircle } from 'lucide-react';
import { voiceAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const audioCache = new Map();

const VoiceBubble = ({ audioBase64: initialAudio, text, isAI = false, isUser = false, voiceType = 'female' }) => {
  const [audioBase64, setAudioBase64] = useState(initialAudio);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { reducedMotion } = useTheme();

  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  useEffect(() => {
    if (!audioBase64) return;

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
  }, [audioBase64, text]);

  const togglePlay = async () => {
    if (loading) return;

    if (!audioBase64 && !audioCache.has(text)) {
      setLoading(true);
      setError(null);
      try {
        const { data } = await voiceAPI.getTTS(text, voiceType);
        if (data.success && data.audio) {
          setAudioBase64(data.audio);
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
  const bubbleMotion = reducedMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 260, damping: 22 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={bubbleMotion}
      className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md`}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-indigo))',
                color: '#ffffff',
              }
            : {
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                border: '1px solid var(--border-soft)',
                color: 'var(--color-primary)',
              }
        }
      >
        {isUser ? 'You' : <Bot size={14} />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Audio bubble card */}
        <div
          className={`relative rounded-3xl overflow-hidden shadow-lg ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-indigo))',
                  boxShadow: '0 8px 28px color-mix(in srgb, var(--color-primary) 20%, transparent)',
                }
              : {
                  background: 'var(--ai-bubble-bg)',
                  border: '1px solid var(--ai-bubble-border)',
                }
          }
        >
          <div className="px-4 py-3 flex items-center gap-3 min-w-[200px]">

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
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-50`}
              style={
                isUser
                  ? {
                      background: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }
                  : {
                      background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
                      color: 'var(--color-primary)',
                    }
              }
              onMouseEnter={(e) => {
                if (isUser) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                } else {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 25%, transparent)';
                }
              }}
              onMouseLeave={(e) => {
                if (isUser) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                } else {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 15%, transparent)';
                }
              }}
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
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase`}
                  style={{ color: isUser ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}
                >
                  {error ? 'Error' : isPlaying ? 'Playing' : loading ? 'Generating...' : 'Voice Note'}
                </span>
                <span
                  className={`text-[10px] font-mono`}
                  style={{ color: isUser ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}
                >
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
              </div>

              <div
                className={`h-1.5 w-full rounded-full overflow-hidden`}
                style={{ background: isUser ? 'rgba(255,255,255,0.1)' : 'var(--border-soft)' }}
              >
                <motion.div
                  className="h-full"
                  style={{ background: isUser ? '#ffffff' : 'var(--color-primary)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={reducedMotion ? { duration: 0.01 } : { type: 'spring', bounce: 0, duration: 0.3 }}
                />
              </div>
            </div>

            {/* Error Icon */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ color: '#ef4444' }}
                >
                  <AlertCircle size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI text caption */}
        {text && (
          <div
            className={`text-sm leading-relaxed px-4 py-3 rounded-3xl max-w-sm ${
              isUser ? 'rounded-br-md' : 'rounded-bl-md'
            }`}
            style={
              isUser
                ? {
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 80%, transparent), color-mix(in srgb, var(--color-indigo) 80%, transparent))',
                    color: '#ffffff',
                  }
                : {
                    background: 'var(--ai-bubble-bg)',
                    border: '1px solid var(--ai-bubble-border)',
                    color: 'var(--text-strong)',
                    fontFamily: "'Fraunces', Georgia, serif",
                  }
            }
          >
            {text}
          </div>
        )}

        {/* Ethical badge — AI bubbles only */}
        {isAI && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
            style={{
              background: 'var(--surface-overlay)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <Bot
              size={10}
              style={{ color: 'color-mix(in srgb, var(--color-primary) 60%, transparent)' }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              AI Generated Voice
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceBubble;
