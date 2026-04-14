import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Menu, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const user         = JSON.parse(localStorage.getItem('user'));
  const navigate     = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasNote, setHasNote]           = useState(true); // notification dot
  const dropdownRef  = useRef(null);

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

  const dropdownItems = [
    { label: 'Profile',  path: '/profile',  icon: User,     color: 'text-primary'   },
    { label: 'Settings', path: '/settings', icon: Settings, color: 'text-gray-400'  },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-16 glass-dark border-b border-white/6 flex items-center justify-between px-5 md:px-6 sticky top-0 z-30 shrink-0"
    >
      {/* ── Left: Mobile menu + Search ── */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onMenuClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </motion.button>

        {/* Search bar */}
        <div className="hidden sm:flex items-center gap-3 bg-white/4 hover:bg-white/6 border border-white/8 hover:border-white/15 rounded-2xl px-4 py-2.5 w-56 lg:w-72 group focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/30 transition-all duration-200">
          <Search size={15} className="text-gray-600 group-focus-within:text-primary transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search memories..."
            autoComplete="off"
            className="bg-transparent border-none outline-none text-white placeholder:text-gray-600 w-full text-sm"
          />
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-2.5">

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: hasNote ? [0, -10, 10, -6, 0] : 0 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.35 }}
          onClick={() => setHasNote(false)}
          className="relative w-9 h-9 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 hover:border-primary/20 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
        >
          <Bell size={17} />
          <AnimatePresence>
            {hasNote && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-dark"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/8" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setDropdownOpen(p => !p)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-200 ${
              dropdownOpen
                ? 'bg-primary/10 border-primary/25 shadow-lg shadow-primary/10'
                : 'bg-white/4 hover:bg-white/8 border-white/6 hover:border-white/15'
            }`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white text-xs font-black shadow-md shadow-primary/25">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-none">
                {user?.name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[10px] text-primary mt-0.5 leading-none font-medium">Pro</p>
            </div>
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <ChevronDown size={12} className="text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.94 }}
                animate={{ opacity: 1, y:   0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-4 border-b border-white/6 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white font-black shadow-md">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-[140px]">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 px-1">
                    <Sparkles size={11} className="text-primary" />
                    <span className="text-[11px] text-primary font-medium">Pro Member</span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  {dropdownItems.map(({ label, path, icon: Icon, color }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/6 transition-all text-sm group"
                    >
                      <Icon size={15} className={`${color} group-hover:scale-110 transition-transform`} />
                      {label}
                    </Link>
                  ))}

                  <div className="h-px bg-white/6 my-1.5" />

                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm"
                  >
                    <LogOut size={15} className="transition-transform group-hover:translate-x-0.5" />
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
