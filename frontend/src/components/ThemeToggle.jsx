import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ size = 'md', className = '' }) => {
  const { theme, toggleTheme, reducedMotion } = useTheme();
  const isDark = theme === 'dark';

  const sizing = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-11 h-11',
  }[size] || 'w-10 h-10';

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 17;

  const trans = reducedMotion
    ? { type: 'tween', duration: 0.1 }
    : { type: 'spring', stiffness: 300, damping: 22 };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={reducedMotion ? {} : { scale: 1.06 }}
      whileTap={reducedMotion ? {} : { scale: 0.94 }}
      transition={trans}
      className={`
        relative overflow-hidden ${sizing}
        rounded-xl
        bg-white/5 hover:bg-white/10
        dark:bg-white/5 dark:hover:bg-white/10
        border border-slate-900/8 hover:border-slate-900/15
        dark:border-white/8 dark:hover:border-white/15
        text-slate-600 hover:text-slate-800
        dark:text-gray-400 dark:hover:text-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
        transition-colors duration-200
        ${className}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ opacity: 0, rotate: isDark ? -40 : 40, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: isDark ? 40 : -40, scale: 0.7 }}
            transition={reducedMotion ? { duration: 0.08 } : { type: 'spring', stiffness: 280, damping: 24 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon size={iconSize} className="text-indigo-300" strokeWidth={1.8} />
            ) : (
              <Sun size={iconSize} className="text-amber-600" strokeWidth={1.8} />
            )}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
