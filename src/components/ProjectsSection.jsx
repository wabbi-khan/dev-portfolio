"use client";
import React, { useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: "Google map scraper",
    desc: "Google map scraper chrome extension with high performance UI and smooth animations.",
    tags: ["Chrome extension", "Fast api", "React", "tailwind"],
    url: "https://github.com/wabbi-khan/google-map-scraper",
    year: "2026",
  },
  {
    name: "Life drop",
    desc: "Blood Donor web application with modern UI and smooth animations.",
    tags: ["Next.js", "React", "tailwind"],
    url: "https://blood-donor-one.vercel.app/",
    year: "2026",
  },
  {
    name: "Dating Proposal fun",
    desc: "Dating web application with modern UI and smooth animations.",
    tags: ["Next.js", "React", "tailwind"],
    url: "https://date-proposal-omega.vercel.app/",
    year: "2026",
  },
  {
    name: "Nala Bot",
    desc: "Company website with modern UI and smooth animations.",
    tags: ["Next.js", "React", "tailwind"],
    url: "https://www.nalabot.com/",
    year: "2026",
  },
  {
    name: "Music Mandi",
    desc: "Company website with modern UI and smooth animations.",
    tags: ["Next.js", "React", "Sass"],
    url: "https://musicmandi.com/",
    year: "2026",
  },
  {
    name: "Estima8",
    desc: "AI-based software company website with modern UI and smooth animations.",
    tags: ["Next.js", "React", "Sass"],
    url: "https://estima8.ai/",
    year: "2026",
  },
  {
    name: "Xcl Technologies",
    desc: "Full-stack company website with modern UI and smooth animations.",
    tags: ["Next.js", "React", "Sass"],
    url: "https://xcltechnologies.com/",
    year: "2023",
  },
  {
    name: "Black Lion",
    desc: "Enterprise-grade web application with dynamic dashboards and Firebase integration.",
    tags: ["React", "Firebase", "Tailwind"],
    url: "https://www.blacklionapp.com/",
    year: "2024",
  },
  {
    name: "Super Mart",
    desc: "Full-featured e-commerce platform with product listings and cart functionality.",
    tags: ["Next.js", "React", "Sass"],
    url: "https://www.dawoodonline.pk/",
    year: "2023",
  },
  {
    name: "Q Fashion Trends",
    desc: "Fashion e-commerce store with advanced filtering and responsive design.",
    tags: ["React", "Tailwind CSS"],
    url: "https://www.qfashiontrends.com/",
    year: "2023",
  },
  {
    name: "Food Delivery App",
    desc: "Food delivery platform with real-time order tracking and clean UI.",
    tags: ["Next.js", "React", "Firebase"],
    url: "https://hyd-food.vercel.app/",
    year: "2023",
  },
  {
    name: "Stellar Sleep",
    desc: "Health & wellness web app with animated onboarding flows.",
    tags: ["React", "Tailwind CSS"],
    url: "https://emergen-test.vercel.app/",
    year: "2023",
  },
  {
    name: "Cuisine Tonite",
    desc: "Restaurant web app with menu showcase and online reservation system.",
    tags: ["Next.js", "Sass"],
    url: "https://cuisinetonite.com/",
    year: "2023",
  },
  {
    name: "JJR Network",
    desc: "Component library and design system built with reusable React components.",
    tags: ["React", "Tailwind CSS"],
    url: "https://jjr-components.vercel.app/",
    year: "2023",
  },
  {
    name: "Watches Web",
    desc: "Premium watch showcase site with elegant animations and product gallery.",
    tags: ["Next.js", "Tailwind CSS"],
    url: "https://time-clock-gules.vercel.app/",
    year: "2022",
  },
  {
    name: "Fab Care at Home",
    desc: "UK-based care services website with a professional, accessible layout.",
    tags: ["HTML5", "CSS3", "Bootstrap"],
    url: "https://www.fabcareathome.co.uk/",
    year: "2022",
  },
  {
    name: "LUMHS Hospital",
    desc: "Government hospital portal with informational pages and appointment flow.",
    tags: ["HTML5", "CSS3", "Bootstrap"],
    url: "https://luh.gos.pk/",
    year: "2022",
  },
  {
    name: "JF Constructions",
    desc: "Construction company site with project portfolio and service pages.",
    tags: ["HTML5", "CSS3", "Bootstrap"],
    url: "https://jfconstructions.pk/",
    year: "2022",
  },
  {
    name: "Self Trips",
    desc: "Responsive travel website with destination galleries and booking UI.",
    tags: ["HTML5", "CSS3", "Bootstrap"],
    url: "https://self-trips.com/",
    year: "2022",
  },
  {
    name: "Hussain Enterprises",
    desc: "Business enterprise website with clean service catalog.",
    tags: ["HTML5", "CSS3"],
    url: "https://hussain-enterprises.netlify.app/",
    year: "2022",
  },
  {
    name: "Beauty SPA",
    desc: "Elegant spa website with booking form, pricing cards, and gallery.",
    tags: ["HTML5", "CSS3", "Bootstrap"],
    url: "https://beautyspaa.netlify.app/",
    year: "2022",
  },
  {
    name: "ABM Construction",
    desc: "Construction firm portfolio with animated project showcase.",
    tags: ["HTML5", "CSS3"],
    url: "https://abmconstruction.netlify.app/",
    year: "2022",
  },
  {
    name: "Tailwind Landing Page",
    desc: "High-converting SaaS landing page built with Tailwind utility classes.",
    tags: ["HTML5", "Tailwind CSS"],
    url: "https://tailwind-wabbi-khan.vercel.app/",
    year: "2023",
  },
];

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

