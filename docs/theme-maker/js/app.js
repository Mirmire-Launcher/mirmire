import { SYSTEMS, SYSTEM, COLOR_GROUPS, COLOR_KEYS, SOUNDS, BUTTON_SOUNDS, SOUND_ALIASES, LIMITS, IMAGES, VIDEOS, AUDIO, FONTS, ID_RE, MAX_FILES, MAX_BYTES, SAMPLE_GAMES } from "./data.js";
import { BUILT_IN } from "./presets.js";
import * as pal from "./palette.js";
import { render, resolveColors, SCREENS, SCENES, GLYPHS } from "./preview.js";
import { writeZip, readZip } from "./zip.js";
import { icon } from "./icons.js";

/* ============================== state ============================== */

const blankStyle = () => ({ cardKind: "rounded", cardRadius: 12, cardBorder: "", borderWidth: 1, focusW: 3, font: "", headerStyle: "PLAIN", navigation: "" });

function blankProject(mode = "theme") {
  return {
    mode, name: "", id: "", idTouched: false, author: "", dark: true,
    colors: {}, style: blankStyle(),
    fontFile: null, wallpaper: null, wallpaperVideo: null,
    icons: {}, backgrounds: {}, backgroundVideos: {}, sounds: {}, music: [],
    seed: "#FFD18A", mood: "deep", harmony: "analogous",
  };
}

let P = blankProject();
let section = "basics";
const view = { scene: "consoles", system: "snes", game: 0, row: 0, focus: true, screen: SCREENS.wide, rail: false, glyphs: "xbox", video: true, sound: true, pick: false };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ext = (n) => (n.split(".").pop() || "").toLowerCase();
const stem = (n) => n.split("/").pop().replace(/\.[^.]+$/, "").split("@")[0].toLowerCase().replace(/[_-]alt$/, "");
const fmt = (n) => n < 1024 ? `${n} B` : n < 1 << 20 ? `${Math.round(n / 1024)} KB` : `${(n / (1 << 20)).toFixed(1)} MB`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
const kindOf = (name) => { const e = ext(name); return IMAGES.includes(e) ? "image" : VIDEOS.includes(e) ? "video" : AUDIO.includes(e) ? "audio" : FONTS.includes(e) ? "font" : null; };

/* ============================== files ============================== */

const urls = new WeakMap();
function urlOf(rec) {
  if (!rec?.blob) return "";
  let u = urls.get(rec.blob);
  if (!u) { u = URL.createObjectURL(rec.blob); urls.set(rec.blob, u); }
  return u;
}

async function measure(rec) {
  const url = urlOf(rec);
  try {
    if (rec.kind === "image") {
      const img = new Image(); img.src = url; await img.decode();
      rec.w = img.naturalWidth; rec.h = img.naturalHeight;
    } else if (rec.kind === "video" || rec.kind === "audio") {
      const el = document.createElement(rec.kind);
      el.preload = "metadata"; el.src = url;
      await new Promise((ok) => { el.onloadedmetadata = ok; el.onerror = ok; setTimeout(ok, 4000); });
      if (Number.isFinite(el.duration)) rec.dur = el.duration;
      if (rec.kind === "video") { rec.w = el.videoWidth; rec.h = el.videoHeight; }
    }
  } catch { /* unreadable: keep what we have */ }
  return rec;
}

async function makeRec(blob, name, limit) {
  const rec = { blob, name: name.split("/").pop(), size: blob.size, ext: ext(name), kind: kindOf(name) };
  await measure(rec);
  check(rec, limit);
  return rec;
}

function check(rec, limit) {
  const w = [];
  const L = LIMITS[limit];
  if (L) {
    if (L.kind !== rec.kind) w.push(`Needs ${L.kind === "image" ? "PNG, WebP or JPEG" : L.kind === "video" ? "MP4 or WebM" : L.kind === "audio" ? "WAV, OGG or MP3" : "TTF or OTF"}.`);
    if (L.maxBytes && rec.size > L.maxBytes) w.push(`Over ${fmt(L.maxBytes)}.`);
    if (L.minW && rec.w && (rec.w < L.minW || rec.h < L.minH)) w.push(`Smaller than ${L.minW}×${L.minH}.`);
    if (L.maxSec && rec.dur && rec.dur > L.maxSec + 0.05) w.push(`Longer than ${L.maxSec} s.`);
    if (L.minSec && rec.dur && rec.dur < L.minSec) w.push(`Shorter than ${L.minSec} s.`);
  }
  if (limit === "sound" && rec.dur) {
    const max = rec.slot === "launch" ? 1 : 0.4;
    if (rec.dur > max + 0.05) w.push(`Longer than ${max * 1000} ms.`);
  }
  rec.warn = w.join(" ");
  return rec;
}

/* ============================== autosave ============================== */

const DB = { name: "mirmire-theme-studio", store: "project" };
function idb() {
  return new Promise((ok, no) => {
    const r = indexedDB.open(DB.name, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(DB.store);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
}
let saveTimer = 0;
let booting = true;
function save() {
  if (booting) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const db = await idb();
      db.transaction(DB.store, "readwrite").objectStore(DB.store).put(JSON.parse(JSON.stringify(P, (k, v) => (v instanceof Blob ? undefined : v))), "meta");
      const blobs = {};
      walkRecs((rec, path) => { blobs[path] = rec.blob; });
      db.transaction(DB.store, "readwrite").objectStore(DB.store).put(blobs, "blobs");
    } catch { /* private window: no autosave */ }
  }, 400);
}
async function restore() {
  try {
    const db = await idb();
    const get = (k) => new Promise((ok) => { const r = db.transaction(DB.store).objectStore(DB.store).get(k); r.onsuccess = () => ok(r.result); r.onerror = () => ok(null); });
    const meta = await get("meta");
    if (!meta || (!meta.name && !Object.keys(meta.icons || {}).length)) return false;
    const blobs = (await get("blobs")) || {};
    P = Object.assign(blankProject(), meta);
    P.style = Object.assign(blankStyle(), meta.style);
    walkRecs((rec, path) => { rec.blob = blobs[path]; });
    pruneMissing();
    return true;
  } catch { return false; }
}
/** Throws away the draft saved in this browser and starts fresh. */
async function deleteDraft() {
  clearTimeout(saveTimer);
  try {
    const db = await idb();
    await new Promise((ok) => { const t = db.transaction(DB.store, "readwrite"); t.objectStore(DB.store).clear(); t.oncomplete = ok; t.onerror = ok; });
  } catch { /* nothing saved */ }
  booting = true;
  P = Object.assign(blankProject(), { colors: pal.generate("#FFD18A") });
  hasSaved = false; savedName = "";
  await loadFont();
  setMode("theme", true);
  redraw();
  booting = false;
  drawStart();
  toast("Draft deleted.");
}

function walkRecs(fn) {
  for (const k of ["fontFile", "wallpaper", "wallpaperVideo"]) if (P[k]) fn(P[k], k);
  for (const bag of ["icons", "backgrounds", "backgroundVideos", "sounds"]) for (const [id, r] of Object.entries(P[bag])) if (r) fn(r, `${bag}.${id}`);
  P.music.forEach((r, i) => r && fn(r, `music.${i}`));
}
function pruneMissing() {
  for (const k of ["fontFile", "wallpaper", "wallpaperVideo"]) if (P[k] && !P[k].blob) P[k] = null;
  for (const bag of ["icons", "backgrounds", "backgroundVideos", "sounds"]) for (const [id, r] of Object.entries(P[bag])) if (!r?.blob) delete P[bag][id];
  P.music = P.music.filter((r) => r?.blob);
}

/* ============================== theme output ============================== */

const hasColor = (k) => pal.valid(P.colors[k]);
const norm = (v) => { const c = pal.parse(v); return c ? pal.hex(c) : null; };

/**
 * Every file in the pack: { key, path, rec, shared }. key is "icons/snes" style; a file used twice
 * (the same picture for several consoles) is written once and the others point at it.
 */
function packPaths() {
  const files = [];
  const seen = new Map();
  const add = (key, path, rec) => {
    if (!rec?.blob) return;
    const first = seen.get(rec.blob);
    if (first) { files.push({ key, path: first, rec, shared: true }); return; }
    seen.set(rec.blob, path);
    files.push({ key, path, rec });
  };
  const safe = (n) => n.replace(/[^a-zA-Z0-9._-]+/g, "-");
  if (P.mode === "icons") {
    for (const [id, r] of Object.entries(P.icons)) add(`icons/${id}`, `icons/${id}.${r.ext}`, r);
    return files;
  }
  if (P.wallpaper) add("wallpaper", `wallpaper.${P.wallpaper.ext}`, P.wallpaper);
  if (P.wallpaperVideo) add("wallpaperVideo", `wallpaper.${P.wallpaperVideo.ext}`, P.wallpaperVideo);
  if (P.fontFile) add("font", `fonts/${safe(P.fontFile.name)}`, P.fontFile);
  for (const [id, r] of Object.entries(P.icons)) add(`icons/${id}`, `icons/${id}.${r.ext}`, r);
  for (const [id, r] of Object.entries(P.backgrounds)) add(`backgrounds/${id}`, `backgrounds/${id}.${r.ext}`, r);
  for (const [id, r] of Object.entries(P.backgroundVideos)) add(`backgroundVideos/${id}`, `backgrounds/${id}.${r.ext}`, r);
  for (const [id, r] of Object.entries(P.sounds)) add(`sounds/${id}`, `sounds/${id}.${r.ext}`, r);
  P.music.forEach((r, i) => add(`music/${i}`, `music/${String(i + 1).padStart(2, "0")}-${safe(r.name)}`, r));
  return files;
}

