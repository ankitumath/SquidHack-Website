import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

// Loading component matching the Squid Game theme
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4 font-tech">
    <div className="w-12 h-12 rounded-full border-4 border-squid-pink bg-black flex items-center justify-center text-xl text-squid-pink drop-shadow-[0_0_15px_rgba(249,0,77,0.8)] animate-pulse">
      ◯
    </div>
    <div className="text-gray-400 text-xs tracking-[0.3em] font-bold uppercase">
      LOADING SURVIVAL DATA...
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/frontmen/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
