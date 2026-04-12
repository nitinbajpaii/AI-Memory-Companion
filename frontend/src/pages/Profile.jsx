import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, Sparkles, BookOpen, AlertCircle, Save, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { profileAPI } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    relation: '',
    personality: '',
    habits: '',
    commonPhrases: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileAPI.getProfile(user._id);
        if (data) setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (profile._id) {
        await profileAPI.updateProfile(profile._id, profile);
        setSuccess('Profile updated successfully!');
      } else {
        const { data } = await profileAPI.createProfile(profile);
        setProfile(data);
        setSuccess('Profile created successfully!');
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Memorial Profile</h1>
          <p className="text-gray-400">Describe your loved one to help the AI understand them better.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 glass rounded-2xl border border-white/10 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <Info size={14} className="text-primary" />
          Used to build dynamic AI prompts
        </div>
      </header>

      {(error || success) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-3xl flex items-center gap-3 ${error ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}
        >
          {error ? <AlertCircle size={20} /> : <Sparkles size={20} />}
          <span className="font-medium">{error || success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8 glass p-10 rounded-[40px] border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <User size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white">Basic Info</h3>
          </div>
          
          <Input
            label="Name of Loved One"
            placeholder="e.g. Grandma Rose"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <Input
            label="Relation"
            placeholder="e.g. Grandmother, Father, Best Friend"
            value={profile.relation}
            onChange={(e) => setProfile({ ...profile, relation: e.target.value })}
            required
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 ml-1">Personality Traits</label>
            <textarea
              required
              placeholder="e.g. Kind, witty, loved storytelling, very patient..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
              value={profile.personality}
              onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-8 glass p-10 rounded-[40px] border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white">Character Details</h3>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 ml-1">Habits & Interests</label>
            <textarea
              required
              placeholder="e.g. Making tea at 4pm, gardening, humming while working..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
              value={profile.habits}
              onChange={(e) => setProfile({ ...profile, habits: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 ml-1">Common Phrases / Quotes</label>
            <textarea
              required
              placeholder="e.g. 'This too shall pass', 'Let's have some chai'..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
              value={profile.commonPhrases}
              onChange={(e) => setProfile({ ...profile, commonPhrases: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full h-14 text-lg font-bold flex items-center justify-center gap-2 shadow-2xl shadow-primary/30">
            {saving ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                {profile._id ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
