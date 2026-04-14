import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bot, Mic } from 'lucide-react';

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble = ({ message, role, timestamp }) => {
  const isUser  = role === 'user';
  const isVoice = typeof message === 'string' && message.startsWith('🎤');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md transition-transform hover:scale-105 ${
        isUser
          ? 'bg-gradient-to-br from-primary to-indigo text-white'
          : 'bg-white/8 border border-white/10 text-purple-400'
      }`}>
        {isUser ? 'You' : <Heart size={14} className="fill-current" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative px-5 py-3.5 rounded-3xl leading-relaxed text-sm shadow-md flex items-center gap-2 ${
            isUser
              ? 'bg-gradient-to-br from-primary to-indigo text-white rounded-br-md shadow-primary/20'
              : 'glass-light border border-white/8 text-gray-200 rounded-bl-md'
          }`}
        >
          {/* Voice indicator icon */}
          {isVoice && (
            <Mic size={13} className={`shrink-0 ${isUser ? 'text-white/70' : 'text-primary/60'}`} />
          )}
          <span>{isVoice ? message.slice(2).trim() : message}</span>
        </motion.div>

        {timestamp && (
          <span className="text-[11px] text-gray-600 px-1">{formatTime(timestamp)}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
