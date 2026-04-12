import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, Plus, TrendingUp, Clock, BookOpen } from 'lucide-react';
import Button from '../components/Button';
import { memoryAPI, profileAPI } from '../services/api';

const Dashboard = () => {
  const [memories, setMemories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memRes, profRes] = await Promise.all([
          memoryAPI.getMemories(user._id),
          profileAPI.getProfile(user._id)
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
    { label: 'Total Memories', value: memories.length, icon: <Heart className="text-pink-500" />, color: 'bg-pink-500/10' },
    { label: 'Conversations', value: '12', icon: <MessageCircle className="text-blue-500" />, color: 'bg-blue-500/10' },
    { label: 'Days Active', value: '24', icon: <Calendar className="text-purple-500" />, color: 'bg-purple-500/10' },
    { label: 'Healing Score', value: '85%', icon: <TrendingUp className="text-emerald-500" />, color: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-400">Here is what's happening with your memories today.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} /> New Memory
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl border border-white/10"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock size={24} className="text-primary" /> Recent Memories
            </h2>
            <div className="space-y-4">
              {memories.length > 0 ? (
                memories.slice(0, 3).map((memory, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border border-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Heart size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1 line-clamp-1">{memory.memoryText}</p>
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{new Date(memory.createdAt).toLocaleDateString()} • {memory.emotionTag}</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="p-2 h-auto rounded-xl">
                        <Plus size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass p-12 rounded-3xl border border-dashed border-white/10 text-center">
                  <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No memories yet</h3>
                  <p className="text-gray-500 mb-6">Start by creating a profile for your loved one.</p>
                  <Button variant="outline">Get Started</Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-xl font-bold text-white mb-4">Loved One Profile</h3>
            {profile ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/30">
                    {profile.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{profile.name}</h4>
                    <p className="text-gray-500 text-sm">{profile.relation}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <BookOpen size={16} /> <span>{profile.personality}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Profile</Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">Create a profile to start chatting with AI.</p>
                <Button className="w-full">Create Profile</Button>
              </div>
            )}
          </section>

          <section className="glass p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Healing Guide</h3>
            <div className="space-y-4">
              {[
                "Take a deep breath",
                "Write down a happy memory",
                "Listen to their favorite song"
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group">
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                  {tip}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
