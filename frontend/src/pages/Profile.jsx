import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, Sparkles, BookOpen, AlertCircle, Save, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { profileAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const formTextarea = (onFocus = true) => ({
  background: 'var(--surface-overlay)',
  border: '1px solid var(--border-soft)',
  borderRadius: '1.5rem',
  padding: '1.5rem',
  color: 'var(--text-strong)',
  outline: 'none',
  transition: 'all 200ms ease',
  resize: 'none',
  ...(onFocus ? {} : {}),
});

const textareaFocus = (e) => {
  e.target.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent)';
  e.target.style.background = 'var(--surface-elev)';
};
const textareaBlur = (e) => {
  e.target.style.borderColor = 'var(--border-soft)';
  e.target.style.boxShadow = 'none';
  e.target.style.background = 'var(--surface-overlay)';
};

const glassPanelStyle = {
  background: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
  border: '1px solid var(--border-soft)',
  borderRadius: '2.5rem',
  padding: '2.5rem',
};

const Profile = () => {
  const { reducedMotion } = useTheme();
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
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
            borderTopColor: 'var(--color-primary)',
          }}
        />
      </div>
    );
  }

  const alertBgColor = error ? '#ef4444' : 'var(--color-accent-sage)';
  const alertTextColor = error ? 'color-mix(in srgb, #ef4444 40%, var(--text-strong) 60%)' : 'var(--color-accent-sage)';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-strong)' }}>Memorial Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Describe your loved one to help the AI understand them better.</p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-2 glass rounded-2xl border text-xs font-bold uppercase tracking-widest"
          style={{
            borderColor: 'var(--border-soft)',
            color: 'var(--text-muted)',
          }}
        >
          <Info size={14} style={{ color: 'var(--color-primary)' }} />
          Used to build dynamic AI prompts
        </div>
      </header>

      {(error || success) && (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl flex items-center gap-3 border"
          style={{
            background: `color-mix(in srgb, ${alertBgColor} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${alertBgColor} 20%, transparent)`,
            color: alertTextColor,
          }}
        >
          {error ? <AlertCircle size={20} /> : <Sparkles size={20} />}
          <span className="font-medium">{error || success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8" style={glassPanelStyle}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                color: 'var(--color-primary)',
                boxShadow: '0 10px 25px color-mix(in srgb, var(--color-primary) 10%, transparent)',
              }}
            >
              <User size={28} />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>Basic Info</h3>
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
            <label className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>Personality Traits</label>
            <textarea
              required
              placeholder="e.g. Kind, witty, loved storytelling, very patient..."
              className="form-input w-full h-32"
              style={formTextarea()}
              onFocus={textareaFocus}
              onBlur={textareaBlur}
              value={profile.personality}
              onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-8" style={glassPanelStyle}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                color: 'var(--color-primary)',
                boxShadow: '0 10px 25px color-mix(in srgb, var(--color-primary) 10%, transparent)',
              }}
            >
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-strong)' }}>Character Details</h3>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>Habits & Interests</label>
            <textarea
              required
              placeholder="e.g. Making tea at 4pm, gardening, humming while working..."
              className="form-input w-full h-32"
              style={formTextarea()}
              onFocus={textareaFocus}
              onBlur={textareaBlur}
              value={profile.habits}
              onChange={(e) => setProfile({ ...profile, habits: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>Common Phrases / Quotes</label>
            <textarea
              required
              placeholder="e.g. 'This too shall pass', 'Let's have some chai'..."
              className="form-input w-full h-32"
              style={formTextarea()}
              onFocus={textareaFocus}
              onBlur={textareaBlur}
              value={profile.commonPhrases}
              onChange={(e) => setProfile({ ...profile, commonPhrases: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-14 text-lg font-bold flex items-center justify-center gap-2 shadow-2xl"
            style={{ boxShadow: '0 15px 40px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
          >
            {saving ? (
              <div
                className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
              />
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
