'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AutoExpireReservations from '@/components/AutoExpireReservations';
import LandingPage from '@/pages-old/LandingPage';
import SlotsAvailablePage from '@/pages-old/SlotsAvailablePage';
import SlotReservationPage from '@/pages-old/SlotReservationPage';
import LegacyProfilePage from '@/pages-old/LegacyProfilePage';
import DashboardPage from '@/pages-old/DashboardPage';
import AllSlotsPage from '@/pages-old/AllSlotsPage';
import { Page, Slot } from '@/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleSelectSlot = useCallback((slot: Slot) => {
    setSelectedSlot(slot);
    navigateTo(Page.Reservation);
  }, [navigateTo]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage onEnter={() => navigateTo(Page.Slots)} />;
      case Page.Slots:
        return <SlotsAvailablePage onSelectSlot={handleSelectSlot} />;
      case Page.Reservation:
        return selectedSlot ? (
          <SlotReservationPage slot={selectedSlot} onBack={() => navigateTo(Page.Slots)} />
        ) : (
          <SlotsAvailablePage onSelectSlot={handleSelectSlot} />
        );
      case Page.Profile:
        return <LegacyProfilePage />;
      case Page.Dashboard:
        return <DashboardPage />;
      case Page.AllSlots:
        return <AllSlotsPage />;
      default:
        return <LandingPage onEnter={() => navigateTo(Page.Slots)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-inter">
      <AutoExpireReservations />
      <Header navigateTo={navigateTo} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}