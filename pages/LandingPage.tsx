import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Database, 
  Layout, 
  LineChart, 
  Users, 
  MessageSquare,
  Sparkles,
  Calendar,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Settings,
  GitBranch,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Magnetic from '../components/Magnetic';
import BackgroundGrid from '../components/BackgroundGrid';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1200 },
];

const CountUp: React.FC<{ end: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; useLocale?: boolean }> = ({ 
  end, 
  duration = 2000, 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  useLocale = false
}) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = easedProgress * end;
      setCount(currentCount);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  const formattedValue = useLocale 
    ? count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) 
    : count.toFixed(decimals);

  return (
    <span ref={elementRef}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

const Reveal: React.FC<{ children: React.ReactNode; animation: string; delay?: string; className?: string }> = ({ children, animation, delay = '', className = '' }) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${hasRevealed ? `${animation} ${delay}` : 'opacity-0'}`}>
      {children}
    </div>
  );
};

interface Project {
  title: string;
  description: string;
  tags: string[];
  images?: string[];
}

const VideoSlide: React.FC<{ src: string; isActive: boolean }> = ({ src, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Pause video when it becomes inactive (slide change)
    if (!isActive && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else if (isActive && videoRef.current && videoRef.current.paused) {
      // Auto-resume when coming back to the slide
      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log('Autoplay blocked', e));
    }
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      // Directly manipulating the DOM element for immediate feedback
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      <video 
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover object-center"
      />
      {isActive && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-30">
           <button 
             onClick={togglePlay}
             className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all hover:scale-110"
             aria-label={isPlaying ? "Pause" : "Play"}
           >
             {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
           </button>
           <button 
             onClick={toggleMute}
             className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all hover:scale-110"
             aria-label={isMuted ? "Unmute" : "Mute"}
           >
             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
           </button>
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.images) {
      setCurrentImageIdx((prev) => (prev + 1) % project.images!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.images) {
      setCurrentImageIdx((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    }
  };

  const descriptionParts = project.description.split('\n\n');

  return (
    <div 
      className="min-w-[340px] md:min-w-[600px] snap-center bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 group flex flex-col h-[680px]"
    >
      {/* Content Area */}
      <div className="p-8 flex flex-col flex-1 min-h-0">
        <h3 className="text-2xl font-bold mb-6 text-[#1d1d1f] dark:text-white group-hover:text-[#a855f7] transition-colors duration-300 leading-tight shrink-0">
          {project.title}
        </h3>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
           <div className={`grid ${descriptionParts.length > 1 ? 'md:grid-cols-2 gap-8' : 'grid-cols-1'}`}>
             {descriptionParts.map((part, idx) => (
               <p key={idx} className="text-[#424245] dark:text-gray-400 leading-relaxed font-medium text-[15px] whitespace-pre-wrap">
                 {part}
               </p>
             ))}
           </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-white/5 shrink-0">
          {project.tags.map((tag, tagIdx) => (
            <span key={tagIdx} className="px-3 py-1 bg-[#f5f5f7] dark:bg-zinc-800 text-[10px] font-bold text-[#86868b] dark:text-gray-400 rounded-full uppercase tracking-widest border border-transparent group-hover:border-purple-100 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Image Area */}
      {project.images && project.images.length > 0 ? (
        <div className="h-[280px] w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden shrink-0 group-hover:opacity-100 transition-opacity mt-auto">
          {project.images.map((img, idx) => {
            const isVideo = img.toLowerCase().endsWith('.mp4');
            const isActive = idx === currentImageIdx;
            
            if (isVideo) {
              return <VideoSlide key={idx} src={img} isActive={isActive} />;
            }
            
            return (
             <img 
               key={idx}
               src={img} 
               alt={`${project.title} - view ${idx + 1}`}
               className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
             />
            );
          })}
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20"></div>
          
          {/* Navigation Arrows */}
          {project.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/40 transition-all z-30 cursor-pointer text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/40 transition-all z-30 cursor-pointer text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots */}
          {project.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {project.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIdx ? 'bg-white w-3' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
         <div className="h-[280px] w-full bg-gradient-to-r from-purple-50/20 to-indigo-50/20 dark:from-purple-900/10 dark:to-indigo-900/10 shrink-0 flex items-center justify-center mt-auto">
             <span className="text-gray-400 dark:text-gray-600 font-medium">No Preview</span>
         </div>
      )}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const partners = [
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440bbfaca6abcfd159a9d9.webp",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440bbf5b256b06a9a3cf7e.png",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440bbfa49c0a2ccc1c4250.jpeg",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440bbf3ec7567e3023b550.png",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440c391d3277abfc81fd35.png",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440d829a634f9a60e32270.png",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440d829a634f5012e32271.png",
    "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69440e03aca6ab507759eca7.png"
  ];

  const projects: Project[] = [
    {
      title: "Client Acquisition Journey / Process Mapping",
      description: "This process automates the full client acquisition journey from first form submission to a paid client ready for onboarding. It captures leads, drives discovery call bookings, manages contract and payment decisions, and ensures clean handoff to onboarding using event based automation.\n\nBusinesses benefit from fewer missed leads, faster deal progression, and zero manual guesswork. The result is a predictable, scalable sales system that improves conversions, accelerates cash flow, and delivers a smooth, professional client experience end to end.",
      tags: ["Automation", "SalesSystem", "BusinessGrowth"],
      images: [
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b152467d74977ee439b7c.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b152467d7496018439b87.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b15247305aa4fdf27907f.png"
      ]
    },
    {
      title: "Crown and Glow Studio – Voice AI Booking & Qualification System",
      description: "Designed and implemented a Voice AI booking and qualification system for Crown and Glow Studio, an in-studio salon offering hair and nail services in New York. The Voice AI answers live inbound calls, identifies the caller’s requested service, applies business rules, and automatically books appointments into the correct round robin calendar for hair or nail services.",
      tags: ["AI Agent Development", "AI-Generated Voice", "Automated Workflow"],
      images: ["https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b202e1fe1662a9147ad90.mp4"]
    },
    {
      title: "Client Acquisition Pipeline",
      description: "This workflow automates how new leads move from first contact to onboarding. After a form submission, contacts are tagged based on their source, a sales opportunity is created or updated, the team is notified, and the lead receives a confirmation email with a booking link.\n\nAs leads book, attend, cancel, or miss appointments, the system automatically updates contact tags and moves opportunities to the correct pipeline stage. Contract activity and invoice payments trigger further updates, ensuring each contact progresses smoothly toward onboarding without manual intervention.",
      tags: ["CRM Automation", "Lead Management", "Pipeline Management"],
      images: [
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b4945a41b87c5764fd9aa.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49450177071fd585bcf5.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49451fe166718c5229bf.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49457f6dcf7e67c41f20.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b494567d74966c050fe76.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49450177079b1f85bcf4.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49458682152d2056b1f6.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b4945017707d26885bcf3.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49457305aa8a56345869.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49457f6dcf7ab6c41f21.png",
        "https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/698b49450708e4f4fdfb20b9.png"
      ]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    },
    {
      title: "Unavailable",
      description: "Will update soon",
      tags: ["Coming Soon"]
    }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 420;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300">
      {/* Shared Background */}
      <BackgroundGrid />

      <div className="relative z-10">
        {/* 1. Hero Section */}
        <section className="relative pt-24 pb-20 px-6 overflow-hidden bg-transparent">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10 text-center lg:text-left">
              <Reveal animation="animate-reveal-up" className="inline-block">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-purple-200 bg-white/50 dark:bg-purple-900/20 dark:border-purple-800 mb-10 relative animate-border-pulse backdrop-blur-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping-custom absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-700 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                  </span>
                  <span className="text-[#a855f7] font-extrabold tracking-wider text-[10px] uppercase">
                    SCALING GOHIGHLEVEL & AUTOMATIONS
                  </span>
                </div>
              </Reveal>
              
              <Reveal animation="animate-reveal-up" delay="animation-delay-200">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-[#1d1d1f] dark:text-white leading-tight">
                  Master Your <br />
                  <div className="h-[1.25em] overflow-hidden pause-on-hover relative my-2 w-full lg:w-[120%] -ml-[0.5%]">
                    <div className="animate-scroll-vertical flex flex-col text-[#967CF0] font-extrabold uppercase tracking-tight">
                      <span className="h-[1.25em] flex items-center justify-center lg:justify-start whitespace-nowrap px-1">CRM PIPELINES</span>
                      <span className="h-[1.25em] flex items-center justify-center lg:justify-start whitespace-nowrap px-1">GHL WORKFLOWS</span>
                      <span className="h-[1.25em] flex items-center justify-center lg:justify-start whitespace-nowrap px-1">SAAS ENGINE</span>
                      <span className="h-[1.25em] flex items-center justify-center lg:justify-start whitespace-nowrap px-1">CRM PIPELINES</span>
                    </div>
                  </div>
                  Operations.
                </h1>
              </Reveal>
              
              <Reveal animation="animate-reveal-up" delay="animation-delay-400">
                <p className="text-xl text-[#424245] dark:text-gray-400 max-w-lg mb-12 mx-auto lg:mx-0 font-medium leading-relaxed">
                  Stop fighting manual tasks. Gen helps business owners optimize Go High Level, build powerful CRM workflows, and automate sales cycles for massive growth.
                </p>
              </Reveal>
              
              <Reveal animation="animate-reveal-up" delay="animation-delay-600">
                <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                  <Magnetic>
                    <Link 
                      to="/submit" 
                      className="purple-gradient text-white px-10 py-4 rounded-full text-lg font-bold hover:scale-[1.02] transition-all shadow-xl shadow-purple-500/10 active:scale-95 inline-block"
                    >
                      Book Discovery Call
                    </Link>
                  </Magnetic>
                  <Magnetic strength={0.2}>
                    <Link 
                      to="/#services" 
                      className="text-[#1d1d1f] dark:text-white font-semibold hover:opacity-70 flex items-center gap-2 group transition-opacity px-4 py-2"
                    >
                      View Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Magnetic>
                </div>

                {/* Partner Logos Area */}
                <div className="mt-16 text-center lg:text-left">
                  <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-[0.25em] mb-8">Partnered with International Businesses</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-8">
                    {partners.map((url, index) => (
                      <img 
                        key={index} 
                        src={url} 
                        alt={`Partner Logo ${index + 1}`} 
                        className="h-10 md:h-14 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 dark:hover:grayscale-0 dark:hover:opacity-100 dark:invert dark:opacity-60 dark:hover:invert-0 hover:scale-110 transition-all duration-500 cursor-pointer p-2 rounded-xl dark:hover:bg-white/10"
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            
            <Reveal animation="animate-reveal-left" delay="animation-delay-200" className="relative mt-20 lg:mt-0 w-full flex items-center justify-center">
               <div className="relative w-full max-w-md mx-auto">
                 <img 
                   src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/694032eb97c0234edc30e72c.png" 
                   alt="Gen" 
                   className="w-full h-auto object-contain drop-shadow-2xl z-10 relative transition-all duration-500 hover:scale-[1.02] hover:drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]"
                 />
                 
                 {/* Floating Badges */}
                 <div className="absolute -bottom-6 -left-4 md:-left-12 z-20 glass-card p-4 rounded-[1.5rem] w-44 md:w-56 scale-90 md:scale-100 shadow-lg transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] cursor-default bg-white/60 dark:bg-zinc-900/60">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                        <Zap className="text-green-600 w-4 h-4 md:w-5 md:h-5 fill-green-600" />
                      </div>
                      <div>
                        <p className="text-lg md:text-2xl font-black text-[#1d1d1f] dark:text-white tracking-tighter leading-none">
                          Velocity <CountUp end={85} prefix="+" suffix="%" />
                        </p>
                        <p className="text-[8px] md:text-[9px] font-normal text-[#86868b] dark:text-gray-400 leading-tight mt-1 uppercase tracking-wider">PIPELINE SPEED</p>
                      </div>
                   </div>
                 </div>

                 <div className="absolute top-[10%] -right-4 md:-right-12 z-20 glass-card p-3 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] w-48 md:w-68 scale-75 md:scale-100 border-white/40 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] cursor-default bg-white/60 dark:bg-zinc-900/60">
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.12em] text-[#a855f7] mb-2 md:mb-3">SYSTEMS ONLINE</p>
                   <div className="flex items-center -space-x-2 md:-space-x-3 mb-3 md:mb-4">
                      <img src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69454b2366d57810080437ba.png" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-white" alt="U1" />
                      <img src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69454b231739662ff0a41852.png" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-white" alt="U2" />
                      <img src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69454aec106fdc2ddffadbc2.png" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-white" alt="U3" />
                      <img src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69454aecaad3600ce270492f.png" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-white" alt="U4" />
                      <img src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69454aec1739662373a414db.png" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover bg-white" alt="U5" />
                   </div>
                   <p className="text-xs md:text-sm font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-1">Architectural Precision</p>
                   <div className="flex items-center gap-1.5 text-[#86868b] dark:text-gray-400 text-[9px] md:text-[10px] font-medium">
                      <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-400" />
                      <span className="uppercase tracking-tighter opacity-80">GHL SYSTEMS ARCHITECT</span>
                   </div>
                 </div>
               </div>
            </Reveal>
          </div>
        </section>

        {/* 2. Scale with Real Data Section */}
        <section id="efficiency" className="py-24 bg-transparent transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal animation="animate-reveal-up" className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 dark:text-white">Optimized Performance</h2>
              <p className="text-[#424245] dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Data driven results from properly structured GoHighLevel environments. We turn chaotic accounts into streamlined revenue engines.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden h-[320px] md:h-[400px] border-purple-100 dark:border-purple-900/30 bg-white/60 dark:bg-zinc-900/60">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold dark:text-white">System Throughput</h3>
                    <p className="text-[#424245] dark:text-gray-400 text-xs md:text-sm">Workflow efficiency increase</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold">
                    <CountUp end={124.5} decimals={1} prefix="+" suffix="%" />
                  </div>
                </div>
                <div className="h-[180px] md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: theme === 'dark' ? '#9ca3af' : '#424245' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: theme === 'dark' ? '#9ca3af' : '#424245' }} dx={-5} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: theme === 'dark' ? '1px solid #333' : 'none', 
                          backgroundColor: theme === 'dark' ? '#18181b' : '#fff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                          fontSize: '11px',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }} 
                        itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                        labelStyle={{ fontWeight: 'bold', color: theme === 'dark' ? '#ccc' : '#333' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#a855f7" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="glass-card rounded-[2.5rem] p-8 flex-1 border-purple-100 dark:border-purple-900/30 bg-white/60 dark:bg-zinc-900/60">
                   <div className="w-10 h-10 purple-gradient rounded-full flex items-center justify-center mb-6">
                     <ShieldCheck className="text-white w-6 h-6" />
                   </div>
                   <h4 className="text-4xl font-bold mb-2 dark:text-white">
                     <CountUp end={99.9} decimals={1} suffix="%" />
                   </h4>
                   <p className="text-[#424245] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">UPTIME & RELIABILITY</p>
                   <p className="mt-4 text-sm text-[#424245] dark:text-gray-400 leading-relaxed">Stable automation structures that do not break under scale.</p>
                </div>
                <div className="glass-card rounded-[2.5rem] p-8 flex-1 border-indigo-100 dark:border-indigo-900/30 bg-white/60 dark:bg-zinc-900/60">
                   <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6">
                     <Users className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
                   </div>
                   <h4 className="text-4xl font-bold mb-2 dark:text-white">
                     <CountUp end={500} suffix="+" />
                   </h4>
                   <p className="text-[#424245] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">HOURS RECLAIMED</p>
                   <p className="mt-4 text-sm text-[#424245] dark:text-gray-400 leading-relaxed">Monthly administrative time saved through intelligent workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Elite Solutions Grid */}
        <section id="services" className="py-24 bg-transparent transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal animation="animate-reveal-up" className="max-w-2xl mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1d1d1f] dark:text-white">GHL Architectural Services</h2>
              <p className="text-xl text-[#424245] dark:text-gray-400 font-medium leading-relaxed">
                We provide enterprise grade configuration for HighLevel. From foundational setup to complex logic engineering.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { icon: <Database />, title: "Account Infrastructure", slug: "account-infrastructure", desc: "Complete sub-account setup including domains, mailgun configuration, and security compliance protocols.", color: "purple" },
                 { icon: <GitBranch />, title: "Advanced Workflows", slug: "advanced-workflows", desc: "Complex automation logic using internal triggers, webhooks, and conditions to handle leads automatically.", color: "indigo" },
                 { icon: <Zap />, title: "Pipeline Engineering", slug: "pipeline-engineering", desc: "Structured deal tracking stages that ensure no lead is ever lost in the sales process.", color: "orange" },
                 { icon: <LineChart />, title: "Custom Dashboards", slug: "custom-dashboards", desc: "High level reporting views to track ROI, lead velocity, and team performance directly inside your GHL instance.", color: "green" },
                 { icon: <Layout />, title: "Snapshot Development", slug: "snapshot-development", desc: "Proprietary snapshots built for agencies to deploy proven systems to sub accounts in seconds.", color: "blue" },
                 { icon: <Settings />, title: "System Audits", slug: "system-audits", desc: "Deep dive analysis of existing accounts to identify bottlenecks, broken automations, and optimization opportunities.", color: "pink" }
               ].map((item, i) => (
                 <Link 
                   to={`/services/${item.slug}`} 
                   key={i} 
                   className={`glass-card rounded-[2rem] p-8 transition-all duration-300 group border border-gray-100 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 hover:scale-[1.02] cursor-pointer`}
                 >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 rounded-2xl flex items-center justify-center group-hover:bg-${item.color}-600 group-hover:text-white transition-all`}>
                        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-2 duration-300">
                        <ArrowRight className={`w-5 h-5 text-${item.color}-500 dark:text-${item.color}-400`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#1d1d1f] dark:text-white group-hover:text-[#a855f7] transition-colors">{item.title}</h3>
                    <p className="text-[#424245] dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                 </Link>
               ))}
            </div>
          </div>
        </section>

        {/* 3.5 Projects Horizontal Scroll Section */}
        <section id="projects" className="py-24 bg-transparent border-b border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <Reveal animation="animate-reveal-up" className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1d1d1f] dark:text-white">Featured Projects</h2>
                <p className="text-lg text-[#424245] dark:text-gray-400 font-medium">
                  A selection of high-impact projects for clients worldwide.
                </p>
              </Reveal>
              <div className="flex gap-2 mt-6 md:mt-0">
                <Magnetic strength={0.2}>
                  <button 
                    onClick={() => scroll('left')}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-colors focus:outline-none backdrop-blur-sm"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                  </button>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <button 
                    onClick={() => scroll('right')}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-colors focus:outline-none backdrop-blur-sm"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                  </button>
                </Magnetic>
              </div>
            </div>
            
            <Reveal animation="animate-reveal-up" delay="animation-delay-200">
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar px-4 -mx-4"
                style={{ scrollBehavior: 'smooth' }}
              >
                {projects.map((project, idx) => (
                  <ProjectCard key={idx} project={project} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Features that Empower Your Team Section */}
        <section id="features" className="py-32 bg-transparent transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <Reveal animation="animate-reveal-up" className="relative">
                <img 
                  src="https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/69455c890190af4582ea97b9.png" 
                  alt="Unified Dashboard Visualization" 
                  className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.01]"
                />
                <div className="absolute -bottom-12 -right-4 glass-card p-6 rounded-[2rem] w-64 hidden md:block border-purple-100 dark:border-purple-900/30 z-10 shadow-2xl bg-white/70 dark:bg-zinc-900/70">
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">Live CRM Data</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold dark:text-white">
                      <CountUp end={67} suffix="%" />
                    </span>
                  </div>
                  <p className="text-[11px] text-[#424245] dark:text-gray-400 font-medium">
                    Monitoring <CountUp end={4567} useLocale={true} /> active opportunities.
                  </p>
                </div>
              </Reveal>

              <div className="space-y-12">
                <Reveal animation="animate-reveal-up">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.1]">
                    Features that<br />
                    <span className="text-[#a855f7] inline-block">Empower</span> Operators.
                  </h2>
                  <p className="mt-8 text-xl text-[#424245] dark:text-gray-400 leading-relaxed font-medium">
                    We implement tools that make managing your GoHighLevel instance effortless. 
                    Systems that work together to provide clarity and control.
                  </p>
                </Reveal>

                <div className="space-y-10">
                  <Reveal animation="animate-reveal-up" delay="animation-delay-200">
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <Layout className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-[#1d1d1f] dark:text-white">Unified GHL Dashboard</h3>
                        <p className="text-[#424245] dark:text-gray-400 text-lg font-medium leading-relaxed">
                          Visualize your pipelines, conversation rates, and appointment bookings in one central view.
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal animation="animate-reveal-up" delay="animation-delay-400">
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        <Zap className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-[#1d1d1f] dark:text-white">Automation Logic</h3>
                        <p className="text-[#424245] dark:text-gray-400 text-lg font-medium leading-relaxed">
                          Robust workflows that handle lead nurturing, follow ups, and status updates without human intervention.
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal animation="animate-reveal-up" delay="animation-delay-600">
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <GitBranch className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-[#1d1d1f] dark:text-white">Scalable Architecture</h3>
                        <p className="text-[#424245] dark:text-gray-400 text-lg font-medium leading-relaxed">
                          Accounts built with clear naming conventions and folder structures, ready for massive scale.
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Process / Deployment Protocol Section */}
        <section className="py-24 bg-transparent transition-colors">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Reveal animation="animate-reveal-up">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-20 text-[#1d1d1f] dark:text-white">
                Deployment Protocol
              </h2>
            </Reveal>

            <div className="relative max-w-5xl mx-auto mb-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 relative z-10">
                <Reveal animation="animate-reveal-up">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-gray-50 dark:border-white/10 mb-8 hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] transition-all relative z-10">
                      <Settings className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 dark:text-white">Audit and Map</h3>
                    <p className="text-sm text-[#424245] dark:text-gray-400 font-medium max-w-[200px]">We analyze your current GHL setup and map out required improvements.</p>
                  </div>
                </Reveal>

                <Reveal animation="animate-reveal-up" delay="animation-delay-200">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#b886ff] rounded-full flex items-center justify-center shadow-xl mb-8 hover:scale-105 transition-transform relative z-10">
                      <Zap className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 dark:text-white">Build and Automate</h3>
                    <p className="text-sm text-[#424245] dark:text-gray-400 font-medium max-w-[200px]">Execution of workflows, pipelines, and integrations within your account.</p>
                  </div>
                </Reveal>

                <Reveal animation="animate-reveal-up" delay="animation-delay-400">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-gray-50 dark:border-white/10 mb-8 hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] transition-all relative z-10">
                      <ShieldCheck className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 dark:text-white">Launch and Scale</h3>
                    <p className="text-sm text-[#424245] dark:text-gray-400 font-medium max-w-[200px]">Final testing, team training, and handover of your optimized system.</p>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal animation="animate-reveal-up" delay="animation-delay-600">
              <Magnetic>
                <Link 
                  to="/submit" 
                  className="inline-flex items-center gap-3 bg-[#0a0a0b] dark:bg-white dark:text-black text-white px-10 py-5 rounded-full text-lg font-bold hover:scale-[1.05] transition-all hover:bg-black dark:hover:bg-gray-200 active:scale-95 shadow-2xl shadow-black/20"
                >
                  Book Discovery Call <ArrowRight className="w-5 h-5" />
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </section>

        {/* 6. Final CTA Banner */}
        <section id="contact" className="py-24 px-6 bg-transparent transition-colors">
          <div className="max-w-6xl mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-[4rem] p-12 md:p-24 text-center shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <div className="inline-block px-5 py-2 rounded-full border border-purple-200 dark:border-purple-800 mb-8 animate-glow-badge bg-white dark:bg-zinc-900">
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-[0.25em]">ENGINEERED FOR SCALABILITY</p>
                </div>

                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-[#1d1d1f] dark:text-white">
                  Unlock the Full Power of <br /> <span className="text-[#a855f7]">GoHighLevel</span> Today.
                </h2>
                <p className="text-xl text-[#424245] dark:text-gray-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                  Stop managing the software and start managing your growth. Let's build a custom automation roadmap that puts your business on autopilot.
                </p>
                <div className="flex flex-col items-center gap-4">
                   <Magnetic>
                     <Link to="/submit" className="bg-[#0a0a0b] dark:bg-white dark:text-black text-white px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 hover:scale-[1.05] transition-transform shadow-2xl shadow-black/10 active:scale-95 inline-block">
                       <Calendar className="w-6 h-6 text-purple-500" />
                       Book Discovery Call
                     </Link>
                   </Magnetic>
                   <p className="text-xs text-[#424245] dark:text-gray-500 font-semibold tracking-wide uppercase opacity-70">Strictly Confidential. No Obligation.</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 dark:bg-purple-900/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-60"></div>
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 dark:bg-indigo-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] opacity-60"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;