import {app, MenuItemConstructorOptions, shell} from "electron";
import {getAllWindows} from "../../windowManager";
import {setTheme} from "../../theme";
import {appRoot} from "../../main";
import {getStore} from "../../store";
import {updateMenu} from "./index";

export default function (): MenuItemConstructorOptions {
    const store = getStore();

    return {
        label: app.name,
        submenu: [
            {
                role: 'about',
                label: 'About FeatherFlow'
            },
            {type: 'separator'},
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
                            },
                            {
                                label: "Auto delete line",
                                type: "checkbox",
                                checked: store.get("autoLineDelete") as boolean,
                                click: () => {
                                    store.set("autoLineDelete", !store.get("autoLineDelete"));
                                    for (const window of getAllWindows()) {
                                        window?.webContents.send("setEditorSetting", "autoLineDelete", store.get("autoLineDelete"));
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