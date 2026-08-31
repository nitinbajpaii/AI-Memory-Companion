import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, Trash2, Search, Calendar, AlertCircle, Edit3,
  Grid, AlignLeft, Sparkles, Filter,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { memoryAPI, profileAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const emotionConfig = {
  happy:      { label: 'Happy',      hex: 'color-mix(in srgb, var(--color-accent-amber) 85%, #facc15 15%)' },
  sad:        { label: 'Sad',        hex: 'color-mix(in srgb, var(--color-primary-dark) 60%, #60a5fa 40%)' },
  nostalgic:  { label: 'Nostalgic',  hex: 'var(--color-accent-amber)' },
  funny:      { label: 'Funny',      hex: 'var(--color-accent-sage)' },
  meaningful: { label: 'Meaningful', hex: 'var(--color-primary)' },
  comfort:    { label: 'Comfort',    hex: 'var(--color-accent-rose)' },
};

const emotionStyle = (tag, active = false) => {
  const c = (emotionConfig[tag] || emotionConfig.meaningful).hex;
  return {
    background: active ? `color-mix(in srgb, ${c} 22%, transparent)` : `color-mix(in srgb, ${c} 10%, transparent)`,
    border: `1px solid color-mix(in srgb, ${c} ${active ? 35 : 20}%, transparent)`,
    color: c,
  };
};

const IconButton = ({ children, onClick, accentColor, title }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
      style={{
        background: hover
          ? `color-mix(in srgb, ${accentColor} 15%, transparent)`
          : 'var(--surface-overlay)',
        color: hover ? accentColor : 'var(--text-subtle)',
      }}
    >
      {children}
    </button>
  );
};

