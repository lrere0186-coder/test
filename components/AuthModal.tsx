'use client';
import React from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-[fadeInZoom_0.3s_ease-out]">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-[#D4AF37]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-playfair font-bold text-[#F5F5F0] mb-3">
            Authentication Required
          </h2>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            You must be logged in to reserve a slot. Please sign in to continue securing your legacy.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onLogin}
              className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-yellow-300 text-[#0A0A0A] rounded-md font-bold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;