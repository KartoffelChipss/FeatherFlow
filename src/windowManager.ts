import { BrowserWindow } from "electron";
import logger from "electron-log";
import path from "path";
import { getStore } from "./store";
import fs from "fs";
import { updateMenu } from "./menus/appMenu";
import {devMode} from "./main";

const windows: { [key: string]: BrowserWindow } = {};

export function getWindow(filePath: string) {
    return windows[filePath];
}

export function getPath(window: BrowserWindow) {
    return Object.keys(windows).find(key => windows[key] === window);
}

export function setPath(window: BrowserWindow, filePath: string) {
    const oldPath = getPath(window);
    if (oldPath) delete windows[oldPath];
    windows[filePath] = window;
}

export function getFocusedWindow(): BrowserWindow | null {
    return BrowserWindow.getFocusedWindow();
}

export function getAllWindows(): (BrowserWindow | null)[] {
    return BrowserWindow.getAllWindows();
}

export function requestWindowClose(window: BrowserWindow) {
    window.webContents.send("closeWindow");
}

export function closeWindow(window: BrowserWindow) {
    const filePath = getPath(window);
    if (filePath) delete windows[filePath];
    window.removeAllListeners("close");
    window.close();
    updateMenu();
}

export function createWindow(filePath: string | null = null) {
    if (filePath && windows[filePath]) {
        windows[filePath].focus();
        return;
    }

    logger.info("Opening window for file:", filePath);

    const fileWindow = new BrowserWindow({
        minWidth: 400,
        minHeight: 45,
        width: getStore().get("windowPosition.width") ?? 1300,
        height: getStore().get("windowPosition.height") ?? 800,
        backgroundColor: "#101215",
        darkTheme: true,
        frame: false,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        roundedCorners: true,
        hasShadow: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    const fileLoaded = fileWindow.loadFile(path.join(__dirname, '../public/editor.html'));

    fileWindow.on("move", () => getStore().set(`windowPosition`, fileWindow.getBounds()));
    fileWindow.on("resize", () => getStore().set(`windowPosition`, fileWindow.getBounds()));

    fileWindow.on("close", (e) => {
        e.preventDefault();
        requestWindowClose(fileWindow);
    });

    fileWindow.on("enter-full-screen", () => fileWindow.webContents.send("fullscreenChanged", true));
    fileWindow.on("leave-full-screen", () => fileWindow.webContents.send("fullscreenChanged", false));

    if (filePath) {
        windows[filePath] = fileWindow;

        fs.readFile(filePath, 'utf-8', async (err, data) => {
            if (err) {
                logger.error("Failed to read file:", err);
                return;
            }

            await fileLoaded;

            logger.info("Sending file data to window:", filePath);

            const fileName = path.basename(filePath);

            fileWindow.webContents.send('fileOpened', {
                path: filePath,
                name: fileName,
                content: data,
            });
            fileWindow.show();
            fileWindow.setOpacity(0);

            let opacity = 0;
            const interval = setInterval(() => {
                opacity += 0.3;
                fileWindow.setOpacity(opacity);

                if (opacity >= 1) {
                    clearInterval(interval);
                }
            }, 50);
        });
    } else {
        fileWindow.show();
        fileWindow.setOpacity(0);

        let opacity = 0;
        const interval = setInterval(() => {
            opacity += 0.3;
            fileWindow.setOpacity(opacity);

            if (opacity >= 1) {
                clearInterval(interval);
            }
        }, 50);
    }

    closeMainWindow();
}

export function openFileInWindow(filePath: string, window: BrowserWindow) {
    fs.readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
            logger.error("Failed to read file:", err);
            return;
        }

        logger.info("Sending file data to window:", filePath);

        const fileName = path.basename(filePath);

        window.webContents.send('fileOpened', {
            path: filePath,
            name: fileName,
            content: data,
        });
        window.show();
    });
}

export function isMainWindow(BrowserWindow: BrowserWindow): boolean {
    return BrowserWindow.getTitle() === "FeatherFlow";
}

export function closeMainWindow() {
    const mainWindow = BrowserWindow.getAllWindows().find(isMainWindow);
    if (mainWindow) mainWindow.close();
}

export function openMainWindow() {
    const width = 700;
    const height = 400;

    const mainWindow = new BrowserWindow({
        minWidth: width,
        minHeight: height,
        width: width,
        height: height,
        resizable: devMode,
        backgroundColor: "#101215",
        darkTheme: true,
        frame: false,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        roundedCorners: true,
        hasShadow: true,
        show: false,
        center: true,
        title: "FeatherFlow",
        maximizable: false,
        minimizable: false,
        fullscreenable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    const fileLoaded = mainWindow.loadFile(path.join(__dirname, '../public/main.html'));

    fileLoaded.then(() => mainWindow.show());
}