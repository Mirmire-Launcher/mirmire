<p align="center"><img src="docs/images/mirmire-icon.svg" alt="Mirmire" width="96"></p>

<h1 align="center">Mirmire</h1>

<p align="center"><b>A retro game launcher for Android handhelds, phones and TVs that plays your whole library straight from your NAS.</b></p>

<p align="center">
  <a href="https://github.com/Mirmire-Launcher/mirmire/releases/latest"><b>⬇ Download</b></a>
  &nbsp;·&nbsp;
  <a href="https://mirmire-launcher.github.io/mirmire/theme-maker/"><b>🎨 Theme Studio</b></a>
  &nbsp;·&nbsp;
  <a href="docs/GUIDE.md"><b>📖 User guide</b></a>
</p>

![Consoles](screenshots/01-consoles.jpg)

## What makes Mirmire different

Most launchers expect your games on the device and leave the emulators, saves and BIOS files to you. Mirmire is built around a library that lives on your storage, and takes care of the rest.

- **🗂️ Bring what you already have.** Artwork that ES-DE, RetroArch or LaunchBox downloaded on the device shows up straight away, and saves, states, RetroArch settings and BIOS files from RetroArch come over with one tap.
- **📡 Your NAS is the library.** Browse thousands of games over SMB, SFTP, WebDAV or FTP with full artwork. Nothing is copied ahead of time: a game downloads when you press Play, and big games you haven't played in a while are cleared to free space.
- **🔄 Continue on another device.** Saves and save states sync with your storage. Pick up your handheld and the home screen offers to continue the game you were playing on your phone, from the same moment. Devices without shared storage pair over Wi-Fi with a 6-digit code.
- **⚙️ RetroArch, set up for you.** Mirmire downloads cores, sets hotkeys, auto-resume and a sharp picture, and suggests settings for your device. Change any setting for all games, one console or one game, without opening RetroArch's menus, and frame the picture with console or game bezels from The Bezel Project.
- **🟩 Xbox, PlayStation 2 and 3, Steam, and faster drivers.** Original Xbox games play in hakuX, Xbox 360 games in Xendroid Plus, PS2 in ARMSX2, PS3 in ARMSX3 or aPS3e, and Steam games from your DroidDeck library folders in DroidDeck. Emulators that aren't on Google Play install straight from Mirmire. On Snapdragon devices, Mirmire detects your Adreno GPU and finds the latest custom GPU drivers for the emulators that can load them.
- **🧹 A clean library.** One version of each game, picked by your preferred regions. Betas and demos are hidden, and files are checked against No-Intro, so bad dumps stand out.
- **🧩 BIOS checker.** See what each console needs and what's missing or the wrong version, then copy the right files from your storage with one tap.
- **✈️ Pack for a trip.** Choose games to take offline, then play on the plane. Everything syncs back when you're home. Offload a game later without losing its saves.
- **💡 Stick lights that react.** On Retroid and AYN handhelds, the stick lights follow the theme, the battery level, the console, the game's cover art or its performance mode. A one-time setup right on the device turns this on, with no computer or Shizuku needed.
- **👨‍👩‍👧 Profiles for the whole family.** Each player has their own saves, favorites and play time, with PINs and a content filter for children.
- **🧱 A Home page you build.** Turn on the Home page for widgets: clock, weather, calendar, your last game, achievements, play time, background music from your storage, widgets from your other apps, and **plugins** made by players and shared as a ZIP, like **Pixel Pal**, with hundreds of pets from OpenPets to choose from. Drag and resize them by touch, as on a phone, or arrange them with a controller.
- **✨ AI for your pal.** Set up AI once under **Settings › AI** (a free cloud key, your own server, or a model on the device). Pixel Pal can share short game tips and chat; optionally float over a game on one-screen devices.
- **📺 Big Picture.** A full-screen, controller-first home for TVs: big cards for your consoles and games, with the time, battery and RetroAchievements on a small bar at the bottom. Plug into a TV or dock and it switches on by itself.
- **🪟 Dual screen.** On the AYN Thor, AYANEO Pocket DS or with a Retroid Dual Screen add-on, the second screen shows the selected game's art, description, achievements, manual and map, or your widgets, at the main screen's size. Swap the screens to put the menu on the bottom one. DS and 3DS games get the second screen to themselves, and themes can give the second screen its own wallpaper.
- **😴 Saves upload when you sleep.** Press power mid-game and the saves go to your storage, so your other device can carry on.
- **🎮 Play together.** Invite a paired device on the same Wi-Fi to a netplay game. Your device starts hosting by itself.
- **🌡️ Learns how hot each game runs.** Mirmire picks a battery, standard or performance mode per console, and steps down for games that ran hot.
- **🎨 Design your own look.** [Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/) lets you build a theme, an icon pack or a widget plugin in your browser with a live preview of the app. Download the ZIP and import it.

