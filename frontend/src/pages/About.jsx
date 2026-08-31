import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Shield, Sparkles, Users, Brain, ArrowRight,
  Star, CheckCircle2, Mic, Lock, Zap, Globe,
} from 'lucide-react';
import Button from '../components/Button';
import Footer from '../components/Footer';
import ProfileDropdown from '../components/ProfileDropdown';
import { useTheme } from '../contexts/ThemeContext';

const colorMap = {
  rose: 'var(--color-accent-rose)',
  indigo: 'color-mix(in srgb, var(--color-primary-dark) 70%, #6366f1 30%)',
  primary: 'var(--color-primary)',
  sage: 'var(--color-accent-sage)',
  amber: 'var(--color-accent-amber)',
  sky: '#38bdf8',
  blue: '#60a5fa',
};

const values = [
  {
    icon: Heart,   color: colorMap.rose,    title: 'Compassionate AI',
    desc: 'Every interaction is designed to feel warm, human, and respectful of your grief journey.',
  },
  {
    icon: Shield,  color: colorMap.blue,    title: 'Ethical Boundaries',
    desc: 'We encourage real connections and healthy grief. AI supports, but never replaces human love.',
  },
  {
    icon: Brain,   color: colorMap.primary, title: 'Emotionally Aware',
    desc: 'Our AI adapts its tone and responses based on the emotional context of your messages.',
  },
  {
    icon: Lock,    color: colorMap.sage,    title: 'Privacy by Design',
    desc: 'Your memories are encrypted end-to-end and are never used to train external AI models.',
  },
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Families helped',       color: colorMap.primary },
  { icon: Heart, value: '250K+',   label: 'Memories safely stored', color: colorMap.rose    },
  { icon: Star,  value: '4.9 ★',   label: 'Average user rating',   color: colorMap.amber   },
  { icon: Globe, value: '40+',     label: 'Languages supported',   color: colorMap.blue    },
];

const featurePills = [
  { icon: Mic,      label: 'Voice Companion', color: colorMap.primary },
  { icon: Heart,    label: 'Memory Keeper',   color: colorMap.rose    },
  { icon: Shield,   label: 'Fully Private',   color: colorMap.blue    },
  { icon: Sparkles, label: 'AI-Powered',      color: colorMap.amber   },
  { icon: Zap,      label: 'Instant Replies', color: colorMap.sage    },
  { icon: Globe,    label: 'Multilingual',    color: colorMap.sky     },
];

const ethicalPoints = [
  'AI is a support tool, not a replacement for professional grief counseling',
  'We never simulate a deceased person\'s personality without explicit consent',
  'All data is owned exclusively by you and can be deleted at any time',
  'We partner with grief counselors to inform our AI\'s design',
  'Clear disclaimers are shown when AI-generated content is displayed',
];

