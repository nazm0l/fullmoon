import Image from "next/image";
import { event } from "@/content/event";
import Reveal from "./Reveal";
import { Utensils, Moon, Coffee, Sparkles, CheckCircle2, Fish } from "lucide-react";

export default function CoreExperience() {
  return (
    <section className="py-8 sm:py-16 md:py-20 px-4 max-w-6xl mx-auto relative">
      <Reveal className="text-center mb-6 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-moon-gold font-bold px-4 py-1.5 rounded-full bg-moon-gold/10 border border-moon-gold/25 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-moon-gold" />
          <span>EVENT HIGHLIGHTS</span>
        </span>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 sm:mt-4 tracking-tight">
          পূর্ণিমা রাতের বিশেষ আকর্ষণসমূহ
        </h2>
        <p className="text-xs sm:text-base text-gray-300 mt-1.5 sm:mt-2 max-w-lg mx-auto">
          {event.date} • {event.venue} • {event.timeRange}
        </p>
      </Reveal>

      {/* Highlights Grid with Lucide Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {event.highlights.map((item, index) => (
          <Reveal
            key={item.id}
            delayMs={index * 120}
            className={`glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col group shadow-xl ${
              item.id === "magic-hour" ? "md:col-span-2 border-moon-gold/40 bg-gradient-to-br from-night-900/90 via-night-950 to-night-900" : ""
            }`}
          >
            {/* Real Photograph with Category Badge */}
            <div className={`relative ${item.id === "magic-hour" ? "aspect-[21/9]" : "aspect-[16/10]"} w-full overflow-hidden bg-night-950`}>
              <Image
                src={item.image}
                alt={item.titleEn}
                width={800}
                height={500}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/30 to-transparent" />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-night-950/85 backdrop-blur-md text-xs font-bold text-moon-gold border border-moon-gold/30 shadow-md flex items-center gap-1.5">
                {item.id === "dinner" && <Utensils className="w-3.5 h-3.5" />}
                {item.id === "crab" && <Fish className="w-3.5 h-3.5" />}
                {item.id === "squid" && <Coffee className="w-3.5 h-3.5" />}
                {item.id === "khichuri" && <Utensils className="w-3.5 h-3.5" />}
                {item.id === "magic-hour" && <Moon className="w-3.5 h-3.5" />}
                <span>{item.badge}</span>
              </span>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-moon-gold transition-colors">
                  {item.titleEn}
                </h3>
                <h4 className="text-base font-semibold text-moon-gold-light mt-0.5">
                  {item.titleBn}
                </h4>

                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {item.desc}
                </p>

                {/* If it's the Moonlight Dinner, showcase the 10-Item Menu Box */}
                {item.id === "dinner" && (
                  <div className="mt-5 p-4 rounded-2xl bg-night-950/80 border border-moon-gold/25">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-night-800">
                      <Utensils className="w-4 h-4 text-moon-gold" />
                      <span className="font-serif font-bold text-sm text-moon-gold uppercase tracking-wider">
                        10-Item Dinner Menu
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-200">
                      {event.dinnerMenu.map((m) => (
                        <div key={m.id} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-moon-gold shrink-0" />
                          <span>{m.id}. {m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
