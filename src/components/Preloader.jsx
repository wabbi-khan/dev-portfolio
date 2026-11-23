"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { expect, track, getState, markSiteReady } from "@/lib/preload";

const MIN_SHOW_MS = 1200; // long enough to read as intentional, never longer
const MAX_WAIT_MS = 12000; // never trap visitors behind a slow network

const STEP_LABELS = {
  fonts: "Setting type",
  images: "Inking sketches",
  vat: "Folding paper",
  hero: "Smoothing the sheet",
  page: "Final touches",
};

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

export default function Preloader() {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const [shown, setShown] = useState(0); // displayed % (eased)
  const [label, setLabel] = useState(STEP_LABELS.fonts);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Lock scrolling and start from the top while loading
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const lenisStop = setInterval(() => window.__lenis?.stop(), 50);

    // Declare every task up front so progress can't reach 100% early
    expect("fonts", 1, STEP_LABELS.fonts);
    expect("images", 1, STEP_LABELS.images);
    expect("vat", 6, STEP_LABELS.vat);
    expect("hero", 1, STEP_LABELS.hero);
    expect("page", 1, STEP_LABELS.page);

    const fonts = track("fonts");
    (document.fonts?.ready ?? Promise.resolve()).then(() => fonts.done());

    const images = track("images");
    const srcs = ["/logo.png", "/mascots/beard-directions.webp", "/mascots/beard-reactions.webp"];
    let loaded = 0;
    srcs.forEach((src) =>
      preloadImage(src).then(() => {
        loaded += 1;
        images.progress(loaded / srcs.length);
      }),
    );

    const page = track("page");
    if (document.readyState === "complete") page.done();
    else window.addEventListener("load", () => page.done(), { once: true });

    // Ease the displayed number toward the real progress
    const startedAt = performance.now();
    let displayed = 0;
    let raf = 0;
    let exiting = false;

    const exit = () => {
      if (exiting) return;
      exiting = true;
      clearInterval(lenisStop);
      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = "";
          window.__lenis?.start();
          setGone(true);
        },
      });
      tl.to("[data-pl-content]", { y: -30, opacity: 0, duration: 0.35, ease: "power2.in" })
        .add(() => markSiteReady(), "-=0.05") // hero intro starts as the curtain lifts
        .to(rootRef.current, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "<");
    };

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const { progress, label: l } = getState();
      const elapsed = now - startedAt;
      const target = elapsed > MAX_WAIT_MS ? 1 : progress;
      // time-based easing: same speed regardless of frame rate
      displayed += (target - displayed) * (1 - Math.exp(-dt * 7));
      if (target >= 1 && displayed > 0.985) displayed = 1;
      setShown(Math.round(displayed * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${displayed})`;
      if (l) setLabel(l);
      if (displayed >= 1 && elapsed >= MIN_SHOW_MS) {
        setLabel("Ready");
        exit();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(lenisStop);
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${shown}%`}
      className="fixed inset-0 z-[100] bg-[#ebfdff] paper-grid-texture flex items-center justify-center overflow-hidden"
    >
      <div data-pl-content className="w-[min(88vw,520px)] flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} priority />
          <div className="flex flex-col">
            <span className="font-display font-black text-xl uppercase tracking-tighter leading-none">
              Wahab Khan
            </span>
            <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Dev Portfolio &apos;26
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="font-display font-black text-7xl md:text-8xl leading-none tracking-tighter tabular-nums">
            {String(shown).padStart(3, "0")}
            <span className="text-4xl md:text-5xl align-top">%</span>
          </span>
          <span className="mb-2 bg-black text-[#CCFF00] font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-2.5 py-1">
            {label}…
          </span>
        </div>

        <div className="h-5 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-[#CCFF00] border-r-2 border-black origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Full Stack &amp; AI Engineer — preparing the paper…
        </p>
      </div>
    </div>
  );
}
