// Paper meshes + paper faces (project info drawn with Canvas 2D).
// Mesh/frame logic adapted from "paper-crumple-demo" by item-develop (MIT).

import * as THREE from "three";

// Face is designed at 1024×1400 (the flat paper's aspect). Balls use a
// half-res copy; the one paper that is unfolded gets a shared hi-res copy.
const W = 1024;
const H = 1400;
const LO_SCALE = 0.5;

const DISPLAY = '"Space Grotesk", "Arial Black", sans-serif';
const BODY = '"Work Sans", Arial, sans-serif';
const INK = "#0b0b0b";
const LIME = "#ccff00";
const PAD = 104;
const CONTENT_W = W - PAD * 2;

export async function loadFaceFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`900 100px ${DISPLAY}`),
      document.fonts.load(`700 40px ${DISPLAY}`),
      document.fonts.load(`500 40px ${BODY}`),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function drawFace(ctx, project, index, image) {
  // Paper + faint grid
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

  // Header: project number + year badge
  const num = String(index + 1).padStart(2, "0");
  ctx.fillStyle = INK;
  ctx.font = `700 34px ${DISPLAY}`;
  ctx.fillText(`● PROJECT #${num}`, PAD, 132);
  const year = `'${String(project.year).slice(-2)}`;
  ctx.font = `800 40px ${DISPLAY}`;
  const yw = ctx.measureText(year).width + 36;
  const yx = W - PAD - yw;
  ctx.fillStyle = INK;
  ctx.fillRect(yx + 6, 88 + 6, yw, 60);
  ctx.fillStyle = LIME;
  ctx.fillRect(yx, 88, yw, 60);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(yx, 88, yw, 60);
  ctx.fillStyle = INK;
  ctx.fillText(year, yx + 18, 132);

  // Title — shrink until it fits in 2 lines (3 as a last resort)
  const title = String(project.name).toUpperCase();
  let size = 124;
  let lines;
  for (;;) {
    ctx.font = `900 ${size}px ${DISPLAY}`;
    lines = wrap(ctx, title, CONTENT_W);
    const fits = lines.every((l) => ctx.measureText(l).width <= CONTENT_W);
    if ((lines.length <= 2 && fits) || size <= 64) break;
    size -= 6;
  }
  lines = lines.slice(0, 3);
  const lh = size * 0.98;
  let y = 200 + size * 0.85;
  ctx.fillStyle = INK;
  for (const l of lines) {
    ctx.fillText(l, PAD, y);
    y += lh;
  }

  // Thumbnail panel
  const thumb = { x: PAD, y: y - lh + 70, w: CONTENT_W, h: Math.round((CONTENT_W * 9) / 16) };
  ctx.fillStyle = INK;
  ctx.fillRect(thumb.x + 12, thumb.y + 12, thumb.w, thumb.h);
  if (image && image.complete && image.naturalWidth) {
    const s = Math.max(thumb.w / image.naturalWidth, thumb.h / image.naturalHeight);
    const dw = image.naturalWidth * s;
    const dh = image.naturalHeight * s;
    ctx.save();
    ctx.beginPath();
    ctx.rect(thumb.x, thumb.y, thumb.w, thumb.h);
    ctx.clip();
    ctx.drawImage(image, thumb.x + (thumb.w - dw) / 2, thumb.y + (thumb.h - dh) / 2, dw, dh);
    ctx.restore();
  } else {
    // Generated cover: dotted black panel with lime monogram + domain
    ctx.fillStyle = "#111";
    ctx.fillRect(thumb.x, thumb.y, thumb.w, thumb.h);
    ctx.fillStyle = "rgba(204, 255, 0, 0.18)";
    for (let dx = thumb.x + 20; dx < thumb.x + thumb.w; dx += 32) {
      for (let dy = thumb.y + 20; dy < thumb.y + thumb.h; dy += 32) {
        ctx.fillRect(dx, dy, 3, 3);
      }
    }
    const mono = String(project.name)
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
    ctx.fillStyle = LIME;
    ctx.font = `900 230px ${DISPLAY}`;
    ctx.fillText(mono, thumb.x + 44, thumb.y + thumb.h * 0.66);
    ctx.font = `700 34px ${DISPLAY}`;
    ctx.fillStyle = "#fff";
    ctx.fillText(`< ${hostOf(project.url)} />`, thumb.x + 48, thumb.y + thumb.h - 44);
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.strokeRect(thumb.x, thumb.y, thumb.w, thumb.h);

  // Tags
  y = thumb.y + thumb.h + 80;
  let tx = PAD;
  ctx.font = `700 30px ${DISPLAY}`;
  for (const tag of project.tags || []) {
    const label = String(tag).toUpperCase();
    const tw = ctx.measureText(label).width + 32;
    if (tx + tw > W - PAD) break;
    ctx.fillStyle = INK;
    ctx.fillRect(tx + 4, y - 40 + 4, tw, 54);
    ctx.fillStyle = "#fff";
    ctx.fillRect(tx, y - 40, tw, 54);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(tx, y - 40, tw, 54);
    ctx.fillStyle = INK;
    ctx.fillText(label, tx + 16, y - 2);
    tx += tw + 16;
  }

  // Description (max 5 lines, ellipsis)
  y += 84;
  ctx.font = `500 36px ${BODY}`;
  ctx.fillStyle = "#2b2f22";
  let desc = wrap(ctx, project.desc, CONTENT_W);
  const footerY = H - 96;
  const maxLines = Math.max(1, Math.min(5, Math.floor((footerY - 70 - y) / 50) + 1));
  if (desc.length > maxLines) {
    desc = desc.slice(0, maxLines);
    let l = desc[maxLines - 1];
    while (ctx.measureText(`${l}…`).width > CONTENT_W && l.length) l = l.slice(0, -1);
    desc[maxLines - 1] = `${l.trimEnd()}…`;
  }
  for (const l of desc) {
    ctx.fillText(l, PAD, y);
    y += 50;
  }

  // Footer URL with lime highlighter stroke
  const host = `${hostOf(project.url)} ↗`;
  ctx.font = `800 44px ${DISPLAY}`;
  const hw = ctx.measureText(host).width;
  ctx.fillStyle = LIME;
  ctx.fillRect(PAD - 8, footerY - 30, hw + 16, 26);
  ctx.fillStyle = INK;
  ctx.fillText(host, PAD, footerY);
}

function makeTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  // match the VAT mesh UV orientation
  tex.rotation = Math.PI;
  tex.center.set(0.5, 0.5);
  tex.repeat.set(1, -1);
  tex.anisotropy = 4;
  return tex;
}