function manifest() {
  const files = packPaths();
  const by = (prefix) => Object.fromEntries(files.filter((f) => f.key.startsWith(prefix + "/")).map((f) => [f.key.slice(prefix.length + 1), f.path]));
  const one = (key) => files.find((f) => f.key === key)?.path;
  if (P.mode === "icons") {
    return { id: P.id, name: P.name, ...(P.author ? { author: P.author } : {}), icons: by("icons") };
  }
  const colors = {};
  for (const k of COLOR_KEYS) if (hasColor(k)) colors[k] = norm(P.colors[k]);
  const s = P.style;
  const style = { cardShape: `${s.cardKind}:${s.cardRadius}`, borderWidth: s.borderWidth, focusedBorderWidth: s.focusW, headerStyle: s.headerStyle };
  if (pal.valid(s.cardBorder)) style.cardBorder = norm(s.cardBorder);
  if (P.fontFile) style.font = "file:" + one("font");
  else if (s.font) style.font = s.font;
  if (s.navigation) style.navigation = s.navigation;
  const assets = {};
  if (one("wallpaper")) assets.wallpaper = one("wallpaper");
  if (one("wallpaperVideo")) assets.wallpaperVideo = one("wallpaperVideo");
  const put = (name, prefix) => { const m = by(prefix); if (Object.keys(m).length) assets[name] = m; };
  put("systemIcons", "icons");
  put("systemBackgrounds", "backgrounds");
  put("systemBackgroundVideos", "backgroundVideos");
  put("sounds", "sounds");
  const mus = files.filter((f) => f.key.startsWith("music/")).map((f) => f.path);
  if (mus.length) assets.music = mus;
  return { id: P.id, name: P.name, ...(P.author ? { author: P.author } : {}), version: 1, dark: P.dark, colors, style, assets };
}

function problems() {
  const out = [];
  if (!P.name.trim()) out.push(["basics", "Give it a name."]);
  if (!ID_RE.test(P.id)) out.push(["basics", "The ID needs 1–64 lowercase letters, digits, - or _, starting with a letter or digit."]);
  const files = packPaths().filter((f) => !f.shared);
  if (P.mode === "icons" && !files.length) out.push(["icons", "Add at least one console icon."]);
  if (files.length + 1 > MAX_FILES) out.push(["export", `More than ${MAX_FILES} files.`]);
  const total = files.reduce((n, f) => n + f.rec.size, 0);
  if (total > MAX_BYTES) out.push(["export", "Over 1 GB."]);
  return { out, files, total };
}

/* ============================== preview ============================== */

let fontFamily = "";
let fontUrlLoaded = "";
async function loadFont() {
  if (!P.fontFile) { fontFamily = ""; return; }
  const u = urlOf(P.fontFile);
  if (u === fontUrlLoaded) return;
  try {
    const ff = new FontFace("ThemeFont", `url(${u})`);
    await ff.load();
    document.fonts.add(ff);
    fontFamily = "ThemeFont";
    fontUrlLoaded = u;
  } catch { fontFamily = ""; toast("That font file couldn't be read."); }
}

const previewAssets = {
  icon: (id) => (P.icons[id] ? urlOf(P.icons[id]) : `assets/icons/${id}.png`),
  backdrop(id) {
    if (P.mode === "icons") return { url: "assets/first-light/wallpaper.jpg" };
    const pick = (img, vid) => (view.video && vid ? { url: urlOf(vid), video: true } : img ? { url: urlOf(img) } : vid ? { url: urlOf(vid), video: true } : null);
    return (id && pick(P.backgrounds[id], P.backgroundVideos[id])) || pick(P.wallpaper, P.wallpaperVideo) || { url: "assets/default/wallpaper.jpg" };
  },
  count: (id) => 12 + (SYSTEMS.findIndex((s) => s[0] === id) * 7) % 40,
  consoleOrder() {
    const mine = SYSTEMS.map((s) => s[0]).filter((id) => P.icons[id] || P.backgrounds[id] || P.backgroundVideos[id]);
    const base = ["nes", "snes", "n64", "gb", "gbc", "gba", "megadrive", "psx"];
    const pick = new Set([...mine, ...base].slice(0, Math.max(8, mine.length)));
    // In the app's order: alphabetical by console name.
    return SYSTEMS.map((s) => s[0]).filter((id) => pick.has(id));
  },
};

const FIRST_LIGHT = { primary: "#FFD18A", onPrimary: "#241A11", primaryContainer: "#493B29", onPrimaryContainer: "#FFF1D4", secondary: "#FFAD99", onSecondary: "#321A18", secondaryContainer: "#4A3035", onSecondaryContainer: "#FFE5DD", tertiary: "#B9D7CB", onTertiary: "#102922", background: "#0D1628", onBackground: "#FFF4E4", surface: "#142037", onSurface: "#FFF4E4", surfaceVariant: "#28374F", onSurfaceVariant: "#C9D2E1", surfaceContainer: "#19283F", surfaceContainerHigh: "#25364F", outline: "#91A0B5", error: "#FFB4AB" };

function themeForPreview() {
  // Icon packs are previewed on First Light, the theme Mirmire starts with.
  if (P.mode === "icons") return { name: "First Light", dark: true, colors: FIRST_LIGHT, style: { ...blankStyle(), cardRadius: 18, cardBorder: "#596A83" } };
  return { name: P.name, dark: P.dark, colors: P.colors, style: P.style };
}

function drawPreview() {
  const host = $("#screen");
  if (!host) return;
  view.rail = P.style.navigation === "rail" ? !view.forceTop : !!view.forceRail;
  const order = previewAssets.consoleOrder();
  if (!order.includes(view.system)) view.system = order[0];
  const html = render(themeForPreview(), view, previewAssets, fontFamily);
  const inner = $("#screenInner");
  // Keep playing videos when only colors change.
  const keepVideo = inner.querySelector("video.m-wall");
  inner.innerHTML = html;
  const newVideo = inner.querySelector("video.m-wall");
  if (keepVideo && newVideo && keepVideo.src === newVideo.src) { newVideo.currentTime = keepVideo.currentTime; }
  fit();
  requestAnimationFrame(fit);
  const c = resolveColors(themeForPreview());
  const dev = $("#device");
  dev.style.setProperty("--hh-light-l", c.lights);
  dev.style.setProperty("--hh-light-r", c.lightsRight);
  document.querySelector(".stage").style.setProperty("--stage-glow", c.primary);
  drawChecks(c);
}

