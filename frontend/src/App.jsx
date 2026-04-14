import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './layouts/Layout';

/* ── Lazy-loaded pages ── */
const Landing           = lazy(() => import('./pages/Landing'));
const Login             = lazy(() => import('./pages/Login'));
const Signup            = lazy(() => import('./pages/Signup'));
const About             = lazy(() => import('./pages/About'));
const Contact           = lazy(() => import('./pages/Contact'));
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const Chat              = lazy(() => import('./pages/Chat'));
const MemoryManagement  = lazy(() => import('./pages/MemoryManagement'));
const Profile           = lazy(() => import('./pages/Profile'));
const Settings          = lazy(() => import('./pages/Settings'));

/* ── Scroll to top on every route change ── */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

/* ── Page transition wrapper ── */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ── Loading fallback ── */
const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative w-14 h-14 mx-auto">
        <div className="absolute inset-0 w-14 h-14 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
      <p className="text-sm text-gray-600">Loading…</p>
    </div>
  </div>
);

/* ── Route guard ── */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
};

/* ── Inner router — needs useLocation so must be child of <Router> ── */
const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/login"   element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup"  element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/about"   element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageTransition><Layout><Dashboard /></Layout></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <PageTransition><Layout><Chat /></Layout></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/memories" element={
              <ProtectedRoute>
                <PageTransition><Layout><MemoryManagement /></Layout></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Layout><Profile /></Layout></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <PageTransition><Layout><Settings /></Layout></PageTransition>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
