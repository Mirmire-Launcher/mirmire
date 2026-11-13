// What a Mirmire theme or icon pack can hold. Mirrors ThemePack.kt and IconPackRepository.kt in the app.

export const IMAGES = ["png", "webp", "jpg", "jpeg"];
export const VIDEOS = ["mp4", "webm", "mkv", "m4v"];
export const AUDIO = ["wav", "ogg", "opus", "mp3", "m4a", "aac", "flac"];
export const FONTS = ["ttf", "otf"];
export const MAX_FILES = 1024;
export const MAX_BYTES = 1024 * 1024 * 1024;
export const ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;

// [id, name, maker, maker color, aliases the app matches by file name]
export const SYSTEMS = [
  ["nes", "Nintendo Entertainment System", "Nintendo", "#E4000F", ["nes", "fc", "famicom"]],
  ["snes", "Super Nintendo", "Nintendo", "#E4000F", ["snes", "sfc", "superfamicom"]],
  ["n64", "Nintendo 64", "Nintendo", "#E4000F", ["n64"]],
  ["gb", "Game Boy", "Nintendo", "#E4000F", ["gb", "gameboy"]],
  ["gbc", "Game Boy Color", "Nintendo", "#E4000F", ["gbc", "gameboycolor"]],
  ["gba", "Game Boy Advance", "Nintendo", "#E4000F", ["gba", "gameboyadvance"]],
  ["nds", "Nintendo DS", "Nintendo", "#E4000F", ["nds", "ds"]],
  ["n3ds", "Nintendo 3DS", "Nintendo", "#E4000F", ["n3ds", "3ds"]],
  ["gc", "GameCube", "Nintendo", "#E4000F", ["gc", "gamecube"]],
  ["wii", "Wii", "Nintendo", "#E4000F", ["wii"]],
  ["wiiu", "Wii U", "Nintendo", "#E4000F", ["wiiu"]],
  ["switch", "Nintendo Switch", "Nintendo", "#E4000F", ["switch", "nsw"]],
  ["mastersystem", "Master System", "Sega", "#1E6FD9", ["mastersystem", "ms", "sms"]],
  ["megadrive", "Mega Drive / Genesis", "Sega", "#1E6FD9", ["megadrive", "md", "genesis"]],
  ["gamegear", "Game Gear", "Sega", "#1E6FD9", ["gamegear", "gg"]],
  ["sega32x", "Sega 32X", "Sega", "#1E6FD9", ["sega32x", "32x"]],
  ["segacd", "Sega CD", "Sega", "#1E6FD9", ["segacd", "megacd"]],
  ["saturn", "Saturn", "Sega", "#1E6FD9", ["saturn"]],
  ["dreamcast", "Dreamcast", "Sega", "#1E6FD9", ["dreamcast", "dc"]],
  ["psx", "PlayStation", "Sony", "#8E9BB5", ["psx", "ps", "ps1", "playstation"]],
  ["ps2", "PlayStation 2", "Sony", "#8E9BB5", ["ps2", "playstation2"]],
  ["psp", "PSP", "Sony", "#8E9BB5", ["psp"]],
  ["psvita", "PlayStation Vita", "Sony", "#8E9BB5", ["psvita", "vita"]],
  ["atari2600", "Atari 2600", "Atari", "#F26B21", ["atari2600", "2600", "atari"]],
  ["atari7800", "Atari 7800", "Atari", "#F26B21", ["atari7800", "7800"]],
  ["atarilynx", "Atari Lynx", "Atari", "#F26B21", ["atarilynx", "lynx"]],
  ["pcengine", "PC Engine / TurboGrafx-16", "NEC", "#FF8A00", ["pcengine", "pce", "tg16"]],
  ["pcenginecd", "PC Engine CD", "NEC", "#FF8A00", ["pcenginecd", "pcecd", "tg16cd"]],
  ["ngp", "Neo Geo Pocket", "SNK", "#D4AF37", ["ngp"]],
  ["ngpc", "Neo Geo Pocket Color", "SNK", "#D4AF37", ["ngpc"]],
  ["wonderswan", "WonderSwan", "Bandai", "#9B59D0", ["wonderswan", "ws"]],
  ["wonderswancolor", "WonderSwan Color", "Bandai", "#9B59D0", ["wonderswancolor", "wsc"]],
];
export const SYSTEM = Object.fromEntries(SYSTEMS.map((s) => [s[0], s]));

// Color keys in theme.json, grouped the way the editor shows them.
export const COLOR_GROUPS = [
  ["Accent", [
    ["primary", "Buttons, focus, selected tabs"],
    ["onPrimary", "Text on primary"],
    ["primaryContainer", "Selected rows, filled selection"],
    ["onPrimaryContainer", "Text on that"],
  ]],
  ["Second accents", [
    ["secondary", "Second accent"],
    ["onSecondary", "Text on secondary"],
    ["secondaryContainer", "Secondary fills"],
    ["onSecondaryContainer", "Text on that"],
    ["tertiary", "Achievements, highlights"],
    ["onTertiary", "Text on tertiary"],
  ]],
  ["Backdrop and cards", [
    ["background", "Behind everything"],
    ["onBackground", "Big titles"],
    ["surface", "Cards and panels"],
    ["onSurface", "Text on cards"],
    ["surfaceVariant", "Icon tiles, chips"],
    ["onSurfaceVariant", "Subtitles"],
    ["surfaceContainer", "Rows and docks"],
    ["surfaceContainerHigh", "Raised rows"],
    ["outline", "Borders and dividers"],
    ["error", "Warnings"],
  ]],
  ["Stick lights", [
    ["lights", "Left stick (or both)"],
    ["lightsRight", "Right stick"],
  ]],
];
export const COLOR_KEYS = COLOR_GROUPS.flatMap(([, keys]) => keys.map(([k]) => k));

