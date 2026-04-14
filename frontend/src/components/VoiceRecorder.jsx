import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Send, Trash2, Loader2, Play, Pause, Upload } from 'lucide-react';
import { voiceAPI } from '../services/api';

// ─── VoiceRecorder ────────────────────────────────────────────────────────────
// States:  idle → recording → previewing → processing → done
// Props:
//   onVoiceResult({ transcript, text, audio, voiceType }) — called when done
//   onError(message) — called on failure
//   disabled  — block interaction while chat is loading
//   voiceType — 'male' | 'female'
// ─────────────────────────────────────────────────────────────────────────────

const VoiceRecorder = ({ onVoiceResult, onError, disabled = false, voiceType = 'female' }) => {
  const [state, setState]         = useState('idle');       // idle|recording|previewing|processing
  const [duration, setDuration]   = useState(0);
  const [audioUrl, setAudioUrl]   = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const blobRef          = useRef(null);
  const timerRef         = useRef(null);
  const audioRef         = useRef(null);
  const streamRef        = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  }, [audioUrl]);

  // ── Start recording ──────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Detect best supported mimeType
      const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/aac',
        'audio/wav'
      ];
      const mimeType = types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('previewing');
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      };

      recorder.start(200); // collect chunks every 200ms
      setState('recording');
      setDuration(0);
      
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      onError?.('Microphone access denied. Please allow microphone permissions.');
    }
  };

  // ── Stop recording ───────────────────────────────────────────────────────
  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // ── Discard ──────────────────────────────────────────────────────────────
  const discard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    blobRef.current = null;
    setAudioUrl(null);
    setIsPlaying(false);
    setDuration(0);
    setState('idle');
  };

  // ── Preview play/pause ───────────────────────────────────────────────────
  const togglePreview = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // ── Handle file upload ───────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset recorder if active
    stopRecording();
    
    // Validate format - expanded for mobile
    const validExtensions = /\.(mp3|wav|m4a|webm|ogg|aac|mp4|3gp|3gpp)$/i;
    const validMimePrefix = /^(audio\/|video\/webm|video\/mp4)/;

    if (!validMimePrefix.test(file.type) && !file.name.match(validExtensions)) {
      onError?.('Unsupported audio format. Please upload MP3, WAV, M4A, or WebM.');
      return;
    }

    blobRef.current = file;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setState('previewing');
    setDuration(0); // Will update once audio loads metadata
    
    // Clear input so same file can be selected again if needed
    e.target.value = '';
  };

  // ── Send voice note ──────────────────────────────────────────────────────
  const sendVoice = async () => {
    if (!blobRef.current) return;
    setState('processing');

    try {
      const formData = new FormData();
      
      // Determine filename and extension
      let filename = 'voice_message.webm';
      if (blobRef.current instanceof File) {
        filename = blobRef.current.name;
      } else {
        const ext = blobRef.current.type.split('/')[1]?.split(';')[0] || 'webm';
        filename = `recording_${Date.now()}.${ext}`;
      }

      formData.append('audio', blobRef.current, filename);
      formData.append('voiceType', voiceType);

      const { data } = await voiceAPI.transcribe(formData);

      if (data.success) {
        onVoiceResult?.(data);
        discard(); // reset recorder
      } else {
        onError?.(data.message || 'Voice processing failed.');
        setState('previewing');
      }
    } catch (err) {
      console.error('[VoiceRecorder] Error sending voice:', err);
      const msg = err.response?.data?.message || 'Voice processing failed. Please try again.';
      onError?.(msg);
      setState('previewing');
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── IDLE: just the mic button + upload button ────────────────────────────
  if (state === 'idle') {
    return (
      <div className="flex items-center gap-2">
        {/* Upload Audio */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => document.getElementById('voice-upload-input')?.click()}
          className={`w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all shrink-0 cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
          title="Upload audio file"
        >
          <Upload size={16} />
          <input
            id="voice-upload-input"
            type="file"
            accept="audio/*,video/webm,video/mp4"
            className="hidden"
            onChange={handleFileUpload}
            disabled={disabled}
          />
        </button>
        
        {/* Record Audio */}
        <motion.button
          type="button"
          disabled={disabled}
          onClick={startRecording}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`mic-glow w-11 h-11 rounded-2xl bg-white/5 hover:bg-primary/15 border border-white/8 hover:border-primary/30 flex items-center justify-center text-gray-400 hover:text-primary transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Record voice message"
        >
          <Mic size={18} />
        </motion.button>
      </div>
    );
  }

  // ── RECORDING: waveform + timer ──────────────────────────────────────────
  if (state === 'recording') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 flex-1 glass-dark border border-red-500/25 rounded-2xl px-4 py-2.5"
      >
        {/* Record pulse dot */}
        <span className="record-btn-active w-3 h-3 rounded-full bg-red-500 shrink-0" />

        {/* Waveform bars */}
        <div className="flex items-center gap-1 flex-1 h-7 overflow-hidden">
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
        </div>

        {/* Timer */}
        <span className="text-xs text-red-400 font-mono shrink-0">{fmt(duration)}</span>

        {/* Stop button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={stopRecording}
          className="w-8 h-8 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 flex items-center justify-center text-red-400 transition-all shrink-0"
          title="Stop recording"
        >
          <Square size={14} fill="currentColor" />
        </motion.button>
      </motion.div>
    );
  }

  // ── PREVIEWING: playback preview + send/discard ──────────────────────────
  if (state === 'previewing') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 flex-1 glass-dark border border-primary/20 rounded-2xl px-3 py-2"
      >
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => {
            // Update duration for uploaded files if not already set by timer
            if (duration === 0 && e.target.duration && e.target.duration !== Infinity) {
              setDuration(Math.floor(e.target.duration));
            }
          }}
          className="hidden"
        />

        {/* Play/Pause */}
        <button
          type="button"
          onClick={togglePreview}
          className="w-8 h-8 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/25 flex items-center justify-center text-primary transition-all shrink-0"
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        {/* Static waveform */}
        <div className="flex items-center gap-[3px] flex-1 h-5">
          {[8,12,6,16,10,14,8,12,6].map((h, i) => (
            <span key={i} style={{ height: `${h}px` }} className="inline-block w-[3px] rounded-sm bg-primary/40" />
          ))}
        </div>

        <span className="text-xs text-gray-500 font-mono shrink-0">{fmt(duration)}</span>

        {/* Discard */}
        <button
          type="button"
          onClick={discard}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all shrink-0"
          title="Discard"
        >
          <Trash2 size={12} />
        </button>

        {/* Send */}
        <motion.button
          type="button"
          onClick={sendVoice}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0"
          title="Send voice message"
        >
          <Send size={13} />
        </motion.button>
      </motion.div>
    );
  }

  // ── PROCESSING: spinner ──────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 flex-1 glass-dark border border-primary/20 rounded-2xl px-4 py-2.5"
    >
      <Loader2 size={16} className="text-primary animate-spin shrink-0" />
      <span className="text-xs text-gray-400">Processing voice…</span>
    </motion.div>
  );
};

export default VoiceRecorder;
