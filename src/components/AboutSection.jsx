"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onSiteReady } from "@/lib/preload";
import AboutDetails from "@/components/AboutDetails";

gsap.registerPlugin(ScrollTrigger);

/** Original animated box — shown for reduced-motion / no-WebGL visitors. */
function LegacyVisual() {
  return (
    <>
      <div className="bg-[#CCFF00] border-2 border-black absolute inset-0 translate-x-4 translate-y-4 animate-drift"></div>
      <div className="relative z-10 w-full aspect-square border-2 border-black bg-white flex items-center justify-center overflow-hidden group cursor-pointer">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "15px 15px",
          }}
        ></div>
        <svg
          className="w-4/5 h-4/5 relative z-20"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              @keyframes brain-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              @keyframes orbit {
                from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
                to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
              }
              @keyframes build-stack {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              .animate-brain { animation: brain-pulse 3s ease-in-out infinite; transform-origin: center; }
              .animate-orbit { animation: orbit 8s linear infinite; }
              .animate-stack { animation: build-stack 4s ease-in-out infinite; }
            `}</style>
          </defs>
          <g className="animate-brain">
            <rect
              className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              fill="#CCFF00"
              height="100"
              stroke="black"
              strokeWidth="4"
              width="100"
              x="150"
              y="150"
            ></rect>
            <line
              stroke="black"
              strokeWidth="4"
              x1="150"
              x2="250"
              y1="200"
              y2="200"
            ></line>
            <line
              stroke="black"
              strokeWidth="4"
              x1="200"
              x2="200"
              y1="150"
              y2="250"
            ></line>
          </g>
          <g transform="translate(200, 200)">
            <g className="animate-orbit">
              <rect
                fill="black"
                height="30"
                stroke="#CCFF00"
                strokeWidth="2"
                width="30"
                x="-15"
                y="-15"
              ></rect>
            </g>
            <g className="animate-orbit" style={{ animationDelay: "-2s" }}>
              <circle
                fill="white"
                r="15"
                stroke="black"
                strokeWidth="2"
              ></circle>
            </g>
          </g>
          <g className="animate-stack">
            <rect fill="black" height="20" width="60" x="50" y="300"></rect>
            <rect
              fill="#CCFF00"
              height="20"
              stroke="black"
              strokeWidth="2"
              width="40"
              x="60"
              y="275"
            ></rect>
          </g>
        </svg>
        <div className="absolute top-4 right-4 bg-black text-[#CCFF00] px-2 py-1 font-mono text-[10px] uppercase tracking-tighter">
          Core.Engine.Active
        </div>
      </div>
    </>
  );
}

const AboutSection = () => {
  const anchorRef = useRef(null);
  const [mode, setMode] = useState("paper");

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    let disposed = false;
    let ctrl = null;
    let near = null;
    let vis = null;
    let trigger = null;

    const start = async () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        webgl = false;
      }
      if (reduced || !webgl) {
        setMode("legacy");
        return;
      }
      try {
        const { createAboutPaper } = await import("@/lib/paper/aboutScene");
        if (disposed) return;
        ctrl = createAboutPaper({
          anchor,
          getLaunch: () => document.getElementById("paper-stage"),
          onError: (err) => {
            console.error("[About]", err);
            setMode("legacy");
          },
        });
        // Scrubbed: starts as the slot enters from the bottom (projects stage
        // still on screen), finishes unfolded when the slot is near centre
        trigger = ScrollTrigger.create({
          trigger: anchor,
          start: "top bottom",
          end: "center 55%",
          onUpdate: (self) => ctrl.setProgress(self.progress),
          onRefresh: (self) => ctrl.setProgress(self.progress),
        });
        vis = new IntersectionObserver(([e]) => ctrl.setVisible(e.isIntersecting), {
          rootMargin: "60% 0px 60% 0px",
        });
        vis.observe(anchor);
      } catch (err) {
        console.error("[About]", err);
        setMode("legacy");
      }
    };

    // Build lazily: after the preloader, once the slot is within ~one screen
    const offReady = onSiteReady(() => {
      near = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          near.disconnect();
          start();
        },
        { rootMargin: "120% 0px 120% 0px" },
      );
      near.observe(anchor);
    });

    return () => {
      disposed = true;
      offReady();
      near?.disconnect();
      vis?.disconnect();
      trigger?.kill();
      ctrl?.destroy();
    };
  }, []);

  return (
    <section className="scroll-mt-24" id="about">
      {/* Bio Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-24 items-center mb-10 reveal">
        <div className="md:col-span-7">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 leading-none">
            THE BRAINS <br />
            BEHIND <br />
            <span className="bg-[#CCFF00] px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              THE BUILD
            </span>
          </h2>

          <p className="text-lg md:text-xl max-w-full border-l-4 border-primary-container pl-6 py-2 text-on-surface-variant font-medium leading-relaxed mb-6">
            I am a Full Stack Software Engineer with 4 years of software
            development experience, including 1.5 years of hands-on Node.js
            backend development. Experienced in full stack web application
            development, frontend, backend, SaaS product development, RESTful
            API development and integration, and production deployment using
            React.js, Next.js, JavaScript, TypeScript, and Node.js.
          </p>

          <p className="text-base text-on-surface-variant font-medium border-l-4 border-black pl-6 py-2 leading-relaxed mb-6">
            I build AI-powered products with OpenAI APIs, Generative AI, LLM
            integrations, AI agents, Vapi, and vector search, with end-to-end
            ownership across responsive user interfaces, server-side logic,
            third-party API integrations, debugging, maintenance, and product
            delivery.
          </p>

          <p className="text-base text-on-surface-variant font-medium border-l-4 border-black pl-6 py-2 leading-relaxed">
            I collaborate with product and business stakeholders throughout the
            software development lifecycle to translate requirements into
            production-ready features, troubleshoot production issues, maintain
            legacy systems, and ship backward-compatible releases.
          </p>
        </div>
        <div className="md:col-span-5 relative">
          {mode === "paper" ? (
            // The 3D "about" sheet flies in from the projects pile and unfolds over this slot
            <div
              ref={anchorRef}
              className="mx-auto w-[72%] sm:w-[60%] md:w-[82%] max-w-[420px] aspect-[1024/1400]"
            />
          ) : (
            <LegacyVisual />
          )}
        </div>
      </div>

      <AboutDetails />
    </section>
  );
};

export default AboutSection;
