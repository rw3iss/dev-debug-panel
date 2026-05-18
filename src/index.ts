// Side-effect imports: style injection happens on first import of the lib.
import './DebugPanel/DebugPanel.scss';
import './JsonView/JsonView.scss';

export { DebugPanel, ScreenPosition, debug } from './DebugPanel/DebugPanel';
export type { LoggersApi, LoggerEvent } from './DebugPanel/DebugPanel';
export { JsonView } from './JsonView/JsonView';
export { mountDebugPanel } from './mountPreact';
export { makeResizable, makeDraggable, getWindowSize } from './utils/domUtils';

export type {
	DebugPanelOptions,
	DebugPanelSettings,
	ResizeOptions,
	DragOptions,
} from './types';
