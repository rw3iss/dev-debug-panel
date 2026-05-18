// Smoke test: per-tab Clear must drop entries from both the buffer
// AND the rendered DOM (regression guard for v2.0.0 bug where entries
// were appended to the outer tab-content but Clear targeted the inner
// entries wrapper).

import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
	pretendToBeVisual: true,
	url: 'http://localhost/',
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.localStorage = dom.window.localStorage;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
// `navigator` has a getter on globalThis in Node 22, so define instead of assign.
Object.defineProperty(globalThis, 'navigator', {
	value: dom.window.navigator,
	configurable: true,
});

const { DebugPanel } = await import('../dist/index.esm.js');

const panel = new DebugPanel({ shortcut: null });

// Push log entries into a per-id tab + global.
panel.log('audio:attach', 'hello world');
panel.log('audio:attach', { foo: 1 });
panel.log('audio:attach', 'third');

const root = panel.element;
const entriesWrapper = root.querySelector('[data-entries-for="audio:attach"]');
const globalWrapper = root.querySelector('[data-entries-for="global"]');

assert.ok(entriesWrapper, 'per-id entries wrapper exists');
assert.ok(globalWrapper, 'global entries wrapper exists');
assert.equal(entriesWrapper.querySelectorAll('.debug-log-entry').length, 3, 'per-id has 3 entries');
assert.equal(globalWrapper.querySelectorAll('.debug-log-entry').length, 3, 'global has 3 entries');

// Clear per-id.
panel.clearTab('audio:attach');
assert.equal(entriesWrapper.querySelectorAll('.debug-log-entry').length, 0, 'per-id DOM cleared');

// Clear global.
panel.clearTab('global');
assert.equal(globalWrapper.querySelectorAll('.debug-log-entry').length, 0, 'global DOM cleared');

// Verify copyTab serialises through clipboard or fallback (must not throw).
let copied = '';
Object.defineProperty(globalThis.navigator, 'clipboard', {
	configurable: true,
	value: { writeText: async (t) => { copied = t; } },
});
panel.log('audio:attach', 'after-clear-entry');
panel.copyTab('audio:attach');
// async writeText — give microtask queue a tick.
await new Promise((r) => setTimeout(r, 10));
assert.ok(copied.includes('after-clear-entry'), 'copyTab pushed text to clipboard');

// Copy still works on a fresh batch (rendering check after clear).
assert.equal(entriesWrapper.querySelectorAll('.debug-log-entry').length, 1, 'new entry rendered after clear');

console.log('clearTab smoke test: OK');
panel.destroy();
