import React from 'react';
import { Slot, SlotStatus } from '../types';

interface SlotCardProps {
  slot: Slot;
  onSelect: (slot: Slot) => void;
  onRelease?: (slotId: number) => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onSelect, onRelease }) => {
  const getStatusConfig = () => {
    switch (slot.status) {
      case SlotStatus.Available:
        return {
          bgClass: 'bg-[#141414] border-green-500/30 hover:border-green-500/70',
          badgeClass: 'bg-green-900/50 text-green-400 border-green-500/50',
          badgeText: 'AVAILABLE',
          priceClass: 'text-green-400',
          buttonClass: 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500 hover:text-black',
          buttonText: 'Reserve Slot',
          glowClass: 'group-hover:border-green-500',
          clickable: true,
        };
      case SlotStatus.Reserved:
        return {
          bgClass: 'bg-[#141414] border-yellow-500/30',
          badgeClass: 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50',
          badgeText: 'RESERVED',
          priceClass: 'text-yellow-400',
          buttonClass: 'bg-yellow-900/50 text-yellow-400',
          buttonText: onRelease ? 'Release' : 'Reserved',
          glowClass: '',
          clickable: !!onRelease,
        };
      case SlotStatus.Sold:
        return {
          bgClass: 'bg-[#111111] border-red-500/30 opacity-70',
          badgeClass: 'bg-red-900/50 text-red-400 border-red-500/50',
          badgeText: 'SOLD',
          priceClass: 'text-red-400 line-through',
          buttonClass: 'bg-red-900/50 text-red-400 cursor-not-allowed',
          buttonText: 'Sold Out',
          glowClass: '',
          clickable: false,
        };
      case SlotStatus.Locked:
        return {
          bgClass: 'bg-[#0a0a14] border-blue-500/30 opacity-60',
          badgeClass: 'bg-blue-900/50 text-blue-400 border-blue-500/50',
          badgeText: 'LOCKED',
          priceClass: 'text-blue-400',
          buttonClass: 'bg-blue-900/50 text-blue-400 cursor-not-allowed',
          buttonText: 'Coming Soon',
          glowClass: '',
          clickable: false,
        };
      default:
        return {
          bgClass: 'bg-[#111111] border-gray-800/50',
          badgeClass: 'bg-gray-900/50 text-gray-400 border-gray-500/50',
          badgeText: 'UNKNOWN',
          priceClass: 'text-gray-400',
          buttonClass: 'bg-gray-900/50 text-gray-400',
          buttonText: 'Unknown',
          glowClass: '',
          clickable: false,
        };
    }
  };

  const config = getStatusConfig();

  const handleClick = () => {
    if (config.clickable) {
      if (slot.status === SlotStatus.Reserved && onRelease) {
        onRelease(slot.id);
      } else if (slot.status === SlotStatus.Available) {
        onSelect(slot);
      }
    }
  };

  const cardClasses = `
    border rounded-lg p-4 flex flex-col justify-between transition-all duration-300 
    transform group relative overflow-hidden
    ${config.bgClass}
    ${config.clickable ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'cursor-not-allowed'}
  `;

  return (
    <div 
      className={cardClasses} 
      onClick={handleClick}
      role={config.clickable ? "button" : "listitem"} 
      aria-label={`Slot number ${slot.id}`}
    >
      <div className={`absolute top-0 left-0 w-full h-full border-2 border-transparent ${config.glowClass} rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-mono text-lg text-[#e0e0e0]">
            SLOT #{String(slot.id).padStart(5, '0')}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${config.badgeClass}`}>
            {config.badgeText}
          </span>
        </div>
        
        {/* ✅ Correction du prix */}
        <p className={`text-3xl font-semibold font-playfair ${config.priceClass}`}>
          €{(slot.price / 100).toLocaleString('fr-FR')}
        </p>

        {slot.status === SlotStatus.Reserved && slot.reservedUntil && (
          <p className="text-xs text-yellow-400 mt-2">
            Expires: {new Date(slot.reservedUntil).toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="relative z-10 mt-6">
        <button
          tabIndex={-1}
          disabled={!config.clickable}
          className={`w-full font-bold py-2 rounded-md transition-colors duration-300 ${config.buttonClass}`}
        >
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};

export default SlotCard;