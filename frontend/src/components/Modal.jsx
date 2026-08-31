import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { reducedMotion } = useTheme();
  const [closeHovered, setCloseHovered] = useState(false);

  // Trap escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const motionEntry = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] };
  const motionFade = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.2 };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionFade}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={motionEntry}
            className={`relative w-full ${sizes[size]} glass-card rounded-3xl shadow-2xl z-10`}
            style={{
              border: '1px solid var(--border-soft)',
              background: 'var(--surface-elev)',
              boxShadow: '0 25px 80px -20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-primary) 50%, transparent) 50%, transparent 100%)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-0">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-strong)' }}>{title}</h3>
              <button
                onClick={onClose}
                onMouseEnter={() => setCloseHovered(true)}
                onMouseLeave={() => setCloseHovered(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: closeHovered
                    ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
                    : 'var(--surface-overlay)',
                  color: closeHovered
                    ? 'var(--color-primary)'
                    : 'var(--text-muted)',
                  border: `1px solid ${closeHovered
                    ? 'color-mix(in srgb, var(--color-primary) 22%, transparent)'
                    : 'var(--border-soft)'}`,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
