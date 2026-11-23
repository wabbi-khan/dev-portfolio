// Crumpled-paper project showcase.
// Interaction model adapted from "paper-crumple-demo" by item-develop (MIT) —
// https://github.com/item-develop/paper-crumple-demo
//
// Click a paper ball → it flies to the camera and unfolds into a card.
// Click again (or another ball) → it crumples back and gets tossed.
// Drag a ball → pick it up; release with a flick → throw it.

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { loadVATData } from "./vat";
import {
  PaperFaces,
  createSharedBuffers,
  createPaperMesh,
  updatePaperFrame,
  loadFaceFonts,
} from "./paperMesh";

const COLORS = { wall: "#ccff00", floor: "#f1efe6" };
const FLOOR_Y = -0.1;
const WALL_Z = -1.1;

const OPEN_SCREEN_RATIO = 0.88;
const OPEN_DISTANCE = 1.5;
const OPEN_FRAME = 4; // 0 = perfectly flat; a little higher keeps some wrinkles
const CLOSED_SCALE = 0.82;
const ANIM_SPEED = 1.5;
const OPEN_DURATION = 1.15;
const DISCARD_DURATION = 1.25;

const ROLL_LINEAR_RESISTANCE = 2.6;
const ROLL_ANGULAR_RESISTANCE = 4.5;
const ROLL_SETTLE_SPEED = 0.018;
const PHYSICS_STEP = 1 / 60;
const PAPER_MASS = 0.16;
const BOUNDS_PULL = 3.0;

const GRAB_LIFT = 0.5;
const GRAB_STIFFNESS = 14;
const GRAB_MAX_SPEED = 4.5;
const THROW_MAX_SPEED = 3.2;
const CLICK_DRAG_THRESHOLD_PX = 6;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => min + Math.random() * (max - min);

