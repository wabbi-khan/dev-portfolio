// Hero paper: a single sheet that unfolds on load, floats/tilts with the mouse,
// and crumples + drops as the hero scrolls away (progress 0 → 1).
// Uses the same baked VAT crumple as the projects showcase (loaded once, cached).

import * as THREE from "three";
import { loadVATData } from "./vat";
import {
  createFaceMaterial,
  createSharedBuffers,
  createPaperMesh,
  updatePaperFrame,
  loadFaceFonts,
} from "./paperMesh";

const OPEN_FRAME = 3; // a few wrinkles so it reads as real paper
const INTRO_DURATION = 1.7;
const CAMERA_Z = 5;
const FOV = 30;

const DISPLAY = '"Space Grotesk", "Arial Black", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';
const INK = "#0b0b0b";
const LIME = "#ccff00";

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function drawHeroFace(ctx, W, H) {
  const PAD = 96;
  ctx.fillStyle = "#f5f3ec";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(9, 31, 33, 0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 32; x <= W; x += 64) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = 32; y <= H; y += 64) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();
  ctx.textBaseline = "alphabetic";

  // Header
  ctx.fillStyle = INK;
  ctx.font = `700 32px ${DISPLAY}`;
  ctx.fillText("● WAHAB KHAN", PAD, 124);
  ctx.textAlign = "right";
  ctx.fillText("PORTFOLIO '26", W - PAD, 124);
  ctx.textAlign = "left";
  ctx.fillRect(PAD, 150, W - PAD * 2, 5);

  // Big statement
  ctx.font = `900 132px ${DISPLAY}`;
  ctx.fillText("I BUILD", PAD, 318);
  const word = "AI PRODUCTS";
  ctx.font = `900 118px ${DISPLAY}`;
  const ww = ctx.measureText(word).width;
  ctx.fillStyle = INK;
  ctx.fillRect(PAD + 10, 352 + 10, Math.min(ww + 36, W - PAD * 2), 132);
  ctx.fillStyle = LIME;
  ctx.fillRect(PAD, 352, Math.min(ww + 36, W - PAD * 2), 132);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(PAD, 352, Math.min(ww + 36, W - PAD * 2), 132);
  ctx.fillStyle = INK;
  ctx.fillText(word, PAD + 18, 462);
  ctx.font = `900 132px ${DISPLAY}`;
  ctx.fillText("THAT SHIP.", PAD, 628);

  // Code block
  const box = { x: PAD, y: 690, w: W - PAD * 2, h: 380 };
  ctx.fillStyle = INK;
  ctx.fillRect(box.x + 12, box.y + 12, box.w, box.h);
  ctx.fillStyle = "#111";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(box.x + 40 + i * 34, box.y + 38, 10, 0, Math.PI * 2);
    ctx.fill();
  });
  const lines = [
    [["const ", "#50d9fe"], ["engineer", "#fff"], [" = {", "#fff"]],
    [["  role: ", "#9aa"], ['"Full Stack + AI"', LIME], [",", "#fff"]],
    [["  stack: ", "#9aa"], ['["Next.js", "Node", "LLMs"]', LIME], [",", "#fff"]],
    [["  experience: ", "#9aa"], ['"4 years"', LIME], [",", "#fff"]],
    [["  status: ", "#9aa"], ['"open to work"', "#28c840"], [",", "#fff"]],
    [["};", "#fff"]],
  ];
  ctx.font = `600 31px ${MONO}`;
  lines.forEach((segs, i) => {
    let x = box.x + 40;
    const y = box.y + 108 + i * 46;
    for (const [text, color] of segs) {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
  });

  // Stats
  const stats = [
    ["4", "YEARS"],
    ["1.5", "YRS NODE.JS"],
    ["22", "PROJECTS"],
  ];
  const colW = (W - PAD * 2) / 3;
  stats.forEach(([n, label], i) => {
    const x = PAD + i * colW;
    ctx.fillStyle = INK;
    ctx.font = `900 92px ${DISPLAY}`;
    ctx.fillText(n, x, 1190);
    ctx.font = `700 26px ${DISPLAY}`;
    ctx.fillStyle = "#555";
    ctx.fillText(label, x, 1232);
  });

  // Footer
  const cta = "SCROLL TO CRUMPLE ↓";
  ctx.font = `800 38px ${DISPLAY}`;
  const cw = ctx.measureText(cta).width;
  ctx.fillStyle = LIME;
  ctx.fillRect(PAD - 8, H - 118, cw + 16, 24);
  ctx.fillStyle = INK;
  ctx.fillText(cta, PAD, H - 96);
}

