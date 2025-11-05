import React, { useState, useMemo, useEffect } from 'react';
import SlotCard from '../components/SlotCard';
import Pagination from '../components/Pagination';
import { TOTAL_SLOTS } from '../constants';
import { Slot, SlotStatus } from '../types';
import ProgressBar from '../components/ProgressBar';
import AuthModal from '../components/AuthModal';

const SLOTS_PER_PAGE = 12;

interface SlotsAvailablePageProps {
  onSelectSlot: (slot: Slot) => void;
}

const SlotsAvailablePage: React.FC<SlotsAvailablePageProps> = ({ onSelectSlot }) => {
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('number_asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [numberRange, setNumberRange] = useState({ min: '', max: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Charger les slots depuis l'API
  useEffect(() => {
    const fetchSlots = async () => {
  try {
    const response = await fetch('/api/slots/available');
    const data = await response.json();
    if (data.success) {
      // Limiter à 200 slots maximum
      setAllSlots(data.slots.slice(0, 200));
    } else {
          console.error('Failed to fetch slots:', data.error);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
    
    // Recharger toutes les 5 secondes pour voir les expirations
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filtrage + tri
  const filteredAndSortedSlots = useMemo(() => {
    let filteredSlots = [...allSlots];

    // FILTRE CRITIQUE : Seulement les slots Available et Reserved
    filteredSlots = filteredSlots.filter(slot => 
      slot.status === SlotStatus.Available || slot.status === SlotStatus.Reserved
    );

    // Filter by price
    if (priceRange.min) {
      const minPrice = parseInt(priceRange.min);
      if (!isNaN(minPrice)) {
        filteredSlots = filteredSlots.filter(s => s.price >= minPrice);
      }
    }
    if (priceRange.max) {
      const maxPrice = parseInt(priceRange.max);
      if (!isNaN(maxPrice)) {
        filteredSlots = filteredSlots.filter(s => s.price <= maxPrice);
      }
    }

    // Filter by number
    if (numberRange.min) {
      const minNumber = parseInt(numberRange.min);
      if (!isNaN(minNumber)) {
        filteredSlots = filteredSlots.filter(s => s.id >= minNumber);
      }
    }
    if (numberRange.max) {
      const maxNumber = parseInt(numberRange.max);
      if (!isNaN(maxNumber)) {
        filteredSlots = filteredSlots.filter(s => s.id <= maxNumber);
      }
    }

    // Sort
    filteredSlots.sort((a, b) => {
      switch (sortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'number_desc':
          return b.id - a.id;
        case 'number_asc':
        default:
          return a.id - b.id;
      }
    });

    return filteredSlots;
  }, [allSlots, sortOrder, priceRange, numberRange]);

  const totalPages = Math.ceil(filteredAndSortedSlots.length / SLOTS_PER_PAGE);
  const currentSlots = filteredAndSortedSlots.slice(
    (currentPage - 1) * SLOTS_PER_PAGE,
    currentPage * SLOTS_PER_PAGE
  );

  // Stats
  const stats = useMemo(() => {
    const available = allSlots.filter(s => s.status === SlotStatus.Available).length;
    const reserved = allSlots.filter(s => s.status === SlotStatus.Reserved).length;
    const sold = allSlots.filter(s => s.status === SlotStatus.Sold).length;
    const locked = allSlots.filter(s => s.status === SlotStatus.Locked).length;
    return { available, reserved, sold, locked };
  }, [allSlots]);


  const handleSelectSlot = async (slot: Slot) => {
  if (slot.status === SlotStatus.Available) {
    // Vérifier si l'utilisateur est connecté
    const supabase = (await import('@/lib/supabase-browser')).createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Naviguer IMMÉDIATEMENT vers la page de réservation (optimistic UI)
    onSelectSlot(slot);

    // Faire l'appel API en arrière-plan
    try {
      const response = await fetch('/api/slots/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id })
      });
      const data = await response.json();
      
      if (!data.success) {
        // Si ça échoue, revenir en arrière
        alert(data.error || 'Failed to reserve slot. Please try again.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error reserving slot:', error);
      alert('An error occurred. Please try again.');
      window.location.reload();
    }
  }
};


  return (
    <div className="container mx-auto px-4 py-12 animate-[fadeIn_1s_ease-out]">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-playfair font-black text-[#F5F5F0] tracking-wide">The Vault</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Browse the 10,000 unique slots. Each one a vessel for a permanent legacy.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">{stats.available}</div>
          <div className="text-sm text-gray-400">Available</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.reserved}</div>
          <div className="text-sm text-gray-400">Reserved</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">{stats.sold}</div>
          <div className="text-sm text-gray-400">Sold</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.locked}</div>
          <div className="text-sm text-gray-400">Locked</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <ProgressBar value={stats.available} max={TOTAL_SLOTS} label="Slots Remaining" />
      </div>

      {/* Filtering & Sorting */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-lg mb-8 flex flex-wrap items-center justify-between gap-4 sticky top-[88px] z-40">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-400">Sort by:</label>
          <select 
            id="sort" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-colors"
          >
            <option value="number_asc">Slot Number (Asc)</option>
            <option value="number_desc">Slot Number (Desc)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
        </div>
        
        {/* Filtres de prix et de numéro */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-400">Price:</span>
          <input 
            type="number" 
            placeholder="Min" 
            value={priceRange.min} 
            onChange={e => setPriceRange(p => ({...p, min: e.target.value}))} 
            className="w-24 bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm"
          />
          <span className="text-gray-600">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={priceRange.max} 
            onChange={e => setPriceRange(p => ({...p, max: e.target.value}))} 
            className="w-24 bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-400">Slot #:</span>
          <input 
            type="number" 
            placeholder="Min" 
            value={numberRange.min} 
            onChange={e => setNumberRange(p => ({...p, min: e.target.value}))} 
            className="w-24 bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm"
          />
          <span className="text-gray-600">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={numberRange.max} 
            onChange={e => setNumberRange(p => ({...p, max: e.target.value}))} 
            className="w-24 bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Slots Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSlots.map(slot => (
          <SlotCard 
            key={slot.id} 
            slot={slot} 
            onSelect={handleSelectSlot}
          />
        ))}
      </div>
      
      {filteredAndSortedSlots.length === 0 && (
        <div className="text-center py-16 text-gray-400">No slots match your criteria.</div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          window.location.href = '/auth/login';
        }}
      />
    </div>
  );
};

export default SlotsAvailablePage;