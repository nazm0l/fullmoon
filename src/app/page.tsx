import FullMoonBackground from "@/components/FullMoonBackground";
import Hero from "@/components/Hero";
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

      {/* 2. Event Night Timeline & Full Schedule */}
      <Timeline />

      {/* 3. Booking & Payment Form */}
      <BookingForm />

      {/* 4. Footer */}
      <Footer />

      {/* 5. Floating WhatsApp Assistance */}
      <WhatsAppFab />
    </main>
  );
}
