import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { fadeInWindow } from './index';

export function isMainWindow(BrowserWindow: BrowserWindow): boolean {
    return BrowserWindow.getTitle() === 'FeatherFlow';
}

export function closeMainWindow() {
    const mainWindow = BrowserWindow.getAllWindows().find(isMainWindow);
    if (mainWindow) mainWindow.close();
}

export function openMainWindow() {
    if (BrowserWindow.getAllWindows().find(isMainWindow)) return;

    const width = 700;
    const height = 400;

    const mainWindow = new BrowserWindow({
        minWidth: width,
        minHeight: height,
        width: width,
        height: height,
        resizable: isDev,
        backgroundColor: '#101215',
        darkTheme: true,
        frame: false,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        roundedCorners: true,
        hasShadow: true,
        show: false,
        center: true,
        title: 'FeatherFlow',
        maximizable: false,
        minimizable: false,
        fullscreenable: false,
        webPreferences: {
            preload: path.resolve(
                path.join(__dirname, '../../dist/preload.js')
            ),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    const fileLoaded = mainWindow.loadFile(
        path.join(__dirname, '../../public/main.html')
    );

    fileLoaded.then(() => fadeInWindow(mainWindow));
}
