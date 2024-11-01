import {app, MenuItemConstructorOptions, shell} from "electron";
import {openSettingsWindow} from "../../windowManager";
import {appRoot, logPath} from "../../main";
import {getStore} from "../../store";
import {checkForUpdates} from "../../updater";

export default function (): MenuItemConstructorOptions {
    const store = getStore();

    return {
        label: app.name,
        submenu: [
            {
                role: 'about',
                label: 'About FeatherFlow'
            },
            {
                label: "Check for Updates",
                click: () => {
                    checkForUpdates(true);
                }
            },
            {type: 'separator'},
            {
                label: "Settings",
                accelerator: "CmdOrCtrl+,",
                click: () => {
                    openSettingsWindow();
                }
            },
            {type: 'separator'},
            {role: 'services'},
            {
                label: "Developer",
                submenu: [
                    {
                        label: 'Open',
                        submenu: [
                            {
                                label: "App root",
                                accelerator: "CmdOrCtrl+Shift+Alt+O",
                                click: () => {
                                    shell.openPath(appRoot);
                                }
                            },
                            {
                                label: "Config file",
                                click: () => {
                                    store.openInEditor();
                                }
                            },
                            {
                                label: "Log file",
                                click: () => {
                                    shell.openPath(logPath);
                                }
                            }
                        ]
                    },
                    {role: 'toggleDevTools'},
                    {role: 'forceReload'},
                ]
            },
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideOthers'},
            {role: 'unhide'},
            {type: 'separator'},
            {
                role: 'quit',
                label: 'Quit FeatherFlow',
            }
        ]
    };
}