import {BrowserWindow, dialog, ipcMain, shell} from "electron";
import {getCalculatedTheme} from "./theme";
import logger from "electron-log/main";
import fs from "fs";
import {closeWindow, createWindow, setPath} from "./windowManager";
import path, {basename} from "path";
import showUnsavedChangesDialog from "./dialog/unsavedChanges";
import {popUpContextMenu} from "./menus/contextMenu";
import {getStore} from "./store";
import {openFile} from "./main";

ipcMain.handle("getTheme", (event, data) => {
    return getCalculatedTheme();
});

ipcMain.handle("saveFile", async (event, data) => {
    try {
        logger.info("Saving file:", data.file + " to " + data.path);
        await fs.promises.writeFile(data.path, data.content);

        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) setPath(window, data.path);

        window?.webContents.send("fileOpened", {
            content: data.content,
            name: basename(data.path),
            path: data.path,
        })

        return {
            content: data.content,
            name: basename(data.path),
            path: data.path,
        };
    } catch (error) {
        logger.error("Error saving file:", error);
        dialog.showErrorBox(
            "Error saving file",
            "An error occurred while saving the file. Please try again.",
        );
        throw error;
    }
});

ipcMain.handle("openLink", (event, data) => {
    logger.info("Opening link:", data);
    shell.openExternal(data);
});

ipcMain.handle("openLinkInFinder", (event, data) => {
    const basePath = path.dirname(data.path);
    const fullPath = path.resolve(basePath, data.url);

    logger.info("Reveal in Finder:", fullPath);
    shell.showItemInFolder(fullPath);
});

ipcMain.handle("getEditorSettings", (event, data) => {
    return {
        lineNumbers: getStore().get("lineNumbers"),
        lineWrapping: getStore().get("lineWrapping"),
        styleActiveLine: getStore().get("styleActiveLine"),
        indentUnit: getStore().get("indentSize"),
        tabSize: getStore().get("indentSize"),
        indentSize: getStore().get("indentSize"),
        matchBrackets: getStore().get("matchBrackets"),
        autoShowHints: getStore().get("autoShowHints"),
        autoLineDelete: getStore().get("autoLineDelete"),
        activateAction: getStore().get("activateAction"),
    };
});

ipcMain.handle("setSetting", (event, data) => {
    console.log(data);
    getStore().set(data.setting, data.value);
});

ipcMain.handle("showContextMenu", (event, data) => {
    popUpContextMenu();
});

ipcMain.handle("showUnsavedChangesDialog", async (event, data) => {
    const action = await showUnsavedChangesDialog();

    if (action === "save") {
        try {
            logger.info("Saving file:", data.file + " to " + data.path);
            await fs.promises.writeFile(data.path, data.content);

            const window = BrowserWindow.fromWebContents(event.sender);
            if (window) closeWindow(window);
        } catch (error) {
            logger.error("Error saving file:", error);
            dialog.showErrorBox(
                "Error saving file",
                "An error occurred while saving the file. Please try again.",
            );
            throw error;
        }
    }

    if (action === "discard") {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) closeWindow(window);
        return;
    }

    if (action === "cancel") return;
});

ipcMain.handle("close", (event, data) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) closeWindow(window);
});

ipcMain.handle("openFile", (event) => {
    openFile();
});

ipcMain.handle("newFile", (event) => {
    createWindow();
});

ipcMain.handle("openHelp", (event) => {
    shell.openExternal("https://github.com/Kartoffelchipss/FeatherFlow");
});
