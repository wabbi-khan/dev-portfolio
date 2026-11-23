// About paper: as the About section scrolls in, a crumpled ball jumps out of
// the projects stage, arcs up into the About box and unfolds into a sheet with
// "how I work" + experience. progress 0 → 1 drives the whole move (scrubbed);
// afterwards the sheet stays on its slot, tilting gently with the mouse.

import * as THREE from "three";
import { loadVATData } from "./vat";
import {
  createFaceMaterial,
  createSharedBuffers,
  createPaperMesh,
  updatePaperFrame,
  loadFaceFonts,
} from "./paperMesh";

const OPEN_FRAME = 3;
const CAMERA_Z = 5;
const FOV = 30;

const DISPLAY = '"Space Grotesk", "Arial Black", sans-serif';
const BODY = '"Work Sans", Arial, sans-serif';
const INK = "#0b0b0b";
const LIME = "#ccff00";

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

function drawAboutFace(ctx, W, H) {
  const PAD = 92;
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
  ctx.font = `700 30px ${DISPLAY}`;
  ctx.fillText("● ABOUT / WAHAB KHAN", PAD, 118);
  ctx.textAlign = "right";
  ctx.fillText("FILE 02", W - PAD, 118);
  ctx.textAlign = "left";
  ctx.fillRect(PAD, 142, W - PAD * 2, 5);

  // Title
  ctx.font = `900 112px ${DISPLAY}`;
  ctx.fillText("HOW I", PAD, 270);
  const word = "WORK";
  const ww = ctx.measureText(word).width + 36;
  const wx = PAD + ctx.measureText("HOW I ").width;
  ctx.fillStyle = INK;
  ctx.fillRect(wx + 9, 170 + 9, ww, 120);
  ctx.fillStyle = LIME;
  ctx.fillRect(wx, 170, ww, 120);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(wx, 170, ww, 120);
  ctx.fillStyle = INK;
  ctx.fillText(word, wx + 18, 270);

  // Process steps
  const steps = [
    ["01", "UNDERSTAND", "Requirements → clear specs"],
    ["02", "BUILD END-TO-END", "React · Next.js · Node.js"],
    ["03", "ADD THE AI", "OpenAI · agents · vector search"],
    ["04", "SHIP & ITERATE", "Deploy · debug · maintain"],
  ];
  let y = 360;
  for (const [n, title, sub] of steps) {
    ctx.fillStyle = INK;
    ctx.fillRect(PAD, y, 86, 86);
    ctx.fillStyle = LIME;
    ctx.font = `900 44px ${DISPLAY}`;
    ctx.fillText(n, PAD + 16, y + 60);
    ctx.fillStyle = INK;
    ctx.font = `800 46px ${DISPLAY}`;
    ctx.fillText(title, PAD + 112, y + 42);
    ctx.font = `500 30px ${BODY}`;
    ctx.fillStyle = "#3d4230";
    ctx.fillText(sub, PAD + 112, y + 80);
    y += 118;
  }

  // Experience timeline
  y += 24;
  ctx.fillStyle = INK;
  ctx.font = `800 30px ${DISPLAY}`;
  ctx.fillText("EXPERIENCE", PAD, y);
  ctx.fillRect(PAD, y + 16, W - PAD * 2, 3);
  const jobs = [
    ["BLACK LION", "Full Stack Engineer", "2023 — NOW", true],
    ["ONLINE CARE", "Web Developer", "2023"],
    ["XCL TECHNOLOGIES", "Web Developer", "2021 — 23"],
  ];
  y += 74;
  for (const [co, role, when, current] of jobs) {
    ctx.fillStyle = current ? LIME : "#fff";
    ctx.fillRect(PAD, y - 26, 22, 22);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(PAD, y - 26, 22, 22);
    ctx.fillStyle = INK;
    ctx.font = `800 34px ${DISPLAY}`;
    ctx.fillText(co, PAD + 42, y);
    ctx.font = `500 28px ${BODY}`;
    ctx.fillStyle = "#3d4230";
    ctx.fillText(role, PAD + 42, y + 36);
    ctx.textAlign = "right";
    ctx.font = `700 28px ${DISPLAY}`;
    ctx.fillStyle = INK;
    ctx.fillText(when, W - PAD, y);
    ctx.textAlign = "left";
    y += 92;
  }

  // Footer: education + location
  const fy = H - 120;
  ctx.fillStyle = INK;
  ctx.fillRect(PAD, fy - 64, W - PAD * 2, 96);
  ctx.fillStyle = LIME;
  ctx.font = `800 30px ${DISPLAY}`;
  ctx.fillText("BS.IT — MEHRAN UET '22", PAD + 28, fy - 4);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "right";
  ctx.font = `700 26px ${DISPLAY}`;
  ctx.fillText("PAKISTAN · REMOTE", W - PAD - 28, fy - 4);
  ctx.textAlign = "left";
}

/**
 * @param anchor     element whose box the flat sheet fills
 * @param getLaunch  () => element the ball jumps out of (projects stage)
 */
