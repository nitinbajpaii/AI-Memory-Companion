import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="max-w-7xl mx-auto p-6 md:p-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimal Dashboard Footer */}
          <footer className="px-6 md:px-8 py-6 border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                <Heart size={10} className="text-primary fill-primary" />
                <span>AI Memory Companion © 2026</span>
              </div>
              <p className="text-[11px] text-gray-700">Built with care for emotional healing</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
