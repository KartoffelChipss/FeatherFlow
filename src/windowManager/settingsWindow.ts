import {BrowserWindow} from "electron";
import {devMode} from "../main";
import path from "path";
import {fadeInWindow} from "./index";

export function isSettingsWindow(BrowserWindow: BrowserWindow) {
    return BrowserWindow.getTitle() === "Settings";
}

export function closeSettingsWindow() {
    const settingsWindow = BrowserWindow.getAllWindows().find(isSettingsWindow);
    if (settingsWindow) settingsWindow.close();
}

export function openSettingsWindow() {
    for (const window of BrowserWindow.getAllWindows()) {
        if (isSettingsWindow(window)) {
            window.focus();
            return;
        }
    }

    const width = 950;
    const height = 650;

    const settingsWindow = new BrowserWindow({
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
        title: "Settings",
        maximizable: false,
        minimizable: true,
        fullscreenable: false,
        webPreferences: {
            preload: path.resolve(path.join(__dirname, '../../dist/preload.js')),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    const fileLoaded = settingsWindow.loadFile(path.join(__dirname, '../../public/settings.html'));

    fadeInWindow(settingsWindow, 40, 0.3);

    settingsWindow.on("focus", () => {
        settingsWindow.webContents.send("updateSettings");
    });
}