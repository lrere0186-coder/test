'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { User } from '@supabase/supabase-js';

interface Legacy {
  id: string;
  slot_id: number;
  full_name: string;
  biography: string;
  quote: string;
  status: string;
  created_at: string;
  slots: {
    id: number;  // ← C'est l'ID qui contient 1,2,3,4...
    price: number;
    status: string;
  };
  photos: {
    id: string;
    url: string;
    title: string | null;
    caption: string | null;
  }[];
}

interface Stats {
  totalSlots: number;
  totalSpent: number;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [legacies, setLegacies] = useState<Legacy[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSlots: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      try {
        const response = await fetch(`/api/user/legacies?userId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setLegacies(data.legacies);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching legacies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-playfair font-bold text-[#F5F5F0] mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-400 mb-6">
            Please sign in to view your dashboard and manage your legacies.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-[#D4AF37] text-[#0A0A0A] px-8 py-3 rounded-md font-bold hover:bg-yellow-300 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#D4AF37] mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-400">Welcome back, {user.email}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Slots Owned</p>
                <p className="text-3xl font-bold text-[#F5F5F0]">{stats.totalSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Invested</p>
                <p className="text-3xl font-bold text-[#F5F5F0]">
                  {stats.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legacies List */}
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#F5F5F0] mb-6">
            Your Legacies
          </h2>

          {legacies.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F0] mb-2">No Legacies Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't secured any slots in the vault yet. Start preserving your legacy today!
              </p>

              <a
                href="/"
                className="inline-block bg-[#D4AF37] text-[#0A0A0A] px-6 py-3 rounded-md font-bold hover:bg-yellow-300 transition-colors"
              >
                Browse Available Slots
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {legacies.map((legacy: Legacy) => (
                <div
                  key={legacy.id}
                  className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 hover:border-[#D4AF37]/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Photos */}
                    <div className="w-full md:w-48 flex-shrink-0">
                      {legacy.photos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {legacy.photos.slice(0, 4).map((photo, index) => (
                            <img
                              key={photo.id}
                              src={photo.url}
                              alt={photo.title || `Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                          ))}
                          {legacy.photos.length > 4 && (
                            <div className="w-full h-24 bg-[#0A0A0A] rounded-md flex items-center justify-center border border-[#D4AF37]/30">
                              <span className="text-[#D4AF37] font-bold">
                                +{legacy.photos.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-[#0A0A0A] rounded-md flex items-center justify-center border border-[#D4AF37]/30">
                          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#F5F5F0] mb-1">
                            {legacy.full_name}
                          </h3>
                          <p className="text-sm text-[#D4AF37]">
                             Slot #{legacy.slots.id}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                          {legacy.status}
                        </span>
                      </div>

                      {legacy.quote && (
                        <p className="text-gray-300 italic mb-3">
                          "{legacy.quote}"
                        </p>
                      )}

                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {legacy.biography}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Created: {new Date(legacy.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span>{legacy.photos.length} photo(s)</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
