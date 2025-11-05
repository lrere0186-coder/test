import React from 'react';
import CountdownTimer from '../components/CountdownTimer';

const CountdownPage: React.FC = () => {
  // Date de lancement : 15 mars 2025 à 12:00 CET
  const launchDate = new Date('2025-10-15T12:00:00+01:00');

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[#0A0A0A]"
      style={{
        backgroundImage: 'radial-gradient(circle at top, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
      }}
    >
      {/* Logo/Titre */}
      <div className="mb-12 animate-[fadeIn_1.5s_ease-out_forwards]">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-playfair text-[#D4AF37] tracking-widest uppercase mb-4">
          LEGACY VAULT
        </h1>
        <p className="text-xl md:text-2xl font-light text-[#e0e0e0] tracking-wider mt-6">
          Something is coming...
        </p>
      </div>

      {/* Countdown */}
      <div className="mb-12 animate-[fadeInZoom_1.5s_ease-out_forwards]">
        <CountdownTimer targetDate={launchDate} />
      </div>

      {/* Email capture form */}
      <div className="max-w-md mx-auto animate-[fadeIn_2s_ease-out_forwards]">
        <p className="text-lg text-gray-400 mb-6">Get notified when we launch</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <button className="bg-[#D4AF37] text-[#0A0A0A] font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors">
            NOTIFY ME
          </button>
        </div>
      </div>

      {/* Footer text */}
      <div className="mt-16 animate-[fadeIn_2.5s_ease-out_forwards]">
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          10,000 slots • Forever preserved
        </p>
      </div>
    </div>
  );
};

export default CountdownPage;