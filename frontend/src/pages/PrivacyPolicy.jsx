import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Lock, Brain, Mic, Database, Key,
  Heart, Sparkles, Mail, CheckCircle2, AlertTriangle,
  FileText, Clock, ExternalLink, ArrowRight, UserCheck,
  Trash2, HelpCircle, HardDrive, RefreshCw
} from 'lucide-react';
import Button from '../components/Button';
import Footer from '../components/Footer';
import ProfileDropdown from '../components/ProfileDropdown';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const policyColors = {
  primary: 'var(--color-primary)',
  rose: 'var(--color-accent-rose)',
  sage: 'var(--color-accent-sage)',
  amber: 'var(--color-accent-amber)',
  indigo: '#818cf8',
  blue: '#60a5fa',
};

/* ── Mini Navigation Header ── */
const MiniNav = () => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    if (userStr && userStr !== 'null' && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (_) {
    user = null;
  }

  return (
    <nav
      className="glass-dark border-b px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <Heart size={16} className="text-white fill-white" />
        </motion.div>
        <span className="font-black gradient-text text-sm">AI Memory Companion</span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle size="md" />
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

/* ── Quick Highlights ── */
const highlightCards = [
  {
    icon: Heart,
    color: policyColors.rose,
    title: 'Memorial Preservation',
    description: 'Designed solely for emotional support, reflection, and honoring memories. Never attempts to impersonate or replace a real person.',
  },
  {
    icon: Brain,
    color: policyColors.primary,
    title: 'Transparent AI & Voice',
    description: 'High-speed conversational intelligence powered by Groq and natural voice synthesis powered by ElevenLabs.',
  },
  {
    icon: Lock,
    color: policyColors.sage,
    title: 'Encrypted & Secure',
    description: 'Protected with industry-standard TLS encryption, bcrypt hashed credentials, and JWT token authentication.',
  },
  {
    icon: Trash2,
    color: policyColors.amber,
    title: 'User Ownership & Deletion',
    description: 'Your memories belong exclusively to you. You can export or request full deletion of your account and records anytime.',
  },
];

/* ── Table of Contents Sections ── */
const sections = [
  { id: 'introduction', label: '1. Introduction & Mission' },
  { id: 'information-collected', label: '2. Information We Collect' },
  { id: 'how-we-use-information', label: '3. How We Use Information' },
  { id: 'ai-processing', label: '4. AI Processing (Groq)' },
  { id: 'voice-processing', label: '5. Voice Processing (ElevenLabs)' },
  { id: 'data-storage', label: '6. Data Storage (MongoDB)' },
  { id: 'security-auth', label: '7. Authentication & Security' },
  { id: 'cookies-storage', label: '8. Cookies & Local Storage' },
  { id: 'data-retention', label: '9. Data Retention' },
  { id: 'data-deletion', label: '10. Data Deletion & Control' },
  { id: 'third-party', label: '11. Third-Party Services' },
  { id: 'user-rights', label: '12. Your Rights & Choices' },
  { id: 'children-privacy', label: "13. Children's Privacy" },
  { id: 'policy-changes', label: '14. Changes to This Policy' },
  { id: 'contact-us', label: '15. Contact Us' },
];

const PrivacyPolicy = () => {
  const { reducedMotion } = useTheme();
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-bg)' }}>
      <MiniNav />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-12 pb-14 px-6 md:px-12 border-b" style={{ borderColor: 'var(--border-soft)' }}>
        <div className="absolute inset-0 hero-mesh opacity-50 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-5"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                color: 'var(--color-primary)',
              }}
            >
              <Shield size={14} /> SaaS Privacy &amp; Data Transparency
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: 'var(--text-strong)' }}>
              Privacy <span className="gradient-text">Policy</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              At AI Memory Companion, your memories, heartfelt stories, and peace of mind are treated with the highest dignity and transparency.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: 'var(--text-subtle)' }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card">
                <Clock size={13} style={{ color: 'var(--color-primary)' }} />
                Last Updated: October 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card">
                <FileText size={13} style={{ color: 'var(--color-accent-sage)' }} />
                Effective Date: October 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card">
                <UserCheck size={13} style={{ color: 'var(--color-accent-rose)' }} />
                Applies to: All Web Users &amp; Memorial Creators
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Key Highlights Strip ── */}
      <section className="px-6 md:px-12 py-10 border-b" style={{ borderColor: 'var(--border-soft)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlightCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5"
                      style={{
                        background: `color-mix(in srgb, ${card.color} 15%, transparent)`,
                        color: card.color,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h2 className="font-bold text-sm mb-1.5" style={{ color: 'var(--text-strong)' }}>
                      {card.title}
                    </h2>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Policy Content & Navigation ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 glass-card rounded-2xl p-5 border" style={{ borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-strong)' }}>
                  Table of Contents
                </h3>
              </div>
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all duration-150 flex items-center justify-between ${
                      activeSection === sec.id
                        ? 'font-bold'
                        : 'font-normal hover:bg-[var(--surface-overlay)]'
                    }`}
                    style={{
                      color: activeSection === sec.id ? 'var(--color-primary)' : 'var(--text-muted)',
                      background: activeSection === sec.id ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent',
                    }}
                  >
                    <span className="truncate">{sec.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-5 pt-4 border-t space-y-2 text-xs" style={{ borderColor: 'var(--border-soft)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-strong)' }}>
                  Have questions or privacy requests?
                </p>
                <p style={{ color: 'var(--text-muted)' }}>
                  Reach our dedicated privacy support directly at:
                </p>
                <a
                  href="mailto:support.aimemorycompanion@gmail.com"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <Mail size={13} /> support.aimemorycompanion@gmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Detailed Policy Text */}
          <main className="lg:col-span-8 order-1 lg:order-2 space-y-12 leading-relaxed text-sm" style={{ color: 'var(--text-strong)' }}>

            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Sparkles size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  1. Introduction &amp; Mission Boundaries
                </h2>
              </div>
              <p>
                Welcome to <strong>AI Memory Companion</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;the Service&quot;). We build digital spaces crafted to help individuals remember loved ones, preserve precious memories, record personal anecdotes, and find comfort through compassionate conversational technology.
              </p>
              <div
                className="p-4 rounded-2xl border flex items-start gap-3"
                style={{
                  background: 'color-mix(in srgb, var(--color-accent-amber) 8%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-accent-amber) 25%, transparent)',
                }}
              >
                <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-amber)' }} />
                <div className="space-y-1 text-xs">
                  <p className="font-bold" style={{ color: 'var(--text-strong)' }}>
                    Essential Purpose &amp; Ethical Boundaries
                  </p>
                  <p style={{ color: 'var(--text-muted)' }}>
                    AI Memory Companion is designed exclusively for <strong>emotional support, personal reflection, and memory preservation</strong>. The Service <strong>does NOT attempt to impersonate, recreate, resurrect, or replace a real person</strong>. It is also not a substitute for professional grief therapy, psychological counseling, or psychiatric medical treatment.
                  </p>
                </div>
              </div>
              <p>
                This Privacy Policy explains what information we collect when you access our web application, how that data is processed and stored, how third-party AI and voice technologies interact with your content, and the rights and controls available to you.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-collected" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <FileText size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  2. Information We Collect
                </h2>
              </div>
              <p>
                To provide our memorial and conversational experience, we collect information you directly provide when registering and using the platform:
              </p>

              <div className="space-y-3">
                <div className="glass-card rounded-xl p-4 border" style={{ borderColor: 'var(--border-soft)' }}>
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                    <Key size={15} style={{ color: 'var(--color-primary)' }} /> A. Account Information
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    When you register an account, we collect your name, email address, and a securely salted and hashed representation of your password (via bcrypt). We also store optional profile details you provide to personalize your experience.
                  </p>
                </div>

                <div className="glass-card rounded-xl p-4 border" style={{ borderColor: 'var(--border-soft)' }}>
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--text-accent-rose)' }}>
                    <Heart size={15} style={{ color: 'var(--color-accent-rose)' }} /> B. Memories and User Content
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    You may choose to store memorial profiles, meaningful stories, memorable dates, photographs, favorite sayings, and biographical memories of loved ones. All memorial content is stored specifically to build your private memory bank.
                  </p>
                </div>

                <div className="glass-card rounded-xl p-4 border" style={{ borderColor: 'var(--border-soft)' }}>
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                    <Brain size={15} style={{ color: 'var(--color-primary)' }} /> C. Conversations and Chat Data
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    When you interact with the conversational companion, we store message history, questions, and replies so you can revisit past reflections and maintain conversational continuity.
                  </p>
                </div>

                <div className="glass-card rounded-xl p-4 border" style={{ borderColor: 'var(--border-soft)' }}>
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--color-accent-sage)' }}>
                    <Mic size={15} style={{ color: 'var(--color-accent-sage)' }} /> D. Voice Input and Audio Processing
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    If you use voice input features, audio captured via your device&apos;s microphone is processed into text for conversational understanding. Voice outputs may be synthesized for audio playback. We do not continuously record or monitor audio when the recording feature is inactive.
                  </p>
                </div>
              </div>

              {/* Sensitive Data Notice */}
              <div
                className="p-4 rounded-2xl border flex items-start gap-3 mt-4"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                }}
              >
                <Shield size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                <div className="space-y-1 text-xs">
                  <p className="font-bold" style={{ color: 'var(--text-strong)' }}>
                    Recommendation Regarding Sensitive Personal Information
                  </p>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Because conversational logs and memories are designed for emotional reflection, <strong>users should avoid submitting highly sensitive information</strong>—such as national identification numbers, bank account or credit card numbers, passwords, medical diagnosis codes, or confidential legal documents—into memorial narratives or chat messages unless strictly necessary.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. How We Use Information */}
            <section id="how-we-use-information" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <RefreshCw size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  3. How We Use Information
                </h2>
              </div>
              <p>We use the data we collect solely for the following legitimate service operations:</p>
              <ul className="space-y-2 list-none">
                {[
                  'To deliver, maintain, and personalize your memorial profiles and memory entries.',
                  'To generate context-aware, emotionally sensitive conversational responses using specialized AI endpoints.',
                  'To synthesize high-fidelity voice playback corresponding to companion responses.',
                  'To authenticate your identity, prevent unauthorized access, and protect your account session.',
                  'To diagnose technical defects, monitor platform stability, and respond to user support inquiries.',
                  'To respect user deletion requests and enforce our service safety standards.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-sage)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                We do not sell, rent, or trade your personal memories, transcripts, or personal data to data brokers or advertising exchanges.
              </p>
            </section>

            {/* 4. AI Processing (Groq) */}
            <section id="ai-processing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Brain size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  4. AI Processing (Groq)
                </h2>
              </div>
              <p>
                Our companion responses are generated using artificial intelligence powered by <strong>Groq</strong>, an ultra-fast AI inference platform.
              </p>
              <div className="glass-card rounded-2xl p-4 border space-y-2 text-xs" style={{ borderColor: 'var(--border-soft)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-strong)' }}>
                  How Conversational Context is Processed with Groq:
                </p>
                <ul className="space-y-1.5 list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li>When you send a prompt, relevant conversational context and selected memory points are transmitted via encrypted API requests to Groq inference servers to formulate a gentle, contextually relevant response.</li>
                  <li>AI-generated text is returned immediately to your interface for real-time display and storage in your personal timeline.</li>
                  <li>Groq processes this data on our behalf strictly to produce inference results; user conversation data transmitted through our API integration is not used to train public foundational AI models.</li>
                </ul>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                Please be aware that while Groq generates high-quality linguistic output, AI responses may occasionally make factual assumptions. Users retain ultimate discretion over their memorial documentation.
              </p>
            </section>

            {/* 5. Voice Processing (ElevenLabs) */}
            <section id="voice-processing" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Mic size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  5. Voice Processing (ElevenLabs)
                </h2>
              </div>
              <p>
                To provide natural, calming auditory experiences, AI Memory Companion integrates with <strong>ElevenLabs</strong> for speech synthesis and text-to-speech rendering.
              </p>
              <div className="glass-card rounded-2xl p-4 border space-y-2 text-xs" style={{ borderColor: 'var(--border-soft)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-strong)' }}>
                  How Voice Data is Handled:
                </p>
                <ul className="space-y-1.5 list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li>When text-to-speech playback is activated, the response text is transmitted to ElevenLabs API endpoints to generate synthetic speech audio.</li>
                  <li>Audio streams are transmitted back through secure connections for immediate playback within your browser.</li>
                  <li>Audio processing occurs on-demand and is utilized solely to facilitate the vocal companion features chosen by the user.</li>
                </ul>
              </div>
            </section>

            {/* 6. Data Storage (MongoDB) */}
            <section id="data-storage" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Database size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  6. Data Storage &amp; Database Infrastructure (MongoDB)
                </h2>
              </div>
              <p>
                All structured user data, memorial descriptions, settings, and conversation logs are housed in secure cloud databases managed via <strong>MongoDB</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="glass-card p-3.5 rounded-xl border" style={{ borderColor: 'var(--border-soft)' }}>
                  <p className="font-bold mb-1" style={{ color: 'var(--text-strong)' }}>Database Isolation</p>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Each record is strictly associated with your authenticated User ID, ensuring that only you have access to your private memorial entries and chats.
                  </p>
                </div>
                <div className="glass-card p-3.5 rounded-xl border" style={{ borderColor: 'var(--border-soft)' }}>
                  <p className="font-bold mb-1" style={{ color: 'var(--text-strong)' }}>Transport Security</p>
                  <p style={{ color: 'var(--text-muted)' }}>
                    All connections between the application backend and MongoDB databases enforce TLS/SSL encryption, preventing interception in transit.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Authentication & Security */}
            <section id="security-auth" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Lock size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  7. Authentication &amp; Security Measures
                </h2>
              </div>
              <p>
                We employ standard industry security protocols designed to prevent unauthorized access, loss, or disclosure of your information:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl glass-card border" style={{ borderColor: 'var(--border-soft)' }}>
                  <Key size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-strong)' }}>JSON Web Token (JWT) Authentication</span>
                    <span style={{ color: 'var(--text-muted)' }}>User sessions are governed by cryptographically signed JWT tokens. Tokens verify authorization on API requests and expire automatically according to standard session timeout rules.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl glass-card border" style={{ borderColor: 'var(--border-soft)' }}>
                  <Lock size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-sage)' }} />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-strong)' }}>Password Hashing (bcrypt)</span>
                    <span style={{ color: 'var(--text-muted)' }}>Passwords are never stored in plaintext. We pass all account passwords through strong, one-way bcrypt hashing algorithms before saving.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl glass-card border" style={{ borderColor: 'var(--border-soft)' }}>
                  <Shield size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-rose)' }} />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--text-strong)' }}>HTTPS &amp; Transport Encryption</span>
                    <span style={{ color: 'var(--text-muted)' }}>All browser-to-server traffic is transmitted over HTTPS using Transport Layer Security (TLS 1.2+).</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Cookies & Local Storage */}
            <section id="cookies-storage" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <HardDrive size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  8. Cookies &amp; Local Storage
                </h2>
              </div>
              <p>
                Our web application uses client-side browser storage (such as HTML5 <code>localStorage</code>) to enable necessary application functionality:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <li><strong>Session State (<code>user</code> key):</strong> Stores your login token and basic profile metadata so that you remain logged in as you navigate between pages without needing to re-enter credentials repeatedly.</li>
                <li><strong>Theme Preference (<code>ai-memory-theme</code> key):</strong> Remembers whether you selected Light Mode or Dark Mode for a comfortable visual experience.</li>
              </ul>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                We do not deploy third-party advertising cookies, cross-site trackers, or commercial monetization beacons. You may clear your browser&apos;s localStorage at any time through your browser settings, which will log you out of active sessions.
              </p>
            </section>

            {/* 9. Data Retention */}
            <section id="data-retention" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Clock size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  9. Data Retention
                </h2>
              </div>
              <p>
                We retain your account profile, memories, and chat logs for as long as your account remains active. Because memorial records and memories represent cherished life reflections, we keep them available until you choose to modify or delete them.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                If you choose to delete individual memory entries or clear chat history through the in-app interface, those items are purged from active database collections immediately. If an account is closed or deleted, associated memories and dialogue histories are marked for deletion and permanently removed from active operational databases.
              </p>
            </section>

            {/* 10. Data Deletion */}
            <section id="data-deletion" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Trash2 size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  10. Data Deletion &amp; User Control
                </h2>
              </div>
              <p>
                You possess complete autonomy over your personal content and memorial records. You may request data deletion through the following convenient mechanisms:
              </p>
              <div className="space-y-3">
                <div className="glass-card p-4 rounded-xl border flex items-start gap-3" style={{ borderColor: 'var(--border-soft)' }}>
                  <Trash2 size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-rose)' }} />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold" style={{ color: 'var(--text-strong)' }}>
                      In-App Memory Removal
                    </p>
                    <p style={{ color: 'var(--text-muted)' }}>
                      You can delete individual memory items or memorial profiles directly from your <strong>Memories</strong> dashboard at any time.
                    </p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl border flex items-start gap-3" style={{ borderColor: 'var(--border-soft)' }}>
                  <Mail size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold" style={{ color: 'var(--text-strong)' }}>
                      Full Account &amp; Data Erasure Request
                    </p>
                    <p style={{ color: 'var(--text-muted)' }}>
                      To request complete deletion of your account, authentication credentials, conversation history, and all stored memories, please contact our support team at{' '}
                      <a href="mailto:support.aimemorycompanion@gmail.com" className="font-bold underline" style={{ color: 'var(--color-primary)' }}>
                        support.aimemorycompanion@gmail.com
                      </a>{' '}
                      with the subject line <em>&quot;Account Data Deletion Request&quot;</em>. We will verify your ownership and process the complete erasure within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 11. Third-Party Services */}
            <section id="third-party" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <ExternalLink size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  11. Third-Party Services
                </h2>
              </div>
              <p>
                To provide modern, responsive AI companionship, we work with specialized third-party infrastructure providers. Below is a complete disclosure of our primary partners and their roles:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-soft)' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-overlay)' }}>
                      <th className="p-3 font-bold" style={{ color: 'var(--text-strong)' }}>Provider</th>
                      <th className="p-3 font-bold" style={{ color: 'var(--text-strong)' }}>Service Role</th>
                      <th className="p-3 font-bold" style={{ color: 'var(--text-strong)' }}>Data Processed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                    <tr>
                      <td className="p-3 font-semibold" style={{ color: 'var(--text-strong)' }}>Groq</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>AI inference &amp; conversational text generation</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Prompts, message text, and relevant memory context needed for replies</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold" style={{ color: 'var(--text-strong)' }}>ElevenLabs</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Speech synthesis and natural voice output</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Response text converted into synthetic audio playback</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold" style={{ color: 'var(--text-strong)' }}>MongoDB Atlas</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Cloud database hosting</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>User accounts, memorial entries, profile data, encrypted tokens</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold" style={{ color: 'var(--text-strong)' }}>Vercel</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Web application hosting &amp; static delivery</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>Standard web HTTP request logs, IP routing headers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 12. User Rights */}
            <section id="user-rights" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <UserCheck size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  12. User Rights &amp; Choices
                </h2>
              </div>
              <p>Depending on your jurisdiction and applicable data protection regulations, you have key rights regarding your personal information:</p>
              <ul className="space-y-2 list-none text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Right to Access:</strong> You can view all memories, messages, and account details in your dashboard at any time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Right to Rectification:</strong> You can edit profile names, memory text, memorial photos, and settings directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Right to Erasure:</strong> You can remove specific memories or request full account termination and data purge.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Right to Withdraw Consent:</strong> You may discontinue using voice or conversational features at any point.</span>
                </li>
              </ul>
            </section>

            {/* 13. Children's Privacy */}
            <section id="children-privacy" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Shield size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  13. Children&apos;s Privacy
                </h2>
              </div>
              <p>
                AI Memory Companion is intended for general audiences who have reached the age of majority or have appropriate parental/guardian consent. We do not knowingly collect, solicit, or maintain personal information from children under 13 years of age (or under 16 where required by local law).
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                If you believe that a child has provided us with personal information without required consent, please contact us immediately so we can remove the account and associated records promptly.
              </p>
            </section>

            {/* 14. Changes to This Privacy Policy */}
            <section id="policy-changes" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <RefreshCw size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  14. Changes to This Privacy Policy
                </h2>
              </div>
              <p>
                We may periodically update this Privacy Policy to reflect enhancements in our application features, operational infrastructure, or relevant legal requirements. When revisions occur, we will update the &quot;Last Updated&quot; and &quot;Effective Date&quot; at the top of this page.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Your continued use of AI Memory Companion after any updates constitutes your acknowledgment and understanding of the modified policy terms.
              </p>
            </section>

            {/* 15. Contact Us */}
            <section id="contact-us" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                  <Mail size={18} />
                </div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-strong)' }}>
                  15. Contact Us
                </h2>
              </div>
              <p>
                If you have questions, feedback, or data privacy requests regarding this Privacy Policy, our team is readily available to assist you:
              </p>
              <div className="glass-card rounded-2xl p-5 border space-y-3" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-strong)' }}>
                      AI Memory Companion Privacy &amp; Support Team
                    </p>
                    <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                      Email:{' '}
                      <a href="mailto:support.aimemorycompanion@gmail.com" className="font-medium underline" style={{ color: 'var(--color-primary)' }}>
                        support.aimemorycompanion@gmail.com
                      </a>
                    </p>
                    <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={14} style={{ color: 'var(--color-accent-sage)' }} />
                      Support Hours: Monday – Saturday, 9:00 AM – 8:00 PM IST
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Link to="/contact">
                      <Button size="sm" variant="outline">
                        Contact Page <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── Page Footer ── */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