export function createPaperScene({
  container,
  projects,
  assetBase = "/paper-vat/",
  onReady,
  onOpen,
  onClose,
  onError,
}) {
  const lowPower =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoft was removed in recent three
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.touchAction = "pan-y"; // keep vertical page scroll on touch
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.wall);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);

  const floorMat = new THREE.MeshStandardMaterial({ color: COLORS.floor });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y, 1);
  floor.receiveShadow = true;
  scene.add(floor);

  // a little emissive keeps the wall reading as brand lime while still taking shadows
  const wallMat = new THREE.MeshStandardMaterial({
    color: COLORS.wall,
    emissive: COLORS.wall,
    emissiveIntensity: 0.32,
    roughness: 1,
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMat);
  wall.position.set(0, FLOOR_Y + 3, WALL_Z);
  wall.receiveShadow = true;
  scene.add(wall);

  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
  dirLight.position.set(-2, 2.6, 1.4);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  Object.assign(dirLight.shadow.camera, { left: -7, right: 7, top: 5, bottom: -4, near: 0.1, far: 14 });
  dirLight.shadow.bias = -0.001;
  scene.add(dirLight);

  // SSAO darkens the creases — desktop only (it's the expensive part)
  let composer = null;
  let ssaoPass = null;
  if (!lowPower) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    ssaoPass = new SSAOPass(scene, camera, 1, 1);
    ssaoPass.kernelRadius = 0.01;
    ssaoPass.minDistance = 0.0001;
    ssaoPass.maxDistance = 0.08;
    composer.addPass(ssaoPass);
    composer.addPass(new OutputPass());
  }

  // ---------- physics ----------
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -7, 0) });
  world.allowSleep = false;
  world.defaultContactMaterial.friction = 0.8;
  world.defaultContactMaterial.restitution = 0.15;
  const paperPhys = new CANNON.Material("paper");
  const floorPhys = new CANNON.Material("floor");
  world.addContactMaterial(new CANNON.ContactMaterial(paperPhys, floorPhys, { friction: 1, restitution: 0.12 }));
  world.addContactMaterial(new CANNON.ContactMaterial(paperPhys, paperPhys, { friction: 0.6, restitution: 0.3 }));
  const floorBody = new CANNON.Body({
    mass: 0,
    material: floorPhys,
    shape: new CANNON.Plane(),
    position: new CANNON.Vec3(0, FLOOR_Y, 0),
    quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
  });
  world.addBody(floorBody);

  // ---------- state ----------
  const papers = [];
  let animData = null;
  let faces = null;
  let shared = null;
  let activePaper = null;
  let disposed = false;
  let visible = false;
  let spawned = false;
  let dropRequested = false;
  let running = false;
  let prevTime = 0;
  const timeouts = new Set();

  let collisionRadius = 0.25;
  let restCenterY = FLOOR_Y + 0.25;
  let restMeshY = 0.02;
  const crumpleCenter = new THREE.Vector3(0, 0.2, 0);
  const flatSize = { width: 1, depth: 1.4 };
  const bounds = { minX: -2.4, maxX: 2.4, minZ: WALL_Z, maxZ: 1.7 };

  // ---------- layout ----------
  const _ray = new THREE.Raycaster();
  const _ndc = new THREE.Vector2();
  const _hit = new THREE.Vector3();
  const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function floorHit(nx, ny) {
    _ndc.set(nx, ny);
    _ray.setFromCamera(_ndc, camera);
    _plane.constant = -restCenterY;
    return _ray.ray.intersectPlane(_plane, _hit) ? _hit.clone() : null;
  }

  function layout() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    const aspect = w / h;
    if (aspect >= 1) {
      camera.fov = 40;
      camera.position.set(0, 2.2, 3.6);
      camera.lookAt(0, 0.35, 0);
    } else {
      camera.fov = 52;
      camera.position.set(0, 3.1, 4.4);
      camera.lookAt(0, 0.25, 0);
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);

    // Keep balls inside what the camera actually sees
    // Use the full visible floor width (wide screens get a wide stage), measured
    // at the front rows too — the floor gets narrower on screen near the camera.
    const sideBack = floorHit(0.9, 0.05);
    const sideFront = floorHit(0.9, -0.55);
    const front = floorHit(0, -0.8);
    const sides = [sideBack, sideFront].filter(Boolean).map((v) => Math.abs(v.x));
    const halfX = sides.length ? Math.min(6, ...sides) : 2.4;
    bounds.minX = -halfX;
    bounds.maxX = halfX;
    bounds.maxZ = front ? Math.min(1.7, front.z) : 1.7;

    updateOpenPose();
  }

  // ---------- body <-> mesh sync ----------
  const _off = new THREE.Vector3();
  const crumpleOffset = (scale, q) => _off.copy(crumpleCenter).multiplyScalar(scale).applyQuaternion(q);

  function syncBodyToMesh(p) {
    const off = crumpleOffset(p.mesh.scale.x, p.mesh.quaternion);
    p.body.position.set(p.mesh.position.x + off.x, p.mesh.position.y + off.y, p.mesh.position.z + off.z);
    const q = p.mesh.quaternion;
    p.body.quaternion.set(q.x, q.y, q.z, q.w);
  }

  function syncMeshToBody(p, scale = CLOSED_SCALE) {
    const q = p.body.quaternion;
    p.mesh.quaternion.set(q.x, q.y, q.z, q.w);
    const off = crumpleOffset(scale, p.mesh.quaternion);
    p.mesh.position.set(p.body.position.x - off.x, p.body.position.y - off.y, p.body.position.z - off.z);
    p.mesh.scale.setScalar(scale);
  }

  function setDynamic(p, enabled) {
    const b = p.body;
    b.type = enabled ? CANNON.Body.DYNAMIC : CANNON.Body.KINEMATIC;
    b.mass = enabled ? PAPER_MASS : 0;
    b.collisionFilterGroup = enabled ? 1 : 0;
    b.collisionFilterMask = enabled ? 1 : 0;
    if (!enabled) {
      b.velocity.set(0, 0, 0);
      b.angularVelocity.set(0, 0, 0);
      b.force.set(0, 0, 0);
      b.torque.set(0, 0, 0);
    }
    b.updateMassProperties();
    b.wakeUp();
  }

  const isOnGround = (b) => b.position.y <= restCenterY + 0.05;

  function applyRollingResistance(b, dt) {
    const lin = Math.exp(-ROLL_LINEAR_RESISTANCE * dt);
    const ang = Math.exp(-ROLL_ANGULAR_RESISTANCE * dt);
    b.velocity.x *= lin;
    b.velocity.z *= lin;
    b.angularVelocity.x *= ang;
    b.angularVelocity.y *= ang;
    b.angularVelocity.z *= ang;
  }

  function applyBounds(dt) {
    const minX = bounds.minX + collisionRadius;
    const maxX = bounds.maxX - collisionRadius;
    const minZ = bounds.minZ + collisionRadius;
    const maxZ = bounds.maxZ - collisionRadius;
    for (const p of papers) {
      const b = p.body;
      if (b.type !== CANNON.Body.DYNAMIC) continue;
      if (b.position.x < minX) {
        if (b.velocity.x < 0) b.velocity.x = Math.abs(b.velocity.x) * 0.42;
        b.velocity.x += BOUNDS_PULL * dt;
      } else if (b.position.x > maxX) {
        if (b.velocity.x > 0) b.velocity.x = -Math.abs(b.velocity.x) * 0.42;
        b.velocity.x -= BOUNDS_PULL * dt;
      }
      if (b.position.z < minZ) {
        if (b.velocity.z < 0) b.velocity.z = Math.abs(b.velocity.z) * 0.42;
        b.velocity.z += BOUNDS_PULL * dt;
      } else if (b.position.z > maxZ) {
        if (b.velocity.z > 0) b.velocity.z = -Math.abs(b.velocity.z) * 0.42;
        b.velocity.z -= BOUNDS_PULL * dt;
      }
    }
  }

  // ---------- open pose (card facing the camera) ----------
  const _viewDir = new THREE.Vector3();
  function computeOpenPose() {
    camera.getWorldDirection(_viewDir);
    const position = camera.position.clone().addScaledVector(_viewDir, OPEN_DISTANCE);
    const yAxis = _viewDir.clone().negate();
    const zAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
    const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * OPEN_DISTANCE;
    const viewW = viewH * camera.aspect;
    const scale = Math.min((viewH * OPEN_SCREEN_RATIO) / flatSize.depth, (viewW * OPEN_SCREEN_RATIO) / flatSize.width);
    return { position, quaternion, scale };
  }

  function updateOpenPose() {
    if (!activePaper) return;
    const pose = computeOpenPose();
    if (activePaper.state === "opening" && activePaper.target) {
      activePaper.target.position.copy(pose.position);
      activePaper.target.quaternion.copy(pose.quaternion);
      activePaper.target.scale = pose.scale;
    } else if (activePaper.state === "open") {
      activePaper.mesh.position.copy(pose.position);
      activePaper.mesh.quaternion.copy(pose.quaternion);
      activePaper.mesh.scale.setScalar(pose.scale);
    }
  }

  // ---------- spawning ----------
  function spawnPosition() {
    const margin = collisionRadius * 1.2;
    const pos = new THREE.Vector3(0, restMeshY, 0);
    for (let i = 0; i < 30; i++) {
      pos.x = rand(bounds.minX + margin, bounds.maxX - margin);
      pos.z = rand(bounds.minZ + margin, bounds.maxZ - margin);
      const clear = papers.every((p) => {
        const dx = p.body.position.x - pos.x;
        const dz = p.body.position.z - pos.z;
        return dx * dx + dz * dz > (collisionRadius * 2.2) ** 2;
      });
      if (clear) break;
    }
    return pos;
  }

  function spawnPaper(projectIndex) {
    const maxFrame = animData.frameCount - 1;
    const base = createPaperMesh(animData, shared, faces.low(projectIndex));
    base.mesh.castShadow = true;
    base.mesh.rotation.set(0, Math.PI + rand(-0.25, 0.25), rand(-0.18, 0.18));
    base.mesh.position.copy(spawnPosition());
    base.mesh.scale.setScalar(CLOSED_SCALE);
    base.mesh.userData.paperIndex = papers.length;
    scene.add(base.mesh);

    const off = crumpleOffset(CLOSED_SCALE, base.mesh.quaternion);
    const body = new CANNON.Body({
      mass: PAPER_MASS,
      material: paperPhys,
      shape: new CANNON.Sphere(collisionRadius),
      linearDamping: 0.15,
      angularDamping: 0.35,
      position: new CANNON.Vec3(base.mesh.position.x + off.x, base.mesh.position.y + off.y, base.mesh.position.z + off.z),
    });
    const q = base.mesh.quaternion;
    body.quaternion.set(q.x, q.y, q.z, q.w);
    world.addBody(body);

    const p = {
      ...base,
      projectIndex,
      body,
      frameIdx: maxFrame,
      state: "rolling",
      time: 0,
      start: null,
      target: null,
      throw: { settleTimer: 0 },
      grab: null,
    };
    updatePaperFrame(p, animData, maxFrame);
    papers.push(p);

    // Drop in from above
    body.position.y += rand(3.2, 5.5);
    body.angularVelocity.set(rand(-1.5, 1.5), rand(-0.5, 0.5), rand(-1.5, 1.5));
    syncMeshToBody(p);
  }

  function spawnAll() {
    spawned = true;
    projects.forEach((_, i) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        if (!disposed) spawnPaper(i);
      }, i * 70 + rand(0, 90));
      timeouts.add(id);
    });
  }

  // ---------- open / discard ----------
  function captureTransform(p) {
    return {
      position: p.mesh.position.clone(),
      quaternion: p.mesh.quaternion.clone(),
      scale: p.mesh.scale.x,
      frameIdx: p.frameIdx,
    };
  }

  function startOpen(p) {
    setDynamic(p, false);
    syncMeshToBody(p);
    p.mesh.material = faces.high(p.projectIndex);
    p.mesh.renderOrder = 10;
    p.state = "opening";
    p.time = 0;
    p.start = captureTransform(p);
    const pose = computeOpenPose();
    p.target = { ...pose, frameIdx: OPEN_FRAME };
  }

  function startDiscard(p) {
    if (p.state === "discarding" || p.state === "rolling") return;
    p.mesh.material = faces.low(p.projectIndex);
    p.mesh.renderOrder = 0;
    const dir = new THREE.Vector3(rand(-1, 1), 0, rand(-1.3, -0.45)).normalize();
    p.state = "discarding";
    p.time = 0;
    p.start = captureTransform(p);
    setDynamic(p, true);
    syncBodyToMesh(p);
    p.body.velocity.set(dir.x * rand(1.4, 2), rand(0.5, 0.9), dir.z * rand(1.4, 2));
    p.body.angularVelocity.set(rand(-2.4, 2.4), rand(-0.8, 0.8), rand(-2.4, 2.4));
    p.throw = { settleTimer: 0 };
  }

  function discardActive() {
    if (!activePaper) return;
    startDiscard(activePaper);
    activePaper = null;
    onClose?.();
  }

  // ---------- pointer ----------
  const pointer = new THREE.Vector2();
  const grabPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const grabHit = new THREE.Vector3();
  let pointerState = null;

  function updatePointer(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }

  function pickPaper(e) {
    if (!papers.length) return null;
    updatePointer(e);
    _ray.setFromCamera(pointer, camera);
    const hits = _ray.intersectObjects(papers.map((p) => p.mesh), false);
    if (!hits.length) return null;
    return papers[hits[0].object.userData.paperIndex] || null;
  }

  const isGrabbable = (p) => p.state === "closed" || p.state === "rolling";

  function beginGrab(p, e) {
    pointerState.grabbing = true;
    p.state = "grabbed";
    p.time = 0;
    const b = p.body;
    b.type = CANNON.Body.KINEMATIC;
    b.mass = 0;
    b.updateMassProperties();
    b.velocity.set(0, 0, 0);
    b.angularVelocity.set(0, 0, 0);
    b.collisionFilterGroup = 1;
    b.collisionFilterMask = 1;
    b.wakeUp();
    p.grab = { target: new THREE.Vector3(b.position.x, restCenterY + GRAB_LIFT, b.position.z) };
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    updateGrabTarget(p, e);
    canvas.style.cursor = "grabbing";
  }

  function updateGrabTarget(p, e) {
    updatePointer(e);
    _ray.setFromCamera(pointer, camera);
    grabPlane.constant = -(restCenterY + GRAB_LIFT);
    if (!_ray.ray.intersectPlane(grabPlane, grabHit)) return;
    p.grab.target.set(
      Math.min(Math.max(grabHit.x, bounds.minX + collisionRadius), bounds.maxX - collisionRadius),
      restCenterY + GRAB_LIFT,
      Math.min(Math.max(grabHit.z, bounds.minZ + collisionRadius), bounds.maxZ - collisionRadius),
    );
  }

  function releaseGrab(p, withThrow) {
    const b = p.body;
    let vx = withThrow ? b.velocity.x : 0;
    let vz = withThrow ? b.velocity.z : 0;
    const speed = Math.hypot(vx, vz);
    if (speed > THROW_MAX_SPEED) {
      vx *= THROW_MAX_SPEED / speed;
      vz *= THROW_MAX_SPEED / speed;
    }
    b.type = CANNON.Body.DYNAMIC;
    b.mass = PAPER_MASS;
    b.updateMassProperties();
    b.velocity.set(vx, 0, vz);
    b.angularVelocity.set((vz / collisionRadius) * 0.6, 0, (-vx / collisionRadius) * 0.6);
    b.wakeUp();
    p.state = "rolling";
    p.time = 0;
    p.throw = { settleTimer: 0 };
    canvas.style.cursor = "grab";
  }

  function handleClick(e) {
    const p = pickPaper(e);
    if (!p) {
      // clicking empty space closes the open card
      if (activePaper) discardActive();
      return;
    }
    const prev = activePaper;
    if (prev) {
      startDiscard(prev);
      activePaper = null;
    }
    if (prev === p || p.state !== "closed") {
      if (prev) onClose?.();
      return;
    }
    startOpen(p);
    activePaper = p;
    onOpen?.(p.projectIndex);
  }

  function onPointerDown(e) {
    if (!animData || pointerState || e.button > 0) return;
    const p = pickPaper(e);
    pointerState = { paper: p, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, grabbing: false, touch: e.pointerType === "touch" };
    if (p && p.state === "rolling" && !pointerState.touch) beginGrab(p, e);
  }

  function onPointerMove(e) {
    if (!pointerState) {
      if (!animData || e.pointerType === "touch") return;
      const p = pickPaper(e);
      canvas.style.cursor = p ? (isGrabbable(p) ? "grab" : "pointer") : "";
      return;
    }
    if (e.pointerId !== pointerState.pointerId) return;
    if (!pointerState.grabbing) {
      const p = pointerState.paper;
      const dx = e.clientX - pointerState.startX;
      const dy = e.clientY - pointerState.startY;
      const moved = Math.hypot(dx, dy);
      // on touch, mostly-vertical motion is a page scroll, not a grab
      const allow = !pointerState.touch || Math.abs(dx) > Math.abs(dy);
      if (p && isGrabbable(p) && allow && moved > CLICK_DRAG_THRESHOLD_PX) beginGrab(p, e);
    }
    if (pointerState.grabbing) updateGrabTarget(pointerState.paper, e);
  }

  function onPointerUp(e) {
    if (!pointerState || e.pointerId !== pointerState.pointerId) return;
    if (pointerState.grabbing) releaseGrab(pointerState.paper, true);
    else {
      const moved = Math.hypot(e.clientX - pointerState.startX, e.clientY - pointerState.startY);
      if (moved <= CLICK_DRAG_THRESHOLD_PX * 2) handleClick(e);
    }
    pointerState = null;
  }

  function onPointerCancel(e) {
    if (!pointerState || e.pointerId !== pointerState.pointerId) return;
    if (pointerState.grabbing) releaseGrab(pointerState.paper, false);
    pointerState = null;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);

  // ---------- per-paper animation ----------
  function updatePaper(p, dt) {
    const maxFrame = animData.frameCount - 1;

    if (p.state === "opening") {
      p.time += dt * ANIM_SPEED;
      const t = clamp01(p.time / OPEN_DURATION);
      const e = easeOutCubic(t);
      p.mesh.position.lerpVectors(p.start.position, p.target.position, e);
      p.mesh.quaternion.slerpQuaternions(p.start.quaternion, p.target.quaternion, e);
      p.mesh.scale.setScalar(lerp(p.start.scale, p.target.scale, e));
      p.frameIdx = lerp(p.start.frameIdx, p.target.frameIdx, easeInCubic(t));
      updatePaperFrame(p, animData, p.frameIdx);
      if (t >= 1) {
        p.state = "open";
        p.frameIdx = p.target.frameIdx;
        p.mesh.position.copy(p.target.position);
        p.mesh.quaternion.copy(p.target.quaternion);
        p.mesh.scale.setScalar(p.target.scale);
        syncBodyToMesh(p);
        updatePaperFrame(p, animData, p.frameIdx);
      }
      return;
    }

    if (p.state === "discarding") {
      p.time += dt * ANIM_SPEED;
      const t = clamp01(p.time / DISCARD_DURATION);
      const e = easeOutCubic(t);
      p.frameIdx = lerp(p.start.frameIdx, maxFrame, e);
      syncMeshToBody(p, lerp(p.start.scale, CLOSED_SCALE, e));
      updatePaperFrame(p, animData, p.frameIdx);
      if (t >= 1) {
        p.state = "rolling";
        p.time = 0;
        p.frameIdx = maxFrame;
        updatePaperFrame(p, animData, maxFrame);
      }
      return;
    }

    if (p.state === "grabbed") {
      const b = p.body;
      const tg = p.grab.target;
      let vx = (tg.x - b.position.x) * GRAB_STIFFNESS;
      let vy = (tg.y - b.position.y) * GRAB_STIFFNESS;
      let vz = (tg.z - b.position.z) * GRAB_STIFFNESS;
      const speed = Math.hypot(vx, vy, vz);
      if (speed > GRAB_MAX_SPEED) {
        const k = GRAB_MAX_SPEED / speed;
        vx *= k;
        vy *= k;
        vz *= k;
      }
      b.velocity.set(vx, vy, vz);
      syncMeshToBody(p);
      return;
    }

    if (p.state === "rolling") {
      p.time += dt;
      const grounded = isOnGround(p.body);
      if (grounded) applyRollingResistance(p.body, dt);
      syncMeshToBody(p);
      const speed = p.body.velocity.lengthSquared() + p.body.angularVelocity.lengthSquared() * 0.02;
      p.throw.settleTimer = grounded && speed < ROLL_SETTLE_SPEED ? p.throw.settleTimer + dt : 0;
      if (p.throw.settleTimer > 0.35) {
        p.state = "closed";
        p.time = 0;
      }
      return;
    }

    if (p.state === "closed") {
      if (isOnGround(p.body)) applyRollingResistance(p.body, dt);
      syncMeshToBody(p);
    }
  }

  // ---------- loop ----------
  function tick() {
    const now = performance.now() / 1000;
    const dt = Math.min(now - prevTime, 0.05);
    prevTime = now;
    if (animData) {
      world.step(PHYSICS_STEP, dt, 3);
      applyBounds(dt);
      for (const p of papers) updatePaper(p, dt);
    }
    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  function syncLoop() {
    const should = visible && !disposed;
    if (should && !running) {
      prevTime = performance.now() / 1000;
      renderer.setAnimationLoop(tick);
      running = true;
    } else if (!should && running) {
      renderer.setAnimationLoop(null);
      running = false;
    }
    if (should && animData && dropRequested && !spawned) spawnAll();
  }

  function setVisible(v) {
    visible = v;
    syncLoop();
  }

  const ro = new ResizeObserver(() => layout());
  ro.observe(container);
  layout();

  // ---------- load ----------
  (async () => {
    try {
      const [data] = await Promise.all([loadVATData(assetBase), loadFaceFonts()]);
      if (disposed) return;
      animData = data;
      flatSize.width = data.flat.width;
      flatSize.depth = data.flat.depth;
      crumpleCenter.fromArray(data.crumple.center);
      collisionRadius = data.crumple.radius * CLOSED_SCALE;
      restCenterY = FLOOR_Y + collisionRadius * 1.08;
      restMeshY = restCenterY - crumpleCenter.y * CLOSED_SCALE;
      floorBody.position.y = restCenterY - collisionRadius;
      shared = createSharedBuffers(data);
      faces = new PaperFaces(projects);
      layout();
      onReady?.();
      syncLoop();
    } catch (err) {
      if (!disposed) onError?.(err);
    }
  })();

  // ---------- teardown ----------
  function destroy() {
    disposed = true;
    timeouts.forEach(clearTimeout);
    renderer.setAnimationLoop(null);
    ro.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerCancel);
    for (const p of papers) p.mesh.geometry.dispose();
    faces?.dispose();
    floor.geometry.dispose();
    wall.geometry.dispose();
    floorMat.dispose();
    wallMat.dispose();
    ssaoPass?.dispose?.();
    composer?.dispose?.();
    renderer.dispose();
    canvas.remove();
  }

  function requestDrop() {
    dropRequested = true;
    syncLoop();
  }

  return { setVisible, requestDrop, discardActive, destroy };
}
