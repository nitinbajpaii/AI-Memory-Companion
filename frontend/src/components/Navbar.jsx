import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="h-16 glass-dark border-b border-white/6 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <Menu size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-3 bg-white/4 hover:bg-white/6 border border-white/8 rounded-2xl px-4 py-2.5 w-64 group focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/30 transition-all duration-200">
          <Search size={15} className="text-gray-600 group-focus-within:text-primary transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search memories..."
            className="bg-transparent border-none outline-none text-white placeholder:text-gray-600 w-full text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-dark" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/8" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/4 hover:bg-white/8 border border-white/6 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
              <p className="text-[10px] text-primary mt-0.5 leading-none">Pro</p>
            </div>
            <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl border border-white/8 shadow-2xl shadow-black/60 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/6">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/6 transition-all text-sm"
                  >
                    <Settings size={15} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
