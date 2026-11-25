<p align="center"><img src="docs/images/mirmire-icon.svg" alt="Mirmire" width="96"></p>

<h1 align="center">Mirmire</h1>

<p align="center"><b>A retro game launcher for Android handhelds, phones and TVs that plays your whole library straight from your NAS.</b></p>

<p align="center">
  <a href="https://github.com/Mirmire-Launcher/mirmire/releases/latest"><b>⬇ Download</b></a>
  &nbsp;·&nbsp;
  <a href="docs/GUIDE.md"><b>📖 User guide</b></a>
  &nbsp;·&nbsp;
  <a href="https://mirmire-launcher.github.io/mirmire/theme-maker/"><b>🎨 Theme Studio</b></a>
</p>

<p align="center"><img src="screenshots/02-games-list.jpg" alt="Mirmire's games list" width="900"></p>

<p align="center">
  <img src="screenshots/53-home-page.jpg" alt="Home page" width="296">
  <img src="screenshots/03-games-grid.jpg" alt="Cover grid" width="296">
  <img src="screenshots/06-game-details.jpg" alt="Game details" width="296">
</p>

Most launchers expect your games on the device and leave the emulators, saves and BIOS files to you. Mirmire is built around a library that lives on your storage, and takes care of the rest.

## Highlights

### 📡 Your NAS is the library

