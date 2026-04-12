import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Zap, MessageCircle } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="text-primary fill-primary" size={24} />
          <span className="font-bold text-xl gradient-text">AI Memory Companion</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#mission" className="hover:text-white transition-colors">Mission</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Emotionally Intelligent AI
            </span>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Heal with <span className="gradient-text">Memories</span>,<br />
              Supported by AI.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              AI Memory Companion is your emotionally intelligent space to honor loved ones, 
              manage memories, and find comfort through AI-driven healing.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link to="/signup">
                <Button className="h-14 px-10 text-lg">Create a Memorial</Button>
              </Link>
              <Button variant="secondary" className="h-14 px-10 text-lg border border-white/10">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 glass p-4">
               <div className="bg-[#1e293b] rounded-2xl w-full aspect-video flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1600" 
                    alt="App Preview" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-left">
                    <div className="glass p-6 rounded-2xl border border-white/20 max-w-md shadow-2xl">
                      <div className="flex gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <MessageCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white mb-1">Remembering Grandma...</p>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[70%] h-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm italic">"She always said, 'Love is the only thing that travels through time.'"</p>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-[#0f172a] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Designed for Healing</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Our tools are built with empathy and respect for your journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="text-primary" size={32} />,
                title: "Emotionally Aware",
                desc: "Our AI understands your mood and adjusts its tone to provide appropriate comfort."
              },
              {
                icon: <Shield className="text-primary" size={32} />,
                title: "Privacy First",
                desc: "Your memories and data are encrypted and kept strictly confidential."
              },
              {
                icon: <Zap className="text-primary" size={32} />,
                title: "Healthy Boundaries",
                desc: "We encourage real-world connections and healthy ways to process grief."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-3xl glass border border-white/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Heart className="text-primary fill-primary" size={24} />
            <span className="font-bold text-xl gradient-text">AI Memory Companion</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 AI Memory Companion. All rights reserved.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
