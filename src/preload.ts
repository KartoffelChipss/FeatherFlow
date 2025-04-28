import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(
            `${dependency}-version`,
            process.versions[dependency as keyof NodeJS.ProcessVersions] ?? ''
        );
    }
});

contextBridge.exposeInMainWorld('api', {
    invoke: (channel: string, data: any) => {
        let validChannels = [
            'minimize',
            'maximize',
            'close',
            'openLink',
            'openLinkInFinder',
            'saveFile',
            'convertMDtoHTML',
            'getColorScheme',
            'getTheme',
            'updateColorScheme',
            'updateTheme',
            'getThemeList',
            'getEditorSettings',
            'showContextMenu',
            'showUnsavedChangesDialog',
            'openFile',
            'newFile',
            'openHelp',
            'setSetting',
            'openCustomFolder',
            'getBackgroundImages',
            'getBackgroundImage',
            'updateBackgroundImage',
            'getPlatform',
        ];
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
});

contextBridge.exposeInMainWorld('bridge', {
    fileOpened: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('fileOpened', message);
    },
    fileUpdated: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('fileUpdated', message);
    },
    requestFileSave: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('requestFileSave', message);
    },
    fullscreenChanged: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('fullscreenChanged', message);
    },
    setColorScheme: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('setColorScheme', message);
    },
    setTheme: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('setTheme', message);
    },
    setBackgroundImage: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('setBackgroundImage', message);
    },
    setEditorSetting: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('setEditorSetting', message);
    },
    formatEditor: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('formatEditor', message);
    },
    updateSettings: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('updateSettings', message);
    },
    openSearch: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('openSearch', message);
    },
    changeZoom: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('changeZoom', message);
    },
    closeWindow: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('closeWindow', message);
    },
    toggleReadMode: (
        message: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on('toggleReadMode', message);
    },
    onRequest: (
        channel: string,
        callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
        ipcRenderer.on(channel, callback);
    },
    sendResponse: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
    },
});
