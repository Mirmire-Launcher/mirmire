// Plugin mode: widget plugins for Mirmire's home page. A plugin is plugin.json + a web page (index.html) + any files it uses.
// The preview runs the page in a sandboxed iframe with a stand-in for the app's window.mirmire API and sample data.

import { SAMPLE_GAMES, SYSTEM } from "./data.js";
import { resolveColors } from "./preview.js";
import { icon } from "./icons.js";

export const SIZES = [
  ["small", "Small", "1 × 1", 1, 1],
  ["wide", "Wide", "2 × 1", 2, 1],
  ["medium", "Medium", "2 × 2", 2, 2],
  ["large", "Large", "4 × 2", 4, 2],
];

export const PERMISSIONS = [
  ["internet", "Use the internet", "Load images or data from the web, for example weather or news"],
  ["library", "See your games and open them", "mirmire.games.recent(), all() and open(id)"],
  ["achievements", "See RetroAchievements stats", "mirmire.achievements(): points, rank, this week, streak"],
];

export const TEMPLATES = [
  { id: "blank", name: "Blank", detail: "A starting point that remembers how often it's selected", sizes: ["wide", "small"], permissions: [] },
  { id: "pixel-pet", name: "Mochi", detail: "A pixel creature to feed: a simple version of Mirmire's Pixel Pet", sizes: ["small", "wide", "medium"], permissions: [] },
  { id: "led-clock", name: "LED clock", detail: "A glowing retro clock", sizes: ["small", "wide", "large"], permissions: [] },
  { id: "game-of-the-day", name: "Game of the day", detail: "Picks a game from your library each day", sizes: ["wide", "medium"], permissions: ["library"] },
  { id: "trophy-meter", name: "Trophy meter", detail: "This week's RetroAchievements points toward a goal", sizes: ["wide"], permissions: ["achievements"] },
];

export function blankPlugin() {
  return { description: "", sizes: ["wide"], defaultSize: "wide", permissions: [], code: "", template: "", files: {}, previewSize: "wide", previewTheme: "firstlight" };
}

