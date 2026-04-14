import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="flex-1 flex flex-col h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 md:p-8 h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
