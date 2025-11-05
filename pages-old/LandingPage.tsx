import React from 'react';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div 
      className="min-h-[calc(100vh-88px)] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26,26,26,0.9) 0%, #0A0A0A 80%), url(https://www.transparenttextures.com/patterns/subtle-marble.png)',
      }}
    >
      <div className="max-w-4xl mx-auto animate-[fadeInZoom_1.5s_ease-out_forwards]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-playfair text-[#D4AF37] tracking-widest uppercase">
          Legacy Vault
        </h1>
        <h2 className="mt-6 text-xl md:text-2xl font-light text-[#e0e0e0] tracking-wider">
          10,000 Slots. Infinite Memory.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-gray-400">
          Some will be remembered. Most will be forgotten.
        </p>

        <div className="mt-12">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#0A0A0A] bg-[#D4AF37] rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_#d4af37] hover:shadow-[#D4AF37]/50"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-300 to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Explore The Vault</span>
          </button>
        </div>
      </div>
       <div 
        onClick={onEnter} 
        className="absolute bottom-10 animate-bounce cursor-pointer"
        aria-label="Scroll to slots"
      >
        <ChevronDownIcon className="w-8 h-8 text-[#D4AF37]/50" />
      </div>
    </div>
  );
};

export default LandingPage;