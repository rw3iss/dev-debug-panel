import { DebugPanel, type DebugPanelOptions } from './DebugPanel/DebugPanel';

/**
 * Thin Preact (and React-compatible) helper. Use inside a `useEffect` to
 * create a panel once per app and tear it down on unmount.
 *
 *   useEffect(() => mountDebugPanel({ loggers }), []);
 *
 * The return value is the disposer — exactly what `useEffect` expects.
 */
export function mountDebugPanel(options: DebugPanelOptions = {}): () => void {
	const panel = new DebugPanel(options);
	return () => panel.destroy();
}
