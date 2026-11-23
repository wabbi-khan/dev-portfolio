"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Typewriter from "typewriter-effect";
import { Mascot } from "page-mascot";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { track, isSiteReady, onSiteReady } from "@/lib/preload";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_A = ["FULL", "STACK"];
const HEADLINE_B = ["&", "AI", "PRODUCTS"];

const capabilities = [
  "AI Products & Agents",
  "Full Stack SaaS Platforms",
  "Node.js Backend & APIs",
  "Next.js & TypeScript",
];

function Word({ children }) {
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
      <span data-hero-word className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}

/** Shown instead of the 3D paper for reduced-motion / no-WebGL visitors. */
function StaticPaperCard() {
  return (
    <div className="absolute inset-0 bg-[#f5f3ec] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 flex flex-col gap-4 -rotate-2">
      <div className="flex justify-between font-display font-bold text-[10px] md:text-xs uppercase border-b-4 border-black pb-2">
        <span>● Wahab Khan</span>
        <span>Portfolio &apos;26</span>
      </div>
      <p className="font-display font-black text-3xl md:text-4xl uppercase leading-[0.95]">
        I build <span className="bg-[#CCFF00] border-2 border-black px-1">AI products</span> that ship.
      </p>
      <pre className="bg-[#111] text-[#CCFF00] text-[10px] md:text-xs p-3 border-2 border-black overflow-hidden">
{`const engineer = {
  role: "Full Stack + AI",
  experience: "4 years",
  status: "open to work",
};`}
      </pre>
    </div>
  );
}

