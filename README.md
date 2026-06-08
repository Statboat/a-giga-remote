# Synthwave Arduino Remote (PWA)

This project is a browser-based Progressive Web App (PWA) that acts as a remote control panel for an Arduino board (for example, Arduino Giga R1) connected to a display.

The app lets you:
- Choose commands from a predefined command library.
- Build an ordered queue (staging list) of instructions.
- Add custom commands.
- Send the queued instructions to a target Arduino over HTTP `POST`.

## What The App Does

The interface is designed like a themed control console (`SYS_CONTROL`) with three main views:

1. Send Instructions
2. Definitions
3. Configuration

At runtime, the app builds a text payload from the staged commands and sends that payload to:

`http://<configured-arduino-ip>:80/`

The Arduino is expected to read the raw request body (`text/plain`) and decide how to render or process it.

## UI Features

## 1) Navigation Shell

- Top navbar with hamburger menu.
- Slide-out sidebar for switching views.
- Dark overlay that closes the sidebar when tapped.
- Single-page view switching (no page reload) by toggling active/hidden sections.

## 2) Send Instructions View

This is the primary control screen and has two main panels.

### Staging Area

- Shows the current queue of commands in send order.
- Each staged item displays a sequence number and command text.
- Each item has a delete button (`X`) to remove it from the queue.
- `SEND INSTRUCTIONS` sends the whole staged queue in one request.

### Command Palette

- Category tabs are generated dynamically from the command dataset.
- Selecting a tab filters visible command buttons to that category.
- Clicking a command button appends it to the staging area.

### Custom Command Input

- Text input + `ADD` button.
- Pressing Enter in the input also adds the custom command.
- Custom commands are appended to the same staging queue as presets.

## 3) Definitions View

- Read-only command dictionary generated from the same command dataset used by the palette.
- Each card shows:
	- Command name
	- Numeric ID (`c_number`)
	- Category
	- Description

## 4) Configuration View

- Input for Arduino IP address.
- `SAVE CONFIGURATION` stores the IP in `localStorage` under key `arduinoIP`.
- Saved value is loaded automatically on app start.

## How Messages Are Determined

The app determines outgoing messages using these rules:

1. Source commands
- Predefined commands come from the in-app `COMMANDS` array.
- Custom commands come from user input.

2. Queue order
- Commands are sent in exactly the order they appear in the staging list.
- Every click on a command (or custom add) appends a new item.
- Deleting a staged item removes only that queued instance.

3. Message formatting
- On send, each staged item is converted into plain text:

```text
<index>. [<category>] <command> (#<c_number>)
	 -> <description>
```

- Items are separated by blank lines.
- The final payload is one text block (`text/plain`), not JSON.

4. Validation before send
- If IP is missing: send is blocked with an alert.
- If queue is empty: send is blocked with an alert.

5. Destination
- Payload is posted to `http://<arduinoIP>:80/` via `fetch` using HTTP `POST`.

## Where Messages Go

- Network destination: the configured Arduino host IP on port `80`.
- HTTP path: root path `/`.
- Protocol: HTTP (not HTTPS).
- Method: `POST`.
- Body type: `text/plain`.

In short: the app does not directly write to the display. It sends text instructions to the Arduino endpoint, and the Arduino firmware is responsible for interpreting and showing/using them.

## PWA / Offline Behavior

The app includes:
- `manifest.json` for installable app metadata.
- `sw.js` service worker for caching app assets.

Service worker behavior:
- Caches core assets on install (`index.html`, CSS, JS, manifest, icon, font stylesheet).
- Deletes old caches on activation.
- Intercepts only `GET` requests.
- Leaves `POST` requests untouched so command sends to Arduino are always network requests.

## Data Persistence

Persisted locally:
- `arduinoIP` in browser `localStorage`.

Not persisted across reload by current code:
- Staging queue.
- Custom command history.

## Project Files

- `index.html`: app layout, three views, and service worker registration.
- `styles.css`: synthwave UI styling, layout, controls, and responsive-friendly grid/scroll behavior.
- `app.js`: command data, rendering, view switching, staging logic, configuration save/load, and send logic.
- `manifest.json`: PWA metadata and install settings.
- `sw.js`: caching and offline handling.

## Notes

- The predefined command set currently includes explicit adult-themed entries in code.
- If you need a safer/general-purpose version, replace the `COMMANDS` array with your own domain-specific instruction list.
