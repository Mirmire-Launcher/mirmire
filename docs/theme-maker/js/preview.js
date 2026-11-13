// Renders Mirmire's screens with a theme, using the same color roles, sizes and focus rules as the app.
// Units: 1 CSS px = 1 dp. The screen is scaled to fit the stage.

import { SYSTEMS, SYSTEM, SAMPLE_GAMES, MATERIAL } from "./data.js";
import { css, mix, parse } from "./palette.js";
import { icon } from "./icons.js";

export const SCREENS = {
  wide: { label: "Phone · 20:9", w: 873, h: 393 },
  handheld: { label: "Handheld · 16:9", w: 760, h: 428 },
  tablet: { label: "Tablet · 16:10", w: 1000, h: 625 },
};

export const SCENES = [
  ["consoles", "Consoles"],
  ["games", "Games"],
  ["game", "Game page"],
  ["spotlight", "Spotlight"],
  ["settings", "Settings"],
];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Every color the screens need: the theme's, or Material's for a key it leaves out. */
export function resolveColors(t) {
  const base = MATERIAL[t.dark ? "dark" : "light"];
  const out = {};
  for (const k of Object.keys(base)) out[k] = parse(t.colors[k]) ? t.colors[k] : base[k];
  out.lights = parse(t.colors.lights) ? t.colors.lights : out.primary;
  out.lightsRight = parse(t.colors.lightsRight) ? t.colors.lightsRight : out.lights;
  return out;
}

function cssVars(t, c) {
  const s = t.style;
  const v = {
    "--primary": c.primary, "--on-primary": c.onPrimary, "--pc": c.primaryContainer, "--on-pc": c.onPrimaryContainer,
    "--secondary": c.secondary, "--tertiary": c.tertiary, "--on-tertiary": c.onTertiary,
    "--bg": c.background, "--on-bg": c.onBackground, "--surface": c.surface, "--on-surface": c.onSurface,
    "--sv": c.surfaceVariant, "--on-sv": c.onSurfaceVariant, "--sc": c.surfaceContainer, "--sch": c.surfaceContainerHigh,
    "--outline": c.outline, "--error": c.error,
    "--play-1": c.primary, "--play-2": mix(c.primary, "#000000", 0.18),
    "--radius": `${s.cardRadius}px`,
    "--rest-border": parse(s.cardBorder) ? `${Math.max(0, s.borderWidth)}px solid ${css(s.cardBorder)}` : `1px solid ${css(c.outline, 0.35)}`,
    "--focus-w": `${Math.max(1, Math.min(8, s.focusW))}px`,
  };
  return Object.entries(v).map(([k, x]) => `${k}:${x}`).join(";");
}

export function fontStack(t, customFamily) {
  if (customFamily) return `${customFamily}, Oxanium, sans-serif`;
  return { monospace: "ui-monospace, 'Roboto Mono', Menlo, monospace", sans: "Roboto, system-ui, sans-serif",
    serif: "'Noto Serif', Georgia, serif", cursive: "'Comic Sans MS', 'Segoe Print', cursive" }[t.style.font] || "Oxanium, sans-serif";
}

