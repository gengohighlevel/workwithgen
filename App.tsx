import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import FormSubmitPage from './pages/FormSubmitPage';
import BookingPage from './pages/BookingPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './context/ThemeContext';

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure the content is rendered before scrolling
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

// Component to force redirection to home on initial load/refresh
const ForceHomeRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = React.useRef(false);

  useEffect(() => {
    // Only redirect if we are not already at the root and haven't done it yet this session
    // This runs once on mount (page load/refresh)
    if (!hasRedirected.current && location.pathname !== '/') {
      navigate('/', { replace: true });
      hasRedirected.current = true;
    }
  }, []); 

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <ForceHomeRedirect />
        
        <CustomCursor />
        <ScrollToHash />
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <main className="flex-grow pt-12">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit" element={<FormSubmitPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/services/:slug" element={<ServiceDetailsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;