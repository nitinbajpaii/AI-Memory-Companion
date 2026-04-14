import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X, UserCircle2, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { reviewsAPI } from '../services/api';

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
          className={n <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
        />
      </button>
    ))}
  </div>
);

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="glass-card rounded-3xl border border-white/6 p-7 space-y-4 animate-pulse">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 rounded-full bg-white/8" />)}
    </div>
    <div className="h-3 bg-white/6 rounded-full w-full" />
    <div className="h-3 bg-white/6 rounded-full w-4/5" />
    <div className="h-3 bg-white/6 rounded-full w-2/3" />
    <div className="flex items-center gap-3 pt-3 border-t border-white/4">
      <div className="w-9 h-9 rounded-xl bg-white/6" />
      <div className="space-y-1.5">
        <div className="h-2.5 w-20 bg-white/8 rounded-full" />
        <div className="h-2 w-16 bg-white/5 rounded-full" />
      </div>
    </div>
  </div>
);

// ─── ReviewCard ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="glass-card rounded-3xl border border-white/6 hover:border-primary/20 p-7 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
  >
    {/* Stars */}
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}
        />
      ))}
    </div>

    {/* Quote */}
    <p className="text-gray-300 italic leading-relaxed flex-1 text-sm">
      "{review.text}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-4 border-t border-white/6">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/40 to-indigo/40 flex items-center justify-center text-white font-bold text-sm">
        {review.username?.[0]?.toUpperCase() || '?'}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{review.username}</p>
        <p className="text-[11px] text-gray-600">
          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── ReviewModal ─────────────────────────────────────────────────────────────
const ReviewModal = ({ onClose, onSubmit }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md glass-card rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/60"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <X size={15} />
        </button>

        <h2 className="text-xl font-black text-white mb-1">Share Your Experience</h2>
        <p className="text-sm text-gray-500 mb-7">Your review helps others find comfort.</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Star rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Rating</label>
            <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Your Name</label>
            <div className="relative">
              <UserCircle2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
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
            <label className="text-sm font-medium text-gray-300">Your Review</label>
            <div className="relative">
              <MessageSquare size={15} className="absolute left-4 top-3.5 text-gray-600" />
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
            <p className="text-[11px] text-gray-600 text-right">{form.text.length}/500</p>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-indigo text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
    <section id="testimonials" className="py-24 md:py-32 px-6 md:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Stories of Healing</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles size={28} className="text-primary" />
            </div>
            <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <ReviewCard key={r._id || i} review={r} index={i} />
            ))}
          </div>
        )}

        {/* Write review button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-primary/25 bg-primary/8 hover:bg-primary/15 text-primary font-semibold text-sm transition-all shadow-lg shadow-primary/10"
          >
            <Star size={15} className="fill-current" />
            Write a Review
          </motion.button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ReviewModal onClose={() => setShowModal(false)} onSubmit={addReview} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewSection;
