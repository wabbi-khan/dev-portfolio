"use client";
import React, { useEffect, useState } from "react";

const chapters = [
  { id: "home", num: "01", name: "HOME" },
  { id: "stats", num: "02", name: "OVERVIEW" },
  { id: "work", num: "03", name: "PROJECTS" },
  { id: "about", num: "04", name: "ABOUT" },
  { id: "contact", num: "05", name: "CONTACT" },
];

export default function StorytellingHUD() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const percent = Math.min(100, Math.max(0, Math.round(progress * 100)));
      setScrollPercent(percent);

      // Calculate which chapter is currently active
      const chapterElements = chapters.map((ch) =>
        document.getElementById(ch.id),
      );

      let currentActive = 0;
      chapterElements.forEach((el, index) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            currentActive = index;
          }
        }
      });

      setActiveChapter(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(`#${id}`, { offset: -60, duration: 1.2 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Desktop HUD: Right Edge Storytelling Navigator */}
      <aside
        aria-label="Story Chapter Navigation"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end pointer-events-none select-none"
      >
        {/* Chapter Steps */}
        <div className="pointer-events-auto flex flex-col gap-2.5 items-end">
          {chapters.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToSection(ch.id)}
                className={`group flex items-center gap-3 transition-all duration-300 text-right cursor-pointer focus:outline-none`}
              >
                {/* Chapter Label (slides out on hover or active) */}
                <span
                  className={`font-display font-bold text-xs uppercase tracking-wider px-2 py-1 border-2 border-black transition-all ${
                    isActive
                      ? "bg-[#CCFF00] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-0"
                      : "bg-white text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2"
                  }`}
                >
                  {ch.num} {ch.name}
                </span>

                {/* Chapter Marker Node */}
                <div
                  className={`w-3.5 h-3.5 border-2 border-black transition-all ${
                    isActive
                      ? "bg-[#CCFF00] scale-125 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white group-hover:bg-black group-hover:scale-110"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile / Tablet Compact Story Chapter Bar (Bottom Right Pill) */}
      <div className="xl:hidden fixed bottom-5 right-5 z-40 pointer-events-auto">
        <div className="bg-black text-white border-2 border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_#CCFF00] font-mono text-[11px] font-bold flex items-center gap-2">
          <span className="text-[#CCFF00]">
            [{chapters[activeChapter]?.num}/05]
          </span>
          <span className="uppercase">{chapters[activeChapter]?.name}</span>
          <span className="text-white/40">|</span>
          <span className="text-zinc-300">{scrollPercent}%</span>
        </div>
      </div>
    </>
  );
}
