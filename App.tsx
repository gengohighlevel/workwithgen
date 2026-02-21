import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
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