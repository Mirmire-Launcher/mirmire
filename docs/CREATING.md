# Make your own themes and icon packs

Mirmire can wear two kinds of packs, and you can make both:

- A **theme** changes the whole look: colors, card shapes, font, wallpaper, console icons and backdrops, sounds and music.
- An **icon pack** changes only the console icons, and works with any theme.

Theme Studio also makes **widget plugins** for the Home page: see [Make widget plugins](PLUGINS.md).

Both are ZIP files you import in the app. The easiest way to make one is **[Mirmire Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/)**. It runs in your browser and shows your pack on Mirmire's real screens as you go. You can also build a pack by hand; [THEMES.md](THEMES.md) has the full file format.

## Quick start with Theme Studio

1. Open **[Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/)** on a computer.
2. Choose a starting point:
   - **New theme** builds a palette from one color.
   - **New icon pack** starts an empty set of console icons.
   - **New widget plugin** starts a Home page widget from a template ([more](PLUGINS.md)).
   - **Remix** starts from one of Mirmire's own themes.
   - **Open a ZIP** edits a pack you already have.
3. Work through the sections on the left. The preview updates as you go:
   - Use the tabs above the preview to switch between Consoles, Games, a game's page, Spotlight and Settings.
   - Click the preview, then use the arrow keys, **Enter** and **Esc** to move around as a controller would. You'll hear your sounds.
   - Turn on **Pick**, then click anything in the preview to jump to its color.
4. Open **Export** and press **Download ZIP**.
5. Copy the ZIP to your device and import it in Mirmire:
   - a theme: **Settings › Look › Import ZIP**;
   - an icon pack: **Settings › Look › Console icons › Import icon pack**.

Nothing you add leaves your browser, and your work is saved there as you go. Drop a whole folder onto the page and files are sorted by name: `snes.png` becomes the Super Nintendo icon, `sounds/move.wav` becomes the move sound, and so on.

## Making a theme

### Colors

Each color has a job, and the same job everywhere in the app:

| Color | Where you'll see it |
|---|---|
| `primary` | Selected tab, focus outline, Play button, switches, section labels |
| `onPrimary` | Text and icons on primary |
| `primaryContainer` | The selected row, console or setting |
| `background` | Behind everything, and the tint over wallpapers |
| `onBackground` | Big titles such as console and game names |
| `surface` | Panels and the side menu |
| `onSurface` | Most text |
| `surfaceContainer`, `surfaceContainerHigh` | Rows, buttons and focused cards |
| `onSurfaceVariant` | Subtitles and small details |
| `tertiary` | Achievements and "On storage" |
| `secondary` | Downloaded games and battery details |
| `outline` | Borders when the theme has no card border |
| `lights`, `lightsRight` | Stick lights on Retroid and AYN handhelds |

Tips:

- **Start from one color.** Theme Studio's **Build palette** fills in all the roles from your main color. Then adjust the ones you care about.
- **Check readability.** Theme Studio shows the contrast of the four key text pairs under the preview. Aim for green, at least 4.5:1. People play on small screens, outdoors and from the couch.
- **Dark themes read best on handhelds.** Keep `background` and `surface` dark and let the wallpaper and `primary` bring the color.
- **Leave a color out** and Mirmire uses Material's default for dark or light themes.

### Shape and type

- **Cards** can be rounded or have cut corners, from 0 to 48 dp. Small corners look technical and large ones look friendly.
- **Card border:** a thin, low-contrast border (1 dp, a color a little lighter than `surface`) keeps cards crisp over busy wallpapers.
- **Focus outline:** the outline a controller user follows around the screen. Use 3–4 dp so it's easy to spot across a room.
- **Font:** use a built-in font, or include a TTF or OTF whose license allows sharing (for example, fonts under the SIL Open Font License). Keep it under 2 MB.
- **Section titles:** plain, BOLD CAPS or underlined. They appear on the Spotlight tab and the Players screen.
- **Home menu:** the menu your theme is designed for, top bar or side rail. Players can still change it in **Layout**.

### Wallpaper and console backdrops

- **Wallpaper:** 1920×1080, under 4 MB. A looping video (8–30 s, MP4, muted) can go alongside it, and players choose video or image in **Look**.
- **Console backdrops** show while a console is selected. Give each console its own image or loop, or reuse one picture for several consoles. Theme Studio stores a reused picture once.
- Mirmire darkens backdrops so text stays readable, and the preview shows exactly how. Very busy or bright pictures still benefit from being darker to begin with.
- Videos add up quickly. A loop for every console can reach hundreds of megabytes, so use them for a few consoles and images for the rest.

