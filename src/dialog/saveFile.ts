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
            { name: 'All Files', extensions: ['*'] },
            { name: 'JavaScript', extensions: ['js'] },
            { name: 'Python', extensions: ['py'] },
            { name: 'Java', extensions: ['java'] },
            { name: 'C++', extensions: ['cpp', 'h'] },
            { name: 'C#', extensions: ['cs'] },
            { name: 'Ruby', extensions: ['rb'] },
            { name: 'PHP', extensions: ['php'] },
            { name: 'Swift', extensions: ['swift'] },
            { name: 'TypeScript', extensions: ['ts'] },
            { name: 'Go', extensions: ['go'] },
            { name: 'HTML', extensions: ['html'] },
            { name: 'XML', extensions: ['xml'] },
            { name: 'Markdown', extensions: ['md', 'markdown'] },
            { name: 'CSS', extensions: ['css'] },
            { name: 'SCSS', extensions: ['scss'] },
            { name: 'LESS', extensions: ['less'] },
            { name: 'JSON', extensions: ['json'] },
            { name: 'YAML', extensions: ['yaml', 'yml'] },
            { name: 'INI', extensions: ['ini'] },
            { name: 'TOML', extensions: ['toml'] },
            { name: 'Shell Script', extensions: ['sh'] },
            { name: 'PowerShell', extensions: ['ps1'] },
            { name: 'SQL', extensions: ['sql'] },
            { name: 'Text', extensions: ['txt'] },
            { name: 'Log', extensions: ['log'] },
            { name: 'Diff', extensions: ['diff', 'patch'] },
            { name: 'CSV', extensions: ['csv'] }
        ],
        defaultPath: app.getPath('documents'),
    });

    if (result.canceled || !result.filePath || !result.filePath) return null;

    return result.filePath;
}