export async function loadTemplate(id) {
  const r = await fetch(`assets/plugins/${id}.html`);
  return r.text();
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function pluginManifest(P) {
  const p = P.plugin;
  const sizes = SIZES.map((s) => s[0]).filter((s) => p.sizes.includes(s));
  return {
    id: P.id, name: P.name, ...(P.author ? { author: P.author } : {}), version: 1,
    ...(p.description ? { description: p.description } : {}),
    entry: "index.html", sizes, defaultSize: sizes.includes(p.defaultSize) ? p.defaultSize : sizes[0], permissions: p.permissions,
  };
}

export function pluginProblems(P) {
  const out = [];
  if (!P.plugin.code.trim()) out.push(["code", "Write the plugin's page, or start from a template."]);
  if (!P.plugin.sizes.length) out.push(["options", "Choose at least one size."]);
  return out;
}

// ---------------------------------------------------------------------- Panels

export function codePanel(P) {
  const p = P.plugin;
  return `<h2>Code</h2>
    <p class="lede">A plugin is a small web page. It gets your theme's colors as CSS variables (<code>--primary</code>, <code>--on-surface</code>…) and talks to Mirmire through <code>window.mirmire</code>. The preview updates as you type.</p>
    <h3>Start from a template</h3>
    <div class="stack">${TEMPLATES.map((t) => `<button class="tplrow ${p.template === t.id ? "on" : ""}" data-ptemplate="${t.id}">
      <b>${esc(t.name)}</b><span>${esc(t.detail)}${t.permissions.length ? ` · needs ${t.permissions.join(", ")}` : ""}</span></button>`).join("")}</div>
    <h3>index.html</h3>
    <textarea class="code" id="pcode" spellcheck="false" autocapitalize="off" autocomplete="off">${esc(p.code)}</textarea>
    <h3>Other files (optional)</h3>
    <div class="stack">${Object.entries(p.files).map(([name, f]) => `<div class="drop"><div class="thumb">${icon("category", 22)}</div>
      <div><b>${esc(name)}</b><small>${Math.round(f.size / 1024)} KB · use it as "${esc(name)}"</small></div>
      <div class="tools"><button class="iconbtn" data-pfile-remove="${esc(name)}">✕</button></div></div>`).join("")}
      <div class="drop"><div class="thumb">${icon("add", 22)}</div><div><b>Add images, fonts or sounds</b><small>Refer to them by name, like src="sprite.png"</small></div>
        <input type="file" multiple data-pfiles></div></div>
    <p class="hint">See <a href="https://github.com/Mirmire-Launcher/mirmire/blob/main/docs/PLUGINS.md" target="_blank" rel="noopener">PLUGINS.md</a> for everything <code>window.mirmire</code> offers.</p>`;
}

export function optionsPanel(P, presets) {
  const p = P.plugin;
  return `<h2>Options</h2>
    <p class="lede">The sizes your widget supports and what it's allowed to do. Players see the permissions when they install it.</p>
    <h3>Sizes</h3>
    <div class="chips">${SIZES.map(([k, l, d]) => `<button class="chip ${p.sizes.includes(k) ? "on" : ""}" data-psize="${k}">${l} <small style="opacity:.7">${d}</small></button>`).join("")}</div>
    <h3>Starts as</h3>
    <div class="chips">${SIZES.filter(([k]) => p.sizes.includes(k)).map(([k, l]) => `<button class="chip ${p.defaultSize === k ? "on" : ""}" data-pdefault="${k}">${l}</button>`).join("")}</div>
    <h3>Permissions</h3>
    ${PERMISSIONS.map(([k, l, d]) => `<div class="toggle"><div><b>${l}</b><div class="hint">${d}</div></div><input type="checkbox" class="switch" data-pperm="${k}" ${p.permissions.includes(k) ? "checked" : ""}></div>`).join("")}
    <p class="hint">Every plugin can draw itself, react to being selected and keep a little data of its own (<code>mirmire.storage</code>).</p>
    <h3>Preview with theme</h3>
    <div class="chips">${presets.map((t) => `<button class="chip ${p.previewTheme === t.id ? "on" : ""}" data-ptheme="${t.id}">${esc(t.name)}</button>`).join("")}</div>`;
}

// ---------------------------------------------------------------------- Preview

/** The fake window.mirmire for the preview, mirroring the app's API (see PluginWidget.kt). */
function shim(P, theme, base) {
  const perms = P.plugin.permissions;
  const games = SAMPLE_GAMES.map((g, i) => ({
    id: i + 1, title: g.title, system: g.system, systemName: SYSTEM[g.system]?.[1] || g.system,
    cover: g.box ? new URL(g.box, base).href : "", favorite: i === 1, lastPlayed: i < 3 ? Date.now() - i * 864e5 : 0,
    playTimeMinutes: [200, 45, 12, 0, 300, 0][i] || 0, onDevice: i % 2 === 0,
  }));
  const ach = { user: "player", points: 2350, rank: 48210, weekUnlocks: 6, weekPoints: 42, streakDays: 3, mastered: 2, beaten: 5 };
  return `<script>
(function () {
  var perms = ${JSON.stringify(perms)}, games = ${JSON.stringify(games)}, ach = ${JSON.stringify(ach)}, store = {};
  function allow(p) { if (perms.indexOf(p) < 0) { console.warn('window.mirmire: add "' + p + '" to permissions to use this'); return false; } return true; }
  var t = ${JSON.stringify(theme)};
  var r = document.documentElement.style;
  Object.keys(t.colors).forEach(function (k) { r.setProperty('--' + k.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }), t.colors[k]); });
  r.background = 'transparent';
  window.mirmire = {
    version: 1, size: ${JSON.stringify(P.plugin.previewSize)}, theme: t,
    storage: { get: function (k) { return k in store ? store[k] : null; }, set: function (k, v) { if (v == null) delete store[k]; else store[k] = String(v); } },
    games: {
      recent: function (n) { return allow('library') ? games.filter(function (g) { return g.lastPlayed; }).slice(0, n || 5) : []; },
      all: function () { return allow('library') ? games : []; },
      open: function (id) { if (allow('library')) parent.postMessage({ mirmireOpen: id }, '*'); }
    },
    achievements: function () { return allow('achievements') ? ach : null; }
  };
  window.addEventListener('error', function (e) { parent.postMessage({ mirmireError: e.message + ' (line ' + e.lineno + ')' }, '*'); });
  var log = console.warn; console.warn = function (m) { parent.postMessage({ mirmireError: String(m) }, '*'); log.apply(console, arguments); };
})();
</script>`;
}

/** The page as the iframe gets it: the API added first, and extra files swapped for their in-browser addresses. */
export function previewDoc(P, theme, fileUrl) {
  let html = P.plugin.code || "<body></body>";
  for (const name of Object.keys(P.plugin.files)) {
    const u = fileUrl(name);
    const n = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`(["'(])\\.?/?${n}(["')])`, "g"), `$1${u}$2`);
  }
  const s = shim(P, theme, location.href);
  const head = html.match(/<head[^>]*>/i);
  return head ? html.replace(head[0], head[0] + s) : s + html;
}

