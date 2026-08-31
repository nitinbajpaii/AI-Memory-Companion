import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  type    = 'button',
  variant = 'primary',
  size    = 'md',
  className = '',
  disabled  = false,
  loading   = false,
  icon      = null,
}) => {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold rounded-2xl',
    'transition-all duration-200',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-transparent',
    'select-none',
  ].join(' ');

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  const variants = {
    primary: [
      'bg-gradient-to-r from-primary to-indigo text-white',
      'shadow-lg shadow-primary/30',
      'hover:shadow-xl hover:shadow-primary/50',
      'hover:brightness-110',
      'border border-primary/20',
    ].join(' '),

    secondary: [
      'bg-slate-900/5 hover:bg-slate-900/10 text-slate-900',
      'dark:bg-white/6 dark:hover:bg-white/10 dark:text-white',
      'border border-slate-900/10 hover:border-slate-900/20',
      'dark:border-white/10 dark:hover:border-white/25',
      'backdrop-blur-md',
      'hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/20',
    ].join(' '),

    outline: [
      'bg-transparent border-2 border-primary/60 text-primary',
      'hover:bg-primary hover:text-white hover:border-primary',
      'hover:shadow-lg hover:shadow-primary/30',
    ].join(' '),

    ghost: [
      'bg-transparent text-slate-500 hover:text-slate-900',
      'dark:text-gray-400 dark:hover:text-white',
      'hover:bg-slate-900/5 dark:hover:bg-white/6',
    ].join(' '),

    danger: [
      'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400',
      'border border-red-500/20 hover:border-red-500/40',
    ].join(' '),

    glass: [
      'glass-light text-slate-900 dark:text-white',
      'border border-slate-900/10 dark:border-white/10 hover:border-primary/30',
      'hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10',
    ].join(' '),
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.035 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
