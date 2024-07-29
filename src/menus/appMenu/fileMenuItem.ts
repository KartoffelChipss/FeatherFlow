import {BrowserWindow, clipboard, MenuItemConstructorOptions, shell} from "electron";
import {iconNativeImage, iconPath, isMac} from "../util";
import {createWindow, getPath, setPath, isSpecialWindow} from "../../windowManager";
import {addRecentFile, clearRecentFiles, getRecentFiles} from "../../store";
import {openFile} from "../../main";
import path, {basename} from "path";
import showSaveFileDialog from "../../dialog/saveFile";
import {updateMenu} from "./index";

export default function (): MenuItemConstructorOptions {
    const recentFiles = getRecentFiles();
    const focusedWindow = BrowserWindow.getFocusedWindow();

    const recentFilesMenuItems: MenuItemConstructorOptions[] = recentFiles.map((file) => {
        return {
            label: file.name,
            icon: iconNativeImage("logo_file"),
            click: () => {
                createWindow(file.path);
            }
        }
    });

    let recentMenuItem: MenuItemConstructorOptions = {
        label: 'Open Recent',
        submenu: recentFilesMenuItems,
    };

    if (recentFiles.length === 0) recentFilesMenuItems.push({label: 'No recent files', enabled: false});
    recentFilesMenuItems.push({type: 'separator'});
    recentFilesMenuItems.push({
        label: 'Clear Recent',
        click: () => {
            clearRecentFiles();
            updateMenu();
        },
    });

    return {
        label: 'File',
        submenu: [
            {
                label: 'New File',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    createWindow();
                }
            },
            {
                label: 'Open File',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    openFile();
                }
            },
            recentMenuItem,
            {type: 'separator'},
            {role: 'close', label: "Close"},
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                id: 'save',
                enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                click: () => {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    if (focusedWindow) {
                        const filePath = getPath(focusedWindow);
                        if (filePath) {
                            focusedWindow.webContents.send("requestFileSave", filePath, basename(filePath));
                        } else {
                            showSaveFileDialog().then((filePath) => {
                                if (filePath) {
                                    focusedWindow.webContents.send("requestFileSave", filePath, basename(filePath));
                                    addRecentFile(filePath);
                                    updateMenu();
                                }
                            });
                        }
                    }
                }
            },
            {
                label: 'Save As...',
                accelerator: 'CmdOrCtrl+Shift+S',
                id: 'saveAs',
                enabled:   !!focusedWindow && !isSpecialWindow(focusedWindow),
                click: () => {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    if (focusedWindow) {
                        showSaveFileDialog().then((filePath) => {
                            if (!filePath) return;
                            setPath(focusedWindow, filePath);
                            focusedWindow.webContents.send("requestFileSave", filePath, basename(filePath));
                            addRecentFile(filePath);
                            updateMenu();
                        });
                    }
                }
            },
            {type: 'separator'},
            {
                label: "Reveal in Finder",
                enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                accelerator: "Option+CmdOrCtrl+R",
                click: () => {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    if (focusedWindow) {
                        const filePath = getPath(focusedWindow);
                        if (filePath) shell.showItemInFolder(filePath);
                    }
                }
            },
            {
                label: "Copy Path",
                submenu: [
                    {
                        label: "File Path",
                        accelerator: "CmdOrCtrl+Shift+F",
                        enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                        click: () => {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if (focusedWindow) {
                                const filePath = getPath(focusedWindow);
                                if (filePath) {
                                    clipboard.writeText(filePath);
                                }
                            }
                        }
                    },
                    {
                        label: "Folder Path",
                        enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                        click: () => {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if (focusedWindow) {
                                const filePath = getPath(focusedWindow);
                                if (filePath) clipboard.writeText(path.dirname(filePath));
                            }
                        }
                    }
                ]
            }
        ]
    };
}