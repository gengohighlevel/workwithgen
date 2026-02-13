import React from 'react';

const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-[#FAFAFA] dark:bg-[#050505] transition-colors duration-500" />
      
      {/* Video Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          playsInline
          loop
          muted
          className="w-full h-full object-cover opacity-[0.4] dark:opacity-[0.25] transition-opacity duration-700 contrast-125"
          src="https://storage.googleapis.com/msgsndr/Sr99nTAsuyCabfQCL1JQ/media/69430b1136a81350a9b474ff.mp4"
        />
        {/* Gradient Overlay to fade video at bottom for smooth integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent dark:from-[#050505] dark:via-transparent dark:to-transparent opacity-80" />
      </div>

      {/* Top Center Glow (Superfunnels Style) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-purple-600/10 dark:bg-purple-900/15 blur-[120px] rounded-full pointer-events-none z-20 mix-blend-screen" />
      
      {/* Secondary Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none z-20" />
    </div>
  );
};

export default BackgroundGrid;