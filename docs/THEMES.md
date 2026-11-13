# Mirmire theme packs

A theme is a ZIP whose **root** contains `theme.json`. Open **Settings › Look › Import ZIP** in the app to install one. Importing the same `id` replaces that pack.

`version` is the schema version and must be `1`. IDs are 1–64 characters: lowercase letters, digits, hyphens or underscores, starting with a letter or digit. Unknown JSON keys are ignored.

The app accepts at most **1024 files** and **1 GB** uncompressed. Stay well under that: videos dominate the size.

## `theme.json`

```json
{
  "id": "neon-rider",
  "name": "Neon Rider",
  "author": "you",
  "version": 1,
  "dark": true,
  "colors": { "primary": "#00F0FF", "background": "#05060F" },
  "style": {
    "cardShape": "cut:12",
    "cardBorder": "#5500F0FF",
    "borderWidth": 1,
    "focusedBorderWidth": 2,
    "font": "monospace",
    "headerStyle": "BOLD_CAPS",
    "navigation": "rail"
  },
  "assets": {
    "wallpaper": "wallpaper.png",
    "wallpaperVideo": "wallpaper.mp4",
    "systemIcons": { "snes": "icons/snes.png" },
    "systemBackgrounds": { "snes": "backgrounds/snes.png" },
    "systemBackgroundVideos": { "snes": "backgrounds/snes.mp4" },
    "sounds": { "move": "sounds/move.wav", "button_x": "sounds/button_x.wav" },
    "music": ["music/loop.ogg"]
  }
}
```

Paths must stay inside the pack (no `..`, no absolute paths). You can omit the maps and drop files into the folders below — Mirmire picks them up by name.

## Colors

`#RRGGBB` or `#AARRGGBB`. Omitted keys use Material defaults for `dark`.

| Key | Where it shows |
| --- | --- |
| `primary`, `onPrimary` | Buttons, focus, selected chips |
| `primaryContainer`, `onPrimaryContainer` | Filled selection, Play |
| `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer` | Accents |
| `tertiary`, `onTertiary` | Achievements, extra highlights |
| `background`, `onBackground` | Screen behind cards |
| `surface`, `onSurface` | Cards and panels |
| `surfaceVariant`, `onSurfaceVariant` | Subtitles, muted rows |
| `surfaceContainer`, `surfaceContainerHigh` | Rows, docks |
| `outline` | Borders |
| `error` | Warnings |

## Style

| Field | Values | Notes |
| --- | --- | --- |
| `cardShape` | `rounded:16` or `cut:10` | Size 0–48 dp. `rounded` / `cut` alone use 12 dp. |
| `cardBorder` | color | Omit for no border. |
| `borderWidth` | 0–8 | dp |
| `focusedBorderWidth` | 1–8 | Controller / keyboard outline. Default 3. |
| `font` | `monospace`, `sans`, `serif`, `cursive`, `file:fonts/Custom.ttf` | TTF or OTF, licensed for distribution. Prefer under 2 MB. |
| `headerStyle` | `PLAIN`, `BOLD_CAPS`, `UNDERLINED` | Section titles. |
| `navigation` | `rail` / `side` or `top` | Home menu this theme is designed for. Users can override it in Layout. |

## Wallpaper

Shown on Settings and every screen that is not a console page.

| | Image | Video |
| --- | --- | --- |
| Keys / files | `assets.wallpaper`, or a still named in that field | `assets.wallpaperVideo`, or a video path in `wallpaper` |
| Types | PNG, WebP, JPEG | MP4, WebM, MKV, M4V |
| Size | 1920×1080 (1280×720 minimum) | Same. H.264 + AAC in MP4 is the most compatible. |
| File size | Under 4 MB | 8–30 s seamless loop, under 40 MB |
| Notes | A dim overlay keeps text readable. | Plays muted on a loop. Pauses while a game is running. |

A pack can ship both. The user picks **Video** or **Image** in Look.

## Console icons

