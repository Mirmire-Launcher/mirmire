# Make widget plugins

A **widget plugin** adds a widget to Mirmire's Home page: a pet, a clock, a quote of the day, a game picker, anything you can draw in a small web page. Plugins are ZIP files you import like a theme or an icon pack, so you can share them with anyone.

The easiest way to make one is the **Plugin** mode of **[Theme Studio](https://mirmire-launcher.github.io/mirmire/theme-maker/)**. Pick a template, edit the code, and see it live on a copy of the Home page, with sample games and achievements. Then press **Download ZIP**.

## What's in a plugin

```
my-plugin.zip
├── plugin.json     what it is, its sizes and its permissions
├── index.html      the widget itself
└── ...             any images, fonts, scripts or styles it uses
```

Put `plugin.json` at the top of the ZIP. A ZIP holding one folder with `plugin.json` inside works too.

### plugin.json

```json
{
  "id": "pixel-pet",
  "name": "Pixel Pal",
  "author": "Your name",
  "version": 1,
  "description": "A little pixel creature that lives on your home page.",
  "entry": "index.html",
  "sizes": ["small", "wide", "medium"],
  "defaultSize": "wide",
  "permissions": []
}
```

| Field | Meaning |
|---|---|
| `id` | A unique name of lowercase letters, numbers and dashes. Importing a plugin with the same `id` replaces the old one. |
| `name` | Shown in the widget list. |
| `author`, `description` | Shown when someone installs it. |
| `version` | A whole number. Raise it when you share an update. |
| `entry` | The page to open. Usually `index.html`. |
| `sizes` | The sizes your widget can be: `small` (1×1), `wide` (2×1), `medium` (2×2) and `large` (4×2). |
| `defaultSize` | The size it starts at. One of `sizes`. |
| `permissions` | What else it may do: `internet`, `library`, `achievements` and `ai`. Leave it empty if it needs none. |
| `settings` | Optional. A page for the widget's own options, such as choosing a pet. Players open it from **Widget options** in the widget's edit menu. |

### Permissions

Players see a plugin's permissions before they install it, so ask only for what you use.

| Permission | Allows |
|---|---|
| *(none)* | Drawing itself, reacting to being selected, and keeping up to 64 KB of its own data. |
| `internet` | Loading images and data from the web. Without it, every request outside the plugin's own files is blocked. With it, web requests go through Mirmire: they're cached, so what the plugin loaded once also works offline, and any site can be read with `fetch()`, whatever its CORS settings. |
| `library` | `mirmire.games.recent()`, `all()` and `open(id)`. |
| `achievements` | `mirmire.achievements()`: RetroAchievements points, rank, this week's unlocks and the streak. |
| `ai` | `mirmire.ai`: short lines from an AI model the player sets up, about a game or their collection. See [AI](#ai). |

## The `window.mirmire` API

Mirmire adds `window.mirmire` before your own scripts run.

```js
mirmire.version        // 1
mirmire.size           // "small", "wide", "medium" or "large"; "settings" on the options page
mirmire.theme          // { dark: true, colors: { primary: "#F5B54A", surface: "#1C1B22", ... } }

mirmire.storage.get("key")          // a string, or null
mirmire.storage.set("key", "value") // pass null to remove it

// With the "library" permission:
mirmire.games.recent(5)  // the last games played, newest first
mirmire.games.playing()  // the game being played right now (launched from Mirmire), or null; on a handheld's second
                         // screen your widget stays visible while it runs
mirmire.games.all()      // every visible game (up to 5,000)
mirmire.games.open(id)   // opens that game's page

mirmire.bubble("Hi!", { ms: 3000, ai: false, x: 0.5 })
                       // a speech bubble Mirmire draws just above the widget, so it isn't cut off at the edges;
                       // x is where it points (0 = left, 1 = right), ai: true adds an "AI" tag
mirmire.openSettings() // opens the plugin's options page (needs "settings" in plugin.json)
mirmire.openPage("chat.html") // opens another of the plugin's own pages full screen, like its options page
mirmire.close()        // on the options page: closes it

// With the "achievements" permission:
mirmire.achievements()   // { user, points, rank, weekUnlocks, weekPoints, streakDays, mastered, beaten } or null
```

A game looks like this:

```json
{ "id": 42, "title": "Concentration Room", "system": "nes", "systemName": "Nintendo Entertainment System",
  "cover": "https://...", "favorite": false, "lastPlayed": 1731580000000, "playTimeMinutes": 95, "onDevice": true }
```

`cover` is a web address; showing it needs the `internet` permission too.

### AI

With the `ai` permission, a plugin can ask Mirmire's AI for a short line about a game (a tip, a fun fact or a comment on
the collection) and, from a full-screen page, hold a chat the player types. The player sets the AI up once in
**Settings › AI**, and turns it on or off for each plugin on that plugin's options page. It's off until they turn it on.

- **Where it runs (chosen in Settings › AI):** Google Gemini, Groq or OpenRouter (free tiers, with the player's own API key),
  any server with an OpenAI-style API (LM Studio or Ollama on a PC), or a model downloaded to the device (Qwen3 0.6B,
  344 MB; Qwen3 1.7B, 977 MB; Gemma 4 E2B, 2.6 GB; Gemma 4 E4B, 3.7 GB).
- **What's sent:** for hints, Mirmire writes the question itself from the game's title and console, or a few titles from the
  collection; a plugin can't add its own text. A chat sends what the player types and the last game's title. File paths,
  accounts and keys are never sent.
- **Keys:** kept in Mirmire's private storage on the device, never in backups or logs, and never shown to plugins.
- **Where the player is:** with the `achievements` permission too, hints about the game being played (and chat) include
  RetroAchievements' live status for it, such as "World 3-2, 4 lives", when the player is signed in to RetroAchievements
  and the game has one. Their RetroAchievements name is never sent.
- **Limits:** hints, one every 4 minutes and 30 a day per plugin; chat, one message every 2 seconds and 150 a day.
  `test()` doesn't count.

```js
// Any page:
mirmire.ai.status()  // { enabled, ready, provider, providerLabel }: enabled = on for this plugin, ready = set up in Settings
mirmire.ai.ask("game", gameId, { name: "Mochi" }).then((r) => { if (r.ok) say(r.text); })   // r = { ok, text } or { ok: false, error }
// kinds: "game" (just played), "playing" (being played now), "collection" (a few of the player's games)
// name: what the AI calls itself (letters, digits and spaces, up to 20); "Mirmire" when empty
mirmire.ai.settings()   // opens Settings › AI

// Only on a full-screen page (the options page, or one opened with openPage):
mirmire.ai.configure({ enabled: true })   // this plugin's switch; returns the new status
mirmire.ai.test({ name: "Mochi" })        // a Promise like ask(); shows whether the setup works
mirmire.ai.chat([{ role: "user", text: "Any tips for Contra?" }], { name: "Mochi" })
                                     // a conversation the player types: the last 12 messages ("user" or "assistant"),
                                     // each up to 500 characters; the most recently played game is mentioned to the AI.
                                     // Resolves to { ok, text } or { ok: false, error }
```

Hint replies are a single line of plain text, at most about 160 characters; chat replies are up to a few sentences.
When the AI isn't set up, the quota is used up or the device is offline, `ask()` returns `{ ok: false }`. Fall back to your
own lines quietly, and mark AI lines so players can tell them apart (Pixel Pal adds an **AI** tag to its speech bubble).

### Events

```js
// The player pressed A (or tapped) on your widget.
window.addEventListener("mirmire:select", () => feed());

// The player switched themes. mirmire.theme has the new colors.
window.addEventListener("mirmire:theme", () => redraw());
```

### Theme colors

The theme's colors are set as CSS variables on the page, so your widget matches every theme without extra work:

```css
.title { color: var(--primary); }
.card  { background: var(--surface-variant); color: var(--on-surface); border-color: var(--outline); }
```

The variables are `--primary`, `--on-primary`, `--secondary`, `--tertiary`, `--background`, `--on-background`, `--surface`, `--on-surface`, `--surface-variant`, `--on-surface-variant`, `--outline` and `--error`.

The page background is transparent: Mirmire draws the card behind your widget, with the theme's shape, and the focus outline around it.

### An options page

Add `"settings": "settings.html"` to `plugin.json` and a `settings.html` next to `index.html`. It opens full screen, with the same `window.mirmire` and the same storage as the widget, so save choices with `mirmire.storage.set()`. When it closes, the widget reloads to pick them up. On a controller, the arrow keys reach the page as `keydown` events and A clicks the focused element, so use real buttons and inputs and move focus with the arrows. B closes the page.

Theme Studio previews the widget page only; add an options page (or other pages you open with `mirmire.openPage`) to the ZIP by hand. In the preview, `mirmire.ai` gives sample answers, `mirmire.bubble` shows along the top, and `mirmire.games.playing()` returns the first sample game.

## Tips

- **Size with the page, not with pixels.** The widget fills its card. Use `vh`, `vw`, percentages or flexbox, and check every size you list in Theme Studio.
- **Keep it light.** Several widgets can be on screen at once, often on a handheld. Avoid heavy animation loops; pause them when `document.hidden` is true.
- **Don't expect a mouse.** Players select your widget with a controller. React to `mirmire:select` rather than to clicks on small buttons.
- **No links.** Navigation away from the plugin's page is blocked. Use `mirmire.games.open(id)` to open a game.
- **Store little.** `mirmire.storage` holds up to 64 KB per plugin, and stays on the device.
- **Only share what you're allowed to.** Credit art, fonts and sounds in `author` or a README in the ZIP.

## Install a plugin

- **Settings › Plugins › Add a plugin**, or
- on the Home page, **Edit › Add widget › Plugins › Import a plugin ZIP**.

Mirmire shows the plugin's name, author and permissions, and installs it when you press **Install**. Then add it from **Add widget › Plugins**. To turn a plugin off or remove it, open **Settings › Plugins**.

## Troubleshooting

| Problem | Fix |
|---|---|
| "No plugin.json in that ZIP" | Zip the plugin folder's contents, so `plugin.json` is at the top. |
| The widget is blank | Check that `entry` names your page, and that sizes use `vh`/`%` rather than a fixed height. On a computer, Theme Studio's preview shows script errors as a message. |
| An image or font doesn't load | Paths are relative to the ZIP's top, for example `img/cat.png`. Web addresses need the `internet` permission. |
| `mirmire.games` returns nothing | Add `library` to `permissions`, then import the plugin again. |
| The old version still shows | Use the same `id` to replace a plugin. |
