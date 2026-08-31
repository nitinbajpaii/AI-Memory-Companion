import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Send, Trash2, Loader2, Play, Pause, Upload } from 'lucide-react';
import { voiceAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const VoiceRecorder = ({ onVoiceResult, onError, disabled = false, voiceType = 'female' }) => {
  const [state, setState]         = useState('idle');
  const [duration, setDuration]   = useState(0);
  const [audioUrl, setAudioUrl]   = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);
  const [micHover, setMicHover] = useState(false);
  const [discardHover, setDiscardHover] = useState(false);
  const { reducedMotion } = useTheme();

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const blobRef          = useRef(null);
  const timerRef         = useRef(null);
  const audioRef         = useRef(null);
  const streamRef        = useRef(null);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

      recorder.start(200);
      setState('recording');
      setDuration(0);

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      onError?.('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const discard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    blobRef.current = null;
    setAudioUrl(null);
    setIsPlaying(false);
    setDuration(0);
    setState('idle');
  };

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopRecording();

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
    setDuration(0);

    e.target.value = '';
  };

  const sendVoice = async () => {
    if (!blobRef.current) return;
    setState('processing');

    try {
      const formData = new FormData();

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

      console.log('[VoiceRecorder] Voice Response:', data);
      console.log('[VoiceRecorder] Audio Exists:', !!data.audio);

      if (data.success) {
        if (data.audio) {
          try {
            const audioBlob = new Blob(
              [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
              { type: 'audio/mpeg' }
            );
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioEl = new Audio(audioUrl);
            audioEl.onended = () => URL.revokeObjectURL(audioUrl);
            await audioEl.play();
          } catch (playErr) {
            console.error('[VoiceRecorder] Audio playback failed:', playErr);
          }
        }
        onVoiceResult?.(data);
        discard();
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

  const hoverMotion = reducedMotion ? {} : { scale: 1.08 };
  const tapMotion = reducedMotion ? {} : { scale: 0.92 };

  if (state === 'idle') {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => document.getElementById('voice-upload-input')?.click()}
          onMouseEnter={() => setUploadHover(true)}
          onMouseLeave={() => setUploadHover(false)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
          style={{
            background: uploadHover ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'var(--surface-overlay)',
            border: `1px solid ${uploadHover ? 'color-mix(in srgb, var(--color-primary) 22%, transparent)' : 'var(--border-soft)'}`,
            color: uploadHover ? 'var(--color-primary)' : 'var(--text-muted)',
          }}
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

        <motion.button
          type="button"
          disabled={disabled}
          onClick={startRecording}
          whileHover={reducedMotion ? {} : hoverMotion}
          whileTap={reducedMotion ? {} : tapMotion}
          onMouseEnter={() => setMicHover(true)}
          onMouseLeave={() => setMicHover(false)}
          className={`mic-glow w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
          style={{
            background: micHover
              ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
              : 'var(--surface-overlay)',
            border: `1px solid ${micHover
              ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)'
              : 'var(--border-soft)'}`,
            color: micHover ? 'var(--color-primary)' : 'var(--text-muted)',
          }}
          title="Record voice message"
        >
          <Mic size={18} />
        </motion.button>
      </div>
    );
  }

  if (state === 'recording') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reducedMotion ? { duration: 0.01 } : {}}
        className="flex items-center gap-3 flex-1 glass-dark border rounded-2xl px-4 py-2.5"
        style={{
          borderColor: 'color-mix(in srgb, #ef4444 25%, transparent)',
          background: 'color-mix(in srgb, #ef4444 4%, var(--surface-overlay))',
        }}
      >
        <span className="record-btn-active w-3 h-3 rounded-full shrink-0" style={{ background: '#ef4444' }} />

        <div className="flex items-center gap-1 flex-1 h-7 overflow-hidden">
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
          <span className="waveform-bar" />
        </div>

        <span className="text-xs font-mono shrink-0" style={{ color: 'color-mix(in srgb, #ef4444 55%, var(--text-strong) 45%)' }}>{fmt(duration)}</span>

        <motion.button
          type="button"
          whileHover={reducedMotion ? {} : { scale: 1.1 }}
          whileTap={reducedMotion ? {} : { scale: 0.9 }}
          onClick={stopRecording}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0"
          style={{
            background: 'color-mix(in srgb, #ef4444 15%, transparent)',
            border: '1px solid color-mix(in srgb, #ef4444 30%, transparent)',
            color: 'color-mix(in srgb, #ef4444 55%, var(--text-strong) 45%)',
          }}
          title="Stop recording"
        >
          <Square size={14} fill="currentColor" />
        </motion.button>
      </motion.div>
    );
  }

  if (state === 'previewing') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0.01 } : {}}
        className="flex items-center gap-2 flex-1 glass-dark border rounded-2xl px-3 py-2"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
          background: 'var(--surface-overlay)',
        }}
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => {
            if (duration === 0 && e.target.duration && e.target.duration !== Infinity) {
              setDuration(Math.floor(e.target.duration));
            }
          }}
          className="hidden"
        />

        <button
          type="button"
          onClick={togglePreview}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0"
          style={{
            background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
            color: 'var(--color-primary)',
          }}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <div className="flex items-center gap-[3px] flex-1 h-5">
          {[8,12,6,16,10,14,8,12,6].map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}px`,
                background: 'color-mix(in srgb, var(--color-primary) 40%, transparent)',
              }}
              className="inline-block w-[3px] rounded-sm"
            />
          ))}
        </div>

        <span className="text-xs font-mono shrink-0" style={{ color: 'var(--text-subtle)' }}>
          {fmt(duration)}
        </span>

        <button
          type="button"
          onClick={discard}
          onMouseEnter={() => setDiscardHover(true)}
          onMouseLeave={() => setDiscardHover(false)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
          style={{
            background: discardHover
              ? 'color-mix(in srgb, #ef4444 10%, transparent)'
              : 'var(--surface-overlay)',
            color: discardHover ? 'color-mix(in srgb, #ef4444 55%, var(--text-strong) 45%)' : 'var(--text-muted)',
          }}
          title="Discard"
        >
          <Trash2 size={12} />
        </button>

        <motion.button
          type="button"
          onClick={sendVoice}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-indigo))',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent)',
          }}
          title="Send voice message"
        >
          <Send size={13} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? { duration: 0.01 } : {}}
      className="flex items-center gap-3 flex-1 glass-dark border rounded-2xl px-4 py-2.5"
      style={{
        borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
        background: 'var(--surface-overlay)',
      }}
    >
      <Loader2 size={16} className="animate-spin shrink-0" style={{ color: 'var(--color-primary)' }} />
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Processing voice…</span>
    </motion.div>
  );
};

export default VoiceRecorder;