export function createAboutPaper({ anchor, getLaunch, onReady, onError }) {
  const lowPower =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;

  // Fixed full-screen layer on <body> so the ball can fly between sections
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:30";
  document.body.appendChild(host);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;visibility:hidden";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, CAMERA_Z);
  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xccff00, 0.35);
  fill.position.set(-3, -1, 2);
  scene.add(fill);

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
  let visible = false;
  let running = false;
  let prev = performance.now() / 1000;
  let progressTarget = 0;
  let progress = 0;
  let crumpleRadius = 0.3;

  const flatCenter = new THREE.Vector3();
  const crumpleCenter = new THREE.Vector3();
  const flatSize = { width: 1, depth: 1.4 };
  const view = { w: 1, h: 1, px: 1, py: 1 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function layout() {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    view.h = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    view.w = view.h * camera.aspect;
    view.px = w;
    view.py = h;
  }
  const ro = new ResizeObserver(layout);
  ro.observe(host);
  layout();

  const toWorldX = (px) => (px / view.px - 0.5) * view.w;
  const toWorldY = (py) => -(py / view.py - 0.5) * view.h;

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
    if (!paper) return;

    progress += (progressTarget - progress) * (1 - Math.exp(-dt * 9));
    mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
    mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));

    if (progress < 0.002) {
      canvas.style.visibility = "hidden";
      return;
    }
    canvas.style.visibility = "visible";

    // Destination: the About slot (tracked live — it scrolls with the page)
    const a = anchor.getBoundingClientRect();
    const target = {
      x: toWorldX(a.left + a.width / 2),
      y: toWorldY(a.top + a.height / 2),
      scale: Math.min(
        ((a.height / view.py) * view.h) / flatSize.depth,
        ((a.width / view.px) * view.w) / flatSize.width,
      ),
    };

    // Origin: a spot on the projects floor (right of centre), kept on screen
    const stage = getLaunch?.();
    let launch;
    let ballScale;
    if (stage && stage.isConnected) {
      const r = stage.getBoundingClientRect();
      launch = {
        x: toWorldX(r.left + r.width * 0.62),
        y: toWorldY(Math.min(r.top + r.height * 0.72, view.py * 0.95)),
      };
      ballScale = ((r.height * 0.13) / view.py) * view.h / (2 * crumpleRadius);
    } else {
      launch = { x: target.x * 0.5, y: -view.h * 0.6 };
      ballScale = target.scale * 0.4;
    }

    //  0.00–0.08 pop out of the pile · 0.00–0.58 arc to the slot · 0.45–1.00 unfold
    const pop = smooth(0, 0.08, progress);
    const travel = smooth(0, 0.58, progress);
    const unfold = smooth(0.45, 1, progress);
    const crumple = 1 - unfold;

    updatePaperFrame(paper, animData, lerp(OPEN_FRAME, animData.frameCount - 1, crumple));
    _offset.lerpVectors(flatCenter, crumpleCenter, crumple);
    paper.mesh.position.set(-_offset.x, -_offset.y, -_offset.z);

    const arc = Math.sin(Math.PI * travel) * 0.22 * view.h;
    const bob = Math.sin(now * 1.1) * 0.04 * unfold;
    group.position.set(
      lerp(launch.x, target.x, travel),
      lerp(launch.y, target.y, travel) + arc + bob,
      0,
    );
    let sc = lerp(ballScale, target.scale * 0.66, travel);
    sc = lerp(sc, target.scale, unfold);
    group.scale.setScalar(sc * pop);

    // Spin while flying, untwist to face the camera as it unfolds
    const spin = crumple * travel * 6.5;
    _euler.set(
      spin + mouse.y * 0.18 * unfold,
      spin * 0.45 + mouse.x * 0.28 * unfold,
      Math.sin(now * 0.7) * 0.02 * unfold + 0.035 * unfold, // slight pinned-note tilt
    );
    _q.setFromEuler(_euler);
    group.quaternion.copy(_q).multiply(baseQuat);

    renderer.render(scene, camera);
  }

  function syncLoop() {
    const should = visible && !disposed && !!paper;
    if (should && !running) {
      prev = performance.now() / 1000;
      renderer.setAnimationLoop(tick);
      running = true;
    } else if (!should && running) {
      renderer.setAnimationLoop(null);
      running = false;
      canvas.style.visibility = "hidden";
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
      face = createFaceMaterial(drawAboutFace);
      paper = createPaperMesh(data, createSharedBuffers(data), face.material);
      group.add(paper.mesh);
      onReady?.();
      syncLoop();
    } catch (err) {
      if (!disposed) onError?.(err);
    }
  })();

  return {
    setProgress(p) {
      progressTarget = clamp01(p);
    },
    setVisible(v) {
      visible = v;
      syncLoop();
    },
    destroy() {
      disposed = true;
      renderer.setAnimationLoop(null);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      paper?.mesh.geometry.dispose();
      face?.dispose();
      renderer.dispose();
      host.remove();
    },
  };
}
