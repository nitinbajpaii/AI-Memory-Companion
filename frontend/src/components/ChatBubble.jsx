import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBubble = ({ message, role, timestamp }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-primary to-indigo text-white'
            : 'bg-white/8 border border-white/10 text-purple-400'
        }`}
      >
        {isUser ? 'You' : <Heart size={14} className="fill-current" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-5 py-3.5 rounded-3xl leading-relaxed text-sm shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-primary to-indigo text-white rounded-br-md shadow-primary/20'
              : 'glass-light border border-white/8 text-gray-200 rounded-bl-md'
          }`}
        >
          {message}
        </div>
        {timestamp && (
          <span className="text-[11px] text-gray-600 px-1">{formatTime(timestamp)}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
