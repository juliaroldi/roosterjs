import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { WAC_IDENTIFING_SELECTOR } from './officeOnlineConverter/constants';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './officeOnlineConverter/convertPastedContentFromWordOnline';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or Onenote Online
 */
export default class Paste implements EditorPlugin {
    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Paste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {}

    /**
     * Dispose this plugin
     */
    dispose() {}

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.BeforePaste) {
            const { htmlAttributes, fragment } = event;
            let wacListElements: NodeListOf<Element>;

            if (htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE) {
                // Handle HTML copied from Word
                convertPastedContentFromWord(event);
            } else if (htmlAttributes[EXCEL_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE) {
                // Handle HTML copied from Excel
                convertPastedContentFromExcel(event);
            } else if ((wacListElements = fragment.querySelectorAll(WAC_IDENTIFING_SELECTOR))[0]) {
                // Once it is known that the document is from WAC
                // We need to remove the display property and margin from all the list item
                wacListElements.forEach((el: HTMLElement) => {
                    el.style.display = null;
                    el.style.margin = null;
                });
                // call conversion function if the pasted content is from word online and
                // has list element in the pasted content.
                if (isWordOnlineWithList(fragment)) {
                    convertPastedContentFromWordOnline(fragment);
                }
            }
        }
    }
}
