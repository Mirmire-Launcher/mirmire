# Mirmire theme packs

This is the file format reference. For a walkthrough, see [Make your own themes and icon packs](CREATING.md), or design a pack in **[Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/)**.

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
    "music": ["music/loop.ogg"],
    "secondScreenWallpaper": "second-screen/wallpaper.png"
  },
  "secondScreen": { "background": "art", "dim": 0.45, "idle": "clock" }
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
| `lights`, `lightsRight` | Stick lights on Retroid and AYN handhelds (left, right). Omit `lightsRight` to use one color. Without them, the lights follow `primary` |

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
| `tiles` | object, see below | A soft repeating pattern behind everything, used when the theme has no wallpaper. |
| `focus` | `outline`, `corners` or `frame` | How the selected tile is marked: the usual outline, corner brackets, or a thick frame. Default `outline`. |
| `focusColor` | color | Color of that mark. Defaults to `primary`. |
| `bezel` | `true` / `false` | Plain cards in the surface color with a soft shadow; console icons fill the card and game art sits inset, like apps on a handheld's home menu. |

### Tiles

A light, handheld-menu-style backdrop without an image file. Pearl Console (stripes) and Sky Console (blocks) use it.

```json
"tiles": { "kind": "blocks", "base": "#EDF1F5", "ink": "#E2E8EE", "size": 34, "glow": "#2600A9E0" }
```

| Field | Notes |
| --- | --- |
| `kind` | `grid`, `stripes`, `dots` or `blocks` |
| `base` | The background color. Defaults to the theme's `background` |
| `ink` | The pattern's color. Keep it close to `base` so text stays readable |
| `size` | Size of one step of the pattern, 8–160 dp. Default 28 |
| `glow` | Optional soft light from the top, usually your accent with some transparency (`#AARRGGBB`) |

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

## Second screen

For handhelds with two screens (AYN Thor, AYANEO Pocket DS, a Retroid with the Dual Screen add-on), where Mirmire shows the selected game's details or the player's widgets on the second screen. All of it is optional.

| Key | Values | Default |
| --- | --- | --- |
| `assets.secondScreenWallpaper` | An image or a video for the second screen. 1240×1080 suits the AYN Thor and the Retroid add-on; it's cropped to fill other sizes. Under 4 MB for an image, 8–30 s and under 30 MB for a video. | The main wallpaper |
| `assets.secondScreenWallpaperVideo` | A video, when you ship both | |
| `secondScreen.background` | What's behind a game's details: `art` (the game's screenshot, blurred), `console` (this theme's backdrop for the game's console, or the game's art when there's none) or `wallpaper` (nothing over the wallpaper) | `art` |
| `secondScreen.dim` | How much the wallpaper is darkened, `0` to `0.9` | `0.45` |
| `secondScreen.idle` | When nothing is selected: `clock` (the clock and the Continue card) or `art` (just the wallpaper, for a picture made for the second screen) | `clock` |

The second-screen wallpaper is used when the player has their background set to the theme's. Theme Studio's **Dual screen** preview shows both screens.

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
second-screen/wallpaper.png
```

ZIP the **contents** of the folder, not the folder itself, so `theme.json` is at the archive root. 
