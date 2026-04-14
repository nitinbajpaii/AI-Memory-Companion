import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Calendar, TrendingUp, Clock, BookOpen,
  Plus, Sparkles, ArrowRight, Zap, Activity, Mail, Info, Shield, Brain
} from 'lucide-react';
import Button from '../components/Button';
import { memoryAPI, profileAPI } from '../services/api';

const StatCard = ({ label, value, icon: Icon, color, bg, trend }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="glass-card rounded-3xl border border-white/6 p-6 hover:border-primary/20 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
        <Icon size={22} className={color} />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-4xl font-black text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const [memories, setMemories] = useState([]);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memRes, profRes] = await Promise.all([
          memoryAPI.getMemories(user._id),
          profileAPI.getProfile(user._id),
        ]);
        setMemories(memRes.data);
        setProfile(profRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  const stats = [
    { label: 'Total Memories',    value: memories.length || 0, icon: Heart,          color: 'text-pink-400',    bg: 'bg-pink-500/10',    trend: '+3 this week' },
    { label: 'Conversations',     value: 12,                   icon: MessageCircle,   color: 'text-blue-400',    bg: 'bg-blue-500/10',    trend: '+2 today' },
    { label: 'Days of Healing',   value: 24,                   icon: Calendar,        color: 'text-violet-400',  bg: 'bg-violet-500/10',  trend: 'Streak 🔥' },
    { label: 'Healing Score',     value: '85%',                icon: TrendingUp,      color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+5%' },
  ];

  const emotionColors = {
    happy:      'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    sad:        'text-blue-400   bg-blue-500/10   border-blue-500/20',
    nostalgic:  'text-amber-400  bg-amber-500/10  border-amber-500/20',
    funny:      'text-green-400  bg-green-500/10  border-green-500/20',
    meaningful: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    comfort:    'text-pink-400   bg-pink-500/10   border-pink-500/20',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading your memories…</p>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 5  ? 'Good night'    :
    hour < 12 ? 'Good morning'  :
    hour < 17 ? 'Good afternoon':
    hour < 21 ? 'Good evening'  : 'Good night';

  const greetingEmoji =
    hour < 5  ? '🌙' :
    hour < 12 ? '☀️'  :
    hour < 17 ? '🌤️' :
    hour < 21 ? '🌆' : '🌙';

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-white mb-1"
          >
            {greeting}, {user?.name?.split(' ')[0]} {greetingEmoji}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-gray-500">
            Here's a look at your healing journey today.
          </motion.p>
        </div>
        <Link to="/memories">
          <Button icon={<Plus size={16} />} className="shadow-lg shadow-primary/20">
            Add Memory
          </Button>
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Memories Feed */}
        <div className="xl:col-span-2 glass-card rounded-3xl border border-white/6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Recent Memories
            </h2>
            <Link to="/memories" className="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {memories.length > 0 ? (
              memories.slice(0, 4).map((memory, i) => (
                <motion.div
                  key={memory._id || i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/3 hover:bg-white/6 border border-white/4 hover:border-primary/15 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Heart size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm font-medium leading-relaxed line-clamp-2">{memory.memoryText}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${emotionColors[memory.emotionTag] || emotionColors.meaningful}`}>
                        {memory.emotionTag}
                      </span>
                      <span className="text-xs text-gray-600">{new Date(memory.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-3xl bg-white/4 flex items-center justify-center mx-auto mb-4">
                  <Heart size={28} className="text-gray-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-400 mb-2">No memories yet</h4>
                <p className="text-gray-600 text-sm mb-6">Start by adding your first cherished memory.</p>
                <Link to="/memories">
                  <Button variant="outline" size="sm">Add First Memory</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Cards */}
        <div className="space-y-5">
          {/* Loved One Profile Card */}
          <div className="glass-card rounded-3xl border border-white/6 p-6 bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" /> Loved One
            </h3>
            {profile ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary/25">
                    {profile.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.relation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400 bg-white/4 rounded-xl p-3">
                  <BookOpen size={14} className="text-primary mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{profile.personality}</span>
                </div>
                <Link to="/profile"><Button variant="outline" size="sm" className="w-full">View Profile</Button></Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-4">No profile yet. Create one to start chatting.</p>
                <Link to="/profile"><Button size="sm" className="w-full">Create Profile</Button></Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-3xl border border-white/6 p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Start a conversation', path: '/chat', icon: MessageCircle, color: 'text-blue-400' },
                { label: 'Add a memory',          path: '/memories', icon: Heart, color: 'text-pink-400' },
                { label: 'Update profile',         path: '/profile', icon: BookOpen, color: 'text-violet-400' },
              ].map(({ label, path, icon: Icon, color }) => (
                <Link key={path} to={path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/4 hover:border-primary/15 transition-all text-sm text-gray-400 hover:text-white group"
                >
                  <Icon size={15} className={color} />
                  {label}
                  <ArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Healing Tips */}
          <div className="glass-card rounded-3xl border border-white/6 p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /> Daily Healing
            </h3>
            <div className="space-y-3">
              {[
                "Take three deep breaths today.",
                "Write down one thing you loved about them.",
                "Listen to a song that reminds you of them.",
                "Share a memory in the chat.",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-default">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dashboard Footer: About & Contact ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 mt-10 border-t border-white/5">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl border border-white/6 p-8 flex flex-col gap-5 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/5">
              <Info size={22} className="text-primary" />
            </div>
            <h2 className="text-xl font-black text-white">About Us</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            AI Memory Companion is an emotionally intelligent space built to honor loved ones, preserve memories, and find comfort through safe, ethical AI. We blend technology with empathy to support your unique healing journey.
          </p>
          <Link to="/about" className="mt-auto">
            <Button variant="secondary" size="sm" className="group">
              Learn Our Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl border border-white/6 p-8 flex flex-col gap-5 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-lg shadow-emerald-500/5`}>
              <Mail size={22} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-white">Contact Us</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Whether you have a question, feedback, or just need someone to talk to, our team is here for you. We read every message and respond with care and compassion within 24 hours.
          </p>
          <Link to="/contact" className="mt-auto">
            <Button variant="secondary" size="sm" className="group">
              Get in Touch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