| Continue on another device | Library cleanup |
|---|---|
| ![Continue on another device](screenshots/47-continue.jpg) | ![Library cleanup](screenshots/45-library-cleanup.jpg) |
| **BIOS checker** | **Stick lights** |
| ![BIOS files](screenshots/48-bios.jpg) | ![Stick lights](screenshots/36-device-lights.jpg) |

## Make it yours with Theme Studio

<p align="center"><a href="https://mirmire-launcher.github.io/mirmire/theme-maker/"><b>Open Theme Studio →</b></a></p>

Theme Studio runs in your browser, with nothing to install, and nothing you add is uploaded.

- **Live preview:** see your theme on Mirmire's home screen, games list, game page, Spotlight and Settings as you edit. Move around with the arrow keys, as with a controller, and hear your sounds.
- **Colors from one color:** pick one color and it builds a full palette, with readability checks.
- **Remix or start fresh:** begin from any of Mirmire's 15 built-in themes, including the patterned Pearl and Sky Console, or open any theme or icon pack ZIP to edit it.
- **Widget plugins:** write a Home page widget from a template and try it on a copy of the Home page, with sample games and achievements.
- **Dual-screen preview:** see your theme on both screens of a dual-screen handheld, and choose the second screen's wallpaper, what's behind a game's details and what shows when nothing is selected.
- **Bring your own files:** drop in your wallpaper, console icons, backdrops, sounds and music. Files named like other frontends' sets are sorted automatically.

When you're done, download the ZIP and import it in **Settings › Look**. See [Make your own themes and icon packs](docs/CREATING.md) and [Make widget plugins](docs/PLUGINS.md) for tips.

## Everything else

- **Built for controllers:** every screen works with a gamepad, keyboard or touch, with Xbox, PlayStation or Nintendo button labels.
- **Text and icon size:** make everything bigger or smaller, like Android's display size, with a separate size for a second screen.
- **Manuals and maps:** read a game's manual or look at its map, from ScreenScraper, your gamelists or ES-DE and LaunchBox.
- **Console-menu themes:** Green, Blue, Neon, Pearl and Sky Console, each with matching stick-light colors.
- **Three ways to browse:** a list with a preview pane, a cover grid, or a showcase wheel, with box art, 3D boxes, screenshots, title screens, cartridges or fan art, and video previews.
- **Spotlight:** the RetroAchievements weekly challenge, games close to mastery, quick and multiplayer picks, and your play time with battery estimates.
- **RetroAchievements:** progress on every game card and on each game's page.
- **Backups:** back up settings, themes and RetroArch's settings to your storage, restore on any device, or keep devices in sync.
- **Home screen:** works as your launcher on handhelds and TVs, with a home screen widget on phones and shortcuts to Android's own Wi-Fi, Bluetooth, display and other settings.
- **Keep the screen on:** while Mirmire is open, always or only while charging.

## Download

