// Tiny preload tracker shared by the preloader screen and the parts of the page
// that need heavy assets (3D paper files, hero scene). Tasks are weighted; the
// preloader shows the combined progress and fires "site-ready" when done.

const tasks = new Map(); // name -> { weight, progress, label }
const listeners = new Set();
let finished = false;

function emit() {
  for (const fn of listeners) fn();
}

/** Declare a task up front so progress can't hit 100% before it registers. */
export function expect(name, weight = 1, label = name) {
  if (!tasks.has(name)) tasks.set(name, { weight, progress: 0, label });
  emit();
}

/** Get a handle to report progress (0–1) / completion for a task. */
export function track(name, weight = 1, label = name) {
  expect(name, weight, label);
  const t = tasks.get(name);
  return {
    progress(p) {
      const v = Math.min(1, Math.max(0, p));
      if (v > t.progress) {
        t.progress = v;
        emit();
      }
    },
    done() {
      if (t.progress < 1) {
        t.progress = 1;
        emit();
      }
    },
  };
}

export function getState() {
  let total = 0;
  let sum = 0;
  let current = null;
  for (const t of tasks.values()) {
    total += t.weight;
    sum += t.weight * t.progress;
    if (!current && t.progress < 1) current = t.label;
  }
  return { progress: total ? sum / total : 0, label: current, count: tasks.size };
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isSiteReady() {
  return finished;
}

/** Called by the preloader when its exit animation starts. */
export function markSiteReady() {
  if (finished) return;
  finished = true;
  window.dispatchEvent(new Event("site-ready"));
}

/** Run `cb` once the site is revealed (immediately if it already is). */
export function onSiteReady(cb) {
  if (finished) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("site-ready", handler, { once: true });
  return () => window.removeEventListener("site-ready", handler);
}
