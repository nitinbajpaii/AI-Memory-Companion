import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X, UserCircle2, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const reviewColors = {
  primary: 'var(--color-primary)',
  amber: 'var(--color-accent-amber)',
  indigo: 'color-mix(in srgb, var(--color-primary-dark) 70%, #6366f1 30%)',
};

// ─── StarPicker ───────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="transition-transform hover:scale-110 active:scale-95"
      >
        <Star
          size={22}
          style={{
            color: n <= value ? reviewColors.amber : 'var(--text-subtle)',
            fill: n <= value ? reviewColors.amber : 'transparent',
          }}
        />
      </button>
    ))}
  </div>
);

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="glass-card rounded-3xl border p-7 space-y-4 animate-pulse"
    style={{ borderColor: 'var(--border-soft)' }}
  >
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full"
          style={{ background: 'var(--surface-soft)' }}
        />
      ))}
    </div>
    <div className="h-3 rounded-full w-full" style={{ background: 'var(--surface-overlay)' }} />
    <div className="h-3 rounded-full w-4/5" style={{ background: 'var(--surface-overlay)' }} />
    <div className="h-3 rounded-full w-2/3" style={{ background: 'var(--surface-overlay)' }} />
    <div
      className="flex items-center gap-3 pt-3 border-t"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <div className="w-9 h-9 rounded-xl" style={{ background: 'var(--surface-soft)' }} />
      <div className="space-y-1.5">
        <div className="h-2.5 w-20 rounded-full" style={{ background: 'var(--surface-overlay)' }} />
        <div className="h-2 w-16 rounded-full" style={{ background: 'var(--surface-overlay)' }} />
      </div>
    </div>
  </div>
);

// ─── ReviewCard ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index, reducedMotion }) => (
  <motion.div
    initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4 }}
    whileHover={reducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
    className="glass-card rounded-3xl border p-7 flex flex-col gap-5 transition-all duration-300"
    style={{
      borderColor: 'var(--border-soft)',
      boxShadow: '0 20px 40px -30px rgba(0,0,0,0.2)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 25%, transparent)';
      e.currentTarget.style.boxShadow = '0 28px 50px -30px color-mix(in srgb, var(--color-primary) 20%, transparent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-soft)';
      e.currentTarget.style.boxShadow = '0 20px 40px -30px rgba(0,0,0,0.2)';
    }}
  >
    {/* Stars */}
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          style={{
            color: i < review.rating ? reviewColors.amber : 'var(--text-subtle)',
            fill: i < review.rating ? reviewColors.amber : 'transparent',
          }}
        />
      ))}
    </div>

    {/* Quote */}
    <p
      className="italic leading-relaxed flex-1 text-sm"
      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}
    >
      "{review.text}"
    </p>

    {/* Author */}
    <div
      className="flex items-center gap-3 pt-4 border-t"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 45%, transparent), color-mix(in srgb, var(--color-primary-dark) 45%, transparent))',
          color: 'var(--text-strong)',
        }}
      >
        {review.username?.[0]?.toUpperCase() || '?'}
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: 'var(--text-strong)' }}>{review.username}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── ReviewModal ─────────────────────────────────────────────────────────────
const ReviewModal = ({ onClose, onSubmit, reducedMotion }) => {
  const [form, setForm]     = useState({ username: '', rating: 5, text: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.text.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await reviewsAPI.submitReview(form);
      if (data.success) {
        onSubmit(data.review);
        onClose();
      } else {
        setError(data.message || 'Submission failed.');
      }
    } catch {
      setError('Could not submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const errorColor = 'color-mix(in srgb, #dc2626 40%, var(--text-strong) 60%)';
  const errorBg = '#dc2626';

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? {} : { opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md glass-card rounded-3xl border p-8 shadow-2xl"
        style={{
          borderColor: 'var(--border-soft)',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.4)',
          background: 'var(--surface-elev)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--surface-overlay)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-soft)';
            e.currentTarget.style.color = 'var(--text-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-overlay)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={15} />
        </button>

        <h2 className="text-xl font-black mb-1" style={{ color: 'var(--text-strong)' }}>Share Your Experience</h2>
        <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>Your review helps others find comfort.</p>

        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl border text-sm"
            style={{
              background: `color-mix(in srgb, ${errorBg} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${errorBg} 20%, transparent)`,
              color: errorColor,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Star rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Rating</label>
            <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Your Name</label>
            <div className="relative">
              <UserCircle2
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-subtle)' }}
              />
              <input
                type="text"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                placeholder="Your name"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                maxLength={60}
                required
                className="form-input pl-10"
              />
            </div>
          </div>

          {/* Review text */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Your Review</label>
            <div className="relative">
              <MessageSquare
                size={15}
                className="absolute left-4 top-3.5 pointer-events-none"
                style={{ color: 'var(--text-subtle)' }}
              />
              <textarea
                rows={4}
                autoComplete="off"
                data-lpignore="true"
                placeholder="Share your experience..."
                value={form.text}
                onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                maxLength={500}
                required
                className="form-input pl-10 resize-none"
              />
            </div>
            <p className="text-[11px] text-right" style={{ color: 'var(--text-muted)' }}>{form.text.length}/500</p>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={reducedMotion || loading ? {} : { scale: 1.02 }}
            whileTap={reducedMotion || loading ? {} : { scale: 0.97 }}
            className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-indigo))',
              boxShadow: '0 10px 25px color-mix(in srgb, var(--color-primary) 25%, transparent)',
            }}
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              : <><Send size={16} /> Submit Review</>
            }
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── ReviewSection ────────────────────────────────────────────────────────────
const ReviewSection = () => {
  const { reducedMotion } = useTheme();
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => {
    reviewsAPI.getReviews()
      .then(({ data }) => {
        if (data.success) setReviews(data.reviews);
      })
      .catch(() => {}) // silently handle — show empty state
      .finally(() => setLoading(false));
  }, []);

  const addReview = (review) => setReviews(prev => [review, ...prev]);

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 px-6 md:px-8 relative"
      style={{ background: 'linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-primary) 3%, transparent), transparent)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-strong)' }}>Stories of Healing</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Real families, real comfort — read what they say.
          </p>
        </motion.div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div
              className="w-16 h-16 rounded-3xl border flex items-center justify-center"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
              }}
            >
              <Sparkles size={28} style={{ color: 'var(--color-primary)' }} />
            </div>
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your experience!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <ReviewCard key={r._id || i} review={r} index={i} reducedMotion={reducedMotion} />
            ))}
          </div>
        )}

        {/* Write review button */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={reducedMotion ? {} : { scale: 1.04 }}
            whileTap={reducedMotion ? {} : { scale: 0.96 }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border font-semibold text-sm transition-all"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
              color: 'var(--color-primary)',
              boxShadow: '0 10px 25px color-mix(in srgb, var(--color-primary) 10%, transparent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 15%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--color-primary) 8%, transparent)';
            }}
          >
            <Star size={15} style={{ fill: 'currentColor' }} />
            Write a Review
          </motion.button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ReviewModal
            onClose={() => setShowModal(false)}
            onSubmit={addReview}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewSection;
