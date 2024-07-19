import { nativeTheme } from 'electron';
import { getStore } from './store';
import { getAllWindows } from './windowManager';

export type ColorScheme = 'light' | 'dark' | 'system';

nativeTheme.on("updated", () => {
    updateColorScheme();
});

export function getColorSheme() {
    return getStore().get('colorScheme') as ColorScheme;
}

export function getCalculatedColorSheme() {
    let colorSheme = getColorSheme();
    if (colorSheme === 'system') colorSheme = (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    return colorSheme;
}

export function setColorScheme(colorScheme: ColorScheme) {
    getStore().set('colorScheme', colorScheme);
    if (colorScheme === 'system') colorScheme = (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    for (const window of getAllWindows()) {
        window?.webContents.send('setColorScheme', colorScheme);
    }
}

export function updateColorScheme() {
    setColorScheme(getColorSheme());
}