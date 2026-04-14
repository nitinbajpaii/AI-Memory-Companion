import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, Sparkles, Shield, Brain } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { authAPI } from '../services/api';

const strengthLevels = [
  { min: 0, label: '', color: '' },
  { min: 1, label: 'Weak',     color: 'bg-red-500' },
  { min: 2, label: 'Fair',     color: 'bg-amber-500' },
  { min: 3, label: 'Good',     color: 'bg-yellow-400' },
  { min: 4, label: 'Strong',   color: 'bg-emerald-500' },
];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)               s++;
  if (/[A-Z]/.test(pw))            s++;
  if (/[0-9]/.test(pw))            s++;
  if (/[^A-Za-z0-9]/.test(pw))    s++;
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
  const navigate                      = useNavigate();

  const strength = getStrength(password);
  const strengthInfo = strengthLevels[strength] || strengthLevels[0];

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
    <div className="min-h-screen bg-dark flex overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-lighter via-dark to-dark-lighter shrink-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-indigo/15 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center shadow-lg shadow-primary/30">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="font-bold text-base gradient-text">AI Memory Companion</span>
          </Link>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                Honor those who<br />live in your <span className="gradient-text">heart</span>.
              </h2>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-sm">
                Create your free account and start preserving beautiful memories today.
              </p>

              <div className="flex flex-col gap-4">
                {perks.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <span className="text-sm text-gray-300">{label}</span>
                    <Check size={14} className="text-emerald-500 ml-auto" />
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
              <div key={label} className="glass-card rounded-2xl border border-white/6 p-4 text-center">
                <p className="text-xl font-black gradient-text mb-1">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-y-auto">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo/8 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold gradient-text">AI Memory Companion</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Create your account</h1>
            <p className="text-gray-500 text-sm sm:text-base">Begin your healing journey. Free forever.</p>
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
                    className="text-gray-500 hover:text-white transition-colors"
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
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= level ? strengthInfo.color : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  {strengthInfo.label && (
                    <p className="text-[10px] text-gray-500">
                      Strength: <span className={`font-bold ${strengthInfo.color.replace('bg-', 'text-')}`}>{strengthInfo.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-primary/20 mt-4"
            >
              {!loading && (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-light transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center mt-6 text-[11px] text-gray-700 max-w-xs mx-auto">
            By signing up, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-500">Terms</a> and{' '}
            <a href="#" className="underline hover:text-gray-500">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
