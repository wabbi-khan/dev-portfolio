import React from "react";

const StatsSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 py-12 md:py-24">
      <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center reveal">
        <span className="font-display text-5xl md:text-6xl font-black text-black">
          3+
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
    </section>
  );
};

export default StatsSection;
