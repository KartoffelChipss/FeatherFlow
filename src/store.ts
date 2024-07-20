import Store from 'electron-store';
import { basename } from 'path';

const store = new Store({
    schema: {
        windowPosition: {
            type: 'object',
            properties: {
                width: {
                    type: 'number',
                },
                height: {
                    type: 'number',
                },
                x: {
                    type: 'number',
                },
                y: {
                    type: 'number',
                },
            },
            required: ['width', 'height', 'x', 'y'],
        },
        recentFiles: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                }
            },
            default: [],
        },
        checkForUpdates: {
            type: 'boolean',
            default: true,
        },
        lastOpenFolder: {
            type: 'string',
            default: '',
        },
        lastUpdateReminder: {
            type: 'number',
            default: 0,
        },
        colorScheme: {
            type: 'string',
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        theme: {
            type: 'string',
            default: 'Default',
        },
        lineNumbers: {
            type: 'boolean',
            default: true,
        },
        lineWrapping: {
            type: 'boolean',
            default: true,
        },
        styleActiveLine: {
            type: 'boolean',
            default: true,
        },
        indentSize: {
            type: 'number',
            default: 4,
        },
        indentType: {
            type: 'string',
            enum: ['space', 'tab'],
            default: 'tab',
        },
        matchBrackets: {
            type: 'boolean',
            default: true,
        },
        autoShowHints: {
            type: 'boolean',
            default: true,
        },
        autoLineDelete: {
            type: 'boolean',
            default: true,
        },
        activateAction: {
            type: 'string',
            enum: ['mainWindow', 'open', 'newFile', 'nothing'],
            default: 'open',
        },
    }
});

export function getStore() {
    return store;
}

export function getRecentFiles() {
    return store.get('recentFiles') as { path: string, name: string }[];
}

export function addRecentFile(path: string) {
    const recentFiles = getRecentFiles();
    const name = basename(path);

    const index = recentFiles.findIndex(file => file.path === path);

    if (index !== -1) recentFiles.splice(index, 1);

    recentFiles.unshift({ path, name });

    if (recentFiles.length > 5) recentFiles.pop();

    store.set('recentFiles', recentFiles);
}


export function clearRecentFiles() {
    store.set('recentFiles', []);
}