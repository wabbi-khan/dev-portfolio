"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const navLinks = [
  { href: "#home", num: "01", name: "HOME" },
  { href: "#stats", num: "02", name: "OVERVIEW" },
  { href: "#work", num: "03", name: "PROJECTS" },
  { href: "#about", num: "04", name: "ABOUT" },
  { href: "#contact", num: "05", name: "CONTACT" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      // Track active section based on navLinks href IDs
      const sectionIds = navLinks.map((link) => link.href.slice(1));
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.35) {
            current = id;
          }
        }
      }

      if (current) {
        setActiveSection(current);
      } else if (window.scrollY < 150) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    setMenuOpen(false);
    if (
      href.startsWith("#") &&
      typeof window !== "undefined" &&
      window.__lenis
    ) {
      e.preventDefault();
      window.__lenis.scrollTo(href, { offset: -70, duration: 1.2 });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top micro status bar */}
      <div className="bg-black text-[#CCFF00] text-[10px] font-mono font-bold px-6 py-1 flex justify-between items-center border-b border-black select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse inline-block"></span>
          <span className="tracking-widest uppercase">
            STATUS: OPEN FOR NEW PROJECTS
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-white/70">
          <span>PAKISTAN (UTC+5)</span>
          <span>•</span>
          <span className="text-[#CCFF00]">FRONT-END ARCHITECT</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full bg-white/95 backdrop-blur-md border-b-2 border-black transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,1)] py-3" : "py-4"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          {/* Brand Identity */}
          <Link
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              <Image
                src="/logo.png"
                alt="Logo"
                width={38}
                height={38}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg md:text-xl uppercase tracking-tighter leading-none text-black">
                Wahab Khan
              </span>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Dev Portfolio &apos;26
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-zinc-100 p-1.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link?.href?.slice(1);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`font-display font-bold uppercase text-xs tracking-wider px-3.5 py-1.5 border-2 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-black text-[#CCFF00] border-black shadow-[2px_2px_0px_0px_rgba(204,255,0,1)]"
                      : "border-transparent text-black hover:border-black hover:bg-[#CCFF00]"
                  }`}
                >
                  {/* <span className="font-mono text-[9px] opacity-70">{link.num}</span> */}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Social Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/wabbi-khan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/awahabk/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>

            {/* Hire Me CTA Button */}
            <Link href="#hireme" onClick={(e) => handleLinkClick(e, "#hireme")}>
              <button className="bg-[#CCFF00] text-black px-5 py-2.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-black hover:text-[#CCFF00] transition-all font-display font-black uppercase text-xs tracking-wider flex items-center gap-1.5 cursor-pointer">
                <span>Hire Me</span>
                <MdArrowOutward size={16} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="md:hidden border-2 border-black p-2.5 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`w-full h-0.5 bg-black transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-black transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-black transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-b-4 border-black bg-white shadow-[0_8px_0_0_rgba(0,0,0,1)] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="border-2 border-black p-3 bg-zinc-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 font-display font-black text-lg uppercase tracking-tight text-black hover:bg-[#CCFF00] transition-colors flex justify-between items-center"
              >
                <span>{link.name}</span>
                <span className="font-mono text-xs text-zinc-500">
                  {link.num}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Socials & CTA */}
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="#hireme"
              onClick={(e) => handleLinkClick(e, "#hireme")}
              className="w-full bg-[#CCFF00] text-black p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center font-display font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2"
            >
              <span>Hire Me</span>
              <MdArrowOutward size={18} />
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://github.com/wabbi-khan"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-black p-2.5 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 font-display font-bold text-xs uppercase"
              >
                <FaGithub size={16} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/awahabk/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-black p-2.5 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 font-display font-bold text-xs uppercase"
              >
                <FaLinkedinIn size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
