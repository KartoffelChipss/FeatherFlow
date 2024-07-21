import {nativeTheme} from 'electron';
import {getStore} from './store';
import {getAllWindows} from './windowManager';
import fs from "fs";
import path from "path";

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

export function getThemeName() {
    return getStore().get('theme') as string;
}

export function setTheme(theme: string) {
    getStore().set('theme', theme);
    for (const window of getAllWindows()) {
        window?.webContents.send('setTheme', theme);
    }
}

export function updateTheme() {
    setTheme(getThemeName());
}

interface CssFileWithTheme {
    fileName: string;
    themeName: string;
    index: number;
}

const extractThemeName = (cssContent: string): string => {
    const match = cssContent.match(/--name\s*:\s*([^;]+)/);
    return match ? match[1].trim() .replaceAll('"', ''): 'Unknown';
};

const extractIndex = (cssContent: string): number => {
    const match = cssContent.match(/--index\s*:\s*(\d+)/);
    return match ? parseInt(match[1].trim(), 10) : Number.MAX_SAFE_INTEGER;
};

const getCssFilesWithThemes = (dirPath: string): Promise<CssFileWithTheme[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return reject(err);
            }

            // Filter out CSS files
            const cssFiles = files.filter(file => path.extname(file) === '.css');
            const results: CssFileWithTheme[] = [];

            // Read each CSS file and extract the theme name and index
            let filesProcessed = 0;
            cssFiles.forEach(file => {
                const filePath = path.join(dirPath, file);

                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    const themeName = extractThemeName(data);
                    const index = extractIndex(data);

                    results.push({ fileName: file, themeName, index });
                    filesProcessed++;

                    // Resolve when all files are processed
                    if (filesProcessed === cssFiles.length) {
                        // Sort results by index
                        results.sort((a, b) => a.index - b.index);
                        resolve(results);
                    }
                });
            });

            // Handle case where there are no CSS files
            if (cssFiles.length === 0) {
                resolve(results);
            }
        });
    });
};

export function getThemeList() {
    const themesDir = path.resolve(path.join(__dirname, '../public/css/themes'));
    console.log(themesDir);
    return getCssFilesWithThemes(themesDir);
}