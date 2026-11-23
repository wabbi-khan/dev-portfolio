// Paper crumple VAT loader.
// Adapted from "paper-crumple-demo" by item-develop (MIT License) —
// https://github.com/item-develop/paper-crumple-demo — see public/paper-vat/LICENSE.txt
//
// The crumple is a Houdini Vellum sim baked as VAT (Vertex Animation Textures):
// an FBX rest mesh + an EXR whose pixels hold per-point offsets for every frame.
// We decode it once into flat Float32Arrays of positions/normals per frame.

import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { track } from "@/lib/preload";

const RAW_FRAME_COUNT = 50;
let cache = null;

// Let the browser paint between decode chunks (keeps the preloader animating)
const yieldToMain = () => new Promise((r) => setTimeout(r, 0));

/** Loads + decodes the VAT once per page; later calls reuse the result. */
export function loadVATData(basePath) {
  if (!cache) {
    cache = decode(basePath).catch((err) => {
      cache = null;
      throw err;
    });
  }
  return cache;
}

async function decode(basePath) {
  const task = track("vat");
  const exrLoader = new EXRLoader();
  exrLoader.setDataType(THREE.FloatType);

  // download = 85% of this task, decoding the frames = the rest
  const bytes = { fbx: [0, 1249769], exr: [0, 1745336] };
  const report = (key) => (e) => {
    if (e.total) bytes[key][1] = e.total;
    bytes[key][0] = e.loaded;
    const done = bytes.fbx[0] + bytes.exr[0];
    const total = bytes.fbx[1] + bytes.exr[1];
    task.progress((done / total) * 0.7);
  };

  const [fbxGroup, posTex] = await Promise.all([
    new FBXLoader().loadAsync(basePath + "paper.fbx", report("fbx")),
    exrLoader.loadAsync(basePath + "paper-pos.exr", report("exr")),
  ]);
  task.progress(0.7);

  let fbxMesh = null;
  fbxGroup.traverse((child) => {
    if (child.isMesh && !fbxMesh) fbxMesh = child;
  });
  if (!fbxMesh) throw new Error("VAT: no mesh in FBX");

  const geo = fbxMesh.geometry;
  const posAttr = geo.getAttribute("position");
  const uvAttr = geo.getAttribute("uv");
  const indexAttr = geo.getIndex();
  const vertexCount = posAttr.count;
  // FBXLoader stores the 2nd UV set (VAT lookup) as "uv1" (older three: "uv2")
  const vatUv = geo.getAttribute("uv1") || geo.getAttribute("uv2");
  const isDummy = (v) => vatUv && vatUv.getX(v) === 0 && vatUv.getY(v) === 0;

  // Indices — skip the 2 bbox dummy triangles Houdini appends (vat uv = 0,0)
  const indices = [];
  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i++) indices.push(indexAttr.getX(i));
  } else {
    for (let i = 0; i < vertexCount; i += 3) {
      if (isDummy(i) || isDummy(i + 1) || isDummy(i + 2)) continue;
      indices.push(i, i + 1, i + 2);
    }
  }

  const uvs = new Float32Array(vertexCount * 2);
  if (uvAttr) {
    for (let i = 0; i < uvAttr.count; i++) {
      uvs[i * 2] = uvAttr.getX(i);
      uvs[i * 2 + 1] = uvAttr.getY(i);
    }
  }

  // ---- Decode EXR ----
  const posData = posTex.image.data;
  const texW = posTex.image.width;
  const texH = posTex.image.height;
  const channels = posData.length / (texW * texH);

  let pointCount = vertexCount;
  if (vatUv) {
    pointCount = 0;
    for (let v = 0; v < vertexCount; v++) {
      if (isDummy(v)) continue;
      const col = Math.floor(vatUv.getX(v) * texW);
      const row = Math.floor((1 - vatUv.getY(v)) * texH);
      pointCount = Math.max(pointCount, row * texW + col + 1);
    }
  }
  const rowsPerFrame = Math.ceil(pointCount / texW);

  const pointIds = new Int32Array(vertexCount);
  for (let v = 0; v < vertexCount; v++) {
    let id = v;
    if (vatUv) {
      if (isDummy(v)) id = 0;
      else {
        const col = Math.floor(vatUv.getX(v) * texW);
        const row = Math.floor((1 - vatUv.getY(v)) * texH);
        id = row * texW + col;
      }
    }
    pointIds[v] = Math.max(0, Math.min(id, pointCount - 1));
  }

  const stride = vertexCount * 3;
  const raw = new Float32Array(stride * RAW_FRAME_COUNT);
  const totalRows = RAW_FRAME_COUNT * rowsPerFrame;
  for (let f = 0; f < RAW_FRAME_COUNT; f++) {
    if (f % 5 === 4) {
      task.progress(0.7 + (f / RAW_FRAME_COUNT) * 0.12);
      await yieldToMain();
    }
    for (let v = 0; v < vertexCount; v++) {
      const pid = pointIds[v];
      const col = pid % texW;
      const blockRow = Math.floor(pid / texW);
      // EXRLoader flips scanlines (WebGL V-up) → read rows bottom-up
      const row = totalRows - 1 - (f * rowsPerFrame + blockRow);
      const px = (row * texW + col) * channels;
      const o = f * stride + v * 3;
      // Offsets were baked for a left-handed target: X is mirrored
      raw[o] = posAttr.getX(v) - posData[px];
      raw[o + 1] = posAttr.getY(v) + posData[px + 1];
      raw[o + 2] = posAttr.getZ(v) + posData[px + 2];
    }
  }

  // ---- Trim static frames at start/end ----
  const deltas = [];
  for (let f = 0; f < RAW_FRAME_COUNT - 1; f++) {
    const a = f * stride;
    const b = a + stride;
    let max = 0;
    for (let i = 0; i < stride; i++) {
      const d = Math.abs(raw[a + i] - raw[b + i]);
      if (d > max) max = d;
    }
    deltas.push(max);
  }
  const EPS = 1e-4;
  let first = deltas.findIndex((d) => d > EPS);
  if (first < 0) first = 0;
  let last = deltas.length - 1;
  while (last >= 0 && deltas[last] <= EPS) last--;
  const frameCount = last + 2 - first;
  const positions = raw.slice(first * stride, (first + frameCount) * stride);

  const valid = [];
  for (let v = 0; v < vertexCount; v++) if (!isDummy(v)) valid.push(v);

  // Flat (frame 0) XZ size — used to fit the unfolded card to the screen
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const v of valid) {
    const x = positions[v * 3];
    const z = positions[v * 3 + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  let sumY = 0;
  for (const v of valid) sumY += positions[v * 3 + 1];
  const flat = {
    width: maxX - minX,
    depth: maxZ - minZ,
    center: [(minX + maxX) / 2, sumY / valid.length, (minZ + maxZ) / 2],
  };

  // Crumpled (last frame) centre + 90th-percentile radius → physics sphere
  const lastOff = (frameCount - 1) * stride;
  let cx = 0, cy = 0, cz = 0;
  for (const v of valid) {
    cx += positions[lastOff + v * 3];
    cy += positions[lastOff + v * 3 + 1];
    cz += positions[lastOff + v * 3 + 2];
  }
  cx /= valid.length;
  cy /= valid.length;
  cz /= valid.length;
  const dists = new Float32Array(valid.length);
  valid.forEach((v, i) => {
    dists[i] = Math.hypot(
      positions[lastOff + v * 3] - cx,
      positions[lastOff + v * 3 + 1] - cy,
      positions[lastOff + v * 3 + 2] - cz,
    );
  });
  dists.sort();
  const crumple = {
    center: [cx, cy, cz],
    radius: dists[Math.floor(valid.length * 0.9)],
  };

  // ---- Smooth per-point normals (mesh is a triangle soup) ----
  const normals = new Float32Array(stride * frameCount);
  const pn = new Float32Array(pointCount * 3);
  for (let f = 0; f < frameCount; f++) {
    if (f % 3 === 2) {
      task.progress(0.82 + (f / frameCount) * 0.17);
      await yieldToMain();
    }
    const s = f * stride;
    pn.fill(0);
    for (let i = 0; i < indices.length; i += 3) {
      const a = s + indices[i] * 3;
      const b = s + indices[i + 1] * 3;
      const c = s + indices[i + 2] * 3;
      const e1x = positions[b] - positions[a];
      const e1y = positions[b + 1] - positions[a + 1];
      const e1z = positions[b + 2] - positions[a + 2];
      const e2x = positions[c] - positions[a];
      const e2y = positions[c + 1] - positions[a + 1];
      const e2z = positions[c + 2] - positions[a + 2];
      const nx = e1y * e2z - e1z * e2y;
      const ny = e1z * e2x - e1x * e2z;
      const nz = e1x * e2y - e1y * e2x;
      for (let k = 0; k < 3; k++) {
        const p = pointIds[indices[i + k]] * 3;
        pn[p] += nx;
        pn[p + 1] += ny;
        pn[p + 2] += nz;
      }
    }
    for (let p = 0; p < pointCount; p++) {
      const o = p * 3;
      const len = Math.hypot(pn[o], pn[o + 1], pn[o + 2]);
      if (len > 1e-10) {
        pn[o] /= len;
        pn[o + 1] /= len;
        pn[o + 2] /= len;
      } else {
        pn[o] = 0;
        pn[o + 1] = 1;
        pn[o + 2] = 0;
      }
    }
    for (let v = 0; v < vertexCount; v++) {
      const p = pointIds[v] * 3;
      const o = s + v * 3;
      normals[o] = pn[p];
      normals[o + 1] = pn[p + 1];
      normals[o + 2] = pn[p + 2];
    }
  }

  fbxGroup.traverse((child) => child.geometry?.dispose?.());
  posTex.dispose();
  task.done();

  return { vertexCount, frameCount, indices, uvs, positions, normals, crumple, flat };
}
