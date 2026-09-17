"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Generate a crisp, circular particle sprite texture with soft radial glow
function createParticleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const center = size / 2;
  const gradient = ctx.createRadialGradient(
    center, center, 0,
    center, center, center
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(204, 255, 0, 0.9)");
  gradient.addColorStop(0.55, "rgba(0, 103, 125, 0.4)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, center, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export default function ThreeStoryCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent canvas
    container.appendChild(renderer.domElement);

    // --- 3D Particle Cloud Architecture ---
    const particleCount = 2800;
    const particleGeo = new THREE.BufferGeometry();

    const basePositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const limeColor = new THREE.Color(0xccff00);
    const cyanColor = new THREE.Color(0x00677d);
    const darkColor = new THREE.Color(0x091f21);
    const whiteColor = new THREE.Color(0xffffff);

    // Distribute particles in a double-ring flowing 3D spiral wave
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      // Spiral galaxy / wave distribution
      const u = i / particleCount;
      const radius = 3.5 + Math.pow(Math.random(), 0.6) * 14;
      const theta = u * Math.PI * 18 + (Math.random() - 0.5) * 1.5;
      const ySpread = (Math.random() - 0.5) * 8 * (1 - radius / 20);

      const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 2;
      const y = ySpread + Math.sin(radius * 0.4) * 2;
      const z = Math.sin(theta) * (radius * 0.7) + (Math.random() - 0.5) * 5;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      velocities[idx] = (Math.random() - 0.5) * 0.02;
      velocities[idx + 1] = (Math.random() - 0.5) * 0.02;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.02;

      // Color distribution: Neon lime accents, cyan depths, crisp darks
      const rand = Math.random();
      let col;
      if (rand < 0.28) {
        col = limeColor; // Neon lime highlights
        scales[i] = 1.3 + Math.random() * 1.2;
      } else if (rand < 0.55) {
        col = cyanColor;
        scales[i] = 0.9 + Math.random() * 0.8;
      } else if (rand < 0.88) {
        col = darkColor;
        scales[i] = 0.7 + Math.random() * 0.6;
      } else {
        col = whiteColor;
        scales[i] = 1.4;
      }

      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.38,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- State & Coordinates for Storytelling Progression ---
    const state = {
      scrollProgress: 0,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      systemX: 4.2, // Floats on the right side of hero section
      systemY: -0.2,
      systemZ: -1,
      systemRotY: 0,
      waveIntensity: 1,
      spreadFactor: 1,
    };

    // --- Mouse Parallax Handler ---
    const handleMouseMove = (e) => {
      state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- GSAP Story Scroll Progression ---
    // Smoothly shifts particle constellation across chapters
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          state.scrollProgress = self.progress;
        },
      },
    });

    // Chapter 01 (Home) -> Chapter 02 (Overview / Stats)
    masterTimeline.to(
      state,
      {
        systemX: 0,
        systemY: -0.5,
        systemZ: 0,
        systemRotY: Math.PI * 0.6,
        waveIntensity: 1.4,
        spreadFactor: 1.15,
        duration: 0.25,
      },
      0
    );

    // Chapter 02 (Overview) -> Chapter 03 (Projects / Work)
    masterTimeline.to(
      state,
      {
        systemX: 6.5,
        systemY: 1.0,
        systemZ: -4,
        systemRotY: Math.PI * 1.3,
        waveIntensity: 0.85,
        spreadFactor: 0.95,
        duration: 0.3,
      },
      0.25
    );

    // Chapter 03 (Projects) -> Chapter 04 (About / Journey)
    masterTimeline.to(
      state,
      {
        systemX: -5.5,
        systemY: -0.8,
        systemZ: -2,
        systemRotY: Math.PI * 2.1,
        waveIntensity: 1.3,
        spreadFactor: 1.25,
        duration: 0.3,
      },
      0.55
    );

    // Chapter 04 (About) -> Chapter 05 (Contact)
    masterTimeline.to(
      state,
      {
        systemX: 0,
        systemY: 0,
        systemZ: -1,
        systemRotY: Math.PI * 2.9,
        waveIntensity: 1.6,
        spreadFactor: 1.05,
        duration: 0.2,
      },
      0.85
    );

    // --- Animation Render Loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

      // Smooth particle system position interpolation
      particleSystem.position.x +=
        (state.systemX - particleSystem.position.x) * 0.06;
      particleSystem.position.y +=
        (state.systemY - particleSystem.position.y) * 0.06;
      particleSystem.position.z +=
        (state.systemZ - particleSystem.position.z) * 0.06;

      // Rotations: Continuous slow drift + scroll progress + mouse tilt
      particleSystem.rotation.y =
        state.systemRotY + elapsedTime * 0.08 + state.mouseX * 0.35;
      particleSystem.rotation.x =
        0.2 + Math.sin(elapsedTime * 0.3) * 0.08 + state.mouseY * 0.2;
      particleSystem.rotation.z = Math.cos(elapsedTime * 0.2) * 0.05;

      // Dynamic Particle Wave Motion (Living harmonic fluid effect)
      const posAttr = particleGeo.attributes.position;
      const posArray = posAttr.array;
      const mouseInfluenceX = state.mouseX * 2.5;
      const mouseInfluenceY = state.mouseY * 2.5;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const bx = basePositions[idx];
        const by = basePositions[idx + 1];
        const bz = basePositions[idx + 2];

        // Complex harmonic wave across the particle field
        const wave =
          Math.sin(bx * 0.35 + elapsedTime * 1.5) *
          Math.cos(bz * 0.35 + elapsedTime * 1.2) *
          0.8 *
          state.waveIntensity;

        // Subtle interactive mouse displacement
        const dx = bx - mouseInfluenceX;
        const dy = by - mouseInfluenceY;
        const distSq = dx * dx + dy * dy;
        let repelX = 0;
        let repelY = 0;
        if (distSq < 16) {
          const force = (1 - distSq / 16) * 0.8;
          repelX = dx * force;
          repelY = dy * force;
        }

        posArray[idx] = bx * state.spreadFactor + repelX;
        posArray[idx + 1] = by * state.spreadFactor + wave + repelY;
        posArray[idx + 2] = bz * state.spreadFactor;
      }

      posAttr.needsUpdate = true;

      // Subtle camera parallax
      camera.position.x = state.mouseX * 0.7;
      camera.position.y = -state.mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Window Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      masterTimeline.kill();
      if (masterTimeline.scrollTrigger) {
        masterTimeline.scrollTrigger.kill();
      }

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        opacity: 0.95,
        maskImage:
          "radial-gradient(ellipse 95% 95% at 50% 50%, #000 70%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 95% 95% at 50% 50%, #000 70%, transparent 100%)",
      }}
    />
  );
}
