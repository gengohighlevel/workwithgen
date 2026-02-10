import React, { useEffect, useRef, useState } from 'react';
import { Mail, Clock, MapPin, Calendar, Shield } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';

const Reveal: React.FC<{ children: React.ReactNode; animation: string; delay?: string; className?: string }> = ({ children, animation, delay = '', className = '' }) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasRevealed(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${hasRevealed ? `${animation} ${delay}` : 'opacity-0'}`}>
      {children}
    </div>
  );
};

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black pt-24 pb-32 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Information */}
          <div className="space-y-12 lg:sticky lg:top-32">
            <Reveal animation="animate-reveal-up">
              <div className="space-y-6">
                <span className="text-[#a855f7] font-bold text-[11px] uppercase tracking-[0.25em] block">
                  SYSTEM OPTIMIZATION
                </span>
                <h1 className="text-5xl md:text-[80px] font-extrabold tracking-tighter text-[#1d1d1f] dark:text-white leading-[0.9] flex flex-col">
                  Ready to
                  <span className="text-[#a855f7]">Optimize?</span>
                </h1>
                <p className="text-xl text-[#86868b] dark:text-gray-400 font-medium leading-relaxed max-w-lg mt-6">
                  Whether you are a new GoHighLevel user or an established agency, I am here to bridge the gap between your goals and the platform capabilities. Fill out the form to begin.
                </p>
              </div>
            </Reveal>

            <Reveal animation="animate-reveal-up" delay="animation-delay-200">
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#86868b] dark:text-gray-500 tracking-widest mb-0.5">Email Us</p>
                    <p className="font-bold text-base text-[#1d1d1f] dark:text-white">info@connect.workwithgen.space</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#86868b] dark:text-gray-500 tracking-widest mb-0.5">Availability</p>
                    <p className="font-bold text-base text-[#1d1d1f] dark:text-white">Monday - Friday, 9 AM - 5 PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#86868b] dark:text-gray-500 tracking-widest mb-0.5">Location</p>
                    <p className="font-bold text-base text-[#1d1d1f] dark:text-white">Silang, Cavite, Philippines</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal animation="animate-reveal-up" delay="animation-delay-400">
              <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 border border-gray-200 dark:border-white/10 backdrop-blur-sm max-w-md">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-[#86868b] dark:text-gray-400 leading-relaxed">
                    Typically responds within 24 hours with a calendar link.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Form Container */}
          <Reveal animation="animate-reveal-up" delay="animation-delay-200" className="w-full">
            <div className="flex flex-col gap-8">
              <div className="flex justify-center">
                <div className="px-5 py-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-black text-[#1d1d1f] dark:text-white uppercase tracking-[0.2em]">CRM SECURE CONNECTION</span>
                </div>
              </div>

              {/* Native Inquiry Form Component matching the design */}
              <InquiryForm />
              
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;