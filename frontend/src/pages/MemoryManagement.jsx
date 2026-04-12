import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Trash2, Search, Filter, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { memoryAPI, profileAPI } from '../services/api';

import Modal from '../components/Modal';

const MemoryManagement = () => {
  const [memories, setMemories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({ memoryText: '', emotionTag: 'meaningful' });
  const [error, setError] = useState('');
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
        console.error('Error fetching memories:', err);
        setError('Failed to load memories.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!profile) {
      setError('Please create a profile first.');
      return;
    }
    try {
      const { data } = await memoryAPI.addMemory({ ...newMemory, lovedOneId: profile._id });
      setMemories([data, ...memories]);
      setIsModalOpen(false);
      setNewMemory({ memoryText: '', emotionTag: 'meaningful' });
    } catch (err) {
      setError('Failed to add memory.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await memoryAPI.deleteMemory(id);
      setMemories(memories.filter((m) => m._id !== id));
    } catch (err) {
      setError('Failed to delete memory.');
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Memory Gallery</h1>
          <p className="text-gray-400">Preserve and cherish every moment you shared.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search memories..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 w-64 group-hover:bg-white/10"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} /> Add Memory
          </Button>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {memories.map((memory) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={memory._id}
                className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-primary/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                      {memory.emotionTag}
                    </span>
                    <button 
                      onClick={() => handleDelete(memory._id)}
                      className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg mb-8 italic">"{memory.memoryText}"</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <Calendar size={14} />
                  <span>{new Date(memory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass p-20 rounded-[40px] border border-dashed border-white/10 text-center max-w-2xl mx-auto mt-10">
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700 mx-auto mb-8">
            <Heart size={48} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Your memory box is empty</h3>
          <p className="text-gray-500 mb-10 text-lg">Start preserving beautiful moments to help the AI understand your connection better.</p>
          <Button onClick={() => setIsModalOpen(true)} className="h-14 px-10 text-lg">Add Your First Memory</Button>
        </div>
      )}

      {/* Add Memory Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Memory"
      >
        <form onSubmit={handleAddMemory} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 ml-1">Memory Description</label>
            <textarea
              required
              placeholder="Describe a special moment..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
              value={newMemory.memoryText}
              onChange={(e) => setNewMemory({ ...newMemory, memoryText: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 ml-1">Emotional Vibe</label>
            <div className="grid grid-cols-3 gap-3">
              {['happy', 'sad', 'nostalgic', 'funny', 'meaningful'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNewMemory({ ...newMemory, emotionTag: tag })}
                  className={`
                    px-4 py-3 rounded-2xl text-sm font-bold capitalize transition-all border
                    ${newMemory.emotionTag === tag 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl">Cancel</Button>
            <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary/30">Save Memory</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MemoryManagement;
