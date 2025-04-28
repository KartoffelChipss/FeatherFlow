import { BrowserWindow } from 'electron';
import { isMainWindow } from './mainWindow';
import { isSettingsWindow } from './settingsWindow';

export * from './fileWindow';
export * from './mainWindow';
export * from './settingsWindow';

export function fadeInWindow(
    window: BrowserWindow,
    durationMS = 50,
    stepSize = 0.3
) {
    window.show();
    window.setOpacity(0);

    let opacity = 0;
    const interval = setInterval(() => {
        opacity += stepSize;
        window.setOpacity(opacity);

        if (opacity >= 1) {
            clearInterval(interval);
        }
    }, durationMS);
}

export function getFocusedWindow(): BrowserWindow | null {
    return BrowserWindow.getFocusedWindow();
}

export function getAllWindows(): (BrowserWindow | null)[] {
    return BrowserWindow.getAllWindows();
}
export function isSpecialWindow(BrowserWindow: BrowserWindow): boolean {
    return isMainWindow(BrowserWindow) || isSettingsWindow(BrowserWindow);
}
