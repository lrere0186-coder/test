import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-[#e0e0e0] uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold font-mono text-[#D4AF37]">{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="w-full bg-[#1A1A1A] rounded-full h-2.5 border border-[#D4AF37]/20">
        <div 
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%`, boxShadow: '0 0 8px #d4af37' }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
