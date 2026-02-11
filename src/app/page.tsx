"use client";

import { useState } from "react";
import HeroSection from "../components/HeroSection";
import DestinationGallery from "../components/DestinationGallery";
import TimeQuiz from "../components/TimeQuiz";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import BookingModal from "../components/BookingModal";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | undefined>(undefined);

  const handleOpenBooking = (destinationId?: string) => {
    setSelectedDestination(destinationId);
    setIsBookingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-dark">
      <HeroSection />
      <DestinationGallery onBookingClick={handleOpenBooking} />
      <TimeQuiz onBookClick={handleOpenBooking} />
      <FAQ />
      <Footer />
      <ChatWidget />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        preselectedDestination={selectedDestination} 
      />
    </main>
  );
}