const ProjectCard = ({ project }) => (
  // Removed perspective-[1400px] from here
  <div className="project-card group relative bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 reveal flex flex-col">
    {/* Color block header with animated SVG placeholder */}
    <div className="aspect-video border-b-2 border-black overflow-hidden bg-black relative flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #CCFF00 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="font-display font-black text-[#CCFF00] text-2xl uppercase tracking-tighter z-10 px-4 text-center leading-tight drop-shadow">
        {project.name}
      </span>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#CCFF00] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </div>

    <div className="p-6 flex flex-col flex-1">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map((tag, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 border border-black font-display font-bold text-[9px] uppercase ${tagColors[tag] || "bg-white"}`}
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-on-tertiary-container self-center">
          {project.year}
        </span>
      </div>

      <p className="text-sm text-on-surface-variant font-medium leading-relaxed flex-1 mb-4">
        {project.desc}
      </p>

      <div className="flex items-center justify-between">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-display font-bold uppercase text-sm hover:bg-[#CCFF00] hover:text-black"
        >
          View Live
        </a>
        <span className="text-black text-2xl">
          <MdArrowOutward />
        </span>
      </div>
    </div>
  </div>
);

const ProjectsSection = () => {
  useEffect(() => {
    // 1. FIX: Set a consistent 3D perspective and origin directly on each card.
    // This ensures every card tilts from its exact center, regardless of grid position.
    gsap.set(".project-card", {
      transformPerspective: 1200,
      transformOrigin: "50% 50%",
    });

    // 2. Create scroll animation (Using Y and Scale to avoid fighting with mousemove rotation)
    gsap.utils.toArray(".project-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
          z: -100,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          z: 0,
          duration: 1,
          ease: "power3.out",
          delay: index * 0.05,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            scrub: true,
          },
        },
      );
    });

    // 3. Add subtle 3D tilt effect on mouse move for each card
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;

      gsap.to(card, {
        rotationY: rotateY,
        rotationX: rotateX,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto", // Ensures this hover tween overrides any previous ones cleanly
      });
    };

    const handleMouseLeave = (e) => {
      gsap.to(e.currentTarget, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup
    return () => {
      gsap.killTweensOf(".project-card");
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.querySelectorAll(".project-card").forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <section className="py-12 md:py-20 scroll-mt-24" id="work">
      <div className="mb-16 reveal">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-black uppercase mb-4 leading-none">
          Selected{" "}
          <span className="bg-[#CCFF00] px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            Projects
          </span>
        </h2>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium">
          A collection of high performance digital solutions from immersive
          React applications to polished, responsive HTML sites.
        </p>
      </div>

      {/* FIX: Removed perspective-[1400px] from the parent grid to prevent double-perspective distortion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
