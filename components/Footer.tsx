
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 sm:px-8 md:px-12 mt-16 border-t border-[#D4AF37]/20">
      <div className="container mx-auto text-center text-xs text-gray-400">
        <p className="font-playfair text-lg text-[#D4AF37] mb-2">LEGACY VAULT</p>
        <p>&copy; {new Date().getFullYear()} Legacy Vault Inc. All rights reserved.</p>
        <p className="mt-2">A permanent record for a fleeting existence.</p>
        <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-[#D4AF37]">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-[#D4AF37]">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
