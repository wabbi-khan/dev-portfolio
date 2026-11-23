"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdOutlineTerminal,
  MdOutlineDns,
  MdOutlineAutoAwesome,
  MdOutlineSchool,
  MdArrowOutward,
  MdExpandMore,
} from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------- data

const skills = [
  {
    id: "01",
    category: "Languages & Frontend",
    blurb: "Interfaces that feel fast and look sharp.",
    icon: MdOutlineTerminal,
    theme: "lime",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Sass",
      "Modern CSS",
      "Responsive Web Design",
    ],
  },
  {
    id: "02",
    category: "Backend & APIs",
    blurb: "Server-side logic and integrations that hold up.",
    icon: MdOutlineDns,
    theme: "white",
    items: [
      "Node.js",
      "RESTful APIs",
      "Server-Side Development",
      "API Integration",
      "Third-Party Integrations",
    ],
  },
  {
    id: "03",
    category: "AI, LLM & Tools",
    blurb: "Agents and LLM features wired into real products.",
    icon: MdOutlineAutoAwesome,
    theme: "black",
    items: [
      "OpenAI APIs",
      "Generative AI",
      "LLM Integrations",
      "AI Agents",
      "Agentic Workflows",
      "Vapi",
      "Vector Search",
      "Redux",
      "Vercel",
    ],
  },
];

const toolRows = [
  ["React.js", "Next.js", "Node.js", "TypeScript", "JavaScript", "OpenAI APIs", "AI Agents", "Tailwind CSS"],
  ["Redux", "REST APIs", "Vercel", "Git / GitHub", "Vapi", "Vector Search", "Sass", "Bootstrap"],
];

const jobs = [
  {
    year: "2023",
    company: "Black Lion",
    role: "Full Stack Software Engineer",
    period: "Aug 2023 — Present",
    current: true,
    points: [
      "Develop, test, deploy, and maintain full-stack AI-powered SaaS web applications using React.js, Next.js, JavaScript, TypeScript, and Node.js, contributing across frontend development, backend development, RESTful APIs, server-side logic, and production workflows.",
      "Apply 1.5 years of Node.js backend development experience to build server-side functionality, REST API integrations, third-party service integrations, and data-driven application workflows for production SaaS products.",
      "Integrate Generative AI and AI engineering capabilities including OpenAI APIs, LLM integrations, AI agents, agentic workflows, Vapi, and vector search to automate business processes and deliver AI-powered product features.",
      "Build responsive web applications using React.js and Next.js, implement state management with Redux and Context API, connect frontend interfaces to backend services, and ensure accessibility and cross-browser compatibility.",
      "Collaborate with product and business stakeholders throughout the software development lifecycle to translate requirements into production-ready features, troubleshoot production issues, maintain legacy systems, and ship backward-compatible releases.",
    ],
    tags: ["React.js", "Next.js", "TypeScript", "Node.js", "OpenAI", "AI Agents", "Vapi", "Redux"],
  },
  {
    year: "2023",
    company: "Online Care",
    role: "Web Developer",
    period: "Jun 2023 — Aug 2023",
    points: [
      "Built and maintained responsive web applications using HTML5, CSS3, and JavaScript, delivering frontend features, API-connected user experiences, debugging, testing, and production issue resolution.",
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "APIs"],
  },
  {
    year: "2021",
    company: "XCL Technologies",
    role: "Web Developer",
    period: "Sep 2021 — Aug 2023",
    points: [
      "Designed, developed, tested, and maintained responsive websites for local and international clients, focusing on clean code, web application development, usability, performance, and cross-browser compatibility.",
    ],
    tags: ["HTML5", "CSS3", "Bootstrap", "JavaScript"],
  },
];

const VISIBLE_POINTS = 3;

// ---------------------------------------------------------------- pieces

function SectionHeader({ index, title, kicker, lineSide = "right" }) {
  const line = (
    <div className="h-1 w-full bg-black origin-left" data-draw-line />
  );
  return (
    <div className="flex flex-col gap-3 mb-10 md:mb-14">
      {/* <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {index} / {kicker}
      </span> */}
      <div className="flex items-center gap-4">
        {lineSide === "left" && line}
        <h2 className="font-display text-3xl md:text-5xl font-bold uppercase whitespace-nowrap leading-none">
          {title}
        </h2>
        {lineSide === "right" && line}
      </div>
    </div>
  );
}

const cardThemes = {
  lime: {
    card: "bg-[#CCFF00] text-black",
    chip: "bg-white/70 border-black text-black",
    muted: "text-black/70",
    badge: "bg-black text-[#CCFF00]",
  },
  white: {
    card: "bg-white text-black",
    chip: "bg-zinc-50 border-black text-black",
    muted: "text-zinc-600",
    badge: "bg-[#CCFF00] text-black",
  },
  black: {
    card: "bg-black text-white",
    chip: "bg-white/5 border-[#CCFF00]/60 text-[#CCFF00]",
    muted: "text-white/60",
    badge: "bg-[#CCFF00] text-black",
  },
};

