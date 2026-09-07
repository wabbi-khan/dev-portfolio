import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-black bg-white">
      <div className="">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>
      <div className="flex gap-8">
        <a
          href="https://github.com/wabbi-khan"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-bold uppercase text-black hover:skew-x-2 transition-transform duration-75 text-sm"
        >
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/awahabk/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-bold uppercase text-black hover:skew-x-2 transition-transform duration-75 text-sm"
        >
          LinkedIn
        </a>
        <a
          href="mailto:kwahab789@gmail.com"
          className="font-display font-bold uppercase text-black hover:skew-x-2 transition-transform duration-75 text-sm"
        >
          Email
        </a>
      </div>
      <div className="font-display font-bold uppercase text-zinc-500 text-xs">
        ©2026 ABDUL WAHAB KHAN
      </div>
    </footer>
  );
};
export default Footer;