Browse thousands of games over SMB, SFTP, WebDAV or FTP with full artwork, straight from your [RomM](docs/GUIDE.md#romm) server with its covers and saves, or from Google Drive, Dropbox and OneDrive through [rclone](docs/RCLONE.md). Away from home, the same library keeps working through [Tailscale](docs/GUIDE.md#adding-your-games). Nothing is copied ahead of time: a game downloads when you press Play, and big games you haven't played in a while are cleared to free space. Artwork that ES-DE, RetroArch or LaunchBox already downloaded shows up straight away, and favorites, play time and collections come over from [Pegasus and LaunchBox](docs/GUIDE.md#bring-over-from-pegasus-or-launchbox).

### 🔄 Pick up where you left off, on any device

Saves, save states and favorites sync with your storage. Pick up your handheld and the home screen offers to continue the game you were playing on your phone, from the same moment. Press power mid-game and your saves upload before the device sleeps. Devices without shared storage pair over Wi-Fi with a 6-digit code, or sync saves through [Syncthing](docs/GUIDE.md#syncthing). Played the same game on two devices before they synced? Mirmire asks which save to keep, or keeps both, and never overwrites progress.

| Sync & backup | Continue on another device |
|---|---|
| ![Sync and backup](screenshots/61-settings-sync.jpg) | ![Continue on another device](screenshots/47-continue.jpg) |

### ⚙️ RetroArch and standalone emulators, set up for you

Mirmire downloads cores, sets hotkeys, auto-resume and a sharp picture, and suggests settings for your device. Change any setting for all games, one console or one game without opening RetroArch's menus, and frame the picture with bezels from The Bezel Project.

Original Xbox plays in hakuX, Xbox 360 in Xendroid Plus, PS2 in ARMSX2, PS3 in ARMSX3 or aPS3e, and Steam games from your DroidDeck library in DroidDeck. Emulators that aren't on Google Play install straight from Mirmire, and on Snapdragon devices it finds the latest custom Adreno drivers for the emulators that can load them.

| Settings for every game | Just this console |
|---|---|
| ![RetroArch settings](screenshots/13-retroarch-device.jpg) | ![Per console](screenshots/14-retroarch-per-console.jpg) |

### 🧹 A clean, complete library

One version of each game, picked by your preferred regions. Betas and demos are hidden, files are checked against No-Intro so bad dumps stand out, and the BIOS checker tests every file each emulator needs by checksum, says exactly which folder it belongs in, and copies the right files from your storage. A game whose console is missing one tells you before you press Play.

| Library cleanup | BIOS files |
|---|---|
| ![Library cleanup](screenshots/45-library-cleanup.jpg) | ![BIOS files](screenshots/48-bios.jpg) |

### 🧱 A Home page you build

Clock, weather, calendar, your last game, achievements, play time, music from your storage, widgets from your other apps, and **plugins** shared as a ZIP, like Pixel Pal: a pal that lives on your home page, with hundreds of characters from OpenPets. Drag and resize widgets by touch, or arrange them with a controller.

Turn on AI in **Settings › AI** and Pixel Pal shares tips about the game you just played, chats when you're stuck and can float over the game. Use a free cloud AI (Gemini, Groq or OpenRouter) with your own key, your own server, or a model that runs offline on the device. Only game titles, consoles and what you type are sent.

| Edit the Home page | Pixel Pal |
|---|---|
| ![Edit the Home page](screenshots/64-home-edit.jpg) | ![Pixel Pal](screenshots/55-pixel-pet.jpg) |
| **Welcome back** | **Chat while you play** |
| ![Pixel Pal welcomes you back after a game](screenshots/66-home-welcome.jpg) | ![Chat with Pixel Pal over a running game](screenshots/65-pal-chat.jpg) |

### 🖥️ Your PC games, streamed

Games you stream with Moonlight, Artemis or Steam Link sit in their own **Streaming** console, next to everything else. Press Play and the game opens straight in the stream. A streamed game that's also in your Steam library shows once, with a **Stream** button.

### 👨‍👩‍👧 Parental controls

Child profiles see only games up to the age you choose, using ESRB, PEGI and CERO ratings from ScreenScraper, RomM and LaunchBox. Set daily play time, allow or block single games, and keep it all behind a parent PIN. A running game is never cut off.

| Parental controls | Daily play time |
|---|---|
| ![Parental controls](screenshots/67-parental.jpg) | ![Daily play time for a child](screenshots/68-parental-time.jpg) |

### 📺 Big Picture and 🪟 dual screen

Big Picture is a full-screen, controller-first home for TVs that switches on by itself when you dock. On the AYN Thor, AYANEO Pocket DS or a Retroid Dual Screen add-on, the second screen shows the selected game's art, description, achievements, manual and map, or your widgets.

| Big Picture | Dual screen |
|---|---|
| ![Big Picture](screenshots/56-big-picture.jpg) | ![Dual screen](screenshots/57-dual-screen.jpg) |

### 🧊 Big Picture in 3D, with Mirmire Cartouche

Prefer your consoles in 3D? [Mirmire Cartouche](https://github.com/Mirmire-Launcher/mirmire-cartouche), built on [Cartouche](https://github.com/Hakimba/cartouche) by Hakimba, makes Big Picture a 3D home: your consoles as 3D models and your games as their real discs, cartridges and UMDs, with Mirmire's box art as their labels. It's a free, open-source add-on: install it from **Settings › Plugins**, then pick **Settings › Layout › Big Picture style › Cartouche 3D**, or say yes to the 3D Big Picture step in setup. Mirmire still plays every game, so your emulators, saves, achievements and play time stay the same.

| The 3D home | Your consoles in 3D |
|---|---|
| ![Mirmire Cartouche's 3D home, with Consoles selected](screenshots/56c-cartouche-home.jpg) | ![The Xbox 360 selected among your consoles](screenshots/56g-cartouche-consoles.jpg) |

### 💡 Stick lights that react

On Retroid and AYN handhelds, the stick lights follow the theme, the battery level, the console, the game's cover art or its performance mode. A one-time setup right on the device turns this on, with no computer or Shizuku needed.

| Light options | A game's color |
|---|---|
| ![Stick lights](screenshots/36-device-lights.jpg) | ![Game light](screenshots/39-game-light.jpg) |

### And more

- **👥 Profiles:** each player has their own saves, favorites and play time, with a PIN and a pixel-art avatar if you like.
- **🧩 Plugins:** add widgets from a ZIP and turn each one on or off in **Settings › Plugins**, or make your own in Theme Studio.
- **🏠 Home Assistant:** dim the lights when a game starts on the TV, or run any scene or script when you play, stop or step away.
- **✈️ Pack for a trip:** choose games to take offline. Everything syncs back when you're home.
- **🎮 Play together:** invite a paired device on the same Wi-Fi to a netplay game.
- **🌡️ Learns how hot each game runs:** a battery, standard or performance mode per console, stepping down for games that ran hot.
- **🏆 RetroAchievements:** progress on every game card, the weekly challenge and games close to mastery in Spotlight.
- **🎨 Built for controllers:** every screen works with a gamepad, keyboard or touch, with Xbox, PlayStation or Nintendo button labels.
- **📖 Manuals and maps** from ScreenScraper, your gamelists, ES-DE or LaunchBox.
- **⬆️ Upload local games:** games in your local folder that are missing on the NAS go up with one tap in **Settings › Library**.
- **🎮 Standalone defaults that fit:** Automatic prefers DuckStation for PS1, Mupen64Plus FZ for N64, WatermelonDS for DS and ARMSX2 for PS2 when they're installed.
- **🔊 Volume in Settings › Device**, for handhelds where the buttons are hard to reach.

## Make it yours with Theme Studio

[Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/) builds a theme, an icon pack or a widget plugin in your browser, with a live preview of the app. Nothing you add is uploaded.

- **Colors from one color:** pick one and it builds a full palette, with readability checks.
- **Remix or start fresh:** begin from any of Mirmire's 15 built-in themes, or open any theme or icon pack ZIP.
- **Dual-screen preview:** see your theme on both screens of a dual-screen handheld.
- **Bring your own files:** wallpaper, console icons, backdrops, sounds and music. Files named like other frontends' sets are sorted automatically.

Download the ZIP and import it in **Settings › Look**. See [Make your own themes and icon packs](docs/CREATING.md) and [Make widget plugins](docs/PLUGINS.md).

![Theme Studio with a live preview of a Mirmire theme remix](docs/images/site/theme-studio.jpg)

## Download

Get the latest APK from [Releases](https://github.com/Mirmire-Launcher/mirmire/releases/latest). Android may ask you to allow installs from your browser or file manager the first time. After that, Mirmire checks for new versions once a day and installs them from **Settings › System › App updates**.

**Requirements:** Android 8.0 or later, and RetroArch or a standalone emulator for the consoles you want to play. New here? Read the **[User guide](docs/GUIDE.md)**.

## Screenshots

<details>
<summary><b>Browse and play</b></summary>

| Consoles | Inside a console |
|---|---|
| ![Consoles](screenshots/01-consoles.jpg) | ![Console games](screenshots/05-console-games.jpg) |
| **List** | **Cover grid** |
| ![List view](screenshots/02-games-list.jpg) | ![Grid view](screenshots/03-games-grid.jpg) |
| **Showcase** | **Search** |
| ![Showcase view](screenshots/04-games-showcase.jpg) | ![Search](screenshots/08-search.jpg) |
| **Game details** | **Description and achievements** |
| ![Game details](screenshots/06-game-details.jpg) | ![Achievements](screenshots/07-game-details-achievements.jpg) |
| **Spotlight** | **Play together** |
| ![Spotlight](screenshots/40-spotlight.jpg) | ![Play together](screenshots/41-spotlight-play-together.jpg) |
| **Android apps** | **Files that didn't pass the check** |
| ![Apps](screenshots/09-apps.jpg) | ![Didn't pass check](screenshots/42-library-filter.jpg) |

</details>

<details>
<summary><b>Home page, Big Picture and dual screen</b></summary>

| Home page | Add a widget |
|---|---|
| ![Home page](screenshots/53-home-page.jpg) | ![Widget plugins](screenshots/54-widget-plugins.jpg) |
| **Pixel Pal welcomes you back** | **Chat over a game** |
| ![Welcome back](screenshots/66-home-welcome.jpg) | ![Pal chat](screenshots/65-pal-chat.jpg) |
| **Big Picture** | **Big Picture consoles** |
| ![Big Picture](screenshots/56-big-picture.jpg) | ![Big Picture consoles](screenshots/56b-big-picture-consoles.jpg) |
| **Mirmire Cartouche starting up** | **Games on their discs** |
| ![Mirmire Cartouche's loading screen](screenshots/56f-cartouche-loading.jpg) | ![Battlefield 2: Modern Combat on its Xbox 360 disc](screenshots/56d-cartouche-shelf.jpg) |
| **Big Picture style** | **Mirmire Cartouche in Settings › Plugins** |
| ![Big Picture style: Mirmire or Cartouche 3D](screenshots/56e-big-picture-style.jpg) | ![Settings › Plugins with Mirmire Cartouche installed](screenshots/56h-cartouche-plugins.jpg) |
| **A console on the second screen** | **Widgets on the second screen** |
| ![Console on the second screen](screenshots/58-second-screen-console.jpg) | ![Widgets on the second screen](screenshots/59-second-screen-widgets.jpg) |

</details>

<details>
<summary><b>Settings</b></summary>

| Library | Sync & backup |
|---|---|
| ![Library](screenshots/10-settings-library.jpg) | ![Sync and backup](screenshots/61-settings-sync.jpg) |
| **Artwork** | **Storage** |
| ![Artwork](screenshots/17-settings-artwork.jpg) | ![Storage](screenshots/21-settings-storage.jpg) |
| **Emulators** | **RetroArch** |
| ![Emulators](screenshots/11-settings-emulators.jpg) | ![RetroArch](screenshots/12-settings-retroarch.jpg) |
| **Trophies** | **AI** |
| ![Trophies](screenshots/16-settings-trophies.jpg) | ![AI](screenshots/63-settings-ai.jpg) |
| **Look** | **Style and console icons** |
| ![Look](screenshots/18-settings-look.jpg) | ![Style](screenshots/18b-look-icons.jpg) |
| **Layout** | **Controls** |
| ![Layout](screenshots/19-settings-layout.jpg) | ![Controls](screenshots/20-settings-controls.jpg) |
| **Parental controls** | **Home Assistant** |
| ![Parental controls](screenshots/67-parental.jpg) | ![Home Assistant](screenshots/69-home-assistant.jpg) |
| **Device** | **System** |
| ![Device](screenshots/62-settings-device.jpg) | ![System](screenshots/22-settings-system.jpg) |
| **App updates** | **Reset settings** |
| ![Updates](screenshots/23-system-updates.jpg) | ![Reset](screenshots/24-reset-dialog.jpg) |

</details>

<details>
<summary><b>RetroArch</b></summary>

| Suggestions for this device | Per game |
|---|---|
| ![Device suggestions](screenshots/13b-retroarch-suggestions.jpg) | ![Per game](screenshots/15-retroarch-per-game.jpg) |

</details>

<details>
<summary><b>Library, sync and profiles</b></summary>

| Preferred regions | Backups |
|---|---|
| ![Preferred regions](screenshots/46-preferred-regions.jpg) | ![Backups](screenshots/52-backups.jpg) |
| **Pack for a trip** | **Profiles** |
| ![Pack for a trip](screenshots/49-pack-trip.jpg) | ![Profiles](screenshots/51-profiles.jpg) |
| **Content filter** | **Console light colors** |
| ![Content filter](screenshots/50-profile-filter.jpg) | ![Console colors](screenshots/37-console-colors.jpg) |

</details>

<details>
<summary><b>Guided setup</b></summary>

| Welcome | Pick a theme |
|---|---|
| ![Welcome](screenshots/31-setup-welcome.jpg) | ![Theme](screenshots/32-setup-theme.jpg) |
| **Connect your library** | **You're all set** |
| ![Library](screenshots/33-setup-library.jpg) | ![Done](screenshots/35-setup-done.jpg) |
| **Who's playing?** | |
| ![Who's playing: your name, color and avatar](screenshots/74-setup-players.jpg) | |

</details>

<details>
<summary><b>Portrait</b></summary>

| Consoles | Games | Details | Settings |
|---|---|---|---|
| ![Portrait consoles](screenshots/27-portrait-consoles.jpg) | ![Portrait games](screenshots/28-portrait-games.jpg) | ![Portrait details](screenshots/29-portrait-details.jpg) | ![Portrait settings](screenshots/30-portrait-settings.jpg) |

</details>

---

This repository only hosts releases.

<sub><b>Legal.</b> Mirmire is a launcher only. It doesn't include or provide any games, ROMs or BIOS files: use it with games you own and have the right to play. Games appear in the screenshots for illustration only. DOOM is a registered trademark of id Software LLC, a ZeniMax Media company. Nintendo, Super Nintendo, Game Boy, Nintendo 64, SEGA, Mega Drive, Genesis, PlayStation, Xbox, Steam, RetroArch, and all other game titles, console names and trademarks belong to their respective owners. Game artwork comes from ScreenScraper and the Libretro thumbnail project and belongs to its respective owners. Mirmire is an independent project and isn't affiliated with or endorsed by any of these companies. Profile avatars are made with [DiceBear](https://www.dicebear.com) (MIT): Adventurer and Lorelei by Lisa Wischofsky, Avataaars and Open Peeps by Pablo Stanley, Personas by Draftbit, Miniavs by Webpixels, Toon Head by Johan Melin and Big Ears by The Visual Team (CC BY 4.0, CC0 or the artist's free-use terms), and Critters, Clay, Voxel Art and Voxel Bot by DiceBear (CC0). Moonlight, Steam Link, Syncthing, Home Assistant, Tailscale, Pegasus and LaunchBox names and icons belong to their owners.</sub>
