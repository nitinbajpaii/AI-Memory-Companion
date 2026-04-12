import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, MessageSquare, Link2, Share2, Send, Check, ChevronDown, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Footer from '../components/Footer';

const faqs = [
  { q: 'Is this a replacement for therapy?', a: 'No. AI Memory Companion is a supportive tool for preserving memories and finding comfort. We always recommend professional grief counseling for clinical support.' },
  { q: 'Who can see my memories?', a: 'Only you. Your memories are end-to-end encrypted and never shared with third parties or used to train AI models.' },
  { q: 'What happens if I delete my account?', a: 'All your data — memories, conversations, and profiles — is permanently and immediately deleted from our servers.' },
  { q: 'Is the AI pretending to be my loved one?', a: 'No. The AI uses your memories and profile information to provide empathetic, contextually aware conversations — but it never impersonates your loved one.' },
  { q: 'How do I cancel or pause my account?', a: 'You can pause or delete your account anytime from Settings. There are no hidden cancellation fees.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass-card rounded-2xl border border-white/6 overflow-hidden cursor-pointer hover:border-primary/15 transition-all"
      onClick={() => setOpen(p => !p)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-sm font-semibold text-gray-200">{q}</p>
        <ChevronDown size={16} className={`text-gray-500 shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <nav className="glass-dark border-b border-white/6 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold gradient-text">AI Memory Companion</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link to="/signup"><Button size="sm">Get Started</Button></Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">Contact</span>
          <h1 className="text-5xl md:text-6xl font-black mb-4">We're here to help</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question, concern, or just want to share your experience? Reach out — we read every message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card rounded-3xl border border-white/6 p-8">
              <h2 className="text-2xl font-black text-white mb-6">Send us a message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                  <Button variant="secondary" size="sm" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}>
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Your Name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-white/4 border border-white/8 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none placeholder:text-gray-600 text-sm"
                    />
                  </div>
                  <Button type="submit" size="lg" loading={loading} className="w-full shadow-lg shadow-primary/20">
                    {!loading && (<>Send Message <Send size={16} /></>)}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
            <div className="glass-card rounded-3xl border border-white/6 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Get in touch</h2>
              <div className="space-y-5">
                {[
                  { icon: Mail,          label: 'Email support',    value: 'support@aimemory.app',        href: 'mailto:support@aimemory.app' },
                  { icon: Link2,         label: 'GitHub',           value: 'github.com/ai-memory-app',    href: '#' },
                  { icon: Share2,        label: 'Twitter / X',      value: '@AiMemoryApp',                href: '#' },
                  { icon: MessageSquare, label: 'Live chat',        value: 'Available 9am–6pm IST',       href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 hover:bg-white/6 border border-white/4 hover:border-primary/15 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{value}</p>
                    </div>
                    <ExternalLink size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-emerald-500/15 bg-emerald-500/3 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Check size={20} className="text-emerald-400" />
              </div>
              <p className="text-white font-bold mb-1">24-hour response guarantee</p>
              <p className="text-gray-500 text-sm">We promise to respond to every inquiry within 24 hours, no matter when you reach out.</p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <FaqItem {...faq} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
