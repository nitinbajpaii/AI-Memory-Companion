import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Shield, Sparkles, Zap, MessageCircle, Star, ChevronRight,
  ArrowRight, Mic, Lock, Brain, Menu, X, Clock, Users, LayoutDashboard
} from 'lucide-react';
import Button from '../components/Button';
import ReviewSection from '../components/ReviewSection';
import ProfileDropdown from '../components/ProfileDropdown';
import Footer from '../components/Footer';

/* ──── DATA ──── */
const features = [
  { icon: Brain,       color: 'text-violet-400', bg: 'bg-violet-500/10',  title: 'Emotionally Aware AI',      desc: 'Our AI reads context and adjusts its tone to provide warmth exactly when you need it.' },
  { icon: Shield,      color: 'text-blue-400',   bg: 'bg-blue-500/10',    title: 'Privacy First',              desc: 'Military-grade encryption keeps your memories and data strictly confidential.' },
  { icon: Mic,         color: 'text-rose-400',   bg: 'bg-rose-500/10',    title: 'Voice Interactions',         desc: 'Speak naturally. Upload audio messages and let AI listen and respond with empathy.' },
  { icon: Heart,       color: 'text-pink-400',   bg: 'bg-pink-500/10',    title: 'Safe Grief Healing',         desc: 'Healthy boundaries guide every conversation, encouraging real-world connections.' },
  { icon: Lock,        color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Secure Cloud Memories',     desc: 'All memories are encrypted and backed up so they are never lost.' },
  { icon: Sparkles,    color: 'text-amber-400',  bg: 'bg-amber-500/10',   title: 'Memory Personalization',     desc: 'The more you share, the more the AI understands and honors your loved one.' },
];

const steps = [
  { n: '01', title: 'Create a Memorial Profile', desc: 'Upload photos, describe personality traits, and share memories to personalise the experience.' },
  { n: '02', title: 'Add Your Memories',          desc: 'Document cherished moments, favorite quotes, and stories so the AI can understand your bond.' },
  { n: '03', title: 'Start a Conversation',        desc: 'Chat, share a voice note, or revisit memories anytime. The AI is always ready to listen.' },
];



/* ──── NAVBAR ──── */
const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Robust check for user session
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/70 backdrop-blur-2xl border-b border-white/6 shadow-xl shadow-black/40' : 'bg-transparent py-2'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group relative">
          <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:shadow-primary/50 transition-all duration-300 relative z-10">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-base gradient-text group-hover:brightness-125 transition-all">AI Memory Companion</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['#features', '#how-it-works', '#testimonials', '#about'].map((href, i) => (
            <a key={href} href={href} className="text-gray-400 hover:text-white transition-colors">
              {['Features', 'How It Works', 'Testimonials', 'About'][i]}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" className="shadow-lg shadow-primary/20 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all">
                  Go to Dashboard <LayoutDashboard size={14} className="ml-1" />
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5">Login</Link>
              <Link to="/signup">
                <Button size="sm" className="shadow-lg shadow-primary/20">Get Started <ArrowRight size={14} /></Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(p => !p)} className="md:hidden w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-dark border-t border-white/6 px-6 py-6 space-y-4"
        >
          {['#features', '#how-it-works', '#testimonials', '#about'].map((href, i) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block text-gray-400 hover:text-white transition-colors py-2">
              {['Features', 'How It Works', 'Testimonials', 'About'][i]}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <Link to="/dashboard" className="w-full">
                <Button size="sm" className="w-full">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full">Login</Button></Link>
                <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">Sign Up</Button></Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

/* ──── MAIN PAGE ──── */
const Landing = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <LandingNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-mesh">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
              >
                <Sparkles size={12} /> Emotionally Intelligent AI
              </motion.div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight mb-6 relative">
                <span className="absolute -inset-x-6 -inset-y-4 bg-primary/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
                <span className="relative">Preserve <span className="gradient-text">Memories</span>.<br />
                Heal with <span className="gradient-text-warm">Warmth</span>.</span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                AI Memory Companion is your emotionally intelligent space to honor loved ones,
                manage cherished memories, and find comfort through AI-driven healing conversations.
              </p>

              <div className="flex flex-wrap items-center gap-4 relative">
                <Link to="/signup">
                  <Button size="lg" className="shadow-2xl shadow-primary/40 group bg-gradient-to-r from-primary to-indigo hover:from-primary-light hover:to-indigo-light text-white px-8">
                    Create a Memorial <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg" className="glass hover:bg-white/10 px-8 transition-colors">
                    See How It Works
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-white/6">
                {[
                  { icon: Users, label: '10,000+ families' },
                  { icon: Shield, label: 'End-to-end encrypted' },
                  { icon: Heart, label: 'Ethically guided' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon size={14} className="text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – Animated chat preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative animate-float">
                {/* Main card */}
                <div className="glass-card rounded-3xl border border-white/8 shadow-2xl shadow-black/50 overflow-hidden glow-primary-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-5 border-b border-white/6 bg-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30">
                      <Heart size={18} className="text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Grandma Rose</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] text-gray-400">AI Companion active</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-5 space-y-4">
                    {[
                      { role: 'user', msg: "I miss her so much today…" },
                      { role: 'ai',   msg: "She loved you deeply. Want to share a favorite memory of her?" },
                      { role: 'user', msg: "She always made apple pie on Sundays." },
                      { role: 'ai',   msg: "That warmth and love she put into those moments lives on in you. ❤️" },
                    ].map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-indigo text-white rounded-br-sm'
                            : 'glass-light border border-white/8 text-gray-200 rounded-bl-sm'
                        }`}>
                          {m.msg}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                      className="flex justify-start"
                    >
                      <div className="glass-light border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                          <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                          <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating stat cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                  className="absolute -left-12 top-1/4 glass-card rounded-2xl border border-white/8 p-4 shadow-xl"
                >
                  <p className="text-2xl font-black text-white mb-0.5">2,847</p>
                  <p className="text-xs text-gray-500 font-medium">Memories preserved</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}
                  className="absolute -right-12 bottom-1/4 glass-card rounded-2xl border border-white/8 p-4 shadow-xl"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Loved by families</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Designed for Healing</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Every feature is built with empathy, respect, and care for your emotional journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-3xl border border-white/6 p-8 hover:border-primary/20 transition-all duration-300 hover-card group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} className={f.color} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">Process</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Three simple steps to begin your healing journey.</p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-indigo/10 border border-primary/20 flex flex-col items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/10">
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{step.n}</span>
                  <span className="text-2xl font-black gradient-text">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DYNAMIC REVIEWS ═══════════ */}
      <ReviewSection />

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Built for the Human Heart</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              We believe grief doesn't need to be faced alone. AI Memory Companion was founded on the belief that
              technology can honor the depth of human relationships. We blend emotional intelligence with safe,
              ethical AI to create a space where love, memory, and healing can coexist.
            </p>
            <Link to="/about">
              <Button variant="outline" size="lg">Learn Our Story <ChevronRight size={18} /></Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA FOOTER ═══════════ */}
      <section className="py-24 md:py-32 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Start Your Journey</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Your loved one's memory<br />deserves a <span className="gradient-text">safe home</span>.
            </h2>
            <p className="text-gray-400 text-lg mb-10">Join thousands of families preserving love through AI.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="xl" className="shadow-2xl shadow-primary/30 group">
                  Create Your Memorial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <Footer />
    </div>
  );
};

export default Landing;
