import { Menu, type MenuItemConstructorOptions } from "electron";
import { getFocusedWindow } from "../windowManager";

export function popUpContextMenu() {
    const appMenuItem: MenuItemConstructorOptions[] = [
        {
            label: "Cut",
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "cut");
            }
        },
        {
            label: "Copy",
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "copy");
            }
        },
        {
            label: "Paste",
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "paste");
            }
        },
        { type: "separator" },
        {
            label: "Bold",
            accelerator: "CmdOrCtrl+B",
            enabled: getFocusedWindow() ? true : false,
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "bold");
            }
        },
        {
            label: "Italic",
            accelerator: "CmdOrCtrl+I",
            enabled: getFocusedWindow() ? true : false,
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "italic");
            }
        },
        {
            label: "Underline",
            accelerator: "Ctrl+CmdOrCtrl+U",
            enabled: getFocusedWindow() ? true : false,
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "underline");
            }
        },
        {
            label: "Strikethrough",
            accelerator: "Ctrl+CmdOrCtrl+S",
            enabled: getFocusedWindow() ? true : false,
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "strikethrough");
            }
        },
        {
            label: "Code",
            accelerator: "Ctrl+CmdOrCtrl+C",
            enabled: getFocusedWindow() ? true : false,
            click: () => {
                getFocusedWindow()?.webContents.send("formatEditor", "inline-code");
            }
        },
    ];

    const menu = Menu.buildFromTemplate(appMenuItem);
    menu.popup();
}