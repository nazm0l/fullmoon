import Image from "next/image";
import { event } from "@/content/event";
import { Calendar, MapPin, Clock, Phone, Sparkles, ArrowRight, Tag, UtensilsCrossed, Fish, Moon, Coffee } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden px-4 pt-4 pb-8 sm:pt-12 sm:pb-20">
      {/* Background Poster Visual with Dark Oceanic Vignette */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/poster-schedule.jpg"
          alt="Full Moon, Sea & Seafood Night - Cox's Bazar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-30 sm:opacity-40 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/85 via-night-950/65 to-night-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,200,76,0.18)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Main Poster Title Block */}
        <div className="inline-block mb-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <h1 className="font-serif text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg italic uppercase">
              Full Moon, Sea &amp;
            </h1>
          </div>
          <div className="relative inline-flex items-center justify-center gap-3 mt-1">
            <span className="font-serif text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg italic uppercase">
              Seafood Night
            </span>

            {/* Golden Prawn Outline Icon from Poster */}
            <svg
              className="w-9 h-9 sm:w-14 sm:h-14 text-moon-gold shrink-0 drop-shadow-[0_0_15px_rgba(245,200,76,0.5)]"
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
              className="absolute -bottom-3 inset-x-0 w-full h-3 text-moon-gold overflow-visible"
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
        <h2 className="mt-4 sm:mt-8 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
          <span className="text-gray-100">
            জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত
          </span>{" "}
          <span className="font-serif italic text-moon-gold font-normal text-xl sm:text-3xl">
            ({event.timeRange})
          </span>
        </h2>

        {/* Date and Venue Strip with Lucide Icons */}
        <div className="mt-3.5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-sm sm:text-base font-semibold text-gray-100">
          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-night-900/90 border border-night-700 shadow-md backdrop-blur-sm">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-moon-gold" />
            <span>Event Date: <strong className="text-white">{event.date}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-night-900/90 border border-night-700 shadow-md backdrop-blur-sm">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-moon-gold" />
            <span>Venue: <strong className="text-white">{event.venue}</strong></span>
          </div>
        </div>

        {/* Special 40% Discount Price Badge directly from Poster */}
        <div className="mt-4 sm:mt-8 flex flex-col items-center">
          <div className="relative inline-flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-red-950/90 via-red-900/80 to-night-950 border-2 border-red-500/50 shadow-[0_0_35px_rgba(239,68,68,0.35)] backdrop-blur-md">
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
                <span className="font-extrabold text-3xl sm:text-5xl text-moon-gold tracking-tight drop-shadow-[0_2px_12px_rgba(245,200,76,0.6)]">
                  {event.discountedPrice}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {event.priceUnit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Event Highlights Bar (From Poster 2) */}
        <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-night-900/80 border border-moon-gold/25 backdrop-blur-md shadow-sm">
            <UtensilsCrossed className="w-5 h-5 text-moon-gold mb-1.5" />
            <span className="text-xs font-bold text-white leading-tight">Dinner Under Moonlight</span>
            <span className="text-[10px] text-gray-400 mt-0.5">10-item menu</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-night-900/80 border border-moon-gold/25 backdrop-blur-md shadow-sm">
            <Fish className="w-5 h-5 text-moon-gold mb-1.5" />
            <span className="text-xs font-bold text-white leading-tight">Crab Fry at Midnight</span>
            <span className="text-[10px] text-gray-400 mt-0.5">12:30 AM</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-night-900/80 border border-moon-gold/25 backdrop-blur-md shadow-sm">
            <Coffee className="w-5 h-5 text-moon-gold mb-1.5" />
            <span className="text-xs font-bold text-white leading-tight">BBQ Squid &amp; Snacks</span>
            <span className="text-[10px] text-gray-400 mt-0.5">2:30 AM</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-night-900/80 border border-moon-gold/25 backdrop-blur-md shadow-sm">
            <Sparkles className="w-5 h-5 text-moon-gold mb-1.5" />
            <span className="text-xs font-bold text-white leading-tight">Seafood Khichuri at Dawn</span>
            <span className="text-[10px] text-gray-400 mt-0.5">4:30 AM</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center p-3 rounded-2xl bg-gradient-to-br from-moon-gold/15 to-night-900/90 border border-moon-gold/40 backdrop-blur-md shadow-sm">
            <Moon className="w-5 h-5 text-moon-gold mb-1.5" />
            <span className="text-xs font-bold text-moon-gold leading-tight">The Magic Hour</span>
            <span className="text-[10px] text-gray-200 mt-0.5">৪:৪৫ AM (চাঁদ ও সাগর)</span>
          </div>
        </div>

        {/* CTA & Direct Phone Numbers */}
        <div className="mt-5 sm:mt-10 flex flex-col items-center gap-2.5 sm:gap-4 w-full">
          <a
            href="#book"
            className="btn-gold inline-flex items-center justify-center min-h-[50px] sm:min-h-[58px] px-8 sm:px-10 py-3 sm:py-3.5 rounded-full text-base sm:text-lg font-bold shadow-[0_0_35px_rgba(245,200,76,0.55)] transition-transform hover:scale-105 active:scale-95 group gap-2"
          >
            <span>{event.cta.bookNowEn}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Phone Numbers Badge from Poster */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-5 py-2.5 rounded-2xl bg-night-900/90 border border-night-700 shadow-md">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-moon-gold" />
              For Information &amp; Reservations:
            </span>
            <div className="flex items-center gap-3 font-mono font-bold text-white text-sm sm:text-base">
              <a href={`tel:${event.phone1.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
                {event.phone1}
              </a>
              <span className="text-gray-600">|</span>
              <a href={`tel:${event.phone2.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
                {event.phone2}
              </a>
            </div>
          </div>

          {/* Organizer Brand Badge */}
          <div className="text-xs text-gray-300">
            <span>Organized By: </span>
            <strong className="text-white font-extrabold tracking-wide text-sm">{event.organizer}</strong>
          </div>

          {/* Official Disclaimer */}
          <p className="text-[11px] text-gray-400 italic max-w-lg">
            {event.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
