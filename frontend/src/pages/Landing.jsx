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
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

/* ──── DATA ──── */
const landingColors = {
  primary: '#9f7aea',
  blue: '#60a5fa',
  rose: '#d982b1',
  sage: '#7ea38a',
  amber: '#c99a4b',
};

const features = [
  { icon: Brain,    color: landingColors.primary, title: 'Emotionally Aware AI',      desc: 'Our AI reads context and adjusts its tone to provide warmth exactly when you need it.' },
  { icon: Shield,   color: landingColors.blue,    title: 'Privacy First',              desc: 'Military-grade encryption keeps your memories and data strictly confidential.' },
  { icon: Mic,      color: landingColors.rose,    title: 'Voice Interactions',         desc: 'Speak naturally. Upload audio messages and let AI listen and respond with empathy.' },
  { icon: Heart,    color: landingColors.rose,    title: 'Safe Grief Healing',         desc: 'Healthy boundaries guide every conversation, encouraging real-world connections.' },
  { icon: Lock,     color: landingColors.sage,    title: 'Secure Cloud Memories',      desc: 'All memories are encrypted and backed up so they are never lost.' },
  { icon: Sparkles, color: landingColors.amber,   title: 'Memory Personalization',     desc: 'The more you share, the more the AI understands and honors your loved one.' },
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
  const { reducedMotion } = useTheme();

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

  const mutedStyle = { color: 'var(--text-muted)' };
  const strongStyle = { color: 'var(--text-strong)' };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark border-b shadow-lg' : 'bg-transparent'}`}
         style={{ borderColor: 'var(--border-soft)', boxShadow: scrolled ? '0 10px 40px rgba(15,23,42,0.12)' : undefined }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-3">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-base gradient-text">AI Memory Companion</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['#features', '#how-it-works', '#testimonials', '/about', '/contact'].map((href, i) => {
            const label = ['Features', 'How It Works', 'Testimonials', 'About', 'Contact'][i];
            const isExternal = href.startsWith('/');

            return isExternal ? (
              <Link
                key={href} to={href} style={mutedStyle}
                className="transition-colors hover:underline-offset-4"
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
              >
                {label}
              </Link>
            ) : (
              <a
              key={href} href={href} style={mutedStyle}
              className="transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
            >
                {label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle size="md" />
          {user ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" className="shadow-lg shadow-primary/15 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all">
                  Go to Dashboard <LayoutDashboard size={14} className="ml-1" />
                </Button>
              </Link>
              <div className="h-6 w-px" style={{ background: 'var(--border-soft)' }} />
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition-colors px-3 py-1.5"
                style={mutedStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
              >
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm" className="shadow-lg shadow-primary/15">Get Started <ArrowRight size={14} /></Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle + mini actions */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface-overlay)', color: 'var(--text-muted)' }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
          className="md:hidden glass-dark border-t px-6 py-6 space-y-4"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          {['#features', '#how-it-works', '#testimonials', '/about', '/contact'].map((href, i) => {
            const label = ['Features', 'How It Works', 'Testimonials', 'About', 'Contact'][i];
            const isExternal = href.startsWith('/');

            return isExternal ? (
              <Link key={href} to={href} onClick={() => setMobileOpen(false)} className="block py-2 transition-colors" style={mutedStyle}>
                {label}
              </Link>
            ) : (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-2 transition-colors" style={mutedStyle}>
                {label}
              </a>
            );
          })}
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
  const { reducedMotion } = useTheme();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--surface-bg)' }}>
      <LandingNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-mesh">
        {/* Glow blobs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] blur-[120px] rounded-full pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] blur-[100px] rounded-full pointer-events-none"
          style={{ background: 'color-mix(in srgb, #6366f1 10%, transparent)' }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-8"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                  color: 'var(--color-primary)',
                }}
              >
                <Sparkles size={12} /> Emotionally Intelligent AI
              </motion.div>

              <h1
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight mb-6"
                style={{ color: 'var(--text-strong)' }}
              >
                Preserve <span className="gradient-text">Memories</span>.<br />
                Heal with <span className="gradient-text-warm">Warmth</span>.
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--text-muted)' }}>
                AI Memory Companion is your emotionally intelligent space to honor loved ones,
                manage cherished memories, and find comfort through AI-driven healing conversations.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="shadow-xl shadow-primary/25 group">
                    Create a Memorial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div
                className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t"
                style={{ borderColor: 'var(--border-soft)' }}
              >
                {[
                  { icon: Users, label: '10,000+ families' },
                  { icon: Shield, label: 'End-to-end encrypted' },
                  { icon: Heart, label: 'Ethically guided' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Icon size={14} style={{ color: 'var(--color-primary)' }} />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – Animated chat preview */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative animate-float">
                {/* Main card */}
                <div
                  className="glass-card rounded-3xl border shadow-2xl overflow-hidden glow-primary-sm"
                  style={{ borderColor: 'var(--border-soft)', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.35)' }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-3 p-5 border-b"
                    style={{ borderColor: 'var(--border-soft)' }}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30">
                      <Heart size={18} className="text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>Grandma Rose</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: 'var(--color-accent-sage)' }}
                        />
                        <span className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>AI Companion active</span>
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
                        initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                          style={m.role === 'user'
                            ? { background: 'linear-gradient(135deg, var(--color-primary), #6366f1)', color: 'var(--user-bubble-text)' }
                            : {
                                background: 'var(--ai-bubble-bg)',
                                border: '1px solid var(--ai-bubble-border)',
                                color: 'var(--text-strong)',
                                fontFamily: 'var(--font-serif)',
                              }
                          }
                        >
                          {m.msg}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <motion.div
                      initial={reducedMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex justify-start"
                    >
                      <div
                        className="glass-light border px-4 py-3 rounded-2xl rounded-bl-sm"
                        style={{ borderColor: 'var(--ai-bubble-border)' }}
                      >
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                          <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                          <span className="w-2 h-2 rounded-full typing-dot" style={{ background: 'color-mix(in srgb, var(--color-primary) 60%, #fff 20%)' }} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating stat cards */}
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-12 top-1/4 glass-card rounded-2xl border p-4 shadow-xl"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <p className="text-2xl font-black mb-0.5" style={{ color: 'var(--text-strong)' }}>2,847</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>Memories preserved</p>
                </motion.div>

                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="absolute -right-12 bottom-1/4 glass-card rounded-2xl border p-4 shadow-xl"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        style={{ color: 'var(--color-accent-amber)', fill: 'var(--color-accent-amber)' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>Loved by families</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-8 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 3%, transparent), transparent)' }}
        />
        <div className="max-w-7xl mx-auto">
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
            >Features</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-strong)' }}>Designed for Healing</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Every feature is built with empathy, respect, and care for your emotional journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={reducedMotion ? {} : { y: -6 }}
                  className="glass-card rounded-3xl border p-8 hover-card group"
                  style={{
                    borderColor: 'var(--border-soft)',
                    transition: 'all 300ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${f.color} 20%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-soft)';
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `color-mix(in srgb, ${f.color} 12%, transparent)` }}
                  >
                    <Icon size={26} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>{f.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
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
            >Process</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-strong)' }}>How It Works</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Three simple steps to begin your healing journey.</p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent)' }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div
                  className="w-24 h-24 rounded-3xl border flex flex-col items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, #6366f1 10%, transparent))',
                    borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                    boxShadow: '0 10px 30px color-mix(in srgb, var(--color-primary) 10%, transparent)',
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary-dark)' }}
                  >{step.n}</span>
                  <span className="text-2xl font-black gradient-text">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>{step.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
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
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)',
              }}
            >Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: 'var(--text-strong)' }}>Built for the Human Heart</h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
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
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>Start Your Journey</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ color: 'var(--text-strong)' }}>
              Your loved one's memory<br />deserves a <span className="gradient-text">safe home</span>.
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>Join thousands of families preserving love through AI.</p>
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
