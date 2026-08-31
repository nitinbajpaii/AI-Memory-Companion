import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';

const itemColors = {
  primary: 'var(--color-primary)',
  blue: 'color-mix(in srgb, var(--color-primary-dark) 60%, #60a5fa 40%)',
  red: '#ef4444',
};

const ProfileDropdown = () => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = null;
  }

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
    window.location.href = '/';
  };

  if (!user) return null;

  const dropdownItems = [
    { label: 'Profile',  path: '/profile',  icon: User,     color: itemColors.primary },
    { label: 'Settings', path: '/settings', icon: Settings, color: itemColors.blue    },
  ];

  const triggerBg = dropdownOpen
    ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
    : 'var(--surface-overlay)';
  const triggerBorder = dropdownOpen
    ? 'color-mix(in srgb, var(--color-primary) 25%, transparent)'
    : 'var(--border-soft)';
  const triggerShadow = dropdownOpen
    ? '0 10px 25px color-mix(in srgb, var(--color-primary) 10%, transparent)'
    : 'none';

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setDropdownOpen(p => !p)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-200"
        style={{
          background: triggerBg,
          borderColor: triggerBorder,
          boxShadow: triggerShadow,
        }}
        onMouseEnter={(e) => {
          if (!dropdownOpen) {
            e.currentTarget.style.background = 'var(--surface-soft)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 15%, transparent)';
          }
        }}
        onMouseLeave={(e) => {
          if (!dropdownOpen) {
            e.currentTarget.style.background = triggerBg;
            e.currentTarget.style.borderColor = triggerBorder;
          }
        }}
      >
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
          style={{
            background: 'var(--color-primary-dark)',
            color: '#fff',
            boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary-dark) 40%, transparent)',
          }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold leading-none" style={{ color: 'var(--text-strong)' }}>
            {user?.name?.split(' ')[0] || 'User'}
          </p>
          <p className="text-[10px] mt-0.5 leading-none font-medium" style={{ color: 'var(--color-primary)' }}>
            Pro
          </p>
        </div>
        <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={12} style={{ color: 'var(--text-subtle)' }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.94 }}
            animate={{ opacity: 1, y:   0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border shadow-2xl overflow-hidden z-50"
            style={{
              borderColor: 'var(--border-soft)',
              background: 'var(--surface-elev)',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="px-4 py-4 border-b"
              style={{
                borderColor: 'var(--border-soft)',
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent)',
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black"
                  style={{
                    background: 'var(--color-primary-dark)',
                    color: '#fff',
                    boxShadow: '0 2px 10px color-mix(in srgb, var(--color-primary-dark) 35%, transparent)',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>{user?.name}</p>
                  <p className="text-[11px] truncate max-w-[140px]" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 px-1">
                <Sparkles size={11} style={{ color: 'var(--color-primary)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--color-primary)' }}>Pro Member</span>
              </div>
            </div>

            <div className="p-2">
              {dropdownItems.map(({ label, path, icon: Icon, color }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-soft)';
                    e.currentTarget.style.color = 'var(--text-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon
                    size={15}
                    style={{ color }}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {label}
                </Link>
              ))}

              <div className="h-px my-1.5" style={{ background: 'var(--border-soft)' }} />

              <motion.button
                whileHover={{ x: 2 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, #ef4444 8%, transparent)';
                  e.currentTarget.style.color = 'color-mix(in srgb, #ef4444 55%, var(--text-strong) 45%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <LogOut size={15} className="transition-transform group-hover:translate-x-0.5" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
