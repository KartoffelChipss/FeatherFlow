import {app, MenuItemConstructorOptions, shell} from "electron";
import {getAllWindows, openSettingsWindow} from "../../windowManager";
import {setTheme} from "../../theme";
import {appRoot} from "../../main";
import {getStore} from "../../store";
import {updateMenu} from "./index";
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
                    checkForUpdates();
                }
            },
            {type: 'separator'},
            {
                label: "Settings",
                accelerator: "CmdOrCtrl+,",
                click: () => {
                    openSettingsWindow();
                },
                // submenu: [
                //     {
                //         label: "Theme",
                //         submenu: [
                //             {
                //                 label: "System",
                //                 type: "radio",
                //                 checked: store.get("theme") === "system",
                //                 click: () => {
                //                     setTheme("system");
                //                     updateMenu();
                //                 }
                //             },
                //             {
                //                 label: "Dark",
                //                 type: "radio",
                //                 checked: store.get("theme") === "dark",
                //                 click: () => {
                //                     setTheme("dark");
                //                     updateMenu();
                //                 }
                //             },
                //             {
                //                 label: "Light",
                //                 type: "radio",
                //                 checked: store.get("theme") === "light",
                //                 click: () => {
                //                     setTheme("light");
                //                     updateMenu();
                //                 }
                //             }
                //         ]
                //     },
                // ]
            },
            {type: 'separator'},
            {role: 'services'},
            {
                label: "Developer",
                submenu: [
                    {role: 'toggleDevTools'},
                    {role: 'forceReload'},
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