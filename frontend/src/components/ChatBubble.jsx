import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, role, timestamp }) => {
  const isUser = role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`
        max-w-[80%] p-5 rounded-3xl shadow-lg relative
        ${isUser 
          ? 'bg-primary text-white rounded-br-lg' 
          : 'glass border border-white/10 text-gray-200 rounded-bl-lg'
        }
      `}>
        <p className="leading-relaxed whitespace-pre-wrap">{message}</p>
        <span className={`text-[10px] mt-2 block opacity-50 font-medium uppercase tracking-tighter ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
