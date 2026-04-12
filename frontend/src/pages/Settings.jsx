import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Shield, Bell, Trash2, Heart, Save,
  User, Mail, Lock, Eye, EyeOff, Check
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Toggle = ({ active, onChange, label }) => (
  <div
    className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
    onClick={() => onChange(!active)}
  >
    <span className="text-sm text-gray-300 font-medium">{label}</span>
    <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${active ? 'bg-primary' : 'bg-white/10'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

const Settings = () => {
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
        <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and privacy.</p>
      </div>

      {/* Account */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl border border-white/6 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold text-white">Account Information</h2>
        </div>
        <div className="space-y-5">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User size={15} />} />
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={15} />} />
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} icon={saved ? <Check size={16} /> : <Save size={16} />} variant={saved ? 'glass' : 'primary'} size="sm">
            {saved ? 'Saved!' : 'Save Account'}
          </Button>
        </div>
      </motion.section>

      {/* Security */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="glass-card rounded-3xl border border-white/6 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Shield size={18} className="text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Security</h2>
        </div>
        <div className="space-y-5">
          <Input label="Current Password" type="password" placeholder="••••••••" icon={<Lock size={15} />} />
          <Input
            label="New Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={<Lock size={15} />}
            rightElement={
              <button type="button" onClick={() => setShowPw(p => !p)} className="text-gray-500 hover:text-white transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="outline" size="sm" icon={<Shield size={15} />}>Update Password</Button>
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="glass-card rounded-3xl border border-white/6 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Bell size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <Toggle label="Reminiscing reminders"    active={notifications.reminders}      onChange={v => setNotifications(p => ({ ...p, reminders: v }))} />
          <Toggle label="AI anniversary messages"  active={notifications.anniversaryAI}  onChange={v => setNotifications(p => ({ ...p, anniversaryAI: v }))} />
          <Toggle label="Weekly healing report"    active={notifications.weeklyReport}   onChange={v => setNotifications(p => ({ ...p, weeklyReport: v }))} />
          <Toggle label="App updates & news"       active={notifications.updates}         onChange={v => setNotifications(p => ({ ...p, updates: v }))} />
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
        className="glass-card rounded-3xl border border-red-500/15 bg-red-500/3 p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Danger Zone</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 max-w-md leading-relaxed">
          Permanently delete your account and all associated memories and conversations. This action cannot be undone.
        </p>
        <Button variant="danger" size="sm" icon={<Trash2 size={15} />}>Delete My Account</Button>
      </motion.section>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-700 py-4">
        <Heart size={12} className="text-primary" />
        Built for healing · AI Memory Companion
      </div>
    </div>
  );
};

export default Settings;
