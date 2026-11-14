import Image from "next/image";
import { event } from "@/content/event";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";
import { Calendar, MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function Footer() {
  const whatsappUrl = getGeneralWhatsAppLink();
  const currentYear = 2026;

  return (
    <footer className="mt-8 sm:mt-16 border-t border-night-800/80 bg-gradient-to-b from-night-950 via-[#070e24] to-night-950 py-8 sm:py-14 px-4 text-center relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-moon-gold/40 to-transparent" />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
        {/* Title from Poster */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-moon-gold shadow-[0_0_12px_#f5c84c]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              {event.nameEn}
            </h3>
          </div>
        </div>

        {/* Date and Venue Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-gray-300">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-moon-gold" />
            {event.date}
          </span>
          <span className="text-gray-500">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-moon-gold" />
            {event.venue}
          </span>
        </div>

        {/* Contact Numbers Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-gray-200 font-mono">
          <span className="text-moon-gold font-sans font-medium flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            যোগাযোগ:
          </span>
          <a href={`tel:${event.phone1.replace(/\s/g, "")}`} className="hover:text-moon-gold font-bold transition-colors">
            {event.phone1}
          </a>
          <span className="text-gray-500">•</span>
          <a href={`tel:${event.phone2.replace(/\s/g, "")}`} className="hover:text-moon-gold font-bold transition-colors">
            {event.phone2}
          </a>
        </div>

        {/* WhatsApp Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-night-900 border border-night-700 hover:border-moon-gold/50 text-xs sm:text-sm font-semibold text-moon-gold hover:text-white transition-all shadow-md group"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp-এ সরাসরি যোগাযোগ করুন</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Organizer Logo & Official Poster Disclaimer */}
        <div className="w-full max-w-lg border-t border-night-800/80 mt-6 pt-6 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 font-medium tracking-wide">Presented by:</span>
            <div className="inline-flex items-center justify-center bg-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform">
              <Image
                src="/images/remark-logo.png"
                alt="Remark"
                width={130}
                height={40}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-400 italic">
            * {event.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-gray-500 mt-2">
          © {currentYear} Remark International. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