function makeMaterial(map) {
  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}

/** Owns every paper face: one low-res material per project + one shared hi-res. */
export class PaperFaces {
  constructor(projects) {
    this.projects = projects;
    this.images = projects.map(() => null);
    this.lo = projects.map((p, i) => {
      const canvas = document.createElement("canvas");
      canvas.width = W * LO_SCALE;
      canvas.height = H * LO_SCALE;
      const ctx = canvas.getContext("2d");
      const texture = makeTexture(canvas);
      const entry = { canvas, ctx, texture, material: makeMaterial(texture) };
      this.#paint(entry, LO_SCALE, i);
      return entry;
    });

    const hiCanvas = document.createElement("canvas");
    hiCanvas.width = W;
    hiCanvas.height = H;
    const hiTex = makeTexture(hiCanvas);
    this.hi = { canvas: hiCanvas, ctx: hiCanvas.getContext("2d"), texture: hiTex, material: makeMaterial(hiTex), index: -1 };

    projects.forEach((p, i) => {
      if (!p.image) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.images[i] = img;
        this.#paint(this.lo[i], LO_SCALE, i);
        if (this.hi.index === i) this.#paint(this.hi, 1, i);
      };
      img.src = p.image;
    });
  }

  #paint(entry, scale, index) {
    const { ctx } = entry;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawFace(ctx, this.projects[index], index, this.images[index]);
    entry.texture.needsUpdate = true;
  }

  low(index) {
    return this.lo[index].material;
  }

  /** Paint project `index` at full res into the shared hi-res material. */
  high(index) {
    if (this.hi.index !== index) {
      this.hi.index = index;
      this.#paint(this.hi, 1, index);
    }
    return this.hi.material;
  }

  dispose() {
    for (const e of [...this.lo, this.hi]) {
      e.texture.dispose();
      e.material.dispose();
    }
  }
}

/** Shared, immutable buffers (uv + index) for every paper geometry. */
export function createSharedBuffers(animData) {
  const { vertexCount, indices, uvs } = animData;
  const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
  return {
    uv: new THREE.BufferAttribute(uvs, 2),
    index: new THREE.BufferAttribute(new IndexArray(indices), 1),
  };
}

export function createPaperMesh(animData, shared, material) {
  const len = animData.vertexCount * 3;
  const geometry = new THREE.BufferGeometry();
  const positionAttr = new THREE.BufferAttribute(new Float32Array(len), 3);
  positionAttr.setUsage(THREE.DynamicDrawUsage);
  const normalAttr = new THREE.BufferAttribute(new Float32Array(len), 3);
  normalAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttr);
  geometry.setAttribute("normal", normalAttr);
  geometry.setAttribute("uv", shared.uv);
  geometry.setIndex(shared.index);
  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, positionAttr, normalAttr, renderedFrame: -1 };
}

/** Set geometry to (fractional) frame `frameIdx`, lerping neighbouring frames. */
export function updatePaperFrame(paper, animData, frameIdx) {
  if (Math.abs(paper.renderedFrame - frameIdx) < 1e-4) return;
  paper.renderedFrame = frameIdx;

  const { vertexCount, frameCount, positions, normals } = animData;
  const len = vertexCount * 3;
  const f0 = Math.min(Math.floor(frameIdx), frameCount - 1);
  const t = frameIdx - f0;
  const off0 = f0 * len;
  const pos = paper.positionAttr.array;
  const nrm = paper.normalAttr.array;

  if (t < 1e-6 || f0 >= frameCount - 1) {
    pos.set(positions.subarray(off0, off0 + len));
    nrm.set(normals.subarray(off0, off0 + len));
  } else {
    const off1 = off0 + len;
    const s = 1 - t;
    for (let i = 0; i < len; i++) {
      pos[i] = positions[off0 + i] * s + positions[off1 + i] * t;
      nrm[i] = normals[off0 + i] * s + normals[off1 + i] * t;
    }
  }
  paper.positionAttr.needsUpdate = true;
  paper.normalAttr.needsUpdate = true;
  paper.mesh.geometry.computeBoundingSphere();
}
