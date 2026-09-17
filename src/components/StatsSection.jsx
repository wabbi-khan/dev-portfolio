import React from "react";

const StatsSection = () => {
  return (
    <section id="stats" className="w-full">
      {/* Full-Width Infinite Marquee Strip */}
      <div className="w-full bg-[#CCFF00] border-y-2 border-black py-3.5 overflow-hidden whitespace-nowrap select-none flex">
        <div className="inline-flex gap-8 font-display font-black text-sm md:text-base uppercase tracking-wider animate-marquee">
          <span>★ AVAILABLE FOR FREELANCE &amp; FULL-TIME</span>
          <span>● NEXT.JS ARCHITECT</span>
          <span>★ HIGH-PERFORMANCE WEB APPS</span>
          <span>● AI CHATBOT &amp; ERP SYSTEMS</span>
          <span>★ 4+ YEARS OF EXPERIENCE</span>
          <span>● FAST TURNAROUND &amp; CLEAN CODE</span>
          <span>★ AVAILABLE FOR FREELANCE &amp; FULL-TIME</span>
          <span>● NEXT.JS ARCHITECT</span>
          <span>★ HIGH-PERFORMANCE WEB APPS</span>
          <span>● AI CHATBOT &amp; ERP SYSTEMS</span>
          <span>★ 4+ YEARS OF EXPERIENCE</span>
          <span>● FAST TURNAROUND &amp; CLEAN CODE</span>
        </div>
      </div>

      {/* Centered Stats Cards */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 scroll-mt-24">
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center reveal">
            <span className="font-display text-5xl md:text-6xl font-black text-black">
              4+
            </span>
            <span className="font-display font-bold uppercase text-on-tertiary-container tracking-widest text-xs">
              Years of Experience
            </span>
          </div>
          <div className="bg-[#CCFF00] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center reveal transition-delay-150">
            <span className="font-display text-5xl md:text-6xl font-black text-black">
              17+
            </span>
            <span className="font-display font-bold uppercase text-black tracking-widest text-xs">
              Projects Delivered
            </span>
          </div>
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center reveal transition-delay-300">
            <span className="font-display text-5xl md:text-6xl font-black text-black">
              3
            </span>
            <span className="font-display font-bold uppercase text-on-tertiary-container tracking-widest text-xs">
              Companies Worked
            </span>
          </div>
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center reveal transition-delay-300">
            <span className="font-display text-5xl md:text-6xl font-black text-black">
              100%
            </span>
            <span className="font-display font-bold uppercase text-on-tertiary-container tracking-widest text-xs">
              Client Satisfaction
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
