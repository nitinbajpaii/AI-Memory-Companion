import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Shield, Sparkles, Users, Brain, ArrowRight,
  Star, CheckCircle2, Mic, Lock, Zap, Globe,
} from 'lucide-react';
import Button from '../components/Button';
import Footer from '../components/Footer';

/* ── Data ── */
const values = [
  {
    icon: Heart,   color: 'text-pink-400',    bg: 'bg-pink-500/10',   border: 'border-pink-500/15',
    title: 'Compassionate AI',
    desc: 'Every interaction is designed to feel warm, human, and respectful of your grief journey.',
  },
  {
    icon: Shield,  color: 'text-blue-400',    bg: 'bg-blue-500/10',   border: 'border-blue-500/15',
    title: 'Ethical Boundaries',
    desc: 'We encourage real connections and healthy grief. AI supports, but never replaces human love.',
  },
  {
    icon: Brain,   color: 'text-violet-400',  bg: 'bg-violet-500/10', border: 'border-violet-500/15',
    title: 'Emotionally Aware',
    desc: 'Our AI adapts its tone and responses based on the emotional context of your messages.',
  },
  {
    icon: Lock,    color: 'text-emerald-400', bg: 'bg-emerald-500/10',border: 'border-emerald-500/15',
    title: 'Privacy by Design',
    desc: 'Your memories are encrypted end-to-end and are never used to train external AI models.',
  },
];

const stats = [
  { icon: Users,    value: '10,000+', label: 'Families helped',       color: 'text-violet-400' },
  { icon: Heart,    value: '250K+',   label: 'Memories safely stored', color: 'text-pink-400'   },
  { icon: Star,     value: '4.9 ★',   label: 'Average user rating',   color: 'text-amber-400'  },
  { icon: Globe,    value: '40+',     label: 'Languages supported',   color: 'text-blue-400'   },
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
const MiniNav = () => (
  <nav className="glass-dark border-b border-white/6 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
    <Link to="/" className="flex items-center gap-2.5">
      <motion.div whileHover={{ scale: 1.1, rotate: -6 }} className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25">
        <Heart size={16} className="text-white fill-white" />
      </motion.div>
      <span className="font-black gradient-text text-sm">AI Memory Companion</span>
    </Link>
    <div className="flex items-center gap-3">
      <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
      <Link to="/signup"><Button size="sm">Get Started</Button></Link>
    </div>
  </nav>
);

/* ── About Page ── */
const About = () => (
  <div className="min-h-screen bg-dark text-white">
    <MiniNav />

    <div className="max-w-5xl mx-auto px-6 md:px-8 py-20 space-y-20">

      {/* ── Hero ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="text-center relative"
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl -z-10" />
        <div className="absolute top-10 right-1/3 w-60 h-60 bg-indigo/6 rounded-full blur-3xl -z-10" />

        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          Our Mission
        </span>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Built for the <span className="gradient-text">Human Heart</span>
        </h1>
        <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
          AI Memory Companion was founded on a simple belief: grief doesn't need to be faced alone.
          We blend emotional intelligence with ethical AI to create a space where love, memory, and healing coexist.
        </p>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {stats.map(({ icon: Icon, value, label, color }, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -5, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="glass-card rounded-3xl border border-white/6 hover:border-primary/20 p-7 text-center flex flex-col items-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon size={22} className={color} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 font-medium text-center leading-tight">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Why We Built This ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl border border-white/6 p-10 bg-gradient-to-br from-primary/5 to-transparent"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-indigo" />
              <h2 className="text-3xl font-black text-white">Why We Built This</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-5">
              After losing loved ones and struggling to find a place to honor memories digitally,
              our founders realized that technology had a responsibility to serve the human spirit —
              not just productivity. Grief is universal, yet profoundly personal.
            </p>
            <p className="text-gray-400 leading-relaxed">
              AI Memory Companion exists to give every person a safe, private, and emotionally intelligent
              space to celebrate life, process loss, and find comfort in memories.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Mic,      label: 'Voice Companion', color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { icon: Heart,    label: 'Memory Keeper',   color: 'text-pink-400',   bg: 'bg-pink-500/10'   },
              { icon: Shield,   label: 'Fully Private',   color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
              { icon: Sparkles, label: 'AI-Powered',      color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
              { icon: Zap,      label: 'Instant Replies', color: 'text-emerald-400',bg: 'bg-emerald-500/10'},
              { icon: Globe,    label: 'Multilingual',    color: 'text-sky-400',    bg: 'bg-sky-500/10'    },
            ].map(({ icon: Icon, label, color, bg }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl ${bg} border border-white/6 text-sm font-semibold text-white`}
              >
                <Icon size={15} className={color} />
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Values Grid ── */}
      <div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">Values</span>
          <h2 className="text-4xl font-black text-white">What We Stand For</h2>
        </motion.div>

        <motion.div
          initial="hidden"
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
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`glass-card rounded-3xl border ${v.border} p-7 flex gap-5 hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={26} className={v.color} />
                </div>
                <div>
                  <h3 className="font-black text-white mb-2 text-lg">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Ethical AI Statement ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="glass-card rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-10"
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
            <Shield size={22} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Our Ethical AI Commitment</h2>
            <p className="text-sm text-gray-500 mt-0.5">We take responsibility seriously.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ethicalPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 text-sm text-gray-300 bg-white/3 rounded-2xl p-4 border border-white/5"
            >
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              {point}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center"
      >
        <div className="glass-card rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/6 to-indigo/3 p-12">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-16 h-16 rounded-3xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
          >
            <Heart size={30} className="text-primary fill-primary/30" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Begin Your Healing Journey</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
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

export default About;
