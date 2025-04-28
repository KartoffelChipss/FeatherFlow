import { Menu, type MenuItemConstructorOptions } from 'electron'
import { getFocusedWindow } from '../windowManager'

export function popUpContextMenu() {
    const appMenuItem: MenuItemConstructorOptions[] = [
        {
            label: 'Cut',
            click: () => {
                getFocusedWindow()?.webContents.send('formatEditor', 'cut')
            },
        },
        {
            label: 'Copy',
            click: () => {
                getFocusedWindow()?.webContents.send('formatEditor', 'copy')
            },
        },
        {
            label: 'Paste',
            click: () => {
                getFocusedWindow()?.webContents.send('formatEditor', 'paste')
            },
        },
    ]

    const menu = Menu.buildFromTemplate(appMenuItem)
    menu.popup()
}
