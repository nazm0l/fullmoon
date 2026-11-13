"use client";

import { getGeneralWhatsAppLink } from "@/lib/whatsapp";
import { trackContact } from "@/lib/track";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFab() {
  const whatsappUrl = getGeneralWhatsAppLink();

  const handleClick = () => {
    trackContact();
  };

  return (
    <aside aria-label="সরাসরি WhatsApp যোগাযোগ" className="fixed bottom-6 right-5 sm:right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="WhatsApp-এ মেসেজ দিন"
        className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_6px_25px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 min-h-[52px]"
      >
        {/* Pulsing halo */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

        <MessageCircle className="w-6 h-6 shrink-0 relative z-10" />

        <div className="relative z-10 flex flex-col text-left leading-none">
          <span className="text-[10px] text-white/85 font-medium tracking-wide">
            সরাসরি জানতে
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-wide mt-0.5">
            WhatsApp চ্যাট
          </span>
        </div>
      </a>
    </aside>
  );
}
