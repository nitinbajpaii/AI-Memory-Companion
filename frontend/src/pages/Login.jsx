import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Star, Sparkles, Sun, Moon } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const { reducedMotion } = useTheme();
  const navigate = useNavigate();

  const motionT = reducedMotion ? { duration: 0.01 } : { delay: 0.2, duration: 0.6 };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
        {/* Hero mesh globs (var based) */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-accent-rose) 22%, transparent) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/25">
                <Heart size={18} className="text-white fill-white" />
              </div>
              <span className="font-bold text-base gradient-text">AI Memory Companion</span>
            </Link>
            <ThemeToggle size="md" />
          </div>

          {/* Main quote */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionT}
            >
              <p
                className="text-3xl xl:text-4xl font-black leading-tight mb-6"
                style={{ color: 'var(--text-strong)' }}
              >
                "Grief is the price<br />
                we pay for <span className="gradient-text-warm">love</span>."
              </p>
              <p className="text-sm mb-10 leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
                Welcome back. Your memories, your healing journey, and your loved ones are waiting for you.
              </p>

              {/* Feature pills */}
              <div className="flex flex-col gap-3">
                {[
                  { icon: Shield,   label: 'Bank-level encrypted memories' },
                  { icon: Heart,    label: 'Emotionally intelligent responses' },
                  { icon: Sparkles, label: 'Personalized healing journeys' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Testimonial */}
          <div
            className="glass-card rounded-2xl p-5"
            style={{ border: '1px solid var(--border-soft)' }}
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-current" style={{ color: 'var(--color-accent-amber)', fill: 'var(--color-accent-amber)' }} />)}
            </div>
            <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              "AI Memory Companion helped me process grief in ways I never thought possible. It's like having a compassionate friend available 24/7."
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                  color: 'var(--color-primary)',
                }}
              >
                A
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-strong)' }}>Amara N.</p>
                <p className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>Healing for 6 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-y-auto">
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 14%, transparent) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reducedMotion ? { duration: 0.01 } : { duration: 0.5 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          {/* Mobile Logo + theme toggle */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-md shadow-primary/20">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="font-bold gradient-text">AI Memory Companion</span>
            </Link>
            <ThemeToggle size="sm" />
          </div>

          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: 'var(--text-strong)' }}>
              Welcome back
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
              Continue your journey of healing and remembrance.
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

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
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

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs sm:text-sm transition-colors"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-primary/15"
            >
              {!loading && (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            New here?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
            >
              Create an account
            </Link>
          </p>

          <p className="text-center mt-6 text-[11px] max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:opacity-80" style={{ color: 'var(--text-strong)' }}>Terms</a>
            {' '}and{' '}
            <a href="#" className="underline hover:opacity-80" style={{ color: 'var(--text-strong)' }}>Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
