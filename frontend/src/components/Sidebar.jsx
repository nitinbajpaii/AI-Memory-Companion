import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageCircle, Heart, User,
  Settings, LogOut, Mic, X, ChevronRight, Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard',       path: '/dashboard', icon: LayoutDashboard },
  { name: 'Memory Chat',     path: '/chat',       icon: MessageCircle },
  { name: 'Memories',        path: '/memories',   icon: Heart },
  { name: 'Loved One',       path: '/profile',    icon: User },
  { name: 'Voice Notes',     path: '/voice',      icon: Mic },
  { name: 'Settings',        path: '/settings',   icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30 animate-glow-pulse">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <div>
            <span className="font-bold text-base gradient-text leading-none">AI Memory</span>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Companion</p>
          </div>
        </div>
        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 mb-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 group',
                  isActive
                    ? 'nav-active'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-primary' : 'group-hover:text-gray-300'} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 mt-4">
        <div className="mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* User card */}
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/4 border border-white/6 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/60 to-indigo/60 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
          </div>
          <Sparkles size={14} className="text-primary/60 shrink-0" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 glass-dark border-r border-white/6 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r border-white/6 z-50 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
