import Navbar from "@/components/Navbar";
import FullMoonBackground from "@/components/FullMoonBackground";
import Hero from "@/components/Hero";
import CoreExperience from "@/components/CoreExperience";
import Timeline from "@/components/Timeline";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <main className="relative min-h-screen text-gray-100 overflow-x-hidden pb-12 selection:bg-moon-gold selection:text-night-950">
      {/* Living Full Moon Night Sky & Ocean Atmosphere */}
      <FullMoonBackground />

      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Section (Recreating the Official Event Poster) */}
      <Hero />

      {/* 3. The 4 Core Pillars (Full Moon & Sea, Seafood Dinner, Midnight Snacks, Morning Khichuri) */}
      <CoreExperience />

      {/* 4. Event Night Timeline */}
      <Timeline />

      {/* 5. Booking Form */}
      <BookingForm />

      {/* 6. Footer */}
      <Footer />

      {/* 7. Floating WhatsApp Assistance */}
      <WhatsAppFab />
    </main>
  );
}
