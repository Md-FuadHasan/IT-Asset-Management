import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Inventory from './pages/Inventory';
import Distributions from './pages/Distributions';
import Settings from './pages/Settings';
import Ledger from './pages/Ledger';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, AppProvider } from './AppContext';
import { useState, useEffect } from 'react';
import { Menu, Shield } from 'lucide-react';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { currentUser } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsMobileMenuOpen(true);
    window.addEventListener('open-mobile-menu', handleOpen);
    return () => window.removeEventListener('open-mobile-menu', handleOpen);
  }, []);

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <Router>
        <div className="flex min-h-screen bg-surface overflow-hidden">
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[55] md:hidden"
              />
            )}
          </AnimatePresence>

          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          
          {/* Main Content Area */}
          <div className="flex-1 md:ml-64 relative h-screen flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
                <Route path="/ledger" element={<PageWrapper><Ledger /></PageWrapper>} />
                <Route path="/inventory" element={<PageWrapper><Inventory /></PageWrapper>} />
                <Route path="/hub" element={<PageWrapper><Distributions /></PageWrapper>} />
                <Route path="/locations" element={<PageWrapper><Locations /></PageWrapper>} />
                <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </Router>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex-1 flex flex-col overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
