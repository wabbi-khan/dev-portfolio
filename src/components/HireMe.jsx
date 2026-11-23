"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaPaperPlane } from "react-icons/fa";
import { IoMailOutline, IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "kwahab789@gmail.com";
const MAX_CHARS = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const projectTypes = [
  "FULL-STACK AI & SAAS PRODUCT",
  "NEXT.JS & REACT WEB APPLICATION",
  "NODE.JS BACKEND & REST APIS",
  "AI AGENTS & LLM INTEGRATION",
  "RESPONSIVE WEB PLATFORM",
];

const prompts = [
  { label: "Goals", text: "Goals: " },
  { label: "Timeline", text: "Timeline: " },
  { label: "Budget", text: "Budget: " },
];

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/awahabk/", icon: FaLinkedinIn, sub: "/in/awahabk" },
  { label: "GitHub", href: "https://github.com/wabbi-khan", icon: FaGithub, sub: "@wabbi-khan" },
  { label: "WhatsApp", href: "https://wa.me/923313507810", icon: FaWhatsapp, sub: "+92 331 3507810" },
];

const nextSteps = [
  ["01", "You send the letter", "Goals, scope, the “why”."],
  ["02", "I review the project", "And come back with questions & ideas."],
  ["03", "We hop on a call", "Then we start building."],
];

const emptyForm = { name: "", email: "", projectType: "", projectDescription: "" };

function useKarachiTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Field({ label, error, children, htmlFor }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-display font-bold uppercase text-xs tracking-wider">
        {label}
      </label>
      {children}
      <span
        className={`font-mono text-[11px] font-bold uppercase text-error transition-all duration-200 ${
          error ? "opacity-100 h-4" : "opacity-0 h-0"
        }`}
        role={error ? "alert" : undefined}
      >
        {error}
      </span>
    </div>
  );
}

const inputCls = (err) =>
  `w-full bg-white border-2 ${
    err ? "border-error shadow-[4px_4px_0px_0px_#ba1a1a]" : "border-black"
  } px-4 py-3.5 font-body text-base outline-none transition-all focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 focus:bg-[#fdfff2] placeholder:text-zinc-400`;

