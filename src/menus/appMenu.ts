import { app, BrowserWindow, Menu, type MenuItemConstructorOptions, clipboard, shell } from "electron";
import {
    createWindow,
    getAllWindows,
    getFocusedWindow,
    getPath,
    openFileInWindow,
    setPath
} from "../windowManager";
import { openFile, appRoot } from "../main";
import showSaveFileDialog from "../dialog/saveFile";
import path, { basename } from "path";
import { addRecentFile, clearRecentFiles, getRecentFiles, getStore } from "../store";
import { setTheme } from "../theme";

const isMac = process.platform === "darwin";

export function updateMenu() {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const recentFiles = getRecentFiles();
    const store = getStore();

    const appMenuItem: MenuItemConstructorOptions = {
        label: app.name,
        submenu: [
            {
                role: 'about',
                label: 'About FeatherFlow'
            },
            { type: 'separator' },
            {
                label: "Preferences",
                accelerator: "CmdOrCtrl+,",
                submenu: [
                    {
                        label: "Editor",
                        submenu: [
                            {
                                label: "Indent Size",
                                submenu: [
                                    {
                                        label: "2 spaces",
                                        type: "radio",
                                        checked: store.get("indentSize") === 2,
                                        click: () => {
                                            store.set("indentSize", 2);
                                            for (const window of getAllWindows()) {
                                                window?.webContents.send("setEditorSetting", "indentUnit", 2);
                                                window?.webContents.send("setEditorSetting", "tabSize", 2);
                                            }
                                            updateMenu();
                                        }
                                    },
                                    {
                                        label: "4 spaces",
                                        type: "radio",
                                        checked: store.get("indentSize") === 4,
                                        click: () => {
                                            store.set("indentSize", 4);
                                            for (const window of getAllWindows()) {
                                                window?.webContents.send("setEditorSetting", "indentUnit", 4);
                                                window?.webContents.send("setEditorSetting", "tabSize", 4);
                                            }
                                            updateMenu();
                                        }
                                    },
                                    {
                                        label: "8 spaces",
                                        type: "radio",
                                        checked: store.get("indentSize") === 8,
                                        click: () => {
                                            store.set("indentSize", 8);
                                            for (const window of getAllWindows()) {
                                                window?.webContents.send("setEditorSetting", "indentUnit", 8);
                                                window?.webContents.send("setEditorSetting", "tabSize", 8);
                                            }
                                            updateMenu();
                                        }
                                    }
                                ]
                            },
                            {
                                label: "Automatically show Hints",
                                type: "checkbox",
                                checked: store.get("autoShowHints") as boolean,
                                click: () => {
                                    store.set("autoShowHints", !store.get("autoShowHints"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "autoShowHints", store.get("autoShowHints"));
                                    }
                                    updateMenu();
                                }
                            },
                            {
                                label: "Line Numbers",
                                type: "checkbox",
                                checked: store.get("lineNumbers") as boolean,
                                click: () => {
                                    store.set("lineNumbers", !store.get("lineNumbers"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "lineNumbers", store.get("lineNumbers"));
                                    }
                                    updateMenu();
                                }
                            },
                            {
                                label: "Line Wrapping",
                                type: "checkbox",
                                checked: store.get("lineWrapping") as boolean,
                                click: () => {
                                    store.set("lineWrapping", !store.get("lineWrapping"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "lineWrapping", store.get("lineWrapping"));
                                    }
                                    updateMenu();
                                }
                            },
                            {
                                label: "Active Line Indicator",
                                type: "checkbox",
                                checked: store.get("styleActiveLine") as boolean,
                                click: () => {
                                    store.set("styleActiveLine", !store.get("styleActiveLine"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "styleActiveLine", store.get("styleActiveLine"));
                                    }
                                    updateMenu();
                                }
                            },
                            {
                                label: "Match Brackets",
                                type: "checkbox",
                                checked: store.get("matchBrackets") as boolean,
                                click: () => {
                                    store.set("matchBrackets", !store.get("matchBrackets"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "matchBrackets", store.get("matchBrackets"));
                                    }
                                    updateMenu();
                                }
                            }
                        ]
                    },
                    {
                        label: "Theme",
                        submenu: [
                            {
                                label: "System",
                                type: "radio",
                                checked: store.get("theme") === "system",
                                click: () => {
                                    setTheme("system");
                                    updateMenu();
                                }
                            },
                            {
                                label: "Dark",
                                type: "radio",
                                checked: store.get("theme") === "dark",
                                click: () => {
                                    setTheme("dark");
                                    updateMenu();
                                }
                            },
                            {
                                label: "Light",
                                type: "radio",
                                checked: store.get("theme") === "light",
                                click: () => {
                                    setTheme("light");
                                    updateMenu();
                                }
                            }
                        ]
                    },
                ]
            },
            { type: 'separator' },
            { role: 'services' },
            {
                label: "Developer",
                submenu: [
                    { role: 'toggleDevTools' },
                    { role: 'forceReload' },
                    {
                        label: "Open app folder",
                        click: () => {
                            shell.openPath(appRoot);
                        }
                    },
                    {
                        label: "Open config file",
                        click: () => {
                            store.openInEditor();
                        }
                    },
                ]
            },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            {
                role: 'quit',
                label: 'Quit FeatherFlow',
            }
        ]
    };

    const recentFilesMenuItems: MenuItemConstructorOptions[] = recentFiles.map((file) => {
        return {
            label: file.name,
            click: () => {
                createWindow(file.path);
            }
        }
    });

    let recentMenuItem: MenuItemConstructorOptions = {
        label: 'Open Recent',
        submenu: recentFilesMenuItems,
    };

    if (recentFiles.length === 0) recentFilesMenuItems.push({ label: 'No recent files', enabled: false });
    recentFilesMenuItems.push({ type: 'separator' });
    recentFilesMenuItems.push({
        label: 'Clear Recent',
        click: () => {
            clearRecentFiles();
            updateMenu();
        },
    });

    const fileMenu: MenuItemConstructorOptions = {
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
            { type: 'separator' },
            isMac ? { role: 'close', label: "Close" } : { role: 'quit' },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                id: 'save',
                enabled: !!focusedWindow,
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
                enabled: !!focusedWindow,
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
            { type: 'separator' },
            {
                label: "Reveal in Finder",
                enabled: !!focusedWindow,
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
                        enabled: !!focusedWindow,
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
                        enabled: !!focusedWindow,
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

    const editMenu: MenuItemConstructorOptions = {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
                label: 'Find',
                accelerator: 'CmdOrCtrl+F',
                enabled: !!focusedWindow,
                click: () => {
                    getFocusedWindow()?.webContents.send("openSearch");
                }
            },
        ]
    };

    const appMenuTemplate: MenuItemConstructorOptions[] = [
        isMac ? appMenuItem : {},
        fileMenu,
        editMenu,
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    enabled: !!focusedWindow,
                    click: async () => {
                        const focusedWindow = BrowserWindow.getFocusedWindow();
                        if (focusedWindow) {
                            focusedWindow.reload();
                            setTimeout(() => {
                                const filePath = getPath(focusedWindow);
                                if (filePath) openFileInWindow(filePath, focusedWindow);
                            }, 100);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Actual size',
                    accelerator: 'CmdOrCtrl+0',
                    enabled: !!focusedWindow,
                    click: () => {
                        getFocusedWindow()?.webContents.send("changeZoom", {
                            instruction: "reset",
                            value: 0,
                        });
                    }
                },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    enabled: !!focusedWindow,
                    click: () => {
                        getFocusedWindow()?.webContents.send("changeZoom", {
                            instruction: "increase",
                            value: 0.1,
                        });
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    enabled: !!focusedWindow,
                    click: () => {
                        getFocusedWindow()?.webContents.send("changeZoom", {
                            instruction: "decrease",
                            value: 0.1,
                        });
                    }
                },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        { role: 'windowMenu' },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'GitHub Repository',
                    click: async () => {
                        await shell.openExternal('https://github.com/Kartoffelchipss/FeatherFlow');
                    }
                },
                {
                    label: 'Report Issue',
                    click: async () => {
                        await shell.openExternal('https://github.com/Kartoffelchipss/FeatherFlow/issues');
                    }
                },
                {
                    label: 'Support Discord',
                    click: async () => {
                        await shell.openExternal('https://strassburger.org/discord');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(appMenuTemplate);

    Menu.setApplicationMenu(menu);
}

app.on('browser-window-focus', updateMenu);
app.on('browser-window-blur', updateMenu);