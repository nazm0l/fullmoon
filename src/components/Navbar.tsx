import { event } from "@/content/event";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";
import { Moon, Phone, MessageCircle, Calendar, Sparkles } from "lucide-react";

export default function Navbar() {
  const whatsappUrl = getGeneralWhatsAppLink();

  return (
    <header className="sticky top-0 z-30 w-full bg-night-950/90 backdrop-blur-md border-b border-night-800/80">
      {/* Top Discount & Urgent Booking Banner */}
      <div className="bg-gradient-to-r from-night-950 via-[#2a0e0e] to-night-950 border-b border-red-500/30 py-1.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wide">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-red-400 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
            LIMITED OFFER
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-200">
            রেগুলার <del className="text-gray-400">{event.regularPrice}</del> এর পরিবর্তে মাত্র <strong className="text-moon-gold font-bold">{event.discountedPrice}</strong> {event.priceUnitBn} ({event.discountPercent} ছাড়)
          </span>
          <span className="hidden sm:inline text-gray-400">•</span>
          <span className="hidden sm:inline text-moon-gold-light font-medium">আসন সীমিত</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand & Event Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-moon-gold to-white shadow-[0_0_15px_#f5c84c] flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-night-950 fill-night-950" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-base sm:text-xl font-bold text-white tracking-wide leading-tight group-hover:text-moon-gold transition-colors">
              {event.nameEn}
            </span>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-300">
              <span className="text-moon-gold font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-moon-gold" />
                {event.date}
              </span>
              <span>•</span>
              <span className="text-gray-400">
                Organized By: <strong className="text-white font-semibold">{event.organizer}</strong>
              </span>
            </div>
          </div>
        </a>

        {/* Contact Numbers & Book Now CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="text-gray-400 flex items-center justify-end gap-1">
              <Phone className="w-3 h-3 text-moon-gold" />
              For Info &amp; Reservations:
            </span>
            <div className="flex items-center gap-2 font-mono font-bold text-moon-gold-light">
              <a href={`tel:${event.phone1.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
                {event.phone1}
              </a>
              <span className="text-gray-600">|</span>
              <a href={`tel:${event.phone2.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
                {event.phone2}
              </a>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-night-900 border border-night-700 hover:border-moon-gold/50 text-[#25D366] transition-colors"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>

          <a
            href="#book"
            className="btn-gold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{event.cta.bookNowEn}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
