import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Users, Brain, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Footer from '../components/Footer';

const values = [
  { icon: Heart,   color: 'text-pink-400',    bg: 'bg-pink-500/10',   title: 'Compassionate AI',    desc: 'Every interaction is designed to feel warm, human, and respectful of your grief journey.' },
  { icon: Shield,  color: 'text-blue-400',    bg: 'bg-blue-500/10',   title: 'Ethical Boundaries',  desc: 'We encourage real connections and healthy grief. AI supports but never replaces human relationships.' },
  { icon: Brain,   color: 'text-violet-400',  bg: 'bg-violet-500/10', title: 'Emotionally Aware',   desc: 'Our AI adapts its tone and responses based on the emotional context of your messages.' },
  { icon: Shield,  color: 'text-emerald-400', bg: 'bg-emerald-500/10',title: 'Privacy by Design',   desc: 'Your memories are encrypted end-to-end and are never used to train external AI models.' },
];

const ethicalPoints = [
  'AI is a support tool, not a replacement for professional grief counseling',
  'We never simulate a deceased person\'s personality without explicit consent',
  'All data is owned exclusively by you and can be deleted at any time',
  'We partner with grief counselors to inform our AI\'s design',
  'Clear disclaimers are shown when AI-generated content is displayed',
];

const About = () => (
  <div className="min-h-screen bg-dark text-white">
    {/* Simple top nav */}
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

    <div className="max-w-5xl mx-auto px-6 md:px-8 py-20">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">Our Mission</span>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Built for the <span className="gradient-text">Human Heart</span>
        </h1>
        <p className="text-gray-400 text-xl leading-relaxed max-w-3xl mx-auto">
          AI Memory Companion was founded on a simple belief: grief doesn't need to be faced alone. 
          We blend emotional intelligence with ethical AI to create a space where love, memory, and healing coexist.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-card rounded-3xl border border-white/6 p-10 mb-12 bg-gradient-to-br from-primary/5 to-transparent"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">Why We Built This</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              After losing loved ones and struggling to find a place to honor memories digitally, 
              our founders realized that technology had a responsibility to serve the human spirit — 
              not just productivity. Grief is universal, yet profoundly personal.
            </p>
            <p className="text-gray-400 leading-relaxed">
              AI Memory Companion exists to give every person a safe, private, and emotionally intelligent 
              space to celebrate life, process loss, and find comfort in memories.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Users,    label: 'Over 10,000 families helped' },
              { icon: Heart,    label: '250,000+ memories safely stored' },
              { icon: Star,     label: '4.9★ average rating from users' },
              { icon: Sparkles, label: 'Available in 40+ languages' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-primary" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-black text-white text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-3xl border border-white/6 p-7 flex gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className={v.color} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ethical AI Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-card rounded-3xl border border-primary/15 bg-primary/3 p-10 mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white">Our Ethical AI Commitment</h2>
        </div>
        <p className="text-gray-400 leading-relaxed mb-8">
          We take our responsibility seriously. AI in emotional contexts requires exceptional care. 
          Here is what we commit to every user:
        </p>
        <div className="space-y-3">
          {ethicalPoints.map((p, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-white mb-4">Ready to begin your healing journey?</h2>
        <p className="text-gray-500 mb-8">Join thousands of families preserving love through AI.</p>
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
    </div>
    <Footer />
  </div>
);

export default About;
