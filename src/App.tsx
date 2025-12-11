import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import NavBar from './components/NavBar';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Services from './components/sections/Services';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import ParticleBackground from './components/effects/ParticleBackground';
import MatrixRain from './components/effects/MatrixRain';
import HackerLoader from './components/effects/HackerLoader';
import TerminalModal from './components/ui/TerminalModal';
import ChatBot from './components/ui/ChatBot';
import { scrollToTop } from './utils/helpers';

// Admin imports
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectsManager from './pages/admin/managers/ProjectsManager';
import SkillsManager from './pages/admin/managers/SkillsManager';
import CategoriesManager from './pages/admin/managers/CategoriesManager';
import ProfileManager from './pages/admin/managers/ProfileManager';
import HeroManager from './pages/admin/managers/HeroManager';
import ExperienceManager from './pages/admin/managers/ExperienceManager';
import ThemeManager from './pages/admin/managers/ThemeManager';
import AppointmentManager from './pages/admin/managers/AppointmentManager';
import ServicesManager from './pages/admin/managers/ServicesManager';
import AdminLayout from './layouts/AdminLayout';

import { ContentProvider } from './context/ContentContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  // Wrap everything inside ContentProvider
  return (
    <ContentProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ContentProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [chatBotPurpose, setChatBotPurpose] = useState<string | undefined>(undefined);

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return <HackerLoader onLoadingComplete={() => setLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background effects only for non-admin pages or everywhere if desired. 
          For now, keeping them global but admin has its own opaque background. 
      */}
      <MatrixRain />
      <ParticleBackground />
      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <ChatBot initialPurpose={chatBotPurpose} />

      {/* Hide specific Portfolio Nav on Admin pages just in case, 
          or simpler: Just render it everywhere and Admin page overlays it. 
          Actually, let's conditionally render NavBar if not in admin. 
      */}
      {!location.pathname.startsWith('/admin') && <NavBar />}

      <main className={location.pathname.startsWith('/admin') ? "" : "container mx-auto px-4 overflow-x-hidden"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <section id="home"><Home /></section>
                <section id="about"><About /></section>
                <section id="services"><Services onBookService={(service) => setChatBotPurpose(service)} /></section>
                {/* <section id="experience"><Experience /></section> */}
                <section id="projects"><Projects /></section>
                <section id="skills"><Skills /></section>
                <section id="contact"><Contact /></section>
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="hero" element={<HeroManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="theme" element={<ThemeManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="appointments-manager" element={<AppointmentManager />} />
            </Route>

          </Routes>
        </AnimatePresence>
      </main>

      {!location.pathname.startsWith('/admin') && (
        <footer className="py-6 mt-12 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center text-gray-500 font-mono text-sm">
            <p className="mb-2">© {new Date().getFullYear()} | Code. Create. Conquer.</p>
            <p>Built with React, Three.js and Framer Motion</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;