### Console icons

Icons work the same way in themes and icon packs. See [Making an icon pack](#making-an-icon-pack).

### Sounds and music

| Sound | Plays when | Length |
|---|---|---|
| `move` | Moving between items | Under 100 ms is best; it repeats when a direction is held |
| `select` | Opening something (A) | Under 400 ms |
| `back` | Going back (B) | Under 400 ms |
| `tab` | Switching tabs (L1 / R1) | Under 400 ms |
| `menu` | Opening Settings (Start) | Under 400 ms |
| `favorite` | Favoriting or pinning | Under 400 ms |
| `launch` | Starting a game | Up to 1 s |
| `edge` | Pushing against the end of a list | Under 400 ms |

- Use WAV or OGG, each under 200 KB. Keep them quiet and short, because players hear `move` hundreds of times.
- You can also give single buttons their own sound (`button_a`, `button_x`, `button_start`…). A button sound plays instead of the action sound.
- **Music:** one or more 15–90 s loops in OGG or MP3, under 8 MB each. Several tracks shuffle. Music is off until the player turns it on.
- A theme with no sounds keeps Mirmire's.

## Making an icon pack

An icon pack is a ZIP of images named after the consoles:

```
pack.json        (optional)
icons/snes.png
icons/nes.png
icons/megadrive.png
…
```

- **Names:** Mirmire matches each file name to a console. Its own IDs (`snes`, `megadrive`, `psx`…) work, and so do the names used by GarlicOS, MinUI, muOS and ES-DE (`SFC.png`, `MD.png`, `PS.png`…). The full list is under [System IDs](THEMES.md#system-ids-and-file-names). Folders don't matter, so an existing set usually imports as it is.
- **`pack.json`** gives the pack its name and credit:

  ```json
  { "id": "pixel-consoles", "name": "Pixel Consoles", "author": "you" }
  ```

  Without one, the pack is named after the ZIP. It can also list files that don't follow the naming: `"icons": { "snes": "art/super-famicom.png" }`.
- **Images:** PNG with a transparent background, square, 256–512 px, centered with a little space around the subject, under 200 KB each.
- **Consistency matters more than detail.** Use the same angle, lighting and outline weight across the set, and check that the icons read on both dark and light themes. Theme Studio's icon-pack mode previews them on Mirmire's default theme.
- Consoles you skip keep Mirmire's icons.

Players choose an icon pack in **Settings › Look › Console icons**. A chosen icon pack wins over a theme's own icons.

## Building a pack by hand

1. Make a folder with `theme.json` (or `pack.json` for an icon pack) and your files. [THEMES.md](THEMES.md) shows every field, and Theme Studio's **Copy theme.json** gives you a starting file.
2. Zip the **contents** of the folder, not the folder itself, so that `theme.json` sits at the top of the ZIP:
   - **macOS:** open the folder, select everything, right-click and choose **Compress**.
   - **Windows:** open the folder, select everything, right-click and choose **Send to › Compressed (zipped) folder**.
   - **Command line:** `cd my-theme && zip -r ../my-theme.zip .`
3. Import it on your device. Importing a pack with the same `id` replaces the old one, so you can tweak, zip and import again.

To edit a hand-made pack in Theme Studio, open its ZIP or drop its folder on the page.

## Sharing your pack

- **Only use art, fonts and sounds you're allowed to share**, and credit their creators in `author` or in a README inside the ZIP. Console names and logos are trademarks of their owners.
- **Keep it small.** Most themes need well under 50 MB. The app's limit is 1,024 files and 1 GB.
- **Test with a controller.** Move through the home screen, a games list, a game's page and Settings, and check that the focus outline is always easy to see.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Not a theme" or nothing happens on import | `theme.json` must be at the top of the ZIP, not inside a folder. Zip the folder's contents. |
| An icon or backdrop doesn't show | Check the file name against the [System IDs](THEMES.md#system-ids-and-file-names). Images must be PNG, WebP or JPEG. |
| The video doesn't play | Use H.264 video in an MP4. Some phones can't play 4K or HEVC. |
| Text is hard to read | Darken `background` and `surface`, or lighten `onSurface`. Theme Studio's contrast checks show which pair is low. |
| The custom font isn't used | The file must be TTF or OTF, and `style.font` must be `file:` plus its path, for example `file:fonts/MyFont.ttf`. |
| Sounds are too loud or long | Trim the silence at the start and end, and keep `move` very short. |
| An old version still shows after importing | The new pack has a different `id`. Use the same `id` to replace a pack. |
