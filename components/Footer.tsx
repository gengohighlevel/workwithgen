import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const isSpecialPage = pathname === '/submit' || pathname === '/booking';

  return (
    <footer className="relative z-50 bg-[#f5f5f7] dark:bg-zinc-950 pt-24 pb-12 px-6 border-t border-gray-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isSpecialPage ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-12 mb-24`}>
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                <img 
                  src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/692ae4452b865e8154ad422d.png" 
                  alt="Work with Gen" 
                  className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
                />
                <span className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">Work with Gen</span>
              </Link>
              <p className="text-[#86868b] dark:text-gray-400 max-w-sm text-[15px] leading-relaxed font-medium">
                Empowering agencies and business owners with elite GoHighLevel architecture. 
                We bridge the gap between complex automation and revenue generation.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#86868b] dark:text-gray-400 hover:scale-110 hover:border-gray-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white transition-all duration-300 shadow-sm">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#86868b] dark:text-gray-400 hover:scale-110 hover:border-gray-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white transition-all duration-300 shadow-sm">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#86868b] dark:text-gray-400 hover:scale-110 hover:border-gray-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white transition-all duration-300 shadow-sm">
                <span className="sr-only">Facebook</span>
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#86868b] dark:text-gray-400 hover:scale-110 hover:border-gray-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white transition-all duration-300 shadow-sm">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1d1d1f] dark:text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-[13px] font-medium text-[#86868b] dark:text-gray-400">
               <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-default">info@connect.workwithgen.space</li>
               <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-default">Silang, Cavite, Philippines</li>
            </ul>
          </div>

          {!isSpecialPage && (
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1d1d1f] dark:text-white mb-6">Links</h4>
              <ul className="space-y-4 text-[13px] font-medium text-[#86868b] dark:text-gray-400">
                 <li><Link to="/#efficiency" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Efficiency</Link></li>
                 <li><Link to="/#services" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Services</Link></li>
                 <li><Link to="/#projects" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Projects</Link></li>
                 <li><Link to="/#features" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Features</Link></li>
                 <li><Link to="/#contact" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Contact</Link></li>
                 <li><Link to="/submit" className="text-[#a855f7] hover:text-[#9333ea] font-bold transition-colors">Book a Call</Link></li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-white/10 gap-4">
          <p className="text-[11px] font-medium text-[#86868b] dark:text-gray-500">© 2024 Work With Gen. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] font-medium text-[#86868b] dark:text-gray-500">
            <a href="#" className="hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;