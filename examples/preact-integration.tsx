// Preact / React integration for dev-debug-panel v2.
// Drop into your top-level App component.

import { useEffect } from 'preact/hooks';
import { mountDebugPanel, ScreenPosition } from 'dev-debug-panel';
import * as loggers from 'dev-loggers';

export function App() {
	useEffect(
		() =>
			mountDebugPanel({
				loggers,
				position: ScreenPosition.BottomRight,
				snap: true,
				// shortcut: 'shift+alt+d' is the default
			}),
		[],
	);

	// From anywhere in your app:
	loggers.debug('audio:attach', { tag: 'VIDEO', src: 'blob:…' });
	loggers.debug.scope('audio:state').log('ready', { ctx: 'running' });

	return <YourApp />;
}

function YourApp() { return null; }