function SkillCard({ skill, className = "" }) {
  const t = cardThemes[skill.theme];
  const Icon = skill.icon;
  return (
    <article
      data-reveal
      className={`group relative border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-5 ${t.card} ${className}`}
    >
      {/* tape */}
      <span className="absolute -top-3 left-8 w-20 h-5 bg-white/60 border border-black/20 rotate-[-3deg] pointer-events-none" />
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs font-bold tracking-widest opacity-70">{skill.id} /</span>
        <span className={`font-mono text-[10px] font-black uppercase tracking-widest px-2 py-1 ${t.badge}`}>
          {skill.items.length} skills
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 border-2 border-current flex items-center justify-center shrink-0 group-hover:rotate-[-8deg] transition-transform">
          <Icon size={26} />
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-black uppercase leading-[0.95] tracking-tight">
          {skill.category}
        </h3>
      </div>
      <p className={`text-sm font-medium ${t.muted}`}>{skill.blurb}</p>
      <ul className="flex flex-wrap gap-2 mt-auto">
        {skill.items.map((item) => (
          <li
            key={item}
            className={`font-mono text-[11px] md:text-xs font-bold border px-2.5 py-1 hover:-translate-y-0.5 transition-transform ${t.chip}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ToolMarquee({ items, reverse }) {
  const loop = [...items, ...items,...items, ...items]; // repeat 4x for smooth looping
  return (
    <div className="group overflow-hidden border-y-2 border-black bg-white py-3">
      <div
        className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDirection: reverse ? "reverse" : "normal", animationDuration: "32s" }}
      >
        {loop.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className={`shrink-0 font-display font-bold uppercase text-xs md:text-sm tracking-wider px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              i % 3 === 0 ? "bg-[#CCFF00]" : "bg-white"
            } ${i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"}`}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  const extra = job.points.length - VISIBLE_POINTS;
  const head = job.points.slice(0, VISIBLE_POINTS);
  const rest = job.points.slice(VISIBLE_POINTS);

  return (
    <article
      data-reveal
      className="relative bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_#CCFF00] transition-shadow duration-300"
    >
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-7 py-3 border-b-2 border-black bg-zinc-50">
        <div className="flex items-center gap-2">
          <span className="bg-black text-[#CCFF00] font-display font-black uppercase text-xs md:text-sm tracking-wider px-2.5 py-1">
            {job.company}
          </span>
          {job.current && (
            <span className="inline-flex items-center gap-1.5 bg-[#CCFF00] border-2 border-black font-mono text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Current
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] md:text-xs font-bold uppercase tracking-wider text-zinc-600">
          {job.period}
        </span>
      </div>

      <div className="p-5 md:p-7 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight">
            {job.role}
          </h3>
          <MdArrowOutward className="hidden md:block shrink-0 text-3xl" />
        </div>

        <ul className="flex flex-col gap-3">
          {head.map((p) => (
            <Point key={p} text={p} />
          ))}
        </ul>

        {extra > 0 && (
          <>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <ul className="overflow-hidden flex flex-col gap-3">
                {rest.map((p) => (
                  <Point key={p} text={p} />
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="self-start inline-flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1.5 font-display font-bold uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              {open ? "Show less" : `Show all (${job.points.length})`}
              <MdExpandMore
                size={16}
                className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>
          </>
        )}

        <ul className="flex flex-wrap gap-1.5 pt-4 border-t-2 border-dashed border-black/15">
          {job.tags.map((t) => (
            <li
              key={t}
              className="font-mono text-[10px] md:text-[11px] font-bold uppercase border border-black px-2 py-0.5 bg-zinc-50"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Point({ text }) {
  return (
    <li className="flex gap-3 text-sm md:text-base text-on-surface-variant font-medium leading-relaxed">
      <span className="mt-1 shrink-0 w-4 h-4 bg-[#CCFF00] border-2 border-black" aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}

function GraduationStamp() {
  return (
    <div data-stamp className="relative w-36 h-36 md:w-44 md:h-44 shrink-0">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]">
        <defs>
          <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="#CCFF00" stroke="#000" strokeWidth="4" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="4 5" />
        <text fontFamily="Space Grotesk, Arial Black, sans-serif" fontWeight="800" fontSize="16">
          <textPath href="#stamp-circle" textLength="486" lengthAdjust="spacing">
            MEHRAN UET • GRADUATED • CLASS OF 2022 •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 md:w-20 md:h-20 bg-black text-[#CCFF00] rounded-full flex items-center justify-center border-2 border-black">
          <MdOutlineSchool size={34} />
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- main

export default function AboutDetails() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Header rules draw in
      gsap.utils.toArray("[data-draw-line]").forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: line, start: "top 85%" },
        });
      });

      // Cards rise in, staggered per batch
      gsap.set("[data-reveal]", { y: 48, opacity: 0 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });

      // Tool rows slide in from opposite sides
      gsap.utils.toArray("[data-marquee-row]").forEach((row, i) => {
        gsap.from(row, {
          xPercent: i % 2 ? 12 : -12,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 92%" },
        });
      });

      // Timeline: the rail fills as you scroll, nodes light up when reached
      const rail = root.querySelector("[data-rail-fill]");
      const timeline = root.querySelector("[data-timeline]");
      if (rail && timeline) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: timeline, start: "top 65%", end: "bottom 65%", scrub: 0.5 },
          },
        );
      }
      gsap.utils.toArray("[data-node]").forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top 65%",
          toggleClass: { targets: node, className: "is-reached" },
        });
      });

      // Stamp thumps down
      const stamp = root.querySelector("[data-stamp]");
      if (stamp) {
        gsap.from(stamp, {
          scale: 1.8,
          rotate: -25,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: stamp, start: "top 85%" },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ===================== TECHNICAL ARSENAL ===================== */}
      <div className="mb-28" id="technical-arsenal">
        <SectionHeader index="02" kicker="Skills" title="Technical Arsenal" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <SkillCard skill={skills[0]} className="lg:col-span-7" />
          <SkillCard skill={skills[1]} className="lg:col-span-5" />
          <SkillCard skill={skills[2]} className="lg:col-span-12" />
        </div>

        {/* full-bleed tool stamps */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen mt-12 flex flex-col gap-3">
          {toolRows.map((row, i) => (
            <div key={i} data-marquee-row>
              <ToolMarquee items={row} reverse={i % 2 === 1} />
            </div>
          ))}
        </div>
      </div>

      {/* ===================== THE JOURNEY ===================== */}
      <div className="mb-28" id="journey">
        <SectionHeader index="03" kicker="Experience" title="The Journey" lineSide="left" />

        <div data-timeline className="relative">
          {/* rail: dashed track + scroll-driven fill */}
          <div className="absolute top-2 bottom-2 left-[10.5px] md:left-[154.5px] w-[3px] bg-[repeating-linear-gradient(to_bottom,#000_0_6px,transparent_6px_12px)] opacity-25" />
          <div
            data-rail-fill
            className="absolute top-2 bottom-2 left-[10.5px] md:left-[154.5px] w-[3px] bg-black origin-top"
          />

          <ol className="flex flex-col gap-10 md:gap-14">
            {jobs.map((job) => (
              <li key={job.company} className="relative grid grid-cols-[24px_1fr] md:grid-cols-[120px_24px_1fr] gap-x-4 md:gap-x-6">
                {/* year (desktop) */}
                <div className="hidden md:flex flex-col items-end pt-1">
                  <span className="font-display text-4xl font-black leading-none tracking-tighter">{job.year}</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                    {job.current ? "Now" : "Start"}
                  </span>
                </div>
                {/* node */}
                <div className="flex justify-center pt-2">
                  <span
                    data-node
                    className="journey-node relative z-10 w-6 h-6 border-[3px] border-black bg-white rotate-45 transition-colors duration-300"
                  />
                </div>
                {/* card */}
                <div className="min-w-0">
                  <span className="md:hidden inline-block mb-2 font-display text-2xl font-black tracking-tighter">
                    {job.year}
                  </span>
                  <JobCard job={job} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ===================== EDUCATION ===================== */}
      <div className="mb-24" id="education">
        <SectionHeader index="04" kicker="Education" title="Education" />

        <article
          data-reveal
          className="relative bg-[#f5f3ec] paper-grid-texture border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          {/* perforated ticket edge */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-4 bg-[radial-gradient(circle_at_0_50%,#ebfdff_6px,transparent_7px)] bg-[length:16px_22px] bg-repeat-y"
          />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center p-7 md:p-12 pl-10 md:pl-16">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                Degree · 2018 — 2022
              </span>
              <h3 className="font-display font-black uppercase leading-[0.9] tracking-tighter text-5xl md:text-7xl">
                <span className="bg-[#CCFF00] border-2 border-black px-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                  BS.IT
                </span>
              </h3>
              <p className="font-display text-xl md:text-2xl font-bold uppercase leading-tight">
                Bachelor of Information Technology
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-black text-white font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1">
                  Mehran University of Engineering &amp; Technology
                </span>
                <span className="bg-white border-2 border-black font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                  Jamshoro, Pakistan
                </span>
              </div>
            </div>
            <div className="justify-self-start md:justify-self-end">
              <GraduationStamp />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
