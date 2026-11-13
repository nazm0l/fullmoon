import { event } from "@/content/event";
import Reveal from "./Reveal";
import { Clock, Utensils, Moon, Coffee, Sparkles, CheckCircle2, Waves, GlassWater } from "lucide-react";

export default function Timeline() {
  return (
    <section className="py-8 sm:py-16 md:py-20 px-4 max-w-4xl mx-auto relative">
      <Reveal className="text-center mb-6 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-moon-gold font-bold px-4 py-1.5 rounded-full bg-moon-gold/10 border border-moon-gold/25 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-moon-gold" />
          <span>EVENT SCHEDULE (11 PM TO 5 AM)</span>
        </span>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 sm:mt-4 tracking-tight">
          পূর্ণিমা রাতের পূর্ণাঙ্গ সময়সূচী
        </h2>
        <p className="text-xs sm:text-base text-gray-300 mt-1.5 sm:mt-2 max-w-lg mx-auto">
          {event.date} • {event.venue}
        </p>
      </Reveal>

      {/* Vertical Timeline Container */}
      <div className="relative pl-7 sm:pl-10 ml-2 sm:ml-6 border-l-2 border-moon-gold/40 space-y-4 sm:space-y-8">
        {event.schedule.map((item, index) => (
          <Reveal key={index} delayMs={index * 100} className="relative group">
            {/* Timeline Node Point with Lucide Icon */}
            <div className={`absolute -left-[43px] sm:-left-[53px] top-1.5 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-night-950 border-2 ${
              item.isMagicHour ? "border-moon-gold shadow-[0_0_25px_rgba(245,200,76,0.8)] scale-110" : "border-moon-gold shadow-[0_0_15px_rgba(245,200,76,0.35)]"
            } group-hover:scale-110 transition-all duration-300 z-10 text-moon-gold`}>
              {index === 0 && <GlassWater className="w-5 h-5" />}
              {index === 1 && <Utensils className="w-5 h-5" />}
              {index === 2 && <Coffee className="w-5 h-5" />}
              {index === 3 && <Coffee className="w-5 h-5" />}
              {index === 4 && <Utensils className="w-5 h-5" />}
              {index === 5 && <Moon className="w-5 h-5 fill-moon-gold/20" />}
              {index === 6 && <Sparkles className="w-5 h-5" />}
            </div>

            {/* Content Glass Card */}
            <div className={`glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
              item.isMagicHour ? "border-moon-gold/50 bg-gradient-to-r from-night-900 via-[#1e1a0b] to-night-900 shadow-[0_0_30px_rgba(245,200,76,0.2)]" : ""
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-moon-gold/15 text-moon-gold border border-moon-gold/30">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
                {item.isMagicHour ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-moon-gold text-night-950 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    THE MAGIC HOUR
                  </span>
                ) : (
                  <span className="text-xs text-moon-gold/70 font-semibold tracking-wider font-mono">
                    EVENT #{index + 1}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-moon-gold transition-colors">
                {item.title}
              </h3>

              {item.subtitle && (
                <p className="text-sm font-semibold text-moon-gold-light mt-1">
                  {item.subtitle}
                </p>
              )}

              {/* Special 10-Item Dinner Menu nested directly under 11:15 PM */}
              {item.menu && (
                <div className="mt-4 p-4 rounded-xl bg-night-950/80 border border-moon-gold/30">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-night-800">
                    <Utensils className="w-4 h-4 text-moon-gold" />
                    <span className="font-serif font-bold text-xs sm:text-sm text-moon-gold uppercase tracking-wider">
                      Dinner Menu (১০টি বিশেষ পদ):
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
                    {item.menu.map((menuItem) => (
                      <div key={menuItem.id} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-moon-gold shrink-0" />
                        <span className="font-medium">{menuItem.id}. {menuItem.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Pill list for other events */}
              {item.items && item.items.length > 0 && !item.menu && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.items.map((it, itIdx) => (
                    <span
                      key={itIdx}
                      className="px-2.5 py-1 rounded-lg bg-night-950/70 border border-night-700 text-[11px] font-medium text-gray-300"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
