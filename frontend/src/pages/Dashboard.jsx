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
    className="glass-card rounded-3xl p-6 transition-all duration-300"
    style={{ borderColor: 'var(--border-soft)' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={bg ? { background: bg } : { background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
      >
        <Icon
          size={22}
          style={color ? { color } : { color: 'var(--color-primary)' }}
        />
      </div>
      {trend && (
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            color: 'var(--color-accent-sage)',
            background: 'color-mix(in srgb, var(--color-accent-sage) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-accent-sage) 22%, transparent)',
          }}
        >
          {trend}
        </span>
      )}
    </div>
    <p className="text-4xl font-black mb-1" style={{ color: 'var(--text-strong)' }}>{value}</p>
    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
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
    { label: 'Total Memories',    value: memories.length || 0, icon: Heart,          color: 'var(--color-accent-rose)',  bg: 'color-mix(in srgb, var(--color-accent-rose) 12%, transparent)',  trend: '+3 this week' },
    { label: 'Conversations',     value: 12,                   icon: MessageCircle,   color: 'color-mix(in srgb, var(--color-primary-dark) 70%, #6366f1 30%)', bg: 'color-mix(in srgb, var(--color-primary-dark) 10%, transparent)', trend: '+2 today' },
    { label: 'Days of Healing',   value: 24,                   icon: Calendar,        color: 'var(--color-primary)',       bg: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',       trend: 'Streak 🔥' },
    { label: 'Healing Score',     value: '85%',                icon: TrendingUp,      color: 'var(--color-accent-sage)',  bg: 'color-mix(in srgb, var(--color-accent-sage) 12%, transparent)',  trend: '+5%' },
  ];

  const emotionColors = {
    happy:      { c: 'var(--color-accent-amber)',                                          name: 'amber'    },
    sad:        { c: 'color-mix(in srgb, var(--color-primary-dark) 70%, #6366f1 30%)',     name: 'indigo'   },
    nostalgic:  { c: 'var(--color-accent-amber)',                                          name: 'amber'    },
    funny:      { c: 'var(--color-accent-sage)',                                           name: 'sage'     },
    meaningful: { c: 'var(--color-primary)',                                               name: 'primary'  },
    comfort:    { c: 'var(--color-accent-rose)',                                           name: 'rose'     },
  };

  const emotionStyle = (tag) => {
    const info = emotionColors[tag] || emotionColors.meaningful;
    return {
      color: info.c,
      background: `color-mix(in srgb, ${info.c} 12%, transparent)`,
      border: `1px solid color-mix(in srgb, ${info.c} 22%, transparent)`,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your memories…</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl xs:text-3xl md:text-4xl font-black mb-1 truncate"
            style={{ color: 'var(--text-strong)' }}
          >
            {greeting}, {user?.name?.split(' ')[0]} {greetingEmoji}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            Here's a look at your healing journey today.
          </motion.p>
        </div>
        <Link to="/memories" className="w-full sm:w-auto">
          <Button icon={<Plus size={16} />} className="w-full sm:w-auto shadow-lg shadow-primary/20">
            Add Memory
          </Button>
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Memories Feed */}
        <div
          className="xl:col-span-2 glass-card rounded-3xl p-6"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              <Clock size={20} style={{ color: 'var(--color-primary)' }} /> Recent Memories
            </h2>
            <Link
              to="/memories"
              className="text-sm transition-colors flex items-center gap-1 hover:underline-offset-4"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
            >
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
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer group"
                  style={{
                    background: 'var(--surface-overlay)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-soft)';
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 18%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-overlay)';
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{
                      background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Heart size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed line-clamp-2" style={{ color: 'var(--text-strong)' }}>{memory.memoryText}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={emotionStyle(memory.emotionTag)}
                      >
                        {memory.emotionTag}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{new Date(memory.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--surface-overlay)' }}
                >
                  <Heart size={28} style={{ color: 'var(--text-subtle)' }} />
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text-muted)' }}>No memories yet</h4>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Start by adding your first cherished memory.</p>
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
          <div
            className="glass-card rounded-3xl p-6"
            style={{
              borderColor: 'var(--border-soft)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent) 0%, var(--glass-bg) 100%)',
            }}
          >
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              <Sparkles size={16} style={{ color: 'var(--color-primary)' }} /> Loved One
            </h3>
            {profile ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary/25">
                    {profile.name[0]}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-strong)' }}>{profile.name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.relation}</p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-2 text-sm rounded-xl p-3"
                  style={{
                    background: 'var(--surface-overlay)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <BookOpen size={14} style={{ color: 'var(--color-primary)' }} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{profile.personality}</span>
                </div>
                <Link to="/profile"><Button variant="outline" size="sm" className="w-full">View Profile</Button></Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No profile yet. Create one to start chatting.</p>
                <Link to="/profile"><Button size="sm" className="w-full">Create Profile</Button></Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className="glass-card rounded-3xl p-6"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              <Zap size={16} style={{ color: 'var(--color-accent-amber)' }} /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Start a conversation', path: '/chat',     icon: MessageCircle, color: 'color-mix(in srgb, var(--color-primary-dark) 70%, #6366f1 30%)' },
                { label: 'Add a memory',          path: '/memories', icon: Heart,         color: 'var(--color-accent-rose)' },
                { label: 'Update profile',         path: '/profile',  icon: BookOpen,      color: 'var(--color-primary)' },
              ].map(({ label, path, icon: Icon, color }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group"
                  style={{
                    background: 'var(--surface-overlay)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-soft)';
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 18%, transparent)';
                    e.currentTarget.style.color = 'var(--text-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-overlay)';
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon size={15} style={{ color }} />
                  {label}
                  <ArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Healing Tips */}
          <div
            className="glass-card rounded-3xl p-6"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
              <Activity size={16} style={{ color: 'var(--color-accent-sage)' }} /> Daily Healing
            </h3>
            <div className="space-y-3">
              {[
                "Take three deep breaths today.",
                "Write down one thing you loved about them.",
                "Listen to a song that reminds you of them.",
                "Share a memory in the chat.",
              ].map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm transition-colors cursor-default"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>{i + 1}</span>
                  </div>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dashboard Footer: About & Contact ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 mt-10 border-t"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 flex flex-col gap-5 transition-all duration-300"
          style={{ borderColor: 'var(--border-soft)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 22%, transparent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                boxShadow: '0 10px 30px color-mix(in srgb, var(--color-primary) 8%, transparent)',
              }}
            >
              <Info size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>About Us</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            AI Memory Companion is an emotionally intelligent space built to honor loved ones, preserve memories, and find comfort through safe, ethical AI. We blend technology with empathy to support your unique healing journey.
          </p>
          <Link to="/about" className="mt-auto">
            <Button variant="outline" size="sm" className="group">
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
          className="glass-card rounded-3xl p-8 flex flex-col gap-5 transition-all duration-300"
          style={{ borderColor: 'var(--border-soft)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 22%, transparent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'color-mix(in srgb, var(--color-accent-sage) 10%, transparent)',
                boxShadow: '0 10px 30px color-mix(in srgb, var(--color-accent-sage) 8%, transparent)',
              }}
            >
              <Mail size={22} style={{ color: 'var(--color-accent-sage)' }} />
            </div>
            <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>Contact Us</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Whether you have a question, feedback, or just need someone to talk to, our team is here for you. We read every message and respond with care and compassion within 24 hours.
          </p>
          <Link to="/contact" className="mt-auto">
            <Button variant="outline" size="sm" className="group">
              Get in Touch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
