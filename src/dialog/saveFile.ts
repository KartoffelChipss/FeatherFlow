import { dialog, app } from 'electron';

/**
 * Save a file dialog
 * @returns The path of the file selected by the user or null if no file was selected or the dialog was cancelled
 */
export default async function showSaveFileDialog(): Promise<string | null> {
    const result = await dialog.showSaveDialog({
        title: 'Save Markdown file',
        properties: ["createDirectory"],
        filters: [
            { name: 'Markdown', extensions: ['md', 'markdown'] }
        ],
        defaultPath: app.getPath('documents'),
    });

    if (result.canceled || !result.filePath || !result.filePath) return null;

    return result.filePath;
}