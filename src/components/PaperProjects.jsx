"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdArrowOutward, MdClose } from "react-icons/md";
import { onSiteReady } from "@/lib/preload";

/**
 * 3D crumpled-paper project showcase.
 * Three.js / cannon-es are loaded lazily (client only, own chunk).
 * Calls `onFallback` if WebGL or the assets fail, so the parent can show the grid.
 */
export default function PaperProjects({ projects, onFallback }) {
  const stageRef = useRef(null);
  const ctrlRef = useRef(null);
  const fallbackRef = useRef(onFallback);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    fallbackRef.current = onFallback;
  }, [onFallback]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let io = null;
    let dropTimer = null;
    let removeLanded = null;
    let nearIO = null;

    const start = async () => {
      // Reduced-motion users and browsers without WebGL get the grid instead
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        webgl = false;
      }
      if (reduced || !webgl) {
        fallbackRef.current?.();
        return;
      }
      try {
        const { createPaperScene } = await import("@/lib/paper/scene");
        if (disposed) return;
        const ctrl = createPaperScene({
          container: stage,
          projects,
          onReady: () => {
            setIsTouch(window.matchMedia("(pointer: coarse)").matches);
            setReady(true);
          },
          onOpen: (i) => setActive(i),
          onClose: () => setActive(null),
          onError: (err) => {
            console.error("[PaperProjects]", err);
            fallbackRef.current?.();
          },
        });
        ctrlRef.current = ctrl;
        // Papers rain in when the hero's paper ball lands on this stage.
        // Without the hero animation (reduced motion, fallback) or as a safety
        // net (e.g. page reloaded mid-scroll), drop shortly after it's visible.
        const onLanded = () => ctrl.requestDrop();
        if (window.__heroPaperLanded) ctrl.requestDrop();
        window.addEventListener("hero-paper-landed", onLanded);
        removeLanded = () => window.removeEventListener("hero-paper-landed", onLanded);
        io = new IntersectionObserver(
          ([entry]) => {
            ctrl.setVisible(entry.isIntersecting);
            clearTimeout(dropTimer);
            if (entry.isIntersecting) {
              dropTimer = setTimeout(
                () => ctrl.requestDrop(),
                // the landing event normally fires first (also after a reload,
                // as the hero ball eases to its end) — this is a last resort
                window.__heroPaperActive ? 6000 : 0,
              );
            }
          },
          { threshold: 0.2 },
        );
        io.observe(stage);
      } catch (err) {
        console.error("[PaperProjects]", err);
        fallbackRef.current?.();
      }
    };

    // Build the scene only after the preloader has revealed the site and the
    // stage is within ~one screen — keeps the initial load light. The paper
    // data is already cached by the hero, so it's ready almost instantly.
    const offReady = onSiteReady(() => {
      nearIO = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          nearIO.disconnect();
          start();
        },
        { rootMargin: "100% 0px 100% 0px" },
      );
      nearIO.observe(stage);
    });

    return () => {
      disposed = true;
      offReady();
      nearIO?.disconnect();
      clearTimeout(dropTimer);
      removeLanded?.();
      io?.disconnect();
      ctrlRef.current?.destroy();
      ctrlRef.current = null;
    };
  }, [projects]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") ctrlRef.current?.discardActive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const project = active !== null ? projects[active] : null;

  return (
    <div className="relative">
      <div
        ref={stageRef}
        id="paper-stage"
        className="relative left-1/2 -translate-x-1/2 w-screen h-[85vh] min-h-[520px] max-h-[960px] border-y-2 border-black overflow-hidden bg-[#CCFF00] select-none"
        aria-label="Interactive 3D project showcase: crumpled paper balls, each one a project"
        role="application"
      >
        {/* Loading */}
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-black text-[#CCFF00] font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-pulse">
              Crumpling papers…
            </div>
          </div>
        )}

        {/* Hint */}
        <div
          className={`absolute top-4 left-4 z-10 pointer-events-none transition-opacity duration-500 ${
            ready && !project ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white border-2 border-black px-3 py-1.5 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {isTouch
              ? "Tap a paper ball to unfold it"
              : "Click a paper ball to unfold · Drag to throw"}
          </div>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="bg-black text-[#CCFF00] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
            {projects.length} projects
          </div>
        </div>

        {/* Active project actions */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-[36rem] transition-all duration-500 ${
            project
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 md:p-3 flex items-center gap-2 md:gap-3">
            <span className="flex-1 min-w-0 font-display font-black uppercase text-xs md:text-sm truncate pl-1">
              {project?.name}
            </span>
            <a
              href={project?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={project ? 0 : -1}
              className="shrink-0 bg-[#CCFF00] text-black px-3 md:px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-black hover:text-[#CCFF00] transition-all font-display font-bold uppercase text-xs flex items-center gap-1"
            >
              View Live <MdArrowOutward size={14} />
            </a>
            <button
              type="button"
              onClick={() => ctrlRef.current?.discardActive()}
              tabIndex={project ? 0 : -1}
              aria-label="Crumple and close"
              className="shrink-0 bg-black text-white px-3 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors font-display font-bold uppercase text-xs flex items-center gap-1 cursor-pointer"
            >
              <MdClose size={14} />
              <span className="hidden sm:inline">Crumple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessible / SEO list of the same projects */}
      <ul className="sr-only">
        {projects.map((p) => (
          <li key={p.url}>
            <a href={p.url}>{p.name}</a> — {p.desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
