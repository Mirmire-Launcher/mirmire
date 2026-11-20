# Using rclone with Mirmire (Google Drive, Dropbox, OneDrive, …)

Mirmire does not talk to Google or Dropbox directly. It connects to **[rclone serve webdav](https://rclone.org/commands/rclone_serve_webdav/)** on a PC or NAS on the same network. rclone handles the cloud login; Mirmire sees a normal WebDAV library.

## 1. Install and configure rclone

On a computer that stays on (or your NAS):

1. Install [rclone](https://rclone.org/install/).
2. Run `rclone config` and add a remote for Drive, Dropbox, OneDrive, etc. (name it e.g. `gdrive` or `dropbox`).
3. Put your ROMs on that remote in **console folders**, same as a NAS library:

```text
roms/
  snes/
  psx/
  gba/
  …
```

Example upload:

```bash
rclone copy ~/ROMs gdrive:roms --progress
```

## 2. Serve WebDAV

While Mirmire needs the library, keep this running on the same machine:

```bash
rclone serve webdav gdrive:roms --addr :8080 --user mirmire --pass secret
```

- Replace `gdrive:roms` with your remote and path.
- `--user` / `--pass` are optional but recommended on a home LAN.
- Default port in Mirmire for rclone is **8080**.

Firewall: allow inbound TCP 8080 from your phone/handheld on the LAN.

## 3. Connect in Mirmire

1. **Settings → Library → Add library** (or setup wizard).
2. Choose **rclone**.
3. **Address** = the PC/NAS LAN IP (e.g. `192.168.1.20`).
4. **Port** = `8080` (or whatever you used in `--addr`).
5. Username / password = the `--user` / `--pass` values (leave blank if you did not set them).
6. **Connect & browse** → pick the folder that contains `snes`, `psx`, etc. (often the top of the serve root — leave path empty).
7. **Save & scan**.

Use a **local game folder** on the device as usual: games download from rclone’s WebDAV when you press Play.

## Tips

- The serve process must be running whenever you sync, browse, or download.
- Same Wi‑Fi (or routed LAN) as the handheld; cellular will not reach a home `192.168.` address unless you use a VPN.
- For HTTPS, put rclone behind a reverse proxy and turn on **Use HTTPS** in Mirmire; plain HTTP on the LAN is the usual setup.
- Saves, BIOS, and artwork sync use the same library connection — once rclone serve is up, they behave like any other network library.
- You can run several remotes as separate serves on different ports, or one serve pointed at a folder that already holds all consoles.

## Not supported here

- Running rclone **inside** the Android app
- Native Google / Dropbox sign-in without a serve bridge

Those would be separate features; rclone serve is the supported path for consumer clouds today.
