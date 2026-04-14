import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Bot } from 'lucide-react';

// ─── VoiceBubble ──────────────────────────────────────────────────────────────
// Renders an audio message bubble with play/pause + animated waveform.
// Props:
//   audioBase64  — base64-encoded MP3 string (from ElevenLabs)
//   text         — AI text reply (shown as caption)
//   isAI         — true → shows "AI Generated Voice" ethical badge
//   isUser       — true → right-aligned purple bubble
// ─────────────────────────────────────────────────────────────────────────────

const VoiceBubble = ({ audioBase64, text, isAI = false, isUser = false }) => {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [duration, setDuration]     = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Build blob URL from base64 once
  useEffect(() => {
    if (!audioBase64) return;
    const bytes  = atob(audioBase64);
    const arr    = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob   = new Blob([arr], { type: 'audio/mpeg' });
    const url    = URL.createObjectURL(blob);
    audioUrlRef.current = url;

    if (audioRef.current) {
      audioRef.current.src = url;
      // Auto-play AI voice reply
      if (isAI) {
        audioRef.current.play().catch(() => {}); // ignore autoplay block
      }
    }

    return () => URL.revokeObjectURL(url);
  }, [audioBase64, isAI]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isUser
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-primary/15 hover:bg-primary/25 border border-primary/25 text-primary'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Waveform bars + progress */}
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-[3px] h-5">
                {isPlaying
                  ? [1,2,3,4,5,6].map(i => <span key={i} className="audio-bar" />)
                  : [8,12,6,16,10,14].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`inline-block w-[3px] rounded-sm ${isUser ? 'bg-white/50' : 'bg-primary/40'}`}
                      />
                    ))
                }
              </div>

              {/* Progress bar */}
              <div className={`h-0.5 rounded-full w-full ${isUser ? 'bg-white/20' : 'bg-white/8'}`}>
                <div
                  className={`h-full rounded-full transition-all ${isUser ? 'bg-white/70' : 'bg-primary/70'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Duration */}
            <span className={`text-[11px] font-mono shrink-0 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <Volume2 size={13} className={isUser ? 'text-white/50' : 'text-gray-600'} />
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
