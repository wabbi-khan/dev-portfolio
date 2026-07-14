"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white border-b-2 border-black transition-shadow duration-300 ${
        scrolled ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""
      }`}
    >
      <div className="text-xl font-black text-black tracking-tighter font-display uppercase">
        AW<span className="text-[#CCFF00]">/</span>KHAN
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="#work"
          className="font-display font-bold uppercase tracking-tighter text-black hover:text-black border-b-4 border-[#CCFF00] pb-1 transition-all duration-100"
        >
          Work
        </Link>
        <Link
          href="#about"
          className="font-display font-bold uppercase tracking-tighter text-zinc-600 hover:text-black transition-all duration-100"
        >
          About
        </Link>
        <Link
          href="#contact"
          className="font-display font-bold uppercase tracking-tighter text-zinc-600 hover:text-black transition-all duration-100"
        >
          Contact
        </Link>
        <Link href="#hireme">
          <button className="bg-[#CCFF00] text-black px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-display font-bold uppercase">
            Hire Me
          </button>
        </Link>
      </div>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex flex-col gap-1.5"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 py-6">
          <Link href="#work" onClick={() => setMenuOpen(false)} className="font-display font-bold uppercase text-black">Work</Link>
          <Link href="#about" onClick={() => setMenuOpen(false)} className="font-display font-bold uppercase text-black">About</Link>
          <Link href="#contact" onClick={() => setMenuOpen(false)} className="font-display font-bold uppercase text-black">Contact</Link>
          <Link href="#hireme" onClick={() => setMenuOpen(false)}>
            <button className="bg-[#CCFF00] text-black px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-display font-bold uppercase">Hire Me</button>
          </Link>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
