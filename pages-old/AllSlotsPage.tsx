import React, { useState, useMemo, useEffect } from 'react';
import SlotCard from '../components/SlotCard';
import Pagination from '../components/Pagination';
import { TOTAL_SLOTS } from '../constants';
import { Slot, SlotStatus } from '../types';
import ProgressBar from '../components/ProgressBar';

const SLOTS_PER_PAGE = 24; // Plus de slots par page pour la vue complète

const AllSlotsPage: React.FC = () => {
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('number_asc');
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ Charger tous les slots depuis l'API
  useEffect(() => {
    const fetchAllSlots = async () => {
      try {
        const response = await fetch('/api/slots/all');
        const data = response.ok ? await response.json() : { success: false, error: 'Server error' };

        if (data.success) {
          setAllSlots(data.slots);
        } else {
          console.error('Failed to fetch all slots:', data.error);
        }
      } catch (error) {
        console.error('Error fetching all slots:', error);
      }
    };

    fetchAllSlots();

    // Recharger toutes les 10 secondes pour garder les données à jour
    const interval = setInterval(fetchAllSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedSlots = useMemo(() => {
    let filteredSlots = [...allSlots];

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filteredSlots = filteredSlots.filter(slot => slot.status === statusFilter);
    }

    // Trier
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
  }, [allSlots, sortOrder, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedSlots.length / SLOTS_PER_PAGE);
  const currentSlots = filteredAndSortedSlots.slice(
    (currentPage - 1) * SLOTS_PER_PAGE,
    currentPage * SLOTS_PER_PAGE
  );
  
  const stats = useMemo(() => {
    const available = allSlots.filter(s => s.status === SlotStatus.Available).length;
    const reserved = allSlots.filter(s => s.status === SlotStatus.Reserved).length;
    const sold = allSlots.filter(s => s.status === SlotStatus.Sold).length;
    const locked = allSlots.filter(s => s.status === SlotStatus.Locked).length;
    return { available, reserved, sold, locked };
  }, [allSlots]);

  // Dans AllSlotsPage, on ne permet pas d'acheter, seulement visualiser
  const handleSelectSlot = (slot: Slot) => {
  if (slot.status === SlotStatus.Available) {
    alert('Pour réserver ce slot, veuillez aller sur la page "THE SLOTS".');
  } else if (slot.status === SlotStatus.Locked) {
    alert('Ce slot n\'est pas encore disponible. Il sera débloqué progressivement.');
  } else if (slot.status === SlotStatus.Sold) {
    alert('Ce slot a déjà été vendu.');
  }
  };


  return (
    <div className="container mx-auto px-4 py-12 animate-[fadeIn_1s_ease-out]">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-playfair font-black text-[#F5F5F0] tracking-wide">The Complete Vault</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Explore all 10,000 legacy slots. Witness the scale of immortality.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">{stats.available}</div>
          <div className="text-sm text-gray-400">Available</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">{stats.reserved}</div>
          <div className="text-sm text-gray-400">Reserved</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">{stats.sold}</div>
          <div className="text-sm text-gray-400">Sold</div>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg text-center border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">{stats.locked}</div>
          <div className="text-sm text-gray-400">Locked</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <ProgressBar 
          value={stats.available + stats.reserved + stats.sold} 
          max={TOTAL_SLOTS} 
          label="Total Slots Revealed" 
        />
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
        
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-400">Filter by status:</label>
          <select 
            id="status" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-colors"
          >
            <option value="all">All Slots</option>
            <option value={SlotStatus.Available}>Available Only</option>
            <option value={SlotStatus.Reserved}>Reserved Only</option>
            <option value={SlotStatus.Sold}>Sold Only</option>
            <option value={SlotStatus.Locked}>Locked Only</option>
          </select>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-playfair text-[#D4AF37] text-lg">Legend</h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-300">Reserved (1h)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-300">Sold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-300">Locked</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>💡 <strong>Tip:</strong> Use filters to explore specific slot statuses</p>
          </div>
        </div>
      </div>

      {/* Slots Grid Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
    </div>
  );
};

export default AllSlotsPage;