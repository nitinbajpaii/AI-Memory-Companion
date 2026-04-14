import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Mail, MessageSquare, Send, CheckCircle2,
  MapPin, Clock, Phone, ArrowRight, Loader2, Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import Input  from '../components/Input';
import Footer from '../components/Footer';

/* ── Data ── */
const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'support@aimemorycompanion.com',
    sub: 'We reply within 24 hours',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: 'Monday – Saturday',
    sub: '9 AM – 8 PM IST',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: MessageSquare,
    label: 'Live Chat',
    value: 'Real-time in-app chat',
    sub: 'Available for Pro users',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
];

const faqs = [
  { q: 'Is my data safe?',          a: 'All data is encrypted end-to-end and stored on secure servers. You can delete everything at any time.' },
  { q: 'Can I cancel anytime?',     a: 'Yes, cancel your subscription anytime with no questions asked and no hidden fees.' },
  { q: 'Is the AI voice realistic?', a: 'We use ElevenLabs — one of the most realistic voice AI providers — to generate warm, natural-sounding replies.' },
];

/* ── Mini Nav (same as About page) ── */
const MiniNav = () => (
  <nav className="glass-dark border-b border-white/6 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
    <Link to="/" className="flex items-center gap-2.5 group">
      <motion.div whileHover={{ scale: 1.1, rotate: -6 }} className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25">
        <Heart size={16} className="text-white fill-white" />
      </motion.div>
      <span className="font-black gradient-text text-sm">AI Memory Companion</span>
    </Link>
    <div className="flex items-center gap-3">
      <Link to="/login"  className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
      <Link to="/signup"><Button size="sm">Get Started</Button></Link>
    </div>
  </nav>
);

/* ── Contact Page ── */
const Contact = () => {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate submission (replace with real API call)
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <MiniNav />

      {/* ── Hero ── */}
      <section className="pt-20 pb-12 px-6 text-center relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo/6 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            We're Here to <span className="gradient-text">Listen</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Whether you have a question, feedback, or just need support — our team responds with care and compassion.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-24 space-y-14">

        {/* ── Contact Info Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {contactInfo.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`glass-card rounded-3xl border ${c.border} p-7 flex flex-col gap-4 hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center`}>
                  <Icon size={22} className={c.color} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{c.label}</p>
                  <p className="font-bold text-white text-sm">{c.value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{c.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main: Form + FAQ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Contact Form — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 glass-card rounded-3xl border border-white/8 p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-primary/12 border border-primary/20 flex items-center justify-center">
                <Send size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Send a Message</h2>
                <p className="text-sm text-gray-500">We read every message personally.</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-5 py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                  >
                    <CheckCircle2 size={40} className="text-emerald-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => { setSuccess(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>
                    Send Another <ArrowRight size={15} />
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  autoComplete="off"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      autoComplete="off"
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    autoComplete="off"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-0.5 flex items-center gap-1">
                      Message <span className="text-primary text-xs">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Share what's on your mind..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      required
                      autoComplete="off"
                      className="w-full rounded-2xl bg-white/5 text-white placeholder:text-gray-600 border border-white/8 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-white/7 transition-all duration-200 px-4 py-3.5 text-sm resize-none"
                    />
                    <p className="text-[11px] text-gray-600 text-right">{form.message.length}/1000</p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full shadow-xl shadow-primary/25"
                    loading={loading}
                  >
                    {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
                  </Button>

                  <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1.5">
                    <Heart size={11} className="text-primary" />
                    Your message is read with care
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: FAQ + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* FAQ */}
            <div className="glass-card rounded-3xl border border-white/8 p-7">
              <div className="flex items-center gap-2.5 mb-6">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-black text-white text-lg">Quick Answers</h3>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-white/6 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/3 transition-all group"
                    >
                      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 text-base shrink-0 ml-2"
                      >
                        ↓
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-gray-400 leading-relaxed px-4 pb-4 border-t border-white/5 pt-3">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280 }}
              className="glass-card rounded-3xl border border-primary/20 p-7 bg-gradient-to-br from-primary/8 to-indigo/4 text-center"
            >
              <div className="w-14 h-14 rounded-3xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/10">
                <Heart size={26} className="text-primary fill-primary/30" />
              </div>
              <h4 className="text-lg font-black text-white mb-2">Begin Your Healing</h4>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Join thousands of families finding comfort through meaningful conversations.
              </p>
              <Link to="/signup">
                <Button className="w-full shadow-lg shadow-primary/20">
                  Start for Free <ArrowRight size={15} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