const HireMe = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const textareaRef = useRef(null);
  const caretToEnd = useRef(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(null); // { name, email } after success
  const [copied, setCopied] = useState(false);
  const time = useKarachiTime();

  const progress = useMemo(() => {
    const done = [
      formData.name.trim(),
      EMAIL_RE.test(formData.email.trim()),
      formData.projectType,
      formData.projectDescription.trim().length >= 10,
    ].filter(Boolean).length;
    return done / 4;
  }, [formData]);

  // ---------------- scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const st = { trigger: sectionRef.current, start: "top 75%" };
      gsap.from("[data-hm-word]", { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.07, scrollTrigger: st });
      gsap.from("[data-hm-pop]", { scale: 0.5, rotate: -8, opacity: 0, duration: 0.8, ease: "back.out(2)", delay: 0.3, scrollTrigger: st });
      gsap.from("[data-hm-fade]", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.2, scrollTrigger: st });
      gsap.from(cardRef.current, {
        y: 70,
        rotate: -2,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
      });
      gsap.from("[data-hm-side]", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-hm-aside]", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ---------------- form logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const pickType = (type) =>
    setFormData((prev) => ({ ...prev, projectType: prev.projectType === type ? "" : type }));

  // "+ Goals" etc. append a starter line and put the caret after it
  const addPrompt = (text) => {
    textareaRef.current?.focus();
    caretToEnd.current = true;
    setFormData((prev) => {
      const cur = prev.projectDescription;
      const sep = cur && !cur.endsWith("\n") ? "\n" : "";
      return { ...prev, projectDescription: (cur + sep + text).slice(0, MAX_CHARS) };
    });
  };

  useEffect(() => {
    if (!caretToEnd.current) return;
    caretToEnd.current = false;
    const el = textareaRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [formData.projectDescription]);

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Tell me your name";
    if (!formData.email.trim()) next.email = "I need an email to reply";
    else if (!EMAIL_RE.test(formData.email.trim())) next.email = "That email looks off";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const shake = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      cardRef.current,
      { x: 0 },
      { keyframes: { x: [0, -12, 10, -8, 6, -3, 0] }, duration: 0.5, ease: "power1.out" },
    );
  };

  // The letter folds and flies off like a paper plane, then comes back as the "sent" note
  const flyAway = () =>
    new Promise((resolve) => {
      const card = cardRef.current;
      if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return resolve();
      gsap
        .timeline({ onComplete: resolve })
        .to(card, { scaleY: 0.85, rotateX: 18, duration: 0.25, ease: "power2.in", transformPerspective: 900 })
        .to(card, {
          x: () => window.innerWidth * 0.55,
          y: -420,
          rotate: 24,
          scale: 0.15,
          opacity: 0,
          duration: 0.8,
          ease: "power3.in",
        });
    });

  const landBack = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.set(card, { clearProps: "transform,opacity" });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(card, { y: 60, opacity: 0, rotate: 2, duration: 0.7, ease: "power3.out" });
    gsap.from("[data-hm-stamp]", { scale: 2.2, rotate: -30, opacity: 0, duration: 0.6, ease: "back.out(2.4)", delay: 0.25 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      shake();
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "hireInquiries"), {
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType,
        projectDescription: formData.projectDescription,
        timestamp: serverTimestamp(),
      });
      const who = { name: formData.name.trim().split(" ")[0], email: formData.email.trim() };
      await flyAway();
      setSent(who);
      setFormData(emptyForm);
      requestAnimationFrame(landBack);
      toast.success("Your message has been sent successfully! I'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      shake();
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const writeAnother = () => {
    setSent(null);
    requestAnimationFrame(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(cardRef.current, { rotateY: -12, opacity: 0, duration: 0.6, ease: "power3.out", transformPerspective: 900 });
      }
    });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Couldn't copy — " + EMAIL);
    }
  };

  const chars = formData.projectDescription.length;

  return (
    <section ref={sectionRef} className="scroll-mt-24 py-12 md:py-20" id="contact">
      {/* ---------------- header ---------------- */}
      <div className="flex flex-col gap-4 mb-12 md:mb-16">
        <div data-hm-fade className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500">05 / Contact</span>
          <span className="inline-flex items-center gap-2 bg-[#CCFF00] text-black border-2 border-black px-3 py-1 font-display font-bold uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            Open for projects
          </span>
        </div>
        <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.95] text-5xl sm:text-6xl lg:text-8xl">
          {["LET'S", "BUILD"].map((w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-[0.06em]">
              <span data-hm-word className="inline-block">{w}</span>
            </span>
          ))}
          <br className="hidden sm:block" />
          <span className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-[0.06em]">
            <span data-hm-word className="inline-block">SOMETHING</span>
          </span>
          <span
            data-hm-pop
            className="inline-block bg-[#CCFF00] border-2 border-black px-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]"
          >
            ICONIC
          </span>
        </h2>
        <p data-hm-fade className="text-lg md:text-xl text-on-surface-variant font-medium max-w-2xl leading-relaxed">
          Ready to transform your vision into an AI-powered SaaS, high-performance web platform, or full-stack
          digital product? I&apos;m looking for bold partners ready to build something that stands out.
        </p>
      </div>

      {/* ---------------- main grid ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Letter */}
        <div className="lg:col-span-8 [perspective:1200px]">
          <div
            ref={cardRef}
            className="relative bg-[#f5f3ec] paper-grid-texture border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] will-change-transform"
          >
            {/* tape */}
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-white/70 border border-black/20 rotate-[-2deg] z-10 pointer-events-none" />

            {sent ? (
              // ---------- sent note ----------
              <div className="relative p-8 md:p-14 min-h-[520px] flex flex-col justify-center gap-6">
                <div
                  data-hm-stamp
                  className="absolute top-8 right-8 md:top-12 md:right-12 w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-black bg-[#CCFF00] flex flex-col items-center justify-center rotate-[-12deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                >
                  <IoCheckmark size={40} />
                  <span className="font-display font-black text-xl md:text-2xl leading-none">SENT</span>
                </div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Letter delivered
                </span>
                <h3 className="font-display font-black uppercase text-4xl md:text-6xl leading-[0.95] tracking-tight max-w-lg">
                  Thanks{sent.name ? `, ${sent.name}` : ""}!
                </h3>
                <p className="text-lg text-on-surface-variant font-medium max-w-md leading-relaxed">
                  Your letter is on its way. I&apos;ll read it properly and reply to{" "}
                  <span className="bg-black text-[#CCFF00] px-1.5 font-bold break-all">{sent.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={writeAnother}
                  className="self-start mt-2 bg-white border-2 border-black px-6 py-3 font-display font-bold uppercase text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#CCFF00] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
                >
                  Write another letter
                </button>
              </div>
            ) : (
              // ---------- letter form ----------
              <form onSubmit={handleSubmit} noValidate className="flex flex-col">
                {/* envelope header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-10 pt-8 pb-4 border-b-2 border-dashed border-black/20">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider flex flex-col gap-1">
                    <span>
                      <span className="text-zinc-500">To:</span> Wahab Khan
                    </span>
                    <span className="truncate max-w-[240px] sm:max-w-none">
                      <span className="text-zinc-500">From:</span>{" "}
                      {formData.name.trim() || <span className="text-zinc-400">your name</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                      {Math.round(progress * 100)}% ready
                    </span>
                    <span className="flex-1 sm:w-36 h-3 border-2 border-black bg-white overflow-hidden">
                      <span
                        className="block h-full bg-[#CCFF00] border-r-2 border-black origin-left transition-transform duration-500 ease-out"
                        style={{ transform: `scaleX(${progress})` }}
                      />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-9 px-6 md:px-10 py-8">
                  {/* 01 */}
                  <fieldset className="flex flex-col gap-4">
                    <legend className="flex items-center gap-3 mb-4">
                      <StepBadge n="01" />
                      <span className="font-display font-black uppercase text-xl md:text-2xl">Who are you?</span>
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Name" htmlFor="hm-name" error={errors.name}>
                        <input
                          id="hm-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="name"
                          className={inputCls(errors.name)}
                          placeholder="John Doe"
                        />
                      </Field>
                      <Field label="Email address" htmlFor="hm-email" error={errors.email}>
                        <input
                          id="hm-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          className={inputCls(errors.email)}
                          placeholder="john@example.com"
                        />
                      </Field>
                    </div>
                  </fieldset>

                  {/* 02 */}
                  <fieldset>
                    <legend className="flex items-center gap-3 mb-4">
                      <StepBadge n="02" />
                      <span className="font-display font-black uppercase text-xl md:text-2xl">What are we building?</span>
                    </legend>
                    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Project type">
                      {projectTypes.map((t) => {
                        const on = formData.projectType === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => pickType(t)}
                            className={`font-display font-bold uppercase text-[11px] md:text-xs tracking-wide px-3.5 py-2.5 border-2 border-black transition-all cursor-pointer ${
                              on
                                ? "bg-black text-[#CCFF00] shadow-[4px_4px_0px_0px_#CCFF00] -translate-y-0.5"
                                : "bg-white hover:bg-[#CCFF00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                            }`}
                          >
                            {on && "✓ "}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* 03 */}
                  <fieldset>
                    <legend className="flex items-center gap-3 mb-4">
                      <StepBadge n="03" />
                      <span className="font-display font-black uppercase text-xl md:text-2xl">Tell me more</span>
                    </legend>
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        maxLength={MAX_CHARS}
                        rows={6}
                        aria-label="Tell me about your project"
                        className={`${inputCls(false)} resize-none leading-relaxed bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,rgba(9,31,33,0.08)_31px,rgba(9,31,33,0.08)_32px)] bg-white`}
                        placeholder="What are we building? Mention goals, timelines, and the 'why' behind the project."
                      />
                      <span
                        className={`absolute bottom-3 right-3 font-mono text-[10px] font-bold px-1.5 py-0.5 ${
                          chars > MAX_CHARS * 0.9 ? "bg-black text-[#CCFF00]" : "bg-white/90 text-zinc-500"
                        }`}
                      >
                        {chars}/{MAX_CHARS}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">Add:</span>
                      {prompts.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()} // keep focus in the textarea
                          onClick={() => addPrompt(p.text)}
                          className="font-mono text-[11px] font-bold uppercase border border-black bg-white px-2 py-0.5 hover:bg-[#CCFF00] transition-colors cursor-pointer"
                        >
                          + {p.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* send */}
                <div className="px-6 md:px-10 pb-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group w-full flex items-center justify-center gap-3 bg-[#CCFF00] text-black border-2 border-black py-5 font-display font-black uppercase text-lg md:text-2xl tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      isSubmitting
                        ? "opacity-70 cursor-wait"
                        : "hover:bg-black hover:text-[#CCFF00] hover:shadow-[6px_6px_0px_0px_#CCFF00] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Folding your letter…" : "Send the letter"}
                    <FaPaperPlane
                      className={`transition-transform duration-300 ${
                        isSubmitting ? "animate-pulse" : "group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-12"
                      }`}
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ---------------- sidebar ---------------- */}
        <aside data-hm-aside className="lg:col-span-4 flex flex-col gap-6">
          {/* direct lines */}
          <div data-hm-side className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-black bg-zinc-50">
              <h3 className="font-display font-black uppercase text-lg">Direct lines</h3>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pick one</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-black/10">
              <span className="w-10 h-10 shrink-0 border-2 border-black bg-[#CCFF00] flex items-center justify-center">
                <IoMailOutline size={20} />
              </span>
              <a href={`mailto:${EMAIL}`} className="min-w-0 flex-1 group">
                <span className="block font-display font-bold uppercase text-xs text-zinc-500">Email</span>
                <span className="block font-mono text-sm font-bold truncate group-hover:underline">{EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="shrink-0 w-9 h-9 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-[#CCFF00] transition-colors cursor-pointer"
              >
                {copied ? <IoCheckmark size={16} /> : <IoCopyOutline size={16} />}
              </button>
            </div>
            {links.map(({ label, href, icon: Icon, sub }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-4 border-b-2 border-black/10 last:border-b-0 hover:bg-[#CCFF00] transition-colors"
              >
                <span className="w-10 h-10 shrink-0 border-2 border-black bg-white flex items-center justify-center group-hover:rotate-[-8deg] transition-transform">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold uppercase text-sm">{label}</span>
                  <span className="block font-mono text-xs text-zinc-500 truncate">{sub}</span>
                </span>
                <MdArrowOutward className="shrink-0 text-xl group-hover:rotate-45 transition-transform" />
              </a>
            ))}
          </div>

          {/* local time */}
          <div data-hm-side className="relative bg-black text-white border-2 border-black shadow-[6px_6px_0px_0px_#CCFF00] p-6 overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle, #CCFF00 1px, transparent 1px)", backgroundSize: "18px 18px" }}
            />
            <div className="relative flex flex-col gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/50">
                Local time · Pakistan (UTC+5)
              </span>
              <span className="font-display font-black text-5xl tracking-tighter text-[#CCFF00] tabular-nums min-h-[3rem]">
                {time || "—"}
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Available for new projects
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-mono text-xs text-white/70">+92 331 3507810</span>
                <span className="ml-auto bg-[#CCFF00] text-black border-2 border-black px-2.5 py-1 font-display font-bold uppercase text-[11px]">
                  Remote / Hybrid
                </span>
              </div>
            </div>
          </div>

          {/* what happens next */}
          <div data-hm-side className="bg-[#f5f3ec] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <h3 className="font-display font-black uppercase text-lg mb-5">What happens next</h3>
            <ol className="relative flex flex-col gap-5">
              <span className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-black/20" aria-hidden="true" />
              {nextSteps.map(([n, title, sub]) => (
                <li key={n} className="relative flex gap-4">
                  <span className="relative z-10 w-8 h-8 shrink-0 bg-black text-[#CCFF00] font-display font-black text-xs flex items-center justify-center">
                    {n}
                  </span>
                  <span>
                    <span className="block font-display font-bold uppercase text-sm">{title}</span>
                    <span className="block text-sm text-on-surface-variant">{sub}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
};

function StepBadge({ n }) {
  return (
    <span className="w-9 h-9 shrink-0 bg-black text-[#CCFF00] font-display font-black text-sm flex items-center justify-center shadow-[3px_3px_0px_0px_#CCFF00]">
      {n}
    </span>
  );
}

export default HireMe;