const HeroSection = () => {
  const sectionRef = useRef(null);
  const anchorRef = useRef(null);
  const textColRef = useRef(null);
  const sideRef = useRef(null);
  const hintRef = useRef(null);
  const paperRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  // 3D paper (client only, lazy)
  useEffect(() => {
    let disposed = false;
    let host = null;
    const heroTask = track("hero");
    const giveUp = () => {
      // nothing heavy to wait for → let the preloader finish
      heroTask.done();
      track("vat").done();
    };
    (async () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        webgl = false;
      }
      if (reduced || !webgl) {
        setFallback(true);
        giveUp();
        return;
      }
      try {
        const { createHeroPaper } = await import("@/lib/paper/heroScene");
        if (disposed) return;
        // Fixed full-screen layer on <body> so the ball can travel down the page
        // over other sections. Above page content, below the HUD (z-40) / navbar (z-50).
        host = document.createElement("div");
        host.setAttribute("aria-hidden", "true");
        host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:30";
        document.body.appendChild(host);
        window.__heroPaperActive = true;
        const ctrl = createHeroPaper({
          container: host,
          getLanding: () => document.getElementById("paper-stage"),
          onLanded: () => {
            window.__heroPaperLanded = true;
            window.dispatchEvent(new Event("hero-paper-landed"));
          },
          anchor: anchorRef.current,
          onReady: () => heroTask.done(),
          onError: (err) => {
            console.error("[Hero]", err);
            window.__heroPaperActive = false;
            setFallback(true);
            giveUp();
          },
        });
        paperRef.current = ctrl;
        if (isSiteReady()) ctrl.startIntro();
      } catch (err) {
        console.error("[Hero]", err);
        setFallback(true);
        giveUp();
      }
    })();
    return () => {
      disposed = true;
      window.__heroPaperActive = false;
      paperRef.current?.destroy();
      paperRef.current = null;
      host?.remove();
    };
  }, []);

  // Intro reveal + scroll choreography
  useEffect(() => {
    const section = sectionRef.current;
    const cleanups = [];
    const ctx = gsap.context((self) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // Intro plays when the preloader reveals the site
      const playIntro = () => {
        paperRef.current?.startIntro();
        gsap.from("[data-hero-word]", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.07,
          delay: 0.15,
        });
        gsap.from("[data-hero-pop]", {
          scale: 0.6,
          rotate: -6,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(2)",
          delay: 0.35,
        });
        gsap.from("[data-hero-in]", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.45,
        });
      };
      const offReady = onSiteReady(() => self.add(playIntro));
      cleanups.push(offReady);

      // Scroll: copy parallax + the paper's journey from the hero into the projects stage
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (c) => {
          const header = document.querySelector("header");
          const offset = header ? header.offsetHeight : 96;
          const start = c.conditions.desktop ? `top ${offset}px` : "top top";

          // 1) Copy scrolls naturally with a light parallax (no pin → no empty screen)
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: section, start, end: "bottom top", scrub: 0.6 },
            })
            .to(hintRef.current, { opacity: 0, y: 20, duration: 0.15 }, 0)
            .to(textColRef.current, { y: -80, duration: 1 }, 0)
            .to(sideRef.current, { y: -40, opacity: 0, duration: 0.5 }, 0);

          // 2) Paper progress: from the hero until the projects stage has
          //    scrolled up under the ball → it lands there, then the projects drop in
          const stage = document.getElementById("paper-stage");
          ScrollTrigger.create({
            // mobile: the sheet starts below the fold — begin once it's on screen
            trigger: c.conditions.desktop ? section : anchorRef.current,
            start: c.conditions.desktop ? start : "center 70%",
            endTrigger: stage || "#work",
            end: stage ? "top 12%" : "top top",
            onUpdate: (self) => paperRef.current?.setProgress(self.progress),
            onRefresh: (self) => {
              paperRef.current?.relayout();
              paperRef.current?.setProgress(self.progress);
            },
          });
          return () => paperRef.current?.setProgress(0);
        },
      );
    }, section);
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[calc(100svh-96px)] flex items-center"
    >
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-center py-10 md:py-8">
        {/* Copy */}
        <div ref={textColRef} className="md:col-span-7 flex flex-col gap-5">
          <div data-hero-in className="flex items-center h-16">
            <div className="inline-flex items-center gap-2 h-fit bg-secondary-container px-4 py-1 border-2 border-black w-fit font-bold uppercase text-xs">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              Available for new projects
            </div>
            <Mascot
              directions="/mascots/beard-directions.webp"
              reactions="/mascots/beard-reactions.webp"
            />
          </div>

          <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[5.4rem] font-bold text-black uppercase tracking-tighter">
            {HEADLINE_A.map((w) => (
              <React.Fragment key={w}>
                <Word>{w}</Word>{" "}
              </React.Fragment>
            ))}
            <span
              data-hero-pop
              className="inline-block bg-[#CCFF00] px-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] border-2 border-black my-1"
            >
              ENGINEER
            </span>{" "}
            <br className="hidden lg:block" />
            {HEADLINE_B.map((w) => (
              <React.Fragment key={w}>
                <Word>{w}</Word>{" "}
              </React.Fragment>
            ))}
          </h1>

          <p data-hero-in className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
            Hi, I&apos;m <strong className="text-black">Wahab Khan</strong> — a Full
            Stack Software Engineer with 4 years of experience. I build{" "}
            <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5">
              AI-powered SaaS
            </span>
            ,{" "}
            <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5">
              agentic workflows
            </span>{" "}
            and scalable APIs with React, Next.js, Node.js &amp; Generative AI.
          </p>

          <div data-hero-in className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs md:text-sm font-mono font-bold uppercase">
            {capabilities.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 border-l-4 border-black pl-3 py-1.5 bg-white/70"
              >
                <span className="text-[#CCFF00] bg-black px-1">✓</span> {c}
              </div>
            ))}
          </div>

          <div data-hero-in className="flex flex-wrap gap-4 mt-1">
            <Link
              href="#contact"
              className="bg-[#CCFF00] text-black px-8 md:px-10 py-4 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all font-display font-bold uppercase text-lg md:text-xl"
            >
              Hire me
            </Link>
            <Link
              href="#work"
              className="bg-white text-black px-8 md:px-10 py-4 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all font-display font-bold uppercase text-lg md:text-xl"
            >
              View work
            </Link>
          </div>
        </div>

        {/* Paper slot — the 3D sheet is positioned over this box */}
        <div className="md:col-span-5 relative flex flex-col items-center">
          <div ref={sideRef} className="self-start md:self-center mb-4 bg-black text-[#CCFF00] font-bold px-2 py-1 text-sm">
            <code className="flex">
              &lt;
              <Typewriter
                options={{
                  strings: [
                    "AI-Powered SaaS Products",
                    "Agentic AI Workflows & Vapi",
                    "Node.js Backend & REST APIs",
                    "Next.js & React Applications",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
              /&gt;
            </code>
          </div>
          <div
            ref={anchorRef}
            className="relative w-[72%] sm:w-[60%] md:w-[82%] max-w-[420px] aspect-[1024/1400] max-h-[66vh]"
          >
            {fallback && <StaticPaperCard />}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/70"
      >
        <span>Scroll</span>
        <span className="block w-[2px] h-8 bg-black/70 animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
