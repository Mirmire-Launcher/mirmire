# Mirmire user guide

- [Install](#install)
- [First-time setup](#first-time-setup)
- [Adding your games](#adding-your-games)
- [Browsing and playing](#browsing-and-playing)
- [Controls](#controls)
- [Emulators and RetroArch](#emulators-and-retroarch)
- [Save sync](#save-sync)
- [Artwork](#artwork)
- [RetroAchievements](#retroachievements)
- [Themes and layout](#themes-and-layout)
- [Storage](#storage)
- [Updates](#updates)
- [Troubleshooting](#troubleshooting)

## Install

1. Download the latest `Mirmire-x.y.z.apk` from [Releases](https://github.com/Mirmire-Launcher/mirmire/releases/latest).
2. Open it on your device. Android may ask you to allow installs from your browser or file manager; allow it, then tap **Install**.
3. Optional: to boot straight into Mirmire on a handheld or TV, open **Settings › System › Use as home screen** and choose Mirmire.

## First-time setup

The guided setup walks through everything in about two minutes. Each step can be skipped and changed later in Settings. To run it again, open **Settings › System › Run setup again**.

![Welcome](../screenshots/31-setup-welcome.jpg)

1. **Your controller:** Xbox, PlayStation or Nintendo labels, and whether A/B are swapped.
2. **Make it yours:** a theme and an accent color.
3. **Your layout:** how consoles and games are shown.
4. **Download folder:** where games are saved on this device.
5. **Connect your library:** your network storage or a device folder.
6. **Save files:** where saves sync on your storage.
7. **Artwork:** where box art comes from.
8. **Emulators:** which app plays each console.
9. **RetroArch setup:** cores and recommended settings.
10. **Performance modes** (optional).
11. **Trophies:** your RetroAchievements account (optional).

## Adding your games

Open **Settings › Library › Add library**. Mirmire looks for servers on your network, or you can enter one yourself:

| Type | Use it for | You need |
|---|---|---|
| SMB | Windows shares and most NAS (Synology, QNAP, Unraid…) | Server address, share, username and password |
| SFTP | Linux servers, NAS with SSH | Server address, username, password |
| WebDAV | Nextcloud and other web storage | URL, username, password |
| FTP | Older NAS and routers | Server address, username, password |
| Device folder | Games already on the device or SD card | Pick the folder |

**Folder layout.** Put each console's games in a folder named after the console, for example:

```
ROMs/
  nes/      Super Mario Bros. (USA).nes
  snes/     Super Metroid (USA).sfc
  psx/      Final Fantasy VII (USA).m3u  (+ its .chd discs)
```

ES-DE, RetroArch and Batocera folder names all work (`megadrive`, `genesis`, `md`, `psx`, `ps1`…). Multi-disc games are grouped from `.m3u` playlists or "Disc 1 / Disc 2" names.

After adding a library, press **Sync now**. Mirmire lists your games without downloading them.

## Browsing and playing

![All games](../screenshots/02-games-list.jpg)

- **Tabs:** Consoles, All games, Recent, Favorites and Apps (your Android apps, handy when Mirmire is the home screen).
- **Views:** list with a preview pane, cover grid, or showcase. Switch with the buttons at the top or **R2**.
- **Artwork type:** box art, 3D box, screenshot, title screen, cartridge, fan art and more. Switch with the artwork button or **L2**.
- **Sort:** by name, last played, recently added or most played. Use the sort button or **Select**.
- **Search:** the magnifier, or **Y**.

Open a game for its details. **Download & play** downloads it to the device, then starts it. Games already on the device just say **Play**. From the details page you can also:

- favorite (**X**) and pin (**Y**); pinned games are never removed to free space;
- refresh the game's information;
- pick a different emulator for just this game;
- change its RetroArch settings;
- choose a performance mode.

![Game details](../screenshots/06-game-details.jpg)

## Controls

| Button | Action |
|---|---|
| D-pad / stick | Move |
| A | Select |
| B | Back (closes the keyboard first) |
| X | Favorite |
| Y | Search (home), keep on device (game details) |
| L1 / R1 | Previous / next tab or settings section |
| L2 / R2 | Artwork type / view |
| Select | Sort |
| Start | Settings |

On a keyboard, arrows move, Enter selects, and Esc or Backspace goes back. On the Consoles screen, **B** returns to the first console. Button labels follow **Settings › Controls**.

## Emulators and RetroArch

**Settings › Emulators** shows which app plays each console. **Automatic** picks the best installed option, or you can choose RetroArch with a specific core, or a standalone emulator.

![Emulators](../screenshots/11-settings-emulators.jpg)

**RetroArch setup** (Settings › RetroArch):

1. Install RetroArch.
2. Allow file access, so Mirmire can write RetroArch's config and prepare cores.
3. Press **Set up** to download the cores your library needs.
4. Once in RetroArch, choose **Load Core › Install or Restore Core** and pick each core.

**RetroArch settings.** Mirmire writes these before each launch, combined from three levels: the game's own settings first, then its console's, then all games'.

- **This device:** shows your device and chip, and suggests settings for it. Nothing changes until you press Apply.
- **All games:** aspect ratio, scaling, smoothing, screen effect (LCD grid or CRT scanlines), run-ahead, fast-forward speed, resume where you left off, rewind, hotkeys, menu combo, input polling, touch controls, graphics driver, threaded video, menu style, pop-ups and FPS.
- **Per console:** Mirmire recommends some settings, such as integer scaling and an LCD grid for handhelds, run-ahead for older 2D consoles, and the N64 and Saturn fixes. You can keep each recommendation, follow all games, or choose your own.
- **Per game:** the settings button on a game's details page.

**Default hotkeys** (hold **Select**, then press):

| Button | Action |
|---|---|
| X | RetroArch menu |
| Start | Quit to Mirmire |
| R1 / L1 | Save / load state |
| R2 | Fast-forward |
| L2 | Rewind (when on) |

Holding **Start** also opens RetroArch's menu.

## Save sync

**Settings › Library › Save files on your storage.** With sync on, your in-game saves upload to `Saves/<console>/` on your storage when you come back to Mirmire. Before you play, a newer save on the storage is downloaded. Earlier versions are kept, so you can go back to one. Save states and games from device folders aren't synced.

## Artwork

**Settings › Artwork** picks the source:

| Source | Notes |
|---|---|
| Auto | The best available for each game |
| Libretro | Box art, screenshots and title screens. No account needed |
| ScreenScraper | Adds 3D boxes, cartridges, fan art, videos and descriptions. A free account raises the daily limit |
| RetroAchievements | Uses RetroAchievements images |

Artwork already on your storage, in an ES-DE `downloaded_media` or `media` folder, is used first and kept on the device once loaded. Online lookups only run when you press **Find missing artwork online**.

## RetroAchievements

Sign in under **Settings › Trophies** with your username and **Web API key** (from your RetroAchievements account settings). Progress shows on game cards and pages, and Mirmire also signs RetroArch in for you.

## Themes and layout

- **Look:** theme, accent color, corners, animations, console icons, background (theme wallpaper, gradient, solid color, your own photo or video), and navigation sounds and music. **Get Iconic** and **Get Console Icon Pack** download extra art. You can also import theme or icon-pack ZIPs.
- **Layout:** screen orientation, top bar or side menu, consoles view, console tiles or icons only (with icon size), games view, card size, artwork type, what's shown on cards, and video previews.

Making your own theme: see [THEMES.md](THEMES.md).

## Storage

**Settings › Storage:**

- download only on Wi-Fi or Ethernet;
- download small games automatically;
- free up space automatically by removing large games you haven't played for a while (saves and pinned games are kept);
- free up space now.

## Updates

**Settings › System › App updates** shows your version and checks this repository for a newer one. When there is one, press **Download**, then **Install**. The first time, Android asks you to allow Mirmire to install apps. Turn on **Check automatically** to check once a day; nothing downloads until you choose to.

## Troubleshooting

**A game says the emulator isn't installed.** Install it from the link in Settings › Emulators, or choose another emulator for that console.

**RetroArch says the core is missing.** Open RetroArch, choose **Load Core › Install or Restore Core**, and pick the core Mirmire named.

**A game shows a black screen in RetroArch.** Switch **Graphics driver** to OpenGL in Settings › RetroArch, or turn off the screen effect for that console.

**N64 controls don't respond.** Keep the recommended **Input polling: Early** for N64.

**Saturn crashes when quitting.** Keep **Resume where you left off** off for Saturn, as recommended.

**My library doesn't find the server.** Enter the address yourself, check the share or folder name, and make sure the device is on the same network.

**An update won't install ("signed with a different key").** That copy of Mirmire came from somewhere else. Uninstall it, then install the release APK. Your library will need to be added again.

**Start over.** Settings › System › Reset settings resets each area on its own. Your libraries, downloaded games, saves and artwork are kept.
