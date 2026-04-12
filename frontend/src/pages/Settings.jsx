import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, CreditCard, Trash2, Heart } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const settingsGroups = [
    {
      title: 'Account Information',
      icon: <SettingsIcon className="text-primary" />,
      fields: [
        { label: 'Full Name', value: user?.name, type: 'text' },
        { label: 'Email Address', value: user?.email, type: 'email' },
      ]
    },
    {
      title: 'Security',
      icon: <Shield className="text-blue-500" />,
      fields: [
        { label: 'Current Password', value: '••••••••', type: 'password' },
        { label: 'New Password', value: '', type: 'password' },
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="text-emerald-500" />,
      toggles: [
        { label: 'Reminiscing reminders', active: true },
        { label: 'AI anniversary messages', active: true },
        { label: 'App updates', active: false },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security.</p>
      </header>

      <div className="space-y-8">
        {settingsGroups.map((group, i) => (
          <motion.section 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[40px] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                {group.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{group.title}</h3>
            </div>

            <div className="space-y-6">
              {group.fields?.map((field, j) => (
                <div key={j} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <label className="text-gray-400 font-medium">{field.label}</label>
                  <div className="md:col-span-2">
                    <Input 
                      type={field.type} 
                      value={field.value} 
                      placeholder={field.label}
                      className="!bg-white/5"
                    />
                  </div>
                </div>
              ))}

              {group.toggles?.map((toggle, j) => (
                <div key={j} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                  <span className="text-gray-300 font-medium">{toggle.label}</span>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${toggle.active ? 'bg-primary' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggle.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-end">
              <Button variant="outline" className="px-10 h-12 rounded-2xl">Update {group.title.split(' ')[0]}</Button>
            </div>
          </motion.section>
        ))}

        <section className="glass p-10 rounded-[40px] border border-red-500/10 bg-red-500/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Trash2 size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Danger Zone</h3>
          </div>
          <p className="text-gray-500 mb-8 max-w-xl">Permanently delete your account and all associated memories. This action is irreversible.</p>
          <Button variant="danger" className="px-10 h-12 rounded-2xl">Delete Account</Button>
        </section>
      </div>

      <footer className="pt-10 flex items-center justify-center gap-4 text-gray-600 text-sm font-bold uppercase tracking-widest">
        <Heart size={16} className="text-primary fill-primary" />
        Built for Healing
      </footer>
    </div>
  );
};

export default Settings;
