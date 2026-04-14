import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Mail, MessageSquare, Send, CheckCircle2,
  Clock, ArrowRight, Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Footer from '../components/Footer';
import ProfileDropdown from '../components/ProfileDropdown';

/* ── Data ── */
const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'support.aimemorycompanion@gmail.com',
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
  {
    q: 'Is my data safe?',
    a: 'All data is encrypted end-to-end and stored on secure servers. You can delete everything at any time.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel your subscription anytime with no questions asked and no hidden fees.'
  },
  {
    q: 'Is the AI voice realistic?',
    a: 'We use ElevenLabs — one of the most realistic voice AI providers — to generate warm, natural-sounding replies.'
  },
];

/* ── Mini Nav ── */
const MiniNav = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="glass-dark border-b border-white/6 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -6 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <Heart size={16} className="text-white fill-white" />
        </motion.div>
        <span className="font-black gradient-text text-sm">
          AI Memory Companion
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <ProfileDropdown />
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

/* ── Contact Page ── */
const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('access_key', '75a575c5-ebd9-478c-bcb0-b5070a81dcb6');
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('subject', form.subject);
      formData.append('message', form.message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError('Failed to send message.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <MiniNav />

      {/* Hero */}
      <section className="pt-16 sm:pt-20 pb-10 sm:pb-12 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo/6 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">
            Get in Touch
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-5 leading-tight">
            We're Here to <span className="gradient-text">Listen</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed px-4">
            Whether you have a question, feedback, or just need support.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-20 sm:pb-24 space-y-10 sm:space-y-14">

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {contactInfo.map((c, i) => {
            const Icon = c.icon;

            return (
              <div
                key={i}
                className={`glass-card rounded-2xl sm:rounded-3xl border ${c.border} p-6 sm:p-7 flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${c.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={c.color} />
                </div>

                <div className="sm:mt-4 min-w-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {c.label}
                  </p>
                  <p className="font-bold text-white text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
                    {c.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    {c.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-3 glass-card rounded-2xl sm:rounded-3xl border border-white/8 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary/12 border border-primary/20 flex items-center justify-center">
                <Send size={18} className="text-primary" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Send a Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  We read every message personally.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <div className="flex flex-col items-center gap-5 py-12 sm:py-16 text-center">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-gray-400">
                    Thank you for reaching out.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-bold text-gray-400 ml-1">Your Message</label>
                    <textarea
                      rows={5}
                      placeholder="Share what's on your mind..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full rounded-xl sm:rounded-2xl bg-white/5 border border-white/8 text-white px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto px-10 shadow-lg shadow-primary/20"
                    loading={loading}
                    icon={!loading && <Send size={18} />}
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl sm:rounded-3xl border border-white/8 p-6 sm:p-7">
              <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
                <Sparkles size={18} className="text-primary" />
                <h3 className="font-black text-white text-base sm:text-lg">
                  Quick Answers
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-white/5 last:border-0 pb-3 sm:pb-4 last:pb-0">
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === i ? null : i)
                      }
                      className="w-full text-left flex items-center justify-between group"
                    >
                      <span className={`text-xs sm:text-sm font-bold transition-colors ${openFaq === i ? 'text-primary' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {faq.q}
                      </span>
                      <ChevronRight size={14} className={`text-gray-600 transition-transform ${openFaq === i ? 'rotate-90 text-primary' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] sm:text-xs text-gray-500 mt-2.5 sm:mt-3 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;