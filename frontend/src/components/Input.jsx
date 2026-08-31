import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Input = ({
  label,
  type        = 'text',
  placeholder,
  value,
  onChange,
  className   = '',
  error,
  helperText,
  required    = false,
  icon        = null,
  rightElement = null,
  disabled    = false,
  autoComplete,
  ...rest
}) => {
  const { reducedMotion } = useTheme();
  const motionT = reducedMotion ? { duration: 0.01 } : { opacity: { duration: 0.2 }, y: { duration: 0.2 } };

  const errorColor = '#ef4444';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium ml-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          {label}
          {required && <span className="text-xs" style={{ color: 'var(--color-primary)' }}>*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none z-10"
            style={{ color: 'var(--text-subtle)' }}
            id="input-icon-wrapper"
          >
            {icon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete || 'off'}
          className={[
            'w-full rounded-2xl border transition-all duration-200',
            'focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-sm',
            icon ? 'pl-12 pr-4 py-3.5' : 'px-4 py-3.5',
            rightElement ? 'pr-12' : '',
          ].join(' ')}
          style={{
            background: error
              ? `color-mix(in srgb, ${errorColor} 5%, transparent)`
              : 'var(--surface-overlay)',
            color: 'var(--text-strong)',
            borderColor: error
              ? `color-mix(in srgb, ${errorColor} 50%, transparent)`
              : 'var(--border-soft)',
            boxShadow: error
              ? `0 0 0 1px color-mix(in srgb, ${errorColor} 30%, transparent)`
              : 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = error
              ? `color-mix(in srgb, ${errorColor} 7%, transparent)`
              : 'var(--surface-soft)';
            e.currentTarget.style.borderColor = error
              ? `color-mix(in srgb, ${errorColor} 60%, transparent)`
              : 'color-mix(in srgb, var(--color-primary) 40%, transparent)';
            e.currentTarget.style.boxShadow = error
              ? `0 0 0 3px color-mix(in srgb, ${errorColor} 15%, transparent)`
              : '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)';
            if (icon) {
              const wrap = document.getElementById('input-icon-wrapper');
              if (wrap) wrap.style.color = error ? errorColor : 'var(--color-primary)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = error
              ? `color-mix(in srgb, ${errorColor} 5%, transparent)`
              : 'var(--surface-overlay)';
            e.currentTarget.style.borderColor = error
              ? `color-mix(in srgb, ${errorColor} 50%, transparent)`
              : 'var(--border-soft)';
            e.currentTarget.style.boxShadow = error
              ? `0 0 0 1px color-mix(in srgb, ${errorColor} 30%, transparent)`
              : 'none';
            if (icon) {
              const wrap = document.getElementById('input-icon-wrapper');
              if (wrap) wrap.style.color = 'var(--text-subtle)';
            }
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.currentTarget && !error) {
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 22%, transparent)';
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget && !error) {
              e.currentTarget.style.borderColor = 'var(--border-soft)';
            }
          }}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}

        {/* Subtle glow layer on focus */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"
          style={{
            boxShadow: error
              ? `0 0 0 3px color-mix(in srgb, ${errorColor} 15%, transparent)`
              : '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
          }} />
      </div>

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionT}
          className="text-xs ml-0.5 flex items-center gap-1"
          style={{ color: errorColor }}
        >
          <span className="w-1 h-1 rounded-full inline-block" style={{ background: errorColor }} />
          {error}
        </motion.span>
      )}
      {helperText && !error && (
        <span className="text-xs ml-0.5" style={{ color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;
