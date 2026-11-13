"use client";

export default function FullMoonBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden"
    >
      {/* 1. Deep Midnight Blue-Black Cosmic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02050f] via-[#060e24] to-[#02040b]" />

      {/* 2. Living Ambient Lunar Glow (Spreads across whole viewport) */}
      <div className="absolute -top-24 right-0 sm:right-12 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,200,76,0.18)_0%,rgba(245,200,76,0.06)_45%,transparent_70%)] blur-3xl animate-moon-breathe" />

      {/* 3. Majestic Full Moon Orb (Fixed in the Night Sky) */}
      <div className="absolute top-8 right-6 sm:top-14 sm:right-24 w-28 h-28 sm:w-44 sm:h-44 rounded-full select-none">
        {/* Soft Outer Moonlight Halo */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-moon-gold/20 via-[#fff8db]/30 to-moon-gold/20 blur-2xl animate-moon-rays" />

        {/* Outer Aura Ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#f5c84c]/40 via-[#ffffff]/50 to-[#f5c84c]/20 blur-md animate-moon-breathe" />

        {/* Lunar Surface Disk */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#ffffff] via-[#fff5d0] to-[#ecd37d] shadow-[0_0_60px_rgba(245,200,76,0.65)] overflow-hidden border border-white/60">
          {/* Authentic Lunar Mare (Craters / Darker Patches) */}
          <div className="absolute top-4 left-4 w-9 h-7 rounded-full bg-[#d8b84e]/30 blur-[2px]" />
          <div className="absolute bottom-5 right-5 w-14 h-11 rounded-full bg-[#c9a334]/25 blur-[3px]" />
          <div className="absolute top-10 right-6 w-8 h-8 rounded-full bg-[#d4af3c]/20 blur-[1px]" />
          <div className="absolute bottom-10 left-6 w-6 h-6 rounded-full bg-[#d4af3c]/25 blur-[2px]" />

          {/* Moonlight Shimmer across the orb */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-80" />
        </div>
      </div>

      {/* 4. Secondary Lunar Aura for Middle & Bottom of Page */}
      <div className="absolute top-[45%] -left-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,200,76,0.09)_0%,transparent_65%)] blur-3xl" />
      <div className="absolute top-[80%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,200,76,0.08)_0%,transparent_70%)] blur-3xl" />

      {/* 5. Twinkling Night Sky Stars (Living Atmosphere) */}
      <div className="absolute inset-0">
        <span className="absolute top-[8%] left-[12%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff] animate-star-1" />
        <span className="absolute top-[16%] left-[28%] w-1 h-1 rounded-full bg-moon-gold-light animate-star-2" />
        <span className="absolute top-[12%] left-[62%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff] animate-star-3" />
        <span className="absolute top-[22%] left-[78%] w-1 h-1 rounded-full bg-moon-gold animate-star-1" />
        <span className="absolute top-[32%] left-[8%] w-1.5 h-1.5 rounded-full bg-white animate-star-2" />
        <span className="absolute top-[42%] left-[85%] w-1 h-1 rounded-full bg-moon-gold-light animate-star-3" />
        <span className="absolute top-[55%] left-[22%] w-1.5 h-1.5 rounded-full bg-white animate-star-1" />
        <span className="absolute top-[68%] left-[75%] w-1 h-1 rounded-full bg-moon-gold animate-star-2" />
        <span className="absolute top-[82%] left-[14%] w-1.5 h-1.5 rounded-full bg-white animate-star-3" />
        <span className="absolute top-[90%] left-[82%] w-1 h-1 rounded-full bg-moon-gold-light animate-star-1" />
      </div>

      {/* 6. Floating Moonlight Dust Particles */}
      <div className="absolute inset-0">
        <span className="absolute bottom-[25%] left-[30%] w-2 h-2 rounded-full bg-moon-gold/40 blur-[1px] animate-float-slow" style={{ animationDelay: "0s" }} />
        <span className="absolute bottom-[40%] left-[65%] w-1.5 h-1.5 rounded-full bg-moon-gold/50 blur-[1px] animate-float-slow" style={{ animationDelay: "2.5s" }} />
        <span className="absolute bottom-[15%] left-[50%] w-2 h-2 rounded-full bg-white/40 blur-[1px] animate-float-slow" style={{ animationDelay: "4s" }} />
      </div>

      {/* 7. Ocean Tide Horizon Moonlight Shimmer (Bottom) */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#02050e] to-transparent">
        <div className="absolute bottom-4 inset-x-0 h-1 bg-gradient-to-r from-transparent via-moon-gold/30 to-transparent blur-sm animate-wave-shimmer" />
      </div>
    </div>
  );
}

