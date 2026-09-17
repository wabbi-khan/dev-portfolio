"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward, MdArrowUpward } from "react-icons/md";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { IoMailOutline, IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { toast } from "sonner";

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  // Live Pakistan Local Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("kwahab789@gmail.com");
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="w-full border-t-4 border-black bg-white text-black relative z-20 overflow-hidden">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
        {/* Top Big Callout Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b-2 border-black/10">
          <div className="lg:col-span-8">
            <span className="bg-black text-[#CCFF00] font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-widest inline-block mb-4 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              ● READY TO COLLABORATE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.05]">
              HAVE A PROJECT IN MIND? <br />
              <span className="bg-[#CCFF00] px-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block mt-2">
                LET&apos;S TALK.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 items-start lg:items-end">
            {/* Quick Copy Email Card */}
            <div className="w-full sm:w-auto bg-[#FEF08A] border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-black/60 block mb-1">
                DIRECT INBOX
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm sm:text-base font-bold text-black select-all">
                  kwahab789@gmail.com
                </span>
                <button
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="bg-black text-white p-2 hover:bg-white hover:text-black border border-black transition-colors cursor-pointer"
                >
                  {copied ? (
                    <IoCheckmark size={16} />
                  ) : (
                    <IoCopyOutline size={16} />
                  )}
                </button>
              </div>
            </div>

            <a
              href="#contact"
              className="bg-black text-[#CCFF00] px-8 py-4 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-display font-bold uppercase text-base hover:bg-[#CCFF00] hover:text-black flex items-center gap-2"
            >
              <span>Start A Project</span>
              <MdArrowOutward size={20} />
            </a>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b-2 border-black/10">
          {/* Col 1: Identity & Live Status */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1">
                <Image src="/logo.png" alt="Logo" width={44} height={44} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight">
                  Abdul Wahab Khan
                </h3>
                <p className="font-mono text-xs text-zinc-500 font-bold uppercase">
                  Front-End Developer &amp; Architect
                </p>
              </div>
            </div>

            {/* Live Clock & Status Badge */}
            <div className="mt-3 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 border-2 border-black bg-zinc-50 px-3 py-1.5 w-fit shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">
                  Available for Hire
                </span>
              </div>
              {/* Location badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  Based in Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Chapters */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-1.5 w-fit">
              NAVIGATE
            </span>
            <ul className="flex flex-col gap-2.5 font-display font-bold uppercase text-sm mt-2">
              <li>
                <Link
                  href="#home"
                  className="hover:text-black hover:translate-x-1 inline-block transition-transform text-zinc-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#stats"
                  className="hover:text-black hover:translate-x-1 inline-block transition-transform text-zinc-600"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="#work"
                  className="hover:text-black hover:translate-x-1 inline-block transition-transform text-zinc-600"
                >
                  Selected Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-black hover:translate-x-1 inline-block transition-transform text-zinc-600"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-black hover:translate-x-1 inline-block transition-transform text-zinc-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Direct Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-1.5 w-fit">
              CONNECT
            </span>
            <div className="flex flex-col gap-2.5 mt-2">
              <a
                href="https://github.com/wabbi-khan"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-2 border-black p-2.5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-1 hover:translate-y-[-1px] transition-all font-display font-bold text-sm uppercase"
              >
                <span className="flex items-center gap-2.5">
                  <FaGithub size={18} />
                  <span>GitHub</span>
                </span>
                <MdArrowOutward className="group-hover:rotate-45 transition-transform" />
              </a>

              <a
                href="https://www.linkedin.com/in/awahabk/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-2 border-black p-2.5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-1 hover:translate-y-[-1px] transition-all font-display font-bold text-sm uppercase"
              >
                <span className="flex items-center gap-2.5">
                  <FaLinkedinIn size={18} />
                  <span>LinkedIn</span>
                </span>
                <MdArrowOutward className="group-hover:rotate-45 transition-transform" />
              </a>

              <a
                href="https://wa.me/923313507810"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-2 border-black p-2.5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-1 hover:translate-y-[-1px] transition-all font-display font-bold text-sm uppercase"
              >
                <span className="flex items-center gap-2.5">
                  <FaWhatsapp size={18} />
                  <span>WhatsApp</span>
                </span>
                <MdArrowOutward className="group-hover:rotate-45 transition-transform" />
              </a>

              <a
                href="mailto:kwahab789@gmail.com"
                className="group flex items-center justify-between border-2 border-black p-2.5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-1 hover:translate-y-[-1px] transition-all font-display font-bold text-sm uppercase"
              >
                <span className="flex items-center gap-2.5">
                  <IoMailOutline size={18} />
                  <span>Send Email</span>
                </span>
                <MdArrowOutward className="group-hover:rotate-45 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 4: Technical Arsenal Badges */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-1.5 w-fit">
              CORE TECH
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                "React 19",
                "Next.js",
                "Tailwind",
                "GSAP",
                "Websocket",
                "Redux",
                "TypeScript",
                "REST API",
              ].map((tech, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-black bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="font-mono text-xs font-bold text-zinc-600 uppercase text-center sm:text-left">
            © 2026 ABDUL WAHAB KHAN.
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-2 bg-black text-white px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(204,255,0,1)] hover:bg-[#CCFF00] hover:text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-display font-bold uppercase text-xs cursor-pointer"
          >
            <span>Back To Top</span>
            <MdArrowUpward
              size={18}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
