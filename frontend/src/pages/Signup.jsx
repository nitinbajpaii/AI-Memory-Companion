import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, Sparkles, Shield, Brain } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';

const strengthLevels = [
  { min: 0, label: '',       color: 'transparent' },
  { min: 1, label: 'Weak',   color: '#ef4444' },
  { min: 2, label: 'Fair',   color: '#f59e0b' },
  { min: 3, label: 'Good',   color: '#facc15' },
  { min: 4, label: 'Strong', color: '#10b981' },
];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)                s++;
  if (/[A-Z]/.test(pw))             s++;
  if (/[0-9]/.test(pw))             s++;
  if (/[^A-Za-z0-9]/.test(pw))     s++;
  return s;
};

const perks = [
  { icon: Shield,   label: 'End-to-end encrypted memories' },
  { icon: Heart,    label: 'Emotionally intelligent AI chat' },
  { icon: Brain,    label: 'Personalized grief support' },
  { icon: Sparkles, label: 'Voice note processing' },
];

const Signup = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const { reducedMotion } = useTheme();
  const navigate = useNavigate();

  const strength = getStrength(password);
  const strengthInfo = strengthLevels[strength] || strengthLevels[0];

  const motionT = reducedMotion ? { duration: 0.01 } : { delay: 0.2, duration: 0.5 };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.signup({ name, email, password });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden shrink-0"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--surface-elev) 60%, transparent) 0%, var(--surface-bg) 50%, color-mix(in srgb, var(--surface-elev) 60%, transparent) 100%)',
        }}
      >
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-accent-rose) 20%, transparent) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25">
                <Heart size={18} className="text-white fill-white" />
              </div>
              <span className="font-bold text-base gradient-text">AI Memory Companion</span>
            </Link>
            <ThemeToggle size="md" />
          </div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={motionT}>
              <h2 className="text-3xl xl:text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text-strong)' }}>
                Honor those who<br />live in your <span className="gradient-text-warm">heart</span>.
              </h2>
              <p className="text-sm mb-10 leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
                Create your free account and start preserving beautiful memories today.
              </p>

              <div className="flex flex-col gap-4">
                {perks.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <Check size={14} className="ml-auto" style={{ color: 'var(--color-accent-sage)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10K+',  label: 'Families helped' },
              { value: '250K+', label: 'Memories stored' },
              { value: '99.9%', label: 'Uptime' },
              { value: 'Free',  label: 'Forever plan' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="glass-card rounded-2xl p-4 text-center"
                style={{ border: '1px solid var(--border-soft)' }}
              >
                <p className="text-xl font-black gradient-text mb-1">{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-y-auto">
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reducedMotion ? { duration: 0.01 } : { duration: 0.5 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-md shadow-primary/20">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="font-bold gradient-text">AI Memory Companion</span>
            </Link>
            <ThemeToggle size="sm" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: 'var(--text-strong)' }}>
              Create your account
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
              Begin your healing journey. Free forever.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.25 }}
              className="text-sm p-4 rounded-2xl mb-6 flex items-center gap-3"
              style={{
                background: 'color-mix(in srgb, #ef4444 8%, transparent)',
                border: '1px solid color-mix(in srgb, #ef4444 20%, transparent)',
                color: 'color-mix(in srgb, #e14b4b 40%, var(--text-strong) 60%)',
              }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#ef4444' }} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5" autoComplete="off">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={16} />}
              required
              autoComplete="off"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
              autoComplete="off"
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: strength >= level ? strengthInfo.color : 'var(--border-soft)',
                        }}
                      />
                    ))}
                  </div>
                  {strengthInfo.label && (
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Strength:{' '}
                      <span className="font-bold" style={{ color: strengthInfo.color }}>
                        {strengthInfo.label}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-primary/15 mt-4"
            >
              {!loading && (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
            >
              Sign in
            </Link>
          </p>

          <p className="text-center mt-6 text-[11px] max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
            By signing up, you agree to our{' '}
            <a href="#" className="underline" style={{ color: 'var(--text-strong)' }}>Terms</a>
            {' '}and{' '}
            <a href="#" className="underline" style={{ color: 'var(--text-strong)' }}>Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