const MemoryManagement = () => {
  const { reducedMotion } = useTheme();
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

  const viewBtnStyle = (active) => ({
    background: active ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'transparent',
    color: active ? 'var(--color-primary)' : 'var(--text-subtle)',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: 'var(--text-strong)' }}>Memory Gallery</h1>
          <p style={{ color: 'var(--text-muted)' }}>Preserve and cherish every moment you shared.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd} className="shadow-lg shadow-primary/20">
          Add Memory
        </Button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: 'var(--text-subtle)' }}
            />
            <input
              type="text"
              placeholder="Search memories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input w-52 rounded-2xl py-2.5 pl-9 pr-4 text-sm border focus:outline-none transition-all"
              style={{
                background: 'var(--surface-overlay)',
                borderColor: 'var(--border-soft)',
                color: 'var(--text-strong)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent)';
                e.target.style.background = 'var(--surface-elev)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-soft)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'var(--surface-overlay)';
              }}
            />
          </div>

          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="rounded-2xl py-2.5 px-4 text-sm border focus:outline-none transition-all"
            style={{
              background: 'var(--surface-overlay)',
              borderColor: 'var(--border-soft)',
              color: 'var(--text-muted)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
              e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-soft)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="all">All emotions</option>
            {Object.keys(emotionConfig).map(tag => (
              <option key={tag} value={tag}>{emotionConfig[tag].label}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center gap-1.5 rounded-2xl p-1 border"
          style={{ background: 'var(--surface-overlay)', borderColor: 'var(--border-soft)' }}
        >
          {[
            { key: 'grid', Icon: Grid },
            { key: 'list', Icon: AlignLeft },
          ].map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="p-2 rounded-xl transition-all"
              style={viewBtnStyle(view === key)}
              onMouseEnter={(e) => {
                if (view !== key) e.currentTarget.style.color = 'var(--text-strong)';
              }}
              onMouseLeave={(e) => {
                if (view !== key) e.currentTarget.style.color = viewBtnStyle(false).color;
              }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-2xl flex items-center gap-3 text-sm border"
          style={{
            background: 'color-mix(in srgb, #ef4444 10%, transparent)',
            borderColor: 'color-mix(in srgb, #ef4444 20%, transparent)',
            color: 'color-mix(in srgb, #ef4444 40%, var(--text-strong) 60%)',
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(emotionConfig).map(([tag, cfg]) => {
          const count = memories.filter(m => m.emotionTag === tag).length;
          if (count === 0) return null;
          const active = filterTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setFilterTag(active ? 'all' : tag)}
              className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all"
              style={{
                ...emotionStyle(tag, active),
                outline: active ? `1.5px solid color-mix(in srgb, ${cfg.hex} 40%, transparent)` : 'none',
                outlineOffset: active ? 2 : 0,
              }}
            >
              {cfg.label} · {count}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
              borderTopColor: 'var(--color-primary)',
            }}
          />
        </div>
      ) : filtered.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
            {filtered.map((memory) => {
              const cfg = emotionConfig[memory.emotionTag] || emotionConfig.meaningful;
              return (
                <motion.div
                  layout key={memory._id}
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  whileHover={reducedMotion ? {} : { y: view === 'grid' ? -4 : 0 }}
                  className={`glass-card rounded-3xl border transition-all duration-300 group flex flex-col ${view === 'grid' ? 'p-6' : 'p-5 flex-row items-start gap-5'}`}
                  style={{ borderColor: 'var(--border-soft)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 20%, transparent)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -30px color-mix(in srgb, var(--color-primary) 20%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {view === 'grid' ? (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                          style={emotionStyle(memory.emotionTag)}
                        >
                          {cfg.label}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton onClick={() => openEdit(memory)} accentColor="var(--color-primary)" title="Edit">
                            <Edit3 size={14} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(memory._id)} accentColor="#ef4444" title="Delete">
                            <Trash2 size={14} />
                          </IconButton>
                        </div>
                      </div>
                      <p
                        className="leading-relaxed flex-1 mb-5 italic"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}
                      >
                        "{memory.memoryText}"
                      </p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-subtle)' }}>
                        <Calendar size={12} />
                        {new Date(memory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-3 h-3 rounded-full shrink-0 mt-2 border-2"
                        style={{ background: cfg.hex, borderColor: `color-mix(in srgb, ${cfg.hex} 40%, transparent)` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="leading-relaxed italic mb-2"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}
                        >
                          "{memory.memoryText}"
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                            style={emotionStyle(memory.emotionTag)}
                          >{cfg.label}</span>
                          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                            {new Date(memory.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <IconButton onClick={() => openEdit(memory)} accentColor="var(--color-primary)">
                          <Edit3 size={14} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(memory._id)} accentColor="#ef4444">
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      ) : (
        <div
          className="glass-card rounded-[40px] border-dashed border p-20 text-center max-w-2xl mx-auto"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
            background: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border"
            style={{
              background: 'var(--surface-overlay)',
              borderColor: 'var(--border-soft)',
            }}
          >
            <Sparkles size={36} style={{ color: 'var(--text-subtle)' }} />
          </div>
          <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--text-strong)' }}>
            {search || filterTag !== 'all' ? 'No matching memories' : 'Your memory box is empty'}
          </h3>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            {search || filterTag !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Start preserving beautiful moments to help the AI understand your connection better.'}
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
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Memory Description</label>
            <textarea
              required
              placeholder="Describe a special moment…"
              className="form-input w-full h-36 rounded-2xl p-4 border focus:outline-none transition-all resize-none text-sm"
              style={{
                background: 'var(--surface-overlay)',
                borderColor: 'var(--border-soft)',
                color: 'var(--text-strong)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-soft)';
                e.target.style.boxShadow = 'none';
              }}
              value={newMemory.memoryText}
              onChange={e => setNewMemory({ ...newMemory, memoryText: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Emotional Vibe</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(emotionConfig).map(([tag, cfg]) => {
                const active = newMemory.emotionTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewMemory({ ...newMemory, emotionTag: tag })}
                    className="px-3 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border"
                    style={active
                      ? { ...emotionStyle(tag, true), boxShadow: `0 5px 15px color-mix(in srgb, ${cfg.hex} 20%, transparent)` }
                      : {
                          background: 'var(--surface-overlay)',
                          borderColor: 'var(--border-soft)',
                          color: 'var(--text-subtle)',
                        }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'var(--surface-soft)';
                        e.currentTarget.style.color = 'var(--text-strong)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'var(--surface-overlay)';
                        e.currentTarget.style.color = 'var(--text-subtle)';
                      }
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
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
