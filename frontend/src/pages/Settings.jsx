import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Shield, Bell, Trash2, Heart, Save,
  User, Mail, Lock, Eye, EyeOff, Check,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useTheme } from '../contexts/ThemeContext';

const settingsColors = {
  primary: 'var(--color-primary)',
  blue: 'color-mix(in srgb, var(--color-primary-dark) 60%, #60a5fa 40%)',
  sage: 'var(--color-accent-sage)',
  red: '#ef4444',
};

const Toggle = ({ active, onChange, label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer"
      onClick={() => onChange(!active)}
      style={{
        background: hovered ? 'var(--surface-soft)' : 'var(--surface-overlay)',
        borderColor: active ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'var(--border-soft)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div
        className="w-11 h-6 rounded-full p-0.5 transition-colors duration-200"
        style={{ background: active ? 'var(--color-primary)' : '#a0a0ab' }}
      >
        <div
          className={`w-5 h-5 rounded-full shadow-sm transition-transform duration-200 bg-white ${active ? 'translate-x-5' : 'translate-x-0'}`}
          style={{}}
        />
      </div>
    </div>
  );
};

const CardHeader = ({ icon: Icon, color, title }) => (
  <div className="flex items-center gap-3 mb-8">
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center"
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <Icon size={18} style={{ color }} />
    </div>
    <h2 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>{title}</h2>
  </div>
);

const SectionCard = ({ children, style, motionProps }) => (
  <motion.section
    {...motionProps}
    className="glass-card rounded-3xl border p-8"
    style={{ borderColor: 'var(--border-soft)', ...(style || {}) }}
  >
    {children}
  </motion.section>
);

const Settings = () => {
  const { reducedMotion } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));
  const [name, setName]           = useState(user?.name || '');
  const [email, setEmail]         = useState(user?.email || '');
  const [showPw, setShowPw]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [notifications, setNotifications] = useState({
    reminders: true,
    anniversaryAI: true,
    updates: false,
    weeklyReport: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: 'var(--text-strong)' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account preferences and privacy.</p>
      </div>

      {/* Account */}
      <SectionCard motionProps={{ initial: reducedMotion ? {} : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}>
        <CardHeader icon={User} color={settingsColors.primary} title="Account Information" />
        <div className="space-y-5">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User size={15} />} />
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={15} />} />
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            icon={saved ? <Check size={16} /> : <Save size={16} />}
            variant={saved ? 'glass' : 'primary'}
            size="sm"
          >
            {saved ? 'Saved!' : 'Save Account'}
          </Button>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard motionProps={{ initial: reducedMotion ? {} : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 } }}>
        <CardHeader icon={Shield} color={settingsColors.blue} title="Security" />
        <div className="space-y-5">
          <Input label="Current Password" type="password" placeholder="••••••••" icon={<Lock size={15} />} />
          <Input
            label="New Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                className="transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="outline" size="sm" icon={<Shield size={15} />}>Update Password</Button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard motionProps={{ initial: reducedMotion ? {} : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.16 } }}>
        <CardHeader icon={Bell} color={settingsColors.sage} title="Notifications" />
        <div className="space-y-3">
          <Toggle label="Reminiscing reminders"    active={notifications.reminders}     onChange={v => setNotifications(p => ({ ...p, reminders: v }))} />
          <Toggle label="AI anniversary messages"  active={notifications.anniversaryAI} onChange={v => setNotifications(p => ({ ...p, anniversaryAI: v }))} />
          <Toggle label="Weekly healing report"    active={notifications.weeklyReport}  onChange={v => setNotifications(p => ({ ...p, weeklyReport: v }))} />
          <Toggle label="App updates & news"       active={notifications.updates}        onChange={v => setNotifications(p => ({ ...p, updates: v }))} />
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard
        motionProps={{ initial: reducedMotion ? {} : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.24 } }}
        style={{
          background: 'color-mix(in srgb, #ef4444 5%, transparent)',
          borderColor: 'color-mix(in srgb, #ef4444 15%, transparent)',
        }}
      >
        <CardHeader icon={Trash2} color={settingsColors.red} title="Danger Zone" />
        <p className="text-sm mb-6 max-w-md leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Permanently delete your account and all associated memories and conversations. This action cannot be undone.
        </p>
        <Button variant="danger" size="sm" icon={<Trash2 size={15} />}>Delete My Account</Button>
      </SectionCard>

      <div className="flex items-center justify-center gap-2 text-xs py-4" style={{ color: 'var(--text-muted)' }}>
        <Heart size={12} style={{ color: 'var(--color-primary)' }} />
        Built for healing · AI Memory Companion
      </div>
    </div>
  );
};

export default Settings;
