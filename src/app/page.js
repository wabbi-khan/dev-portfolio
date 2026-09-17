"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HireMe from "@/components/HireMe";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
// import ThreeStoryCanvas from "@/components/ThreeStoryCanvas";
import StorytellingHUD from "@/components/StorytellingHUD";

export default function Home() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          if (entry.target.id === "technical-arsenal") {
            const items = entry.target.querySelectorAll(".stagger-item");
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("active");
              }, index * 100);
            });
          }

          if (entry.target.id === "journey") {
            const line = entry.target.querySelector(".journey-line-animate");
            if (line) line.classList.add("active");
          }
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".reveal, #technical-arsenal, #journey")
      .forEach((el) => revealObserver.observe(el));

    // Initial check
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("active");
        }
      });
    }, 100);

    return () => revealObserver.disconnect();
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-surface-bright/85 paper-grid-texture font-body text-on-surface overflow-x-hidden">
        {/* Subtle tactile paper grain overlay */}
        <div className="paper-grain-overlay" aria-hidden="true" />

        {/* 3D WebGL Story Canvas in background */}
        {/* <ThreeStoryCanvas /> */}

        {/* Storytelling Side HUD */}
        <StorytellingHUD />

        <Toaster position="bottom-center" />
        <Navbar />

        <main className="relative z-10 mt-24 max-w-[1400px] mx-auto px-6 overflow-x-hidden">
          <HeroSection />

          <StatsSection />

          <ProjectsSection />

          {/* About Section */}
          <AboutSection />

          {/* Hire me Section */}
          <HireMe />

          {/* Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </SmoothScrollProvider>
  );
}
