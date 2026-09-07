import React from "react";
import {
  MdNorthEast,
  MdOutlineTerminal,
  MdOutlineTrendingUp,
  MdOutlineSchool,
  MdOutlineDesignServices,
} from "react-icons/md";
import { FaHtml5 } from "react-icons/fa";

const skills = [
  {
    category: "Frameworks & Libraries",
    icon: <MdOutlineTerminal size={32} />,
    color: "bg-[#CCFF00]",
    items: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Sass",
      "shadcn",
      "material ui",
    ],
  },
  {
    category: "Core Web Tech",
    icon: <FaHtml5 size={32} />,
    color: "bg-white",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)"],
  },
  {
    category: "Design Tools",
    icon: <MdOutlineDesignServices size={32} />,
    color: "bg-white",
    items: ["Adobe Photoshop", "Adobe XD", "Figma"],
  },
];

const tools = [
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Sass",
  "Bootstrap",
  "HTML5",
  "CSS3",
  "JavaScript",
  "Git / GitHub",
  "Firebase",
  "WordPress",
  "Adobe XD",
];

const AboutSection = () => {
  return (
    <section className="py-12 md:py-24 scroll-mt-24" id="about">
      {/* Bio Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-24 items-center mb-24 reveal">
        <div className="md:col-span-7">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 leading-none">
            THE BRAINS <br />
            BEHIND <br />
            <span className="bg-[#CCFF00] px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              THE BUILD
            </span>
          </h2>

          <p className="text-lg md:text-xl max-w-full border-l-4 border-primary-container pl-6 py-2 text-on-surface-variant font-medium leading-relaxed mb-6">
            I am a Front-End Developer with over 4+ years of hands-on experience
            building fast, user-focused, and visually striking web platforms.
            Specializing in modern JavaScript frameworks like React.js and
            Next.js, I bridge the gap between high-impact design and clean,
            scalable code.
          </p>

          <p className="text-base text-on-surface-variant font-medium border-l-4 border-black pl-6 py-2 leading-relaxed mb-6">
            My expertise extends beyond standard interfaces to architecting
            complex, data-driven ERP systems and building custom AI-powered
            chatbot solutions that streamline operations.
          </p>

          <p className="text-base text-on-surface-variant font-medium border-l-4 border-black pl-6 py-2 leading-relaxed">
            I love bringing static layouts to life—currently deep-diving into
            advanced web animation libraries to make digital experiences even
            more interactive, responsive, and engaging[cite: 1].
          </p>
        </div>
        <div className="md:col-span-5 relative">
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
        </div>
      </div>

      {/* Technical Arsenal */}
      <div className="mb-24 reveal" id="technical-arsenal">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase whitespace-nowrap">
            Technical Arsenal
          </h2>
          <div className="h-1 w-full bg-black"></div>
        </div>

        {/* Skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`${skill.color} border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between group hover:-translate-y-1 transition-transform stagger-item`}
            >
              <div className="mb-4">{skill.icon}</div>
              <h3 className="font-display text-xl font-bold uppercase mb-3">
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-xs font-mono border border-black px-2 py-0.5 bg-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Full tool grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className={`border-2 border-black p-3 font-display font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] stagger-item text-xs ${
                tool === "React.js" || tool === "Next.js"
                  ? "bg-[#CCFF00]"
                  : tool === "Tailwind CSS" || tool === "Firebase"
                    ? "bg-secondary-fixed"
                    : "bg-white"
              }`}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Journey / Experience Section */}
      <div className="mb-24 reveal" id="journey">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-full bg-black journey-line-animate"></div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase whitespace-nowrap">
            The Journey
          </h2>
        </div>
        <div className="space-y-8">
          {/* Black Lion */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group overflow-hidden reveal">
            <div className="md:col-span-3 bg-black text-primary-container p-8 flex flex-col justify-center items-center font-display font-bold uppercase text-center border-b-2 md:border-b-0 md:border-r-2 border-black">
              <span className="text-3xl font-black">2023</span>
              <span className="text-sm opacity-70">Present</span>
            </div>
            <div className="md:col-span-9 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase">
                    Web Developer
                  </h3>
                  <p className="font-display font-bold text-primary-fixed-dim uppercase tracking-wider text-xs">
                    BLACK LION — Aug 2023 – Present
                  </p>
                </div>
                <span className="hidden md:block text-4xl">
                  <MdNorthEast />
                </span>
              </div>
              <ul className="text-base text-on-surface-variant font-medium space-y-1 list-disc list-inside">
                <li>Developing and optimizing complex user interfaces.</li>
                <li>
                  Writing highly efficient, clean, and reusable React/Next.js
                  code.
                </li>
                <li>
                  Integrating modern animation libraries to elevate overall UX.
                </li>
              </ul>
            </div>
          </div>

          {/* Online Care */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group overflow-hidden reveal transition-delay-150">
            <div className="md:col-span-3 bg-[#CCFF00] text-black p-8 flex flex-col justify-center items-center font-display font-bold uppercase text-center border-b-2 md:border-b-0 md:border-r-2 border-black">
              <span className="text-3xl font-black">Jun</span>
              <span className="text-sm opacity-70">–Aug 2023</span>
            </div>
            <div className="md:col-span-9 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase">
                    Web Developer
                  </h3>
                  <p className="font-display font-bold text-secondary uppercase tracking-wider text-xs">
                    ONLINE CARE — June 2023 – Aug 2023
                  </p>
                </div>
                {/* <span className="hidden md:block text-4xl">
                  <MdOutlineTrendingUp />
                </span> */}
              </div>
              <ul className="text-base text-on-surface-variant font-medium space-y-1 list-disc list-inside">
                <li>
                  Built responsive layouts and verified cross-browser
                  performance.
                </li>
                <li>
                  Troubleshot frontend bugs and optimized site loading speeds.
                </li>
              </ul>
            </div>
          </div>

          {/* Xcl Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group overflow-hidden reveal transition-delay-300">
            <div className="md:col-span-3 bg-secondary-fixed text-black p-8 flex flex-col justify-center items-center font-display font-bold uppercase text-center border-b-2 md:border-b-0 md:border-r-2 border-black">
              <span className="text-3xl font-black">2021</span>
              <span className="text-sm opacity-70">–2023</span>
            </div>
            <div className="md:col-span-9 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase">
                    Web Developer
                  </h3>
                  <p className="font-display font-bold text-secondary uppercase tracking-wider text-xs">
                    XCL TECHNOLOGIES — Sept 2021 – Aug 2023
                  </p>
                </div>
                {/* <span className="hidden md:block text-4xl">
                  <MdOutlineSchool />
                </span> */}
              </div>
              <ul className="text-base text-on-surface-variant font-medium space-y-1 list-disc list-inside">
                <li>
                  Designed, built, and maintained fully responsive client
                  websites.
                </li>
                <li>
                  Collaborated with designers to translate Adobe XD/Photoshop
                  prototypes into pixel-perfect code.
                </li>
                <li>
                  Ensured modern web best practices, SEO optimization, and
                  accessibility.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education */}
        {/* <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase whitespace-nowrap">
              Education
            </h2>
            <div className="h-1 w-full bg-black"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-black p-6 bg-[#CCFF00] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] stagger-item">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2 text-zinc-600">
                2017 – 2022
              </div>
              <h3 className="font-display font-bold text-lg uppercase leading-tight mb-1">
                B.S. Information Technology
              </h3>
              <p className="text-sm font-medium text-zinc-700">
                HIAST / Mehran University, Jamshoro
              </p>
              <p className="font-mono text-xs mt-2 font-bold">GPA: 3.6 / 4.0</p>
            </div>
            <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] stagger-item">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2 text-zinc-600">
                2017
              </div>
              <h3 className="font-display font-bold text-lg uppercase leading-tight mb-1">
                Higher Secondary Certificate
              </h3>
              <p className="text-sm font-medium text-zinc-700">
                Pre-Engineering
              </p>
            </div>
            <div className="border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] stagger-item">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2 text-zinc-600">
                2015
              </div>
              <h3 className="font-display font-bold text-lg uppercase leading-tight mb-1">
                Secondary School Certificate
              </h3>
              <p className="text-sm font-medium text-zinc-700">Science Group</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
