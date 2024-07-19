import {BrowserWindow} from "electron";
import {updateMenu} from "../menus/appMenu";
import logger from "electron-log";
import {getStore} from "../store";
import path from "path";
import fs from "fs";
import {closeMainWindow} from "../windowManager";
import {fadeInWindow} from "./index";

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
            preload: path.resolve(path.join(__dirname, '../../dist/preload.js')),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    const fileLoaded = fileWindow.loadFile(path.join(__dirname, '../../public/editor.html'));

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

            fadeInWindow(fileWindow);
        });
    } else fadeInWindow(fileWindow);

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