function fit() {
  const vp = $("#viewport"), dev = $("#device"), host = $("#screen");
  const { w, h } = view.screen;
  const cs = getComputedStyle(dev), vcs = getComputedStyle(vp);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(vcs.paddingLeft) + parseFloat(vcs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(vcs.paddingTop) + parseFloat(vcs.paddingBottom);
  const narrow = innerWidth <= 640;
  const avail = { w: vp.clientWidth - padX, h: narrow ? 10000 : vp.clientHeight - padY };
  const scale = Math.max(0.3, Math.min(avail.w / w, avail.h / h, 1.6));
  host.style.width = `${w * scale}px`;
  host.style.height = `${h * scale}px`;
  $("#screenInner").style.transform = `scale(${scale})`;
}

function drawChecks(c) {
  const pairs = [
    ["Text on cards", c.onSurface, c.surface, "onSurface"],
    ["Subtitles", c.onSurfaceVariant, c.surface, "onSurfaceVariant"],
    ["Play button", c.onPrimary, c.primary, "onPrimary"],
    ["Titles", c.onBackground, c.background, "onBackground"],
  ];
  $("#checks").innerHTML = pairs.map(([label, fg, bg, key]) => {
    const r = pal.contrast(fg, bg);
    const cls = r >= 4.5 ? "good" : r >= 3 ? "low" : "bad";
    return `<button class="check ${cls}" data-jump="${key}" title="${cls === "good" ? "Easy to read" : cls === "low" ? "Readable for large text only" : "Hard to read"}"><span style="width:12px;height:12px;border-radius:4px;background:${bg};outline:1px solid #8886;display:inline-block;position:relative"><i style="position:absolute;inset:3px;border-radius:2px;background:${fg}"></i></span>${label} <b>${r.toFixed(1)}:1</b></button>`;
  }).join("");
  $("#strip").innerHTML = ["primary", "primaryContainer", "secondary", "tertiary", "background", "surface", "surfaceVariant", "surfaceContainerHigh", "outline"]
    .map((k) => `<button style="background:${c[k]}" title="${k}" data-jump="${k}"></button>`).join("");
}

/* ============================== sounds ============================== */

const SOUND_FALLBACK = { tab: "move", edge: "move", menu: "select", favorite: "select", launch: "select" };
const audioCache = new Map();
function playSound(name) {
  if (!view.sound || P.mode === "icons") return;
  let rec = P.sounds[name] || P.sounds[SOUND_FALLBACK[name]];
  const url = rec ? urlOf(rec) : Object.keys(P.sounds).length ? "" : `assets/default/soft_${name}.wav`;
  if (!url) return;
  let a = audioCache.get(url);
  if (!a) { a = new Audio(url); audioCache.set(url, a); }
  const n = a.cloneNode();
  n.volume = 0.55;
  n.play().catch(() => {});
}
let musicEl = null;
function toggleMusic(force) {
  const on = force ?? !musicEl;
  if (musicEl) { musicEl.pause(); musicEl = null; }
  if (on) {
    const url = P.music[0] ? urlOf(P.music[0]) : "assets/default/soft_music.ogg";
    musicEl = new Audio(url);
    musicEl.loop = true; musicEl.volume = 0.4;
    musicEl.play().catch(() => { musicEl = null; });
  }
  $("#musicBtn").classList.toggle("on", !!musicEl);
}

/* ============================== editor panels ============================== */

const NAV_THEME = [
  ["basics", "Name", "info"],
  ["colors", "Colors", "palette"],
  ["style", "Shape & type", "dashboard"],
  ["wallpaper", "Wallpaper", "image"],
  ["consoles", "Console art", "gamepad"],
  ["sounds", "Sounds & music", "music"],
  ["export", "Export", "download"],
];
const NAV_ICONS = [["basics", "Name", "info"], ["icons", "Icons", "gamepad"], ["export", "Export", "download"]];

function drawNav() {
  const items = P.mode === "icons" ? NAV_ICONS : NAV_THEME;
  if (!items.some(([id]) => id === section)) section = "basics";
  const done = {
    basics: P.name && ID_RE.test(P.id), colors: COLOR_KEYS.some(hasColor), style: true,
    wallpaper: P.wallpaper || P.wallpaperVideo, consoles: Object.keys(P.icons).length + Object.keys(P.backgrounds).length,
    sounds: Object.keys(P.sounds).length || P.music.length, icons: Object.keys(P.icons).length,
  };
  $("#nav").innerHTML = items.map(([id, label, ic]) => `<button class="${id === section ? "on" : ""}" data-section="${id}" data-tip="${label}" aria-label="${label}">${icon(ic, 22)}${done[id] && id !== "style" ? '<i class="dot"></i>' : ""}</button>`).join("");
}

function field(label, inner, help = "") {
  return `<label class="field"><span>${label}</span>${inner}${help ? `<small>${help}</small>` : ""}</label>`;
}

function dropSlot(key, title, sub, rec, accept, contain = false) {
  const thumb = rec ? (rec.kind === "image" ? `<img src="${urlOf(rec)}" alt="">` : rec.kind === "video" ? `<video src="${urlOf(rec)}" muted autoplay loop playsinline></video>` : icon(rec.kind === "font" ? "category" : "music", 22)) : icon("add", 22);
  const meta = rec ? `${esc(rec.name)} · ${fmt(rec.size)}${rec.w ? ` · ${rec.w}×${rec.h}` : ""}${rec.dur ? ` · ${rec.dur.toFixed(1)} s` : ""}` : sub;
  return `<div class="drop" data-slot="${key}">
    <div class="thumb ${contain ? "contain" : ""}">${thumb}</div>
    <div style="min-width:0"><b>${title}</b><small title="${esc(meta)}">${meta}</small>${rec?.warn ? `<div class="warn">${esc(rec.warn)}</div>` : ""}</div>
    <div class="tools">${rec ? `<button class="iconbtn" data-clear="${key}" title="Remove">✕</button>` : ""}</div>
    <input type="file" accept="${accept}" data-file="${key}">
  </div>`;
}

const acc = (list) => list.map((e) => "." + e).join(",");

const PANELS = {
  basics() {
    const iconMode = P.mode === "icons";
    return `<h2>${iconMode ? "Your icon pack" : "Your theme"}</h2>
      <p class="lede">${iconMode ? "An icon pack swaps just the console icons, and works with any theme." : "This is how the theme appears in Settings › Look."}</p>
      ${field("Name", `<input class="input" data-bind="name" value="${esc(P.name)}" placeholder="${iconMode ? "Pixel Consoles" : "Neon Rider"}" maxlength="60">`)}
      ${field("ID", `<input class="input ${P.id && !ID_RE.test(P.id) ? "bad" : ""}" data-bind="id" value="${esc(P.id)}" placeholder="neon-rider" maxlength="64">`, "Made from the name. Importing a pack with the same ID replaces the old one.")}
      ${field("Author", `<input class="input" data-bind="author" value="${esc(P.author)}" placeholder="Your name or handle">`, "Optional. Credit anyone whose art you used here too.")}
      ${iconMode ? "" : `<div class="toggle"><div><b>Dark theme</b><div class="hint">Any color you leave out uses Material's ${P.dark ? "dark" : "light"} default.</div></div><input type="checkbox" class="switch" data-bind="dark" ${P.dark ? "checked" : ""}></div>`}
      <h3>Start over</h3>
      <button class="btn small" data-action="start">${icon("apps", 16)} Pick a different starting point</button>`;
  },

  colors() {
    const c = resolveColors(themeForPreview());
    return `<h2>Colors</h2>
      <p class="lede">Pick one color and Mirmire Theme Studio builds the rest. Then fine-tune any role below, or click something in the preview with <b>Pick</b> on.</p>
      <div class="seedrow">
        <div class="bigswatch" style="background:${P.seed}"><input type="color" data-seed value="${pal.rgbOnly(P.seed)}" aria-label="Main color"></div>
        <div><b>Main color</b><div class="hint">Used for buttons, focus and the Play button.</div>
          <div class="picks" style="margin-top:8px">${["#FFD18A", "#FF6B8A", "#7C9CFF", "#5FD4C4", "#9BBC0F", "#00F0FF", "#C77DFF", "#FF8A3D"].map((h) => `<button class="pick" style="background:${h}" data-seedpick="${h}" title="${h}"></button>`).join("")}</div></div>
      </div>
      <h3>Feel</h3>
      <div class="chips">${Object.entries(pal.MOODS).map(([k, m]) => `<button class="chip ${P.mood === k ? "on" : ""}" data-mood="${k}">${m.label}</button>`).join("")}</div>
      <h3>Second accent</h3>
      <div class="chips">${[["analogous", "Close"], ["complement", "Opposite"], ["triad", "Triad"]].map(([k, l]) => `<button class="chip ${P.harmony === k ? "on" : ""}" data-harmony="${k}">${l}</button>`).join("")}</div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        <button class="btn small primary" data-action="generate">${icon("sparkle", 16)} Build palette</button>
        <button class="btn small" data-action="surprise">${icon("refresh", 16)} Surprise me</button>
        ${P.wallpaper || P.wallpaperVideo ? `<button class="btn small" data-action="fromWall">${icon("image", 16)} From wallpaper</button>` : ""}
      </div>
      <div id="wallSeeds" class="picks" style="margin-top:10px"></div>
      ${COLOR_GROUPS.map(([group, keys]) => `<h3>${group}</h3><div class="colorlist">${keys.map(([k, help]) => {
        const set = hasColor(k);
        const shown = k === "lights" || k === "lightsRight" ? c[k] : c[k];
        return `<div class="crow ${set ? "" : "unset"}" data-crow="${k}">
          <div class="sw"><i style="background:${pal.css(shown)}"></i><input type="color" data-color="${k}" value="${pal.rgbOnly(shown)}" aria-label="${k}"></div>
          <div style="min-width:0"><b>${k}</b><small>${help}${set ? "" : " · default"}</small></div>
          <input class="input" data-hex="${k}" value="${esc(P.colors[k] || "")}" placeholder="${pal.hex(pal.parse(shown))}" spellcheck="false">
        </div>`;
      }).join("")}</div>`).join("")}
      <p class="hint" style="margin-top:12px">Use #RRGGBB, or #AARRGGBB for see-through colors. Stick lights are for Retroid and AYN handhelds; without them the lights follow primary.</p>`;
  },

  style() {
    const s = P.style;
    const range = (key, min, max, label, unit = "dp") => `<div class="field"><span>${label}</span><div class="slider"><input type="range" min="${min}" max="${max}" value="${s[key]}" data-style="${key}"><output>${s[key]} ${unit}</output></div></div>`;
    return `<h2>Shape & type</h2>
      <p class="lede">How cards, borders and text look.</p>
      <h3>Cards</h3>
      <div class="chips" style="margin-bottom:12px">${[["rounded", "Rounded"], ["cut", "Cut corners"]].map(([k, l]) => `<button class="chip ${s.cardKind === k ? "on" : ""}" data-stylepick="cardKind:${k}">${l}</button>`).join("")}</div>
      ${range("cardRadius", 0, 48, "Corner size")}
      <h3>Borders</h3>
      <div class="crow ${pal.valid(s.cardBorder) ? "" : "unset"}" style="padding-left:0">
        <div class="sw"><i style="background:${pal.css(s.cardBorder || "#0000")}"></i><input type="color" data-border value="${pal.rgbOnly(s.cardBorder || "#888888")}"></div>
        <div><b>Card border</b><small>${pal.valid(s.cardBorder) ? "Always shown" : "None: a faint outline instead"}</small></div>
        <input class="input" data-borderhex value="${esc(s.cardBorder)}" placeholder="none" spellcheck="false">
      </div>
      ${range("borderWidth", 0, 8, "Border width")}
      ${range("focusW", 1, 8, "Focus outline", "dp")}
      <p class="hint">The focus outline is what a controller user sees moving around. Use the arrow keys on the preview to try it.</p>
      <h3>Font</h3>
      <div class="chips" style="margin-bottom:10px">${[["", "Oxanium"], ["sans", "Sans"], ["serif", "Serif"], ["monospace", "Mono"], ["cursive", "Cursive"]].map(([k, l]) => `<button class="chip ${!P.fontFile && s.font === k ? "on" : ""}" data-stylepick="font:${k}">${l}</button>`).join("")}</div>
      ${dropSlot("fontFile", "Your own font", "TTF or OTF, under 2 MB, licensed for sharing", P.fontFile, acc(FONTS))}
      <h3>Section titles</h3>
      <div class="chips">${[["PLAIN", "Plain"], ["BOLD_CAPS", "BOLD CAPS"], ["UNDERLINED", "Underlined"]].map(([k, l]) => `<button class="chip ${s.headerStyle === k ? "on" : ""}" data-stylepick="headerStyle:${k}" data-goscene="spotlight">${l}</button>`).join("")}</div>
      <p class="hint">Shows on the Spotlight tab and the Players screen.</p>
      <h3>Home menu</h3>
      <div class="chips">${[["", "Player's choice"], ["top", "Top bar"], ["rail", "Side rail"]].map(([k, l]) => `<button class="chip ${s.navigation === k ? "on" : ""}" data-stylepick="navigation:${k}" data-goscene="consoles">${l}</button>`).join("")}</div>
      <p class="hint">What this theme is designed for. Players can still change it in Layout.</p>`;
  },

  wallpaper() {
    return `<h2>Wallpaper</h2>
      <p class="lede">The backdrop behind Settings and every screen that isn't a console page. Ship an image, a looping video, or both: players choose in Look.</p>
      <div class="stack">
        ${dropSlot("wallpaper", "Image", "1920×1080 PNG, WebP or JPEG, under 4 MB", P.wallpaper, acc(IMAGES))}
        ${dropSlot("wallpaperVideo", "Video loop", "8–30 s MP4 or WebM, under 40 MB, plays muted", P.wallpaperVideo, acc(VIDEOS))}
      </div>
      ${P.wallpaper ? `<button class="btn small" style="margin-top:12px" data-action="fromWall">${icon("palette", 16)} Build colors from this picture</button><div id="wallSeeds" class="picks" style="margin-top:10px"></div>` : ""}
      <p class="hint" style="margin-top:14px">Without a wallpaper, Mirmire uses its own (the one you see now). The app darkens wallpapers so text stays readable, as in the preview.</p>`;
  },

  consoles() {
    const have = Object.keys(P.icons).length, bgs = new Set([...Object.keys(P.backgrounds), ...Object.keys(P.backgroundVideos)]).size;
    return `<h2>Console art</h2>
      <p class="lede">An icon for each console, and optionally a backdrop that shows while it's selected. Drop a whole folder anywhere on the page: files named <code>snes.png</code>, <code>SFC.png</code>, <code>MD.png</code>… find their console.</p>
      <h3>Icons · ${have} of ${SYSTEMS.length}</h3>
      ${sysGrid("icons")}
      <p class="hint">PNG with transparency, 256–512 px square, under 200 KB. Missing ones use Mirmire's.</p>
      <h3>Backdrops · ${bgs} of ${SYSTEMS.length}</h3>
      ${sysGrid("backgrounds")}
      <p class="hint">Images 1920×1080 under 2 MB, or 8–20 s video loops under 20 MB. Drop both on a console to ship both. Missing ones use the wallpaper.</p>`;
  },

  icons() {
    const have = Object.keys(P.icons).length;
    return `<h2>Console icons</h2>
      <p class="lede">Drop a folder of icons anywhere on the page. File names from GarlicOS, MinUI, muOS and ES-DE are recognised (<code>SFC.png</code>, <code>MD.png</code>, <code>PS.png</code>…).</p>
      <h3>${have} of ${SYSTEMS.length} consoles</h3>
      ${sysGrid("icons")}
      <p class="hint">PNG with transparency, 256–512 px square, under 200 KB each. Consoles you skip keep Mirmire's icons.</p>`;
  },

  sounds() {
    const row = (key, label, sub) => {
      const rec = P.sounds[key];
      return `<div class="sound ${rec ? "has" : ""}" data-slot="sounds.${key}">
        <button class="play" data-try="${key}" title="Play">${icon("play", 18)}</button>
        <div style="min-width:0"><b>${label}</b><small>${rec ? `${esc(rec.name)} · ${rec.dur ? Math.round(rec.dur * 1000) + " ms" : fmt(rec.size)}` : sub}</small>${rec?.warn ? `<small style="color:var(--warn)">${esc(rec.warn)}</small>` : ""}</div>
        <div class="tools">${rec ? `<button class="iconbtn" data-clear="sounds.${key}">✕</button>` : ""}</div>
        <input type="file" accept="${acc(AUDIO)}" data-file="sounds.${key}">
      </div>`;
    };
    return `<h2>Sounds & music</h2>
      <p class="lede">Short clicks for moving around, and background music. Press play to hear yours, or Mirmire's when a slot is empty. The preview plays them as you move with the arrow keys.</p>
      <h3>Navigation</h3>
      <div class="soundgrid">${SOUNDS.map(([k, l, sub]) => row(k, l, sub)).join("")}</div>
      <p class="hint">WAV or OGG, under 400 ms (Launch up to 1 s) and under 200 KB. A theme with no sounds keeps Mirmire's.</p>
      <h3>Per button (optional)</h3>
      <div class="soundgrid">${BUTTON_SOUNDS.map(([k, l]) => row(k, `${l} button`, "Plays instead of the action sound")).join("")}</div>
      <h3>Music</h3>
      <div class="stack">${P.music.map((r, i) => dropSlot(`music.${i}`, `Track ${i + 1}`, "", r, acc(AUDIO))).join("")}
        ${dropSlot(`music.${P.music.length}`, P.music.length ? "Add another track" : "Add a track", "15–90 s loop, OGG or MP3, under 8 MB. Several tracks shuffle.", null, acc(AUDIO))}</div>
      <p class="hint">Music is off until a player turns it on in Look.</p>`;
  },

  export() {
    const { out, files, total } = problems();
    const iconMode = P.mode === "icons";
    const warned = files.filter((f) => f.rec.warn);
    return `<h2>Export</h2>
      <p class="lede">${iconMode ? "Download the ZIP, copy it to your device, then in Mirmire open <b>Settings › Look › Console icons › Import icon pack</b>." : "Download the ZIP, copy it to your device, then in Mirmire open <b>Settings › Look › Import ZIP</b>."}</p>
      ${out.length ? `<div class="note warn">${out.map(([sec, m]) => `<div><a href="#" data-section="${sec}">${esc(m)}</a></div>`).join("")}</div>` : `<div class="note">Ready: ${files.length + 1} files, ${fmt(total)}.</div>`}
      ${warned.length ? `<div class="note warn" style="margin-top:8px"><b>Over the recommended limits</b> (they'll still import):${warned.map((f) => `<div class="hint">${esc(f.path)}: ${esc(f.rec.warn)}</div>`).join("")}</div>` : ""}
      <div style="display:flex;gap:8px;margin:14px 0">
        <button class="btn primary" data-action="download" ${out.length ? "disabled" : ""}>${icon("download", 18)} Download ZIP</button>
        <button class="btn" data-action="copyJson">Copy ${iconMode ? "pack" : "theme"}.json</button>
      </div>
      <h3>What's inside</h3>
      <div class="filelist">${iconMode ? "pack.json" : "theme.json"}<br>${files.map((f) => `${esc(f.path)} <span style="opacity:.6">${fmt(f.rec.size)}</span>`).join("<br>")}</div>
      <h3>${iconMode ? "pack" : "theme"}.json</h3>
      <pre class="filelist" style="white-space:pre-wrap">${esc(JSON.stringify(manifest(), null, 2))}</pre>
      <p class="hint">Your work is saved in this browser as you go. Nothing is uploaded. <a href="https://github.com/Mirmire-Launcher/mirmire/blob/main/docs/CREATING.md" target="_blank" rel="noopener">How to make themes and icon packs</a></p>`;
  },
};

function sysGrid(bag) {
  return `<div class="sysgrid">${SYSTEMS.map(([id, name]) => {
    const img = P[bag][id];
    const vid = bag === "backgrounds" ? P.backgroundVideos[id] : null;
    const rec = img || vid;
    const media = rec ? (rec.kind === "video" ? `<video src="${urlOf(rec)}" muted autoplay loop playsinline></video>` : `<img src="${urlOf(rec)}" alt="">`) : bag === "icons" ? `<img src="assets/icons/${id}.png" alt="" style="opacity:.22;filter:grayscale(1)">` : `<span class="ghost">${icon("image", 20)}</span>`;
    return `<div class="sys ${rec ? "has" : ""} ${bag === "backgrounds" ? "bgcell" : ""} ${view.system === id ? "focus" : ""}" data-slot="${bag}.${id}" title="${esc(name)}">
      ${media}<span class="lbl">${esc(name.replace(/ \/.*$/, ""))}</span>
      ${img && vid ? `<span class="badge">img + video</span>` : vid ? `<span class="badge">video</span>` : ""}
      ${rec ? `<button class="x" data-clear="${bag}.${id}" title="Remove">✕</button>` : ""}
      <input type="file" accept="${bag === "icons" ? acc(IMAGES) : acc([...IMAGES, ...VIDEOS])}" data-file="${bag}.${id}">
    </div>`;
  }).join("")}</div>`;
}

function drawEditor() {
  drawNav();
  const ed = $("#editor");
  const top = ed.scrollTop;
  ed.innerHTML = PANELS[section]();
  ed.scrollTop = top;
  const { out } = problems();
  const dl = $("#downloadTop");
  dl.disabled = out.length > 0;
  dl.title = out[0]?.[1] || "Download the ZIP";
  $("#title").textContent = P.name || (P.mode === "icons" ? "Untitled icon pack" : "Untitled theme");
}

function redraw() { drawEditor(); drawPreview(); save(); }

/* ============================== slots ============================== */

function setSlot(key, rec) {
  if (key === "fontFile") { P.fontFile = rec; loadFont().then(drawPreview); return; }
  if (!key.includes(".")) { P[key] = rec; return; }
  const [bag, id] = key.split(".");
  if (bag === "music") {
    const i = +id;
    if (rec) P.music[i] = rec; else P.music.splice(i, 1);
    P.music = P.music.filter(Boolean);
    return;
  }
  if (bag === "backgrounds" && rec?.kind === "video") { P.backgroundVideos[id] = rec; return; }
  if (rec) P[bag][id] = rec; else { delete P[bag][id]; if (bag === "backgrounds") delete P.backgroundVideos[id]; }
}

function limitFor(key, kind) {
  if (key === "fontFile") return "font";
  if (key === "wallpaper") return "wallpaper";
  if (key === "wallpaperVideo") return "wallpaperVideo";
  const bag = key.split(".")[0];
  if (bag === "icons") return "icon";
  if (bag === "backgrounds") return kind === "video" ? "backgroundVideo" : "background";
  if (bag === "sounds") return "sound";
  if (bag === "music") return "music";
  return null;
}

async function fileInto(key, file) {
  const kind = kindOf(file.name);
  if (!kind) { toast(`${file.name} isn't a file type Mirmire uses.`); return; }
  const rec = await makeRec(file, file.name, limitFor(key, kind));
  if (key.startsWith("sounds.")) { rec.slot = key.split(".")[1]; check(rec, "sound"); }
  setSlot(key, rec);
  const [bag, id] = key.split(".");
  if ((bag === "icons" || bag === "backgrounds") && SYSTEM[id]) { view.system = id; view.scene = "consoles"; }
  if (bag === "sounds") playSound(id);
  redraw();
}

/* ============================== bulk import ============================== */

const ALIAS = new Map(SYSTEMS.flatMap(([id, , , , names]) => names.map((n) => [n, id])));
const SOUND_NAME = new Map(Object.entries(SOUND_ALIASES).flatMap(([k, names]) => names.map((n) => [n, k])));
BUTTON_SOUNDS.forEach(([k]) => SOUND_NAME.set(k, k));

/** Sorts loose files into the right slots by folder and name. Returns what didn't fit. */
async function route(entries, { asIconPack = P.mode === "icons" } = {}) {
  const skipped = [];
  let placed = 0;
  for (const { path, blob } of entries) {
    const lower = path.toLowerCase();
    const name = path.split("/").pop();
    const kind = kindOf(name);
    const s = stem(name);
    const folder = lower.split("/").slice(0, -1).join("/");
    if (!kind || /(^|\/)licenses?\//.test(lower)) { if (!/\.(json|md|txt)$/i.test(name)) skipped.push(path); continue; }
    const sys = ALIAS.get(s);
    let key = null;
    if (asIconPack) key = kind === "image" && sys ? `icons.${sys}` : null;
    else if (kind === "font") key = "fontFile";
    else if (kind === "audio") {
      if (/music/.test(folder)) key = `music.${P.music.length}`;
      else if (SOUND_NAME.has(s)) key = `sounds.${SOUND_NAME.get(s)}`;
      else if (/sound/.test(folder)) key = null;
      else key = `music.${P.music.length}`;
    } else if (kind === "video") {
      if (sys && !/wallpaper/.test(s)) key = `backgrounds.${sys}`;
      else if (/wallpaper|background|bg/.test(s) || !P.wallpaperVideo) key = "wallpaperVideo";
    } else if (kind === "image") {
      const rec = await makeRec(blob, name, null);
      const wide = rec.w && rec.w > rec.h * 1.25;
      if (sys) key = /background/.test(folder) || (wide && !/icon/.test(folder)) ? `backgrounds.${sys}` : `icons.${sys}`;
      else if (/wallpaper/.test(s) || (wide && !P.wallpaper)) key = "wallpaper";
    }
    if (!key) { skipped.push(path); continue; }
    const rec = await makeRec(blob, name, limitFor(key, kind));
    if (key.startsWith("sounds.")) { rec.slot = key.split(".")[1]; check(rec, "sound"); }
    setSlot(key, rec);
    placed++;
  }
  return { placed, skipped };
}

/** A theme or icon pack ZIP/folder: read its manifest, then fill the rest by name. */
async function importEntries(entries, label) {
  // Drop a single top folder ("my-theme/theme.json").
  const roots = new Set(entries.map((e) => e.path.split("/")[0]));
  if (roots.size === 1 && entries.every((e) => e.path.includes("/"))) {
    const r = [...roots][0] + "/";
    if (label === "folder" || label === "files") label = r.slice(0, -1);
    entries = entries.map((e) => ({ ...e, path: e.path.slice(r.length) }));
  }
  const find = (p) => entries.find((e) => e.path === p || e.path.toLowerCase() === p.toLowerCase());
  const themeJson = find("theme.json"), packJson = find("pack.json");
  if (themeJson) {
    let m;
    try { m = JSON.parse(await themeJson.blob.text()); } catch { toast("theme.json isn't valid JSON."); return; }
    P = blankProject("theme");
    P.name = m.name || ""; P.id = m.id || slug(P.name); P.idTouched = true; P.author = m.author || ""; P.dark = m.dark !== false;
    for (const k of COLOR_KEYS) if (pal.valid(m.colors?.[k])) P.colors[k] = norm(m.colors[k]);
    const st = m.style || {};
    const [kindS, rad] = String(st.cardShape || "rounded:12").split(":");
    P.style = { ...blankStyle(), cardKind: kindS === "cut" ? "cut" : "rounded", cardRadius: Math.min(48, Math.max(0, +rad || 12)),
      cardBorder: st.cardBorder || "", borderWidth: st.borderWidth ?? 1, focusW: st.focusedBorderWidth ?? 3,
      font: String(st.font || "").startsWith("file:") ? "" : st.font || "", headerStyle: (st.headerStyle || "PLAIN").toUpperCase(),
      navigation: st.navigation === "side" ? "rail" : st.navigation || "" };
    P.seed = P.colors.primary || P.seed;
    const used = new Set(["theme.json"]);
    const take = async (path, key) => {
      const e = path && find(path);
      if (!e) return;
      used.add(e.path);
      const rec = await makeRec(e.blob, e.path, limitFor(key, kindOf(e.path)));
      if (key.startsWith("sounds.")) { rec.slot = key.split(".")[1]; check(rec, "sound"); }
      setSlot(key, rec);
    };
    const a = m.assets || {};
    if (String(st.font || "").startsWith("file:")) await take(st.font.slice(5), "fontFile");
    const wall = a.wallpaper && find(a.wallpaper);
    if (wall) await take(a.wallpaper, kindOf(a.wallpaper) === "video" ? "wallpaperVideo" : "wallpaper");
    await take(a.wallpaperVideo, "wallpaperVideo");
    for (const [id, p] of Object.entries(a.systemIcons || {})) if (SYSTEM[id]) await take(p, `icons.${id}`);
    for (const [id, p] of Object.entries(a.systemBackgrounds || {})) if (SYSTEM[id]) await take(p, `backgrounds.${id}`);
    for (const [id, p] of Object.entries(a.systemBackgroundVideos || {})) if (SYSTEM[id]) await take(p, `backgrounds.${id}`);
    for (const [k, p] of Object.entries(a.sounds || {})) await take(p, `sounds.${SOUND_NAME.get(k.toLowerCase()) || k}`);
    for (const p of a.music || []) await take(p, `music.${P.music.length}`);
    const rest = entries.filter((e) => !used.has(e.path) && /^(icons|backgrounds|default-backgrounds|sounds|music|fonts)\//i.test(e.path));
    await route(rest.filter((e) => !(/^icons\//i.test(e.path) && P.icons[ALIAS.get(stem(e.path))])));
    if (!P.wallpaper && !P.wallpaperVideo) await route(entries.filter((e) => /^wallpaper\./i.test(e.path)));
    await loadFont();
    finishImport(`Opened ${P.name || label}.`);
    return;
  }
  if (packJson || entries.every((e) => kindOf(e.path) === "image" || /\.(json|md|txt)$/i.test(e.path))) {
    let m = {};
    if (packJson) try { m = JSON.parse(await packJson.blob.text()); } catch { /* names only */ }
    P = blankProject("icons");
    P.name = m.name || label.replace(/\.zip$/i, "").replace(/[-_]+/g, " "); P.id = m.id || slug(P.name); P.author = m.author || "";
    for (const [id, p] of Object.entries(m.icons || {})) {
      const e = SYSTEM[id] && find(p);
      if (e) P.icons[id] = await makeRec(e.blob, e.path, "icon");
    }
    const { skipped } = await route(entries.filter((e) => !P.icons[ALIAS.get(stem(e.path))]), { asIconPack: true });
    finishImport(`Opened icon pack ${P.name}: ${Object.keys(P.icons).length} icons${skipped.length ? `, ${skipped.length} file${skipped.length === 1 ? "" : "s"} not matched` : ""}.`);
    return;
  }
  const { placed, skipped } = await route(entries);
  redraw();
  toast(`Added ${placed} file${placed === 1 ? "" : "s"}${skipped.length ? `. Not matched: ${skipped.slice(0, 3).map((s) => s.split("/").pop()).join(", ")}${skipped.length > 3 ? "…" : ""}` : ""}.`);
}

function finishImport(msg) {
  closeStart();
  section = P.mode === "icons" ? "icons" : "colors";
  setMode(P.mode, true);
  redraw();
  toast(msg);
}

async function entriesFromDrop(dt) {
  const items = [...(dt.items || [])].map((i) => i.webkitGetAsEntry?.()).filter(Boolean);
  if (!items.length) return [...dt.files].map((f) => ({ path: f.name, blob: f }));
  const out = [];
  const walk = async (entry, prefix) => {
    if (entry.isFile) {
      const f = await new Promise((ok, no) => entry.file(ok, no));
      out.push({ path: prefix + f.name, blob: f });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((ok, no) => reader.readEntries(ok, no));
        for (const e of batch) await walk(e, prefix + entry.name + "/");
      } while (batch.length);
    }
  };
  for (const e of items) await walk(e, "");
  return out;
}

async function openAny(entries, label = "files") {
  const zips = entries.filter((e) => /\.zip$/i.test(e.path));
  if (zips.length === 1 && entries.length === 1) {
    try { await importEntries(await readZip(zips[0].blob), zips[0].path.split("/").pop()); }
    catch (err) { toast(err.message || "That ZIP couldn't be read."); }
    return;
  }
  const hasManifest = entries.some((e) => /(^|\/)(theme|pack)\.json$/i.test(e.path));
  if (hasManifest) { await importEntries(entries, label); return; }
  closeStart();
  await importEntries(entries, label);
}

/* ============================== starting points ============================== */

async function fetchRec(url, name, limit) {
  const r = await fetch(url);
  return makeRec(await r.blob(), name, limit);
}

async function startFrom(kind, arg) {
  if (kind === "firstlight") {
    P = blankProject("theme");
    Object.assign(P, { name: "First Light remix", id: "first-light-remix", author: "", dark: true, seed: "#FFD18A" });
    P.colors = { ...FIRST_LIGHT };
    P.style = { ...blankStyle(), cardRadius: 18, cardBorder: "#596A83", navigation: "top" };
    toast("Loading First Light's wallpaper and sounds…");
    const base = "assets/first-light/";
    P.wallpaper = await fetchRec(base + "wallpaper.jpg", "wallpaper.jpg", "wallpaper");
    const lake = await fetchRec(base + "backgrounds/alpine-lake.jpg", "alpine-lake.jpg", "background");
    for (const id of ["gb", "gbc", "gba", "nds", "psp"]) P.backgrounds[id] = lake;
    for (const [k] of SOUNDS) { const r = await fetchRec(`${base}sounds/${k}.wav`, `${k}.wav`, "sound"); r.slot = k; P.sounds[k] = check(r, "sound"); }
    P.music = [await fetchRec(base + "music/daybreak.ogg", "daybreak.ogg", "music")];
    toast("First Light loaded: colors, wallpaper, sounds and music.");
  } else if (kind === "preset") {
    const t = BUILT_IN.find((b) => b.id === arg);
    P = blankProject("theme");
    Object.assign(P, { name: `${t.name} remix`, id: `${t.id}-remix`, dark: t.dark, colors: { ...t.colors }, style: { ...blankStyle(), ...t.style }, seed: t.colors.primary });
  } else if (kind === "blank") {
    P = blankProject("theme");
    Object.assign(P, { name: "", seed: "#7C9CFF" });
    P.colors = pal.generate(P.seed, { dark: true, mood: "deep" });
  } else if (kind === "icons") {
    P = blankProject("icons");
  }
  await loadFont();
  closeStart();
  section = P.mode === "icons" ? "icons" : kind === "blank" ? "colors" : "basics";
  setMode(P.mode, true);
  redraw();
}

function drawStart() {
  const mini = (c, s, wall = "assets/default/wallpaper.jpg") => {
    const r = s.cardKind === "cut" ? "0" : `${Math.round(s.cardRadius / 2)}px`;
    return `<div class="mini" style="font-family:${s.font === "monospace" ? "ui-monospace,monospace" : "Oxanium,sans-serif"}">
      <div class="mbg" style="background-image:linear-gradient(90deg, ${pal.css(c.background, 0.75)}, ${pal.css(c.background, 0.2)}), url(${wall})"></div>
      <div class="mtabs"><i style="background:${c.primary}"></i><i style="background:${pal.css(c.surface, 0.7)}"></i><i style="background:${pal.css(c.surface, 0.7)}"></i></div>
      <div class="mname" style="color:${c.onBackground || "#fff"}">Super Nintendo</div>
      <div class="mtiles"><i style="background:${pal.css(c.primaryContainer, 0.9)};border:2px solid ${c.primary};border-radius:${r}"></i><i style="background:${pal.css(c.surfaceContainer || c.surface, 0.8)};border-radius:${r};transform:scale(.85);border:1px solid ${pal.css(s.cardBorder || c.outline, 0.6)}"></i><i style="background:${pal.css(c.surfaceContainer || c.surface, 0.8)};border-radius:${r};transform:scale(.85);border:1px solid ${pal.css(s.cardBorder || c.outline, 0.6)}"></i></div>
    </div>`;
  };
  const fl = { primary: "#FFD18A", background: "#0D1628", surface: "#142037", primaryContainer: "#493B29", surfaceContainer: "#19283F", onBackground: "#FFF4E4", outline: "#91A0B5" };
  $("#start").innerHTML = `<div class="start-in">
    <img src="assets/mirmire-icon.svg" alt="Mirmire" width="64" height="64" style="display:block;border-radius:16px;margin-bottom:18px;box-shadow:0 10px 30px #0005">
    <h1>Make Mirmire yours</h1>
    <p class="lede">Design a theme or an icon pack and see it on Mirmire's real screens as you go. When you're done, download a ZIP and import it in the app. Everything stays in your browser.</p>
    <div class="ways">
      <button class="way" data-start="blank"><span class="ic">${icon("palette", 22)}</span><b>New theme</b><span>Start from one color and build out.</span></button>
      <button class="way" data-start="icons"><span class="ic">${icon("gamepad", 22)}</span><b>New icon pack</b><span>Console icons that work with any theme.</span></button>
      <label class="way"><span class="ic">${icon("download", 22)}</span><b>Open a ZIP</b><span>Edit a theme or icon pack you already have.</span><input type="file" accept=".zip" data-openzip></label>
      <label class="way"><span class="ic">${icon("folder", 22)}</span><b>Open a folder</b><span>Or drop one anywhere. Files are sorted by name.</span><input type="file" webkitdirectory multiple data-openfolder></label>
    </div>
    ${hasSaved ? `<div class="note" style="margin:-14px 0 28px;display:flex;align-items:center;gap:12px;justify-content:space-between"><span>You have a draft saved in this browser: <b>${esc(savedName || "Untitled")}</b></span><span style="display:flex;gap:8px"><button class="btn small" data-action="deleteDraft">Delete draft</button><button class="btn small primary" data-start="resume">Keep editing</button></span></div>` : ""}
    <h2>Or remix one of Mirmire's themes</h2>
    <div class="gallery">
      <button class="tpl" data-start="firstlight">${mini(fl, { cardKind: "rounded", cardRadius: 18, cardBorder: "#596A83" }, "assets/first-light/wallpaper.jpg")}<div class="meta"><b>First Light</b><small>wallpaper, sounds, music</small></div></button>
      ${BUILT_IN.map((t) => `<button class="tpl" data-start="preset:${t.id}">${mini(t.colors, t.style, t.id === "droiddeck" ? "" : undefined)}<div class="meta"><b>${esc(t.name)}</b><small>${t.dark ? "dark" : "light"}</small></div></button>`).join("")}
    </div>
    <p class="hint" style="margin-top:28px">Console icons by KyleBing and RetroArch assets contributors, CC BY 4.0. Sample games: Tobu Tobu Girl Deluxe, µCity, Butano Fighter, Libbet and the Magic Floor, Thwaite and Concentration Room, used under their free licenses. Oxanium font, SIL OFL. <a href="assets/CREDITS.md" target="_blank" rel="noopener">Credits</a> · <a href="assets/games/CREDITS.md" target="_blank" rel="noopener">Game art credits</a> · <a href="https://github.com/Mirmire-Launcher/mirmire" target="_blank" rel="noopener">Mirmire on GitHub</a> · <a href="https://github.com/Mirmire-Launcher/mirmire/blob/main/docs/CREATING.md" target="_blank" rel="noopener">How to make themes and icon packs</a></p>
  </div>`;
}
let hasSaved = false, savedName = "";
function openStart() { drawStart(); $("#start").classList.remove("hidden"); }
function closeStart() { $("#start").classList.add("hidden"); }

function setMode(mode, keep = false) {
  if (!keep && mode !== P.mode) {
    if (mode === "icons") { P = { ...blankProject("icons"), icons: P.icons, name: P.name ? `${P.name} icons` : "", author: P.author }; P.id = slug(P.name); }
    else { const icons = P.icons; P = blankProject("theme"); P.icons = icons; P.colors = pal.generate("#7C9CFF"); }
  }
  $$("#mode button").forEach((b) => b.classList.toggle("on", b.dataset.mode === P.mode));
  if (P.mode === "icons") view.scene = "consoles";
}

/* ============================== events ============================== */

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  t.style.opacity = 1;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.classList.add("hidden"), 250); }, 3200);
}

function applyPalette() {
  const gen = pal.generate(P.seed, { dark: P.dark, mood: P.mood, harmony: P.harmony });
  const lights = { lights: P.colors.lights, lightsRight: P.colors.lightsRight };
  P.colors = { ...gen };
  for (const [k, v] of Object.entries(lights)) if (v) P.colors[k] = v;
  if (P.style.cardBorder && P.mood !== "black") P.style.cardBorder = pal.mix(gen.surfaceVariant, gen.outline, 0.35);
}

async function download() {
  const { out, files } = problems();
  if (out.length) { section = out[0][0]; redraw(); return; }
  // files from problems() are already unique
  const enc = new TextEncoder();
  const json = JSON.stringify(manifest(), null, 2);
  const entries = [{ path: P.mode === "icons" ? "pack.json" : "theme.json", data: enc.encode(json) }];
  for (const f of files) entries.push({ path: f.path, data: new Uint8Array(await f.rec.blob.arrayBuffer()) });
  const blob = writeZip(entries);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${P.id}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast(`Downloaded ${P.id}.zip (${fmt(blob.size)}).`);
}

const PICK_ROLES = [
  [".m-play", "primary"], [".m-tab.on", "primary"], [".m-seg.on", "primary"], [".m-switch.on", "primary"], [".m-group", "primary"],
  [".m-rowicon", "primary"], [".m-rail-item.on", "primary"], [".m-tile.sel", "primaryContainer"], [".m-tab", "surface"],
  [".m-hero-name", "onBackground"], [".m-headline", "onBackground"], [".m-title-l", "onBackground"], [".m-section", "onBackground"],
  [".m-headline-s", "onBackground"], [".m-muted", "onSurfaceVariant"], [".m-count", "onSurfaceVariant"], [".m-info", "onSurfaceVariant"],
  [".m-status-pill", "tertiary"], [".m-weekly-badge", "tertiary"], [".m-round", "surfaceContainerHigh"], [".m-chip", "surfaceContainerHigh"],
  [".m-switcher", "surfaceContainerHigh"], [".m-info-pill", "surfaceContainerHigh"], [".m-action", "surfaceContainerHigh"], [".m-rail", "surface"],
  [".m-panel", "surface"], [".m-weekly", "surface"], [".m-tile", "surfaceContainer"], [".m-switch", "outline"],
];

function jumpToColor(key) {
  if (P.mode === "icons") return;
  section = "colors";
  drawEditor();
  const row = $(`[data-crow="${key}"]`);
  if (row) {
    row.scrollIntoView({ block: "center", behavior: "smooth" });
    row.classList.add("flash");
    setTimeout(() => row.classList.remove("flash"), 1400);
  }
}

function previewClick(e) {
  const t = e.target;
  if (view.pick) {
    e.preventDefault();
    const hit = PICK_ROLES.find(([sel]) => t.closest(sel));
    jumpToColor(hit ? hit[1] : "background");
    return;
  }
  const el = t.closest("[data-go],[data-system],[data-game],[data-row],.m-play,[data-sfx]");
  if (!el) return;
  if (el.dataset.sfx) playSound(el.dataset.sfx);
  if (el.dataset.system) {
    if (view.system === el.dataset.system) { view.scene = "games"; playSound("select"); }
    view.system = el.dataset.system;
  }
  if (el.dataset.game) {
    const g = +el.dataset.game;
    if (view.game === g && view.scene === "games") view.scene = "game";
    view.game = g;
  }
  if (el.dataset.row) view.row = +el.dataset.row;
  if (el.dataset.go) view.scene = el.dataset.go;
  view.focus = true;
  drawScenes();
  drawPreview();
}

function drawScenes() {
  $("#scenes").innerHTML = SCENES.map(([id, l]) => `<button class="${view.scene === id ? "on" : ""}" data-scene="${id}">${l}</button>`).join("");
}

function key(e) {
  if (e.target.closest("input, textarea, select, [contenteditable]")) return;
  const k = e.key;
  const order = previewAssets.consoleOrder();
  const move = (d) => {
    if (view.scene === "consoles") {
      const i = order.indexOf(view.system) + d;
      if (i < 0 || i >= order.length) return playSound("edge");
      view.system = order[i];
    } else if (view.scene === "games" || view.scene === "spotlight") {
      const i = view.game + d;
      if (i < 0 || i >= SAMPLE_GAMES.length) return playSound("edge");
      view.game = i;
    } else if (view.scene === "settings") {
      const i = view.row + d;
      if (i < 0 || i > 3) return playSound("edge");
      view.row = i;
    } else return;
    playSound("move");
  };
  const horizontal = view.scene === "consoles" || view.scene === "spotlight";
  if (k === "ArrowRight" && horizontal || k === "ArrowDown" && !horizontal) move(1);
  else if (k === "ArrowLeft" && horizontal || k === "ArrowUp" && !horizontal) move(-1);
  else if (k === "Enter" || k === " ") {
    if (view.scene === "consoles") { view.scene = "games"; view.game = 0; playSound("select"); }
    else if (view.scene === "games" || view.scene === "spotlight") { view.scene = "game"; playSound("select"); }
    else if (view.scene === "game") playSound("launch");
    else playSound("select");
  } else if (k === "Escape" || k === "Backspace") {
    const back = { games: "consoles", game: "games", settings: "consoles", spotlight: "consoles" }[view.scene];
    if (!back) return playSound("edge");
    view.scene = back; playSound("back");
  } else if (k === "q" || k === "e") {
    const tabs = ["consoles", "games", "spotlight"];
    const i = Math.max(0, tabs.indexOf(view.scene)) + (k === "e" ? 1 : -1);
    view.scene = tabs[(i + tabs.length) % tabs.length]; playSound("tab");
  } else if (k === "f") playSound("favorite");
  else if (k === "Tab" && e.shiftKey === false && e.target === document.body) return;
  else return;
  e.preventDefault();
  view.focus = true;
  drawScenes();
  drawPreview();
}

function wire() {
  document.addEventListener("click", async (e) => {
    const t = e.target;
    if (t.closest("#screen")) { previewClick(e); return; }
    const d = (sel) => t.closest(sel);
    if (d("[data-section]")) { e.preventDefault(); section = d("[data-section]").dataset.section; drawEditor(); $("#editor").scrollTop = 0; return; }
    if (d("[data-scene]")) { view.scene = d("[data-scene]").dataset.scene; view.focus = true; drawScenes(); drawPreview(); return; }
    if (d("[data-mode]")) { setMode(d("[data-mode]").dataset.mode); section = "basics"; redraw(); return; }
    if (d("[data-start]")) {
      const v = d("[data-start]").dataset.start;
      if (v === "resume") { closeStart(); return redraw(); }
      const [kind, arg] = v.split(":");
      return startFrom(kind, arg);
    }
    if (d("[data-jump]")) return jumpToColor(d("[data-jump]").dataset.jump);
    if (d("[data-clear]")) { e.preventDefault(); setSlot(d("[data-clear]").dataset.clear, null); return redraw(); }
    if (d("[data-try]")) { e.preventDefault(); const k = d("[data-try]").dataset.try; const was = view.sound; view.sound = true; playSound(k.startsWith("button_") && !P.sounds[k] ? "select" : k); view.sound = was; return; }
    if (d("[data-seedpick]")) { P.seed = d("[data-seedpick]").dataset.seedpick; applyPalette(); return redraw(); }
    if (d("[data-mood]")) { P.mood = d("[data-mood]").dataset.mood; applyPalette(); return redraw(); }
    if (d("[data-harmony]")) { P.harmony = d("[data-harmony]").dataset.harmony; applyPalette(); return redraw(); }
    if (d("[data-stylepick]")) {
      const [k, v] = d("[data-stylepick]").dataset.stylepick.split(":");
      if (k === "font") { P.fontFile = null; await loadFont(); }
      P.style[k] = v;
      if (k === "navigation") { view.forceTop = false; view.forceRail = false; }
      const go = d("[data-stylepick]").dataset.goscene;
      if (go) { view.scene = go; drawScenes(); }
      return redraw();
    }
    const action = d("[data-action]")?.dataset.action;
    if (action === "generate") { applyPalette(); redraw(); toast("Palette built from your main color."); }
    if (action === "surprise") { P.seed = pal.randomSeed(); P.mood = ["deep", "vivid", "soft"][Math.floor(Math.random() * 3)]; P.harmony = ["analogous", "complement", "triad"][Math.floor(Math.random() * 3)]; applyPalette(); redraw(); }
    if (action === "fromWall") {
      const rec = P.wallpaper;
      if (!rec) return;
      const seeds = await pal.fromImage(urlOf(rec));
      P.seed = seeds[0]; applyPalette(); redraw();
      const box = $("#wallSeeds");
      if (box) box.innerHTML = `<span class="hint" style="width:100%">Colors from your wallpaper. Click one to use it.</span>` + seeds.map((h) => `<button class="pick" style="background:${h}" data-seedpick="${h}"></button>`).join("");
    }
    if (action === "download") download();
    if (action === "copyJson") { await navigator.clipboard.writeText(JSON.stringify(manifest(), null, 2)).catch(() => {}); toast("Copied."); }
    if (action === "start") openStart();
    if (action === "deleteDraft") {
      const btn = d("[data-action]");
      // Two presses, so a stray click can't throw work away.
      if (!btn.dataset.armed) { btn.dataset.armed = "1"; btn.textContent = "Delete for good?"; btn.classList.add("danger"); setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = "Delete draft"; btn.classList.remove("danger"); } }, 4000); return; }
      await deleteDraft();
    }
    if (t.closest("#downloadTop")) download();
    if (t.closest("#newBtn")) openStart();
    if (t.closest("#musicBtn")) toggleMusic();
    if (t.closest("#soundBtn")) { view.sound = !view.sound; t.closest("#soundBtn").classList.toggle("on", view.sound); }
    if (t.closest("#pickBtn")) { view.pick = !view.pick; t.closest("#pickBtn").classList.toggle("on", view.pick); $("#screen").style.cursor = view.pick ? "crosshair" : ""; toast(view.pick ? "Click anything in the preview to edit its color." : "Pick off."); }
    if (t.closest("#themeBtn")) {
      const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.dataset.theme = cur === "light" ? "dark" : "light";
      try { localStorage.setItem("studio-ui", document.documentElement.dataset.theme); } catch { /* ignore */ }
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.bind && t.type !== "checkbox") {
      const k = t.dataset.bind;
      P[k] = t.value;
      if (k === "name" && !P.idTouched) { P.id = slug(t.value); const idIn = $('[data-bind="id"]'); if (idIn) idIn.value = P.id; }
      if (k === "id") { P.idTouched = true; t.classList.toggle("bad", !!t.value && !ID_RE.test(t.value)); }
      $("#title").textContent = P.name || "Untitled";
      drawNav(); drawPreview(); save();
      const { out } = problems(); $("#downloadTop").disabled = out.length > 0;
    }
    if (t.dataset.color) { P.colors[t.dataset.color] = t.value.toUpperCase(); liveColor(t.dataset.color); }
    if (t.dataset.hex !== undefined) {
      const k = t.dataset.hex;
      if (!t.value.trim()) delete P.colors[k];
      else if (pal.valid(t.value)) P.colors[k] = norm(t.value);
      liveColor(k, false);
    }
    if (t.dataset.seed !== undefined) { P.seed = t.value.toUpperCase(); applyPalette(); t.parentElement.style.background = P.seed; drawPreview(); save(); }
    if (t.dataset.style) { P.style[t.dataset.style] = +t.value; t.nextElementSibling.textContent = `${t.value} dp`; drawPreview(); save(); }
    if (t.dataset.border !== undefined) { P.style.cardBorder = t.value.toUpperCase(); const h = $("[data-borderhex]"); if (h) h.value = P.style.cardBorder; drawPreview(); save(); }
    if (t.dataset.borderhex !== undefined) { if (!t.value.trim() || pal.valid(t.value)) { P.style.cardBorder = t.value.trim() ? norm(t.value) : ""; drawPreview(); save(); } }
  });

  document.addEventListener("change", async (e) => {
    const t = e.target;
    if (t.dataset.bind === "dark") { P.dark = t.checked; applyPalette(); redraw(); }
    if (t.dataset.seed !== undefined || t.dataset.color || t.dataset.style || t.dataset.border !== undefined) redraw();
    if (t.dataset.file && t.files[0]) {
      const key = t.dataset.file;
      if (key.startsWith("music.") || t.files.length === 1) await fileInto(key, t.files[0]);
      for (const f of [...t.files].slice(1)) if (key.startsWith("music.")) await fileInto(`music.${P.music.length}`, f);
    }
    if (t.dataset.openzip !== undefined && t.files[0]) await openAny([{ path: t.files[0].name, blob: t.files[0] }]);
    if (t.dataset.openfolder !== undefined && t.files.length) await openAny([...t.files].map((f) => ({ path: f.webkitRelativePath || f.name, blob: f })), "folder");
    if (t.id === "screenSize") { view.screen = SCREENS[t.value]; drawPreview(); }
    if (t.id === "glyphs") { view.glyphs = t.value; drawPreview(); }
    if (t.id === "frame") { $("#device").classList.toggle("flat", t.value === "flat"); fit(); }
  });

  // Drag and drop: onto a slot fills that slot; anywhere else sorts the files by name.
  let depth = 0;
  document.addEventListener("dragenter", (e) => { if (!e.dataTransfer?.types?.includes("Files")) return; depth++; if (!e.target.closest?.("[data-slot]")) $("#dropzone").classList.remove("hidden"); });
  document.addEventListener("dragleave", () => { depth = Math.max(0, depth - 1); if (!depth) $("#dropzone").classList.add("hidden"); $$(".over").forEach((x) => x.classList.remove("over")); });
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    $$(".over").forEach((x) => x.classList.remove("over"));
    const slot = e.target.closest?.("[data-slot]");
    if (slot) { slot.classList.add("over"); $("#dropzone").classList.add("hidden"); }
    else if (depth) $("#dropzone").classList.remove("hidden");
  });
  document.addEventListener("drop", async (e) => {
    e.preventDefault();
    depth = 0;
    $("#dropzone").classList.add("hidden");
    $$(".over").forEach((x) => x.classList.remove("over"));
    const slot = e.target.closest?.("[data-slot]");
    const entries = await entriesFromDrop(e.dataTransfer);
    if (slot && entries.length === 1) return fileInto(slot.dataset.slot, entries[0].blob instanceof File ? entries[0].blob : new File([entries[0].blob], entries[0].path));
    if (slot && slot.dataset.slot.startsWith("backgrounds.") && entries.length === 2) {
      for (const en of entries) await fileInto(slot.dataset.slot, en.blob);
      return;
    }
    await openAny(entries, "folder");
  });

  document.addEventListener("keydown", key);
  new ResizeObserver(() => fit()).observe($("#viewport"));
}