export function themeColors(preset) {
  const c = resolveColors({ dark: preset.dark, colors: preset.colors, style: preset.style });
  return { dark: preset.dark, colors: { primary: c.primary, onPrimary: c.onPrimary, secondary: c.secondary, tertiary: c.tertiary, background: c.background,
    onBackground: c.onBackground, surface: c.surface, onSurface: c.onSurface, surfaceVariant: c.surfaceVariant, onSurfaceVariant: c.onSurfaceVariant,
    outline: c.outline, error: c.error } };
}

/** Mirmire's Home tab with the plugin's widget among a few built-in ones. */
export function homeMock(P, preset, wall) {
  const sizes = Object.fromEntries(SIZES.map(([k, , , c, r]) => [k, [c, r]]));
  const [cw, rh] = sizes[P.plugin.previewSize] || [2, 1];
  const t = themeColors(preset);
  const c = t.colors;
  const tab = (ic, label, on) => `<span class="pm-tab ${on ? "on" : ""}">${icon(ic, 18)}${on ? label : ""}</span>`;
  const card = (cols, rows, inner, extra = "") => `<div class="pm-card ${extra}" style="grid-column: span ${cols}; grid-row: span ${rows}">${inner}</div>`;
  const now = new Date();
  return `<div class="pm" style="--p:${c.primary};--op:${c.onPrimary};--bg:${c.background};--sf:${c.surface};--on:${c.onSurface};--mut:${c.onSurfaceVariant};--sv:${c.surfaceVariant};--r:${preset.style.cardRadius || 12}px">
    <div class="pm-wall" style="background-image:linear-gradient(180deg, ${c.background}99, ${c.background}dd), url(${wall})"></div>
    <div class="pm-top">${tab("dashboard", "Home", true)}${tab("gamepad", "", false)}${tab("games", "", false)}${tab("history", "", false)}${tab("heart", "", false)}${tab("sparkle", "", false)}
      <span style="flex:1"></span><span class="pm-round">${icon("search", 18)}</span><span class="pm-round">${icon("settings", 18)}</span></div>
    <div class="pm-grid">
      ${card(cw, rh, `<iframe id="pluginFrame" sandbox="allow-scripts" title="Plugin preview"></iframe>`, "plugin")}
      ${card(2, 1, `<div class="pm-in"><div class="pm-big">${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div><div class="pm-mut">${now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div></div>`)}
      ${card(1, 1, `<div class="pm-in"><div class="pm-k">Library</div><div class="pm-big" style="font-size:26px">1,284</div><div class="pm-mut">games · 18 consoles</div></div>`)}
      ${card(2, 1, `<div class="pm-in"><div class="pm-k">Recently played</div><div class="pm-strip">${SAMPLE_GAMES.slice(0, 5).map((g) => `<img src="${g.box}" alt="">`).join("")}</div></div>`)}
    </div>
  </div>`;
}
