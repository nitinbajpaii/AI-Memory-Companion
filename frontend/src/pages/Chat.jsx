import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Info, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { chatAPI, profileAPI } from '../services/api';

import ChatBubble from '../components/ChatBubble';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistoryAndProfile = async () => {
      try {
        const [historyRes, profileRes] = await Promise.all([
          chatAPI.getHistory(user._id),
          profileAPI.getProfile(user._id)
        ]);
        setMessages(historyRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error('Error fetching chat data:', err);
        setError('Failed to load chat history or profile.');
      }
    };
    fetchHistoryAndProfile();
  }, [user._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, createdAt: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await chatAPI.sendMessage(input);
      const aiMessage = { role: 'assistant', content: data.message, createdAt: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
          <Heart size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white">Create a Memorial Profile</h2>
        <p className="text-gray-400">To start a conversation, you first need to create a profile for your loved one so the AI can understand who they were.</p>
        <Button className="w-full h-14 text-lg">Create Profile Now</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto glass rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
      {/* Chat Header */}
      <header className="p-6 glass border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            {profile?.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{profile?.name}</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">AI Inspired Companion</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="p-3 h-auto rounded-xl">
            <Info size={20} className="text-gray-400 hover:text-white" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-2">
              <Heart size={32} />
            </div>
            <h4 className="text-xl font-bold text-white">Start your journey</h4>
            <p className="text-gray-500 text-sm">Send a message to begin reminiscing. Remember, I am an AI here to support you.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              message={msg.content}
              role={msg.role}
              timestamp={msg.createdAt}
            />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass border border-white/10 p-5 rounded-3xl rounded-bl-lg">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-0"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="flex justify-center mt-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-8 glass border-t border-white/10 relative z-10">
        <form onSubmit={handleSend} className="relative flex items-center gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Share a memory or just say hello..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 group-hover:bg-white/10"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 bottom-2 w-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-widest">
          <Heart size={12} className="text-primary" />
          Always here to listen
        </div>
      </div>
    </div>
  );
};

export default Chat;
