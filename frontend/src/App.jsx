import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

/* ── Loading fallback ── */
const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      <p className="text-sm text-gray-600">Loading…</p>
    </div>
  </div>
);

/* ── Route guard ── */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<Landing />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout><Chat /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/memories" element={
            <ProtectedRoute>
              <Layout><MemoryManagement /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
