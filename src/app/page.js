"use client";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HireMe from "@/components/HireMe";

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
    <div className="bg-surface-bright font-body text-on-surface">
      <Navbar />

      <main className="mt-24 max-w-[1200px] mx-auto px-6">
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
      <Footer />
    </div>
  );
}
