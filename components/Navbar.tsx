import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isSpecialPage = pathname === '/book' || pathname === '/thank-you';

  return (
    <nav className="fixed top-0 w-full z-50 apple-blur border-b border-gray-100 dark:border-white/10 h-14 flex items-center transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto w-full px-6 relative flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity z-10 relative">
          <img 
            src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/692ae4452b865e8154ad422d.png" 
            alt="Work with Gen" 
            className="h-7 w-auto object-contain"
          />
          <span className="text-sm font-semibold tracking-tighter text-[#1d1d1f] dark:text-white">Work with Gen</span>
        </Link>
        
        {/* Center: Navigation Links - Absolutely positioned to ensure perfect centering */}
        {!isSpecialPage && (
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] font-medium text-[#1d1d1f]/80 dark:text-gray-300">
            <Link to="/#efficiency" className="hover:text-black dark:hover:text-white transition-colors">Efficiency</Link>
            <Link to="/#services" className="hover:text-black dark:hover:text-white transition-colors">Services</Link>
            <Link to="/#projects" className="hover:text-black dark:hover:text-white transition-colors">Projects</Link>
            <Link to="/#features" className="hover:text-black dark:hover:text-white transition-colors">Features</Link>
            <Link to="/#contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link>
          </div>
        )}

        {/* Right: Buttons */}
        <div className="flex items-center gap-4 z-10 relative">
          {/* Custom Toggle Switch */}
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            <div 
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-zinc-800" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
            </div>
          </button>

          {!isSpecialPage && (
            <Link 
              to="/book" 
              className="group relative flex items-center bg-[#937BF0]/15 hover:bg-[#937BF0] text-[#1d1d1f] dark:text-white hover:text-white pl-10 pr-4 hover:pl-4 hover:pr-10 py-1.5 rounded-full text-[13px] font-medium transition-all duration-500 overflow-hidden"
            >
              <div className="absolute left-1.5 group-hover:left-[calc(100%-2.125rem)] w-7 h-7 bg-[#937BF0] group-hover:bg-white rounded-full flex items-center justify-center transition-all duration-500 z-10">
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#937BF0] transition-colors duration-500" />
              </div>
              <span className="relative z-0 transition-all duration-500">Book a Call</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;