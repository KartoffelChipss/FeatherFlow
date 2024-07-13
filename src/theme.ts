import { nativeTheme } from 'electron';
import { getStore } from './store';
import { getAllWindows, getFocusedWindow } from './windowManager';

export type Theme = 'light' | 'dark' | 'system';

export function getTheme() {
    return getStore().get('theme') as Theme;
}

export function getCalculatedTheme() {
    let theme = getTheme();
    if (theme === 'system') theme = (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    return theme;
}

export function setTheme(theme: Theme) {
    getStore().set('theme', theme);
    if (theme === 'system') theme = (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    for (const window of getAllWindows()) {
        window?.webContents.send('setTheme', theme);
    }
}

export function updateTheme() {
    setTheme(getTheme());
}