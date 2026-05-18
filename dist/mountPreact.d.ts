import { type DebugPanelOptions } from './DebugPanel/DebugPanel';
/**
 * Thin Preact (and React-compatible) helper. Use inside a `useEffect` to
 * create a panel once per app and tear it down on unmount.
 *
 *   useEffect(() => mountDebugPanel({ loggers }), []);
 *
 * The return value is the disposer — exactly what `useEffect` expects.
 */
export declare function mountDebugPanel(options?: DebugPanelOptions): () => void;
//# sourceMappingURL=mountPreact.d.ts.map