"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fully transparent canvas
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLightLime = new THREE.PointLight(0xccff00, 3.5, 50);
    pointLightLime.position.set(10, 15, 10);
    scene.add(pointLightLime);

    const pointLightCyan = new THREE.PointLight(0x50d9fe, 3, 50);
    pointLightCyan.position.set(-15, -10, -5);
    scene.add(pointLightCyan);

    // --- Main Core Geometric Group ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(4.5, 1);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x091f21,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      wireframeLinewidth: 2,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(icoMesh);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.OctahedronGeometry(2.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Orbiting Data Rings
    const ringGeo1 = new THREE.TorusGeometry(6.2, 0.04, 16, 100);
    const ringMatLime = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMatLime);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(7.0, 0.03, 16, 100);
    const ringMatCyan = new THREE.MeshBasicMaterial({
      color: 0x00677d,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMatCyan);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // --- Floating Brutalist Cubes / Tech Artifacts ---
    const cubesGroup = new THREE.Group();
    scene.add(cubesGroup);

    const cubeItems = [];
    const cubeCount = 28;
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubeWireGeo = new THREE.EdgesGeometry(cubeGeo);

    for (let i = 0; i < cubeCount; i++) {
      const isLime = i % 3 === 0;
      const cubeMat = new THREE.MeshBasicMaterial({
        color: isLime ? 0xccff00 : 0x091f21,
        transparent: true,
        opacity: 0.45,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);

      // Wireframe border for brutalist edge
      const lineMat = new THREE.LineBasicMaterial({
        color: isLime ? 0x000000 : 0xccff00,
        linewidth: 1,
      });
      const wire = new THREE.LineSegments(cubeWireGeo, lineMat);
      cube.add(wire);

      // Scatter in 3D volume around scene
      const radius = 10 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      cube.position.set(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(phi),
        radius * Math.sin(theta) * Math.cos(phi) - 5
      );

      const scale = 0.5 + Math.random() * 1.2;
      cube.scale.set(scale, scale, scale);

      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      cubesGroup.add(cube);
      cubeItems.push({
        mesh: cube,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        initialY: cube.position.y,
        floatSpeed: 0.5 + Math.random() * 1.5,
      });
    }

    // --- Particle Constellation ---
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorLime = new THREE.Color(0xccff00);
    const colorCyan = new THREE.Color(0x50d9fe);
    const colorDark = new THREE.Color(0x091f21);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 60;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 60;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 50 - 5;

      const choice = Math.random();
      const col = choice < 0.4 ? colorLime : choice < 0.7 ? colorCyan : colorDark;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Perspective Cyber Grid Plane ---
    const gridHelper = new THREE.GridHelper(80, 40, 0xccff00, 0x1f3436);
    gridHelper.position.y = -14;
    gridHelper.rotation.x = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    scene.add(gridHelper);

    // --- State & Interpolation Targets ---
    const state = {
      scrollProgress: 0,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      coreTargetX: 4.5,
      coreTargetY: 0,
      coreTargetZ: 0,
      coreScale: 1,
      camTargetZ: 18,
      camTargetY: 0,
      camTargetX: 0,
      sceneRotY: 0,
    };

    // --- Mouse Parallax Handler ---
    const handleMouseMove = (e) => {
      state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- GSAP Storytelling Scroll Trigger ---
    // Smoothly transform 3D world in sync with page scroll chapters
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

    // Chapter 1 -> Chapter 2 (Hero to Stats: Expanding core, camera shifts closer)
    masterTimeline.to(
      state,
      {
        camTargetZ: 15,
        coreTargetX: 0,
        coreTargetY: -1,
        coreScale: 1.15,
        sceneRotY: Math.PI * 0.5,
        duration: 0.2,
      },
      0
    );

    // Chapter 2 -> Chapter 3 (Stats to Selected Projects: Core moves right with deep perspective)
    masterTimeline.to(
      state,
      {
        camTargetZ: 19,
        coreTargetX: 6.5,
        coreTargetY: 1.5,
        coreScale: 0.9,
        sceneRotY: Math.PI * 1.2,
        duration: 0.3,
      },
      0.25
    );

    // Chapter 3 -> Chapter 4 (Projects to About / Journey: Forward flight through grid corridor)
    masterTimeline.to(
      state,
      {
        camTargetZ: 12,
        coreTargetX: -5.5,
        coreTargetY: -2,
        coreScale: 1.25,
        sceneRotY: Math.PI * 2.0,
        duration: 0.3,
      },
      0.55
    );

    // Chapter 4 -> Chapter 5 (Journey to Hire Me / Contact: Central energetic convergence)
    masterTimeline.to(
      state,
      {
        camTargetZ: 16,
        coreTargetX: 0,
        coreTargetY: 0,
        coreScale: 1.05,
        sceneRotY: Math.PI * 2.8,
        duration: 0.2,
      },
      0.85
    );

    // --- Animation Render Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.06;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.06;

      // Smooth core positions and scaling
      coreGroup.position.x += (state.coreTargetX - coreGroup.position.x) * 0.08;
      coreGroup.position.y += (state.coreTargetY - coreGroup.position.y) * 0.08;
      coreGroup.position.z += (state.coreTargetZ - coreGroup.position.z) * 0.08;

      const currentScale = coreGroup.scale.x;
      const nextScale = currentScale + (state.coreScale - currentScale) * 0.08;
      coreGroup.scale.set(nextScale, nextScale, nextScale);

      // Core rotations (continuous idle drift + mouse reaction + scroll angle)
      coreGroup.rotation.y =
        state.sceneRotY + elapsedTime * 0.25 + state.mouseX * 0.5;
      coreGroup.rotation.x =
        elapsedTime * 0.15 + state.mouseY * 0.3;

      // Inner core reverse spin & pulse
      innerMesh.rotation.y = -elapsedTime * 0.6;
      innerMesh.rotation.z = elapsedTime * 0.4;
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      innerMesh.scale.set(pulse, pulse, pulse);

      // Orbital rings rotation
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.x = elapsedTime * 0.4;

      // Floating cubes animation
      cubeItems.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y =
          item.initialY + Math.sin(elapsedTime * item.floatSpeed) * 0.8;
      });
      cubesGroup.rotation.y = elapsedTime * 0.08 + state.mouseX * 0.2;

      // Particle subtle flow & depth drift
      particles.rotation.y = -elapsedTime * 0.03 + state.mouseX * 0.15;
      particles.rotation.x = state.mouseY * 0.1;

      // Grid helper subtle forward flow
      gridHelper.position.z = (elapsedTime * 2) % 2;

      // Camera position interpolation with parallax
      camera.position.x +=
        (state.camTargetX + state.mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y +=
        (state.camTargetY - state.mouseY * 1.2 - camera.position.y) * 0.05;
      camera.position.z +=
        (state.camTargetZ - camera.position.z) * 0.05;
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

      // Dispose Three.js objects
      icoGeometry.dispose();
      icoMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringMatLime.dispose();
      ringMatCyan.dispose();
      cubeGeo.dispose();
      cubeWireGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();

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
        opacity: 0.85,
        maskImage:
          "radial-gradient(ellipse 90% 90% at 50% 50%, #000 60%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 90% at 50% 50%, #000 60%, transparent 100%)",
      }}
    />
  );
}
