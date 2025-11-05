'use client';
import React, { useEffect, useState } from 'react';
import PhotoLightbox from '../components/PhotoLightbox';

interface Legacy {
  id: string;
  slot_id: number;
  full_name: string;
  biography: string;
  quote: string;
  status: string;
  birth_date: string | null;
  death_date: string | null;
  created_at: string;
  slots: {
    id: number;
    price: number;
    status: string;
  };
  photos: {
    id: string;
    url: string;
    title: string | null;
    caption: string | null;
  }[];
  timeline_events?: {
    id: string;
    event_date: string;
    event_text: string;
    sort_order: number;
  }[];
}

const ProfilePage: React.FC = () => {
  const [legacy, setLegacy] = useState<Legacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchLegacy = async () => {
      try {
        // Pour l'instant, on prend la première legacy publique comme exemple
        const response = await fetch('/api/legacies/public');
        const data = await response.json();

        if (data.success && data.legacies.length > 0) {
          // Récupérer les détails de la première legacy avec ses photos
          const firstLegacyId = data.legacies[0].id;
          const detailResponse = await fetch(`/api/legacies/public?legacyId=${firstLegacyId}`);
          const detailData = await detailResponse.json();

          if (detailData.success) {
            setLegacy(detailData.legacy);
          }
        }
      } catch (error) {
        console.error('Error fetching legacy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLegacy();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    if (legacy && currentPhotoIndex < legacy.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading legacy...</p>
        </div>
      </div>
    );
  }

  if (!legacy) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-playfair font-bold text-[#F5F5F0] mb-3">
            No Public Legacies
          </h2>
          <p className="text-gray-400">
            There are no public legacies to display yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full mb-4">
            <span className="text-[#D4AF37] text-sm font-medium">Slot #{legacy.slots.id}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-[#F5F5F0] mb-4">
            {legacy.full_name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            {legacy.birth_date && (
              <span>{new Date(legacy.birth_date).getFullYear()}</span>
            )}
            {legacy.birth_date && legacy.death_date && <span>—</span>}
            {legacy.death_date && (
              <span>{new Date(legacy.death_date).getFullYear()}</span>
            )}
            {!legacy.birth_date && !legacy.death_date && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                {legacy.status}
              </span>
            )}
          </div>
        </div>

        {/* Quote */}
        {legacy.quote && (
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-8 mb-12 text-center">
            <svg className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-2xl md:text-3xl font-playfair italic text-[#F5F5F0]">
              "{legacy.quote}"
            </p>
          </div>
        )}

        {/* Photo Gallery */}
        {legacy.photos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-[#F5F5F0] mb-6 text-center">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {legacy.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.title || `Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {legacy.timeline_events && legacy.timeline_events.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-[#F5F5F0] mb-8 text-center">
              Life Timeline
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#D4AF37]/30"></div>

                {/* Timeline events */}
                <div className="space-y-8">
                  {legacy.timeline_events.map((event, index) => (
                    <div key={event.id} className="relative pl-20">
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-[#D4AF37] border-4 border-[#0A0A0A]"></div>

                      {/* Event content */}
                      <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
                        <div className="text-[#D4AF37] font-bold mb-2">{event.event_date}</div>
                        <p className="text-gray-300 leading-relaxed">{event.event_text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Biography */}
        <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-8">
          <h2 className="text-3xl font-playfair font-bold text-[#F5F5F0] mb-6">Biography</h2>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
            {legacy.biography}
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && legacy.photos.length > 0 && (
        <PhotoLightbox
          photos={legacy.photos}
          currentIndex={currentPhotoIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}
    </div>
  );
};

export default ProfilePage;