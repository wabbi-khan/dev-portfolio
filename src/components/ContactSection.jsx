import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const ContactSection = () => {
  return (
    <section className="py-12 md:py-24 mb-12 scroll-mt-24 reveal" id="contact">
      <div className="bg-black text-white p-8 md:p-16 border-2 border-black shadow-[16px_16px_0px_0px_rgba(204,255,0,1)] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#CCFF00] uppercase mb-4 leading-tight">
            Ready to build something iconic?
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-medium mb-6">
            I&apos;m currently accepting new projects. Let&apos;s discuss your
            vision and bring it to life with modern React / Next.js tech.
          </p>
          <div className="flex flex-col gap-2 font-mono text-sm text-white/60">
            <span>📍 Hyderabad, Pakistan</span>
            <span>📞 +92-331-3507810</span>
            <a
              href="mailto:kwahab789@gmail.com"
              className="text-[#CCFF00] hover:underline"
            >
              ✉️ kwahab789@gmail.com
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-white border-2 border-white p-1 flex">
            <input
              className="flex-grow bg-black text-white p-4 border-none focus:ring-0 font-body text-base outline-none"
              placeholder="your@email.com"
              type="email"
            />
            <a
              href="mailto:kwahab789@gmail.com"
              className="bg-[#CCFF00] text-black px-6 py-2 border-2 border-black font-display font-bold uppercase hover:bg-white transition-colors text-sm flex items-center"
            >
              Let&apos;s Chat
            </a>
          </div>
          <div className="flex gap-6 flex-wrap">
            <span className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider">
              <span className="text-[#CCFF00]">
                <IoCheckmarkCircleOutline size={25} />
              </span>{" "}
              FAST DELIVERY
            </span>
            <span className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider">
              <span className="text-[#CCFF00]">
                <IoCheckmarkCircleOutline size={25} />
              </span>{" "}
              CLEAN CODE
            </span>
            <span className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider">
              <span className="text-[#CCFF00]">
                <IoCheckmarkCircleOutline size={25} />
              </span>{" "}
              RESPONSIVE DESIGN
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
