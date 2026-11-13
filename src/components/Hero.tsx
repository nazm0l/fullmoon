import Image from "next/image";
import { event } from "@/content/event";
import { Calendar, MapPin, Tag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[560px] sm:min-h-[640px] flex items-center justify-center overflow-hidden px-4 pt-10 pb-12 sm:pt-16 sm:pb-20">
      {/* Background Full Moon Night & Moonlit Sea Visual (Pure Beach & Moon SVG - No Persons) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-bg.svg"
          alt="Full Moon Night by the Sea - Cox's Bazar"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-25 sm:opacity-30"
        />
        {/* Midnight Oceanic Vignette for High Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02050f]/75 via-[#060e24]/60 to-[#030611]" />
        
        {/* Living Golden Lunar Glow Radiating from the Full Moon */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,200,76,0.15)_0%,transparent_65%)]" />

        {/* Soft Tide Mist Gradient at Bottom for Seamless Transition */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#030611] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center w-full px-2">
        {/* Main Poster Title Block */}
        <div className="flex flex-col items-center mb-2 max-w-full">
          <div className="flex items-center justify-center">
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] italic uppercase text-center leading-tight">
              Full Moon, Sea &amp;
            </h1>
          </div>
          <div className="relative inline-flex items-center justify-center gap-2 sm:gap-3 mt-1 max-w-full">
            <span className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] italic uppercase tracking-tight">
              Seafood Night
            </span>

            {/* Golden Prawn Outline Icon from Poster */}
            <svg
              className="w-6 h-6 sm:w-12 sm:h-12 md:w-14 md:h-14 text-moon-gold shrink-0 drop-shadow-[0_0_20px_rgba(245,200,76,0.7)]"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M48 16 C40 10, 24 12, 16 24 C10 33, 14 46, 26 50 C36 54, 48 48, 52 38 C54 32, 52 26, 46 22 C38 18, 28 22, 24 30" />
              <path d="M22 28 C26 26, 32 26, 36 29" />
              <path d="M25 36 C30 35, 36 36, 40 40" />
              <circle cx="20" cy="24" r="2" fill="currentColor" />
              <path d="M48 14 Q56 8 60 12" />
              <path d="M46 18 Q54 16 58 22" />
            </svg>

            {/* Signature Golden Curved Underline */}
            <svg
              className="absolute -bottom-2 sm:-bottom-3 inset-x-0 w-full h-2 sm:h-3 text-moon-gold overflow-visible"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 5,6 Q 150,12 295,6 Q 150,9 5,6 Z"
                fill="currentColor"
                opacity="0.95"
              />
            </svg>
          </div>
        </div>

        {/* Bangla Headline & Time from Poster */}
        <h2 className="mt-3 sm:mt-6 text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] max-w-full px-2">
          <span className="block sm:inline text-gray-100">
            জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত
          </span>{" "}
          <span className="inline-block font-serif italic text-moon-gold font-normal text-sm sm:text-2xl md:text-3xl mt-0.5 sm:mt-0">
            ({event.timeRange})
          </span>
        </h2>

        {/* Date and Venue Strip with Lucide Icons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-base font-semibold text-gray-100 max-w-full">
          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-night-950/80 border border-night-700/80 shadow-lg backdrop-blur-md">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-moon-gold shrink-0" />
            <span>Event Date: <strong className="text-white">{event.date}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-night-950/80 border border-night-700/80 shadow-lg backdrop-blur-md">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-moon-gold shrink-0" />
            <span>Venue: <strong className="text-white">{event.venue}</strong></span>
          </div>
        </div>

        {/* Special 40% Discount Price Badge directly from Poster */}
        <div className="mt-5 sm:mt-8 flex flex-col items-center">
          <div className="relative inline-flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-red-950/90 via-red-900/85 to-night-950 border-2 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4)] backdrop-blur-md">
            {/* Top Regular Price */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-semibold">
              <Tag className="w-4 h-4 text-gray-400" />
              <span>Regular Price:</span>
              <del className="text-gray-400 font-bold text-sm sm:text-base decoration-red-400 decoration-2">
                {event.regularPrice}
              </del>
              <span className="text-gray-400">{event.priceUnit}</span>
            </div>

            {/* Discount Ribbon & Final Price */}
            <div className="mt-1 flex flex-col items-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-sm">
                {event.discountPercent} Discounted Price
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-extrabold text-3xl sm:text-5xl text-moon-gold tracking-tight drop-shadow-[0_2px_15px_rgba(245,200,76,0.65)]">
                  {event.discountedPrice}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {event.priceUnit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
