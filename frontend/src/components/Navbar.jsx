import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, Heart, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ onMenuClick }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-16 glass-dark border-b border-white/6 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30 shrink-0 shadow-lg shadow-black/20"
    >
      {/* ── Left: Brand & Nav ── */}
      <div className="flex items-center gap-6">
        <motion.button
          onClick={onMenuClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </motion.button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="hidden sm:block font-black text-sm gradient-text">AI Memory Companion</span>
        </Link>

        {/* Dashboard Navigation */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200 text-xs font-semibold group"
          >
            <Home size={14} className="group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-200 text-xs font-bold shadow-sm">
            <LayoutDashboard size={14} />
            Dashboard
          </div>
        </div>
      </div>

      {/* ── Right: Profile ── */}
      <div className="flex items-center gap-2.5">
        <ProfileDropdown />
      </div>
    </motion.header>
  );
};

export default Navbar;
