import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, LayoutDashboard, MessageCircle, Heart,
  User, Settings, LogOut, X, Sparkles, Mail
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { name: 'Home',        path: '/dashboard',  icon: Home,            color: 'var(--color-primary)'       },
  { name: 'Memory Chat', path: '/chat',       icon: MessageCircle,   color: 'color-mix(in srgb, var(--color-primary-dark) 60%, #60a5fa 40%)' },
  { name: 'Memories',    path: '/memories',   icon: Heart,           color: 'var(--color-accent-rose)'   },
  { name: 'Loved One',   path: '/profile',    icon: User,            color: 'var(--color-accent-sage)'   },
  { name: 'Settings',    path: '/settings',   icon: Settings,        color: 'var(--text-muted)'          },
  { name: 'About Us',    path: '/about',      icon: Sparkles,        color: 'var(--color-accent-amber)'  },
  { name: 'Contact Us',  path: '/contact',    icon: Mail,            color: 'var(--color-primary)'       },
];

/* ── Framer Motion variants for the list ── */
const listVariants = {
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const { reducedMotion } = useTheme();

  // Robust check for user session
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const staggerT = reducedMotion ? { duration: 0.01 } : undefined;

  return (
    <div className="flex flex-col h-full">

      {/* ── Brand ── */}
      <div className="flex items-center justify-between px-5 py-6">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            animate={reducedMotion ? {} : { rotate: [0, -6, 6, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300"
          >
            <Heart size={18} className="text-white fill-white" />
          </motion.div>
          <div>
            <span className="font-black text-base gradient-text leading-none">AI Memory</span>
            <p className="text-[10px] font-medium uppercase tracking-widest leading-none mt-0.5"
               style={{ color: 'var(--text-muted)' }}>
              Companion
            </p>
          </div>
        </NavLink>

        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 90 }}
            whileTap={reducedMotion ? {} : { scale: 0.9 }}
            transition={staggerT || { duration: 0.18 }}
            className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: 'var(--surface-overlay)',
              color: 'var(--text-muted)',
            }}
          >
            <X size={16} />
          </motion.button>
        )}
      </div>

      {/* ── Mobile-only quick theme toggle ── */}
      <div className="md:hidden px-5 pb-4 flex justify-end">
        <ThemeToggle size="sm" />
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 mb-5 h-px section-divider" />

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest font-bold px-3 mb-3"
           style={{ color: 'var(--text-muted)' }}>
          Navigation
        </p>

        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li key={item.path} variants={itemVariants}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => [
                    'flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 group relative',
                    isActive
                      ? 'nav-active'
                      : 'hover:bg-[var(--surface-overlay)]',
                  ].join(' ')}
                  style={{ color: 'var(--text-muted)' }}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`transition-all duration-200 ${
                            isActive ? '' : 'group-hover:scale-110'
                          }`}
                          style={{
                            color: isActive ? item.color : undefined,
                            opacity: isActive ? undefined : undefined,
                          }}
                        />
                        <span className="font-medium text-sm"
                              style={{
                                color: isActive ? 'var(--text-strong)' : undefined,
                              }}>
                          {item.name}
                        </span>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="active-dot"
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'var(--color-primary)', boxShadow: '0 0 10px var(--ai-presence)' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* ── Bottom: User Card + Logout ── */}
      <div className="px-3 pb-5 mt-4">
        <div className="mx-2 mb-4 h-px section-divider" />

        {/* User card */}
        <motion.div
          whileHover={reducedMotion ? {} : { scale: 1.015 }}
          className="flex items-center gap-3 px-3.5 py-3.5 rounded-2xl transition-all duration-200 mb-2 cursor-default"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--surface-elev) 40%, transparent), color-mix(in srgb, var(--color-primary) 4%, transparent))',
            border: '1px solid var(--border-soft)',
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/20 shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-strong)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {user?.email}
            </p>
          </div>
          <Sparkles
            size={13}
            className="shrink-0"
            style={{
              color: 'color-mix(in srgb, var(--color-primary) 70%, transparent)',
              opacity: 0.7,
            }}
          />
        </motion.div>

        <motion.button
          onClick={handleLogout}
          whileHover={reducedMotion ? {} : { x: 3 }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-sm font-medium group"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'color-mix(in srgb, #ef4444 55%, var(--text-strong) 45%)';
            e.currentTarget.style.background = 'color-mix(in srgb, #ef4444 8%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.background = '';
          }}
        >
          <LogOut size={17} className="group-hover:rotate-12 transition-transform duration-200" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { reducedMotion } = useTheme();
  const drawerT = reducedMotion ? { duration: 0.01 } : { type: 'spring', damping: 26, stiffness: 220 };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 glass-dark border-r flex-col"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0,       opacity: 1 }}
              exit={{ x: '-100%',    opacity: 0 }}
              transition={drawerT}
              className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r z-50 md:hidden flex flex-col"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