// Material 3 baseline, used by the app for any color a theme leaves out.
export const MATERIAL = {
  dark: {
    primary: "#D0BCFF", onPrimary: "#381E72", primaryContainer: "#4F378B", onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC", onSecondary: "#332D41", secondaryContainer: "#4A4458", onSecondaryContainer: "#E8DEF8",
    tertiary: "#EFB8C8", onTertiary: "#492532", background: "#141218", onBackground: "#E6E0E9",
    surface: "#141218", onSurface: "#E6E0E9", surfaceVariant: "#49454F", onSurfaceVariant: "#CAC4D0",
    surfaceContainer: "#211F26", surfaceContainerHigh: "#2B2930", outline: "#938F99", error: "#F2B8B5",
  },
  light: {
    primary: "#6750A4", onPrimary: "#FFFFFF", primaryContainer: "#EADDFF", onPrimaryContainer: "#21005D",
    secondary: "#625B71", onSecondary: "#FFFFFF", secondaryContainer: "#E8DEF8", onSecondaryContainer: "#1D192B",
    tertiary: "#7D5260", onTertiary: "#FFFFFF", background: "#FEF7FF", onBackground: "#1D1B20",
    surface: "#FEF7FF", onSurface: "#1D1B20", surfaceVariant: "#E7E0EC", onSurfaceVariant: "#49454F",
    surfaceContainer: "#F3EDF7", surfaceContainerHigh: "#ECE6F0", outline: "#79747E", error: "#B3261E",
  },
};

// [key, label, when it plays, max seconds]
export const SOUNDS = [
  ["move", "Move", "D-pad or stick between tiles", 0.4],
  ["select", "Select", "A or Enter", 0.4],
  ["back", "Back", "B or Back", 0.4],
  ["tab", "Tab", "L1 / R1 changing tabs", 0.4],
  ["menu", "Menu", "Start opening Settings", 0.4],
  ["favorite", "Favorite", "Favorite or pin", 0.4],
  ["launch", "Launch", "Play", 1],
  ["edge", "Edge", "D-pad against the end of a list", 0.4],
];
export const BUTTON_SOUNDS = [
  ["button_a", "A"], ["button_b", "B"], ["button_x", "X"], ["button_y", "Y"],
  ["button_l1", "L1"], ["button_r1", "R1"], ["button_l2", "L2"], ["button_r2", "R2"],
  ["button_start", "Start"], ["button_select", "Select"],
];
// Other names the app accepts for each action sound (ES-DE and friends).
export const SOUND_ALIASES = {
  move: ["move", "navigate", "scroll", "systembrowse"],
  select: ["select", "confirm"],
  back: ["back", "cancel"],
  tab: ["tab", "quicksysselect", "switch"],
  menu: ["menu", "open"],
  favorite: ["favorite", "favourite"],
  launch: ["launch", "play"],
  edge: ["edge", "bump"],
};

// Recommended limits from THEMES.md. Over these the maker warns; the app still imports.
export const LIMITS = {
  wallpaper: { kind: "image", maxBytes: 4 << 20, minW: 1280, minH: 720 },
  wallpaperVideo: { kind: "video", maxBytes: 40 << 20, minSec: 8, maxSec: 30 },
  font: { kind: "font", maxBytes: 2 << 20 },
  icon: { kind: "image", maxBytes: 200 << 10, minW: 128, minH: 128 },
  background: { kind: "image", maxBytes: 2 << 20, minW: 1280, minH: 720 },
  backgroundVideo: { kind: "video", maxBytes: 20 << 20, minSec: 8, maxSec: 20 },
  sound: { kind: "audio", maxBytes: 200 << 10 },
  music: { kind: "audio", maxBytes: 8 << 20, maxSec: 120 },
};

// Sample library for the preview: freely licensed homebrew games (credits in assets/games/CREDITS.md).
const g = (id) => ({ box: `assets/games/${id}-cover.jpg`, shot: `assets/games/${id}-shot.png` });
export const SAMPLE_GAMES = [
  { title: "Tobu Tobu Girl Deluxe", system: "gbc", dev: "Tangram Games", year: null, genre: "Platform", players: "1 player", hue: 340, ...g("tobu") },
  { title: "µCity", system: "gbc", dev: "Antonio Niño Díaz", year: 2017, genre: "City building", players: "1 player", hue: 140, ...g("ucity") },
  { title: "Butano Fighter", system: "gba", dev: "GValiente", year: null, genre: "Shooter", players: "1 player", hue: 10, ...g("butano") },
  { title: "Libbet and the Magic Floor", system: "gb", dev: "Damian Yerrick", year: 2018, genre: "Puzzle", players: "1 player", hue: 245, ...g("libbet") },
  { title: "Thwaite", system: "nes", dev: "Damian Yerrick", year: 2011, genre: "Action", players: "2 players", hue: 220, ...g("thwaite") },
  { title: "Concentration Room", system: "nes", dev: "Damian Yerrick", year: 2010, genre: "Puzzle", players: "2 players", hue: 55, ...g("croom") },
];
