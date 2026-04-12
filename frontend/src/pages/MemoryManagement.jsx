import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, Trash2, Search, Calendar, AlertCircle, Edit3,
  Grid, AlignLeft, Sparkles, Filter
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { memoryAPI, profileAPI } from '../services/api';

const emotionConfig = {
  happy:      { label: 'Happy',      color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  sad:        { label: 'Sad',        color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  nostalgic:  { label: 'Nostalgic',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  funny:      { label: 'Funny',      color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  meaningful: { label: 'Meaningful', color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
  comfort:    { label: 'Comfort',    color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
};

const MemoryManagement = () => {
  const [memories, setMemories]       = useState([]);
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMemory, setEditMemory]   = useState(null);
  const [newMemory, setNewMemory]     = useState({ memoryText: '', emotionTag: 'meaningful' });
  const [search, setSearch]           = useState('');
  const [filterTag, setFilterTag]     = useState('all');
  const [view, setView]               = useState('grid');
  const [error, setError]             = useState('');
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
      } catch { setError('Failed to load memories.'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user._id]);

  const openAdd = () => {
    setEditMemory(null);
    setNewMemory({ memoryText: '', emotionTag: 'meaningful' });
    setIsModalOpen(true);
  };

  const openEdit = (m) => {
    setEditMemory(m);
    setNewMemory({ memoryText: m.memoryText, emotionTag: m.emotionTag });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) { setError('Please create a profile first.'); return; }
    try {
      if (editMemory) {
        // For edit: delete old and add new (backend may not have PUT endpoint)
        await memoryAPI.deleteMemory(editMemory._id);
        const { data } = await memoryAPI.addMemory({ ...newMemory, lovedOneId: profile._id });
        setMemories(prev => [data, ...prev.filter(m => m._id !== editMemory._id)]);
      } else {
        const { data } = await memoryAPI.addMemory({ ...newMemory, lovedOneId: profile._id });
        setMemories(prev => [data, ...prev]);
      }
      setIsModalOpen(false);
      setEditMemory(null);
      setNewMemory({ memoryText: '', emotionTag: 'meaningful' });
    } catch { setError('Failed to save memory.'); }
  };

  const handleDelete = async (id) => {
    try {
      await memoryAPI.deleteMemory(id);
      setMemories(prev => prev.filter(m => m._id !== id));
    } catch { setError('Failed to delete.'); }
  };

  const filtered = memories.filter(m => {
    const matchesSearch = m.memoryText.toLowerCase().includes(search.toLowerCase());
    const matchesTag    = filterTag === 'all' || m.emotionTag === filterTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Memory Gallery</h1>
          <p className="text-gray-500">Preserve and cherish every moment you shared.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd} className="shadow-lg shadow-primary/20">
          Add Memory
        </Button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search memories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/4 border border-white/8 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all w-52"
            />
          </div>

          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="bg-white/4 border border-white/8 rounded-2xl py-2.5 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          >
            <option value="all">All emotions</option>
            {Object.keys(emotionConfig).map(tag => (
              <option key={tag} value={tag}>{emotionConfig[tag].label}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-2xl p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-white'}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-white'}`}
          >
            <AlignLeft size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(emotionConfig).map(([tag, cfg]) => {
          const count = memories.filter(m => m.emotionTag === tag).length;
          if (count === 0) return null;
          return (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? 'all' : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${cfg.bg} ${cfg.border} ${cfg.color} ${filterTag === tag ? 'ring-2 ring-offset-1 ring-offset-dark ring-current' : ''}`}
            >
              {cfg.label} · {count}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
            {filtered.map((memory) => {
              const cfg = emotionConfig[memory.emotionTag] || emotionConfig.meaningful;
              return (
                <motion.div
                  layout key={memory._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: view === 'grid' ? -4 : 0 }}
                  className={`glass-card rounded-3xl border border-white/6 hover:border-primary/15 transition-all duration-300 group flex flex-col ${view === 'grid' ? 'p-6' : 'p-5 flex-row items-start gap-5'}`}
                >
                  {view === 'grid' ? (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(memory)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-primary/15 hover:text-primary flex items-center justify-center text-gray-500 transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(memory._id)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/15 hover:text-red-400 flex items-center justify-center text-gray-500 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed flex-1 mb-5 italic">"{memory.memoryText}"</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar size={12} />
                        {new Date(memory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-3 h-3 rounded-full shrink-0 mt-2 ${cfg.bg.replace('bg-', 'bg-').replace('/10', '')} border-2 ${cfg.border}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 leading-relaxed italic mb-2">"{memory.memoryText}"</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.border} ${cfg.color}`}>{cfg.label}</span>
                          <span className="text-xs text-gray-600">{new Date(memory.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(memory)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-primary/15 hover:text-primary flex items-center justify-center text-gray-500 transition-all">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(memory._id)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/15 hover:text-red-400 flex items-center justify-center text-gray-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      ) : (
        <div className="glass-card rounded-[40px] border border-dashed border-white/10 p-20 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-white/4 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={36} className="text-gray-700" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">
            {search || filterTag !== 'all' ? 'No matching memories' : 'Your memory box is empty'}
          </h3>
          <p className="text-gray-500 mb-8">
            {search || filterTag !== 'all' ? 'Try adjusting your search or filter.' : 'Start preserving beautiful moments to help the AI understand your connection better.'}
          </p>
          {!search && filterTag === 'all' && (
            <Button onClick={openAdd} size="lg">Add Your First Memory</Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editMemory ? 'Edit Memory' : 'Add New Memory'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Memory Description</label>
            <textarea
              required
              placeholder="Describe a special moment…"
              className="w-full h-36 bg-white/4 border border-white/8 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none placeholder:text-gray-600 text-sm"
              value={newMemory.memoryText}
              onChange={e => setNewMemory({ ...newMemory, memoryText: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Emotional Vibe</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(emotionConfig).map(([tag, cfg]) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNewMemory({ ...newMemory, emotionTag: tag })}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border ${
                    newMemory.emotionTag === tag
                      ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-md`
                      : 'bg-white/4 border-white/8 text-gray-500 hover:bg-white/8'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/20">{editMemory ? 'Update' : 'Save'} Memory</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MemoryManagement;
