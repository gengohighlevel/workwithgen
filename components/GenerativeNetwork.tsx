import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * GenerativeNetwork Component
 * 
 * A high-performance HTML5 Canvas background featuring a connected network of nodes.
 * 
 * CONFIGURATION:
 * - Particle Count: Dynamic based on screen area (Resolution / 15000)
 * - Connection Distance: 150px
 * - Mouse Interaction Radius: 200px
 * - Speed: Random float between -0.35 and 0.35
 */
const GenerativeNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Configuration for themes
  const config = {
    light: {
      bg: '#f8fafc',      // Slate 50
      node: '203, 213, 225', // Slate 300 (RGB)
      line: '203, 213, 225', // Slate 300 (RGB)
    },
    dark: {
      bg: '#0f172a',      // Slate 900
      node: '56, 189, 248', // Sky 400 (RGB)
      line: '56, 189, 248', // Sky 400 (RGB)
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    let particles: Particle[] = [];

    // Mouse state
    const mouse = { x: -1000, y: -1000, radius: 200 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 0.7 - 0.35; // Speed X
        this.vy = Math.random() * 0.7 - 0.35; // Speed Y
        this.size = Math.random() * 1.5 + 1;  // Radius
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        // Movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x > width || this.x < 0) this.vx = -this.vx;
        if (this.y > height || this.y < 0) this.vy = -this.vy;

        // Mouse interaction (Repel)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw(color: string) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${color})`;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      // Calculate particle count based on screen area to keep performance consistent
      const particleCount = (width * height) / 15000; 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      const currentTheme = theme === 'dark' ? config.dark : config.light;

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.update();
        p.draw(currentTheme.node);

        // Draw connections
        for (let j = i; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // Connection threshold
          if (distance < 150) {
            ctx.beginPath();
            // Opacity based on distance (closer = more opaque)
            let opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(${currentTheme.line}, ${opacity * 0.5})`; 
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // Initial setup
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run effect only when theme changes isn't strictly necessary if we read ref, but good for cleanliness

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 transition-colors duration-700 pointer-events-none"
      style={{ 
        backgroundColor: theme === 'dark' ? config.dark.bg : config.light.bg 
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
};

export default GenerativeNetwork;