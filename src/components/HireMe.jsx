import React from "react";
import { IoMailOutline } from "react-icons/io5";
import { MdInsertLink, MdOutlineTerminal } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";

const HireMe = () => {
  return (
    <section className="scroll-mt-24" id="hireme">
      <div className="flex flex-col gap-sm">
        <span className="bg-primary-container text-black font-label-bold px-3 py-1 self-start border-2 border-black uppercase text-xs">
          OPEN FOR PROJECTS
        </span>
        <h1 className="font-headline-xl text-black uppercase">
          LET&apos;S BUILD SOMETHING ICONIC
        </h1>
        <p className="font-body-lg max-w-2xl text-on-surface-variant">
          Ready to transform your vision into a high-performance React / Next.js
          digital experience? I&apos;m looking for bold partners ready to build
          something that stands out.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Contact Form Area */}
        <div className="lg:col-span-8 bg-white border-2 border-black neo-shadow-lg p-lg md:p-xl">
          <form
            className="flex flex-col gap-lg"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "mailto:kwahab789@gmail.com";
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold uppercase">Name</label>
                <input
                  className="bg-white border-2 border-black p-md font-body-md focus:ring-0 focus:border-primary-container focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
                  placeholder="John Doe"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold uppercase">
                  Email Address
                </label>
                <input
                  className="bg-white border-2 border-black p-md font-body-md focus:ring-0 focus:border-primary-container focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
                  placeholder="john@example.com"
                  type="email"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold uppercase">Project Type</label>
              <select className="bg-white border-2 border-black p-md font-body-md focus:ring-0 focus:border-primary-container focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all appearance-none">
                <option>WEB DEVELOPMENT (REACT / NEXT.JS)</option>
                <option>RESPONSIVE HTML & CSS SITE</option>
                <option>UI/UX IMPLEMENTATION</option>
                <option>FULL-STACK PRODUCT</option>
                <option>WORDPRESS SITE</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold uppercase">
                Tell me about your project
              </label>
              <textarea
                className="bg-white border-2 border-black p-md font-body-md focus:ring-0 focus:border-primary-container focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all resize-none"
                placeholder="What are we building? Mention goals, timelines, and the 'why' behind the project."
                rows="6"
              ></textarea>
            </div>
            <button
              className="bg-primary-container text-black font-headline-md uppercase py-lg border-2 border-black neo-shadow neo-shadow-hover flex items-center justify-center gap-sm group"
              type="submit"
            >
              SEND MESSAGE
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                <LuSendHorizontal size={25} />
              </span>
            </button>
          </form>
        </div>

        {/* Side Info Area */}
        <aside className="lg:col-span-4 flex flex-col gap-lg">
          {/* Info Card */}
          <div className="bg-surface-container border-2 border-black neo-shadow p-lg">
            <h3 className="font-headline-md uppercase mb-md">DIRECT LINKS</h3>
            <div className="flex flex-col gap-md">
              <a
                className="font-label-bold text-body-lg underline hover:text-primary transition-colors flex items-center gap-sm"
                href="mailto:kwahab789@gmail.com"
              >
                <span className="material-symbols-outlined">
                  <IoMailOutline size={25} />
                </span>
                kwahab789@gmail.com
              </a>
              <a
                className="font-label-bold text-body-lg underline hover:text-primary transition-colors flex items-center gap-sm"
                href="https://www.linkedin.com/in/awahabk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined">
                  <MdInsertLink size={25} />
                </span>
                LINKEDIN
              </a>
              <a
                className="font-label-bold text-body-lg underline hover:text-primary transition-colors flex items-center gap-sm"
                href="https://github.com/wabbi-khan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined">
                  <MdOutlineTerminal size={25} />
                </span>
                GITHUB
              </a>
            </div>
          </div>

          {/* Office Visual - replaced with a styled info card */}
          <div className="bg-black border-2 border-black neo-shadow p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #CCFF00 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 flex flex-col gap-4">
              <p className="font-display font-bold uppercase text-[#CCFF00] text-lg">
                Hyderabad, Pakistan
              </p>
              <p className="font-mono text-white/70 text-sm">+92-331-3507810</p>
              <p className="font-mono text-white/70 text-sm">
                kwahab789@gmail.com
              </p>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary-container text-black border-2 border-black px-4 py-2 font-label-bold uppercase neo-shadow text-xs">
              REMOTE / HYBRID
            </div>
          </div>

          {/* Status Check */}
          <div className="bg-white border-2 border-black neo-shadow p-md flex items-center gap-md">
            <div className="w-4 h-4 bg-primary-container border-2 border-black animate-pulse"></div>
            <span className="font-label-bold uppercase">
              CURRENTLY ACCEPTING NEW PROJECTS
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default HireMe;
