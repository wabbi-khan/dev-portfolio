"use client";
import React, { useCallback, useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { projects } from "@/data/projects";
import PaperProjects from "@/components/PaperProjects";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const tagColors = {
  React: "bg-secondary-fixed",
  "Next.js": "bg-[#CCFF00]",
  "Tailwind CSS": "bg-secondary-container",
  Firebase: "bg-secondary-fixed",
  HTML5: "bg-white",
  CSS3: "bg-white",
  Bootstrap: "bg-white",
  Sass: "bg-white",
};

const stickyNoteThemes = [
  {
    bg: "bg-[#FEF08A]", // Classic Post-it Yellow
    tapeBg: "bg-white/70",
    tilt: "-rotate-1",
  },
  {
    bg: "bg-[#CCFF00]", // Signature Neon Lime
    tapeBg: "bg-black/15",
    tilt: "rotate-1.5",
  },
  {
    bg: "bg-[#BAE6FD]", // Sky Blue Sticky
    tapeBg: "bg-white/70",
    tilt: "-rotate-1.5",
  },
  {
    bg: "bg-[#FBCFE8]", // Pastel Pink Sticky
    tapeBg: "bg-white/70",
    tilt: "rotate-1",
  },
  {
    bg: "bg-[#D9F99D]", // Mint Green Sticky
    tapeBg: "bg-white/70",
    tilt: "-rotate-0.5",
  },
  {
    bg: "bg-[#FED7AA]", // Soft Apricot Sticky
    tapeBg: "bg-white/70",
    tilt: "rotate-2",
  },
];

const ProjectCard = ({ project, index = 0 }) => {
  const theme = stickyNoteThemes[index % stickyNoteThemes.length];

  return (
    <div className="pt-4">
      <div
        className={`project-card group relative ${theme.bg} border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col ${theme.tilt} hover:rotate-0`}
      >
        {/* Washi Tape Strip at top center */}
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 ${theme.tapeBg} border border-black/20 shadow-sm backdrop-blur-[2px] rotate-[-1.5deg] z-20 pointer-events-none`}
        />

        {/* Sticky Note Top Adhesive Strip Header */}
        <div className="px-5 pt-4 pb-2.5 border-b-2 border-dashed border-black/15 flex justify-between items-center bg-black/5">
          <span className="font-mono text-[10px] font-black tracking-widest uppercase text-black/70 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black inline-block"></span>
            PROJECT #{index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <span className="font-mono text-xs font-black text-black px-2 py-0.5 border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            &apos;{project.year.slice(-2)}
          </span>
        </div>

        {/* Sticky Note Content Body */}
        <div className="p-6 flex flex-col flex-1">
          {/* Project Title with bold marker style */}
          <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2 leading-tight">
            {project.name}
          </h3>

          {/* Tags styled as sticky flags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 border border-black font-display font-bold text-[9px] uppercase bg-white/80 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-black/85 font-medium leading-relaxed flex-1 mb-6">
            {project.desc}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-black/10">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-display font-bold uppercase text-xs hover:bg-white hover:text-black"
            >
              View Live
            </a>
            <span className="text-black text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
              <MdArrowOutward />
            </span>
          </div>
        </div>

        {/* Dog-ear fold on bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden pointer-events-none">
          <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-black/20 border-t border-l border-black/30 transform rotate-45 shadow-sm" />
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const sectionRef = React.useRef(null);
  const [view, setView] = useState("paper");

  const fallbackToGrid = useCallback(() => setView("grid"), []);

  useEffect(() => {
    if (view !== "grid") return;
    const ctx = gsap.context(() => {
      // 1. Set consistent 3D perspective and origin directly on each card
      gsap.set(".project-card", {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
      });

      // 2. Cinematic 3D scroll entrance with subtle X rotation & Z depth
      const cards = gsap.utils.toArray(".project-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 70,
            rotationX: 14,
            scale: 0.94,
            z: -100,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            z: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "bottom 25%",
              toggleActions: "play none none reverse",
              scrub: 1,
            },
          }
        );
      });

      // 3. 3D tilt effect on mouse move for each card
      const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        gsap.to(card, {
          rotationY: rotateY,
          rotationX: rotateX,
          z: 15,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
          rotationY: 0,
          rotationX: 0,
          z: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          overwrite: "auto",
        });
      };

      const domCards = sectionRef.current?.querySelectorAll(".project-card") || [];
      domCards.forEach((card) => {
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        domCards.forEach((card) => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [view]);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 scroll-mt-24" id="work">
      <div className="mb-16 reveal">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-black uppercase mb-4 leading-none">
          Selected{" "}
          <span className="bg-[#CCFF00] px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            Projects
          </span>
        </h2>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium">
            A showcase of full-stack AI SaaS platforms, agentic workflows, and
            high-performance web applications built with modern engineering standards.
          </p>
          <div
            role="tablist"
            aria-label="Project view"
            className="flex shrink-0 self-start md:self-auto bg-zinc-100 p-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            {[
              { id: "paper", label: "3D Paper" },
              { id: "grid", label: "Grid" },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={`px-4 py-1.5 border-2 font-display font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                  view === v.id
                    ? "bg-black text-[#CCFF00] border-black"
                    : "border-transparent text-black hover:border-black hover:bg-[#CCFF00]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "paper" ? (
        <PaperProjects projects={projects} onFallback={fallbackToGrid} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.url} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
