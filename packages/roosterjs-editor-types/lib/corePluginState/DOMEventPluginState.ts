import ContextMenuProvider from '../interface/ContextMenuProvider';
import { TableSelectionRange } from '../interface/SelectionRangeEx';

/**
 * The state object for DOMEventPlugin
 */
export default interface DOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;

    /**
     * Cached selection range
     */
    selectionRange: Range;

    /**
     * Table selection range
     */
    tableSelectionRange: TableSelectionRange;

    /**
     * stop propagation of a printable keyboard event
     */
    stopPrintableKeyboardEventPropagation: boolean;

    /**
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];
}