/** Generated stand-in box art for the made-up sample games. */
function art(game, kind = "box") {
  const h = game.hue;
  const a = `hsl(${h} 70% 46%)`, b = `hsl(${(h + 40) % 360} 75% 22%)`, d = `hsl(${(h + 200) % 360} 80% 70%)`;
  const id = `g${h}${kind}`;
  if (kind === "shot") {
    return `<svg viewBox="0 0 160 112" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h} 60% 30%)"/><stop offset="1" stop-color="hsl(${(h + 30) % 360} 70% 12%)"/></linearGradient></defs>
      <rect width="160" height="112" fill="url(#${id})"/>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${(i * 37) % 160}" y="${(i * 23) % 60}" width="2" height="2" fill="#fff" opacity=".7"/>`).join("")}
      <rect y="88" width="160" height="24" fill="hsl(${(h + 120) % 360} 45% 28%)"/>
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 16}" y="84" width="16" height="6" fill="hsl(${(h + 120) % 360} 50% 40%)" stroke="#0004"/>`).join("")}
      <rect x="40" y="66" width="10" height="18" fill="${d}"/><rect x="38" y="60" width="14" height="8" fill="#ffd7b0"/>
      <rect x="104" y="58" width="22" height="22" fill="${a}" stroke="#0006"/><rect x="110" y="64" width="4" height="4" fill="#fff"/></svg>`;
  }
  return `<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="100" height="140" fill="url(#${id})"/><circle cx="72" cy="52" r="26" fill="${d}" opacity=".55"/>
    <path d="M0 110 L30 80 L52 98 L78 70 L100 92 V140 H0Z" fill="#0006"/>
    <rect x="8" y="10" width="84" height="26" rx="3" fill="#0008"/>
    <text x="50" y="28" font-family="Arial Black, sans-serif" font-size="8.5" fill="#fff" text-anchor="middle">${esc(game.title.toUpperCase().slice(0, 13))}</text></svg>`;
}

function statusBar() {
  return `<div class="m-status"><span>9:41</span><span class="m-status-r">${icon("signal", 13)}${icon("wifi", 14)}${icon("battery", 14, "currentColor", 'style="transform:rotate(90deg)"')}</span></div>`;
}

function iconFor(t, id, assets) {
  const url = assets.icon(id);
  return url ? `<img src="${url}" alt="">` : `<span class="m-noicon">${icon("gamepad", 48)}</span>`;
}

function backdrop(t, assets, sysId, scene) {
  const media = assets.backdrop(scene === "consoles" || scene === "games" ? sysId : null);
  const dim = scene === "settings" ? 0.6 : 0.35;
  if (!media) {
    // No wallpaper and no stock one: the app's gradient from primary α .2 to background.
    return `<div class="m-wall" style="background:linear-gradient(180deg, ${css(t.c.primary, 0.2)}, ${t.c.background})"></div>`;
  }
  const el = media.video
    ? `<video class="m-wall" src="${media.url}" autoplay muted loop playsinline></video>`
    : `<img class="m-wall" src="${media.url}" alt="">`;
  const bg = t.c.background;
  if (scene === "settings" || scene === "spotlight") {
    return `${el}<div class="m-wall" style="background:linear-gradient(180deg, ${css(bg, dim * 0.6)}, ${css(bg, Math.min(dim * 0.6 + 0.25, 0.97))})"></div>`;
  }
  return `${el}
    <div class="m-wall" style="background:${css(bg, dim * 0.6)}"></div>
    <div class="m-wall" style="background:linear-gradient(90deg, ${css(bg, 0.6)} 0%, ${css(bg, 0.15)} 45%, transparent 75%)"></div>
    <div class="m-wall" style="background:linear-gradient(180deg, ${css(bg, 0.4)} 0%, transparent 22%, transparent 78%, ${css(bg, 0.6)} 100%)"></div>`;
}

const TABS = [["consoles", "Consoles", "gamepad"], ["games", "All games", "games"], ["recent", "Recent", "history"], ["fav", "Favorites", "heart"], ["spotlight", "Spotlight", "sparkle"], ["apps", "Apps", "apps"]];

function topBar(view, activeTab) {
  const showAll = view.screen.w >= 1200;
  return `<div class="m-topbar">
    <div class="m-tabs">${TABS.map(([id, label, ic]) => {
      const on = id === activeTab;
      return `<button class="m-tile m-pill m-tab ${on ? "on" : ""}" data-go="${id === "spotlight" ? "spotlight" : id === "consoles" ? "consoles" : id === "games" ? "games" : ""}" data-sfx="tab">
        ${icon(ic, 20)}${on || showAll ? `<span>${label}</span>` : ""}</button>`;
    }).join("")}</div>
    <button class="m-tile m-round" data-sfx="select">${icon("search", 22)}</button>
    <button class="m-tile m-round" data-go="settings" data-sfx="menu">${icon("settings", 22)}</button>
  </div>`;
}

function rail(activeTab) {
  const item = (id, ic, go) => `<button class="m-rail-item ${id === activeTab ? "on" : ""}" ${go ? `data-go="${go}"` : ""} data-sfx="tab">${icon(ic, 22)}</button>`;
  return `<nav class="m-rail">
    ${item("consoles", "gamepad", "consoles")}${item("games", "games", "games")}${item("recent", "history")}${item("fav", "heart")}${item("spotlight", "sparkle", "spotlight")}${item("apps", "apps")}
    <span style="flex:1"></span>${item("search", "search")}${item("settings", "settings", "settings")}
  </nav>`;
}

function hintBar() {
  const btn = (l, c, ink = "#fff") => `<span class="m-glyph" style="background:${c};color:${ink}">${l}</span>`;
  return `<div class="m-hints"><span>${btn("A", "#3DBE5B")}Open</span><span>${btn("B", "#E5484D")}Back</span><span>${btn("Y", "#F5C518", "#15171C")}Search</span></div>`;
}

function consolesScene(t, view, assets) {
  const ids = assets.consoleOrder();
  const cur = Math.max(0, ids.indexOf(view.system));
  const [id, name, maker, brand] = SYSTEM[ids[cur]];
  const tileH = Math.max(140, Math.min(300, Math.round((view.screen.h - 140) * 0.62)));
  const tileW = Math.round(tileH * 0.85);
  const tiles = ids.map((sid, i) => {
    const b = SYSTEM[sid][3];
    const on = i === cur;
    return `<button class="m-tile m-console ${on ? "sel" : "far"} ${on && view.focus ? "foc" : ""}" style="width:${tileW}px;height:${tileH}px" data-system="${sid}" data-sfx="move">
      <span class="m-console-tint" style="background:linear-gradient(180deg, ${css(b, on && view.focus ? 0.5 : 0.22)}, transparent)"></span>
      <span class="m-console-icon">${iconFor(t, sid, assets)}</span></button>`;
  }).join("");
  const shift = cur * (tileW + 4);
  return `<div class="m-hero">
      <div class="m-kicker" style="color:${brand}">${esc(maker.toUpperCase())}</div>
      <div class="m-hero-name">${esc(name)}</div>
      <div class="m-count">${icon("games", 14)}<span>${assets.count(id)}</span><span style="margin-left:10px">${cur + 1} / ${ids.length}</span></div>
    </div>
    <div class="m-wheel"><div class="m-wheel-track" style="left:50%;transform:translateX(-${shift + tileW / 2}px)">${tiles}</div></div>`;
}

function gamesScene(t, view, assets) {
  const sys = SYSTEM[view.system];
  const games = SAMPLE_GAMES;
  const g = games[view.game] || games[0];
  const local = view.game % 3 === 0;
  return `<div class="m-games-head">
      <div class="m-games-title">
        <span class="m-sysicon">${iconFor(t, sys[0], assets)}</span>
        <div><div class="m-title-l">${esc(sys[1])}</div><div class="m-label-m m-muted">${games.length} games</div></div>
      </div>
      <div class="m-switcher"><span class="m-seg on">${icon("list", 20)}<span>List</span></span><span class="m-seg">${icon("grid", 20)}</span><span class="m-seg">${icon("carousel", 20)}</span></div>
      <span class="m-chip">${icon("boxArt", 18)}<span>Box art</span></span>
      <span class="m-chip">${icon("sort", 18)}<span>Last played</span></span>
    </div>
    <div class="m-split">
      <div class="m-panel m-list">${games.map((x, i) => `
        <button class="m-tile m-row ${i === view.game ? (view.focus ? "foc" : "sel") : ""}" data-game="${i}" data-sfx="move">
          <span class="m-thumb">${art(x)}</span>
          <span class="m-row-text"><b>${esc(x.title)}</b><small>${esc(sys[1])}</small></span>
          ${i === 1 ? `<span style="color:#FF6B8A">${icon("heart", 16)}</span>` : ""}
          <span style="color:${i % 3 === 0 ? "var(--secondary)" : "var(--on-sv)"}">${icon(i % 3 === 0 ? "done" : "cloud", 16)}</span>
        </button>`).join("")}</div>
      <div class="m-panel m-stage">
        <div class="m-stage-media"><div class="m-media">${art(g, "shot")}</div><div class="m-box">${art(g)}</div></div>
        <div class="m-stage-meta"><span class="m-sysicon sm">${iconFor(t, sys[0], assets)}</span><span class="m-label-m m-muted">${esc(sys[1])}</span>
          ${statusPill(local)}</div>
        <div class="m-stage-title">${esc(g.title)}</div>
        <div class="m-info">${icon("calendar", 14)}${g.year}<span style="width:12px"></span>${icon("category", 14)}${esc(g.genre)}<span style="width:12px"></span><span style="color:#FFC23D;display:inline-flex;gap:4px;align-items:center">${icon("trophy", 14)}12 / 40</span></div>
        <div class="m-actions">${playButton(local)}<button class="m-tile m-round" data-sfx="favorite">${icon("heartOutline", 22)}</button><button class="m-tile m-round" data-go="game" data-sfx="select">${icon("info", 22)}</button></div>
      </div>
    </div>`;
}

function statusPill(ok) {
  const c = ok ? "#4FD18B" : "var(--tertiary)";
  return `<span class="m-status-pill" style="color:${c};background:color-mix(in srgb, ${c} 15%, transparent)">${icon(ok ? "checkCircle" : "errorOutline", 14)}${ok ? "On device" : "On storage"}</span>`;
}

function playButton(local, focused = false) {
  return `<button class="m-play ${focused ? "foc" : ""}" data-sfx="launch">${icon(local ? "play" : "download", 22)}<span>${local ? "Play" : "Get & play"}</span></button>`;
}

function gameScene(t, view, assets) {
  const sys = SYSTEM[view.system];
  const g = SAMPLE_GAMES[view.game] || SAMPLE_GAMES[0];
  const pill = (ic, text, color = "var(--on-sv)") => `<span class="m-info-pill" style="color:${color}">${icon(ic, 14)}${text}</span>`;
  return `<div class="m-game-art">${art(g, "shot")}</div>
    <button class="m-iconbtn" data-go="games" data-sfx="back">${icon("back", 24)}</button>
    <div class="m-game">
      <div class="m-cover">${art(g, "shot")}</div>
      <div class="m-game-col">
        <div class="m-headline">${esc(g.title)}</div>
        <div class="m-body-m m-muted">${esc(sys[1])} · ${g.year} · Mirmire Soft · ${esc(g.genre)} · ${g.players}</div>
        <div class="m-pills">${statusPill(true)}${pill("sd", "256 KB")}${pill("checkCircle", "Verified dump", "var(--primary)")}${pill("trophy", "12 / 40", "var(--tertiary)")}${pill("history", "3 h 20 min played")}</div>
        <div class="m-actions">${playButton(true, view.focus)}<button class="m-tile m-action" data-sfx="select">${icon("cloudUpload", 20)}<span>Offload</span></button></div>
        <div class="m-actions"><button class="m-tile m-round" data-sfx="favorite">${icon("heartOutline", 22)}</button><button class="m-tile m-round" data-sfx="favorite">${icon("pin", 22)}</button><button class="m-tile m-round" data-sfx="select">${icon("refresh", 22)}</button>
          <button class="m-tile m-action" data-sfx="select">${icon("gamepad", 20)}<span>Default emulator</span></button><button class="m-tile m-round" data-sfx="select">${icon("tune", 22)}</button></div>
      </div>
    </div>`;
}

function sectionHeader(t, text) {
  const hs = t.style.headerStyle;
  return `<div class="m-section ${hs === "UNDERLINED" ? "under" : ""}">${esc(hs === "BOLD_CAPS" ? text.toUpperCase() : text)}</div>`;
}

function spotlightScene(t, view, assets) {
  const card = (g, i) => `<button class="m-tile m-card ${i === view.game && view.focus ? "foc" : ""}" data-game="${i}" data-sfx="move">
      <span class="m-card-art">${art(g)}</span><span class="m-card-foot"><b>${esc(g.title)}</b><small>${esc(SYSTEM[["snes", "nes", "n64", "megadrive", "gba", "psx"][i]][1])}</small></span></button>`;
  return `<div class="m-spot">
    <div class="m-weekly">
      <span class="m-weekly-badge">${icon("trophy", 30)}</span>
      <div style="min-width:0"><div class="m-kicker" style="color:var(--tertiary)">${icon("trophy", 14)} ACHIEVEMENT OF THE WEEK</div>
        <div class="m-title-l">Speed Run · 10 points</div><div class="m-body-s m-muted">Pixel Knights · Super Nintendo · 312 of 5,120 players have it</div></div>
      <span class="m-body-s m-muted" style="margin-left:auto">In your library</span>
    </div>
    ${sectionHeader(t, "Close to mastery")}
    <div class="m-shelf">${SAMPLE_GAMES.map(card).join("")}</div>
    ${sectionHeader(t, "Play together")}
    <div class="m-shelf">${SAMPLE_GAMES.slice().reverse().map(card).join("")}</div>
  </div>`;
}

const SETTINGS_CATS = [["Trophies", "trophy"], ["Artwork", "image"], ["Look", "palette"], ["Layout", "dashboard"], ["Controls", "gamepad"], ["Storage", "sd"], ["Profiles", "people"]];

function settingsScene(t, view) {
  const sw = (on) => `<span class="m-switch ${on ? "on" : ""}"><span>${on ? icon("done", 14) : ""}</span></span>`;
  const row = (ic, title, sub, trail = "", i = 0) => `<button class="m-tile m-setrow ${view.row === i ? (view.focus ? "foc" : "") : ""}" data-row="${i}" data-sfx="select">
      <span class="m-rowicon">${icon(ic, 22)}</span><span class="m-row-text"><b class="m-title-s">${title}</b>${sub ? `<small class="m-body-s m-muted">${sub}</small>` : ""}</span>${trail}</button>`;
  return `<div class="m-settings">
    <div class="m-setrail">
      <div class="m-sethead"><button class="m-tile m-round" data-go="consoles" data-sfx="back">${icon("back", 22)}</button><span class="m-headline-s">Settings</span></div>
      ${SETTINGS_CATS.map(([n, ic], i) => `<button class="m-tile m-cat ${i === 2 ? "sel" : ""}" data-sfx="tab"><span style="color:${i === 2 ? "var(--primary)" : "var(--on-sv)"}">${icon(ic, 24)}</span><span>${n}</span></button>`).join("")}
    </div>
    <div class="m-pane">
      <div class="m-panetitle"><span style="color:var(--primary)">${icon("palette", 30)}</span><div><div class="m-headline-s">Look</div><div class="m-body-m m-muted">Theme, colors and sounds</div></div></div>
      <div class="m-group">Theme</div>
      ${row("palette", esc(t.name || "Your theme"), "Installed theme pack", `<span class="m-status-pill" style="color:#4FD18B;background:color-mix(in srgb,#4FD18B 15%,transparent)">${icon("checkCircle", 14)}In use</span>`, 0)}
      ${row("image", "Theme backgrounds", "Video when the theme has one, otherwise the image", sw(true), 1)}
      <div class="m-group">Sounds &amp; music</div>
      ${row("volume", "Navigation sounds", "Feedback for touch, controller and keyboard. Uses device media volume.", sw(true), 2)}
      ${row("music", "Theme music", "This theme's loop. Pauses while a game or preview is playing", sw(false), 3)}
      <div class="m-actions"><button class="m-tile m-action primary" data-sfx="select">${icon("add", 20)}<span>Import ZIP</span></button><button class="m-tile m-action" data-sfx="select">${icon("sync", 20)}<span>Get more themes</span></button></div>
    </div>
  </div>`;
}

/**
 * view: { scene, system, game, row, focus, screen, rail }
 * assets: { icon(id), backdrop(id|null) → {url, video}, count(id), consoleOrder() }
 */
export function render(theme, view, assets, fontFamily) {
  const c = resolveColors(theme);
  const t = { ...theme, c };
  const useRail = view.rail;
  const scene = view.scene;
  const tab = scene === "consoles" ? "consoles" : scene === "spotlight" ? "spotlight" : "games";
  let body;
  if (scene === "consoles") body = consolesScene(t, view, assets);
  else if (scene === "games") body = gamesScene(t, view, assets);
  else if (scene === "game") body = gameScene(t, view, assets);
  else if (scene === "spotlight") body = spotlightScene(t, view, assets);
  else body = settingsScene(t, view);
  const chrome = scene === "consoles" || scene === "games" || scene === "spotlight";
  const cut = theme.style.cardKind === "cut" ? "cut" : "";
  return `<div class="mock ${cut} ${useRail && chrome ? "with-rail" : ""} scene-${scene}" style="${cssVars(theme, c)};font-family:${fontStack(theme, fontFamily)};width:${view.screen.w}px;height:${view.screen.h}px;background:${c.background};color:${c.onSurface}">
    ${scene === "game" ? "" : backdrop(t, assets, view.system, scene)}
    ${useRail && chrome ? rail(tab) : ""}
    <div class="m-content">
      ${statusBar()}
      ${chrome && !useRail ? topBar(view, tab) : ""}
      <div class="m-body">${body}</div>
    </div>
    ${view.hints ? hintBar() : ""}
  </div>`;
}