/* ── Animation Variants ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ── Mini Nav ── */
const MiniNav = () => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = null;
  }

  return (
    <nav
      className="glass-dark border-b px-8 py-4 flex items-center justify-between sticky top-0 z-20"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
        <motion.div whileHover={{ scale: 1.1, rotate: -6 }} className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25">
          <Heart size={16} className="text-white fill-white" />
        </motion.div>
        <span className="font-black gradient-text text-sm">AI Memory Companion</span>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <ProfileDropdown />
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >Login</Link>
            <Link to="/signup"><Button size="sm">Get Started</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

/* ── About Page ── */
const About = () => {
  const { reducedMotion } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-bg)' }}>
      <MiniNav />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-8 py-12 sm:py-20 space-y-16 sm:space-y-20">

        {/* ── Hero ── */}
        <motion.div
          initial={reducedMotion ? {} : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center relative"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            <Sparkles size={12} /> Our Mission
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] mb-6"
            style={{ color: 'var(--text-strong)' }}
          >
            Honoring the <span className="gradient-text">Past</span>,<br />
            Supporting your <span className="gradient-text-warm">Future</span>.
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2" style={{ color: 'var(--text-muted)' }}>
            AI Memory Companion was born from a simple belief: that technology should be a
            bridge to healing, not a replacement for human connection.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={reducedMotion ? {} : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass-card rounded-2xl sm:rounded-3xl border p-5 sm:p-8 text-center"
                style={{ borderColor: 'var(--border-soft)' }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
                >
                  <Icon size={20} style={{ color: s.color }} className="sm:w-6 sm:h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black mb-1" style={{ color: 'var(--text-strong)' }}>{s.value}</p>
                <p
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >{s.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Why We Built This ── */}
        <motion.div
          initial={reducedMotion ? {} : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl border p-10"
          style={{
            borderColor: 'var(--border-soft)',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent)',
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-indigo" />
                <h2 className="text-3xl font-black" style={{ color: 'var(--text-strong)' }}>Why We Built This</h2>
              </div>
              <p className="leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                After losing loved ones and struggling to find a place to honor memories digitally,
                our founders realized that technology had a responsibility to serve the human spirit —
                not just productivity. Grief is universal, yet profoundly personal.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                AI Memory Companion exists to give every person a safe, private, and emotionally intelligent
                space to celebrate life, process loss, and find comfort in memories.
              </p>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-3">
              {featurePills.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={i}
                  whileHover={reducedMotion ? {} : { scale: 1.04 }}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border text-sm font-semibold"
                  style={{
                    background: `color-mix(in srgb, ${color} 10%, transparent)`,
                    borderColor: 'var(--border-soft)',
                    color: 'var(--text-strong)',
                  }}
                >
                  <Icon size={15} style={{ color }} />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Values Grid ── */}
        <div>
          <motion.div
            initial={reducedMotion ? {} : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-4"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)',
              }}
            >Values</span>
            <h2 className="text-4xl font-black" style={{ color: 'var(--text-strong)' }}>What We Stand For</h2>
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={reducedMotion ? {} : { y: -5 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="glass-card rounded-3xl border p-7 flex gap-5 hover:shadow-xl transition-all duration-300"
                  style={{ borderColor: `color-mix(in srgb, ${v.color} 20%, transparent)` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${v.color} 12%, transparent)` }}
                  >
                    <Icon size={26} style={{ color: v.color }} />
                  </div>
                  <div>
                    <h3 className="font-black mb-2 text-lg" style={{ color: 'var(--text-strong)' }}>{v.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Ethical AI Statement ── */}
        <motion.div
          initial={reducedMotion ? {} : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card rounded-3xl border p-10"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent)',
          }}
        >
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                boxShadow: '0 10px 30px color-mix(in srgb, var(--color-primary) 10%, transparent)',
              }}
            >
              <Shield size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-strong)' }}>Our Ethical AI Commitment</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>We take responsibility seriously.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ethicalPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-sm rounded-2xl p-4 border"
                style={{
                  color: 'var(--text-muted)',
                  background: 'var(--surface-overlay)',
                  borderColor: 'var(--border-soft)',
                }}
              >
                <CheckCircle2 size={16} style={{ color: colorMap.sage }} className="mt-0.5 shrink-0" />
                {point}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={reducedMotion ? {} : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center"
        >
          <div
            className="glass-card rounded-3xl border p-12"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 6%, transparent), color-mix(in srgb, var(--color-primary-dark) 6%, transparent))',
            }}
          >
            <motion.div
              animate={reducedMotion ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-16 h-16 rounded-3xl border flex items-center justify-center mx-auto mb-6 shadow-xl"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                boxShadow: '0 20px 40px color-mix(in srgb, var(--color-primary) 20%, transparent)',
              }}
            >
              <Heart
                size={30}
                style={{ color: 'var(--color-primary)' }}
                className="fill-primary/30"
              />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--text-strong)' }}>Begin Your Healing Journey</h2>
            <p className="mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Join thousands of families preserving love and finding comfort through AI-powered compassion.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="shadow-xl shadow-primary/25">
                  Create Free Account <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
