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

      {/* 1. Hero Section (Recreating the Official Event Poster) */}
      <Hero />

      {/* 2. The Core Highlights */}
      <CoreExperience />

      {/* 3. Event Night Timeline */}
      <Timeline />

      {/* 4. Booking Form */}
      <BookingForm />

      {/* 5. Footer */}
      <Footer />

      {/* 6. Floating WhatsApp Assistance */}
      <WhatsAppFab />
    </main>
  );
}
