'use client';
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import { createClient } from '@/lib/supabase-browser';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ navigateTo, currentPage }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const isCountdownPhase = currentPage === Page.Landing;

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="py-6 px-4 sm:px-8 md:px-12 sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-3xl font-playfair font-bold text-[#D4AF37] cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-105"
          style={{ textShadow: '0 0 8px rgba(212, 175, 55, 0.5)' }}
          onClick={() => navigateTo(Page.Landing)}
        >
          LV
        </div>

        {!isCountdownPhase && (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider">
            <button
              onClick={() => navigateTo(Page.Slots)}
              className="cursor-pointer text-[#F5F5F0] hover:text-[#D4AF37] transition-colors bg-transparent border-none"
            >
              THE SLOTS
            </button>
            <button
              onClick={() => navigateTo(Page.Profile)}
              className="cursor-pointer text-[#F5F5F0] hover:text-[#D4AF37] transition-colors bg-transparent border-none"
            >
              EXAMPLE LEGACY
            </button>
            <button
              onClick={() => navigateTo(Page.Dashboard)}
              className="cursor-pointer text-[#F5F5F0] hover:text-[#D4AF37] transition-colors bg-transparent border-none"
            >
              DASHBOARD
            </button>
            <button
              onClick={() => navigateTo(Page.AllSlots)}
              className="cursor-pointer text-[#F5F5F0] hover:text-[#D4AF37] transition-colors bg-transparent border-none"
            >
              FULL VAULT
            </button>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden md:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-md text-sm font-bold hover:bg-yellow-300 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;