function liveColor(k, rewriteHex = true) {
  const row = $(`[data-crow="${k}"]`);
  if (row) {
    row.classList.toggle("unset", !hasColor(k));
    const c = resolveColors(themeForPreview());
    row.querySelector(".sw i").style.background = pal.css(c[k]);
    if (rewriteHex) row.querySelector("[data-hex]").value = P.colors[k] || "";
  }
  drawPreview();
  save();
}

/* ============================== boot ============================== */

async function boot() {
  try { const ui = localStorage.getItem("studio-ui"); if (ui) document.documentElement.dataset.theme = ui; } catch { /* ignore */ }
  $("#screenSize").innerHTML = Object.entries(SCREENS).map(([k, s]) => `<option value="${k}">${s.label}</option>`).join("");
  $("#glyphs").innerHTML = Object.entries(GLYPHS).map(([k, l]) => `<option value="${k}">${l}</option>`).join("");
  wire();
  drawScenes();
  hasSaved = await restore();
  savedName = P.name;
  if (hasSaved) await loadFont();
  setMode(P.mode, true);
  if (!hasSaved) P = Object.assign(blankProject(), { colors: pal.generate("#FFD18A") });
  redraw();
  booting = false;
  // Links can open straight into a template and screen: #start=firstlight&scene=games&frame=flat
  const q = new URLSearchParams(location.hash.slice(1));
  if (q.get("start")) {
    const [kind, arg] = q.get("start").split(":");
    await startFrom(kind, arg);
    if (q.get("scene")) { view.scene = q.get("scene"); drawScenes(); }
    if (q.get("frame") === "flat") $("#device").classList.add("flat");
    if (q.get("glyphs") && GLYPHS[q.get("glyphs")]) { view.glyphs = q.get("glyphs"); $("#glyphs").value = view.glyphs; }
    if (q.get("screen") && SCREENS[q.get("screen")]) { view.screen = SCREENS[q.get("screen")]; $("#screenSize").value = q.get("screen"); }
    if (q.get("section")) section = q.get("section");
    drawEditor(); drawPreview();
    return;
  }
  openStart();
}

boot();
