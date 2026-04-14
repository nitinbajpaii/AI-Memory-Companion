import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, LayoutDashboard, MessageCircle, Heart,
  User, Settings, LogOut, X, Sparkles, Mail
} from 'lucide-react';

const navItems = [
  { name: 'Home',        path: '/dashboard',  icon: Home,            color: 'text-primary'    },
  { name: 'Memory Chat', path: '/chat',       icon: MessageCircle,   color: 'text-blue-400'   },
  { name: 'Memories',    path: '/memories',   icon: Heart,           color: 'text-pink-400'   },
  { name: 'Loved One',   path: '/profile',    icon: User,            color: 'text-emerald-400'},
  { name: 'Settings',    path: '/settings',   icon: Settings,        color: 'text-gray-400'   },
  { name: 'About Us',    path: '/about',      icon: Sparkles,        color: 'text-amber-400'  },
  { name: 'Contact Us',  path: '/contact',     icon: Mail,            color: 'text-primary'    },
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

  return (
    <div className="flex flex-col h-full">

      {/* ── Brand ── */}
      <div className="flex items-center justify-between px-5 py-6">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            animate={{ rotate: [0, -6, 6, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300"
          >
            <Heart size={18} className="text-white fill-white" />
          </motion.div>
          <div>
            <span className="font-black text-base gradient-text leading-none">AI Memory</span>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-none mt-0.5">Companion</p>
          </div>
        </NavLink>

        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="md:hidden w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </motion.button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 mb-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold px-3 mb-3">Navigation</p>

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
                      ? 'bg-gradient-to-r from-primary/15 to-indigo/5 border border-primary/20 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-100 hover:bg-white/5',
                  ].join(' ')}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`transition-all duration-200 ${
                            isActive ? item.color : 'text-gray-600 group-hover:text-gray-300 group-hover:scale-110'
                          }`}
                        />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="active-dot"
                          className="w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/50"
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
        <div className="mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* User card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 px-3.5 py-3.5 rounded-2xl bg-gradient-to-br from-white/5 to-primary/3 border border-white/8 hover:border-primary/20 transition-all duration-200 mb-2 cursor-default"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/25 shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
          </div>
          <Sparkles size={13} className="text-primary/60 shrink-0 animate-pulse" />
        </motion.div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 3 }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut size={17} className="group-hover:rotate-12 transition-transform duration-200" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => (
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
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40 md:hidden"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0,       opacity: 1 }}
            exit={{ x: '-100%',    opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r border-white/6 z-50 md:hidden flex flex-col"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