Get the latest APK from the [Releases](https://github.com/Mirmire-Launcher/mirmire/releases/latest) page and install it on your device. Android may ask you to allow installs from your browser or file manager the first time.

Once installed, Mirmire checks for new versions once a day and installs them from **Settings › System › App updates**.

**Requirements:** Android 8.0 or later, and RetroArch or a standalone emulator for the consoles you want to play.

New here? Read the **[User guide](docs/GUIDE.md)**.

## Screenshots

### Home

| Consoles | All games: list |
|---|---|
| ![Consoles](screenshots/01-consoles.jpg) | ![List view](screenshots/02-games-list.jpg) |
| **Cover grid** | **Showcase** |
| ![Grid view](screenshots/03-games-grid.jpg) | ![Showcase view](screenshots/04-games-showcase.jpg) |
| **Inside a console** | **Search** |
| ![Console games](screenshots/05-console-games.jpg) | ![Search](screenshots/08-search.jpg) |
| **Android apps** | |
| ![Apps](screenshots/09-apps.jpg) | |

### Home page, Pixel Pal and AI

| Home with Pixel Pal | Pixel Pal AI hints |
|---|---|
| ![Home page with Pixel Pal](screenshots/61-home-ai.jpg) | ![Pixel Pal AI hints](screenshots/62-pixel-pal-ai.jpg) |
| **Pal over a game** | **Chat while you play** |
| ![Pixel Pal overlay](screenshots/63-pal-overlay.jpg) | ![Pixel Pal chat](screenshots/64-pal-chat.jpg) |
| **Add a widget / plugin** | **Choose a pet** |
| ![Widget plugins](screenshots/54-widget-plugins.jpg) | ![Pixel Pal pets](screenshots/55-pixel-pet.jpg) |

### Big Picture

| Main menu | Consoles |
|---|---|
| ![Big Picture](screenshots/56-big-picture.jpg) | ![Big Picture consoles](screenshots/56b-big-picture-consoles.jpg) |

### Dual screen

| Both screens (AYN Thor style) | A console on the second screen |
|---|---|
| ![Dual screen](screenshots/57-dual-screen.jpg) | ![Console on the second screen](screenshots/58-second-screen-console.jpg) |
| **Widgets on the second screen** | |
| ![Widgets on the second screen](screenshots/59-second-screen-widgets.jpg) | |

### Game details

| Details | Description and achievements |
|---|---|
| ![Game details](screenshots/06-game-details.jpg) | ![Achievements](screenshots/07-game-details-achievements.jpg) |

### RetroArch

| Setup | Suggestions for this device |
|---|---|
| ![RetroArch](screenshots/12-settings-retroarch.jpg) | ![Device suggestions](screenshots/13b-retroarch-suggestions.jpg) |
| **Settings for all games** | **Per console** |
| ![All games](screenshots/13-retroarch-device.jpg) | ![Per console](screenshots/14-retroarch-per-console.jpg) |
| **Per game** | |
| ![Per game](screenshots/15-retroarch-per-game.jpg) | |

### Settings

| Library | Emulators |
|---|---|
| ![Library](screenshots/10-settings-library.jpg) | ![Emulators](screenshots/11-settings-emulators.jpg) |
| **Trophies** | **Artwork** |
| ![Trophies](screenshots/16-settings-trophies.jpg) | ![Artwork](screenshots/17-settings-artwork.jpg) |
| **Look: themes** | **Look: style** |
| ![Look](screenshots/18-settings-look.jpg) | ![Style](screenshots/18b-look-icons.jpg) |
| **Layout** | **Controls** |
| ![Layout](screenshots/19-settings-layout.jpg) | ![Controls](screenshots/20-settings-controls.jpg) |
| **Storage** | **System** |
| ![Storage](screenshots/21-settings-storage.jpg) | ![System](screenshots/22-settings-system.jpg) |
| **App updates** | **Reset settings** |
| ![Updates](screenshots/23-system-updates.jpg) | ![Reset](screenshots/24-reset-dialog.jpg) |

### Console themes

Blue, Neon, Sky and Pearl Console (Green Console is the fifth):

![Console themes](screenshots/60-console-themes.jpg)

### Stick lights

| Light options | Console colors |
|---|---|
| ![Stick lights](screenshots/36-device-lights.jpg) | ![Console colors](screenshots/37-console-colors.jpg) |
| **A console's color** | **A game's color** |
| ![Console color picker](screenshots/38-console-color-picker.jpg) | ![Game light](screenshots/39-game-light.jpg) |

### Spotlight, cleanup and more

| Spotlight | Play together |
|---|---|
| ![Spotlight](screenshots/40-spotlight.jpg) | ![Play together](screenshots/41-spotlight-play-together.jpg) |
| **Library cleanup** | **Didn't pass check** |
| ![Library cleanup](screenshots/45-library-cleanup.jpg) | ![Didn't pass check](screenshots/42-library-filter.jpg) |
| **Continue on another device** | **BIOS files** |
| ![Continue on another device](screenshots/47-continue.jpg) | ![BIOS files](screenshots/48-bios.jpg) |
| **Profiles** | **Content filter** |
| ![Profiles](screenshots/51-profiles.jpg) | ![Content filter](screenshots/50-profile-filter.jpg) |
| **Pack for a trip** | **Backups** |
| ![Pack for a trip](screenshots/49-pack-trip.jpg) | ![Backups](screenshots/52-backups.jpg) |

### Guided setup

| Welcome | Pick a theme |
|---|---|
| ![Welcome](screenshots/31-setup-welcome.jpg) | ![Theme](screenshots/32-setup-theme.jpg) |
| **Connect your library** | **You're all set** |
| ![Library](screenshots/33-setup-library.jpg) | ![Done](screenshots/35-setup-done.jpg) |

### Portrait

| Consoles | Games | Details | Settings |
|---|---|---|---|
| ![Portrait consoles](screenshots/27-portrait-consoles.jpg) | ![Portrait games](screenshots/28-portrait-games.jpg) | ![Portrait details](screenshots/29-portrait-details.jpg) | ![Portrait settings](screenshots/30-portrait-settings.jpg) |

---

This repository only hosts releases. Game artwork in the screenshots comes from ScreenScraper and the Libretro thumbnail project and belongs to its respective owners. Mirmire doesn't include any games.
