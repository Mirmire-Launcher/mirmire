// Color math: parsing, contrast, and building a whole theme palette from one color or a picture.

export function parse(hex) {
  let h = String(hex || "").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (/^[0-9a-f]{6}$/i.test(h)) h = "FF" + h;
  if (!/^[0-9a-f]{8}$/i.test(h)) return null;
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { a: n(0) / 255, r: n(2), g: n(4), b: n(6) };
}

export const valid = (hex) => parse(hex) !== null;

const two = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0").toUpperCase();

export function hex({ r, g, b, a = 1 }) {
  return a >= 0.999 ? `#${two(r)}${two(g)}${two(b)}` : `#${two(a * 255)}${two(r)}${two(g)}${two(b)}`;
}

/** CSS color for a theme hex, including #AARRGGBB. */
export function css(value, alpha = 1) {
  const c = parse(value);
  if (!c) return "transparent";
  return `rgba(${c.r},${c.g},${c.b},${+(c.a * alpha).toFixed(3)})`;
}

/** #RRGGBB for <input type=color>. */
export function rgbOnly(value) {
  const c = parse(value);
  return c ? hex({ ...c, a: 1 }).toLowerCase() : "#000000";
}

export function toHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

export function fromHsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  if (s === 0) return hex({ r: l * 255, g: l * 255, b: l * 255 });
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return hex({ r: f(h + 1 / 3) * 255, g: f(h) * 255, b: f(h - 1 / 3) * 255 });
}

function luminance(value) {
  const c = parse(value);
  if (!c) return 0;
  const ch = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

export function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Black-ish or white-ish text, whichever reads better on [bg]. */
export function inkOn(bg, h = 0) {
  return contrast(bg, "#FFFFFF") >= contrast(bg, "#000000") ? fromHsl(h, 0.2, 0.97) : fromHsl(h, 0.35, 0.1);
}

/** Mix two colors; t = 0 gives a, 1 gives b. */
export function mix(a, b, t) {
  const x = parse(a), y = parse(b);
  if (!x || !y) return a;
  return hex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
}

export const MOODS = {
  deep: { label: "Deep", bgSat: 0.45, bgL: 0.075, accentL: 0.72, accentS: 1 },
  vivid: { label: "Vivid", bgSat: 0.7, bgL: 0.1, accentL: 0.62, accentS: 1.15 },
  soft: { label: "Soft", bgSat: 0.25, bgL: 0.13, accentL: 0.8, accentS: 0.7 },
  black: { label: "Pure black", bgSat: 0, bgL: 0, accentL: 0.7, accentS: 1 },
};

/**
 * A full Mirmire palette from one accent color. [harmony] picks the second accent:
 * "analogous" (a near hue), "complement" (the opposite) or "triad".
 */
export function generate(seed, { dark = true, mood = "deep", harmony = "analogous" } = {}) {
  const c = parse(seed) || parse("#7C9CFF");
  const { h, s } = toHsl(c);
  const sat = Math.max(0.35, s);
  const m = MOODS[mood] || MOODS.deep;
  const second = h + (harmony === "complement" ? 180 : harmony === "triad" ? 120 : 35);
  const third = h + (harmony === "triad" ? 240 : harmony === "complement" ? 30 : -50);
  if (dark) {
    const bgS = Math.min(0.6, sat * m.bgSat);
    const L = m.bgL;
    const primary = fromHsl(h, Math.min(1, sat * m.accentS), m.accentL);
    return {
      primary,
      onPrimary: fromHsl(h, Math.min(1, sat), 0.12),
      primaryContainer: fromHsl(h, sat * 0.5, 0.26),
      onPrimaryContainer: fromHsl(h, sat * 0.8, 0.92),
      secondary: fromHsl(second, sat * 0.65, 0.74),
      onSecondary: fromHsl(second, sat * 0.6, 0.13),
      secondaryContainer: fromHsl(second, sat * 0.35, 0.25),
      onSecondaryContainer: fromHsl(second, sat * 0.6, 0.91),
      tertiary: fromHsl(third, sat * 0.6, 0.76),
      onTertiary: fromHsl(third, sat * 0.5, 0.14),
      background: fromHsl(h, bgS, L),
      onBackground: fromHsl(h, 0.3, 0.95),
      surface: fromHsl(h, bgS, L + 0.045),
      onSurface: fromHsl(h, 0.3, 0.95),
      surfaceVariant: fromHsl(h, bgS * 0.8, L + 0.14),
      onSurfaceVariant: fromHsl(h, 0.18, 0.8),
      surfaceContainer: fromHsl(h, bgS, L + 0.07),
      surfaceContainerHigh: fromHsl(h, bgS * 0.9, L + 0.12),
      outline: fromHsl(h, 0.15, 0.55),
      error: "#FFB4AB",
    };
  }
  const bgS = Math.min(0.5, sat * 0.35);
  return {
    primary: fromHsl(h, Math.min(1, sat * 0.95), 0.4),
    onPrimary: "#FFFFFF",
    primaryContainer: fromHsl(h, sat * 0.8, 0.88),
    onPrimaryContainer: fromHsl(h, sat, 0.12),
    secondary: fromHsl(second, sat * 0.7, 0.36),
    onSecondary: "#FFFFFF",
    secondaryContainer: fromHsl(second, sat * 0.6, 0.88),
    onSecondaryContainer: fromHsl(second, sat * 0.7, 0.12),
    tertiary: fromHsl(third, sat * 0.7, 0.38),
    onTertiary: "#FFFFFF",
    background: fromHsl(h, bgS, 0.97),
    onBackground: fromHsl(h, 0.25, 0.1),
    surface: fromHsl(h, bgS, 0.95),
    onSurface: fromHsl(h, 0.25, 0.1),
    surfaceVariant: fromHsl(h, bgS * 0.9, 0.88),
    onSurfaceVariant: fromHsl(h, 0.18, 0.3),
    surfaceContainer: fromHsl(h, bgS, 0.92),
    surfaceContainerHigh: fromHsl(h, bgS, 0.89),
    outline: fromHsl(h, 0.12, 0.5),
    error: "#B3261E",
  };
}

/** The most colorful and the most common dark tone of a picture, for palette building. */
export async function fromImage(url) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await img.decode();
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  const px = ctx.getImageData(0, 0, size, size).data;
  const buckets = new Map();
  for (let i = 0; i < px.length; i += 4) {
    const { h, s, l } = toHsl({ r: px[i], g: px[i + 1], b: px[i + 2] });
    if (l < 0.12 || l > 0.92 || s < 0.25) continue;
    const key = Math.round(h / 15) % 24;
    const b = buckets.get(key) || { n: 0, score: 0, r: 0, g: 0, b: 0 };
    const w = s * (1 - Math.abs(l - 0.55));
    b.n++; b.score += w; b.r += px[i] * w; b.g += px[i + 1] * w; b.b += px[i + 2] * w;
    buckets.set(key, b);
  }
  const ranked = [...buckets.values()].filter((b) => b.score > 0).sort((a, b) => b.score - a.score);
  const avg = (b) => hex({ r: b.r / b.score, g: b.g / b.score, b: b.b / b.score });
  const seeds = ranked.slice(0, 5).map(avg);
  return seeds.length ? seeds : ["#7C9CFF"];
}

export function randomSeed() {
  return fromHsl(Math.random() * 360, 0.65 + Math.random() * 0.3, 0.55 + Math.random() * 0.15);
}
