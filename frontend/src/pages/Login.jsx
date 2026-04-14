import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Star, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-dark flex overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-lighter via-dark to-dark-lighter shrink-0">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-indigo/15 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="font-bold text-base gradient-text">AI Memory Companion</span>
          </Link>

          {/* Main quote */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-3xl xl:text-4xl font-black text-white leading-tight mb-6">
                "Grief is the price<br />
                we pay for <span className="gradient-text">love</span>."
              </p>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-sm">
                Welcome back. Your memories, your healing journey, and your loved ones are waiting for you.
              </p>

              {/* Feature pills */}
              <div className="flex flex-col gap-3">
                {[
                  { icon: Shield,   label: 'Bank-level encrypted memories' },
                  { icon: Heart,    label: 'Emotionally intelligent responses' },
                  { icon: Sparkles, label: 'Personalized healing journeys' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Testimonial */}
          <div className="glass-card rounded-2xl border border-white/8 p-5">
            <div className="flex gap-1 mb-3 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-current" />)}
            </div>
            <p className="text-gray-400 text-sm italic leading-relaxed mb-3">
              "AI Memory Companion helped me process grief in ways I never thought possible. It's like having a compassionate friend available 24/7."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">A</div>
              <div>
                <p className="text-xs font-semibold text-white">Amara N.</p>
                <p className="text-[11px] text-gray-600">Healing for 6 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-y-auto">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold gradient-text">AI Memory Companion</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm sm:text-base">Continue your journey of healing and remembrance.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
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
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div className="flex justify-end">
              <a href="#" className="text-xs sm:text-sm text-primary hover:text-primary-light transition-colors">Forgot password?</a>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-primary/20"
            >
              {!loading && (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            New here?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary-light transition-colors">
              Create an account
            </Link>
          </p>

          <p className="text-center mt-6 text-[11px] text-gray-700 max-w-xs mx-auto">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-500">Terms</a> and{' '}
            <a href="#" className="underline hover:text-gray-500">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
