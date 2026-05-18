# dev-debug-panel

A draggable, resizable in-page debug overlay.

- **Per-id tabs** — log entries grouped by id, with a chronological `global` tab.
- **Per-tab Copy + Clear** controls — one click, no menu diving.
- **JSON inspection** — efficient diff-based JSON tree for state objects.
- **Sink of dev-loggers** — drop-in integration; no event bus, no globals.
- **Framework-agnostic** — works in vanilla JS or any framework; thin Preact helper included.

## Install

```bash
npm install dev-debug-panel dev-loggers
```

`dev-loggers` is optional but recommended — it's the canonical `debug()`
source and powers the per-namespace config tab.

## Quick start (vanilla)

```typescript
import { DebugPanel } from 'dev-debug-panel';
import * as loggers from 'dev-loggers';

new DebugPanel({ loggers });   // mounts to <body>, hidden until Shift+Alt+D
loggers.debug('audio:attach', { tag: 'VIDEO' });
```

That's the entire integration. Anything that calls `debug(id, ...)`,
`log(...)`, `warn(...)`, `error(...)` from dev-loggers now shows up in
the panel, grouped by id, with the first object arg rendered as a JSON
tree.

## Preact / React

```tsx
import { useEffect } from 'preact/hooks';
import { mountDebugPanel } from 'dev-debug-panel';
import * as loggers from 'dev-loggers';

export function App() {
    useEffect(() => mountDebugPanel({ loggers }), []);
    return <YourApp />;
}
```

`mountDebugPanel` returns the disposer so `useEffect` cleans up correctly.

## Keyboard shortcut

`Shift+Alt+D` toggles the panel (configurable):

```typescript
new DebugPanel({ loggers, shortcut: 'ctrl+`' });   // any combo
new DebugPanel({ loggers, shortcut: null });        // disable
```

## API

### `new DebugPanel(options)`

```typescript
interface DebugPanelOptions {
    show?: boolean;                 // default false — respects saved settings
    position?: ScreenPosition;       // TopLeft, TopRight, BottomLeft, BottomRight, …
    width?: number;                  // default 600
    height?: number;                 // default 400
    snap?: boolean;                  // default false
    snapPadding?: number;            // default 20
    mount?: boolean;                 // default true (auto-append to document.body)
    parent?: HTMLElement;            // alternative mount target
    loggers?: LoggersApi;            // dev-loggers module (preferred wiring)
    shortcut?: string | null;        // default 'shift+alt+d'
}
```

### Methods

| Method | Purpose |
|--------|---------|
| `panel.show()` / `panel.hide()` / `panel.toggle()` | Visibility. |
| `panel.attachToLoggers(api)` | Register as a Sink and connect the config tab. |
| `panel.debug(id, state)` | Push or update an entry in the `objects` JSON tab. |
| `panel.log(tabId, message)` | Push a log entry (v1 compatibility). |
| `panel.clearTab(tabId)` | Empty a tab programmatically. |
| `panel.copyTab(tabId)` | Copy the tab's full content to clipboard. |
| `panel.destroy()` | Tear down, unmount, detach from loggers. |

### Standalone `debug()`

```typescript
import { debug } from 'dev-debug-panel';
debug('audio:attach', { tag: 'VIDEO' });
```

This is a thin convenience function that dispatches to the most-recent
panel constructed in the page. It's there so existing code that just
imports `debug` keeps working — but for new code, prefer `debug` from
`dev-loggers`: it goes through the proper Sink fanout and reaches every
panel + every other registered sink (console, network, file).

## Per-id vs per-namespace tabs

`debug('audio:attach', …)` → tab `audio:attach`. `debug('audio:chain',
…)` → separate tab `audio:chain`. Both share the **`audio`** namespace
for the enable/disable toggle in the config tab (everything before the
first `:`).

`log()` / `warn()` / `error()` from dev-loggers without an `id` land in
the namespace tab (matches v1 behaviour).

Every emit also flows into the chronological `global` tab.

## Migration from v1

| v1 | v2 |
|----|----|
| `new DebugPanel(opts)` auto-mounted to body | Same, plus `{ mount: false }` for custom mount. |
| Tabs keyed by namespace | Tabs keyed by `id` (falls back to namespace). |
| Single `Clear` button in the global toolbar | Per-tab `Copy` + `Clear` toolbar inside each tab. |
| `Ctrl+Alt+D` shortcut | `Shift+Alt+D`, configurable via `shortcut` option. |
| `addLogModule(panel)` from `dev-loggers` | `new DebugPanel({ loggers })`, or `panel.attachToLoggers(loggers)` later. |
| `panel.setLoggerApi(api)` | Still works; `attachToLoggers(api)` is the new preferred form. |
| Depended on `eventbusjs` peer | No more event bus. Dropped from peer/runtime deps. |
| UMD output | Removed. ESM + CJS only. |

The `debug(id, …)` global also still works without explicitly wiring
the panel — but if `dev-loggers` is loaded, prefer its `debug` for full
sink fanout.

## License

ISC
