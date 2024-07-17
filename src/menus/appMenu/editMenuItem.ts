import {getFocusedWindow, isMainWindow} from "../../windowManager";
import type {MenuItemConstructorOptions} from "electron";

export default function (): MenuItemConstructorOptions {
    const focusedWindow = getFocusedWindow();

    return {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteAndMatchStyle'},
            {role: 'delete'},
            {role: 'selectAll'},
            {type: 'separator'},
            {
                label: 'Find',
                accelerator: 'CmdOrCtrl+F',
                enabled: !!focusedWindow && !isMainWindow(focusedWindow),
                click: () => {
                    getFocusedWindow()?.webContents.send("openSearch");
                }
            },
        ]
    };
}