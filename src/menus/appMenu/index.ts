import { Menu, type MenuItemConstructorOptions } from 'electron';
import getAppMenuItem from './appMenuItem';
import getFileMenuItem from './fileMenuItem';
import getEditMenuItem from './editMenuItem';
import getViewMenuItem from './viewMenuItem';
import getWindowMenuItem from './windowMenuItem';
import getHelpMenuItem from './helpMenuItem';

export function updateMenu() {
    const appMenuTemplate: MenuItemConstructorOptions[] = [
        getAppMenuItem(),
        getFileMenuItem(),
        getEditMenuItem(),
        getViewMenuItem(),
        getWindowMenuItem(),
        getHelpMenuItem(),
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));
}
