# Mirmire user guide

- [Install](#install)
- [First-time setup](#first-time-setup)
- [Adding your games](#adding-your-games)
- [rclone (Google Drive, Dropbox, OneDrive)](#rclone-google-drive-dropbox-onedrive)
- [Browsing and playing](#browsing-and-playing)
- [Home page and widgets](#home-page-and-widgets)
- [Big Picture](#big-picture)
- [Dual screen](#dual-screen)
- [Controls](#controls)
- [Emulators and RetroArch](#emulators-and-retroarch)
- [GPU drivers](#gpu-drivers)
- [Performance modes and stick lights: one-time setup](#performance-modes-and-stick-lights-one-time-setup)
- [Save sync](#save-sync)
- [Continue on another device](#continue-on-another-device)
- [Library cleanup](#library-cleanup)
- [BIOS files](#bios-files)
- [Artwork](#artwork)
- [RetroAchievements](#retroachievements)
- [Themes and layout](#themes-and-layout)
- [Stick lights](#stick-lights)
- [Spotlight and play time](#spotlight-and-play-time)
- [Profiles](#profiles)
- [Storage](#storage)
- [Pack for a trip](#pack-for-a-trip)
- [Backups](#backups)
- [Home screen widget](#home-screen-widget)
- [Updates](#updates)
- [Android settings](#android-settings)
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
4. **Local game folder:** a folder on this device for the games you play. Emulators can't open games straight from a NAS or server, so Mirmire copies a game from your network library here when you play it. Games already on this device stay where they are.
5. **Connect your library:** your network storage or a device folder. If ES-DE, RetroArch or LaunchBox already downloaded artwork on this device, **Found on this device** lists it: Mirmire uses that artwork and game info straight away, without copying or changing it. If ES-DE plays games from a folder here, **Add this ROM folder** adds it in one tap. Saves, states, settings and BIOS files from RetroArch can come too (see [Bring over from RetroArch](#bring-over-from-retroarch)).
6. **Save files:** where saves sync on your storage.
7. **Artwork:** where box art comes from.
8. **Emulators:** which app plays each console.
9. **RetroArch setup:** cores and recommended settings.
10. **Performance modes** (optional): a one-time setup, also used for stick lights on Retroid and AYN handhelds.
11. **Trophies:** your RetroAchievements account (optional).

## Adding your games

Open **Settings › Library › Add library**. Mirmire looks for servers on your network, or you can enter one yourself:

| Type | Use it for | You need |
|---|---|---|
| SMB | Windows shares and most NAS (Synology, QNAP, Unraid…) | Server address, username and password |
| SFTP | Linux servers, NAS with SSH | Server address, username, password |
| WebDAV | Nextcloud and other web storage | Server address, username, password |
| rclone | Google Drive, Dropbox, OneDrive and other rclone remotes | A PC/NAS running `rclone serve webdav` (see [rclone](#rclone-google-drive-dropbox-onedrive)) |
| FTP | Older NAS and routers | Server address, username, password |
| Device folder | Games already on the device or SD card | Pick the folder |

**Sign in, then pick the folder.** For network storage, enter the address and your username and password, then choose **Connect & browse**. Mirmire signs in and shows the folders on the server (for SMB, first the shares on your NAS, so you don't need to know the share name): open a folder to look inside, choose **Up one level** to go back, and choose **Use this folder** on the folder that holds your console folders. Console folders it recognises are marked, so you can see when you've found the right place. You can still type the path yourself under **Or type the path (optional)**. **Test** checks the folder and lists the consoles it found.

If signing in fails, Mirmire says why: wrong username or password, server not found, couldn't reach the server, connection timed out, folder or share not found, or permission denied.

**Folder layout.** Put each console's games in a folder named after the console, for example:

```
ROMs/
  nes/      Super Mario Bros. (USA).nes
  snes/     Super Metroid (USA).sfc
  psx/      Final Fantasy VII (USA).m3u  (+ its .chd discs)
```

ES-DE, RetroArch and Batocera folder names all work (`megadrive`, `genesis`, `md`, `psx`, `ps1`…). Multi-disc games are grouped from `.m3u` playlists or "Disc 1 / Disc 2" names.

**Xbox and Xbox 360** go in `xbox/` (`.iso`, `.xiso`, `.cso`, `.cci`) and `xbox360/` or `x360/` (`.iso`, `.zar`, or an extracted game folder with its `default.xex`).

**Steam games** from DroidDeck: add a Steam library folder (the one that holds `steamapps`, for example `SteamLibrary` on your SD card) as a game library. Each installed game shows with its Steam name and art. DroidDeck's built-in library lives in its private storage, which other apps can't read, so only libraries on an SD card or shared storage appear.

**PlayStation 3** games go in `ps3/` as `.iso` disc images. Extracted game folders and games installed from `.pkg` files are started from inside the PS3 emulator. PS2 also takes `.gz`, `.mdf`, `.nrg` and `.img` images, alongside `.iso`, `.chd`, `.cso`, `.zso` and `.cue`.

After adding a library, press **Sync now**. Mirmire lists your games without downloading them.

**Upload local games to storage.** If you already have games in your **local game folder** that aren't on the network library (or are incomplete there), open **Settings › Library › Upload local games to storage**. Mirmire uploads only what's missing; files already on the NAS at full size are left alone. Uses the same Wi‑Fi / Ethernet-only setting as downloads.

## rclone (Google Drive, Dropbox, OneDrive)

Mirmire does not sign in to Google or Dropbox itself. On a PC or NAS, run [rclone](https://rclone.org/) and serve your ROM folder over WebDAV, then add an **rclone** library in Mirmire.

```bash
rclone serve webdav gdrive:roms --addr :8080 --user mirmire --pass secret
```

In Mirmire: choose **rclone**, enter the machine's LAN IP, port **8080**, and the same user/pass. Keep that serve command running while you browse or play. Full steps: **[rclone guide](RCLONE.md)**.

## Browsing and playing

![All games](../screenshots/02-games-list.jpg)

- **Tabs:** Consoles, All games, Recent, Favorites, Spotlight and Apps (your Android apps, handy when Mirmire is the home screen).
- **Views:** list with a preview pane, cover grid, or showcase. Switch with the buttons at the top or **R2**.
- **Artwork type:** box art, 3D box, screenshot, title screen, cartridge, fan art and more. Switch with the artwork button or **L2**.
- **Sort:** by name, last played, recently added or most played. Use the sort button or **Select**.
- **Search:** the magnifier, or **Y**.

Open a game for its details. **Download & play** downloads it to the device, then starts it. Games already on the device just say **Play**. **Offload** removes a game from the device: its saves and states sync to your storage first, and copies that are safely there are removed too. Artwork and play time stay, and downloading it again brings everything back. From the details page you can also:

- favorite (**X**) and pin (**Y**); pinned games are never removed to free space;
- refresh the game's information;
- pick a different emulator for just this game;
- change its RetroArch settings;
- choose a performance mode;
- read the game's **manual** or look at its **map**, when it has one (see below).

**Manuals and maps.** A book or map button appears on a game's page when one is found. Manuals open page by page, maps as one big image; zoom with the buttons or by pinching, and **Close** when done. They come from ScreenScraper, your `gamelist.xml` (`<manual>` and `<map>`), your artwork folder (`<console>/media/manuals/` and `media/maps/`), or ES-DE and LaunchBox on the device. A manual is kept on the device after the first time you open it. On a dual-screen handheld they open on the second screen too, so you can read while you play.


![Offload on a game's page](../screenshots/44-game-offload.jpg)
![Game details](../screenshots/06-game-details.jpg)

## Home page and widgets

Turn on **Settings › Layout › Home page with widgets** to add a **Home** tab before Consoles. Mirmire opens on it, like a phone's home screen, with widgets you choose.

- **Edit** (or press Select) lets you change the page. **Add widget** opens the list; select a widget to change its size, move it earlier or later, or remove it.
- **With touch,** it works like a phone's home screen: long-press a widget to pick it up and drag it to a new spot. In edit mode, drag a widget's right edge, bottom edge or corner handle to resize it, and press **×** to remove it.
- **Mirmire's widgets:** Clock, Weather (pick a city and °C or °F; forecasts from Open-Meteo), Calendar (your next events, once you allow it), Continue playing, Recently played, Recently added, RetroAchievements, Achievement of the week, Play time, Library and Music.
- **Music** plays MP3, M4A, FLAC, OGG or WAV files from a folder on your storage (and the folders inside it) while Mirmire is open, shuffled or in order. Choose the folder in its options. It pauses when a game starts or the screen turns off, and the theme's own music waits while it plays. Press the widget to play or pause.
- **Plugins:** widgets made by players, such as **Pixel Pet**, which comes with Mirmire. Your pet walks around, gets hungry, bored and sleepy, naps at night, cheers when you come back from a game or earn achievements, and wears outfits on a schedule (pajamas at night, Halloween…). Select it to feed it, play ball or give it a pat. In its **Widget options**, name it and choose from hundreds of pets from [OpenPets](https://openpets.dev); the list and the pet you pick are kept, so both work offline after the first time. Under **AI hints** you can let your pet share a short tip or fun fact about the game you just played, and now and then a word about your collection. It's off until you turn it on. Choose where the AI runs: **Google Gemini**, **Groq** or **OpenRouter** (free, with your own API key from their site; the options page shows where to get one), your own server (LM Studio or Ollama on a PC), or **On this device**, which downloads a model once (Small, 340 MB, or Better, 2.6 GB, which needs about 6 GB of memory) and then works offline. Press **Test** to check it works. Only a game's title and console are sent, never your files, name or accounts. Your key stays on the device and isn't included in backups. AI lines carry an **AI** tag. If the AI can't be reached, your pet just uses its usual lines. Import more under **Plugins › Import a plugin ZIP**, or in **Settings › Look › Widget plugins**. Before installing, Mirmire shows what the plugin is allowed to do. To make your own, see [Make widget plugins](PLUGINS.md).
- **Apps:** widgets from other apps on the device, as on a phone's home screen. The first time, Android asks you to allow Mirmire to add them.

Sizes are **Small** (1×1), **Wide** (2×1), **Medium** (2×2) and **Large** (4×2). Widgets fill the page in order, four across (two on a narrow screen). On a small widget, text shrinks a little to fit rather than being cut off.

With a second screen in use, the Home tab leaves the main screen; choose **Home page widgets** for the second screen to keep them (see [Dual screen](#dual-screen)).

| The Home page | Pixel Pet's options |
|---|---|
| ![Home page](../screenshots/53-home-page.jpg) | ![Pixel Pet](../screenshots/55-pixel-pet.jpg) |

## Big Picture

Big Picture is a full-screen home made for controllers and TVs. Turn it on with the **⛶** button next to Search on the home screen, or in **Settings › Layout › Big Picture**. It stays on, even after a restart, until you exit it.

- **The main menu** is a row of large cards: **Widgets** (your Home page, when it's on), **Continue** (your last game), **Consoles**, **All games**, **Recent**, **Favorites**, **Apps**, **Settings** and **Exit Big Picture**.
- **Consoles, games and apps** open as a row of tiles: just the icon or cover, with its name underneath. The selected one sits in the middle.
- **The Android status and navigation bars are hidden,** dialogs included, and again when you come back from a game. Swipe in from the edge to see them for a moment. Retroid handhelds keep their three-button bar on screen whatever an app asks; there Mirmire hides the status bar and keeps everything above the buttons. To hide them too, switch the Retroid to gesture navigation in its own settings.
- **The bottom bar** shows the Mirmire logo and name, the buttons you can press, your RetroAchievements points (plus unlocks this week and your streak, when you have them), the time and battery, and **Settings** and **Exit** buttons. Press down to reach it.

| Button | Does |
|---|---|
| Left / right | Move along the row |
| A | Open, or play a game (a game that isn't on the device opens its page to download) |
| B | Back |
| X | Favorite the selected game |
| Y | Open the selected game's page |
| L1 / R1 | Jump 10 games at a time |
| Start | Settings |


**Big Picture when docked** (Settings › Layout, on by default): connecting a TV or monitor (HDMI, a USB-C display or a dock) switches to Big Picture in landscape. Unplugging puts your layout back, unless you changed it while docked.

| The main menu | Consoles |
|---|---|
| ![Big Picture](../screenshots/56-big-picture.jpg) | ![Big Picture consoles](../screenshots/56b-big-picture-consoles.jpg) |

## Dual screen

On handhelds with two screens, like the AYN Thor and AYANEO Pocket DS, or with a clip-on screen like the Retroid Dual Screen add-on, Mirmire uses both. The menu stays on the main screen and the second screen shows one of these:

- **Game details** (the default): big cover art, the description, year, genre and players, when you last played, and your RetroAchievements progress for the game you've selected. Select a console and it shows that console with the games you played lately. With nothing selected, it shows the clock and your last game. Tap **Play** or **Details** there, or tap a cover to open that game on the main screen.
- **Home page widgets**: your widget board, used by touch.

While a second screen is in use, the Home tab (and Big Picture's Widgets card) leaves the main screen: pick **Home page widgets** above to have them on the second screen.

Your controller always works the menu, never the second screen, even right after you touch the second screen, so nothing gets lost between them.

**Text size.** A clip-on screen is drawn at the main screen's size automatically. **Second screen text and icon size** makes it bigger or smaller from there (70–160%).

**Retroid Dual Screen add-on.** Retroid's own **Turn off handheld console's screen** setting (Video Output) switches the handheld's screen off when the add-on is attached. While the add-on is used as a second screen, Mirmire turns that setting off so both screens stay on, and puts it back for a TV. This needs the [one-time setup](#performance-modes-and-stick-lights-one-time-setup).

**Swap screens** puts the menu on the second screen and the details or widgets on the main one, for example the menu on the AYN Thor's bottom touch screen and the art on the big top screen. Games still open on the main screen. Some devices keep the home app on the main screen; Mirmire tells you if swapping isn't possible.

**DS, 3DS and Wii U games** need the second screen for themselves, so Mirmire leaves it free while you play them and comes back when you return. Set your emulator's dual-screen layout in the emulator itself (WatermelonDS, melonDS, Azahar, Cemu and DraStic have it). Other games leave the details up while you play.

**A clip-on screen or a TV?** Built-in screens are recognized on their own. The first time an external screen is connected, Mirmire asks whether it's a second screen or a TV or monitor, and remembers the answer. A TV switches to Big Picture, if **Big Picture when docked** is on.

Find all of this in **Settings › Layout › Dual screen**, where **Ask again about connected screens** forgets your answers.

**Themes** can dress the second screen too: its own wallpaper, what goes behind a game's details (the game's art, the console's backdrop, or just the wallpaper), how dark it is, and whether the clock shows when nothing is selected. Theme Studio has a dual-screen preview for this.

| Both screens | A console | Widgets |
|---|---|---|
| ![Dual screen](../screenshots/57-dual-screen.jpg) | ![Console on the second screen](../screenshots/58-second-screen-console.jpg) | ![Widgets on the second screen](../screenshots/59-second-screen-widgets.jpg) |

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

On a keyboard, arrows move, Enter selects, and Esc or Backspace goes back. On the Consoles screen, **B** returns to the first console, and up and down stay in the same column. In Settings, **right** opens the selected section's first option and **left** comes back to the list. Button labels follow **Settings › Controls**.

When a controller is connected, the buttons you can press are shown at the bottom right, low in the navigation bar's strip so they don't cover anything.

## Emulators and RetroArch

**Settings › Emulators** shows which app plays each console, sorted by name. **Automatic** picks the best installed option, or you can choose RetroArch with a specific core, or a standalone emulator. Emulators are separate apps. Tap one under **Not installed** to get it:

- **Install** (hakuX, Xendroid Plus, ARMSX2, ARMSX3 and DroidDeck, which aren't on Google Play): Mirmire downloads the right APK from the emulator's official GitHub releases and hands it to Android, which asks you to confirm. The first time, Android asks you to allow Mirmire to install apps; turn on **Allow from this source**, go back and tap **Install** again. ARMSX2 and ARMSX3 get the build that suits your Android version and processor.
- **Get** (everything else): opens the emulator's Google Play page, or its download site when it isn't on Play (for example WatermelonDS and DraStic).

**Automatic picks** (when you leave a console on Automatic and the app is installed):

| Console | Preferred standalone | RetroArch default core |
|---|---|---|
| PS1 | DuckStation (then ePSXe) | SwanStation (PCSX ReARMed available for low-end) |
| N64 | Mupen64Plus FZ | Mupen64Plus-Next |
| DS | WatermelonDS (then melonDS, DraStic) | melonDS DS |
| Saturn | — | YabaSanshiro (Beetle Saturn for stronger devices) |
| PS2 | ARMSX2 (then AetherSX2) | — |
| Dreamcast | Redream, then Flycast | Flycast |

**Xbox and Xbox 360** play in **hakuX** (Xbox) and **Xendroid Plus** (Xbox 360), both from GitHub. hakuX starts a game only once a games folder is set up inside hakuX itself; until then it opens its own setup. On Snapdragon devices both run better with a custom GPU driver (see [GPU drivers](#gpu-drivers)).

**Steam** games play in **DroidDeck**, which Mirmire can install for you: Mirmire opens each game in it by its Steam app id. Sign in to Steam inside DroidDeck first. Steam stays in the Emulators list even before you have Steam games, so you can install DroidDeck first.

**PlayStation 2 and 3** play in **ARMSX2** (PS2) and **ARMSX3** or **aPS3e** (PS3). Mirmire installs ARMSX2 and ARMSX3 from GitHub; aPS3e is on Google Play. Each needs its own one-time setup first: a PS2 BIOS for ARMSX2, the PS3 firmware for ARMSX3 and aPS3e. Mirmire then starts disc images directly. These emulators run on 64-bit Android only, and they don't start on an Android emulator (AVD).

![Emulators](../screenshots/11-settings-emulators.jpg)

**RetroArch setup** (Settings › RetroArch):

1. Install RetroArch.
2. Allow file access, so Mirmire can write RetroArch's config and prepare cores.
3. Press **Set up** to download the cores your library needs.
4. Once in RetroArch, choose **Load Core › Install or Restore Core** and pick each core.

**RetroArch settings.** Mirmire writes these before each launch, combined from three levels: the game's own settings first, then its console's, then all games'.

- **This device:** shows your device and chip, and suggests settings for it. Nothing changes until you press Apply.
- **All games:** aspect ratio, scaling, smoothing, screen effect (LCD grid or CRT scanlines), bezel, run-ahead, fast-forward speed, resume where you left off, rewind, hotkeys, menu combo, input polling, touch controls, graphics driver, threaded video, menu style, pop-ups and FPS.
- **Per console:** Mirmire recommends some settings, such as integer scaling and an LCD grid for handhelds, run-ahead for older 2D consoles, and the N64 and Saturn fixes. You can keep each recommendation, follow all games, or choose your own.
- **Per game:** the settings button on a game's details page.

**Bezels.** **Bezel** puts console art around the picture, from The Bezel Project: **The console's**, or **The game's own** (falling back to the console's when a game has none). They download once, for most 8-bit to Dreamcast-era consoles. Bezels use RetroArch's overlay, so they show only while a controller is connected, in place of the touch controls.

### Bring over from RetroArch

If you played through RetroArch from another app (ES-DE, Daijishō…), **Bring over from RetroArch** at the top of Settings › RetroArch (and in setup) copies your saves and save states for games in your library, your RetroArch settings (controls, hotkeys, video, audio and menu) and BIOS files into Mirmire's setup. Only new or newer files are copied, and RetroArch's own folders aren't changed. RetroArch keeps its settings in a private folder on some devices; finish the [one-time setup](#performance-modes-and-stick-lights-one-time-setup) and they can come too.

**Default hotkeys** (hold **Select**, then press):

| Button | Action |
|---|---|
| X | RetroArch menu |
| Start | Quit to Mirmire |
| R1 / L1 | Save / load state |
| R2 | Fast-forward |
| L2 | Rewind (when on) |

Holding **Start** also opens RetroArch's menu.

## GPU drivers

On Snapdragon phones and handhelds, newer GPU drivers often make demanding emulators faster and fix glitches. **Settings › Emulators › GPU drivers** shows your GPU (for example **Adreno 650**), which installed emulators can load a custom driver (hakuX, Xendroid Plus, ARMSX2, ARMSX3, aPS3e, DroidDeck, Eden, Citron, Sudachi, Dolphin and Vita3K), and **Find drivers for Adreno 6xx** (or 7xx, 8xx), which checks the latest releases from [StevenMXZ](https://github.com/StevenMXZ/Adreno-Tools-Drivers) and [K11MCH1](https://github.com/K11MCH1/AdrenoToolsDrivers) and marks one **Suggested**. Tap one to download it.

To use it, keep the `.zip` as it is, open the emulator's GPU driver settings (hakuX: **Settings › GPU driver › Add a driver**; Xendroid Plus: **Custom GPU Drivers › Import ZIP**; ARMSX2 and ARMSX3: **Settings › Renderer**, choose **Vulkan**, then **Import .zip**; aPS3e: its custom driver option; Eden, Citron and Sudachi: **GPU driver manager › Install**), pick the file, make it the active driver and restart the game. If a game looks wrong, switch back to the system driver. Drivers only load inside the emulator; nothing on your device is changed.

## Performance modes and stick lights: one-time setup

Android only lets an app change performance modes, stick lights and a few device settings with **Wireless debugging** access. Mirmire sets this up once, on the device itself, with no computer or other app:

1. **Turn on Developer options:** in About, tap Build number 7 times.
2. **Connect to Wi-Fi.** Wireless debugging needs a Wi-Fi network, not the internet.
3. **Pair Mirmire:** press **Start pairing**, turn Wireless debugging on, tick **Always allow on this network**, tap **Pair device with pairing code**, then type the code into Mirmire's notification.

You'll find the steps in **Settings › Emulators › Performance modes**, **Settings › Device** and during setup. After pairing, Mirmire reconnects by itself whenever you're on Wi-Fi, restarts included. Already use **Shizuku**? Start it and Mirmire uses it instead. Android 10 and older need Shizuku.

## Save sync

**Settings › Library › Save files on your storage.** With sync on, your in-game saves upload to `Saves/<console>/` on your storage when you come back to Mirmire, and save states to `Saves/<console>/states/`. Before you play, newer saves and states on the storage are downloaded. Earlier versions of saves are kept, so you can go back to one.

## Continue on another device

When another of your devices played a game more recently, the home screen offers **Continue**: the game opens here with that device's save and save state, so with **Resume where you left off** on you're right where you stopped.

![Continue on another device](../screenshots/47-continue.jpg)

- **Devices that use the same library storage** need no setup: they share saves, states and "last played" through it.
- **Devices without shared storage** (for example, games in a folder on each device) pair once over Wi-Fi in **Settings › Library › Continue on another device**: press **Pair** next to the other device, check that both screens show the same 6-digit code, and accept on the other device. Paired devices swap newer saves and states, encrypted, whenever Mirmire is open on both on the same Wi-Fi. A replaced copy is kept in `Mirmire/retroarch/.peer-backup/`.


**Upload when the screen turns off** (on by default): press power in the middle of a game and its saves and save states upload a few seconds later, and your other devices are told what you were playing so they offer **Continue**. RetroArch writes in-game saves when it pauses. To pick up at the exact moment, save a state first with the hotkey + R1.

**Play together:** with a paired device on the same Wi-Fi, a downloaded game's page shows **Play together**. The other device gets an invite. When it's accepted, the game starts on your device and RetroArch begins hosting by itself. The other device opens the same game with your address filled in; there, open RetroArch's menu (hotkey + X) and choose **Netplay › Connect to Netplay Host**. RetroArch doesn't let other apps make it join a game, so that last step stays manual. Both devices need the same game from the same library.

## Library cleanup

Big libraries often have several versions of each game. **Settings › Library › Cleanup:**

![Library cleanup](../screenshots/45-library-cleanup.jpg)

- **One version of each game** shows one copy per game, picked by your **Preferred regions** in order (a World release counts as your first choice), then the latest revision, preferring clean dumps over bad, hacked or translated ones. A game only released elsewhere shows its best version. Games you've played, pinned or favorited always show.
- **Hide betas, demos and prototypes.**
- **Check games against No-Intro:** games are checked against the No-Intro list (from libretro-database) when they're downloaded or already on the device. **Check all** reads the rest from your storage. Disc-based consoles aren't covered. A game's page shows **Verified dump**, **Bad or modified dump** or **Not in No-Intro list**.

The filter button above the games list switches between **Cleaned up**, **Everything** (hidden versions too) and **Didn't pass check**.

| ![Preferred regions](../screenshots/46-preferred-regions.jpg) | ![Didn't pass check filter](../screenshots/42-library-filter.jpg) |
|---|---|

![Not in No-Intro list on a game's page](../screenshots/43-game-check.jpg)

## BIOS files

**Settings › RetroArch › BIOS files** lists the consoles in your library that use BIOS files, with what's found, missing or the wrong version, checked against libretro's BIOS checksums. Tap a console for the file names and where they go.

![BIOS files](../screenshots/48-bios.jpg)

- **BIOS folder:** pick a folder on your storage, like the saves and artwork folders. Files sync both ways: good files there are copied to the device, and good files on the device are uploaded. Left on automatic, Mirmire looks for a `bios`, `system` or `firmware` folder in your libraries.
- **Sync BIOS files from storage** brings new files over on every library sync. Files are recognised by checksum, so `SCPH-5501.BIN` is saved as `scph5501.bin`, where RetroArch expects it.

## Artwork

**Settings › Artwork** picks the source:

| Source | Notes |
|---|---|
| Auto | The best available for each game |
| Libretro | Box art, screenshots and title screens. No account needed |
| ScreenScraper | Adds 3D boxes, cartridges, fan art, videos and descriptions. A free account raises the daily limit |
| RetroAchievements | Uses RetroAchievements images |

Artwork already on your storage, in an ES-DE `downloaded_media` or `media` folder, is used first and kept on the device once loaded. Next, Mirmire uses artwork other frontends downloaded on this device: ES-DE's `downloaded_media` and gamelists, RetroArch's thumbnails and LaunchBox's images (when LaunchBox's folder is on normal storage, not inside the app). Nothing is copied or changed. Daijishō keeps its artwork inside the app, where Mirmire can't read it. Online lookups only run when you press **Find missing artwork online**.

## RetroAchievements

Sign in under **Settings › Trophies** with your username and **Web API key** (from your RetroAchievements account settings). Progress shows on game cards and pages, and Mirmire also signs RetroArch in for you.

## Themes and layout

- **Look:** theme (including **Green**, **Blue**, **Neon**, **Pearl** and **Sky Console**, styled after handheld and console menus), accent color, corners, animations, console icons, background (theme wallpaper, gradient, solid color, your own photo or video), and navigation sounds and music. **Get Iconic** and **Get Console Icon Pack** download extra art. You can also import theme or icon-pack ZIPs.
- **Layout:** **Text and icon size** (80–150%, like Android's display size: menus, dialogs and widgets all follow it), screen orientation, **Keep the screen on** (off, while charging, or always, while Mirmire is open), top bar or side menu (the side menu scrolls when it has more buttons than fit), consoles view, console tiles or icons only (with icon size), games view, card size, artwork type, what's shown on cards, and video previews.

Making your own theme, icon pack or widget plugin: try **[Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/)** in your browser, and see [Make your own themes and icon packs](CREATING.md) and [Make widget plugins](PLUGINS.md). The file format is in [THEMES.md](THEMES.md).

## Spotlight and play time

The **Spotlight** tab gathers:

![Spotlight](../screenshots/40-spotlight.jpg)

- **Achievement of the week** from RetroAchievements, with a button to the game when it's in your library;
- **Close to mastery:** games nearest to 100% of their achievements;
- **Quick to play:** arcade, puzzle, fighting and other pick-up-and-play genres;
- **Play together:** multiplayer games;
- **Not tried yet:** a new pick every day;
- **Your play time:** this week, all time, your top console and most played games.

![Play together](../screenshots/41-spotlight-play-together.jpg)

Mirmire times each play from launch until you come back. A game's page shows its play time and, once there's enough history, about how long the battery will last playing it in its performance mode.

**Each game's performance mode is learned** (Settings › Emulators › Performance modes › Learn each game's mode, on by default). After a couple of plays of five minutes or more, a game gets a mode that suits its console: battery saver for 8- and 16-bit systems, standard for consoles like the N64 and PlayStation, and performance for demanding ones like the PS2 and GameCube. If most of its recent plays ended hot (the battery at 41°C or more), it goes one step lower. The game's page says which mode was picked and why. A mode you choose on a game always wins. Modes need the [one-time setup](#performance-modes-and-stick-lights-one-time-setup).

## Profiles

**Settings › Profiles** (or **Who's playing?** during setup) adds a player for each person. Each has their own favorites, recently played, play time, saves and save states. Switch with the player button next to Search.

| ![Profiles](../screenshots/51-profiles.jpg) | ![Content filter](../screenshots/50-profile-filter.jpg) |
|---|---|

- **PIN:** asked when switching to that player.
- **Content filter** (for a child's profile): only the consoles you allow, without the genres you hide. A filtered player can't see hidden games and needs a parent's PIN to open Settings, so set a PIN on your own profile.

RetroAchievements uses one account for every player.

## Stick lights

On Retroid and AYN handhelds with lights around the analog sticks (Retroid Pocket 5, 6 and Mini, AYN Odin 2, Odin 2 Portal, Odin 3 and Thor), Mirmire can set their color. Open **Settings › Device**. This section only appears on those devices, and its light options only once Mirmire has found the lights.

![Stick lights](../screenshots/36-device-lights.jpg)

**It needs the [one-time setup](#performance-modes-and-stick-lights-one-time-setup)**, the same as performance modes (or Shizuku). Mirmire then checks which light settings your device has.

**In Mirmire**, the lights can:

- **Device setting:** stay as set in your device's own settings;
- **Theme color:** follow the theme. Some themes have their own light colors (Cyberpunk, Comic, Insert Coin, and the Console themes: green for Green Console, the Retroid's own blue for Blue Console, red and blue for Neon Console); otherwise the lights use your accent color;
- **Battery level:** go from green when full, through yellow, to red when low;
- **Off:** stay off while Mirmire is open.

**While playing**, a game can start with:

- **Same as Mirmire:** the light doesn't change;
- **Console color:** for example red for NES, blue for Genesis, blue and green for N64;
- **Game's cover art:** the main colors of the game's box art, one per stick;
- **Performance mode:** green for battery saver, the theme's color for standard, red-orange for performance;
- **Off:** the lights turn off when the game starts.

| Console colors | A console's color |
|---|---|
| ![Console colors](../screenshots/37-console-colors.jpg) | ![Console color picker](../screenshots/38-console-color-picker.jpg) |

With **Console color** or **Game's cover art**, you can change any console's color in the list below. To give one game its own color, press the light button on its details page.

![Game light](../screenshots/39-game-light.jpg)

**Brightness** sets how bright the lights are. Mirmire saves your device's own light settings before its first change. **Put back my device's lights**, or setting both options back to the device's own, restores them.

Good to know:

- Lighting effects in your device's settings, such as breathing or rainbow, replace Mirmire's colors. Set the effect to solid there.
- Mirmire sets the color when you switch themes, when the battery level changes and when a game starts. It doesn't run during a game, so the light stays the same until you come back.
- Lights that react to sound aren't supported: they'd need Mirmire running and recording audio during games.

## Storage

**Settings › Storage:**

- download only on Wi-Fi or Ethernet;
- download small games automatically;
- free up space automatically by removing large games you haven't played for a while (saves and pinned games are kept);
- free up space now.

To push games from the local game folder **up** to a network library when they're missing there, use **Settings › Library › Upload local games to storage** (same Wi‑Fi / Ethernet rule as downloads).

## Pack for a trip

**Settings › Storage › Pack for a trip** gets games ready to play offline. Pick favorites, recently played, games already on the device or whole consoles. Mirmire downloads them, keeps them from being removed to free space, and syncs their saves, states and BIOS files. While you're away, games start without waiting for your storage. When a network is back, saves, settings and "last played" sync straight away. **Back home: unpack** lets free-up-space remove them again.

![Pack for a trip](../screenshots/49-pack-trip.jpg)

## Backups

**Settings › System › Backups** saves Mirmire's setup to your storage: settings, libraries (without passwords), emulator choices, RetroArch settings, favorites, stick-light colors, imported themes, icon packs and widget plugins, and your Home page widgets (widgets from other apps are left out). Pick the **Backups folder** like the saves folder (automatic: `Mirmire/backups` in your first network library).

![Backups](../screenshots/52-backups.jpg)

- **Back up automatically:** once a day; the newest 10 backups of each device are kept.
- **Restore a backup:** from this device or any other. Libraries it adds ask for their password.
- **Include RetroArch's own settings** (on by default): also backs up `retroarch.cfg` and the core options, overrides and remaps in RetroArch's config folder. Anything tied to one device is left out: folder paths, video and audio drivers, controller button numbers and screen size. RetroArch's sign-in isn't included either. Restoring merges these into the device's own RetroArch setup. Settings sync doesn't change RetroArch's files; they only come back when you restore a backup.
- **Keep settings in sync:** changes back up a minute later, and Mirmire applies newer settings from your other devices when it opens. Screen orientation, menu style and sizes stay per device.

Passwords and keys are never backed up.

## Home screen widget

This is Mirmire's widget for your phone's own home screen (for widgets inside Mirmire, see [Home page and widgets](#home-page-and-widgets)). On a phone with its own launcher, add the **Mirmire: Continue** widget from your launcher's widget list, or from **Settings › System › Add widget to home screen**. It shows your last game with its play time and the four before it; tap one to open it.

## Updates

**Settings › System › App updates** shows your version and checks this repository for a newer one. When there is one, press **Download**, then **Install**. The first time, Android asks you to allow Mirmire to install apps. Turn on **Check automatically** to check once a day; nothing downloads until you choose to.

## Android settings

**Settings › System › Android settings** opens the device's own settings, handy when Mirmire is your home screen: **Wi-Fi**, **Bluetooth**, **Display**, **Sound**, **Battery** and **Apps**.

## Troubleshooting

**A game says the emulator isn't installed.** Install it from Settings › Emulators (**Install** or **Get** beside it), or choose another emulator for that console.

**Install does nothing, or opens Android's Install unknown apps screen.** Mirmire needs permission to install apps once: turn on **Allow from this source** for Mirmire, go back and tap **Install** again.

**RetroArch says the core is missing.** Open RetroArch, choose **Load Core › Install or Restore Core**, and pick the core Mirmire named.

**A game shows a black screen in RetroArch.** Switch **Graphics driver** to OpenGL in Settings › RetroArch, or turn off the screen effect for that console.

**N64 controls don't respond.** Keep the recommended **Input polling: Early** for N64.

**Saturn crashes when quitting.** Keep **Resume where you left off** off for Saturn, as recommended.

**My library doesn't find the server.** Enter the address yourself, check the share or folder name, and make sure the device is on the same network.

**An update won't install ("signed with a different key").** That copy of Mirmire came from somewhere else. Uninstall it, then install the release APK. Your library will need to be added again.

**The stick lights don't change.** Check that the one-time setup is done (or Shizuku is running and allowed) in Settings › Device, and that the lighting effect in your device's settings is set to solid. If Mirmire says no light settings were found, turn the stick lights on once in your device's settings, then press **Check again**.

**The Retroid's own screen goes dark with the Dual Screen add-on.** Finish the [one-time setup](#performance-modes-and-stick-lights-one-time-setup) so Mirmire can keep it on, or turn off **Turn off handheld console's screen** in Retroid's Video Output settings.

**An Xbox game opens hakuX's setup instead.** Set up a games folder inside hakuX once; after that, Mirmire's games start directly.

**A game doesn't start: "BIOS".** Check **Settings › RetroArch › BIOS files** for that console.

**A game is missing from the list.** Library cleanup may show another version instead: switch the filter above the games list to **Everything**.

**Start over.** Settings › System › Reset settings resets each area on its own. Your libraries, downloaded games, saves and artwork are kept.