Drop images in `icons/` named for the system (`snes.png`, `SFC.png`, `MD.png`, `PS.png`…). GarlicOS, MinUI, muOS and ES-DE names all match. Or list them in `assets.systemIcons`.

| | |
| --- | --- |
| Types | PNG, WebP, JPEG |
| Size | 256×256 or 512×512, transparency, centered |
| File size | Under 200 KB each |
| Missing | Mirmire silhouettes |

## Console backgrounds

Drop files in `backgrounds/` (or a copied ES-DE `default-backgrounds` folder) using the same names. Videos (`snes.mp4`) loop instead of the still. You can also list them in `assets.systemBackgrounds` / `systemBackgroundVideos`.

| | Image | Video |
| --- | --- | --- |
| Types | PNG, WebP, JPEG | MP4, WebM, MKV, M4V |
| Size | 1920×1080 or 1280×720 | Same, 8–20 s loop |
| File size | Under 2 MB | Under 20 MB each |
| Missing | The theme wallpaper, then Mirmire’s |

Layout → Console backgrounds turns the set on or off. Look → Theme backgrounds picks video vs image when both exist.

## Sounds

Put clips in `sounds/` named for the action, or list them in `assets.sounds`. ES-DE names (`scroll`, `systembrowse`, `quicksysselect`) work.

Types: WAV, OGG, Opus, MP3, M4A, AAC, FLAC. Prefer short WAV or OGG. Under 200 KB and under 400 ms, except `launch` (up to 1 s).

| File stem | Plays when |
| --- | --- |
| `move` (`navigate`, `scroll`, `systembrowse`) | D-pad / stick between tiles |
| `select` (`confirm`) | A / Enter |
| `back` (`cancel`) | B / Back |
| `tab` (`quicksysselect`, `switch`) | L1 / R1 (and L2 / R2) changing tabs |
| `menu` (`open`) | Start opening Settings |
| `favorite` (`favourite`) | Favorite / pin |
| `launch` (`play`) | Play |
| `edge` (`bump`) | D-pad against the end of a list |
| `button_a` … `button_select` | That physical button, instead of the action above |

A theme with no sounds uses Mirmire’s. Look has an on/off and a volume. Touch Play / Favorite still use `launch` / `favorite`.

## Music

Audio files in `music/`, or `assets.music` as a list of paths. Several tracks shuffle and loop while the app is in front. Pauses for a game, a video preview with sound, or when the app is backgrounded.

Types: OGG, Opus, MP3, WAV, M4A, AAC, FLAC. Prefer OGG/Opus, 15–90 s loop, under 8 MB each. Look has an on/off (off by default) and a volume. A theme with no music uses Mirmire’s loop when music is on.

## System IDs and file names

`atari2600` (2600, atari), `atari7800` (7800), `atarilynx` (lynx), `nes` (fc, famicom), `snes` (sfc, superfamicom), `n64`, `gb` (gameboy), `gbc` (gameboycolor), `gba` (gameboyadvance), `mastersystem` (ms, sms), `megadrive` (md, genesis), `gamegear` (gg), `sega32x` (32x), `segacd` (megacd), `saturn`, `pcengine` (pce, tg16), `pcenginecd` (pcecd, tg16cd), `ngp`, `ngpc`, `wonderswan` (ws), `wonderswancolor` (wsc), `psx` (ps, ps1, playstation), `dreamcast` (dc), `nds` (ds), `psp`, `ps2` (playstation2), `gc` (gamecube), `wii`, `n3ds` (3ds), `psvita` (vita), `wiiu`, `switch` (nsw).

## Layout of a pack

```
theme.json
wallpaper.png
wallpaper.mp4
fonts/Custom.ttf
icons/snes.png
backgrounds/snes.png
backgrounds/snes.mp4
sounds/move.wav
sounds/select.wav
sounds/back.wav
music/loop.ogg
```

ZIP the **contents** of the folder, not the folder itself, so `theme.json` is at the archive root. A sample lives in `themes/neon-pocket`.
