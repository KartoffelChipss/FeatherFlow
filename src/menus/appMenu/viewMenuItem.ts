import {BrowserWindow, type MenuItemConstructorOptions} from "electron";
import {getFocusedWindow, getPath, openFileInWindow, isSpecialWindow} from "../../windowManager";

export default function (): MenuItemConstructorOptions {
    const focusedWindow = getFocusedWindow();

    return {
        label: 'View',
        submenu:
            [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    enabled:  !!focusedWindow,
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
                {type: 'separator'},
                {
                    label: 'Toggle Read Mode',
                    enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                    accelerator: 'CmdOrCtrl+Alt+R',
                    click: () => {
                        getFocusedWindow()?.webContents.send("toggleReadMode");
                    }
                },
                {type: 'separator'},
                {
                    label: 'Actual size',
                    accelerator: 'CmdOrCtrl+0',
                    enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
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
                    enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
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
                    enabled:  !!focusedWindow && !isSpecialWindow(focusedWindow),
                    click: () => {
                        getFocusedWindow()?.webContents.send("changeZoom", {
                            instruction: "decrease",
                            value: 0.1,
                        });
                    }
                },
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
    }
}