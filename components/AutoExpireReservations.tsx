'use client';

import { useEffect } from 'react';

export default function AutoExpireReservations() {
  useEffect(() => {
    const expireReservations = async () => {
      try {
        const response = await fetch('/api/slots/expire-reservations', {
          method: 'POST'
        });
        const data = await response.json();
        if (data.expiredCount > 0) {
          console.log(`✅ Auto-expired ${data.expiredCount} slot(s):`, data.expiredSlotIds);
        }
      } catch (error) {
        console.error('Failed to auto-expire reservations:', error);
      }
    };

    // Appeler immédiatement au chargement
    expireReservations();

    // Puis toutes les 30 secondes
    const interval = setInterval(expireReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  return null; // Ce composant ne rend rien visuellement
}