export function createHeroPaper({ container, anchor, getLanding, onLanded, onReady, onError }) {
  const lowPower =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;opacity:0;transition:opacity .6s ease";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, CAMERA_Z);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xccff00, 0.35); // lime rim
  fill.position.set(-3, -1, 2);
  scene.add(fill);

  // Paper normal is +Y and its top edge is +Z → face the camera, top up
  const baseQuat = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0),
    ),
  );

  const group = new THREE.Group();
  scene.add(group);

  let animData = null;
  let paper = null;
  let face = null;
  let disposed = false;
  let visible = true;
  let running = false;
  let introStart = -1;
  let introRequested = false;
  let prev = performance.now() / 1000;

  const flatCenter = new THREE.Vector3();
  const crumpleCenter = new THREE.Vector3();
  const flatSize = { width: 1, depth: 1.4 };
  let crumpleRadius = 0.3;
  let landed = false;
  const target = { x: 0, y: 0, scale: 1 }; // where the anchor box is, in world units
  const view = { w: 1, h: 1, px: 1, py: 1 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let progressTarget = 0;
  let progress = 0;

  function layout() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    view.h = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    view.w = view.h * camera.aspect;
    view.px = w;
    view.py = h;
    measureAnchor();
  }

  // Track the paper slot in the page (it moves while not pinned, e.g. on mobile)
  function measureAnchor() {
    if (!anchor) return;
    const c = container.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    if (!a.width || !a.height) return;
    const cx = a.left + a.width / 2 - c.left;
    const cy = a.top + a.height / 2 - c.top;
    target.x = (cx / view.px - 0.5) * view.w;
    target.y = -(cy / view.py - 0.5) * view.h;
    target.scale = Math.min(
      ((a.height / view.py) * view.h) / flatSize.depth,
      ((a.width / view.px) * view.w) / flatSize.width,
    );
  }

  // Where the ball should land: the projects stage floor, in world units,
  // plus the on-screen diameter of the project balls there.
  function measureLanding() {
    const el = getLanding?.();
    if (!el || !el.isConnected) return null;
    const r = el.getBoundingClientRect();
    if (!r.height) return null;
    const px = r.left + r.width / 2;
    const py = Math.min(r.top + r.height * 0.7, view.py * 0.92);
    return {
      x: (px / view.px - 0.5) * view.w,
      y: -(py / view.py - 0.5) * view.h,
      diam: ((r.height * 0.13) / view.py) * view.h,
    };
  }

  const ro = new ResizeObserver(layout);
  ro.observe(container);
  if (anchor) ro.observe(anchor);
  layout();

  function onPointerMove(e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  if (!lowPower) window.addEventListener("pointermove", onPointerMove, { passive: true });

  const _offset = new THREE.Vector3();
  const _euler = new THREE.Euler();
  const _q = new THREE.Quaternion();

  function tick() {
    const now = performance.now() / 1000;
    const dt = Math.min(now - prev, 0.05);
    prev = now;
    if (!paper || introStart < 0) return; // nothing to draw until the reveal

    // ease the scroll progress so scrubbing always feels buttery
    progress += (progressTarget - progress) * (1 - Math.exp(-dt * 9));
    mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
    mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));

    const intro = introStart < 0 ? 0 : clamp01((now - introStart) / INTRO_DURATION);
    const unfold = easeOutCubic(intro);
    // progress 0 → 1 spans: hero top → projects stage arriving under the ball
    //   0.00–0.22  crumple in place
    //   0.12–0.50  drift to the screen centre (hover) while the page scrolls by
    //   0.72–1.00  drop onto the projects floor, which rises to meet it
    const scrollCrumple = smooth(0.02, 0.22, progress);
    const crumple = Math.max(1 - unfold, scrollCrumple);
    const toHover = smooth(0.12, 0.5, progress);
    const toLand = smooth(0.72, 1, progress);
    const maxFrame = animData.frameCount - 1;

    // follow the slot while flat; once crumpling starts the ball lets go of the page
    if (progress < 0.02) measureAnchor();

    updatePaperFrame(paper, animData, lerp(OPEN_FRAME, maxFrame, crumple));
    _offset.lerpVectors(flatCenter, crumpleCenter, crumple);
    paper.mesh.position.set(-_offset.x, -_offset.y, -_offset.z);

    const idle = 1 - crumple;
    const bob = Math.sin(now * 1.1) * 0.05 * idle;
    const hoverBob = Math.sin(now * 1.6) * 0.04 * toHover * (1 - toLand);

    // hover point: screen centre, a bit below middle
    const hover = { x: 0, y: -0.1 * view.h };
    // landing point: the projects stage floor (tracked live as it scrolls up),
    // clamped to the screen so the ball never dives off-screen to meet it
    const land = measureLanding() || { x: 0, y: -0.25 * view.h, diam: 0.35 };

    const ballScale = target.scale * 0.66; // crumpled size right after crumple
    const landScale = land.diam / (2 * crumpleRadius);
    const hoverScale = lerp(ballScale, landScale, 0.5);

    let x = lerp(target.x, hover.x, toHover);
    let y = lerp(target.y + bob, hover.y + hoverBob, toHover);
    x = lerp(x, land.x, toLand);
    y = lerp(y, land.y, toLand * toLand); // accelerate into the landing
    group.position.set(x, y + (1 - unfold) * 0.35, 0);

    const sFlat = target.scale * lerp(1, 0.66, crumple);
    let sc = lerp(sFlat, hoverScale, toHover);
    sc = lerp(sc, landScale, toLand);
    group.scale.setScalar(sc * lerp(0.6, 1, unfold));

    const travel = toHover * 3 + toLand * 4;
    _euler.set(
      mouse.y * 0.22 * idle + scrollCrumple * 0.7 + travel + now * 0.25 * toHover * (1 - toLand) + (1 - unfold) * 0.6,
      mouse.x * 0.32 * idle + scrollCrumple * 1.4 + travel * 0.4 + (1 - unfold) * 1.2,
      Math.sin(now * 0.7) * 0.025 * idle + scrollCrumple * 0.5 - 0.04 * idle,
    );
    _q.setFromEuler(_euler);
    group.quaternion.copy(_q).multiply(baseQuat);

    // hand-off: once it touches the floor the projects scene takes over
    if (!landed && progress > 0.985) {
      landed = true;
      onLanded?.();
    } else if (landed && progress < 0.95) {
      landed = false;
    }
    canvas.style.visibility = progress > 0.985 ? "hidden" : "visible";
    renderer.render(scene, camera);

    // fully landed and scroll isn't moving back → stop rendering until needed
    if (progressTarget >= 0.999 && progress > 0.995) {
      renderer.setAnimationLoop(null);
      running = false;
    }
    return;

    renderer.render(scene, camera);
  }

  function syncLoop() {
    const parked = progressTarget >= 0.999 && progress > 0.995;
    const should = visible && !disposed && !!paper && !parked;
    if (should && !running) {
      prev = performance.now() / 1000;
      renderer.setAnimationLoop(tick);
      running = true;
    } else if (!should && running) {
      renderer.setAnimationLoop(null);
      running = false;
    }
  }

  (async () => {
    try {
      const [data] = await Promise.all([loadVATData("/paper-vat/"), loadFaceFonts()]);
      if (disposed) return;
      animData = data;
      flatSize.width = data.flat.width;
      flatSize.depth = data.flat.depth;
      flatCenter.fromArray(data.flat.center);
      crumpleCenter.fromArray(data.crumple.center);
      crumpleRadius = data.crumple.radius;
      face = createFaceMaterial(drawHeroFace);
      paper = createPaperMesh(data, createSharedBuffers(data), face.material);
      group.add(paper.mesh);
      layout();
      if (introRequested) beginIntro();
      onReady?.();
      syncLoop();
    } catch (err) {
      if (!disposed) onError?.(err);
    }
  })();

  // The unfold intro plays when the site is revealed (after the preloader)
  function beginIntro() {
    introStart = performance.now() / 1000 + 0.2;
    canvas.style.opacity = "1";
  }

  return {
    startIntro() {
      if (introRequested) return;
      introRequested = true;
      if (paper) beginIntro();
    },
    setProgress(p) {
      progressTarget = clamp01(p);
      syncLoop();
    },
    setVisible(v) {
      if (visible === v) return;
      visible = v;
      syncLoop();
    },
    relayout: layout,
    destroy() {
      disposed = true;
      renderer.setAnimationLoop(null);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      paper?.mesh.geometry.dispose();
      face?.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
