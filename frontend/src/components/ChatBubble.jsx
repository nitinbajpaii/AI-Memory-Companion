import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mic } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble = ({ message, role, timestamp, isComposing = false }) => {
  const { reducedMotion } = useTheme();
  const isUser  = role === 'user';
  const isVoice = typeof message === 'string' && message.startsWith('🎤');

  const spring = reducedMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 240, damping: 24 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: isUser ? 14 : -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={spring}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 ${
        isUser ? 'bg-gradient-to-br from-primary to-indigo text-white' : ''
      } ${!isUser ? 'ai-presence' : ''}`}
      style={!isUser ? {
        background: 'var(--ai-bubble-bg)',
        border: '1px solid var(--ai-bubble-border)',
        color: 'var(--color-primary)',
      } : {}}
      >
        {isUser ? 'You' : <Heart size={14} className="fill-current" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          whileHover={reducedMotion ? {} : { scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={`relative px-5 py-3.5 rounded-3xl leading-relaxed text-sm shadow-md flex items-start gap-2 ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
          style={isUser ? {
            background: 'var(--user-bubble-bg)',
            color: 'var(--user-bubble-text)',
            boxShadow: '0 8px 24px color-mix(in srgb, var(--color-primary) 22%, transparent)',
          } : {
            background: 'var(--ai-bubble-bg)',
            border: '1px solid var(--ai-bubble-border)',
            color: 'var(--text-strong)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
          }}
        >
          {/* Voice indicator icon */}
          {isVoice && (
            <Mic
              size={13}
              className="shrink-0 mt-0.5"
              style={isUser
                ? { color: 'var(--user-bubble-text)' }
                : { color: 'var(--color-primary)' }
              }
            />
          )}

          {/* Composing indicator (AI breathing) */}
          {isComposing ? (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <span>{isVoice ? message.slice(2).trim() : message}</span>
          )}
        </motion.div>

        {timestamp && (
          <span
            className="text-[11px] px-1"
            style={{ color: 'var(--text-subtle)' }}
          >
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
