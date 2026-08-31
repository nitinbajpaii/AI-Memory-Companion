import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, Heart, LayoutDashboard, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { reducedMotion } = useTheme();
  const motionT = reducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: 'easeOut' };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionT}
      className="h-16 glass-dark border-b flex items-center justify-between px-5 md:px-8 sticky top-0 z-30 shrink-0"
      style={{ borderColor: 'var(--border-soft)', boxShadow: '0 6px 24px rgba(15,23,42,0.08)' }}
    >
      {/* ── Left: Brand & Nav ── */}
      <div className="flex items-center gap-6">
        <motion.button
          onClick={onMenuClick}
          whileHover={reducedMotion ? {} : { scale: 1.08 }}
          whileTap={reducedMotion ? {} : { scale: 0.92 }}
          className="md:hidden w-9 h-9 rounded-xl bg-[var(--surface-overlay)] hover:bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
        >
          <Menu size={18} />
        </motion.button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="hidden sm:block font-black text-sm gradient-text">AI Memory Companion</span>
        </Link>

        {/* Dashboard Navigation */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[var(--border-soft)]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-overlay)] transition-all duration-200 text-xs font-semibold group"
          >
            <Home size={14} className="group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 22%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-overlay)] transition-all duration-200 text-xs font-semibold group"
          >
            <Mail size={14} className="group-hover:scale-110 transition-transform" />
            Contact
          </Link>
        </div>
      </div>

      {/* ── Right: Theme toggle + Profile ── */}
      <div className="flex items-center gap-2.5">
        <ThemeToggle size="md" />
        <ProfileDropdown />
      </div>
    </motion.header>
  );
};

export default Navbar;
