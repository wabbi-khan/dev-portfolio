import React from "react";
import Link from "next/link";
import Typewriter from "typewriter-effect";

const HeroSection = () => {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:pt-24 items-center"
      id="home"
    >
      <div className="md:col-span-7 flex flex-col gap-4 reveal">
        <div className="inline-block bg-secondary-container px-4 py-1 border-2 border-black w-fit font-bold uppercase text-xs">
          Available for new projects
        </div>
        <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5 mx-1 inline-block mt-1 w-fit">
          <Typewriter
            options={{
              strings: [
                "Custom ERP and Software Systems",
                "AI Chatbot Integrations",
                "Real-Time Dashboards",
                "UI/UX Animations",
                "Web Applications",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-black uppercase tracking-tighter">
          FRONT-END{" "}
          <span className="bg-[#CCFF00] px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            DEVELOPER
          </span>{" "}
          &amp; WEB ARCHITECT
        </h1>

        {/* Client Catching Paragraph */}
        <p className="text-lg md:text-xl max-w-full text-on-surface-variant font-medium leading-relaxed">
          Hi, I&apos;m <strong>Abdul Wahab Khan</strong> — a Front-End Developer
          with 4+ years of experience engineering high-performance web
          platforms. I turn complex requirements into smooth digital products
          from
          <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5 mx-1 inline-block mt-1">
            Custom ERP and Software Systems
          </span>
          and{" "}
          <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5 mx-1 inline-block mt-1">
            AI Chatbots
          </span>
          to real-time data{" "}
          <span className="bg-black text-[#CCFF00] font-bold px-1.5 py-0.5 mx-1 inline-block mt-1">
            Dashboards
          </span>
          and scalable web applications using React.js &amp; Next.js.
        </p>

        {/* Quick Capabilities Highlights */}
        <div className="grid grid-cols-2 gap-3 text-sm font-mono font-bold uppercase">
          <div className="flex items-center gap-2 border-l-4 border-black pl-3 py-1 bg-zinc-50">
            <span className="text-[#CCFF00] bg-black px-1">✓</span> Custom ERP
            Platforms
          </div>
          <div className="flex items-center gap-2 border-l-4 border-black pl-3 py-1 bg-zinc-50">
            <span className="text-[#CCFF00] bg-black px-1">✓</span> AI Chatbot
            Integrations
          </div>
          <div className="flex items-center gap-2 border-l-4 border-black pl-3 py-1 bg-zinc-50">
            <span className="text-[#CCFF00] bg-black px-1">✓</span> Real-Time
            Dashboards
          </div>
          <div className="flex items-center gap-2 border-l-4 border-black pl-3 py-1 bg-zinc-50">
            <span className="text-[#CCFF00] bg-black px-1">✓</span> UI/UX
            Animations
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-2">
          <Link href="#hireme">
            <button className="bg-[#CCFF00] text-black px-10 py-4 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-display font-bold uppercase text-xl">
              HIRE ME
            </button>
          </Link>
          <Link href="#work">
            <button className="bg-white text-black px-10 py-4 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-display font-bold uppercase text-xl">
              VIEW WORK
            </button>
          </Link>
        </div>

        {/* Location badge */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Based in Hyderabad, Pakistan
          </span>
        </div>
      </div>

      <div className="md:col-span-5 relative group cursor-crosshair reveal transition-delay-200">
        <div className="bg-[#CCFF00] border-2 border-black absolute inset-0 translate-x-4 translate-y-4 animate-drift"></div>
        <div className="relative z-10 w-full aspect-square border-2 border-black bg-white flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
          {/* Brutalist Grid Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Animated SVG with coding theme */}
          <svg
            className="w-4/5 h-4/5 relative z-20"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes blink-cursor {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }
                .animate-cursor { animation: blink-cursor 1s step-end infinite; }
                .shape-brutal { stroke: black; stroke-width: 3; }
              `}</style>
            </defs>

            {/* Spinning outer ring */}
            <rect
              className="animate-spin-slow shape-brutal"
              fill="none"
              height="200"
              width="200"
              x="100"
              y="100"
            ></rect>

            {/* Main floating code block */}
            <g className="animate-float">
              {/* Screen / monitor body */}
              <rect
                className="shape-brutal"
                fill="#CCFF00"
                height="120"
                width="150"
                x="125"
                y="130"
              ></rect>
              {/* Screen inner */}
              <rect fill="black" height="90" width="120" x="140" y="145"></rect>
              {/* Code lines */}
              <line
                stroke="#CCFF00"
                strokeWidth="3"
                x1="155"
                x2="200"
                y1="165"
                y2="165"
              />
              <line
                stroke="#50D9FE"
                strokeWidth="3"
                x1="155"
                x2="220"
                y1="178"
                y2="178"
              />
              <line
                stroke="white"
                strokeWidth="3"
                x1="155"
                x2="190"
                y1="191"
                y2="191"
              />
              <line
                stroke="#CCFF00"
                strokeWidth="3"
                x1="155"
                x2="205"
                y1="204"
                y2="204"
              />
              <line
                stroke="#50D9FE"
                strokeWidth="3"
                x1="155"
                x2="215"
                y1="217"
                y2="217"
              />
              {/* Blinking cursor */}
              <rect
                className="animate-cursor"
                fill="#CCFF00"
                height="12"
                width="6"
                x="219"
                y="207"
              />
            </g>

            {/* React atom-like orbit */}
            <g transform="translate(320, 80)">
              <circle
                cx="0"
                cy="0"
                fill="none"
                opacity="0.5"
                r="35"
                stroke="#CCFF00"
                strokeWidth="2"
              ></circle>
              <ellipse
                cx="0"
                cy="0"
                fill="none"
                rx="35"
                ry="10"
                stroke="black"
                strokeWidth="1"
              ></ellipse>
              <circle
                cx="0"
                cy="-35"
                r="8"
                fill="#CCFF00"
                stroke="black"
                strokeWidth="2"
              />
            </g>

            {/* Decorative shapes */}
            <circle
              className="shape-brutal animate-pulse"
              cx="80"
              cy="80"
              fill="#CCFF00"
              r="20"
            ></circle>
            <rect
              className="shape-brutal"
              fill="black"
              height="40"
              width="40"
              x="40"
              y="300"
            ></rect>
            <line
              className="shape-brutal"
              strokeDasharray="10 5"
              x1="320"
              x2="380"
              y1="320"
              y2="380"
            ></line>
          </svg>

          <div className="absolute bottom-4 left-4 bg-black text-[#CCFF00] px-2 py-1 font-mono text-[10px] uppercase tracking-tighter">
            React.Next.Js.V3+
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
