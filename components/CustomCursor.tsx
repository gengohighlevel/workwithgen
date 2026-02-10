import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      
      // Immediate update for the main dot
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName === 'A' || 
                          target.tagName === 'BUTTON' ||
                          target.closest('a') || 
                          target.closest('button');
      
      setIsHovering(!!isClickable);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Animation loop for smooth follower
    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth follow logic (Linear Interpolation)
      // Reduced factor from 0.15 to 0.1 for smoother, more fluid movement
      followerX = lerp(followerX, mouseX, 0.1);
      followerY = lerp(followerY, mouseY, 0.1);
      
      if (follower) {
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(${isClicking ? 0.8 : (isHovering ? 1.5 : 1)})`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (typeof window === 'undefined' || window.innerWidth < 768) return null; // Disable on mobile

  return (
    <>
      {/* Main small dot */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] transition-opacity duration-300 mix-blend-difference bg-white`}
        style={{ 
          opacity: isVisible ? 1 : 0,
          marginTop: -4,
          marginLeft: -4
        }}
      />
      {/* Trailing ring/circle */}
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[9998] transition-opacity duration-300 mix-blend-difference bg-white/20`}
        style={{ 
          opacity: isVisible ? 1 : 0,
          marginTop: -16,
          marginLeft: -16,
          transition: 'transform 0.1s ease-out, opacity 0.3s ease'
        }}
      />
    </>
  );
};

export default CustomCursor;